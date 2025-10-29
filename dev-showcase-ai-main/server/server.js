import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import { RedisStore } from "connect-redis";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import GitHubStrategy from "passport-github2";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Import error handling middleware
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { asyncHandler } from "./utils/asyncHandler.js";
import { validateEnvironment, getEnvConfig } from "./config/env.js";
import { securityConfig, getEnvironmentConfig } from "./config/security.js";
import { redis } from "../src/lib/queue/index.js";

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env files
dotenv.config();

// Validate environment variables
if (!validateEnvironment()) {
  console.error("❌ Environment validation failed. Exiting...");
  process.exit(1);
}

const config = getEnvConfig();
console.log("✅ Environment configuration loaded");

// Import local modules
import User from "./models/User.js";
import authRoutes from "./routes/auth.js";
import portfolioRoutes from "./routes/portfolio.js";
import dashboardRoutes from "./routes/dashboard.js";

const app = express();

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/showwork";

console.log("🔒 MongoDB Atlas detected - using TLS (MongoDB Driver v6+)");

// Get environment configuration
const envConfig = getEnvironmentConfig();

// Middleware
app.use(cors(securityConfig.cors));

// Security middleware
app.use(helmet(securityConfig.helmet));

// Rate limiting
const limiter = rateLimit(securityConfig.rateLimit);
app.use(limiter);

// Stricter rate limiting for auth endpoints
const authLimiter = rateLimit(securityConfig.authRateLimit);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration with Redis store
app.use(
  session({
    store: new RedisStore({ client: redis }),
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    name: "showwork.sid",
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Authentication middleware
const authenticateUser = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ 
    success: false, 
    error: "Authentication required",
    message: "Please log in to access this resource"
  });
};

// Optional authentication middleware (for routes that work with or without auth)
const optionalAuth = (req, res, next) => {
  // Just pass through, let individual routes handle auth requirements
  next();
};

// Passport Google OAuth Strategy
try {
  passport.use(
    new GoogleStrategy.Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/google/callback",
        passReqToCallback: true,
      },
      async function (accessToken, refreshToken, profile, cb) {
        try {
          console.log("Google OAuth callback - profile:", profile.id);
          console.log("User email:", profile.emails[0].value);

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
              console.log("Existing user updated with Google ID:", user.name);
            } else {
              // Create new user
              user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos[0]?.value,
              });
              await user.save();
              console.log("New user created:", user.name);
            }
          } else {
            console.log("Existing Google user found:", user.name);
          }

          return cb(null, user);
        } catch (error) {
          console.error("OAuth callback error:", error);
          return cb(error, null);
        }
      },
    ),
  );
  console.log("✅ Google OAuth strategy configured successfully");
} catch (error) {
  console.error("❌ Error configuring Google OAuth strategy:", error);
}

// Passport GitHub OAuth Strategy
try {
  passport.use(
    new GitHubStrategy.Strategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "http://localhost:5000/api/auth/github/callback",
      },
      async function (accessToken, refreshToken, profile, cb) {
        try {
          console.log("GitHub OAuth callback - profile:", profile.id);
          console.log("User email:", profile.emails?.[0]?.value || "No email");

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
              console.log("Existing user updated with GitHub ID:", user.name);
            } else {
              // Create new user
              user = new User({
                githubId: profile.id,
                name: profile.displayName || profile.username,
                email:
                  profile.emails?.[0]?.value ||
                  `${profile.username}@github.com`,
                avatar: profile.photos?.[0]?.value,
              });
              await user.save();
              console.log("New GitHub user created:", user.name);
            }
          } else {
            console.log("Existing GitHub user found:", user.name);
          }

          return cb(null, user);
        } catch (error) {
          console.error("GitHub OAuth callback error:", error);
          return cb(error, null);
        }
      },
    ),
  );
  console.log("✅ GitHub OAuth strategy configured successfully");
} catch (error) {
  console.error("❌ Error configuring GitHub OAuth strategy:", error);
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

// ✅ Define your API routes with authentication
app.use("/api/auth", authLimiter, authRoutes); // Stricter rate limiting for auth
app.use("/api/portfolio", authenticateUser, portfolioRoutes); // Protected portfolio routes
app.use("/api/dashboard", authenticateUser, dashboardRoutes); // Protected dashboard routes

// ✅ Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "Test route working", timestamp: new Date().toISOString() });
});

