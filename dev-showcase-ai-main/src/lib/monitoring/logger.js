/**
 * Production Logging System
 * Centralized logging with different levels and structured output
 */

import winston from 'winston';
import { createLogger, format, transports } from 'winston';

// Custom log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.json(),
  format.prettyPrint()
);

// Create logger instance
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'showwork' },
  transports: [
    // Console transport for development
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    
    // File transport for production
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    new transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ]
});

// Add request logging middleware
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info('HTTP Request', {
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip
    });
  });
  
  next();
};

// Add error logging middleware
export const errorLogger = (err, req, res, next) => {
  logger.error('Application Error', {
    error: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });
  
  next(err);
};

// Security event logging
export const securityLogger = {
  loginAttempt: (email, success, ip) => {
    logger.warn('Login Attempt', {
      event: 'login_attempt',
      email,
      success,
      ip,
      timestamp: new Date().toISOString()
    });
  },
  
  suspiciousActivity: (activity, details, ip) => {
    logger.error('Suspicious Activity', {
      event: 'suspicious_activity',
      activity,
      details,
      ip,
      timestamp: new Date().toISOString()
    });
  },
  
  dataAccess: (userId, resource, action) => {
    logger.info('Data Access', {
      event: 'data_access',
      userId,
      resource,
      action,
      timestamp: new Date().toISOString()
    });
  }
};

// Performance monitoring
export const performanceLogger = {
  apiCall: (endpoint, duration, status) => {
    logger.info('API Performance', {
      event: 'api_call',
      endpoint,
      duration: `${duration}ms`,
      status,
      timestamp: new Date().toISOString()
    });
  },
  
  databaseQuery: (query, duration, rows) => {
    logger.info('Database Query', {
      event: 'db_query',
      query: query.substring(0, 100),
      duration: `${duration}ms`,
      rows,
      timestamp: new Date().toISOString()
    });
  },
  
  queueJob: (jobName, duration, status) => {
    logger.info('Queue Job', {
      event: 'queue_job',
      jobName,
      duration: `${duration}ms`,
      status,
      timestamp: new Date().toISOString()
    });
  }
};

export default logger;
