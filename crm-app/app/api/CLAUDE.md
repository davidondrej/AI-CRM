# API Documentation

## Architecture
Next.js 14 App Router API routes with SQLite database operations and AI chat integration.

## Endpoints

### /api/chat (AI Chat)
- **POST**: Streams AI responses using Anthropic Claude
- **Uses**: Vercel AI SDK v5 with function calling
- **Tools**: CRM operations (contacts, leads, tasks)
- **Format**: Converts UIMessage[] to ModelMessage[] via `convertToModelMessages()`

### /api/contacts
- **GET**: Fetch all contacts
- **POST**: Create new contact

### /api/leads  
- **GET**: Fetch all leads
- **POST**: Create new lead

### /api/leads/[id]
- **PUT**: Update lead by ID

### /api/tasks
- **GET**: Fetch all tasks  
- **POST**: Create new task

### /api/tasks/[id]
- **PUT**: Update task by ID

## Implementation Notes

### Chat Route (Critical)
- Uses `streamText()` with `convertToModelMessages(messages)` 
- Returns `result.toUIMessageStreamResponse()`
- Tools defined in `@/lib/actions` use `inputSchema` (v5 format)
- Max 3 steps with anthropic model

### Tool Schema (Updated for v5)
```typescript
// v5 format in lib/actions.ts
{
  description: 'Tool description',
  inputSchema: z.object({...}),  // was 'parameters'
  execute: async (params) => {...}
}
```

### Error Handling
All routes include try/catch with 500 error responses and console logging.

### Database
All endpoints use functions from `@/lib/db` for SQLite operations.

## Testing
```bash
# Test chat
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Show me all contacts"}]}'

# Test contacts
curl http://localhost:3000/api/contacts
```

## Debug Logs
Chat route includes emoji debug logs for troubleshooting message flow.