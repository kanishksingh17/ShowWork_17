"use client"

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Star, 
  Sparkles, 
  Clock, 
  TrendingUp,
  Zap,
  Palette,
  Code,
  Image,
  Video,
  Music,
  FileText,
  Users,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram,
  Youtube,
  Facebook,
  ChevronDown,
  ChevronUp,
  X,
  Plus,
  Heart,
  Eye,
  Download,
  Share2,
  Settings,
  HelpCircle,
  Info,
  AlertCircle,
  CheckCircle,
  Lightbulb,
  Target,
  Rocket,
  Award,
  Briefcase,
  GraduationCap,
  Book,
  Camera,
  Mic,
  Headphones,
  Gamepad2,
  Paintbrush,
  PenTool,
  Scissors,
  Wrench,
  Hammer,
  Shield,
  Lock,
  Unlock,
  Key,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
  Battery,
  BatteryLow,
  Power,
  PowerOff,
  Play,
  Pause,
  Stop,
  SkipBack,
  SkipForward,
  Repeat,
  Shuffle,
  Volume1,
  MicOff,
  VideoOff,
  Monitor,
  Smartphone,
  Tablet,
  Laptop,
  Desktop,
  Tv,
  Watch,
  HeadphonesIcon,
  Speaker,
  Radio,
  Disc,
  Vinyl,
  Cd,
  Cassette,
  Film,
  Clapperboard,
  CameraIcon,
  VideoIcon,
  ImageIcon,
  Picture,
  Photo,
  Gallery,
  Album,
  Folder,
  FolderOpen,
  File,
  FileText as FileTextIcon,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FilePdf,
  FileWord,
  FileExcel,
  FilePowerpoint,
  Archive,
  Zip,
  Rar,
  Tar,
  Gz,
  Bz2,
  Xz,
  SevenZip,
  Iso,
  Dmg,
  Exe,
  Msi,
  Deb,
  Rpm,
  Apk,
  Ipa,
  Aab,
  Jar,
  War,
  Ear,
  Sar,
  Nar,
  Kar,
  Mar,
  Par,
  WarIcon,
  EarIcon,
  SarIcon,
  NarIcon,
  KarIcon,
  MarIcon,
  ParIcon
} from 'lucide-react'
import { usePortfolioBuilder } from './context'
import { ComponentLibraryItem, AISuggestion } from './types'

