import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ExampleCard } from './components/ExampleCard'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-gray-900">ShowWork</h1>
                <span className="ml-2 text-sm text-gray-500">AI-Powered Portfolio</span>
              </div>
              <nav className="flex space-x-8">
                <a href="/" className="text-gray-500 hover:text-gray-900">Home</a>
                <a href="/projects" className="text-gray-500 hover:text-gray-900">Projects</a>
                <a href="/analytics" className="text-gray-500 hover:text-gray-900">Analytics</a>
              </nav>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={
              <div className="px-4 py-6 sm:px-0">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Welcome to ShowWork
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    AI-powered portfolio showcase with social media integration
                  </p>
                  <ExampleCard />
                </div>
              </div>
            } />
            <Route path="/projects" element={
              <div className="px-4 py-6 sm:px-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Projects</h2>
                <p className="text-gray-600">Your projects will appear here.</p>
              </div>
            } />
            <Route path="/analytics" element={
              <div className="px-4 py-6 sm:px-0">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Analytics</h2>
                <p className="text-gray-600">Analytics dashboard coming soon.</p>
              </div>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
