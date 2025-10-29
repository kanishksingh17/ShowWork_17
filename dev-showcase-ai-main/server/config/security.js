// Security configuration for ShowWork
// ==========================================

export const securityConfig = {
  // Rate limiting configuration
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
    max: process.env.NODE_ENV === 'production' 
      ? parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 
      : parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 1000,
    message: {
      error: "Too many requests from this IP, please try again later.",
      retryAfter: "15 minutes"
    },
    standardHeaders: true,
    legacyHeaders: false,
  },

  // Auth rate limiting (stricter)
  authRateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS) || 5,
    message: {
      error: "Too many authentication attempts, please try again later.",
      retryAfter: "15 minutes"
    },
    skipSuccessfulRequests: true,
  },

  // CORS configuration
  cors: {
    origin: process.env.NODE_ENV === "production"
      ? [
          process.env.FRONTEND_URL || "https://showwork-frontend.onrender.com",
          "https://showwork-frontend.onrender.com"
        ]
      : ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  },

  // Session configuration
  session: {
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      httpOnly: true, // Prevent XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // CSRF protection
    },
    name: 'showwork.sid', // Custom session name
  },

  // Helmet configuration
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
        connectSrc: ["'self'", "https://api.openai.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
      },
    },
    crossOriginEmbedderPolicy: false,
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true
    }
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || "your-jwt-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
    issuer: "showwork",
    audience: "showwork-users"
  }
};

// Environment-specific configurations
export const getEnvironmentConfig = () => {
  const isProduction = process.env.NODE_ENV === 'production';
  
  return {
    isProduction,
    isDevelopment: !isProduction,
    database: {
      mongoUri: process.env.MONGO_URI,
      redisUrl: process.env.REDIS_URL,
    },
    security: {
      tlsRejectUnauthorized: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0',
      rateLimitEnabled: true,
      helmetEnabled: true,
      corsEnabled: true,
    },
    logging: {
      level: process.env.LOG_LEVEL || (isProduction ? 'info' : 'debug'),
      enableDebug: process.env.DEBUG === 'true' || !isProduction,
    }
  };
};
