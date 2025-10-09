"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Rocket, 
  Palette, 
  Code, 
  Smartphone, 
  Monitor, 
  Sparkles,
  ArrowRight,
  Eye,
  Download
} from "lucide-react"

const templates = [
  {
    id: "modern-developer",
    name: "Modern Developer",
    category: "Developer",
    description: "Clean, professional layout perfect for developers",
    preview: "/templates/modern-developer.jpg",
    features: ["GitHub Integration", "Code Highlighting", "Project Showcase"]
  },
  {
    id: "creative-designer",
    name: "Creative Designer",
    category: "Designer",
    description: "Bold, artistic design for creative professionals",
    preview: "/templates/creative-designer.jpg",
    features: ["Portfolio Gallery", "Interactive Elements", "Visual Showcase"]
  },
  {
    id: "business-professional",
    name: "Business Professional",
    category: "Business",
    description: "Corporate layout for business professionals",
    preview: "/templates/business-professional.jpg",
    features: ["Resume Integration", "Achievement Timeline", "Contact Forms"]
  }
]

export default function PortfolioBuilder() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGeneratePortfolio = async () => {
    if (!selectedTemplate) return

    setIsGenerating(true)
    
    try {
      // Simulate portfolio generation
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Navigate to portfolio editor
      window.location.href = `/portfolio/editor/${selectedTemplate}`
    } catch (error) {
      console.error("Error generating portfolio:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create Your Perfect Portfolio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose from our professionally designed templates and generate your portfolio in minutes
          </p>
        </motion.div>

        {/* Template Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                  selectedTemplate === template.id 
                    ? "ring-2 ring-blue-500 shadow-lg" 
                    : "hover:shadow-lg"
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <CardHeader>
                  <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
                    <div className="text-center">
                      <Monitor className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                      <span className="text-sm text-gray-600">Template Preview</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{template.name}</CardTitle>
                  <p className="text-gray-600">{template.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {template.features.map((feature) => (
                      <span
                        key={feature}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {template.category}
                    </span>
                    <Button
                      variant={selectedTemplate === template.id ? "default" : "outline"}
                      size="sm"
                    >
                      {selectedTemplate === template.id ? "Selected" : "Select"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Generate Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <Button
            onClick={handleGeneratePortfolio}
            disabled={!selectedTemplate || isGenerating}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg"
          >
            {isGenerating ? (
              <>
                <Rocket className="w-5 h-5 mr-2 animate-bounce" />
                Generating Portfolio...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Portfolio
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI-Powered</h3>
            <p className="text-gray-600">
              Our AI automatically generates content and optimizes your portfolio
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Smartphone className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Mobile Ready</h3>
            <p className="text-gray-600">
              All templates are fully responsive and mobile-optimized
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Rocket className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant Deploy</h3>
            <p className="text-gray-600">
              Deploy your portfolio instantly with custom domains
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
