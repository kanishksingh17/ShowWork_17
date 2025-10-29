# ShowWork API Documentation

## Base URL

- **Development:** `http://localhost:5001`
- **Production:** `https://yourdomain.com`

## Authentication

### OAuth Endpoints

#### Google OAuth

```
GET /api/auth/google
```

**Description:** Initiates Google OAuth flow with account selection
**Response:** Redirects to Google OAuth consent screen
**Query Parameters:** None
**Headers:** None required

#### Google OAuth Callback

```
GET /api/auth/google/callback
```

**Description:** Handles Google OAuth callback
**Response:** Redirects to frontend dashboard
**Query Parameters:**

- `code` (string): Authorization code from Google
- `state` (string): State parameter for security

#### GitHub OAuth

```
GET /api/auth/github
```

**Description:** Initiates GitHub OAuth flow
**Response:** Redirects to GitHub authorization screen
**Query Parameters:** None
**Headers:** None required

#### GitHub OAuth Callback

```
GET /api/auth/github/callback
```

**Description:** Handles GitHub OAuth callback
**Response:** Redirects to frontend dashboard
**Query Parameters:**

- `code` (string): Authorization code from GitHub
- `state` (string): State parameter for security

#### Logout

```
GET /api/auth/logout
```

**Description:** Logs out the current user
**Response:** Redirects to login page
**Headers:** None required

## Profile Management

### Get User Profile

```
GET /api/portfolio/profile
```

**Description:** Retrieves current user's profile information
**Authentication:** Required (session-based)
**Headers:**

- `Cookie`: Session cookie

**Response:**

```json
{
  "success": true,
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string",
    "username": "string",
    "avatar": "string",
    "bio": "string",
    "profileCompleted": boolean,
    "onboardingStep": number,
    "skills": [
      {
        "name": "string",
        "proficiency": number,
        "category": "string"
      }
    ],
    "quizResults": [
      {
        "technology": "string",
        "score": number,
        "attempts": number,
        "lastAttempt": "date"
      }
    ],
    "socials": {
      "linkedin": "string",
      "twitter": "string",
      "github": "string",
      "instagram": "string",
      "youtube": "string"
    },
    "createdAt": "date",
    "updatedAt": "date"
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Not authenticated. Please log in to access your profile."
}
```

### Update User Profile

```
POST /api/profile/update
```

**Description:** Updates user profile information
**Authentication:** Required (session-based)
**Headers:**

- `Content-Type: application/json`
- `Cookie`: Session cookie

**Request Body:**

```json
{
  "username": "string",
  "fullName": "string",
  "bio": "string",
  "profilePicture": "string",
  "skills": [
    {
      "name": "string",
      "proficiency": number,
      "category": "string"
    }
  ],
  "quizResults": [
    {
      "technology": "string",
      "score": number,
      "attempts": number
    }
  ],
  "socials": {
    "linkedin": "string",
    "twitter": "string",
    "github": "string",
    "instagram": "string",
    "youtube": "string"
  }
}
```

**Response:**

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    // Updated user object
  }
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Username already exists"
}
```

### Check Username Availability

```
GET /api/profile/username/:username
```

**Description:** Checks if a username is available
**Authentication:** Required (session-based)
**Headers:**

- `Cookie`: Session cookie

**Path Parameters:**

- `username` (string): Username to check

**Response:**

```json
{
  "available": true,
  "suggestions": ["string"]
}
```

**Error Responses:**

```json
{
  "success": false,
  "message": "Error checking username availability"
}
```

## Dashboard Data

### Get Dashboard Data

```
GET /api/dashboard/data
```

**Description:** Retrieves dashboard analytics and project data
**Authentication:** Required (session-based)
**Headers:**

- `Cookie`: Session cookie

**Response:**

```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "_id": "string",
        "title": "string",
        "description": "string",
        "technologies": ["string"],
        "status": "string",
        "createdAt": "date",
        "updatedAt": "date"
      }
    ],
    "analytics": {
      "totalViews": number,
      "totalProjects": number,
      "skillsCount": number,
      "lastActivity": "date"
    },
    "recentActivity": [
      {
        "type": "string",
        "description": "string",
        "timestamp": "date"
      }
    ]
  }
}
```

## Error Handling

### Standard Error Response Format

```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": "Additional error information"
}
```

### Common Error Codes

- `AUTH_REQUIRED`: Authentication required
- `INVALID_CREDENTIALS`: Invalid login credentials
- `USERNAME_EXISTS`: Username already taken
- `VALIDATION_ERROR`: Input validation failed
- `DATABASE_ERROR`: Database operation failed
- `OAUTH_ERROR`: OAuth authentication failed
- `SESSION_EXPIRED`: User session has expired

### HTTP Status Codes

- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `409`: Conflict
- `500`: Internal Server Error

## Rate Limiting

### Limits

- **Authentication endpoints:** 10 requests per minute per IP
- **Profile endpoints:** 30 requests per minute per user
- **Dashboard endpoints:** 60 requests per minute per user

### Headers

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200
```