// ✅ OAuth Routes (Public) - Using /oauth prefix to avoid Next.js /api/auth conflict
app.get("/oauth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
app.get("/oauth/google/callback", 
  passport.authenticate("google", { failureRedirect: "/login?error=oauth_failed" }),
  (req, res) => {
    // Successful authentication, redirect to frontend with success flag
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}?oauth_success=true`);
  }
);

app.get("/oauth/github", passport.authenticate("github", { scope: ["user:email"] }));
app.get("/oauth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login?error=oauth_failed" }),
  (req, res) => {
    // Successful authentication, redirect to frontend with success flag
    res.redirect(`${process.env.FRONTEND_URL || "http://localhost:3000"}?oauth_success=true`);
  }
);

// ✅ Logout route
app.post("/api/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: "Logout failed" });
    }
    res.json({ success: true, message: "Logged out successfully" });
  });
});

// ✅ Add missing API routes for ShowWork functionality
import { publishQueue, analyticsQueue } from "../src/lib/queue/index.js";

// Calendar/Scheduling API (Protected)
app.post("/api/calendar/schedule", authenticateUser, async (req, res) => {
  try {
    const { platform, content, scheduledTime } = req.body;
    
    // Add job to publish queue
    const job = await publishQueue.add('schedule-post', {
      platform,
      content,
      scheduledTime: new Date(scheduledTime),
      userId: req.user?._id || 'anonymous'
    });
    
    res.json({ 
      success: true, 
      message: "Post scheduled successfully", 
      jobId: job.id 
    });
  } catch (error) {
    console.error('Schedule post error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to schedule post' 
    });
  }
});

// Analytics API (Protected)
app.post("/api/analytics", authenticateUser, async (req, res) => {
  try {
    const { event, platform, portfolioId, meta } = req.body;
    
    // Add job to analytics queue
    const job = await analyticsQueue.add('analytics', {
      event: {
        eventType: event,
        platform: platform || 'site',
        portfolioId: portfolioId || 'unknown',
        meta: meta || {},
        ts: new Date()
      }
    });
    
    res.json({ 
      success: true, 
      message: "Analytics event queued", 
      jobId: job.id 
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to queue analytics event' 
    });
  }
});

// Portfolio Health API (Protected)
app.get("/api/portfolio/health/:portfolioId", authenticateUser, async (req, res) => {
  try {
    const { portfolioId } = req.params;
    
    // Mock health score calculation
    const healthScore = Math.floor(Math.random() * 40) + 60; // 60-100 range
    
    res.json({
      success: true,
      portfolioId,
      healthScore,
      lastUpdated: new Date(),
      metrics: {
        socialMedia: Math.floor(Math.random() * 20) + 80,
        github: Math.floor(Math.random() * 30) + 70,
        portfolio: Math.floor(Math.random() * 25) + 75
      }
    });
  } catch (error) {
    console.error('Portfolio health error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to get portfolio health' 
    });
  }
});

// ✅ Default route to check if backend is running
app.get("/", (req, res) => {
  res.json({ 
    success: true, 
    message: "✅ Backend is running successfully!",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ Health check route for Render
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Debug routes for testing
app.get("/api/debug/session", (req, res) => {
  console.log("Session data:", req.session);
  res.json({
    session: req.session,
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
  });
});

// Debug OAuth flow
app.get("/api/debug/oauth-flow", (req, res) => {
  res.json({
    message: "OAuth flow debug",
    session: req.session,
    user: req.user,
    isAuthenticated: req.isAuthenticated(),
    cookies: req.headers.cookie,
  });
});

app.get("/api/debug/oauth-status", (req, res) => {
  res.json({
    googleClientId: process.env.GOOGLE_CLIENT_ID ? "Set" : "Not set",
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET ? "Set" : "Not set",
    githubClientId: process.env.GITHUB_CLIENT_ID ? "Set" : "Not set",
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET ? "Set" : "Not set",
    googleCallbackUrl: "http://localhost:5000/api/auth/google/callback",
    githubCallbackUrl: "http://localhost:5000/api/auth/github/callback",
    frontendUrl: "http://localhost:3000",
    backendPort: PORT,
    mongoUri: MONGO_URI ? "Set" : "Not set",
  });
});

// Test route to simulate OAuth success
app.get("/api/test/oauth-success", (req, res) => {
  // Create a mock user for testing
  const mockUser = {
    _id: "test-user-id",
    googleId: "test-google-id",
    name: "Test User",
    email: "test@example.com",
  };

  req.login(mockUser, (err) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Login failed", details: err.message });
    }
    res.json({
      message: "Test login successful",
      user: mockUser,
      session: req.session,
    });
  });
});

// Google OAuth routes
app.get(
  "/api/auth/google",
  (req, res, next) => {
    try {
      console.log("Google OAuth initiated");
      console.log(
        "Client ID:",
        process.env.GOOGLE_CLIENT_ID ? "Set" : "Missing",
      );
      next();
    } catch (error) {
      console.error("OAuth initiation error:", error);
      res
        .status(500)
        .json({ error: "OAuth initiation failed", details: error.message });
    }
  },
  (req, res, next) => {
    // Force account selection by redirecting to Google with proper parameters
    const googleAuthUrl =
      `https://accounts.google.com/oauth/authorize?` +
      `client_id=${process.env.GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent("http://localhost:5000/api/auth/google/callback")}&` +
      `scope=profile email&` +
      `response_type=code&` +
      `prompt=select_account&` +
      `access_type=offline&` +
      `include_granted_scopes=true`;

    console.log("🔐 Redirecting to Google with account selection");
    res.redirect(googleAuthUrl);
  },
);

