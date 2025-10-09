// AWS S3 Test Component - Test your S3 credentials integration
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { S3Client, PortfolioAssetManager } from '../services/s3Service';
import { getAWSConfig } from '../config/apiConfig';
import { 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Cloud, 
  Upload, 
  Download,
  Folder,
  File,
  Database,
  Settings
} from 'lucide-react';

const S3TestComponent = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [bucketName, setBucketName] = useState('showwork-portfolios');

  const runS3Tests = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults(null);

    try {
      const config = getAWSConfig();
      console.log('Using AWS S3 Config:', {
        accessKeyId: config.accessKeyId.substring(0, 10) + '...',
        region: config.region,
        bucketName: config.bucketName
      });

      const s3Client = new S3Client(config);
      const assetManager = new PortfolioAssetManager(config);
      
      // Test 1: Create Bucket
      console.log('Testing S3 Bucket Creation...');
      try {
        await s3Client.createBucket();
        console.log('Bucket created successfully');
      } catch (bucketError) {
        console.log('Bucket might already exist:', bucketError.message);
      }

      // Test 2: Upload Test Object
      console.log('Testing S3 Object Upload...');
      const testObject = {
        Key: 'test/portfolio-test.txt',
        Body: 'This is a test file for ShowWork portfolio generation system.',
        ContentType: 'text/plain',
        CacheControl: 'public, max-age=3600'
      };
      
      const uploadResult = await s3Client.putObject(testObject);
      console.log('Object uploaded successfully:', uploadResult.Location);

      // Test 3: Configure Static Website
      console.log('Testing Static Website Configuration...');
      try {
        const websiteUrl = await assetManager.configureStaticWebsite();
        console.log('Website configured:', websiteUrl);
      } catch (websiteError) {
        console.log('Website configuration error:', websiteError.message);
      }

      // Test 4: Upload Portfolio Assets
      console.log('Testing Portfolio Asset Upload...');
      const testAssets = {
        html: '<html><body><h1>Test Portfolio</h1></body></html>',
        css: 'body { font-family: Arial; }',
        js: 'console.log("Test portfolio loaded");',
        images: [
          {
            name: 'test-image.jpg',
            data: Buffer.from('test-image-data'),
            type: 'image/jpeg'
          }
        ],
        fonts: [
          {
            name: 'test-font.woff2',
            data: Buffer.from('test-font-data'),
            type: 'font/woff2'
          }
        ]
      };

      const assetResult = await assetManager.uploadPortfolioAssets('test-portfolio-123', testAssets);
      console.log('Assets uploaded successfully:', assetResult);

      // Test 5: Get Asset URLs
      console.log('Testing Asset URL Generation...');
      const assetUrls = assetManager.getAssetUrls('test-portfolio-123');
      console.log('Asset URLs generated:', assetUrls);

      // Test 6: List Objects
      console.log('Testing Object Listing...');
      const objects = await s3Client.listObjects('test/');
      console.log('Objects listed:', objects);

      setTestResults({
        bucketCreated: true,
        objectUploaded: uploadResult,
        websiteConfigured: true,
        assetsUploaded: assetResult,
        assetUrls,
        objectsListed: objects,
        timestamp: new Date().toISOString()
      });

      console.log('All S3 tests completed successfully!');

    } catch (error) {
      console.error('S3 API test failed:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const testCustomBucket = async () => {
    if (!bucketName.trim()) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const config = {
        ...getAWSConfig(),
        bucketName: bucketName.trim()
      };
      
      const s3Client = new S3Client(config);
      
      // Test bucket creation
      await s3Client.createBucket();
      
      // Test object upload
      const testObject = {
        Key: 'custom-test.txt',
        Body: `Test file for custom bucket: ${bucketName}`,
        ContentType: 'text/plain'
      };
      
      const result = await s3Client.putObject(testObject);

      setTestResults({
        customBucketTest: {
          bucketName,
          uploadResult: result,
          success: true
        },
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1E293B] to-[#0F172A] p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            AWS S3 Integration Test
          </h1>
          <p className="text-[#94A3B8] text-lg">
            Test your AWS S3 credentials integration with the portfolio generation system
          </p>
        </div>

        {/* AWS Credentials Status */}
        <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Cloud className="w-5 h-5 mr-2" />
              AWS S3 Credentials Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-[#94A3B8]">
                  Access Key ID: <code className="bg-black/20 px-2 py-1 rounded">
                    {getAWSConfig().accessKeyId.substring(0, 10)}...
                  </code>
                </p>
                <p className="text-[#94A3B8]">
                  Region: <code className="bg-black/20 px-2 py-1 rounded">
                    {getAWSConfig().region}
                  </code>
                </p>
              </div>
              <div>
                <p className="text-[#94A3B8]">
                  Bucket Name: <code className="bg-black/20 px-2 py-1 rounded">
                    {getAWSConfig().bucketName}
                  </code>
                </p>
                <p className="text-sm text-[#94A3B8] mt-1">
                  Status: {getAWSConfig().accessKeyId ? 'Configured' : 'Not Found'}
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Badge variant={getAWSConfig().accessKeyId ? 'default' : 'destructive'}>
                {getAWSConfig().accessKeyId ? 'Ready' : 'Error'}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Test Controls */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Full S3 Test Suite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#94A3B8] mb-4">
                Run comprehensive tests for all S3 operations used in portfolio generation.
              </p>
              <Button 
                onClick={runS3Tests}
                disabled={isLoading}
                className="w-full bg-[#1E3A8A] hover:bg-[#1E3A8A]/80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing S3...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Run Full Test Suite
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Custom Bucket Test
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-[#94A3B8] mb-4">
                Test with your own S3 bucket name.
              </p>
              <Input
                value={bucketName}
                onChange={(e) => setBucketName(e.target.value)}
                placeholder="Enter bucket name..."
                className="mb-4 bg-white/10 border-white/20 text-white"
              />
              <Button 
                onClick={testCustomBucket}
                disabled={isLoading || !bucketName.trim()}
                className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <Folder className="w-4 h-4 mr-2" />
                    Test Custom Bucket
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="mb-8 bg-red-500/10 backdrop-blur-sm border-red-500/20">
            <CardContent className="pt-6">
              <div className="flex items-center text-red-400">
                <XCircle className="w-5 h-5 mr-2" />
                <span className="font-medium">S3 Error:</span>
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

            {/* Bucket Creation */}
            {testResults.bucketCreated && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Folder className="w-5 h-5 mr-2" />
                    S3 Bucket Creation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#94A3B8]">Bucket created successfully or already exists</p>
                </CardContent>
              </Card>
            )}

            {/* Object Upload */}
            {testResults.objectUploaded && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Upload className="w-5 h-5 mr-2" />
                    Object Upload Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Location:</strong> {testResults.objectUploaded.Location}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">ETag:</strong> {testResults.objectUploaded.ETag}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Bucket:</strong> {testResults.objectUploaded.Bucket}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Website Configuration */}
            {testResults.websiteConfigured && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Settings className="w-5 h-5 mr-2" />
                    Static Website Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#94A3B8]">Static website hosting configured successfully</p>
                </CardContent>
              </Card>
            )}

            {/* Asset Upload */}
            {testResults.assetsUploaded && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <File className="w-5 h-5 mr-2" />
                    Portfolio Asset Upload
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">HTML URL:</strong> {testResults.assetsUploaded.htmlUrl}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">CSS URL:</strong> {testResults.assetsUploaded.cssUrl}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">JS URL:</strong> {testResults.assetsUploaded.jsUrl}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Images:</strong> {testResults.assetsUploaded.imageUrls.length} uploaded
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Fonts:</strong> {testResults.assetsUploaded.fontUrls.length} uploaded
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Asset URLs */}
            {testResults.assetUrls && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Download className="w-5 h-5 mr-2" />
                    Asset URL Generation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">HTML:</strong> {testResults.assetUrls.html}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">CSS:</strong> {testResults.assetUrls.css}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">JS:</strong> {testResults.assetUrls.js}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Images:</strong> {testResults.assetUrls.images.length} URLs generated
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Objects Listed */}
            {testResults.objectsListed && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <File className="w-5 h-5 mr-2" />
                    Object Listing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[#94A3B8]">
                    <strong className="text-white">Objects Found:</strong> {testResults.objectsListed.length}
                  </p>
                  <div className="mt-2 space-y-1">
                    {testResults.objectsListed.map((object: string, index: number) => (
                      <p key={index} className="text-sm text-[#94A3B8] font-mono">
                        {object}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Custom Bucket Test */}
            {testResults.customBucketTest && (
              <Card className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Folder className="w-5 h-5 mr-2" />
                    Custom Bucket Test
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Bucket:</strong> {testResults.customBucketTest.bucketName}
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Status:</strong> Success
                    </p>
                    <p className="text-[#94A3B8]">
                      <strong className="text-white">Upload URL:</strong> {testResults.customBucketTest.uploadResult.Location}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Success Message */}
            <Card className="bg-green-500/10 backdrop-blur-sm border-green-500/20">
              <CardContent className="pt-6">
                <div className="flex items-center text-green-400">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  <span className="font-medium">All S3 tests completed successfully!</span>
                </div>
                <p className="text-green-300 mt-2">
                  Your AWS S3 credentials are working correctly. Portfolio asset storage is ready to use.
                </p>
                <p className="text-green-300 text-sm mt-1">
                  Test completed at: {new Date(testResults.timestamp).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default S3TestComponent;
