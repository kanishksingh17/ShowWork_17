// Environment validation
const requiredEnvVars = [
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'GITHUB_CLIENT_ID', 
  'GITHUB_CLIENT_SECRET',
  'SESSION_SECRET',
  'MONGO_URI'
];

const optionalEnvVars = [
  'PORT',
  'JWT_SECRET',
  'NODE_ENV'
];

export const validateEnvironment = () => {
  console.log('🔍 Validating environment variables...');
  
  const missing = [];
  const present = [];
  
  // Check required variables
  requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
      missing.push(varName);
    } else {
      present.push(varName);
    }
  });
  
  // Check optional variables
  optionalEnvVars.forEach(varName => {
    if (process.env[varName]) {
      present.push(varName);
    }
  });
  
  console.log('✅ Present variables:', present);
  
  if (missing.length > 0) {
    console.error('❌ Missing required variables:', missing);
    console.error('Please set these environment variables before starting the server.');
    return false;
  }
  
  console.log('✅ All required environment variables are present');
  return true;
};

export const getEnvConfig = () => ({
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  SESSION_SECRET: process.env.SESSION_SECRET,
  MONGO_URI: process.env.MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET
});
