"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PreviewProvider } from "../lib/preview/context";
import { LivePreview } from "../components/preview/LivePreview";

// Demo portfolio content
const DemoPortfolio: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
                <p className="text-gray-600">Full Stack Developer</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#about" className="text-gray-900 hover:text-blue-600">
                About
              </a>
              <a href="#projects" className="text-gray-900 hover:text-blue-600">
                Projects
              </a>
              <a href="#skills" className="text-gray-900 hover:text-blue-600">
                Skills
              </a>
              <a href="#contact" className="text-gray-900 hover:text-blue-600">
                Contact
              </a>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold text-gray-900 mb-4"
            >
              Building Digital Experiences
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 mb-8"
            >
              I create beautiful, functional, and user-friendly web applications
            </motion.p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              View My Work
            </motion.button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                About Me
              </h3>
              <p className="text-gray-600 mb-4">
                I'm a passionate full-stack developer with over 5 years of
                experience in building web applications. I love creating
                solutions that make a difference in people's lives.
              </p>
              <p className="text-gray-600 mb-6">
                My expertise includes React, Node.js, Python, and cloud
                technologies. I'm always eager to learn new technologies and
                take on challenging projects.
              </p>
              <div className="flex space-x-4">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Download Resume
                </button>
                <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">
                  Contact Me
                </button>
              </div>
            </div>
            <div className="bg-gray-100 rounded-lg p-8">
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                Quick Stats
              </h4>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Projects Completed</span>
                  <span className="font-semibold">50+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Years Experience</span>
                  <span className="font-semibold">5+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Happy Clients</span>
                  <span className="font-semibold">30+</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Current Time</span>
                  <span className="font-semibold">
                    {currentTime.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Featured Projects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "E-commerce Platform",
                description:
                  "A full-stack e-commerce solution with React and Node.js",
                image:
                  "https://via.placeholder.com/400x300/4F46E5/FFFFFF?text=E-commerce",
                technologies: ["React", "Node.js", "MongoDB"],
              },
              {
                title: "Task Management App",
                description:
                  "A collaborative task management application with real-time updates",
                image:
                  "https://via.placeholder.com/400x300/059669/FFFFFF?text=Task+App",
                technologies: ["Vue.js", "Express", "Socket.io"],
              },
              {
                title: "Portfolio Website",
                description:
                  "A modern portfolio website with animations and responsive design",
                image:
                  "https://via.placeholder.com/400x300/DC2626/FFFFFF?text=Portfolio",
                technologies: ["Next.js", "Tailwind CSS", "Framer Motion"],
              },
            ].map((project, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">
                    {project.title}
                  </h4>
                  <p className="text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                      View Project
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded hover:bg-gray-50">
                      Source Code
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Skills & Technologies
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "React", level: 90 },
              { name: "Node.js", level: 85 },
              { name: "Python", level: 80 },
              { name: "JavaScript", level: 95 },
              { name: "TypeScript", level: 85 },
              { name: "MongoDB", level: 75 },
              { name: "AWS", level: 70 },
              { name: "Docker", level: 65 },
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {skill.level}%
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Get In Touch
          </h3>
          <div className="max-w-2xl mx-auto">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 John Doe. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6 mt-4">
              <a href="#" className="text-gray-400 hover:text-white">
                LinkedIn
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                GitHub
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                Twitter
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main Demo Component
export default function LivePreviewDemo() {
  return (
    <PreviewProvider
      config={{
        websocketUrl: "ws://localhost:3001/preview",
        performanceMonitoring: true,
        errorReporting: true,
        autoSave: true,
        enableFullscreen: true,
        enableExport: true,
        enablePerformanceOverlay: true,
      }}
    >
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white p-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold">
              Live Portfolio Preview System
            </h1>
            <p className="text-blue-100 mt-1">
              Real-time preview with WebSockets, multi-device support, and
              export functionality
            </p>
          </div>
        </div>

        {/* Preview Area */}
        <div className="flex-1">
          <LivePreview>
            <DemoPortfolio />
          </LivePreview>
        </div>
      </div>
    </PreviewProvider>
  );
}
