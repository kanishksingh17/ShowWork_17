import React from 'react';
import DeveloperProfileSetup from '../components/DeveloperProfileSetup';
import { BrowserRouter } from 'react-router-dom';

// Simple test component to verify DeveloperProfileSetup works
export default function TestDeveloperSetup() {
  console.log('🧪 TestDeveloperSetup component loaded');
  
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900">
        <div className="p-4 bg-green-500 text-white text-center">
          <h1>🧪 DeveloperProfileSetup Test Page</h1>
          <p>If you can see this green bar, the test component loaded successfully!</p>
        </div>
        <DeveloperProfileSetup />
      </div>
    </BrowserRouter>
  );
}