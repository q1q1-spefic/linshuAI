# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LingsuAI (灵枢AI) is a Traditional Chinese Medicine (TCM) AI Learning Platform that combines React frontend, Node.js backend, and AI services to create an intelligent learning companion for TCM education.

## Development Commands

### Quick Start
```bash
npm run dev              # Start both frontend (3000) and backend (3001)
npm run setup            # Install all dependencies
```

### Individual Services
```bash
npm run dev:frontend     # React dev server on port 3000
npm run dev:backend      # Express server with nodemon on port 3001
```

### Testing
```bash
npm run test             # Run all tests
cd backend && npm run test:coverage    # Backend test coverage
```

### Build & Deployment
```bash
npm run build            # Build both frontend and backend
npm run docker:up        # Start Docker containers
npm run docker:down      # Stop Docker containers
```

### Backend-Specific Commands
```bash
cd backend/
npm run lint             # ESLint
npm run format           # Prettier
npm run db:migrate       # Database migrations
npm run db:seed          # Seed data
```

## Architecture

### Tech Stack
- **Frontend**: React 18 + Ant Design + D3.js for knowledge graphs
- **Backend**: Node.js/Express with ES modules (`"type": "module"`)
- **Database**: MongoDB (primary) + Redis (cache/sessions) + ChromaDB (vectors)
- **AI**: OpenAI integration with RAG implementation
- **Real-time**: Socket.io for live interactions

### Project Structure
```
frontend/          # React SPA with Ant Design
backend/           # Express API server with JWT auth
ai-service/        # Python AI service (partial)
database/          # Migrations, seeds, schema
nginx/             # Reverse proxy config
```

### Key Services
- **Frontend (3000)**: React development server
- **Backend (3001)**: Express API with JWT authentication
- **MongoDB (27017)**: Primary database for users, conversations, knowledge nodes
- **Redis (6379)**: Session storage and caching
- **ChromaDB (8001)**: Vector database for AI embeddings

## Environment Setup

Copy environment templates:
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Key environment variables:
- Backend: JWT_SECRET, MONGODB_URI, REDIS_URL, OPENAI_API_KEY
- Frontend: REACT_APP_API_URL, REACT_APP_SOCKET_URL

## Code Patterns

### Frontend
- Functional components with React hooks only
- Ant Design components for UI consistency
- Service layer for API calls in `services/` directory
- D3.js for knowledge graph visualization

### Backend
- ES module syntax throughout
- MVC pattern with controllers, models, routes
- Middleware pipeline for auth, validation, error handling
- Service layer for business logic
- JWT authentication with 7-day expiration

### Database
- MongoDB with Mongoose ODM
- Collections: Users, Conversations, KnowledgeNodes, LearningPaths
- Redis for caching frequent queries and session management

## Security & Performance
- Helmet.js for security headers
- Express rate limiting
- Input validation with express-validator
- XSS protection and CORS configuration
- Connection pooling for MongoDB
- Redis caching for API responses

## AI Integration
- OpenAI GPT models for chat functionality
- ChromaDB for vector storage and similarity search
- RAG (Retrieval-Augmented Generation) implementation
- Document processing for TCM knowledge base

## Testing
- Backend: Jest + Supertest for API testing
- Frontend: React Testing Library (via create-react-app)
- Coverage reporting configured with Jest

## Language Note
This is a Chinese TCM (Traditional Chinese Medicine) educational platform, so many strings, comments, and content are in Chinese. The codebase uses modern JavaScript/ES6+ throughout.