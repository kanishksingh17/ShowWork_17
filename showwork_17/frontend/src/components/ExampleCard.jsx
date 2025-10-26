import React from 'react'

export function ExampleCard() {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">
          Example Project
        </div>
        <h3 className="mt-2 text-lg font-medium text-gray-900">
          AI-Powered Portfolio Showcase
        </h3>
        <p className="mt-2 text-gray-500">
          A modern web application that helps developers showcase their projects with AI-generated content and social media integration.
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              React
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Node.js
            </span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              AI
            </span>
          </div>
          <button className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            View Project
          </button>
        </div>
      </div>
    </div>
  )
}
