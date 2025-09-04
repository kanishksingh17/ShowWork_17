import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Upload, Sparkles, Zap, Star, Users, Globe, Rocket, CheckCircle, XCircle, Loader } from 'lucide-react';
import TransitionPage from '../components/TransitionPage';

interface ProfileCompletionProps {
  user?: any;
  onComplete?: (profileData: ProfileData) => void;
}

interface ProfileData {
  username: string;
  fullName: string;
  bio: string;
  profilePicture: string;
}

export default function ProfileCompletion({ user, onComplete }: ProfileCompletionProps) {
  console.log('🔍 ProfileCompletion rendering with user:', user);
  console.log('🔍 ProfileCompletion component loaded successfully!');
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalUsername, setOriginalUsername] = useState('');
  const [profileData, setProfileData] = useState<ProfileData>({
    username: '',
    fullName: user?.name || '',
    bio: '',
    profilePicture: ''
  });
  const [loading, setLoading] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const [usernameValidation, setUsernameValidation] = useState<{
    isChecking: boolean;
    isValid: boolean | null;
    message: string;
  }>({
    isChecking: false,
    isValid: null,
    message: ''
  });

  // Initialize profile data when component mounts
  useEffect(() => {
    if (user) {
      const isEditing = !!(user.username || user.bio || user.avatar);
      setIsEditMode(isEditing);
      
      if (isEditing) {
        setOriginalUsername(user.username || '');
        setProfileData({
          username: user.username || '',
          fullName: user.name || '',
          bio: user.bio || '',
          profilePicture: user.avatar || ''
        });
      }
    }
  }, [user]);

  // Username validation function
  const validateUsername = useCallback((username: string): { isValid: boolean; message: string } => {
    if (!username) {
      return { isValid: false, message: 'Username is required' };
    }
    if (username.length < 3) {
      return { isValid: false, message: 'Username must be at least 3 characters' };
    }
    if (username.length > 20) {
      return { isValid: false, message: 'Username must be less than 20 characters' };
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return { isValid: false, message: 'Username can only contain letters, numbers, underscore and dash' };
    }
    if (/^[0-9]/.test(username)) {
      return { isValid: false, message: 'Username cannot start with a number' };
    }
    return { isValid: true, message: 'Username format is valid' };
  }, []);

  // Check username availability
  const checkUsernameAvailability = useCallback(async (username: string): Promise<boolean> => {
    try {
      // Don't check availability if it's the user's current username
      if (isEditMode && username === originalUsername) {
        return true;
      }
      
      // API call to check username availability
      const response = await fetch('/api/check-username', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username }),
      });
      
      if (response.ok) {
        const data = await response.json();
        return data.available;
      }
      
      // Fallback: simulate check with some common usernames being taken
      const takenUsernames = ['admin', 'user', 'test', 'demo', 'john', 'jane', 'developer', 'coder'];
      return !takenUsernames.includes(username.toLowerCase());
    } catch (error) {
      console.error('Username check failed:', error);
      // Fallback: assume available if API fails
      return true;
    }
  }, [isEditMode, originalUsername]);

  // Debounced username validation
  useEffect(() => {
    if (!profileData.username) {
      setUsernameValidation({ isChecking: false, isValid: null, message: '' });
      return;
    }

    const formatValidation = validateUsername(profileData.username);
    if (!formatValidation.isValid) {
      setUsernameValidation({ 
        isChecking: false, 
        isValid: false, 
        message: formatValidation.message 
      });
      return;
    }

    // If it's the user's current username, mark as valid immediately
    if (isEditMode && profileData.username === originalUsername) {
      setUsernameValidation({
        isChecking: false,
        isValid: true,
        message: 'Current username'
      });
      return;
    }

    setUsernameValidation({ isChecking: true, isValid: null, message: 'Checking availability...' });
    
    const timeoutId = setTimeout(async () => {
      const isAvailable = await checkUsernameAvailability(profileData.username);
      setUsernameValidation({
        isChecking: false,
        isValid: isAvailable,
        message: isAvailable ? 'Username is available!' : 'Username is already taken'
      });
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [profileData.username, isEditMode, originalUsername, validateUsername, checkUsernameAvailability]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileData(prev => ({ ...prev, profilePicture: e.target?.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate username before submission
    if (!profileData.username) {
      setUsernameValidation({ 
        isChecking: false, 
        isValid: false, 
        message: 'Username is required' 
      });
      return;
    }
    
    if (usernameValidation.isValid !== true) {
      // Wait for validation to complete or show error
      if (usernameValidation.isChecking) {
        return; // Still checking, don't submit yet
      } else {
        return; // Invalid username, don't submit
      }
    }
    
    setLoading(true);
    
    try {
      // Save profile to backend
      const response = await fetch('/api/profile/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for authentication
        body: JSON.stringify({
          username: profileData.username,
          fullName: profileData.fullName,
          bio: profileData.bio,
          profilePicture: profileData.profilePicture
        }),
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        console.log('Profile saved successfully:', result.user);
        
        if (onComplete) {
          onComplete(profileData);
        } else {
          // For existing users editing profile, go back to dashboard
          navigate('/dashboard');
        }
      } else {
        // Handle specific error cases
        if (result.message && result.message.includes('username')) {
          setUsernameValidation({
            isChecking: false,
            isValid: false,
            message: result.message
          });
        }
        throw new Error(result.message || 'Failed to save profile');
      }
      
    } catch (error: any) {
      console.error('Profile completion failed:', error);
      const errorMessage = error.message.includes('username') 
        ? `Username error: ${error.message}` 
        : `Error saving profile: ${error.message}. Please try again.`;
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/dashboard');
  };

  // Add a simple render check
  if (typeof window !== 'undefined') {
    console.log('🖥️ ProfileCompletion is rendering in browser');
  }

  // Show transition page after successful profile completion
  if (showTransition) {
    return (
      <TransitionPage 
        user={{
          name: profileData.fullName,
          username: profileData.username
        }}
        selectedPlatforms={['linkedin', 'github']} // Default platforms for basic profile
        profileData={profileData}
        onComplete={() => {
          navigate('/dashboard');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left Progress Panel */}
      <div className="w-2/5 bg-gradient-to-br from-green-600 via-green-700 to-green-800 p-8 flex flex-col justify-between relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-24 h-24 bg-white rounded-full"></div>
          <div className="absolute top-1/2 right-20 w-16 h-16 bg-white rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="relative z-10">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <Code2 className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </button>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white">
                Edit Profile
              </h1>
            </div>
            <p className="text-white/80 text-lg leading-relaxed">
              Update your information and username for your portfolio.
            </p>
          </div>
        </div>

        {/* Profile Preview */}
        <div className="relative z-10 space-y-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">Profile Preview</h3>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white text-lg font-bold overflow-hidden">
                {profileData.profilePicture ? (
                  <img 
                    src={profileData.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span>{profileData.fullName?.charAt(0) || 'U'}</span>
                )}
              </div>
              <div>
                <p className="text-white font-medium">
                  {profileData.fullName || 'Your Name'}
                </p>
                <p className="text-white/60 text-sm">
                  @{profileData.username || 'username'}
                </p>
              </div>
            </div>
            {profileData.username && usernameValidation.isValid === true && (
              <div className="mt-4 p-3 bg-white/10 rounded-lg">
                <p className="text-white/60 text-xs mb-1">Available at:</p>
                <p className="text-white text-sm font-mono break-all">
                  showwork.com/<strong>{profileData.username}</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="relative z-10">
          <div className="flex items-center justify-between text-white/80 text-sm mb-2">
            <span>Profile Completion</span>
            <span>85%</span>
          </div>
          <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-500 ease-out w-4/5" />
          </div>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="flex-1 bg-gray-50 flex flex-col">
        {/* Content Area */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <div className="space-y-8">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-bold text-gray-900">
                  Update Your Information
                </h2>
                <p className="text-gray-600 text-lg">
                  Make changes to your profile information below.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm space-y-6">
                {/* Profile Picture Upload */}
                <div className="text-center space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 text-left">
                    Profile Picture:
                  </label>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center text-white text-2xl font-bold overflow-hidden border-4 border-gray-200">
                      {profileData.profilePicture ? (
                        <img 
                          src={profileData.profilePicture} 
                          alt="Profile" 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{profileData.fullName?.charAt(0) || 'U'}</span>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureUpload}
                      className="hidden"
                      id="profile-picture"
                    />
                    <label
                      htmlFor="profile-picture"
                      className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-xl cursor-pointer hover:bg-green-700 transition-colors shadow-sm"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {profileData.profilePicture ? 'Change Photo' : 'Add Photo'}
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Upload a professional image—recommended size: 400x400px
                  </p>
                </div>

                {/* Username */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Username *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Choose a unique username"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400 pr-10 ${
                        usernameValidation.isValid === false 
                          ? 'border-red-300 focus:border-red-500' 
                          : usernameValidation.isValid === true 
                          ? 'border-green-300 focus:border-green-500'
                          : 'border-gray-300'
                      }`}
                      required
                      value={profileData.username}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase().replace(/[^a-zA-Z0-9_-]/g, '');
                        handleInputChange('username', value);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                      {usernameValidation.isChecking && (
                        <Loader className="h-4 w-4 text-gray-400 animate-spin" />
                      )}
                      {!usernameValidation.isChecking && usernameValidation.isValid === true && (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      )}
                      {!usernameValidation.isChecking && usernameValidation.isValid === false && profileData.username && (
                        <XCircle className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  {usernameValidation.message && (
                    <p className={`text-sm ${
                      usernameValidation.isValid === false ? 'text-red-600' : 
                      usernameValidation.isValid === true ? 'text-green-600' : 
                      'text-blue-600'
                    }`}>
                      {usernameValidation.message}
                    </p>
                  )}
                  <p className="text-sm text-gray-500">
                    Your username will be displayed in your public profile and must be unique.
                  </p>
                  {profileData.username && usernameValidation.isValid === true && (
                    <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-xl">
                      <p className="text-sm text-gray-600 mb-1">Your profile will be available at:</p>
                      <p className="text-base font-mono text-green-700 break-all">
                        showwork.com/<strong>{profileData.username}</strong>
                      </p>
                    </div>
                  )}
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 text-gray-900 placeholder-gray-400"
                    required
                    value={profileData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                  />
                </div>

                {/* Professional Bio */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Professional Bio
                  </label>
                  <textarea
                    placeholder="Share a brief summary of your professional journey."
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 resize-none text-gray-900 placeholder-gray-400"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Navigation Footer */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="max-w-2xl mx-auto flex justify-between items-center">
            <button
              type="button"
              onClick={handleSkip}
              className="flex items-center px-6 py-3 rounded-lg font-medium transition-all duration-300 bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Previous
            </button>
            <button
              type="submit"
              form="profile-form"
              onClick={handleSubmit}
              disabled={loading || usernameValidation.isChecking || usernameValidation.isValid !== true || !profileData.username}
              className={`px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
                loading || usernameValidation.isChecking || usernameValidation.isValid !== true || !profileData.username
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {isEditMode ? 'Updating...' : 'Saving...'}
                </div>
              ) : (
                isEditMode ? 'Update Profile' : 'Continue'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}