import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import SetupCompletePage from './SetupCompletePage';

export default function SetupCompleteDemo() {
  const [showTransition, setShowTransition] = useState(false);
  const [userName, setUserName] = useState('Alex');
  const navigate = useNavigate();

  const handleShowTransition = () => {
    setShowTransition(true);
  };

  const handleBack = () => {
    setShowTransition(false);
  };

  if (showTransition) {
    return <SetupCompletePage userName={userName} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Transition Page Demo</CardTitle>
          <CardDescription>
            Test the setup completion transition page with custom user names
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="userName">User Name</Label>
            <Input
              id="userName"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter user name"
            />
          </div>
          
          <div className="space-y-2">
            <Button onClick={handleShowTransition} className="w-full">
              Show Transition Page
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate('/dashboard')} 
              className="w-full"
            >
              Go to Dashboard Directly
            </Button>
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')} 
              className="w-full"
            >
              Back to Home
            </Button>
          </div>

          <div className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <p><strong>Features:</strong></p>
            <ul className="list-disc list-inside space-y-1 text-xs">
              <li>Automatic redirect to dashboard after 4 seconds</li>
              <li>Staggered BlurFade animations (0.25s, 0.50s, 0.75s delays)</li>
              <li>Spinning loader icon from lucide-react</li>
              <li>Responsive design with flexbox centering</li>
              <li>Customizable userName prop</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}