## CORS Configuration

### Allowed Origins

- **Development:** `http://localhost:3000`
- **Production:** `https://yourdomain.com`

### Allowed Methods

- `GET`
- `POST`
- `PUT`
- `DELETE`
- `OPTIONS`

### Allowed Headers

- `Content-Type`
- `Authorization`
- `Cookie`
- `X-Requested-With`

## Session Management

### Session Configuration

- **Duration:** 24 hours
- **Secure:** HTTPS only in production
- **HttpOnly:** True
- **SameSite:** Lax

### Session Data

```json
{
  "userId": "string",
  "email": "string",
  "profileCompleted": boolean,
  "lastActivity": "date"
}
```

## Database Schema

### User Model

```javascript
{
  // Basic Information
  name: String (required),
  email: String (required, unique),
  password: String (optional),

  // OAuth IDs
  googleId: String (unique, sparse),
  githubId: String (unique, sparse),

  // Profile Information
  username: String (unique, sparse),
  avatar: String,
  bio: String,
  tagline: String,
  location: String,
  website: String,

  // Social Links
  socials: {
    linkedin: String,
    twitter: String,
    github: String,
    instagram: String,
    youtube: String
  },

  // Skills and Assessment
  skills: [{
    name: String,
    proficiency: Number,
    category: String
  }],
  quizResults: [{
    technology: String,
    score: Number,
    attempts: Number,
    lastAttempt: Date
  }],

  // Profile Completion
  profileCompleted: Boolean (default: false),
  onboardingStep: Number (default: 0),

  // Timestamps
  createdAt: Date,
  updatedAt: Date
}
```

## Security Considerations

### Input Validation

- All inputs are validated and sanitized
- Username: Alphanumeric characters only, 3-20 characters
- Email: Valid email format required
- Bio: Maximum 500 characters
- Skills: Valid technology names only

### Authentication Security

- OAuth tokens are not stored in database
- Session cookies are HttpOnly and Secure
- CSRF protection enabled
- Rate limiting on authentication endpoints

### Data Protection

- Passwords are hashed (bcrypt) for email/password users
- Sensitive data is not logged
- Database connections use encryption
- Regular security audits recommended

## Testing Endpoints

### Health Check

```
GET /api/health
```

**Description:** Basic health check endpoint
**Response:**

```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0.0"
}
```

### Test Authentication

```
GET /api/test/auth
```

**Description:** Test authentication status
**Authentication:** Optional
**Response:**

```json
{
  "authenticated": boolean,
  "user": {
    // User object if authenticated
  }
}
```

## Webhook Endpoints

### OAuth Webhooks (Future)

```
POST /api/webhooks/oauth/google
POST /api/webhooks/oauth/github
```

**Description:** Handle OAuth provider webhooks
**Authentication:** Webhook signature verification
**Headers:**

- `X-Hub-Signature-256`: GitHub webhook signature
- `X-Google-Signature`: Google webhook signature

## API Versioning

### Current Version

- **Version:** v1
- **Base Path:** `/api`
- **Deprecation Policy:** 6 months notice for breaking changes

### Future Versions

- **v2:** Planned for Q2 2024
- **Features:** Enhanced analytics, team collaboration
- **Migration:** Automatic for non-breaking changes

## SDK and Libraries

### JavaScript/TypeScript

```javascript
// Example API usage
const response = await fetch("/api/portfolio/profile", {
  credentials: "include",
});
const data = await response.json();
```

### Python

```python
import requests

# Example API usage
response = requests.get(
    'http://localhost:5001/api/portfolio/profile',
    cookies={'session': 'your_session_cookie'}
)
data = response.json()
```

## Support and Contact

### API Support

- **Documentation:** This file
- **Issues:** GitHub Issues
- **Email:** support@showwork.com

### Rate Limits

- **Free Tier:** 1000 requests/day
- **Pro Tier:** 10000 requests/day
- **Enterprise:** Custom limits

### SLA

- **Uptime:** 99.9%
- **Response Time:** < 200ms average
- **Support Response:** < 24 hours



