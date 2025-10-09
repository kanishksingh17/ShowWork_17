import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import session from 'express-session';
import passport from 'passport';
import GoogleStrategy from 'passport-google-oauth20';
import GitHubStrategy from 'passport-github2';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import error handling middleware
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { asyncHandler } from './utils/asyncHandler.js';
import { validateEnvironment, getEnvConfig } from './config/env.js';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set environment variables directly (hardcoded for now to ensure they work)
process.env.GOOGLE_CLIENT_ID = '1023704543857-3ncqko6crdtn9g1p4q0p9j19jd4alo77.apps.googleusercontent.com';
process.env.GOOGLE_CLIENT_SECRET = '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';
process.env.GITHUB_CLIENT_ID = 'Ov23lieCxcgF7AFq4uVZ';
process.env.GITHUB_CLIENT_SECRET = '47ea179ee6f940bce9fbff8ccf696ee225074b93';
process.env.PORT = '5001';
process.env.SESSION_SECRET = 'your-super-secret-session-key-change-this';
process.env.MONGO_URI = 'mongodb://localhost:27017/showwork';
process.env.JWT_SECRET = 'your-jwt-secret-key-change-this';

// Validate environment variables
if (!validateEnvironment()) {
  console.error('❌ Environment validation failed. Exiting...');
  process.exit(1);
}

const config = getEnvConfig();
console.log('✅ Environment configuration loaded');

// Import local modules
import User from './models/User.js';
import authRoutes from './routes/auth.js';
import portfolioRoutes from './routes/portfolio.js';
import dashboardRoutes from './routes/dashboard.js';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie']
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: true,
  saveUninitialized: true,
  cookie: { 
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    sameSite: 'lax'
  }
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth Strategy
try {
  passport.use(new GoogleStrategy.Strategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5001/api/auth/google/callback"
    },
    async function(accessToken, refreshToken, profile, cb) {
      try {
        console.log('Google OAuth callback - profile:', profile.id);
        console.log('User email:', profile.emails[0].value);
        
        // Check if user exists by googleId first
        let user = await User.findOne({ googleId: profile.id });
        
        if (!user) {
          // If no user with googleId, check by email
          user = await User.findOne({ email: profile.emails[0].value });
          
          if (user) {
            // Update existing user with googleId
            user.googleId = profile.id;
            user.avatar = profile.photos[0]?.value;
            await user.save();
            console.log('Existing user updated with Google ID:', user.name);
          } else {
            // Create new user
            user = new User({
              googleId: profile.id,
              name: profile.displayName,
              email: profile.emails[0].value,
              avatar: profile.photos[0]?.value
            });
            await user.save();
            console.log('New user created:', user.name);
          }
        } else {
          console.log('Existing Google user found:', user.name);
        }
        
        return cb(null, user);
      } catch (error) {
        console.error('OAuth callback error:', error);
        return cb(error, null);
      }
    }
  ));
  console.log('✅ Google OAuth strategy configured successfully');
} catch (error) {
  console.error('❌ Error configuring Google OAuth strategy:', error);
}

// Passport GitHub OAuth Strategy
try {
  passport.use(new GitHubStrategy.Strategy({
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5001/api/auth/github/callback"
    },
    async function(accessToken, refreshToken, profile, cb) {
      try {
        console.log('GitHub OAuth callback - profile:', profile.id);
        console.log('User email:', profile.emails?.[0]?.value || 'No email');
        
        // Check if user exists by githubId first
        let user = await User.findOne({ githubId: profile.id });
        
        if (!user) {
          // If no user with githubId, check by email
          if (profile.emails?.[0]?.value) {
            user = await User.findOne({ email: profile.emails[0].value });
          }
          
          if (user) {
            // Update existing user with githubId
            user.githubId = profile.id;
            user.avatar = profile.photos?.[0]?.value;
            await user.save();
            console.log('Existing user updated with GitHub ID:', user.name);
          } else {
            // Create new user
            user = new User({
              githubId: profile.id,
              name: profile.displayName || profile.username,
              email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
              avatar: profile.photos?.[0]?.value
            });
            await user.save();
            console.log('New GitHub user created:', user.name);
          }
        } else {
          console.log('Existing GitHub user found:', user.name);
        }
        
        return cb(null, user);
      } catch (error) {
        console.error('GitHub OAuth callback error:', error);
        return cb(error, null);
      }
    }
  ));
  console.log('✅ GitHub OAuth strategy configured successfully');
} catch (error) {
  console.error('❌ Error configuring GitHub OAuth strategy:', error);
}

// Passport serialize/deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// Debug routes for testing
app.get('/api/debug/session', (req, res) => {
  console.log('Session data:', req.session);
  res.json({
    session: req.session,
    user: req.user,
    isAuthenticated: req.isAuthenticated()
  });
});

