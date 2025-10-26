import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  AlertTriangle, 
  Eye, 
  Globe, 
  Lock, 
  Clock,
  Share2,
  ExternalLink,
  Loader2,
  X
} from 'lucide-react';

interface PublishWorkflowProps {
  projectData: any;
  onPublish: (project: any) => void;
  onCancel: () => void;
  isVisible: boolean;
}

interface ValidationResult {
  field: string;
  isValid: boolean;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

const PublishWorkflow: React.FC<PublishWorkflowProps> = ({
  projectData,
  onPublish,
  onCancel,
  isVisible
}) => {
  const [publishMode, setPublishMode] = useState<'immediate' | 'scheduled'>('immediate');
  const [scheduledDate, setScheduledDate] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private' | 'unlisted'>('public');
  const [isPublishing, setIsPublishing] = useState(false);
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);

  const validateProject = (): ValidationResult[] => {
    const results: ValidationResult[] = [];

    // Required fields
    if (!projectData.title?.trim()) {
      results.push({
        field: 'title',
        isValid: false,
        message: 'Project title is required',
        severity: 'error'
      });
    }

    if (!projectData.mediaPreview && !projectData.githubUrl && !projectData.liveUrl) {
      results.push({
        field: 'media',
        isValid: false,
        message: 'Please add media, GitHub URL, or live URL',
        severity: 'error'
      });
    }

    // Recommended fields
    if (!projectData.description?.trim()) {
      results.push({
        field: 'description',
        isValid: false,
        message: 'Description is recommended for better discoverability',
        severity: 'warning'
      });
    }

    if (!projectData.techTags?.length) {
      results.push({
        field: 'techTags',
        isValid: false,
        message: 'Tech tags help users find your project',
        severity: 'warning'
      });
    }

    if (!projectData.tagline?.trim()) {
      results.push({
        field: 'tagline',
        isValid: false,
        message: 'A tagline makes your project more appealing',
        severity: 'info'
      });
    }

    // URL validation
    if (projectData.githubUrl && !projectData.githubUrl.includes('github.com')) {
      results.push({
        field: 'githubUrl',
        isValid: false,
        message: 'Please enter a valid GitHub URL',
        severity: 'error'
      });
    }

    if (projectData.liveUrl && !projectData.liveUrl.startsWith('http')) {
      results.push({
        field: 'liveUrl',
        isValid: false,
        message: 'Please enter a valid URL (starting with http:// or https://)',
        severity: 'error'
      });
    }

    return results;
  };

  const handlePublish = async () => {
    const validation = validateProject();
    setValidationResults(validation);

    // Check if there are any errors
    const hasErrors = validation.some(result => result.severity === 'error');
    if (hasErrors) {
      return;
    }

    setIsPublishing(true);

    try {
      const publishData = {
        ...projectData,
        id: projectData.id || `project_${Date.now()}`,
        status: 'published',
        visibility,
        publishedAt: publishMode === 'immediate' ? new Date().toISOString() : scheduledDate,
        scheduledFor: publishMode === 'scheduled' ? scheduledDate : null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Simulate publish delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      onPublish(publishData);
    } catch (error) {
      console.error('Publish failed:', error);
    } finally {
      setIsPublishing(false);
    }
  };

  const getValidationIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <X className="w-4 h-4 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info':
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return null;
    }
  };

  const getValidationColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return 'border-red-200 bg-red-50';
      case 'warning':
        return 'border-yellow-200 bg-yellow-50';
      case 'info':
        return 'border-blue-200 bg-blue-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Publish Project</h2>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Validation Results */}
          {validationResults.length > 0 && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Pre-publish Check</h3>
              <div className="space-y-2">
                {validationResults.map((result, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 p-3 border rounded-lg ${getValidationColor(result.severity)}`}
                  >
                    {getValidationIcon(result.severity)}
                    <div className="flex-1">
                      <p className="text-sm font-medium capitalize">{result.field}</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Publish Options */}
          <div className="space-y-6">
            {/* Visibility Settings */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Visibility</h3>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={visibility === 'public' ? 'default' : 'outline'}
                  onClick={() => setVisibility('public')}
                  className="flex items-center space-x-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Public</span>
                </Button>
                <Button
                  variant={visibility === 'private' ? 'default' : 'outline'}
                  onClick={() => setVisibility('private')}
                  className="flex items-center space-x-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Private</span>
                </Button>
                <Button
                  variant={visibility === 'unlisted' ? 'default' : 'outline'}
                  onClick={() => setVisibility('unlisted')}
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Unlisted</span>
                </Button>
              </div>
            </div>

            {/* Publish Timing */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Publish Timing</h3>
              <div className="space-y-3">
                <Button
                  variant={publishMode === 'immediate' ? 'default' : 'outline'}
                  onClick={() => setPublishMode('immediate')}
                  className="w-full flex items-center space-x-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Publish Now</span>
                </Button>
                <Button
                  variant={publishMode === 'scheduled' ? 'default' : 'outline'}
                  onClick={() => setPublishMode('scheduled')}
                  className="w-full flex items-center space-x-2"
                >
                  <Clock className="w-4 h-4" />
                  <span>Schedule for Later</span>
                </Button>
                {publishMode === 'scheduled' && (
                  <div className="mt-3">
                    <input
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Project Summary */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">Project Summary</h3>
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Title:</span>
                      <span className="text-sm font-medium">{projectData.title || 'Untitled'}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Category:</span>
                      <Badge variant="outline">{projectData.category || 'Web Development'}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Visibility:</span>
                      <span className="text-sm font-medium capitalize">{visibility}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Publish:</span>
                      <span className="text-sm font-medium">
                        {publishMode === 'immediate' ? 'Now' : 'Scheduled'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => window.open('/preview', '_blank')}
                  className="flex items-center space-x-2"
                >
                  <Eye className="w-4 h-4" />
                  <span>Preview</span>
                </Button>
                <Button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="flex items-center space-x-2"
                >
                  {isPublishing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Share2 className="w-4 h-4" />
                  )}
                  <span>
                    {isPublishing ? 'Publishing...' : 'Publish Project'}
                  </span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishWorkflow;

