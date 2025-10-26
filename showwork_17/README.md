# ShowWork 17 - AI-Powered Portfolio Showcase

A modern monorepo structure for the ShowWork application with AI-powered content generation and social media integration.

## 🏗️ Project Structure

```
ShowWork_17/
├─ README.md
├─ .gitignore
├─ package.json            # optional root workspace helper
├─ docker-compose.yml
├─ frontend/
│  ├─ package.json
│  ├─ index.html
│  └─ src/
│     ├─ main.jsx
│     ├─ App.jsx
│     └─ components/
│        └─ ExampleCard.jsx
├─ backend/
│  ├─ package.json
│  └─ src/
│     ├─ server.js
│     ├─ routes/
│     │  └─ index.js
│     └─ controllers/
│        └─ itemsController.js
├─ shared/                 # optional shared utilities/types
│  └─ README.md
└─ tests/
   ├─ backend/
   └─ frontend/
```

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start all services
docker-compose up -d

# Or start individually
cd frontend && npm run dev
cd backend && npm run dev
```

### Production
```bash
# Build and deploy
docker-compose -f docker-compose.production.yml up -d
```

## 🧩 Features

- **AI-Powered Content Generation**: OpenAI integration for social media posts
- **Social Media Integration**: Twitter, LinkedIn, GitHub publishing
- **Portfolio Management**: Project showcase and analytics
- **Real-time Analytics**: Engagement tracking and insights
- **OAuth Authentication**: Google and GitHub login
- **Queue System**: BullMQ for background job processing

## 🔧 Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB Atlas
- **Queue**: Redis (Upstash)
- **AI**: OpenAI API
- **Deployment**: Render, Docker

## 📚 Documentation

- [API Documentation](./docs/API.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Development Setup](./docs/DEVELOPMENT.md)