// Debug OAuth flow
app.get('/api/debug/oauth-flow', (req, res) => {
  res.json({
    message: 'OAuth flow debug',
    session: req.session,
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
    cookies: req.headers.cookie
  });
});

app.get('/api/debug/oauth-status', (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set',
    githubClientId: process.env.GITHUB_CLIENT_ID ? 'Set' : 'Not set',
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET ? 'Set' : 'Not set',
    googleCallbackUrl: "http://localhost:5001/api/auth/google/callback",
    githubCallbackUrl: "http://localhost:5001/api/auth/github/callback",
    frontendUrl: "http://localhost:3000",
    backendPort: PORT,
    mongoUri: MONGO_URI ? 'Set' : 'Not set'
  });
});

// Test route to simulate OAuth success
app.get('/api/test/oauth-success', (req, res) => {
  // Create a mock user for testing
  const mockUser = {
    _id: 'test-user-id',
    googleId: 'test-google-id',
    name: 'Test User',
    email: 'test@example.com'
  };
  
  req.login(mockUser, (err) => {
    if (err) {
      return res.status(500).json({ error: 'Login failed', details: err.message });
    }
    res.json({ 
      message: 'Test login successful', 
      user: mockUser,
      session: req.session 
    });
  });
});

// Google OAuth routes
app.get('/api/auth/google',
  (req, res, next) => {
    try {
      console.log('Google OAuth initiated');
      console.log('Client ID:', process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Missing');
      next();
    } catch (error) {
      console.error('OAuth initiation error:', error);
      res.status(500).json({ error: 'OAuth initiation failed', details: error.message });
    }
  },
  (req, res, next) => {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
  }
);

app.get('/api/auth/google/callback', 
  (req, res, next) => {
    console.log('Google OAuth callback received');
    console.log('Query params:', req.query);
    next();
  },
  passport.authenticate('google', { 
    failureRedirect: 'http://localhost:3000/login',
    failureMessage: true
  }),
  (req, res) => {
    console.log('OAuth successful, user:', req.user);
    console.log('Session after OAuth:', req.session);
    console.log('User authenticated:', req.isAuthenticated());
    
    // Ensure session is saved before redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
      console.log('Session saved, redirecting to dashboard');
      // Successful authentication, redirect to main dashboard
      res.redirect('http://localhost:3000/dashboard');
    });
  }
);

// GitHub OAuth routes
app.get('/api/auth/github',
  (req, res, next) => {
    try {
      console.log('GitHub OAuth initiated');
      console.log('Client ID:', process.env.GITHUB_CLIENT_ID ? 'Set' : 'Missing');
      next();
    } catch (error) {
      console.error('GitHub OAuth initiation error:', error);
      res.status(500).json({ error: 'GitHub OAuth initiation failed', details: error.message });
    }
  },
  (req, res, next) => {
    passport.authenticate('github', { scope: ['user:email'] })(req, res, next);
  }
);

app.get('/api/auth/github/callback', 
  (req, res, next) => {
    console.log('GitHub OAuth callback received');
    console.log('Query params:', req.query);
    next();
  },
  passport.authenticate('github', { 
    failureRedirect: 'http://localhost:3000/login',
    failureMessage: true
  }),
  (req, res) => {
    console.log('GitHub OAuth successful, user:', req.user);
    console.log('Session after GitHub OAuth:', req.session);
    console.log('User authenticated:', req.isAuthenticated());
    
    // Ensure session is saved before redirect
    req.session.save((err) => {
      if (err) {
        console.error('Session save error:', err);
      }
      console.log('Session saved, redirecting to dashboard');
      // Successful authentication, redirect to main dashboard
      res.redirect('http://localhost:3000/dashboard');
    });
  }
);

// Logout route
app.get('/api/auth/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: 'Logout error' });
    }
    res.redirect('http://localhost:3000/');
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'ShowWork Server is running!',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Username availability checking endpoint
app.post('/api/check-username', async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ 
        available: false, 
        message: 'Username is required' 
      });
    }
    
    // Validate username format
    if (username.length < 3) {
      return res.status(400).json({ 
        available: false, 
        message: 'Username must be at least 3 characters' 
      });
    }
    
    if (username.length > 20) {
      return res.status(400).json({ 
        available: false, 
        message: 'Username must be less than 20 characters' 
      });
    }
    
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return res.status(400).json({ 
        available: false, 
        message: 'Username can only contain letters, numbers, underscore and dash' 
      });
    }
    
    if (/^[0-9]/.test(username)) {
      return res.status(400).json({ 
        available: false, 
        message: 'Username cannot start with a number' 
      });
    }
    
    // Reserved usernames
    const reservedUsernames = [
      'admin', 'api', 'www', 'mail', 'ftp', 'localhost', 'test', 'demo',
      'root', 'user', 'guest', 'anonymous', 'showwork', 'portfolio',
      'dashboard', 'profile', 'settings', 'auth', 'login', 'register',
      'signup', 'signin', 'help', 'support', 'contact', 'about', 'terms',
      'privacy', 'blog', 'news', 'docs', 'documentation', 'app', 'mobile'
    ];
    
    if (reservedUsernames.includes(username.toLowerCase())) {
      return res.status(400).json({ 
        available: false, 
        message: 'This username is reserved' 
      });
    }
    
    // Check if username exists in database
    // If user is authenticated, exclude their own username from the check
    const query = { username: { $regex: new RegExp('^' + username + '$', 'i') } };
    if (req.isAuthenticated() && req.user._id) {
      query._id = { $ne: req.user._id };
    }
    
    const existingUser = await User.findOne(query);
    
    if (existingUser) {
      return res.json({ 
        available: false, 
        message: 'Username is already taken' 
      });
    }
    
    // Username is available
    return res.json({ 
      available: true, 
      message: 'Username is available!' 
    });
    
  } catch (error) {
    console.error('Username check error:', error);
    return res.status(500).json({ 
      available: false, 
      message: 'Error checking username availability' 
    });
  }
});