app.get(
  "/api/auth/google/callback",
  (req, res, next) => {
    console.log("Google OAuth callback received");
    console.log("Query params:", req.query);
    next();
  },
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/login",
    failureMessage: true,
  }),
  async (req, res) => {
    console.log("Google OAuth successful, user:", req.user);
    console.log("Session after OAuth:", req.session);
    console.log("User authenticated:", req.isAuthenticated());

    try {
      // Check if user has completed profile setup
      const user = await User.findById(req.user._id);
      console.log("User profile completed:", user.profileCompleted);
      console.log("User username:", user.username);

      // Ensure session is saved before redirect
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
        }

        // Redirect based on profile completion status
        if (!user.profileCompleted || !user.username) {
          console.log("New user - redirecting to profile setup");
          res.redirect("http://localhost:3000/dashboard?setup=true");
        } else {
          console.log("Returning user - redirecting to dashboard");
          res.redirect("http://localhost:3000/dashboard");
        }
      });
    } catch (error) {
      console.error("Error checking user profile:", error);
      res.redirect("http://localhost:3000/dashboard?setup=true");
    }
  },
);

// GitHub OAuth routes
app.get(
  "/api/auth/github",
  (req, res, next) => {
    try {
      console.log("GitHub OAuth initiated");
      console.log(
        "Client ID:",
        process.env.GITHUB_CLIENT_ID ? "Set" : "Missing",
      );
      next();
    } catch (error) {
      console.error("GitHub OAuth initiation error:", error);
      res
        .status(500)
        .json({
          error: "GitHub OAuth initiation failed",
          details: error.message,
        });
    }
  },
  (req, res, next) => {
    // GitHub OAuth with account selection
    const githubAuthUrl =
      `https://github.com/login/oauth/authorize?` +
      `client_id=${process.env.GITHUB_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent("http://localhost:5000/api/auth/github/callback")}&` +
      `scope=user:email&` +
      `allow_signup=true`;

    console.log("🔐 Redirecting to GitHub with account selection");
    res.redirect(githubAuthUrl);
  },
);

app.get(
  "/api/auth/github/callback",
  (req, res, next) => {
    console.log("GitHub OAuth callback received");
    console.log("Query params:", req.query);
    next();
  },
  passport.authenticate("github", {
    failureRedirect: "http://localhost:3000/login",
    failureMessage: true,
  }),
  async (req, res) => {
    console.log("GitHub OAuth successful, user:", req.user);
    console.log("Session after GitHub OAuth:", req.session);
    console.log("User authenticated:", req.isAuthenticated());

    try {
      // Check if user has completed profile setup
      const user = await User.findById(req.user._id);
      console.log("User profile completed:", user.profileCompleted);
      console.log("User username:", user.username);

      // Ensure session is saved before redirect
      req.session.save((err) => {
        if (err) {
          console.error("Session save error:", err);
        }

        // Redirect based on profile completion status
        if (!user.profileCompleted || !user.username) {
          console.log("New user - redirecting to profile setup");
          res.redirect("http://localhost:3000/dashboard?setup=true");
        } else {
          console.log("Returning user - redirecting to dashboard");
          res.redirect("http://localhost:3000/dashboard");
        }
      });
    } catch (error) {
      console.error("Error checking user profile:", error);
      res.redirect("http://localhost:3000/dashboard?setup=true");
    }
  },
);

