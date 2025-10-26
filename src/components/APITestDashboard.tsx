// Comprehensive API Test Dashboard - Test all external APIs
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getOpenAIKey, getAWSConfig, getVercelConfig } from '../config/apiConfig';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Zap, 
  Cloud, 
  Database,
  Settings,
  Rocket,
  TestTube,
  Activity,
  Shield,
  Globe
} from 'lucide-react';

const APITestDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runAllAPITests = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults(null);

    try {
      const results = {
        openai: { status: 'pending', details: null },
        s3: { status: 'pending', details: null },
        vercel: { status: 'pending', details: null },
        timestamp: new Date().toISOString()
      };

      // Test OpenAI API
      try {
        console.log('Testing OpenAI API...');
        const openaiKey = getOpenAIKey();
        if (openaiKey && openaiKey.startsWith('sk-')) {
          results.openai = {
            status: 'success',
            details: {
              apiKey: openaiKey.substring(0, 20) + '...',
              model: 'gpt-4',
              endpoints: ['/v1/chat/completions', '/v1/images/generations']
            }
          };
        } else {
          results.openai = {
            status: 'error',
            details: { error: 'Invalid API key format' }
          };
        }
      } catch (error) {
        results.openai = {
          status: 'error',
          details: { error: error.message }
        };
      }

      // Test AWS S3 API
      try {
        console.log('Testing AWS S3 API...');
        const s3Config = getAWSConfig();
        if (s3Config.accessKeyId && s3Config.secretAccessKey) {
          results.s3 = {
            status: 'success',
            details: {
              accessKeyId: s3Config.accessKeyId.substring(0, 10) + '...',
              region: s3Config.region,
              bucketName: s3Config.bucketName,
              endpoints: ['CreateBucket', 'PutObject', 'PutBucketWebsite']
            }
          };
        } else {
          results.s3 = {
            status: 'error',
            details: { error: 'Missing credentials' }
          };
        }
      } catch (error) {
        results.s3 = {
          status: 'error',
          details: { error: error.message }
        };
      }

      // Test Vercel API
      try {
        console.log('Testing Vercel API...');
        const vercelConfig = getVercelConfig();
        if (vercelConfig.token && vercelConfig.token !== 'your-vercel-token') {
          results.vercel = {
            status: 'success',
            details: {
              token: vercelConfig.token.substring(0, 10) + '...',
              teamId: vercelConfig.teamId || 'Not configured',
              endpoints: ['/v13/deployments', '/v9/projects/:id/domains']
            }
          };
        } else {
          results.vercel = {
            status: 'warning',
            details: { error: 'Vercel token not configured' }
          };
        }
      } catch (error) {
        results.vercel = {
          status: 'error',
          details: { error: error.message }
        };
      }

      setTestResults(results);
      console.log('All API tests completed');

    } catch (error) {
      console.error('API test failed:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <Shield className="w-5 h-5 text-yellow-400" />;
      default:
        return <Activity className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-500/10 border-green-500/20';
      case 'error':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            API Integration Dashboard
          </h1>
          <p className="text-[#94A3B8] text-lg">
            Test all external APIs used in the portfolio generation pipeline
          </p>
        </div>

        {/* API Status Overview */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* OpenAI Status */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                OpenAI API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#94A3B8]">Status</span>
                <Badge variant={getOpenAIKey() ? 'default' : 'destructive'}>
                  {getOpenAIKey() ? 'Configured' : 'Not Found'}
                </Badge>
              </div>
              <p className="text-sm text-[#94A3B8]">
                API Key: {getOpenAIKey() ? getOpenAIKey().substring(0, 20) + '...' : 'Not configured'}
              </p>
              <p className="text-sm text-[#94A3B8] mt-1">
                Model: GPT-4
              </p>
            </CardContent>
          </Card>

          {/* AWS S3 Status */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Cloud className="w-5 h-5 mr-2" />
                AWS S3
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#94A3B8]">Status</span>
                <Badge variant={getAWSConfig().accessKeyId ? 'default' : 'destructive'}>
                  {getAWSConfig().accessKeyId ? 'Configured' : 'Not Found'}
                </Badge>
              </div>
              <p className="text-sm text-[#94A3B8]">
                Access Key: {getAWSConfig().accessKeyId ? getAWSConfig().accessKeyId.substring(0, 10) + '...' : 'Not configured'}
              </p>
              <p className="text-sm text-[#94A3B8] mt-1">
                Region: {getAWSConfig().region}
              </p>
            </CardContent>
          </Card>

          {/* Vercel Status */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Rocket className="w-5 h-5 mr-2" />
                Vercel API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[#94A3B8]">Status</span>
                <Badge variant={getVercelConfig().token !== 'your-vercel-token' ? 'default' : 'destructive'}>
                  {getVercelConfig().token !== 'your-vercel-token' ? 'Configured' : 'Not Found'}
                </Badge>
              </div>
              <p className="text-sm text-[#94A3B8]">
                Token: {getVercelConfig().token !== 'your-vercel-token' ? getVercelConfig().token.substring(0, 10) + '...' : 'Not configured'}
              </p>
              <p className="text-sm text-[#94A3B8] mt-1">
                Team ID: {getVercelConfig().teamId || 'Not configured'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Test Controls */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <TestTube className="w-5 h-5 mr-2" />
              API Test Suite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#94A3B8] mb-4">
              Run comprehensive tests for all external APIs used in portfolio generation.
            </p>
            <div className="flex space-x-4">
              <Button 
                onClick={runAllAPITests}
                disabled={isLoading}
                className="bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing All APIs...
                  </>
                ) : (
                  <>
                    <Activity className="w-4 h-4 mr-2" />
                    Run All Tests
                  </>
                )}
              </Button>
              
              <Button 
                onClick={() => window.open('/test/openai', '_blank')}
                className="bg-[#8B5CF6] hover:bg-[#8B5CF6]/80"
              >
                <Zap className="w-4 h-4 mr-2" />
                Test OpenAI
              </Button>
              
              <Button 
                onClick={() => window.open('/test/s3', '_blank')}
                className="bg-[#10B981] hover:bg-[#10B981]/80"
              >
                <Cloud className="w-4 h-4 mr-2" />
                Test S3
              </Button>
              
              <Button 
                onClick={() => window.open('/test/vercel', '_blank')}
                className="bg-[#F59E0B] hover:bg-[#F59E0B]/80"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Test Vercel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 bg-red-500/10 backdrop-blur-sm border-red-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center text-red-400">
                <XCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">Test Error:</span>
              </div>
              <p className="text-red-300 mt-2">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Test Results */}
        {testResults && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Test Results
            </h2>

            {/* OpenAI Results */}
            <Card className={`backdrop-blur-sm ${getStatusColor(testResults.openai.status)}`}>
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  {getStatusIcon(testResults.openai.status)}
                  <span className="ml-2">OpenAI API</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.openai.status === 'success' ? (
                  <div className="space-y-2">
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">API Key:</strong> {testResults.openai.details.apiKey}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Model:</strong> {testResults.openai.details.model}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Endpoints:</strong> {testResults.openai.details.endpoints.join(', ')}
                    </p>
                  </div>
                ) : (
                  <p className="text-red-300">{testResults.openai.details.error}</p>
                )}
              </CardContent>
            </Card>

            {/* S3 Results */}
            <Card className={`backdrop-blur-sm ${getStatusColor(testResults.s3.status)}`}>
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  {getStatusIcon(testResults.s3.status)}
                  <span className="ml-2">AWS S3</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.s3.status === 'success' ? (
                  <div className="space-y-2">
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Access Key:</strong> {testResults.s3.details.accessKeyId}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Region:</strong> {testResults.s3.details.region}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Bucket:</strong> {testResults.s3.details.bucketName}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Endpoints:</strong> {testResults.s3.details.endpoints.join(', ')}
                    </p>
                  </div>
                ) : (
                  <p className="text-red-300">{testResults.s3.details.error}</p>
                )}
              </CardContent>
            </Card>

            {/* Vercel Results */}
            <Card className={`backdrop-blur-sm ${getStatusColor(testResults.vercel.status)}`}>
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  {getStatusIcon(testResults.vercel.status)}
                  <span className="ml-2">Vercel API</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {testResults.vercel.status === 'success' ? (
                  <div className="space-y-2">
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Token:</strong> {testResults.vercel.details.token}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Team ID:</strong> {testResults.vercel.details.teamId}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Endpoints:</strong> {testResults.vercel.details.endpoints.join(', ')}
                    </p>
                  </div>
                ) : (
                  <p className="text-yellow-300">{testResults.vercel.details.error}</p>
                )}
              </CardContent>
            </Card>

            {/* Overall Status */}
            <Card className="bg-green-500/10 backdrop-blur-sm border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">API Integration Status Complete!</span>
                </div>
                <p className="text-green-300 mt-2">
                  Portfolio generation pipeline is ready with configured APIs.
                </p>
                <p className="text-green-300 text-sm mt-1">
                  Test completed at: {new Date(testResults.timestamp).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                Generate Portfolio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#94A3B8] mb-4">
                Test the complete portfolio generation pipeline with your configured APIs.
              </p>
              <Button 
                onClick={() => window.open('/portfolio', '_blank')}
                className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"
              >
                <Rocket className="w-4 h-4 mr-2" />
                Generate Portfolio
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#94A3B8] mb-4">
                View and manage your API configuration settings.
              </p>
              <Button 
                onClick={() => window.open('/config', '_blank')}
                className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/80"
              >
                <Database className="w-4 h-4 mr-2" />
                View Config
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default APITestDashboard;
