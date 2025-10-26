import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Loader2, 
  Wand2, 
  Tag, 
  FileText, 
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface AIHelpersProps {
  projectTitle: string;
  projectDescription: string;
  techTags: string[];
  onDescriptionGenerated: (description: string) => void;
  onTagsGenerated: (tags: string[]) => void;
  onTaglineGenerated: (tagline: string) => void;
  className?: string;
}

interface AIGeneration {
  id: string;
  type: 'description' | 'tags' | 'tagline';
  prompt: string;
  result: string | string[];
  timestamp: Date;
}

const AIHelpers: React.FC<AIHelpersProps> = ({
  projectTitle,
  projectDescription,
  techTags,
  onDescriptionGenerated,
  onTagsGenerated,
  onTaglineGenerated,
  className = ''
}) => {
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [generations, setGenerations] = useState<AIGeneration[]>([]);
  const [error, setError] = useState<string | null>(null);

  const generateWithAI = async (type: 'description' | 'tags' | 'tagline', prompt: string) => {
    setIsGenerating(type);
    setError(null);

    try {
      // Simulate AI API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      let result: string | string[];
      
      switch (type) {
        case 'description':
          result = `A modern ${projectTitle.toLowerCase()} built with cutting-edge technology. This project showcases innovative solutions and best practices in software development. Features include responsive design, scalable architecture, and user-friendly interface. Perfect for developers looking to learn and implement modern web technologies.`;
          break;
        case 'tags':
          result = ['Modern', 'Responsive', 'Scalable', 'User-Friendly', 'Innovative'];
          break;
        case 'tagline':
          result = `Revolutionary ${projectTitle.toLowerCase()} for the modern web`;
          break;
        default:
          result = '';
      }

      const generation: AIGeneration = {
        id: `gen_${Date.now()}`,
        type,
        prompt,
        result,
        timestamp: new Date()
      };

      setGenerations(prev => [generation, ...prev.slice(0, 4)]); // Keep last 5 generations

      // Apply the result
      if (type === 'description') {
        onDescriptionGenerated(result as string);
      } else if (type === 'tags') {
        onTagsGenerated(result as string[]);
      } else if (type === 'tagline') {
        onTaglineGenerated(result as string);
      }

    } catch (err) {
      console.error('AI generation failed:', err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setIsGenerating(null);
    }
  };

  const generateDescription = () => {
    const prompt = `Generate a compelling project description for "${projectTitle}"`;
    generateWithAI('description', prompt);
  };

  const generateTags = () => {
    const prompt = `Generate relevant tags for a project called "${projectTitle}"`;
    generateWithAI('tags', prompt);
  };

  const generateTagline = () => {
    const prompt = `Generate a catchy tagline for "${projectTitle}"`;
    generateWithAI('tagline', prompt);
  };

  const getGenerationIcon = (type: string) => {
    switch (type) {
      case 'description':
        return <FileText className="w-4 h-4" />;
      case 'tags':
        return <Tag className="w-4 h-4" />;
      case 'tagline':
        return <MessageSquare className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const formatResult = (result: string | string[]) => {
    if (Array.isArray(result)) {
      return result.join(', ');
    }
    return result.length > 100 ? result.substring(0, 100) + '...' : result;
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-600" />
            AI Content Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Error Message */}
          {error && (
            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <span className="text-sm text-red-600">{error}</span>
            </div>
          )}

          {/* AI Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Button
              onClick={generateDescription}
              disabled={isGenerating === 'description'}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isGenerating === 'description' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              <span>Generate Description</span>
            </Button>

            <Button
              onClick={generateTags}
              disabled={isGenerating === 'tags'}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isGenerating === 'tags' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Tag className="w-4 h-4" />
              )}
              <span>Suggest Tags</span>
            </Button>

            <Button
              onClick={generateTagline}
              disabled={isGenerating === 'tagline'}
              variant="outline"
              className="flex items-center space-x-2"
            >
              {isGenerating === 'tagline' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <MessageSquare className="w-4 h-4" />
              )}
              <span>Create Tagline</span>
            </Button>
          </div>

          {/* Current Content Analysis */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Content Analysis</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Title:</span>
                <span className={projectTitle ? 'text-green-600' : 'text-gray-500'}>
                  {projectTitle ? '✓ Present' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Description:</span>
                <span className={projectDescription ? 'text-green-600' : 'text-gray-500'}>
                  {projectDescription ? '✓ Present' : 'Missing'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Tech Tags:</span>
                <span className={techTags.length > 0 ? 'text-green-600' : 'text-gray-500'}>
                  {techTags.length > 0 ? `✓ ${techTags.length} tags` : 'None'}
                </span>
              </div>
            </div>
          </div>

          {/* Generation History */}
          {generations.length > 0 && (
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Recent Generations</h4>
              <div className="space-y-2">
                {generations.slice(0, 3).map((generation) => (
                  <div
                    key={generation.id}
                    className="flex items-start space-x-3 p-3 bg-white border rounded-lg"
                  >
                    <div className="flex-shrink-0">
                      {getGenerationIcon(generation.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {generation.type}
                        </span>
                        <CheckCircle className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-gray-500">
                          {generation.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {formatResult(generation.result)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Smart Suggestions */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Smart Suggestions</h4>
            <div className="space-y-2 text-sm text-blue-800">
              {!projectDescription && (
                <p>• Add a description to improve discoverability</p>
              )}
              {techTags.length < 3 && (
                <p>• Add more tech tags to help users find your project</p>
              )}
              {!projectTitle && (
                <p>• A clear title helps users understand your project</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIHelpers;