// Logout route
app.get("/api/auth/logout", (req, res) => {
  console.log("🔓 Logout initiated");

  req.logout((err) => {
    if (err) {
      console.error("❌ Logout error:", err);
      return res.status(500).json({ message: "Logout error" });
    }

    // Clear the session completely
    req.session.destroy((err) => {
      if (err) {
        console.error("❌ Session destroy error:", err);
      } else {
        console.log("✅ Session destroyed successfully");
      }
    });

    console.log("✅ Logout successful, redirecting to login");
    res.redirect("http://localhost:3000/login");
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "ShowWork Server is running!",
    timestamp: new Date().toISOString(),
    port: PORT,
  });
});

// Username availability checking endpoint
app.post("/api/check-username", async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        available: false,
        message: "Username is required",
      });
    }

    // Validate username format
    if (username.length < 3) {
      return res.status(400).json({
        available: false,
        message: "Username must be at least 3 characters",
      });
    }

    if (username.length > 20) {
      return res.status(400).json({
        available: false,
        message: "Username must be less than 20 characters",
      });
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return res.status(400).json({
        available: false,
        message:
          "Username can only contain letters, numbers, underscore and dash",
      });
    }

    if (/^[0-9]/.test(username)) {
      return res.status(400).json({
        available: false,
        message: "Username cannot start with a number",
      });
    }

    // Reserved usernames
    const reservedUsernames = [
      "admin",
      "api",
      "www",
      "mail",
      "ftp",
      "localhost",
      "test",
      "demo",
      "root",
      "user",
      "guest",
      "anonymous",
      "showwork",
      "portfolio",
      "dashboard",
      "profile",
      "settings",
      "auth",
      "login",
      "register",
      "signup",
      "signin",
      "help",
      "support",
      "contact",
      "about",
      "terms",
      "privacy",
      "blog",
      "news",
      "docs",
      "documentation",
      "app",
      "mobile",
    ];

    if (reservedUsernames.includes(username.toLowerCase())) {
      return res.status(400).json({
        available: false,
        message: "This username is reserved",
      });
    }

    // Check if username exists in database
    // If user is authenticated, exclude their own username from the check
    const query = {
      username: { $regex: new RegExp("^" + username + "$", "i") },
    };
    if (req.isAuthenticated() && req.user._id) {
      query._id = { $ne: req.user._id };
    }

    const existingUser = await User.findOne(query);

    if (existingUser) {
      return res.json({
        available: false,
        message: "Username is already taken",
      });
    }

    // Username is available
    return res.json({
      available: true,
      message: "Username is available!",
    });
  } catch (error) {
    console.error("Username check error:", error);
    return res.status(500).json({
      available: false,
      message: "Error checking username availability",
    });
  }
});

// Update user profile with username
app.post("/api/profile/update", async (req, res) => {
  try {
    console.log("🔧 Profile update request received:", req.body);
    console.log("👤 User authenticated:", req.isAuthenticated());
    console.log("👤 User ID:", req.user?._id);

    if (!req.isAuthenticated()) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated. Please log in to update your profile.",
      });
    }

    const { username, fullName, bio, profilePicture } = req.body;
    const userId = req.user._id;

    // Validate required fields
    if (!username || !fullName) {
      return res.status(400).json({
        success: false,
        message: "Username and full name are required",
      });
    }

    // Double-check username availability before saving
    if (username) {
      // Validate username format server-side
      if (username.length < 3) {
        return res.status(400).json({
          success: false,
          message: "Username must be at least 3 characters",
        });
      }

      if (username.length > 20) {
        return res.status(400).json({
          success: false,
          message: "Username must be less than 20 characters",
        });
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
        return res.status(400).json({
          success: false,
          message:
            "Username can only contain letters, numbers, underscore and dash",
        });
      }

      if (/^[0-9]/.test(username)) {
        return res.status(400).json({
          success: false,
          message: "Username cannot start with a number",
        });
      }

      // Check if username is taken by another user
      const existingUser = await User.findOne({
        username: { $regex: new RegExp("^" + username + "$", "i") },
        _id: { $ne: userId }, // Exclude current user
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Username is already taken. Please choose a different one.",
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
        updatedAt: new Date(),
      },
      { new: true },
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("✅ Profile updated successfully:", {
      userId: updatedUser._id,
      username: updatedUser.username,
      name: updatedUser.name,
      profileCompleted: updatedUser.profileCompleted,
    });

    return res.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again.",
    });
  }
});

const PORT = process.env.PORT || 5001;

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start the server
// Connect to MongoDB first, then start server
mongoose
  .connect(MONGO_URI, {
    tls: true,
    tlsAllowInvalidCertificates: false,
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log("✅ Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });
