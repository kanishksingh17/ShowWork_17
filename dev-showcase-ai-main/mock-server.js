import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5174'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));

app.use(express.json());

// Mock user data
let mockUser = {
  _id: "mock-user-id",
  name: "John Developer",
  email: "john@example.com",
  avatar: "",
  tagline: "Full Stack Developer",
  bio: "Passionate about building amazing web applications",
  location: "San Francisco, CA",
  website: "",
  skills: [],
  projects: [],
  profileCompleted: false, // Set to false to trigger profile setup
  onboardingStep: 0,
  username: ""
};

// Mock authentication endpoints
app.get('/api/portfolio/profile', (req, res) => {
  console.log('📡 Mock API: Profile request received');
  res.json({ 
    success: true, 
    user: mockUser 
  });
});

app.post('/api/profile/update', (req, res) => {
  console.log('📡 Mock API: Profile update request', req.body);
  
  // Update mock user with new profile data
  mockUser = {
    ...mockUser,
    ...req.body,
    profileCompleted: true,
    onboardingStep: 3
  };
  
  console.log('✅ Mock API: Profile updated', mockUser);
  
  res.json({ 
    success: true, 
    user: mockUser,
    message: 'Profile updated successfully'
  });
});

app.get('/api/dashboard/stats', (req, res) => {
  console.log('📡 Mock API: Dashboard stats request');
  res.json({
    success: true,
    data: {
      totalProjects: 5,
      runningProjects: 2,
      endedProjects: 2,
      pendingProjects: 1
    }
  });
});

app.get('/api/dashboard/projects', (req, res) => {
  console.log('📡 Mock API: Dashboard projects request');
  res.json({
    success: true,
    data: [
      {
        id: 1,
        name: "Portfolio Website",
        description: "Personal portfolio showcasing my work",
        status: "running",
        progress: 75,
        totalTasks: 10,
        completedTasks: 7
      },
      {
        id: 2,
        name: "E-commerce App",
        description: "Full-stack e-commerce application",
        status: "pending",
        progress: 30,
        totalTasks: 15,
        completedTasks: 4
      }
    ]
  });
});

// Username check endpoint
app.post('/api/check-username', (req, res) => {
  const { username } = req.body;
  console.log('📡 Mock API: Username check for:', username);
  
  // Simulate some taken usernames
  const takenUsernames = ['admin', 'user', 'test', 'demo', 'john'];
  const available = !takenUsernames.includes(username.toLowerCase());
  
  res.json({
    available,
    message: available ? 'Username is available' : 'Username is already taken'
  });
});

// Catch all other routes
app.all('*', (req, res) => {
  console.log('📡 Mock API: Unhandled request:', req.method, req.path);
  res.status(404).json({ 
    success: false, 
    message: 'Mock API endpoint not found',
    path: req.path,
    method: req.method
  });
});

app.listen(PORT, () => {
  console.log('🚀 Mock server running on http://localhost:' + PORT);
  console.log('📡 API endpoints available:');
  console.log('  - GET  /api/portfolio/profile');
  console.log('  - POST /api/profile/update');
  console.log('  - GET  /api/dashboard/stats');
  console.log('  - GET  /api/dashboard/projects'); 
  console.log('  - POST /api/check-username');
});