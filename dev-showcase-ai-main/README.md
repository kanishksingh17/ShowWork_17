# 🚀 ShowWork - Personalized Portfolio Generator SaaS

**ShowWork** is a comprehensive SaaS platform that helps developers and professionals create stunning, personalized portfolios through skill assessments, automated generation, and customization options.

## ✨ Features

### 🔐 **Authentication & User Management**
- **OAuth Integration**: Google & GitHub login
- **User Profiles**: Complete profile setup with bio, tagline, and social links
- **Session Management**: Secure user sessions with Passport.js

### 🧠 **Skill Assessment System**
- **Interactive Quizzes**: 10-question assessments for various skills
- **Skill Categories**: Programming, Design, Soft Skills, Tools
- **Progress Tracking**: Individual skill percentages and improvement tracking
- **Difficulty Levels**: Easy, Medium, Hard questions with point system

### 🎨 **Portfolio Generation**
- **Auto-Generated Portfolios**: `showwork.com/username` format
- **Multiple Templates**: Free and premium portfolio templates
- **Customization**: Colors, layouts, and branding options
- **Responsive Design**: Mobile-first, modern UI components

### 📊 **Portfolio Sections**
- **About Me**: Profile picture, bio, tagline, location
- **Skill Graph**: Visual representation of skill percentages
- **Projects**: GitHub integration, live demos, screenshots
- **Achievements**: Certifications, awards, and accomplishments
- **Social Links**: LinkedIn, Twitter, GitHub, Instagram, YouTube

### 💰 **Subscription Plans**
- **Free Plan**: Basic template, ShowWork branding
- **Pro Plan**: Premium templates, custom colors, no branding
- **Enterprise**: Custom domains, analytics, priority support

## 🛠️ Tech Stack

### **Frontend**
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation

### **Backend**
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Passport.js** for authentication
- **Express Sessions** for session management
- **CORS** enabled for cross-origin requests

### **Authentication**
- **Google OAuth 2.0** integration
- **GitHub OAuth** integration
- **JWT** for secure token management

### **Database Models**
- **User**: Complete user profiles and portfolio data
- **Skill**: Skill definitions and quiz questions
- **QuizAttempt**: User quiz results and progress tracking

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ 
- MongoDB 5+
- Google Cloud Console account
- GitHub Developer account

### **1. Clone & Install**
```bash
git clone <repository-url>
cd dev-showcase-ai-main
npm install
```

### **2. Environment Setup**
Create a `.env` file in the root directory:
```env
# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret

# Server Configuration
PORT=5000
SESSION_SECRET=your_super_secret_session_key
MONGO_URI=mongodb://localhost:27017/showwork
JWT_SECRET=your_jwt_secret_key
```

### **3. Database Setup**
```bash
# Start MongoDB (if not running)
mongod

# Seed the database with skills and questions
npm run seed
```

### **4. Start Development Servers**
```bash
# Terminal 1: Start Backend
npm run server

# Terminal 2: Start Frontend
npm run dev
```

### **5. Access the Application**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Portfolio Example**: http://localhost:3000/username

## 🔧 API Endpoints

### **Authentication**
- `POST /api/auth/google` - Google OAuth login
- `POST /api/auth/github` - GitHub OAuth login
- `GET /api/auth/logout` - User logout

### **Portfolio Management**
- `GET /api/portfolio/profile` - Get user profile
- `PUT /api/portfolio/profile` - Update user profile
- `GET /api/portfolio/skills` - Get available skills
- `POST /api/portfolio/quiz/start/:skillName` - Start skill quiz
- `POST /api/portfolio/quiz/submit/:attemptId` - Submit quiz answers
- `GET /api/portfolio/skills/results` - Get user skill results
- `POST /api/portfolio/projects` - Add/update project
- `GET /api/portfolio/:username` - Get public portfolio

