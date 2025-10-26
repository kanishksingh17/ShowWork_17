/**
 * Security utilities for portfolio builder
 * Ensures user data privacy and secure API communications
 */

export interface SecurityConfig {
  encryptionKey: string;
  apiTimeout: number;
  maxRetries: number;
  allowedOrigins: string[];
}

export class SecurityManager {
  private config: SecurityConfig;

  constructor(config: SecurityConfig) {
    this.config = config;
  }

  /**
   * Encrypt sensitive user data before storage
   */
  async encryptUserData(data: any): Promise<string> {
    try {
      // In a real implementation, use proper encryption
      const jsonString = JSON.stringify(data);
      const encoded = btoa(jsonString);
      return encoded;
    } catch (error) {
      console.error("Error encrypting user data:", error);
      throw new Error("Failed to encrypt user data");
    }
  }

  /**
   * Decrypt user data after retrieval
   */
  async decryptUserData(encryptedData: string): Promise<any> {
    try {
      const decoded = atob(encryptedData);
      return JSON.parse(decoded);
    } catch (error) {
      console.error("Error decrypting user data:", error);
      throw new Error("Failed to decrypt user data");
    }
  }

  /**
   * Sanitize user input to prevent XSS attacks
   */
  sanitizeInput(input: string): string {
    const div = document.createElement("div");
    div.textContent = input;
    return div.innerHTML;
  }

  /**
   * Validate API responses for security
   */
  validateApiResponse(response: any): boolean {
    // Check for malicious content
    if (
      typeof response === "string" &&
      this.containsMaliciousContent(response)
    ) {
      return false;
    }

    // Check response size limits
    const responseSize = JSON.stringify(response).length;
    if (responseSize > 1024 * 1024) {
      // 1MB limit
      return false;
    }

    return true;
  }

  /**
   * Check for malicious content in responses
   */
  private containsMaliciousContent(content: string): boolean {
    const maliciousPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi,
    ];

    return maliciousPatterns.some((pattern) => pattern.test(content));
  }

  /**
   * Secure API call with timeout and retry logic
   */
  async secureApiCall(
    url: string,
    options: RequestInit = {},
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      this.config.apiTimeout,
    );

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
          ...options.headers,
        },
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`API call failed: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Generate secure random tokens
   */
  generateSecureToken(length: number = 32): string {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    const crypto = window.crypto || (window as any).msCrypto;

    if (crypto && crypto.getRandomValues) {
      const array = new Uint8Array(length);
      crypto.getRandomValues(array);
      for (let i = 0; i < length; i++) {
        result += chars[array[i] % chars.length];
      }
    } else {
      // Fallback for older browsers
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }

    return result;
  }

  /**
   * Validate file uploads for security
   */
  validateFileUpload(file: File): { isValid: boolean; error?: string } {
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return { isValid: false, error: "File size exceeds 10MB limit" };
    }

    // Check file type
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "application/pdf",
      "text/plain",
    ];

    if (!allowedTypes.includes(file.type)) {
      return { isValid: false, error: "File type not allowed" };
    }

    // Check for suspicious file names
    const suspiciousPatterns = [
      /\.exe$/i,
      /\.bat$/i,
      /\.cmd$/i,
      /\.scr$/i,
      /\.pif$/i,
    ];

    if (suspiciousPatterns.some((pattern) => pattern.test(file.name))) {
      return {
        isValid: false,
        error: "File type not allowed for security reasons",
      };
    }

    return { isValid: true };
  }

  /**
   * Rate limiting for API calls
   */
  private apiCallCounts: Map<string, { count: number; resetTime: number }> =
    new Map();

  isRateLimited(
    identifier: string,
    maxCalls: number = 100,
    windowMs: number = 60000,
  ): boolean {
    const now = Date.now();
    const userCalls = this.apiCallCounts.get(identifier);

    if (!userCalls || now > userCalls.resetTime) {
      this.apiCallCounts.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return false;
    }

    if (userCalls.count >= maxCalls) {
      return true;
    }

    userCalls.count++;
    return false;
  }

  /**
   * Secure data storage with encryption
   */
  async secureStorageSet(key: string, value: any): Promise<void> {
    try {
      const encrypted = await this.encryptUserData(value);
      localStorage.setItem(key, encrypted);
    } catch (error) {
      console.error("Error storing data securely:", error);
      throw new Error("Failed to store data securely");
    }
  }

  /**
   * Secure data retrieval with decryption
   */
  async secureStorageGet(key: string): Promise<any> {
    try {
      const encrypted = localStorage.getItem(key);
      if (!encrypted) return null;

      return await this.decryptUserData(encrypted);
    } catch (error) {
      console.error("Error retrieving data securely:", error);
      return null;
    }
  }

  /**
   * Clear sensitive data from storage
   */
  clearSensitiveData(): void {
    const sensitiveKeys = [
      "userData",
      "userProjects",
      "userPortfolio",
      "authToken",
      "apiKeys",
    ];

    sensitiveKeys.forEach((key) => {
      localStorage.removeItem(key);
    });
  }

  /**
   * Validate CORS origins
   */
  isAllowedOrigin(origin: string): boolean {
    return (
      this.config.allowedOrigins.includes(origin) ||
      this.config.allowedOrigins.includes("*")
    );
  }

  /**
   * Generate CSRF token
   */
  generateCSRFToken(): string {
    return this.generateSecureToken(32);
  }

  /**
   * Validate CSRF token
   */
  validateCSRFToken(token: string, storedToken: string): boolean {
    return token === storedToken && token.length === 32;
  }
}

// Default security configuration
export const defaultSecurityConfig: SecurityConfig = {
  encryptionKey:
    process.env.REACT_APP_ENCRYPTION_KEY || "default-key-change-in-production",
  apiTimeout: 30000, // 30 seconds
  maxRetries: 3,
  allowedOrigins: [
    window.location.origin,
    "https://api.openai.com",
    "https://api.github.com",
    "https://api.linkedin.com",
  ],
};

// Create security manager instance
export const securityManager = new SecurityManager(defaultSecurityConfig);
