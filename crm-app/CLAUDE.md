# CRM App - Claude AI Assistant Documentation

## Project Overview
AI-powered CRM prototype built with Next.js 14, TypeScript, and Anthropic Claude API. Features a chat interface for natural language CRM operations.

## Tech Stack
- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **AI**: Vercel AI SDK with Anthropic Claude
- **Database**: SQLite with better-sqlite3
- **API**: Next.js API routes

## Getting Started
1. Install dependencies: `npm install`
2. Set up environment variables in `.env.local`:
   ```
   ANTHROPIC_API_KEY=your_anthropic_api_key
   ```
3. Run development server: `npm run dev`
4. Open http://localhost:3000

## Key Commands
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm start` - Start production server

## Architecture
- **Flat structure** for prototype simplicity
- **Chat-driven interactions** - all CRM operations through AI
- **SQLite database** - auto-creates tables on startup
- **Function calling** - AI uses tools to manipulate CRM data

## Core Files
- `app/page.tsx` - Main layout with chat panel and CRM view
- `components/ChatPanel.tsx` - AI chat interface
- `components/CRMView.tsx` - Data display component
- `app/api/chat/route.ts` - AI API endpoint
- `lib/db.ts` - SQLite database operations
- `lib/ai.ts` - Anthropic AI configuration
- `lib/actions.ts` - CRM function definitions
- `types.ts` - TypeScript type definitions

## Database Schema
Auto-created SQLite tables:
- `contacts` - Customer contact information
- `leads` - Sales leads and prospects  
- `tasks` - CRM tasks and activities

## AI Capabilities
Ask the AI assistant to:
- Show all contacts, leads, or tasks
- Create new contacts with details
- Add leads and track status
- Create and manage tasks
- Search and filter data
- Update existing records

## npm run build
- NEVER EVER run 'npm run build' unless the user asks you to do so.

