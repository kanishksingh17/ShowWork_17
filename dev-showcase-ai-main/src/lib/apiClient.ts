// API Client Configuration for Frontend
// This centralizes all API calls and handles environment-specific URLs

const getApiBaseUrl = (): string => {
  // Check for Vite environment variable first
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // Check for Next.js environment variable
  if (import.meta.env.NEXT_PUBLIC_API_URL) {
    return import.meta.env.NEXT_PUBLIC_API_URL;
  }
  
  // Development fallback
  if (import.meta.env.DEV) {
    return 'http://localhost:5001';
  }
  
  // Production fallback
  return 'https://showwork-backend.onrender.com';
};

export const API_BASE_URL = getApiBaseUrl();

// Helper function to make API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const defaultOptions: RequestInit = {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };
  
  const response = await fetch(url, { ...defaultOptions, ...options });
  
  if (!response.ok) {
    throw new Error(`API call failed: ${response.status} ${response.statusText}`);
  }
  
  return response;
};

// Helper function for JSON responses
export const apiJson = async (endpoint: string, options: RequestInit = {}) => {
  const response = await apiCall(endpoint, options);
  return response.json();
};

// Helper function for text responses
export const apiText = async (endpoint: string, options: RequestInit = {}) => {
  const response = await apiCall(endpoint, options);
  return response.text();
};

// Log API configuration for debugging
console.log('🔧 API Configuration:', {
  baseUrl: API_BASE_URL,
  environment: import.meta.env.MODE,
  viteApiUrl: import.meta.env.VITE_API_BASE_URL,
  nextApiUrl: import.meta.env.NEXT_PUBLIC_API_URL,
});
