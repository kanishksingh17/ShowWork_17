"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  Sparkles, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Globe,
  Palette,
  User,
  Briefcase,
  Code,
  BookOpen,
  MessageSquare,
  Settings,
  Download,
  RefreshCw
} from "lucide-react"
import { UserInput } from "@/lib/ai-content-generator"

interface ContentGeneratorProps {
  onContentGenerated?: (content: any) => void
  initialInput?: Partial<UserInput>
  portfolioId?: string
}

export default function ContentGenerator({ 
  onContentGenerated, 
  initialInput,
  portfolioId 
}: ContentGeneratorProps) {
  const { data: session } = useSession()
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [generationStats, setGenerationStats] = useState<any>(null)

  // Form state
  const [input, setInput] = useState<UserInput>({
    role: initialInput?.role || '',
    industry: initialInput?.industry || '',
    experience: initialInput?.experience || 2,
    skills: initialInput?.skills || [],
    projects: initialInput?.projects || [],
    style: initialInput?.style || 'modern',
    colorPreferences: initialInput?.colorPreferences || [],
    language: initialInput?.language || 'en',
    tone: initialInput?.tone || 'professional',
    targetAudience: initialInput?.targetAudience || 'employers',
    includeTestimonials: initialInput?.includeTestimonials || false,
    includeBlog: initialInput?.includeBlog || false,
    includeResume: initialInput?.includeResume || true,
  })

  const [newSkill, setNewSkill] = useState('')
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    technologies: [] as string[],
    url: '',
    githubUrl: '',
  })
  const [newTech, setNewTech] = useState('')

  const handleGenerateContent = async () => {
    if (!session?.user?.id) {
      setError('Please sign in to generate content')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input,
          portfolioId,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to generate content')
      }

      setGeneratedContent(result.content)
      setGenerationStats(result.metadata)
      onContentGenerated?.(result.content)

    } catch (error) {
      console.error('Content generation failed:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerateContent = async () => {
    if (!session?.user?.id || !portfolioId) {
      setError('Portfolio ID required for regeneration')
      return
    }

    setIsGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/ai/regenerate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          portfolioId,
          updates: input,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Failed to regenerate content')
      }

      setGeneratedContent(result.content)
      setGenerationStats(result.metadata)
      onContentGenerated?.(result.content)

    } catch (error) {
      console.error('Content regeneration failed:', error)
      setError(error instanceof Error ? error.message : 'Unknown error occurred')
    } finally {
      setIsGenerating(false)
    }
  }

  const addSkill = () => {
    if (newSkill.trim() && !input.skills.includes(newSkill.trim())) {
      setInput(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }

  const removeSkill = (skill: string) => {
    setInput(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const addProject = () => {
    if (newProject.name.trim() && newProject.description.trim()) {
      setInput(prev => ({
        ...prev,
        projects: [...(prev.projects || []), {
          name: newProject.name.trim(),
          description: newProject.description.trim(),
          technologies: newProject.technologies,
          url: newProject.url || undefined,
          githubUrl: newProject.githubUrl || undefined,
        }]
      }))
      setNewProject({
        name: '',
        description: '',
        technologies: [],
        url: '',
        githubUrl: '',
      })
    }
  }

  const addTechToProject = () => {
    if (newTech.trim() && !newProject.technologies.includes(newTech.trim())) {
      setNewProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTech.trim()]
      }))
      setNewTech('')
    }
  }

  const removeTechFromProject = (tech: string) => {
    setNewProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }))
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          AI Content Generator
        </h1>
        <p className="text-gray-600">
          Generate professional portfolio content using AI
        </p>
      </div>

      {/* Input Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Basic Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role *
              </label>
              <Input
                value={input.role}
                onChange={(e) => setInput(prev => ({ ...prev, role: e.target.value }))}
                placeholder="e.g., Full Stack Developer"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Industry *
              </label>
              <Input
                value={input.industry}
                onChange={(e) => setInput(prev => ({ ...prev, industry: e.target.value }))}
                placeholder="e.g., Technology"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Experience (years)
              </label>
              <Input
                type="number"
                min="0"
                max="50"
                value={input.experience}
                onChange={(e) => setInput(prev => ({ ...prev, experience: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Style
              </label>
              <select
                value={input.style}
                onChange={(e) => setInput(prev => ({ ...prev, style: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="modern">Modern</option>
                <option value="minimal">Minimal</option>
                <option value="creative">Creative</option>
                <option value="professional">Professional</option>
                <option value="corporate">Corporate</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                value={input.language}
                onChange={(e) => setInput(prev => ({ ...prev, language: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="zh">中文</option>
                <option value="ja">日本語</option>
                <option value="ko">한국어</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tone
              </label>
              <select
                value={input.tone}
                onChange={(e) => setInput(prev => ({ ...prev, tone: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="professional">Professional</option>
                <option value="casual">Casual</option>
                <option value="friendly">Friendly</option>
                <option value="authoritative">Authoritative</option>
                <option value="creative">Creative</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Target Audience
              </label>
              <select
                value={input.targetAudience}
                onChange={(e) => setInput(prev => ({ ...prev, targetAudience: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="employers">Employers</option>
                <option value="clients">Clients</option>
                <option value="peers">Peers</option>
                <option value="general">General</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill} size="sm">
              Add
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {input.skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm flex items-center gap-1"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Project name"
            />
            <Input
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Project description"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              value={newProject.url}
              onChange={(e) => setNewProject(prev => ({ ...prev, url: e.target.value }))}
              placeholder="Live URL (optional)"
            />
            <Input
              value={newProject.githubUrl}
              onChange={(e) => setNewProject(prev => ({ ...prev, githubUrl: e.target.value }))}
              placeholder="GitHub URL (optional)"
            />
          </div>
          <div className="flex gap-2">
            <Input
              value={newTech}
              onChange={(e) => setNewTech(e.target.value)}
              placeholder="Add technology"
              onKeyPress={(e) => e.key === 'Enter' && addTechToProject()}
            />
            <Button onClick={addTechToProject} size="sm">
              Add Tech
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {newProject.technologies.map((tech, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm flex items-center gap-1"
              >
                {tech}
                <button
                  onClick={() => removeTechFromProject(tech)}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
          <Button onClick={addProject} className="w-full">
            Add Project
          </Button>
          {input.projects && input.projects.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium">Added Projects:</h4>
              {input.projects.map((project, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <h5 className="font-medium">{project.name}</h5>
                  <p className="text-sm text-gray-600">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Additional Options
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeTestimonials"
              checked={input.includeTestimonials}
              onChange={(e) => setInput(prev => ({ ...prev, includeTestimonials: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="includeTestimonials" className="text-sm font-medium">
              Include Testimonials
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeBlog"
              checked={input.includeBlog}
              onChange={(e) => setInput(prev => ({ ...prev, includeBlog: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="includeBlog" className="text-sm font-medium">
              Include Blog Section
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="includeResume"
              checked={input.includeResume}
              onChange={(e) => setInput(prev => ({ ...prev, includeResume: e.target.checked }))}
              className="rounded"
            />
            <label htmlFor="includeResume" className="text-sm font-medium">
              Include Resume Download
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="font-medium">Error</span>
            </div>
            <p className="text-red-700 mt-1">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Generation Stats */}
      {generationStats && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Generation Complete</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm">
              <div>
                <span className="text-green-600">Time:</span> {generationStats.generationTime}ms
              </div>
              <div>
                <span className="text-green-600">Sections:</span> {generationStats.sectionsGenerated}
              </div>
              <div>
                <span className="text-green-600">Language:</span> {generationStats.language}
              </div>
              <div>
                <span className="text-green-600">Cache:</span> {generationStats.cacheHit ? 'Hit' : 'Miss'}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button
          onClick={handleGenerateContent}
          disabled={isGenerating || !input.role || !input.industry}
          className="flex-1 bg-blue-600 hover:bg-blue-700"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating Content...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Content
            </>
          )}
        </Button>
        
        {portfolioId && (
          <Button
            onClick={handleRegenerateContent}
            disabled={isGenerating}
            variant="outline"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Regenerate
          </Button>
        )}
      </div>

      {/* Generated Content Preview */}
      {generatedContent && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Generated Content Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {Object.entries(generatedContent).map(([section, content]) => (
                <div key={section} className="border rounded-lg p-4">
                  <h4 className="font-medium text-lg mb-2 capitalize">
                    {section.replace(/([A-Z])/g, ' $1').trim()}
                  </h4>
                  <pre className="text-sm text-gray-600 whitespace-pre-wrap">
                    {JSON.stringify(content, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