### **Debug & Testing**
- `GET /api/debug/oauth-status` - Check OAuth configuration
- `GET /api/debug/session` - View session data

## 📚 Database Schema

### **User Model**
```javascript
{
  // Basic Info
  name, email, avatar, username
  
  // Portfolio
  tagline, bio, location, website
  socials: { linkedin, twitter, github, instagram, youtube }
  
  // Skills & Assessment
  skills: [{ name, percentage, category, lastUpdated }]
  
  // Content
  achievements: [{ title, description, date, type, issuer }]
  projects: [{ title, description, technologies, githubUrl, liveUrl }]
  
  // Settings
  portfolioSettings: { template, customDomain, showBranding, colors }
  subscription: { plan, stripeCustomerId, features }
  
  // Progress
  profileCompleted, onboardingStep
}
```

### **Skill Model**
```javascript
{
  name, displayName, category, description, icon, color
  questions: [{ question, options, correctAnswer, explanation, difficulty, points }]
  totalQuestions, timeLimit, passingScore
  easyQuestions, mediumQuestions, hardQuestions
  isActive, version, statistics
}
```

### **QuizAttempt Model**
```javascript
{
  userId, skillId, skillName
  score, totalQuestions, correctAnswers, incorrectAnswers
  answers: [{ questionIndex, userAnswer, correctAnswer, isCorrect, timeSpent }]
  startTime, endTime, totalTime, status, passed
  attemptNumber, metadata
}
```

## 🎯 User Flow

### **1. Authentication**
- User signs in with Google or GitHub
- OAuth callback creates/updates user profile
- Redirect to onboarding dashboard

### **2. Profile Setup (Compulsory)**
- Upload profile picture
- Add name, tagline, and bio
- Configure social media links
- Set location and website

### **3. Skill Assessment**
- Choose skills to assess (HTML, CSS, JavaScript, etc.)
- Complete 10-question quizzes
- View skill percentages and progress
- Retake quizzes to improve scores

### **4. Portfolio Building**
- Add projects with descriptions and links
- Upload project screenshots
- Set featured projects
- Customize portfolio appearance

### **5. Portfolio Sharing**
- Get unique URL: `showwork.com/username`
- Share on social media and resumes
- Track portfolio views and engagement

## 🎨 Portfolio Templates

### **Free Templates**
- **Minimal**: Clean, professional design
- **Modern**: Contemporary layout with gradients
- **Classic**: Traditional portfolio style

### **Premium Templates**
- **Creative**: Artistic and unique designs
- **Corporate**: Business-focused layouts
- **Developer**: Code-themed portfolios
- **Designer**: Visual and creative layouts

## 🔒 Security Features

- **OAuth 2.0** secure authentication
- **Session management** with secure cookies
- **CORS** protection for cross-origin requests
- **Input validation** and sanitization
- **Rate limiting** on API endpoints
- **Secure headers** and HTTPS enforcement

## 🚀 Deployment

### **Production Environment**
```bash
# Build frontend
npm run build

# Set production environment variables
NODE_ENV=production
MONGO_URI=your_production_mongodb_uri
SESSION_SECRET=your_production_session_secret

# Start production server
npm run server
```

### **Environment Variables**
- `NODE_ENV`: Set to 'production' for production
- `MONGO_URI`: Production MongoDB connection string
- `SESSION_SECRET`: Strong session secret
- `GOOGLE_CLIENT_ID/SECRET`: Production OAuth credentials
- `GITHUB_CLIENT_ID/SECRET`: Production OAuth credentials

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check this README and code comments
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Discussions**: Join community discussions on GitHub

## 🎉 Acknowledgments

- **OAuth Providers**: Google & GitHub for authentication
- **UI Libraries**: Shadcn/ui, Tailwind CSS
- **Icons**: Various icon libraries and contributors
- **Community**: All contributors and users of ShowWork

---

**ShowWork** - Where Skills Meet Portfolios! 🚀✨