// Component library data
const componentLibraryData: ComponentLibraryItem[] = [
  // Hero Components
  {
    id: 'hero-1',
    name: 'Hero Section',
    description: 'Eye-catching hero section with title, subtitle, and CTA',
    icon: 'Rocket',
    category: 'hero',
    tags: ['hero', 'landing', 'cta', 'banner'],
    preview: '/previews/hero-1.jpg',
    component: () => <div>Hero Component</div>,
    defaultProps: {
      title: 'Welcome to My Portfolio',
      subtitle: 'I create amazing digital experiences',
      ctaText: 'Get Started',
      ctaLink: '#',
      backgroundImage: '',
      backgroundColor: '#000000',
      textColor: '#ffffff'
    },
    isPopular: true,
    isNew: false,
    usage: 1250
  },
  {
    id: 'hero-2',
    name: 'Animated Hero',
    description: 'Hero section with smooth animations and particle effects',
    icon: 'Sparkles',
    category: 'hero',
    tags: ['hero', 'animation', 'particles', 'modern'],
    preview: '/previews/hero-2.jpg',
    component: () => <div>Animated Hero Component</div>,
    defaultProps: {
      title: 'Creative Developer',
      subtitle: 'Building the future, one line of code at a time',
      ctaText: 'View Work',
      ctaLink: '#',
      animationType: 'fadeInUp',
      particleCount: 50
    },
    isPopular: false,
    isNew: true,
    usage: 89
  },

  // About Components
  {
    id: 'about-1',
    name: 'About Section',
    description: 'Personal introduction with photo and description',
    icon: 'User',
    category: 'about',
    tags: ['about', 'bio', 'introduction', 'personal'],
    preview: '/previews/about-1.jpg',
    component: () => <div>About Component</div>,
    defaultProps: {
      name: 'John Doe',
      title: 'Full Stack Developer',
      description: 'Passionate developer with 5+ years of experience',
      image: '/images/profile.jpg',
      skills: ['React', 'Node.js', 'Python', 'AWS']
    },
    isPopular: true,
    isNew: false,
    usage: 980
  },
  {
    id: 'about-2',
    name: 'Timeline About',
    description: 'Chronological timeline of your career and achievements',
    icon: 'Clock',
    category: 'about',
    tags: ['about', 'timeline', 'career', 'history'],
    preview: '/previews/about-2.jpg',
    component: () => <div>Timeline About Component</div>,
    defaultProps: {
      events: [
        { year: '2020', title: 'Started at Tech Corp', description: 'Joined as Junior Developer' },
        { year: '2022', title: 'Promoted to Senior', description: 'Led multiple projects' }
      ]
    },
    isPopular: false,
    isNew: true,
    usage: 45
  },

  // Skills Components
  {
    id: 'skills-1',
    name: 'Skills Grid',
    description: 'Visual grid of your technical skills with proficiency levels',
    icon: 'Target',
    category: 'skills',
    tags: ['skills', 'technical', 'proficiency', 'grid'],
    preview: '/previews/skills-1.jpg',
    component: () => <div>Skills Grid Component</div>,
    defaultProps: {
      skills: [
        { name: 'JavaScript', level: 90, category: 'Frontend' },
        { name: 'Python', level: 85, category: 'Backend' },
        { name: 'React', level: 95, category: 'Frontend' }
      ],
      showCategories: true,
      showLevels: true
    },
    isPopular: true,
    isNew: false,
    usage: 750
  },
  {
    id: 'skills-2',
    name: 'Circular Skills',
    description: 'Circular progress indicators for skill visualization',
    icon: 'Zap',
    category: 'skills',
    tags: ['skills', 'circular', 'progress', 'visual'],
    preview: '/previews/skills-2.jpg',
    component: () => <div>Circular Skills Component</div>,
    defaultProps: {
      skills: [
        { name: 'Design', level: 80, color: '#ff6b6b' },
        { name: 'Development', level: 95, color: '#4ecdc4' },
        { name: 'Marketing', level: 70, color: '#45b7d1' }
      ],
      size: 120,
      strokeWidth: 8
    },
    isPopular: false,
    isNew: true,
    usage: 120
  },

  // Projects Components
  {
    id: 'projects-1',
    name: 'Project Gallery',
    description: 'Grid layout showcasing your best projects',
    icon: 'Briefcase',
    category: 'projects',
    tags: ['projects', 'gallery', 'portfolio', 'work'],
    preview: '/previews/projects-1.jpg',
    component: () => <div>Project Gallery Component</div>,
    defaultProps: {
      projects: [
        {
          title: 'E-commerce Platform',
          description: 'Full-stack e-commerce solution',
          image: '/images/project-1.jpg',
          technologies: ['React', 'Node.js', 'MongoDB'],
          link: 'https://example.com'
        }
      ],
      columns: 3,
      showOverlay: true
    },
    isPopular: true,
    isNew: false,
    usage: 1100
  },
  {
    id: 'projects-2',
    name: 'Project Carousel',
    description: 'Interactive carousel for project showcase',
    icon: 'Play',
    category: 'projects',
    tags: ['projects', 'carousel', 'interactive', 'showcase'],
    preview: '/previews/projects-2.jpg',
    component: () => <div>Project Carousel Component</div>,
    defaultProps: {
      projects: [],
      autoplay: true,
      autoplaySpeed: 3000,
      showDots: true,
      showArrows: true
    },
    isPopular: false,
    isNew: true,
    usage: 67
  },

  // Contact Components
  {
    id: 'contact-1',
    name: 'Contact Form',
    description: 'Professional contact form with validation',
    icon: 'Mail',
    category: 'contact',
    tags: ['contact', 'form', 'email', 'validation'],
    preview: '/previews/contact-1.jpg',
    component: () => <div>Contact Form Component</div>,
    defaultProps: {
      fields: [
        { name: 'name', type: 'text', label: 'Name', required: true },
        { name: 'email', type: 'email', label: 'Email', required: true },
        { name: 'message', type: 'textarea', label: 'Message', required: true }
      ],
      submitText: 'Send Message',
      successMessage: 'Thank you for your message!'
    },
    isPopular: true,
    isNew: false,
    usage: 890
  },
  {
    id: 'contact-2',
    name: 'Contact Info',
    description: 'Display your contact information and social links',
    icon: 'Phone',
    category: 'contact',
    tags: ['contact', 'info', 'social', 'links'],
    preview: '/previews/contact-2.jpg',
    component: () => <div>Contact Info Component</div>,
    defaultProps: {
      email: 'hello@example.com',
      phone: '+1 (555) 123-4567',
      address: '123 Main St, City, State 12345',
      socialLinks: [
        { platform: 'LinkedIn', url: 'https://linkedin.com/in/username', icon: 'Linkedin' },
        { platform: 'GitHub', url: 'https://github.com/username', icon: 'Github' }
      ]
    },
    isPopular: false,
    isNew: true,
    usage: 234
  }
]

