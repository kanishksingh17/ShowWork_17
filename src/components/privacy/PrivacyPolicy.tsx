import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Key, 
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const privacyFeatures = [
    {
      icon: Shield,
      title: 'Data Encryption',
      description: 'All your personal data is encrypted before storage',
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      icon: Lock,
      title: 'Secure Storage',
      description: 'Your data is stored securely with industry-standard security',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      icon: Eye,
      title: 'Privacy First',
      description: 'We never share your data with third parties without consent',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      icon: Database,
      title: 'Local Processing',
      description: 'AI processing happens locally when possible',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    {
      icon: Key,
      title: 'API Security',
      description: 'All API calls are secured with proper authentication',
      color: 'text-red-600',
      bgColor: 'bg-red-100'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
          <Shield className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-3xl font-bold">Privacy & Security</h1>
        <p className="text-muted-foreground text-lg">
          Your privacy and data security are our top priorities
        </p>
      </div>

      {/* Privacy Features */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {privacyFeatures.map((feature, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className={`w-12 h-12 ${feature.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                <feature.icon className={`h-6 w-6 ${feature.color}`} />
              </div>
              <CardTitle className="text-lg">{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Privacy Policy Content */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Data Collection & Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">What We Collect</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Personal information (name, email, title) for portfolio generation</li>
                <li>• Project data and descriptions for content optimization</li>
                <li>• Social media profiles (GitHub, LinkedIn) for auto-integration</li>
                <li>• Usage analytics to improve our AI recommendations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">How We Use Your Data</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Generate AI-optimized portfolio content</li>
                <li>• Provide personalized template recommendations</li>
                <li>• Auto-fetch and integrate your social profiles</li>
                <li>• Improve our AI algorithms and services</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Encryption</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• End-to-end encryption for all data</li>
                  <li>• Secure API communications</li>
                  <li>• Encrypted local storage</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Access Control</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Role-based access controls</li>
                  <li>• Multi-factor authentication</li>
                  <li>• Regular security audits</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Your Rights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-semibold mb-2">Data Control</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• View and download your data</li>
                  <li>• Update or correct information</li>
                  <li>• Delete your account and data</li>
                  <li>• Opt-out of data collection</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Transparency</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Clear data usage policies</li>
                  <li>• Regular privacy updates</li>
                  <li>• Open communication channels</li>
                  <li>• User consent for all data use</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              Important Notice
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 text-sm">
              By using our AI-powered portfolio builder, you consent to the collection and processing 
              of your data as described in this privacy policy. We are committed to protecting your 
              privacy and will never sell your personal information to third parties.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Terms Acceptance */}
      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
          <CardDescription>
            Please review and accept our terms to continue using the portfolio builder
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              id="accept-terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="accept-terms" className="text-sm">
              I have read and agree to the{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>
              {' '}and{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>
              . I understand that my data will be used to generate AI-optimized portfolio content.
            </label>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              disabled={!acceptedTerms}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Accept & Continue
            </Button>
            <Button variant="outline">
              Download Privacy Policy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardHeader>
          <CardTitle>Questions About Privacy?</CardTitle>
          <CardDescription>
            Contact us if you have any questions about our privacy practices
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Privacy Officer</h4>
              <p className="text-sm text-muted-foreground">
                Email: privacy@portfoliobuilder.ai<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Data Protection</h4>
              <p className="text-sm text-muted-foreground">
                We comply with GDPR, CCPA, and other privacy regulations.<br />
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

