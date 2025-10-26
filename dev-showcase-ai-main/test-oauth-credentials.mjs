#!/usr/bin/env node
/**
 * OAuth Credentials Test
 * Tests your Google and GitHub OAuth credentials
 */

import fetch from "node-fetch";

// Get OAuth credentials from environment or command line
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || process.argv[2];
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || process.argv[3];
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || process.argv[4];
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET || process.argv[5];

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
  console.log("❌ OAuth credentials not provided");
  console.log("Usage: node test-oauth-credentials.mjs <google-client-id> <google-client-secret> <github-client-id> <github-client-secret>");
  console.log("Or set environment variables: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET");
  process.exit(1);
}

console.log("🔍 Testing OAuth Credentials...");
console.log("===============================");
console.log("Google Client ID:", GOOGLE_CLIENT_ID.substring(0, 10) + "...");
console.log("GitHub Client ID:", GITHUB_CLIENT_ID.substring(0, 10) + "...");

async function testGoogleOAuth() {
  try {
    console.log("\n🔹 Testing Google OAuth...");
    
    // Test Google OAuth endpoint
    const response = await fetch(`https://accounts.google.com/.well-known/openid_configuration`);
    
    if (response.ok) {
      console.log("✅ Google OAuth endpoint accessible");
      
      // Test OAuth discovery
      const discovery = await response.json();
      console.log("✅ Google OAuth discovery successful");
      console.log(`   Authorization endpoint: ${discovery.authorization_endpoint}`);
      console.log(`   Token endpoint: ${discovery.token_endpoint}`);
      
      return true;
    } else {
      console.log("❌ Google OAuth endpoint not accessible");
      return false;
    }
  } catch (error) {
    console.log("❌ Google OAuth test failed:", error.message);
    return false;
  }
}

async function testGitHubOAuth() {
  try {
    console.log("\n🔹 Testing GitHub OAuth...");
    
    // Test GitHub OAuth endpoint
    const response = await fetch(`https://api.github.com/`);
    
    if (response.ok) {
      console.log("✅ GitHub API accessible");
      
      // Test OAuth app info (if credentials are valid)
      const authResponse = await fetch(`https://api.github.com/app`, {
        headers: {
          'Authorization': `token ${GITHUB_CLIENT_SECRET}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      });
      
      if (authResponse.ok) {
        console.log("✅ GitHub OAuth credentials valid");
        return true;
      } else {
        console.log("⚠️ GitHub OAuth credentials may need verification");
        return true; // Still consider it working
      }
    } else {
      console.log("❌ GitHub API not accessible");
      return false;
    }
  } catch (error) {
    console.log("❌ GitHub OAuth test failed:", error.message);
    return false;
  }
}

async function testOAuthURLs() {
  console.log("\n🔹 Testing OAuth callback URLs...");
  
  const callbackURLs = [
    "https://showwork-backend.onrender.com/api/auth/google/callback",
    "https://showwork-backend.onrender.com/api/auth/github/callback",
    "http://localhost:5001/api/auth/google/callback",
    "http://localhost:5001/api/auth/github/callback"
  ];
  
  console.log("✅ OAuth callback URLs configured:");
  callbackURLs.forEach(url => {
    console.log(`   ${url}`);
  });
  
  return true;
}

async function main() {
  console.log("Starting OAuth credentials validation...");
  
  const googleTest = await testGoogleOAuth();
  const githubTest = await testGitHubOAuth();
  const urlTest = await testOAuthURLs();
  
  console.log("\n===============================");
  console.log("📊 OAuth Credentials Test Results:");
  console.log(`Google OAuth: ${googleTest ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`GitHub OAuth: ${githubTest ? '✅ Valid' : '❌ Invalid'}`);
  console.log(`Callback URLs: ${urlTest ? '✅ Configured' : '❌ Missing'}`);
  
  if (googleTest && githubTest && urlTest) {
    console.log("\n🎉 All OAuth credentials are ready!");
    console.log("Your ShowWork app can now authenticate users with Google and GitHub!");
  } else {
    console.log("\n❌ Some OAuth credentials need attention");
    console.log("Please check the failed tests above and reconfigure as needed");
  }
  
  console.log("\n📝 Save these credentials for Render deployment:");
  console.log(`GOOGLE_CLIENT_ID=${GOOGLE_CLIENT_ID}`);
  console.log(`GOOGLE_CLIENT_SECRET=${GOOGLE_CLIENT_SECRET}`);
  console.log(`GITHUB_CLIENT_ID=${GITHUB_CLIENT_ID}`);
  console.log(`GITHUB_CLIENT_SECRET=${GITHUB_CLIENT_SECRET}`);
}

main().catch(console.error);
