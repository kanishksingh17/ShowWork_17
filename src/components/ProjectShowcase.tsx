import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Save, Eye, Trash2, Plus, Upload, Link, Code, Palette } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: string;
  status: 'draft' | 'published' | 'archived';
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

const ProjectShowcase: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [project, setProject] = useState<Project>({
    id: '',
    title: '',
    description: '',
    technologies: [],
    category: '',
    status: 'draft',
    githubUrl: '',
    liveUrl: '',
    imageUrl: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [newTechnology, setNewTechnology] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const categories = [
    'Web Application',
    'Mobile App',
    'Desktop App',
    'API/Backend',
    'Data Science',
    'Machine Learning',
    'DevOps',
    'Game Development',
    'Design',
    'Other'
  ];

  const popularTechnologies = [
    'React', 'Vue.js', 'Angular', 'Next.js', 'Node.js', 'Express',
    'Python', 'Django', 'Flask', 'Java', 'Spring Boot', 'C#',
    'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS',
    'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes',
    'AWS', 'Azure', 'Google Cloud', 'Firebase', 'Supabase'
  ];

  useEffect(() => {
    if (isEdit && id) {
      loadProject(id);
    }
  }, [id, isEdit]);

  const loadProject = async (projectId: string) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/projects/${projectId}`);
      // const data = await response.json();
      
      // Mock data for now
      const mockProject: Project = {
        id: projectId,
        title: 'Sample Project',
        description: 'This is a sample project description.',
        technologies: ['React', 'TypeScript', 'Tailwind CSS'],
        category: 'Web Application',
        status: 'draft',
        githubUrl: 'https://github.com/username/project',
        liveUrl: 'https://project.example.com',
        imageUrl: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProject(mockProject);
    } catch (error) {
      console.error('Error loading project:', error);
      toast({
        title: 'Error',
        description: 'Failed to load project',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(isEdit ? `/api/projects/${id}` : '/api/projects', {
      //   method: isEdit ? 'PUT' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(project)
      // });
      
      // Mock success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: 'Success',
        description: `Project ${isEdit ? 'updated' : 'created'} successfully!`
      });
      
      navigate('/showcase');
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save project',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !id) return;
    
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      // TODO: Replace with actual API call
      // await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      
      toast({
        title: 'Success',
        description: 'Project deleted successfully!'
      });
      
      navigate('/showcase');
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive'
      });
    }
  };

  const addTechnology = () => {
    if (newTechnology.trim() && !project.technologies.includes(newTechnology.trim())) {
      setProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, newTechnology.trim()]
      }));
      setNewTechnology('');
    }
  };

  const removeTechnology = (tech: string) => {
    setProject(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const addPopularTechnology = (tech: string) => {
    if (!project.technologies.includes(tech)) {
      setProject(prev => ({
        ...prev,
        technologies: [...prev.technologies, tech]
      }));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/showcase')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Showcase
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isEdit ? 'Edit Project' : 'Create New Project'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Update your project details' : 'Add a new project to your showcase'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/showcase/view/${project.id}`)}
            disabled={!project.id}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving...' : 'Save Project'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Provide the essential details about your project
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Project Title *</Label>
                <Input
                  id="title"
                  value={project.title}
                  onChange={(e) => setProject(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter project title"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={project.description}
                  onChange={(e) => setProject(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your project, its features, and what makes it special"
                  rows={4}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={project.category}
                    onValueChange={(value) => setProject(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={project.status}
                    onValueChange={(value: 'draft' | 'published' | 'archived') => 
                      setProject(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technologies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Technologies Used
              </CardTitle>
              <CardDescription>
                Add the technologies, frameworks, and tools you used
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTechnology}
                  onChange={(e) => setNewTechnology(e.target.value)}
                  placeholder="Add a technology"
                  onKeyPress={(e) => e.key === 'Enter' && addTechnology()}
                />
                <Button onClick={addTechnology} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies.map(tech => (
                  <Badge key={tech} variant="secondary" className="flex items-center gap-1">
                    {tech}
                    <button
                      onClick={() => removeTechnology(tech)}
                      className="ml-1 hover:text-red-500"
                    >
                      ×
                    </button>
                  </Badge>
                ))}
              </div>
              
              <Separator />
              
              <div>
                <Label className="text-sm font-medium mb-2 block">Popular Technologies</Label>
                <div className="flex flex-wrap gap-2">
                  {popularTechnologies.map(tech => (
                    <Button
                      key={tech}
                      variant="outline"
                      size="sm"
                      onClick={() => addPopularTechnology(tech)}
                      disabled={project.technologies.includes(tech)}
                      className="text-xs"
                    >
                      {tech}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Links */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link className="h-5 w-5" />
                Project Links
              </CardTitle>
              <CardDescription>
                Add links to your project's repository and live demo
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="githubUrl">GitHub Repository</Label>
                <Input
                  id="githubUrl"
                  value={project.githubUrl || ''}
                  onChange={(e) => setProject(prev => ({ ...prev, githubUrl: e.target.value }))}
                  placeholder="https://github.com/username/project"
                  type="url"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="liveUrl">Live Demo</Label>
                <Input
                  id="liveUrl"
                  value={project.liveUrl || ''}
                  onChange={(e) => setProject(prev => ({ ...prev, liveUrl: e.target.value }))}
                  placeholder="https://your-project.com"
                  type="url"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Project Image URL</Label>
                <Input
                  id="imageUrl"
                  value={project.imageUrl || ''}
                  onChange={(e) => setProject(prev => ({ ...prev, imageUrl: e.target.value }))}
                  placeholder="https://example.com/project-image.jpg"
                  type="url"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Preview Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                How your project will appear in the showcase
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {project.imageUrl && (
                  <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={project.imageUrl}
                      alt={project.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                
                <div>
                  <h3 className="font-semibold text-lg">{project.title || 'Project Title'}</h3>
                  <p className="text-sm text-muted-foreground">{project.category || 'Category'}</p>
                </div>
                
                <p className="text-sm text-muted-foreground">
                  {project.description || 'Project description will appear here...'}
                </p>
                
                {project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.slice(0, 5).map(tech => (
                      <Badge key={tech} variant="outline" className="text-xs">
                        {tech}
                      </Badge>
                    ))}
                    {project.technologies.length > 5 && (
                      <Badge variant="outline" className="text-xs">
                        +{project.technologies.length - 5} more
                      </Badge>
                    )}
                  </div>
                )}
                
                <div className="flex gap-2 pt-2">
                  {project.githubUrl && (
                    <Button variant="outline" size="sm" className="text-xs">
                      <Code className="h-3 w-3 mr-1" />
                      Code
                    </Button>
                  )}
                  {project.liveUrl && (
                    <Button variant="outline" size="sm" className="text-xs">
                      <Eye className="h-3 w-3 mr-1" />
                      Live Demo
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectShowcase;








