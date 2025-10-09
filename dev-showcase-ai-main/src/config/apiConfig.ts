// API Configuration - Store your actual API keys here
export const API_CONFIG = {
  // OpenAI API Configuration
  OPENAI: {
    API_KEY: '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',
    MODEL: 'gpt-4',
    MAX_TOKENS: 2000,
    TEMPERATURE: 0.7,
    BASE_URL: 'https://api.openai.com/v1'
  },
  
  // AWS S3 Configuration
  AWS: {
    ACCESS_KEY_ID: 'AKIA32DYVQOPEUM466FG',
    SECRET_ACCESS_KEY: '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',
    REGION: 'us-east-1',
    BUCKET_NAME: 'showwork-portfolios'
  },
  
  // Vercel Configuration
  VERCEL: {
    TOKEN: 'a5xLzfUEEfhRW3a006pg4ArT',
    TEAM_ID: undefined, // Optional team ID
    BASE_URL: 'https://api.vercel.com'
  },
  
  // Portfolio Generation Settings
  PORTFOLIO: {
    DEFAULT_TEMPLATE: 'dev-neo-001',
    GENERATION_TIMEOUT: 300000, // 5 minutes
    PERFORMANCE_TARGET: 90, // PageSpeed score target
    MAX_BUNDLE_SIZE: 500000 // 500KB max bundle size
  }
};

// Helper function to get API key from environment or config
export const getOpenAIKey = (): string => {
  return import.meta.env.VITE_OPENAI_API_KEY || API_CONFIG.OPENAI.API_KEY;
};

export const getAWSConfig = () => {
  return {
    accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID || API_CONFIG.AWS.ACCESS_KEY_ID,
    secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY || API_CONFIG.AWS.SECRET_ACCESS_KEY,
    region: import.meta.env.VITE_AWS_REGION || API_CONFIG.AWS.REGION,
    bucketName: import.meta.env.VITE_AWS_BUCKET_NAME || API_CONFIG.AWS.BUCKET_NAME
  };
};

export const getVercelConfig = () => {
  return {
    token: import.meta.env.VITE_VERCEL_TOKEN || API_CONFIG.VERCEL.TOKEN,
    teamId: import.meta.env.VITE_VERCEL_TEAM_ID || API_CONFIG.VERCEL.TEAM_ID,
    baseUrl: API_CONFIG.VERCEL.BASE_URL
  };
};
