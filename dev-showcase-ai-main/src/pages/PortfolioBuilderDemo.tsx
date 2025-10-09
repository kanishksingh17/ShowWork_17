"use client"

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import PortfolioBuilder from '../components/portfolio-builder/PortfolioBuilder'
import { PortfolioCanvas } from '../components/portfolio-builder/types'

// Demo page for the Portfolio Builder
export default function PortfolioBuilderDemo() {
  const [savedCanvases, setSavedCanvases] = useState<PortfolioCanvas[]>([])

  // Mock initial canvas
  const initialCanvas: PortfolioCanvas = {
    id: 'demo-canvas-1',
    name: 'My Portfolio',
    description: 'A showcase of my work and skills',
    components: [
      {
        id: 'hero-1',
        type: 'hero',
        name: 'Hero Section',
        description: 'Eye-catching hero section with title and CTA',
        icon: 'Rocket',
        category: 'content',
        tags: ['hero', 'landing', 'cta'],
        defaultProps: {
          title: 'Welcome to My Portfolio',
          subtitle: 'I create amazing digital experiences',
          ctaText: 'View My Work',
          ctaLink: '#projects'
        },
        styles: {
          backgroundColor: '#000000',
          color: '#ffffff',
          padding: '80px 20px',
          textAlign: 'center'
        },
        animations: {
          type: 'fade',
          duration: 800,
          delay: 0,
          easing: 'ease-out',
          trigger: 'onLoad'
        },
        isDraggable: true,
        isNestable: false,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'about-1',
        type: 'about',
        name: 'About Section',
        description: 'Personal introduction with photo and description',
        icon: 'User',
        category: 'content',
        tags: ['about', 'bio', 'introduction'],
        defaultProps: {
          name: 'John Doe',
          title: 'Full Stack Developer',
          description: 'Passionate developer with 5+ years of experience building web applications.',
          image: '/images/profile.jpg'
        },
        styles: {
          backgroundColor: '#ffffff',
          color: '#333333',
          padding: '60px 20px',
          display: 'flex',
          alignItems: 'center',
          gap: '40px'
        },
        animations: {
          type: 'slide',
          duration: 600,
          delay: 200,
          easing: 'ease-out',
          trigger: 'onScroll'
        },
        isDraggable: true,
        isNestable: false,
        order: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ],
    settings: {
      width: 1200,
      height: 800,
      backgroundColor: '#ffffff',
      padding: 0,
      margin: 0
    },
    metadata: {
      version: '1.0.0',
      lastModified: new Date(),
      createdBy: 'demo-user'
    }
  }

  // Handle save
  const handleSave = async (canvas: PortfolioCanvas): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setSavedCanvases(prev => {
          const existingIndex = prev.findIndex(c => c.id === canvas.id)
          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex] = canvas
            return updated
          } else {
            return [...prev, canvas]
          }
        })
        console.log('Portfolio saved:', canvas.name)
        resolve()
      }, 1000) // Simulate API call
    })
  }

  // Handle load
  const handleLoad = async (id: string): Promise<PortfolioCanvas> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const canvas = savedCanvases.find(c => c.id === id)
        if (canvas) {
          resolve(canvas)
        } else {
          reject(new Error('Canvas not found'))
        }
      }, 500) // Simulate API call
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold mb-4"
            >
              Portfolio Builder
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto"
            >
              Create stunning portfolios with drag-and-drop components, AI suggestions, 
              and real-time editing. Built with @dnd-kit for smooth interactions.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center space-x-6 text-sm"
            >
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Drag & Drop</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span>AI Suggestions</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span>Real-time Preview</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span>Auto-save</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Features</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need to build professional portfolios with ease
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Drag & Drop</h3>
            <p className="text-gray-600">
              Intuitive drag-and-drop interface with @dnd-kit for smooth component arrangement and nesting.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Suggestions</h3>
            <p className="text-gray-600">
              Smart AI-powered suggestions for components and layouts based on your content and goals.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-time Preview</h3>
            <p className="text-gray-600">
              See your changes instantly with live preview and responsive design testing.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Auto-save</h3>
            <p className="text-gray-600">
              Never lose your work with automatic saving and comprehensive undo/redo functionality.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Keyboard Shortcuts</h3>
            <p className="text-gray-600">
              Full keyboard accessibility with shortcuts for all major actions and navigation.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Component Library</h3>
            <p className="text-gray-600">
              Extensive library of pre-built components with search, filtering, and categorization.
            </p>
          </div>
        </div>
      </div>

      {/* Portfolio Builder Demo */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Try the Portfolio Builder</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Experience the full-featured portfolio builder with drag-and-drop, AI suggestions, and real-time editing.
            </p>
          </div>

          <div className="bg-gray-100 rounded-lg overflow-hidden" style={{ height: '80vh' }}>
            <PortfolioBuilder
              initialCanvas={initialCanvas}
              onSave={handleSave}
              onLoad={handleLoad}
              autoSaveInterval={10000} // 10 seconds for demo
              maxHistorySize={20}
              keyboardShortcuts={{
                undo: 'Ctrl+Z',
                redo: 'Ctrl+Y',
                save: 'Ctrl+S',
                duplicate: 'Ctrl+D',
                delete: 'Delete',
                selectAll: 'Ctrl+A',
                copy: 'Ctrl+C',
                paste: 'Ctrl+V',
                cut: 'Ctrl+X'
              }}
            />
          </div>
        </div>
      </div>

      {/* Usage Instructions */}
      <div className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How to Use</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Get started with the portfolio builder in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Browse Components</h3>
              <p className="text-sm text-gray-600">
                Explore the component library in the left sidebar. Use search and filters to find the perfect components.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Drag & Drop</h3>
              <p className="text-sm text-gray-600">
                Drag components from the library to the canvas. Rearrange them by dragging within the canvas area.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Customize</h3>
              <p className="text-sm text-gray-600">
                Select components to edit their content, styles, and animations in the properties panel on the right.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-yellow-600">4</span>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Save & Export</h3>
              <p className="text-sm text-gray-600">
                Your work is automatically saved. Export your portfolio as JSON or publish it directly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Keyboard Shortcuts</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Speed up your workflow with these keyboard shortcuts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">General</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Save</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-600">Ctrl+S</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Undo</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-600">Ctrl+Z</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Redo</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-600">Ctrl+Y</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Select All</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-600">Ctrl+A</kbd>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Components</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Duplicate</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-600">Ctrl+D</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Delete</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-600">Delete</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Copy</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-600">Ctrl+C</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Paste</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-600">Ctrl+V</kbd>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Navigation</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-700">Deselect</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-600">Esc</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Help</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-600">?</kbd>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Settings</span>
                  <kbd className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-600">Ctrl+,</kbd>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
