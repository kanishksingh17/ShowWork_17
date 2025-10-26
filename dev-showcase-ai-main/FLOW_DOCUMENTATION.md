# ShowWork Complete User Flow Documentation

## Overview

This document outlines the complete user flow for the ShowWork SaaS platform, from landing page to dashboard functionality.

## User Flow Architecture

### 1. Landing Page Flow

**File:** `src/components/ShowWorkLanding.tsx`

**Flow:**

- User visits the main landing page
- Sees hero section with "Start Building Free" and "Watch Demo" buttons
- Both buttons navigate to `/login` page
- Features showcase and testimonials sections
- Footer with social links

**Key Features:**

- Responsive design with mobile navigation
- Animated elements and hover effects
- Clear call-to-action buttons
- Professional portfolio previews

### 2. Authentication Flow

**File:** `src/pages/Login.tsx`

**Available Authentication Methods:**

1. **Google OAuth** - Redirects to `/api/auth/google`
2. **GitHub OAuth** - Redirects to `/api/auth/github`
3. **Email/Password** - Local authentication with localStorage

**Flow:**

- User selects authentication method
- OAuth users: Redirected to provider → Account selection → Callback → Profile setup
- Email/Password users: Form validation → Local storage → Dashboard

**New User Detection:**

- OAuth users: `profileCompleted: false` in database
- Email users: No profile data in localStorage

### 3. Profile Setup Flow (New Users Only)

**File:** `src/components/DeveloperProfileSetup.tsx`

**4-Step Process:**

#### Step 1: Basic Information

- **Username:** Required, unique, auto-generated from OAuth name
- **Full Name:** Pre-filled from OAuth data
- **Bio:** Optional description
- **Pre-fill Indicator:** Green banner showing "Pre-filled from Google"

#### Step 2: Tech Stack Selection

- **Available Technologies:** React, Node.js, Python, JavaScript, TypeScript, etc.
- **Selection:** Multiple technologies allowed
- **Visual Feedback:** Selected items highlighted with checkmarks
- **Progress Tracking:** Shows number of selected technologies

#### Step 3: Skill Assessment Quiz

- **Trigger:** Only if tech stacks are selected
- **Question Source:** Local question bank (`src/utils/questionBank.ts`)
- **Question Types:** Multiple choice, difficulty-based
- **Scoring:** Star-based rating system
- **Skip Option:** Available if no tech stacks selected

#### Step 4: Platform Selection

- **Available Platforms:** Web, Mobile, Desktop, API, etc.
- **Selection:** Multiple platforms allowed
- **Final Step:** Completes profile setup

**Data Persistence:**

- All data saved to MongoDB via `/api/profile/update`
- Sets `profileCompleted: true`
- Stores quiz results and skill levels
- Updates user profile in database

### 4. Dashboard Flow (Existing Users)

**File:** `src/pages/Dashboard.tsx`

**User Detection Logic:**

```javascript
if (!data.user.profileCompleted || !data.user.username) {
  // Show profile setup
  setShowDeveloperSetup(true);
} else {
  // Show dashboard
  setDashboardReady(true);
}
```

**Dashboard Features:**

- **User Profile:** Top-right corner with avatar and name
- **Sidebar Navigation:** Home, Projects, Analytics, Settings, etc.
- **Main Content:** Project showcase, analytics, quick actions
- **Responsive Design:** Mobile-friendly layout

**Navigation Options:**

- Home Dashboard
- Projects Management
- Analytics & Insights
- Settings & Profile
- Help & Support

## Technical Implementation

### Authentication Backend

**File:** `server/server.js`

**OAuth Strategies:**

- **Google OAuth:** Lines 88-118, with account selection
- **GitHub OAuth:** Lines 126-170, with account selection
- **User Creation:** New users created with `profileCompleted: false`

**Session Management:**

- Express sessions with MongoDB store
- Secure cookie configuration
- Session persistence across requests

### Database Schema

**File:** `server/models/User.js`

**Key Fields:**

- `profileCompleted: Boolean` - Profile setup completion flag
- `onboardingStep: Number` - Current step in onboarding
- `username: String` - Unique username for profile URLs
- `skills: Array` - User's technical skills with proficiency levels
- `quizResults: Array` - Quiz attempt results and scores

### API Endpoints

**Profile Management:**

- `GET /api/portfolio/profile` - Fetch user profile
- `POST /api/profile/update` - Update profile data
- `GET /api/profile/username/:username` - Check username availability

**Authentication:**

- `GET /api/auth/google` - Google OAuth initiation
- `GET /api/auth/github` - GitHub OAuth initiation
- `GET /api/auth/logout` - User logout

## Error Handling & Fallbacks

### Authentication Errors

- OAuth failures redirect to login with error message
- Network errors show retry options
- Invalid credentials display specific error messages

### Profile Setup Errors

- Username conflicts show suggestions
- Form validation with real-time feedback
- Network errors allow retry without data loss

### Database Errors

- Connection failures show user-friendly messages
- Data validation errors prevent invalid submissions
- Automatic retry mechanisms for transient failures

## Performance Optimizations

### Frontend

- Lazy loading for route components
- Optimized bundle splitting
- Efficient state management
- Minimal re-renders

### Backend

- Database connection pooling
- Optimized queries with proper indexing
- Session caching
- Efficient OAuth flow handling

## Security Considerations

### Authentication

- Secure OAuth redirect URLs
- Session-based authentication
- CSRF protection
- Input validation and sanitization

### Data Protection

- Password hashing (for email/password users)
- Secure session storage
- Input validation
- SQL injection prevention

## Testing Scenarios

### New User Flow

1. **Google OAuth:** Landing → Login → Google → Account Selection → Profile Setup → Dashboard
2. **GitHub OAuth:** Landing → Login → GitHub → Authorization → Profile Setup → Dashboard
3. **Email/Password:** Landing → Login → Signup → Profile Setup → Dashboard

### Existing User Flow

1. **OAuth Users:** Landing → Login → OAuth → Dashboard (skip profile setup)
2. **Email Users:** Landing → Login → Dashboard (skip profile setup)

### Error Scenarios

1. **Network Failures:** Graceful error handling with retry options
2. **OAuth Errors:** Clear error messages with fallback options
3. **Database Errors:** User-friendly error messages
4. **Validation Errors:** Real-time form validation feedback

## Deployment Considerations

### Environment Variables

- `GOOGLE_CLIENT_ID` - Google OAuth credentials
- `GITHUB_CLIENT_ID` - GitHub OAuth credentials
- `MONGO_URI` - MongoDB connection string
- `SESSION_SECRET` - Session encryption key

### Production URLs

- Update OAuth callback URLs for production domain
- Configure CORS for production frontend URL
- Set up proper session configuration for HTTPS

## Maintenance & Updates

### Regular Tasks

- Monitor OAuth credential expiration
- Update question bank for skill assessment
- Review and update tech stack options
- Monitor database performance

### Feature Updates

- Add new authentication providers
- Expand quiz question categories
- Add new platform options
- Enhance dashboard features

## Troubleshooting

### Common Issues

1. **Port Conflicts:** Use `start-all.bat` or `start-servers.ps1`
2. **OAuth Errors:** Check credentials and callback URLs
3. **Database Connection:** Verify MongoDB is running
4. **Profile Setup Not Showing:** Check `profileCompleted` flag

### Debug Tools

- Console logging throughout the flow
- Network request monitoring
- Database query logging
- Session state tracking
