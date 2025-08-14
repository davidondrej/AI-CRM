# This is the core .md file of the project
- this should be a quick-and-dirty prototype

<idea>
Build a simple web-based CRM powered by AI. The interface should have a narrow left column with a chat panel and a wide right column showing the main CRM view (contact list, lead details, tasks). The chat should accept natural language queries (e.g., "Show me leads added this week") and AI should respond with results or update the CRM data. Keep styling minimal but clean, and ensure all data interactions happen through the AI chat.
</idea>

## Tech Stack
<tech-stack>
**Frontend:** Next.js 14 (App Router) + Tailwind CSS + shadcn/ui
- Next.js provides React + API routes in one framework
- Tailwind for rapid, utility-first styling
- shadcn/ui for pre-built components (tables, forms, chat UI)

**Backend:** Next.js API routes + Supabase
- API routes handle AI chat requests and CRM operations
- Supabase provides instant Postgres database + real-time subscriptions
- No separate backend server needed

**AI:** OpenAI/Claude API + Vercel AI SDK
- Vercel AI SDK for streaming chat responses
- Function calling for CRM data operations

**State Management:** Zustand or React Context
- Simple client-side state for CRM data and UI state

This stack prioritizes rapid prototyping while maintaining scalability for future enhancements.
</tech-stack>


## Simplified MVP Structure
<file-structure>
project/
├── app/
│   ├── page.tsx           # Single page with chat + CRM
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Tailwind styles
│   └── api/
│       └── chat/route.ts  # AI endpoint (handles everything)
│
├── components/
│   ├── ChatPanel.tsx      # Chat UI
│   ├── CRMView.tsx        # Main CRM display
│   └── ui/                # shadcn components
│
├── lib/
│   ├── ai.ts              # OpenAI/Claude setup
│   ├── db.ts              # Supabase client
│   └── actions.ts         # CRM functions for AI
│
└── types.ts               # All types in one file
</file-structure>


## Key Simplifications

- Single page app – No routing complexity
- One API route – /api/chat handles all AI interactions
- Flat structure – No nested folders or services
- Combined files – All types in one file, all DB queries in one file
- State in React – useState/useContext only, no Zustand
- Direct Supabase calls – No abstraction layers

Build Order

1. npx create-next-app with TypeScript + Tailwind
2. Install shadcn/ui + Vercel AI SDK
3. Create Supabase tables (contacts, leads, tasks)
4. Build split layout (page.tsx)
5. Add chat that calls AI functions directly
6. Display CRM data in right panel

This gets you running in hours, not days.

## Package Versions
<versions>
**AI SDK:** Vercel AI SDK v5 (@ai-sdk/react@2.0.12, @ai-sdk/anthropic@2.0.3, ai@5.0.12)
- Uses `sendMessage` API (not `handleSubmit` from v4)
- Manual input state management with `useState`
- Transport-based architecture with `DefaultChatTransport`

**Database:** SQLite with better-sqlite3@12.2.0
**Framework:** Next.js 15.4.6, React 19.1.0
</versions>


# Essential CRM Features (MVP Approach)
<features>
Core Foundation Features
Contact Management - Store, organize and search customer information with interaction history
Lead Management - Capture, qualify and track prospects through sales pipeline
Sales Pipeline Management - Visual deal tracking with stages, probability and forecasting
Activity Tracking - Log and schedule calls, emails, meetings and tasks
Basic Reporting - Dashboard with key metrics and performance analytics
</features>



