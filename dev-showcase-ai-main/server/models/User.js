import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Basic OAuth fields
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional for OAuth users
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  avatar: { type: String }, // Profile picture URL
  
  // Portfolio Profile fields
  username: { type: String, unique: true, sparse: true }, // For showork.com/username
  tagline: { type: String, default: '' },
  bio: { type: String, default: '' },
  location: { type: String, default: '' },
  website: { type: String, default: '' },
  
  // Social Links
  socials: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    github: { type: String, default: '' },
    instagram: { type: String, default: '' },
    youtube: { type: String, default: '' }
  },
  
  // Skills & Quiz Results
  skills: [{
    name: { type: String, required: true }, // e.g., "HTML", "CSS", "JavaScript"
    percentage: { type: Number, required: true, min: 0, max: 100 },
    category: { type: String, default: 'programming' }, // programming, design, soft-skills
    lastUpdated: { type: Date, default: Date.now }
  }],
  
  // Achievements & Certifications
  achievements: [{
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, default: Date.now },
    type: { type: String, enum: ['certification', 'award', 'achievement'], default: 'achievement' },
    issuer: { type: String },
    url: { type: String }
  }],
  
  // Projects
  projects: [{
    title: { type: String, required: true },
    description: { type: String },
    technologies: [String],
    githubUrl: { type: String },
    liveUrl: { type: String },
    image: { type: String }, // Project screenshot URL
    featured: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  }],
  
  // Portfolio Settings
  portfolioSettings: {
    template: { type: String, default: 'default' },
    customDomain: { type: String, default: '' },
    showBranding: { type: Boolean, default: true },
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#1F2937' }
  },
  
  // Subscription & Billing
  subscription: {
    plan: { type: String, enum: ['free', 'pro', 'enterprise'], default: 'free' },
    stripeCustomerId: { type: String },
    stripeSubscriptionId: { type: String },
    currentPeriodEnd: { type: Date },
    features: [String] // Available features based on plan
  },
  
  // Profile Completion
  profileCompleted: { type: Boolean, default: false },
  onboardingStep: { type: Number, default: 0 }, // 0: not started, 1: profile, 2: skills, 3: projects
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update timestamps on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Generate username from name if not provided
userSchema.pre('save', function(next) {
  if (!this.username && this.name) {
    this.username = this.name.toLowerCase().replace(/[^a-z0-9]/g, '') + Math.random().toString(36).substr(2, 5);
  }
  next();
});

export default mongoose.model('User', userSchema);
