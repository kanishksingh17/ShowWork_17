import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Eye, 
  Github, 
  Globe, 
  Star, 
  Code, 
  Smartphone, 
  Monitor,
  ExternalLink,
  Play,
  Image as ImageIcon
} from 'lucide-react';

interface ProjectPreviewProps {
  projectData: {
    title: string;
    tagline: string;
    description: string;
    githubUrl: string;
    liveUrl: string;
    primaryTag: string;
    techTags: string[];
    category: string;
    mediaPreview: string | null;
    media?: File | null;
  };
  className?: string;
}

const ProjectPreview: React.FC<ProjectPreviewProps> = ({
  projectData,
  className = ''
}) => {
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [showFullDescription, setShowFullDescription] = useState(false);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Web Development': 'bg-blue-100 text-blue-800',
      'Mobile App': 'bg-green-100 text-green-800',
      'Desktop App': 'bg-purple-100 text-purple-800',
      'Data Science': 'bg-orange-100 text-orange-800',
      'Machine Learning': 'bg-pink-100 text-pink-800',
      'Game Development': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getTechTagColor = (tag: string) => {
    const colors: Record<string, string> = {
      'React': 'bg-blue-50 text-blue-700 border-blue-200',
      'Vue': 'bg-green-50 text-green-700 border-green-200',
      'Angular': 'bg-red-50 text-red-700 border-red-200',
      'TypeScript': 'bg-blue-50 text-blue-700 border-blue-200',
      'JavaScript': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'Python': 'bg-green-50 text-green-700 border-green-200',
      'Node.js': 'bg-green-50 text-green-700 border-green-200',
      'Next.js': 'bg-gray-50 text-gray-700 border-gray-200',
      'Express': 'bg-gray-50 text-gray-700 border-gray-200',
      'MongoDB': 'bg-green-50 text-green-700 border-green-200',
      'PostgreSQL': 'bg-blue-50 text-blue-700 border-blue-200',
      'Docker': 'bg-blue-50 text-blue-700 border-blue-200',
      'AWS': 'bg-orange-50 text-orange-700 border-orange-200',
      'Firebase': 'bg-yellow-50 text-yellow-700 border-yellow-200'
    };
    return colors[tag] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  const isVideo = (url: string) => {
    return url && (url.includes('.mp4') || url.includes('.webm') || url.includes('.mov'));
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Preview Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === 'desktop' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('desktop')}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'mobile' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('mobile')}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Preview Container */}
      <div className={`transition-all duration-300 ${
        viewMode === 'mobile' ? 'max-w-sm mx-auto' : 'max-w-2xl'
      }`}>
        <Card className="overflow-hidden hover:shadow-lg transition-shadow">
          {/* Media Section */}
          {projectData.mediaPreview && (
            <div className="relative">
              {isVideo(projectData.mediaPreview) ? (
                <div className="relative bg-gray-100 aspect-video flex items-center justify-center">
                  <video
                    src={projectData.mediaPreview}
                    className="w-full h-full object-cover"
                    controls
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                    <Play className="w-12 h-12 text-white" />
                  </div>
                </div>
              ) : (
                <img
                  src={projectData.mediaPreview}
                  alt={projectData.title || 'Project preview'}
                  className="w-full h-48 object-cover"
                />
              )}
              {projectData.category && (
                <div className="absolute top-3 left-3">
                  <Badge className={getCategoryColor(projectData.category)}>
                    {projectData.category}
                  </Badge>
                </div>
              )}
            </div>
          )}

          <CardContent className="p-6">
            {/* Project Title */}
            <div className="mb-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {projectData.title || 'Project Title'}
              </h2>
              {projectData.tagline && (
                <p className="text-gray-600 text-sm">
                  {projectData.tagline}
                </p>
              )}
            </div>

            {/* Description */}
            {projectData.description && (
              <div className="mb-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  {showFullDescription 
                    ? projectData.description 
                    : truncateText(projectData.description, 150)
                  }
                  {projectData.description.length > 150 && (
                    <button
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="text-blue-600 hover:text-blue-800 ml-1 text-sm"
                    >
                      {showFullDescription ? 'Show less' : 'Read more'}
                    </button>
                  )}
                </p>
              </div>
            )}

            {/* Tech Stack */}
            {projectData.techTags.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Tech Stack</h4>
                <div className="flex flex-wrap gap-2">
                  {projectData.techTags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className={getTechTagColor(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Tag */}
            {projectData.primaryTag && (
              <div className="mb-4">
                <Badge variant="secondary" className="text-sm">
                  {projectData.primaryTag}
                </Badge>
              </div>
            )}

            {/* Links */}
            <div className="flex items-center space-x-4 mb-4">
              {projectData.githubUrl && (
                <a
                  href={projectData.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
              {projectData.liveUrl && (
                <a
                  href={projectData.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <Globe className="w-4 h-4" />
                  <span>Live Demo</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Stats (Mock) */}
            <div className="flex items-center space-x-4 text-sm text-gray-500 pt-4 border-t">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>1.2k views</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4" />
                <span>24 likes</span>
              </div>
              <div className="flex items-center space-x-1">
                <Code className="w-4 h-4" />
                <span>95% quality</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Preview Info */}
      <div className="text-center">
        <p className="text-sm text-gray-500">
          This is how your project will appear to visitors
        </p>
        {viewMode === 'mobile' && (
          <p className="text-xs text-gray-400 mt-1">
            Mobile view • Swipe to see more
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectPreview;

