import express from 'express';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Reminder from '../models/Reminder.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to check authentication
const requireAuth = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ success: false, message: 'Authentication required' });
  }
  next();
};

// GET /api/dashboard/stats - Get dashboard statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get project statistics
    const stats = await Project.getDashboardStats(userId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: error.message
    });
  }
});

// GET /api/dashboard/projects - Get all projects for the user
router.get('/projects', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { status, limit = 10, offset = 0 } = req.query;
    
    // Build query filter
    const filter = { owner: userId };
    if (status) {
      filter.status = status;
    }
    
    const projects = await Project.find(filter)
      .populate('teamMembers', 'name email avatar')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset))
      .exec();
    
    const total = await Project.countDocuments(filter);
    
    res.json({
      success: true,
      data: projects,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < total
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects',
      error: error.message
    });
  }
});

// GET /api/dashboard/reminders - Get upcoming reminders
router.get('/reminders', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { limit = 5 } = req.query;
    
    const reminders = await Reminder.getUpcomingReminders(userId, parseInt(limit));
    
    res.json({
      success: true,
      data: reminders
    });
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reminders',
      error: error.message
    });
  }
});

// GET /api/dashboard/team - Get team members
router.get('/team', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get unique team members from user's projects
    const projects = await Project.find({ owner: userId })
      .populate('teamMembers', 'name email avatar')
      .exec();
    
    // Extract unique team members
    const teamMembersSet = new Set();
    const teamMembers = [];
    
    projects.forEach(project => {
      project.teamMembers.forEach(member => {
        if (!teamMembersSet.has(member._id.toString())) {
          teamMembersSet.add(member._id.toString());
          teamMembers.push({
            _id: member._id,
            name: member.name,
            email: member.email,
            avatar: member.avatar
          });
        }
      });
    });
    
    res.json({
      success: true,
      data: teamMembers
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch team members',
      error: error.message
    });
  }
});

// POST /api/dashboard/projects - Create a new project
router.post('/projects', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const {
      name,
      description,
      status = 'pending',
      dueDate,
      totalTasks = 0,
      teamMembers = [],
      priority = 'medium',
      tags = [],
      budget = 0
    } = req.body;
    
    // Validate required fields
    if (!name || name.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Project name is required'
      });
    }
    
    // Create new project
    const project = new Project({
      name: name.trim(),
      description,
      status,
      dueDate: dueDate ? new Date(dueDate) : null,
      totalTasks,
      teamMembers,
      owner: userId,
      priority,
      tags,
      budget
    });
    
    await project.save();
    
    // Populate team members for response
    await project.populate('teamMembers', 'name email avatar');
    
    res.status(201).json({
      success: true,
      data: project,
      message: 'Project created successfully'
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error.message
    });
  }
});

// PUT /api/dashboard/projects/:id - Update a project
router.put('/projects/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const projectId = req.params.id;
    const updateData = req.body;
    
    // Find project and verify ownership
    const project = await Project.findOne({ _id: projectId, owner: userId });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }
    
    // Update project
    Object.assign(project, updateData);
    await project.save();
    
    // Populate team members for response
    await project.populate('teamMembers', 'name email avatar');
    
    res.json({
      success: true,
      data: project,
      message: 'Project updated successfully'
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project',
      error: error.message
    });
  }
});

// DELETE /api/dashboard/projects/:id - Delete a project
router.delete('/projects/:id', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const projectId = req.params.id;
    
    // Find and delete project
    const project = await Project.findOneAndDelete({ _id: projectId, owner: userId });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found or access denied'
      });
    }
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project',
      error: error.message
    });
  }
});

// GET /api/dashboard/analytics - Get project analytics data
router.get('/analytics', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Get projects by status for analytics
    const analytics = await Project.aggregate([
      { $match: { owner: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalTasks: { $sum: '$totalTasks' },
          completedTasks: { $sum: '$completedTasks' },
          totalBudget: { $sum: '$budget' }
        }
      }
    ]);
    
    // Get recent project activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentActivity = await Project.find({
      owner: userId,
      updatedAt: { $gte: thirtyDaysAgo }
    }).sort({ updatedAt: -1 }).limit(10);
    
    res.json({
      success: true,
      data: {
        statusBreakdown: analytics,
        recentActivity,
        summary: {
          totalProjects: analytics.reduce((sum, item) => sum + item.count, 0),
          totalTasks: analytics.reduce((sum, item) => sum + item.totalTasks, 0),
          completedTasks: analytics.reduce((sum, item) => sum + item.completedTasks, 0),
          totalBudget: analytics.reduce((sum, item) => sum + item.totalBudget, 0)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
      error: error.message
    });
  }
});

export default router;