// AI Suggestions component
const AISuggestions: React.FC = () => {
  const { state, actions } = usePortfolioBuilder()
  const [isExpanded, setIsExpanded] = useState(true)

  useEffect(() => {
    actions.loadAISuggestions()
  }, [actions])

  const handleApplySuggestion = (suggestion: AISuggestion) => {
    actions.applyAISuggestion(suggestion)
    actions.dismissAISuggestion(suggestion.id)
  }

  const handleDismissSuggestion = (id: string) => {
    actions.dismissAISuggestion(id)
  }

  if (state.aiSuggestions.length === 0) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-semibold text-gray-900">AI Suggestions</h3>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-1 text-gray-600 hover:text-gray-800"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            {state.aiSuggestions.map((suggestion) => (
              <motion.div
                key={suggestion.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-lg p-3 border border-purple-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-gray-900">{suggestion.title}</h4>
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {Math.round(suggestion.confidence * 100)}% match
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{suggestion.description}</p>
                    <p className="text-xs text-gray-500">{suggestion.reason}</p>
                  </div>
                  <div className="flex items-center space-x-2 ml-3">
                    <button
                      onClick={() => handleApplySuggestion(suggestion)}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                    >
                      Apply
                    </button>
                    <button
                      onClick={() => handleDismissSuggestion(suggestion.id)}
                      className="p-1 text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Component Library Sidebar
export const ComponentLibrary: React.FC = () => {
  const { state, actions } = usePortfolioBuilder()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter and sort components
  const filteredComponents = useMemo(() => {
    let filtered = componentLibraryData

    // Apply search query
    if (state.searchFilters.query) {
      const query = state.searchFilters.query.toLowerCase()
      filtered = filtered.filter(component =>
        component.name.toLowerCase().includes(query) ||
        component.description.toLowerCase().includes(query) ||
        component.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(component => component.category === selectedCategory)
    }

    // Apply tag filters
    if (state.searchFilters.tags.length > 0) {
      filtered = filtered.filter(component =>
        state.searchFilters.tags.some(tag =>
          component.tags.some(componentTag => componentTag.toLowerCase().includes(tag.toLowerCase()))
        )
      )
    }

    // Apply popularity filter
    if (state.searchFilters.isPopular) {
      filtered = filtered.filter(component => component.isPopular)
    }

    // Apply new filter
    if (state.searchFilters.isNew) {
      filtered = filtered.filter(component => component.isNew)
    }

    // Sort components
    filtered.sort((a, b) => {
      const order = state.searchFilters.sortOrder === 'asc' ? 1 : -1
      switch (state.searchFilters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name) * order
        case 'usage':
          return (a.usage - b.usage) * order
        case 'popularity':
          return (a.isPopular ? 1 : 0 - b.isPopular ? 1 : 0) * order
        default:
          return 0
      }
    })

    return filtered
  }, [state.searchFilters, selectedCategory])

  // Get unique categories
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(componentLibraryData.map(component => component.category))]
    return cats
  }, [])

  // Get icon component
  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      Rocket, Sparkles, User, Clock, Target, Zap, Briefcase, Play, Mail, Phone,
      Grid, List, Star, TrendingUp, Palette, Code, Image, Video, Music, FileText,
      Users, MapPin, Globe, Github, Linkedin, Twitter, Instagram, Youtube, Facebook
    }
    return iconMap[iconName] || HelpCircle
  }

  const handleComponentDragStart = (component: ComponentLibraryItem) => {
    actions.startDrag({
      id: component.id,
      type: 'component',
      component: {
        id: component.id,
        type: component.category as any,
        name: component.name,
        description: component.description,
        icon: component.icon,
        category: 'content',
        tags: component.tags,
        defaultProps: component.defaultProps,
        styles: {},
        animations: {},
        isDraggable: true,
        isNestable: false,
        order: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      source: 'library'
    })
  }

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Component Library</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-gray-800'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search components..."
            value={state.searchFilters.query}
            onChange={(e) => actions.updateSearchFilters({ query: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 text-sm rounded-full capitalize ${
                selectedCategory === category
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => actions.updateSearchFilters({ isPopular: !state.searchFilters.isPopular })}
            className={`flex items-center space-x-1 text-sm ${
              state.searchFilters.isPopular ? 'text-yellow-600' : 'text-gray-600'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Popular</span>
          </button>
          <button
            onClick={() => actions.updateSearchFilters({ isNew: !state.searchFilters.isNew })}
            className={`flex items-center space-x-1 text-sm ${
              state.searchFilters.isNew ? 'text-green-600' : 'text-gray-600'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>New</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* AI Suggestions */}
        <AISuggestions />

        {/* Components */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 gap-4' : 'space-y-3'}>
          {filteredComponents.map((component) => {
            const IconComponent = getIconComponent(component.icon)
            
            return (
              <motion.div
                key={component.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                draggable
                onDragStart={() => handleComponentDragStart(component)}
                className={`bg-white border border-gray-200 rounded-lg p-4 cursor-grab hover:shadow-md transition-shadow ${
                  viewMode === 'list' ? 'flex items-center space-x-4' : ''
                }`}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <IconComponent className="w-5 h-5 text-blue-600" />
                        <h3 className="font-medium text-gray-900">{component.name}</h3>
                      </div>
                      <div className="flex items-center space-x-1">
                        {component.isPopular && (
                          <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        )}
                        {component.isNew && (
                          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{component.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {component.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{component.usage} uses</span>
                      <span className="capitalize">{component.category}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <IconComponent className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 truncate">{component.name}</h3>
                        <div className="flex items-center space-x-1">
                          {component.isPopular && (
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                          )}
                          {component.isNew && (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                              New
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{component.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex flex-wrap gap-1">
                          {component.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">{component.usage} uses</span>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )
          })}
        </div>

        {filteredComponents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No components found</p>
            <p className="text-sm">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ComponentLibrary
