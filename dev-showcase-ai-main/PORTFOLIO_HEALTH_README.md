# Portfolio Health Score System

A comprehensive portfolio health assessment system that provides AI-powered insights and recommendations for portfolio optimization.

## Features

- **Domain Extraction**: Automatically categorizes projects by domain (web-development, mobile, data-science, etc.)
- **Health Scoring**: Rule-based scoring across 6 key areas with weighted calculations
- **AI Integration**: Optional OpenAI integration for enhanced domain extraction
- **Real-time Updates**: Automatic health recalculation when projects are added/updated
- **Dashboard Integration**: Seamless integration with the main dashboard
- **Recommendations**: AI-generated improvement suggestions

## Environment Variables

Add these to your `.env` file:

```bash
# Enable Portfolio Health feature
PORTFOLIO_HEALTH_ENABLED=true

# Optional: OpenAI API key for enhanced domain extraction
OPENAI_API_KEY=your_openai_api_key_here
```

## Database Migration

Run the migration to add the required fields:

```bash
npx prisma migrate dev --name add_portfolio_health_and_project_domain
```

## API Endpoints

### GET /api/portfolio/active

Returns the user's active portfolio with linked projects and cached health data.

### GET /api/portfolio/health

Returns the latest portfolio health score and breakdown.

**Response:**

```json
{
  "overall": 72,
  "status": "Good",
  "breakdown": {
    "technicalSkills": 68,
    "projectQuality": 75,
    "portfolioPresentation": 80,
    "experience": 70,
    "industryAlignment": 65,
    "certifications": 45
  },
  "recommendedImprovements": [
    "Add more diverse technologies",
    "Include live demos for all projects"
  ],
  "lastComputedAt": "2024-01-22T12:00:00Z"
}
```

### POST /api/portfolio/health/recompute

Triggers immediate health score recomputation.

**Request Body:**

```json
{
  "portfolioId": "optional-portfolio-id"
}
```

## Scoring Components

The health score is calculated using weighted components:

- **Technical Skills (20%)**: Technology diversity and depth
- **Project Quality (25%)**: Project completeness and presentation
- **Portfolio Presentation (15%)**: Bio, template, published status
- **Experience (15%)**: Project count and years of experience
- **Industry Alignment (15%)**: Domain consistency across projects
- **Certifications (10%)**: Relevant certifications count

## Testing

Run the test suite:

```bash
# Unit tests
npm test src/services/__tests__/portfolioHealthService.test.ts
npm test src/services/__tests__/domainExtractionService.test.ts

# Integration tests
npm test src/app/api/__tests__/integration/portfolio-health.test.ts
```

## Sample cURL Commands

### 1. Create a project (triggers domain extraction)

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "user-id: user-123" \
  -d '{
    "name": "React E-commerce App",
    "description": "Full-stack e-commerce application with React and Node.js",
    "technologies": [{"name": "React"}, {"name": "Node.js"}, {"name": "MongoDB"}],
    "tags": ["ecommerce", "fullstack"],
    "category": "Web Development",
    "status": "completed",
    "visibility": "public"
  }'
```

### 2. Publish portfolio

```bash
curl -X PATCH http://localhost:3000/api/portfolios/portfolio-123/publish \
  -H "Content-Type: application/json" \
  -H "user-id: user-123"
```

### 3. Get portfolio health

```bash
curl -X GET http://localhost:3000/api/portfolio/health \
  -H "user-id: user-123"
```

### 4. Recompute health score

```bash
curl -X POST http://localhost:3000/api/portfolio/health/recompute \
  -H "Content-Type: application/json" \
  -H "user-id: user-123" \
  -d '{}'
```

## Frontend Integration

The system includes a React hook for easy integration:

```typescript
import { usePortfolioHealth } from '@/hooks/usePortfolioHealth';

function Dashboard() {
  const { health, loading, refresh, recompute } = usePortfolioHealth();

  return (
    <PortfolioHealthScore
      health={health}
      loading={loading}
      onRefresh={refresh}
      onRecompute={recompute}
    />
  );
}
```

## Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer      │    │   Services      │
│                 │    │                  │    │                 │
│ Dashboard       │◄──►│ /api/portfolio/  │◄──►│ Health Service  │
│ Health Score    │    │ /api/projects    │    │ Domain Service  │
│ Component       │    │                  │    │                 │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌──────────────────┐
                       │   Database       │
                       │                  │
                       │ Portfolio.health │
                       │ Project.domain   │
                       └──────────────────┘
```

## Performance Considerations

- Health scores are cached for 24 hours
- Domain extraction runs asynchronously on project creation
- Rate limiting: max 1 recomputation per 30 seconds per user
- AI calls are optional and gracefully fall back to rule-based extraction

## Future Enhancements

- Machine Learning model for more accurate scoring
- Industry-specific scoring criteria
- Historical health trends
- Portfolio comparison features
- Advanced recommendation engine
