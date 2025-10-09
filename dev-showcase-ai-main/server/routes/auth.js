import express from 'express';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = express.Router();

// Passport Local Strategy
passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  if (!name || !email || !password) {
    return res.status(400).json({ 
      success: false,
      message: 'Name, email, and password are required' 
    });
  }
  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ 
      success: false,
      message: 'Email already exists' 
    });
  }
  
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  
  res.status(201).json({ 
    success: true,
    message: 'User registered successfully' 
  });
}));

// Login
router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ success: true, message: 'Logged in successfully', user: { name: req.user.name, email: req.user.email, _id: req.user._id } });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Logout failed' });
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Session destroy error:', err);
        return res.status(500).json({ message: 'Failed to destroy session' });
      }
      res.clearCookie('connect.sid'); // Clear session cookie
      res.json({ success: true, message: 'Logged out successfully' });
    });
  });
});

// Get current user
router.get('/me', asyncHandler(async (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ 
      success: true, 
      user: { 
        _id: req.user._id,
        name: req.user.name, 
        email: req.user.email,
        username: req.user.username,
        avatar: req.user.avatar,
        profileCompleted: req.user.profileCompleted
      } 
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Not authenticated' 
    });
  }
}));

// Health check
router.get('/health', async (req, res) => {
  try {
    await User.findOne();
    res.json({ status: 'ok', mongo: true });
  } catch (err) {
    console.error('Health check error:', err);
    res.status(500).json({ status: 'error', error: err?.message || err });
  }
});

export default router;