// Update user profile with username
app.post('/api/profile/update', async (req, res) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ 
        success: false,
        message: 'Not authenticated. Please log in to update your profile.' 
      });
    }
    
    const { username, fullName, bio, profilePicture } = req.body;
    const userId = req.user._id;
    
    // Validate required fields
    if (!username || !fullName) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and full name are required' 
      });
    }
    
    // Double-check username availability before saving
    if (username) {
      // Validate username format server-side
      if (username.length < 3) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username must be at least 3 characters' 
        });
      }
      
      if (username.length > 20) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username must be less than 20 characters' 
        });
      }
      
      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username can only contain letters, numbers, underscore and dash' 
        });
      }
      
      if (/^[0-9]/.test(username)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username cannot start with a number' 
        });
      }
      
      // Check if username is taken by another user
      const existingUser = await User.findOne({ 
        username: { $regex: new RegExp('^' + username + '$', 'i') },
        _id: { $ne: userId } // Exclude current user
      });
      
      if (existingUser) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username is already taken. Please choose a different one.' 
        });
      }
    }
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        username: username,
        name: fullName,
        bio: bio,
        avatar: profilePicture,
        profileCompleted: true,
        updatedAt: new Date()
      },
      { new: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    return res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: updatedUser
    });
    
  } catch (error) {
    console.error('Profile update error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again.' 
    });
  }
});



// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/showwork';

// Try to connect to MongoDB, but start server even if it fails
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    startServer();
  })
  .catch(err => {
    console.warn('⚠️ MongoDB connection failed, but starting server anyway...');
    console.warn('Error:', err.message);
    console.warn('You can still test OAuth flows, but database operations will fail');
    startServer();
  });

function startServer() {
  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`🔗 Frontend should connect to: http://localhost:3001`);
    console.log(`📱 Test OAuth: http://localhost:${PORT}/api/auth/google`);
  });

  // Handle server errors
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use!`);
      console.error('Please stop any other servers using this port.');
    } else {
      console.error('❌ Server error:', error);
    }
  });

  // Handle process termination gracefully
  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM - Server will continue running');
    console.log('💡 To stop the server, use Ctrl+C or close the terminal');
  });

  // Keep the process alive and prevent automatic shutdown
  console.log('🔒 Server process will stay running until manually stopped');
  console.log('💡 Press Ctrl+C twice to stop the server');
  
  // Keep-alive mechanism
  const keepAlive = setInterval(() => {
    // This keeps the event loop active
  }, 1000);
  
  // Clean up keep-alive on actual shutdown
  const shutdown = () => {
    clearInterval(keepAlive);
    server.close(() => {
      console.log('✅ Server closed');
      process.exit(0);
    });
  };
  
  // Only shutdown on double Ctrl+C
  let shutdownAttempts = 0;
  process.on('SIGINT', () => {
    shutdownAttempts++;
    if (shutdownAttempts === 1) {
      console.log('\n🛑 First Ctrl+C detected - Server will continue running');
      console.log('💡 Press Ctrl+C again within 3 seconds to actually stop the server');
      setTimeout(() => {
        shutdownAttempts = 0;
      }, 3000);
    } else if (shutdownAttempts === 2) {
      console.log('\n🛑 Second Ctrl+C detected - Shutting down server...');
      shutdown();
    }
  });

  // Enhanced error handling for uncaught exceptions - keep server running
  process.on('uncaughtException', (error) => {
    console.error('🚨 Uncaught Exception:', error);
    console.error('Stack:', error.stack);
    console.log('🔄 Server will continue running despite this error');
    console.log('💡 Please investigate and fix this issue when possible');
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('🚨 Unhandled Rejection at:', promise);
    console.error('Reason:', reason);
    console.log('🔄 Server will continue running despite this error');
    console.log('💡 Please investigate and fix this issue when possible');
  });
}
