import express from 'express';
import User from '../models/User.js';
import Skill from '../models/Skill.js';
import QuizAttempt from '../models/QuizAttempt.js';

const router = express.Router();

// Middleware to check if user is authenticated
const requireAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Authentication required' });
};

// Get user's portfolio data
router.get('/profile', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password -googleId -githubId -stripeCustomerId -stripeSubscriptionId');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      success: true,
      user,
      portfolioUrl: `http://localhost:3000/${user.username}`
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', requireAuth, async (req, res) => {
  try {
    const {
      tagline,
      bio,
      location,
      website,
      socials,
      portfolioSettings
    } = req.body;
    
    const updateData = {};
    if (tagline !== undefined) updateData.tagline = tagline;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (website !== undefined) updateData.website = website;
    if (socials !== undefined) updateData.socials = socials;
    if (portfolioSettings !== undefined) updateData.portfolioSettings = portfolioSettings;
    
    // Mark profile as completed if basic info is provided
    if (tagline && bio) {
      updateData.profileCompleted = true;
      updateData.onboardingStep = Math.max(req.user.onboardingStep, 1);
    }
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -googleId -githubId -stripeCustomerId -stripeSubscriptionId');
    
    res.json({
      success: true,
      user,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Get available skills for quiz
router.get('/skills', requireAuth, async (req, res) => {
  try {
    const skills = await Skill.find({ isActive: true })
      .select('name displayName category description icon color totalQuestions timeLimit');
    
    res.json({
      success: true,
      skills
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({ error: 'Failed to fetch skills' });
  }
});

// Start a skill quiz
router.post('/quiz/start/:skillName', requireAuth, async (req, res) => {
  try {
    const { skillName } = req.params;
    const skill = await Skill.findOne({ name: skillName, isActive: true });
    
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    // Check if user already has a recent attempt
    const existingAttempt = await QuizAttempt.findOne({
      userId: req.user._id,
      skillId: skill._id,
      status: 'in-progress'
    });
    
    if (existingAttempt) {
      return res.json({
        success: true,
        attemptId: existingAttempt._id,
        skill: {
          name: skill.name,
          displayName: skill.displayName,
          totalQuestions: skill.totalQuestions,
          timeLimit: skill.timeLimit
        },
        questions: skill.questions.map(q => ({
          question: q.question,
          options: q.options,
          difficulty: q.difficulty
        }))
      });
    }
    
    // Create new attempt
    const attempt = new QuizAttempt({
      userId: req.user._id,
      skillId: skill._id,
      skillName: skill.name,
      totalQuestions: skill.totalQuestions,
      startTime: new Date(),
      status: 'in-progress'
    });
    
    await attempt.save();
    
    res.json({
      success: true,
      attemptId: attempt._id,
      skill: {
        name: skill.name,
        displayName: skill.displayName,
        totalQuestions: skill.totalQuestions,
        timeLimit: skill.timeLimit
      },
      questions: skill.questions.map(q => ({
        question: q.question,
        options: q.options,
        difficulty: q.difficulty
      }))
    });
  } catch (error) {
    console.error('Error starting quiz:', error);
    res.status(500).json({ error: 'Failed to start quiz' });
  }
});

// Submit quiz answers
router.post('/quiz/submit/:attemptId', requireAuth, async (req, res) => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;
    
    const attempt = await QuizAttempt.findOne({
      _id: attemptId,
      userId: req.user._id,
      status: 'in-progress'
    });
    
    if (!attempt) {
      return res.status(404).json({ error: 'Quiz attempt not found' });
    }
    
    const skill = await Skill.findById(attempt.skillId);
    if (!skill) {
      return res.status(404).json({ error: 'Skill not found' });
    }
    
    // Process answers
    const processedAnswers = answers.map((answer, index) => {
      const question = skill.questions[index];
      const isCorrect = answer.userAnswer === question.correctAnswer;
      
      return {
        questionIndex: index,
        userAnswer: answer.userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        timeSpent: answer.timeSpent || 0,
        points: isCorrect ? question.points : 0
      };
    });
    
    // Update attempt
    attempt.answers = processedAnswers;
    attempt.endTime = new Date();
    attempt.status = 'completed';
    
    await attempt.save();
    
    // Update user skills
    const correctAnswers = processedAnswers.filter(a => a.isCorrect).length;
    const score = Math.round((correctAnswers / skill.totalQuestions) * 100);
    
    // Find existing skill or create new one
    const existingSkillIndex = req.user.skills.findIndex(s => s.name === skill.name);
    
    if (existingSkillIndex >= 0) {
      // Update existing skill score (average of all attempts)
      const allAttempts = await QuizAttempt.find({
        userId: req.user._id,
        skillId: skill._id,
        status: 'completed'
      });
      
      const averageScore = Math.round(
        allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length
      );
      
      req.user.skills[existingSkillIndex].percentage = averageScore;
      req.user.skills[existingSkillIndex].lastUpdated = new Date();
    } else {
      // Add new skill
      req.user.skills.push({
        name: skill.name,
        percentage: score,
        category: skill.category,
        lastUpdated: new Date()
      });
    }
    
    // Update onboarding step
    req.user.onboardingStep = Math.max(req.user.onboardingStep, 2);
    
    await req.user.save();
    
    res.json({
      success: true,
      score,
      correctAnswers,
      totalQuestions: skill.totalQuestions,
      passed: score >= skill.passingScore,
      message: 'Quiz completed successfully'
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ error: 'Failed to submit quiz' });
  }
});

// Get user's skill results
router.get('/skills/results', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('skills');
    
    res.json({
      success: true,
      skills: user.skills
    });
  } catch (error) {
    console.error('Error fetching skill results:', error);
    res.status(500).json({ error: 'Failed to fetch skill results' });
  }
});

// Add/Update project
router.post('/projects', requireAuth, async (req, res) => {
  try {
    const {
      title,
      description,
      technologies,
      githubUrl,
      liveUrl,
      image,
      featured
    } = req.body;
    
    const project = {
      title,
      description,
      technologies: technologies || [],
      githubUrl,
      liveUrl,
      image,
      featured: featured || false
    };
    
    req.user.projects.push(project);
    req.user.onboardingStep = Math.max(req.user.onboardingStep, 3);
    
    await req.user.save();
    
    res.json({
      success: true,
      project,
      message: 'Project added successfully'
    });
  } catch (error) {
    console.error('Error adding project:', error);
    res.status(500).json({ error: 'Failed to add project' });
  }
});

// Get public portfolio by username
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username })
      .select('name tagline bio avatar location website socials skills achievements projects portfolioSettings');
    
    if (!user) {
      return res.status(404).json({ error: 'Portfolio not found' });
    }
    
    res.json({
      success: true,
      portfolio: user
    });
  } catch (error) {
    console.error('Error fetching portfolio:', error);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

export default router;
