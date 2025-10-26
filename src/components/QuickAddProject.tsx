import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Upload, 
  Github, 
  Globe, 
  Tag, 
  Save, 
  Eye, 
  Zap,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MediaUploader from './MediaUploader';
import GitHubScraper from './GitHubScraper';
import ProjectPreview from './ProjectPreview';
import AIHelpers from './AIHelpers';
import PublishWorkflow from './PublishWorkflow';
import VersionHistory from './VersionHistory';
import { versionService } from '@/services/versionService';

interface QuickAddProjectProps {
  onSave?: (project: any) => void;
  onPublish?: (project: any) => void;
  initialData?: any;
}

interface ProjectData {
  title: string;
  tagline: string;
  description: string;
  githubUrl: string;
  liveUrl: string;
  primaryTag: string;
  media: File | null;
  mediaPreview: string | null;
  techTags: string[];
  category: string;
}

const QuickAddProject: React.FC<QuickAddProjectProps> = ({ 
  onSave, 
  onPublish, 
  initialData 
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isScraping, setIsScraping] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [showPublishWorkflow, setShowPublishWorkflow] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [previousProjectData, setPreviousProjectData] = useState<ProjectData | null>(null);

  const [projectData, setProjectData] = useState<ProjectData>({
    title: initialData?.title || '',
    tagline: initialData?.tagline || '',
    description: initialData?.description || '',
    githubUrl: initialData?.githubUrl || '',
    liveUrl: initialData?.liveUrl || '',
    primaryTag: initialData?.primaryTag || '',
    media: null,
    mediaPreview: initialData?.mediaPreview || null,
    techTags: initialData?.techTags || [],
    category: initialData?.category || 'Web Development'
  });

  // Auto-save functionality
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (projectData.title || projectData.tagline || projectData.description) {
        handleAutoSave();
      }
    }, 10000); // Auto-save every 10 seconds

    return () => clearInterval(autoSaveInterval);
  }, [projectData]);

  // Auto-save on field blur
  const handleFieldBlur = () => {
    if (projectData.title || projectData.tagline || projectData.description) {
      handleAutoSave();
    }
  };

  const handleAutoSave = async () => {
    setIsAutoSaving(true);
    try {
      // Simulate auto-save API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const projectId = initialData?.id || `project_${Date.now()}`;
      
      // Create version snapshot if there are changes
      if (previousProjectData && JSON.stringify(previousProjectData) !== JSON.stringify(projectData)) {
        versionService.createSnapshot(
          projectId,
          { ...projectData, id: projectId, status: 'draft' },
          'draft_saved',
          previousProjectData
        );
      }
      
      // Save to localStorage as draft
      const draftData = {
        ...projectData,
        id: projectId,
        status: 'draft',
        lastSaved: new Date().toISOString()
      };
      
      const existingDrafts = JSON.parse(localStorage.getItem('project-drafts') || '[]');
      const updatedDrafts = existingDrafts.filter((draft: any) => draft.id !== draftData.id);
      updatedDrafts.push(draftData);
      localStorage.setItem('project-drafts', JSON.stringify(updatedDrafts));
      
      setPreviousProjectData({ ...projectData });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      setIsAutoSaving(false);
    }
  };

  const handleInputChange = (field: keyof ProjectData, value: string) => {
    setProjectData(prev => ({ ...prev, [field]: value }));
    setValidationErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Client-side compression
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProjectData(prev => ({
          ...prev,
          media: file,
          mediaPreview: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGithubUrlChange = async (url: string) => {
    setProjectData(prev => ({ ...prev, githubUrl: url }));
    
    if (url.includes('github.com')) {
      setIsScraping(true);
      try {
        // Simulate GitHub scraping
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Mock scraped data
        const scrapedData = {
          title: url.split('/').pop()?.replace(/-/g, ' ') || '',
          description: 'Auto-generated from GitHub repository',
          techTags: ['React', 'TypeScript', 'Node.js'],
          category: 'Web Development'
        };
        
        setProjectData(prev => ({
          ...prev,
          title: prev.title || scrapedData.title,
          description: prev.description || scrapedData.description,
          techTags: [...prev.techTags, ...scrapedData.techTags],
          category: scrapedData.category
        }));
      } catch (error) {
        console.error('Failed to scrape GitHub repo:', error);
      } finally {
        setIsScraping(false);
      }
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!projectData.title.trim()) {
      errors.title = 'Project title is required';
    }
    
    if (projectData.title.length > 100) {
      errors.title = 'Title must be 100 characters or less';
    }
    
    if (projectData.tagline && projectData.tagline.length > 75) {
      errors.tagline = 'Tagline must be 75 characters or less';
    }
    
    if (!projectData.media && !projectData.githubUrl && !projectData.liveUrl) {
      errors.media = 'Please add media, GitHub URL, or live URL';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    const projectId = initialData?.id || `project_${Date.now()}`;
    const project = {
      ...projectData,
      id: projectId,
      status: 'draft',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // Create version snapshot
    versionService.createSnapshot(
      projectId,
      project,
      'updated',
      previousProjectData
    );
    
    onSave?.(project);
    setPreviousProjectData({ ...projectData });
    
    // Show success toast
    console.log('Project saved as draft');
  };

  const handlePublish = async () => {
    if (!validateForm()) return;
    setShowPublishWorkflow(true);
  };

  const handlePublishConfirm = (project: any) => {
    // Create version snapshot for published version
    versionService.createSnapshot(
      project.id,
      project,
      'published',
      previousProjectData
    );
    
    onPublish?.(project);
    setShowPublishWorkflow(false);
    setPreviousProjectData({ ...projectData });
    navigate(`/showcase/view/${project.id}`);
  };

  const addTechTag = (tag: string) => {
    if (tag && !projectData.techTags.includes(tag)) {
      setProjectData(prev => ({
        ...prev,
        techTags: [...prev.techTags, tag]
      }));
    }
  };

  const removeTechTag = (tagToRemove: string) => {
    setProjectData(prev => ({
      ...prev,
      techTags: prev.techTags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleVersionRevert = (version: any) => {
    if (version.snapshot) {
      setProjectData(version.snapshot);
      setPreviousProjectData(version.snapshot);
    }
  };

  const handleVersionRestore = (version: any) => {
    if (version.snapshot) {
      setProjectData(version.snapshot);
      setPreviousProjectData(version.snapshot);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className={`grid gap-6 ${showVersionHistory ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        {/* Form Column */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                Quick Add Project
                {isAutoSaving && <Loader2 className="w-4 h-4 animate-spin text-blue-600" />}
                {lastSaved && !isAutoSaving && (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                )}
              </CardTitle>
              {lastSaved && (
                <p className="text-sm text-gray-500">
                  Draft saved {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Project Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Title *
                </label>
                <Input
                  placeholder="Name your project (e.g., FastChat)"
                  value={projectData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  onBlur={handleFieldBlur}
                  className={validationErrors.title ? 'border-red-500' : ''}
                />
                {validationErrors.title && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.title}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {projectData.title.length}/100 characters
                </p>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Short Tagline
                </label>
                <Input
                  placeholder="One-line elevator pitch (≤75 chars)"
                  value={projectData.tagline}
                  onChange={(e) => handleInputChange('tagline', e.target.value)}
                  onBlur={handleFieldBlur}
                  className={validationErrors.tagline ? 'border-red-500' : ''}
                />
                {validationErrors.tagline && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.tagline}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {projectData.tagline.length}/75 characters
                </p>
              </div>

              {/* Media Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Media *
                </label>
                <MediaUploader
                  onFilesChange={(files) => {
                    if (files.length > 0) {
                      const firstFile = files[0];
                      setProjectData(prev => ({
                        ...prev,
                        media: firstFile.file,
                        mediaPreview: firstFile.preview
                      }));
                    }
                  }}
                  maxFiles={1}
                  maxSize={50}
                  acceptedTypes={['image/*', 'video/*']}
                />
                {validationErrors.media && (
                  <p className="text-sm text-red-500 mt-1">{validationErrors.media}</p>
                )}
              </div>

              {/* GitHub URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GitHub URL
                </label>
                <div className="relative">
                  <Github className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="https://github.com/username/repo"
                    value={projectData.githubUrl}
                    onChange={(e) => handleGithubUrlChange(e.target.value)}
                    onBlur={handleFieldBlur}
                    className="pl-10"
                  />
                </div>
                {isScraping && (
                  <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Auto-filling from repository...
                  </p>
                )}
              </div>

              {/* GitHub Scraper */}
              {projectData.githubUrl && (
                <GitHubScraper
                  url={projectData.githubUrl}
                  onDataScraped={(data) => {
                    setProjectData(prev => ({
                      ...prev,
                      title: prev.title || data.name,
                      description: prev.description || data.description,
                      techTags: [...prev.techTags, ...Object.keys(data.languages).slice(0, 3)],
                      category: data.topics.includes('web') ? 'Web Development' : 
                               data.topics.includes('mobile') ? 'Mobile App' :
                               data.topics.includes('desktop') ? 'Desktop App' :
                               data.topics.includes('data') ? 'Data Science' : 'Web Development'
                    }));
                  }}
                />
              )}

              {/* Live URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Live URL
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="https://your-project.com"
                    value={projectData.liveUrl}
                    onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                    onBlur={handleFieldBlur}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Primary Tag */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Primary Tag
                </label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="e.g., React, Python, Design System"
                    value={projectData.primaryTag}
                    onChange={(e) => handleInputChange('primaryTag', e.target.value)}
                    onBlur={handleFieldBlur}
                    className="pl-10"
                  />
                </div>
                {projectData.primaryTag && (
                  <div className="mt-2">
                    <Badge variant="secondary" className="mr-2">
                      {projectData.primaryTag}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Tech Tags */}
              {projectData.techTags.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tech Stack
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {projectData.techTags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-red-50"
                        onClick={() => removeTechTag(tag)}
                      >
                        {tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className="flex-1"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Draft
                </Button>
                <Button
                  onClick={handlePublish}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Publish
                </Button>
              </div>

              {/* AI Helpers */}
              <AIHelpers
                projectTitle={projectData.title}
                projectDescription={projectData.description}
                techTags={projectData.techTags}
                onDescriptionGenerated={(description) => 
                  setProjectData(prev => ({ ...prev, description }))
                }
                onTagsGenerated={(tags) => 
                  setProjectData(prev => ({ ...prev, techTags: [...prev.techTags, ...tags] }))
                }
                onTaglineGenerated={(tagline) => 
                  setProjectData(prev => ({ ...prev, tagline }))
                }
              />

              {/* Advanced Options Toggle */}
              <div className="pt-4 border-t">
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="w-full"
                  >
                    {showAdvanced ? 'Hide' : 'Show'} Advanced Options
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setShowVersionHistory(!showVersionHistory)}
                    className="w-full"
                  >
                    {showVersionHistory ? 'Hide' : 'Show'} Version History
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Version History */}
        {showVersionHistory && (
          <div className="lg:col-span-2">
            <VersionHistory
              projectId={initialData?.id || `project_${Date.now()}`}
              onRevert={handleVersionRevert}
              onRestore={handleVersionRestore}
            />
          </div>
        )}

        {/* Preview Column */}
        <div className="space-y-6">
          <ProjectPreview projectData={projectData} />

          {/* Keyboard Shortcuts */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Keyboard Shortcuts</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div className="flex justify-between">
                <span>Save Draft</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl+S</kbd>
              </div>
              <div className="flex justify-between">
                <span>Publish</span>
                <kbd className="px-2 py-1 bg-gray-200 rounded text-xs">Ctrl+Enter</kbd>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Publish Workflow Modal */}
      <PublishWorkflow
        projectData={projectData}
        onPublish={handlePublishConfirm}
        onCancel={() => setShowPublishWorkflow(false)}
        isVisible={showPublishWorkflow}
      />
    </div>
  );
};

export default QuickAddProject;
