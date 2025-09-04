const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(session({
  secret: process.env.JWT_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());

async function setupRoutes() {
  const authRoutes = (await import('./routes/auth.js')).default;
  const portfolioRoutes = (await import('./routes/portfolio.js')).default;

  console.log('Registering /api/auth routes...');
  app.use('/api/auth', authRoutes);
  console.log('Registered /api/auth routes.');

  console.log('Registering /api/portfolio routes...');
  app.use('/api/portfolio', portfolioRoutes);
  console.log('Registered /api/portfolio routes.');
}

setupRoutes();

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/showwork';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error('MongoDB connection error:', err));
