# QuizAPI.io Configuration Guide

## 🔧 Setting Up Your API Key

To use the QuizAPI.io integration with your exact endpoint, follow these steps:

### 1. **Get Your API Key**
   - Sign up at [https://quizapi.io/](https://quizapi.io/)
   - Get your API key from the dashboard

### 2. **Configure the API Key**
   
   **Option A: Environment Variable (Recommended for Vite)**
   ```bash
   # Create or edit .env file in your project root
   VITE_QUIZ_API_KEY=your_actual_api_key_here
   ```
   
   **Note:** Vite requires the `VITE_` prefix for environment variables to be accessible in the browser.

   **Option B: Direct Configuration**
   ```typescript
   // In src/utils/webQuestionService.ts
   const API_CONFIG = {
     QUIZ_API_KEY: 'your_actual_api_key_here', // Replace YOUR_KEY
     ENABLE_QUIZ_API: true,
     // ... other config
   };
   ```

### 3. **Endpoint Format**
Your exact endpoint format is already implemented:
```
https://quizapi.io/api/v1/questions?apiKey=YOUR_API_KEY&limit=20
```

Our system extends this with additional parameters:
```
https://quizapi.io/api/v1/questions?apiKey=YOUR_KEY&category=code&tags=React&limit=10
```

### 4. **Supported Tech Stack Tags**
- React
- Node.js
- Python
- JavaScript
- TypeScript
- Java
- SQL
- PHP
- Vue.js
- Angular
- Go
- Rust

## 🎯 Priority Order (Hybrid System)
1. **QuizAPI.io** (Primary - requires API key)
2. **JService** (Free fallback)
3. **OpenTDB** (Free fallback)
4. **Local Questions** (Always available)

## 🧪 Testing the Integration

### Test API Connection
Visit: `http://localhost:3003/test-api`

### Test Quiz System
Visit: `http://localhost:3003/quiz`

## 📊 Features Implemented
- ✅ Exact endpoint format as specified
- ✅ Hybrid fallback system
- ✅ Smart caching (1-hour duration)
- ✅ Rate limiting and error handling
- ✅ Tech stack tag mapping
- ✅ Question randomization
- ✅ 10 questions per selected tech stack

## 🚀 Current Status
The quiz system is running and ready! Just add your API key to start fetching real questions from QuizAPI.io.

Without the API key, the system will automatically fall back to other reliable sources and local questions to ensure uninterrupted functionality.