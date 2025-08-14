# AI SDK v5 Migration Guide - All Breaking Changes

## Message Format Changes (Core Issue)

**Main Problem**: v5 introduced different message formats for frontend vs backend:
- **Frontend (useChat)**: Sends `UIMessage[]` with `parts` arrays[1]
- **Backend**: Expects `ModelMessage[]` with `content` strings[1]

**Solution**: Use `convertToModelMessages()` in your API routes[2][1]

```javascript
// API route
import { convertToModelMessages } from 'ai'
const modelMessages = convertToModelMessages(messages)
```

## UIMessage Parts Array Structure

### Content Property Deprecated
In v5, **UIMessage.content is replaced with UIMessage.parts array**. The `content` property is legacy and maintained only for backward compatibility.

**V4 Format (Deprecated):**
```javascript
const message = {
  id: '1',
  role: 'user',
  content: 'Hello world'  // String content
}
```

**V5 Format (Current):**
```javascript
const message = {
  id: '1', 
  role: 'user',
  parts: [                // Array of message parts
    { type: 'text', text: 'Hello world' }
  ]
}
```

### Frontend Rendering Pattern
**Correct v5 rendering approach:**
```javascript
{messages.map(message => (
  <div key={message.id}>
    {message.parts?.filter(part => part.type === 'text')
                   .map(part => part.text)
                   .join('')}
  </div>
))}
```

### Text Extraction Helper
Since there's no built-in helper, extract text manually:
```javascript
const getMessageText = (message) => {
  return message.parts
    ?.filter(part => part.type === 'text')
    .map(part => part.text)
    .join('') || '';
};
```

### Multiple Part Types
Parts array supports various types:
- `text` - Text content
- `tool-calls` - Function calls
- `reasoning` - AI reasoning steps
- `sources` - Referenced sources
- `files` - File attachments

### Streaming Behavior
During streaming, parts may contain incomplete text that updates incrementally.

### sendMessage API Change
In v5, `sendMessage` requires a UIMessage object with `parts` array, not plain strings:

```javascript
// ❌ v4 - Plain string
sendMessage("Hello!")

// ✅ v5 - UIMessage object with parts
sendMessage({ 
  role: "user", 
  parts: [{ type: "text", text: "Hello!" }] 
})
```

Additional options like `body`, `headers`, or `data` can be passed for custom metadata.

## Tool System Overhaul

### Parameter/Result Renaming[3][4]
```javascript
// v4
const tool = {
  parameters: z.object({ location: z.string() }),
  execute: async ({ location }) => { return result; }
}

// v5
const tool = {
  inputSchema: z.object({ location: z.string() }),
  outputSchema: z.string(), // new optional
  execute: async ({ location }) => { return result; }
}
```

### Tool Call Properties Changed[4]
```javascript
// v4: Used "args" and "result"
part.args, part.result

// v5: Now "input" and "output" 
part.input, part.output
```

### Tool Streaming Always Enabled[4]
- Removed `toolCallStreaming` parameter
- Tool streaming is now always on by default

## useChat Breaking Changes

### maxSteps Removal[4]
```javascript
// v4
useChat({ maxSteps: 5 })

// v5 - Server-side control
streamText({
  stopWhen: stepCountIs(5)
})
```

**Critical**: v5 removed client-side `maxSteps`. Use server-side `stopWhen` instead[5][6]

### Tool Result Submission[4]
```javascript
// v5 - New pattern
const { addToolResult } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
  
  async onToolCall({ toolCall }) {
    const result = await executeToolCall(toolCall);
    // DON'T await this inside onToolCall
    addToolResult({
      tool: toolCall.toolName,
      toolCallId: toolCall.toolCallId,
      output: result, // was "result" in v4
    });
  }
});
```

## Package Updates[4]

### Core Packages
```json
{
  "ai": "5.0.0",
  "@ai-sdk/provider": "2.0.0", 
  "@ai-sdk/provider-utils": "3.0.0",
  "@ai-sdk/*": "2.0.0",
  "zod": "3.25.0"
}
```

## Stream Format Changes[4]

### New Stream Parts with IDs
```javascript
// v5: Enhanced stream parts
{
  type: 'text-start',
  id: string,
  providerMetadata?: SharedV2ProviderMetadata
}
{
  type: 'text-delta', 
  id: string,
  delta: string
}
```

## Dynamic Tools Support[4]

New `dynamicTool` helper for runtime-defined tools:
```javascript
import { dynamicTool } from 'ai';

const runtimeTool = dynamicTool({
  description: 'Runtime tool',
  inputSchema: z.object({}),
  execute: async input => {
    return { result: `Processed: ${input}` };
  }
});
```

## Persistence Issues

### Missing appendResponseMessages[7]
- `appendResponseMessages` removed from v5
- No direct way to convert `ModelMessage` to `UIMessage`
- Must handle persistence differently

### Database Storage
- Store as `UIMessage[]` format[8][9]
- Use `convertToModelMessages()` when sending to models

## Migration Strategy

### For Mixed v4/v5 Environments[10]
Use compatibility wrapper during transition:
```javascript
// Use pipeV5StreamToV4Response for v4 clients
// Use pipeUIMessageStreamToResponse for v5 clients
```

### Step-by-Step Migration[11]
1. **Backup your project**
2. **Update packages** to v5 versions
3. **Run codemods** (available from Vercel)
4. **Update tool definitions** (parameters → inputSchema)
5. **Fix message handling** (add convertToModelMessages)
6. **Update useChat usage** (remove maxSteps, update tool handling)
7. **Test thoroughly**

## Common Errors & Solutions

1. **"Must be ModelMessage[]"** → Use `convertToModelMessages()`[1]
2. **"tools.0.custom.input_schema.type: Field required"** → Change `parameters` to `inputSchema`[13]
3. **"message.content is undefined"** → Use `message.parts` array instead (see UIMessage Parts section)
4. **Tool calls not executing** → Check maxSteps/stopWhen consistency[5]
5. **Silent tool failures** → Verify configuration matches between client/server
6. **Stream format issues** → Update to new stream part types

## Production Readiness[9][8]

- **v5 is still beta** - use with caution
- **Breaking changes between beta versions**
- **Pin exact version numbers** (not `^5.0.0-beta.x`)
- **Keep database backups** before migration
- **Test extensively** with production-like scenarios

The migration is substantial but enables better TypeScript support, tool streaming, and provider caching capabilities.[12]

## Tool Schema Error Fix[13]

**"tools.0.custom.input_schema.type: Field required"** occurs when Anthropic API receives tool schemas missing the mandatory `type: "object"` field. This happens in v5 when using old `parameters` format:

```javascript
// ❌ v4 format (causes Anthropic error)
{
  parameters: z.object({ input: z.string() })
}

// ✅ v5 format (generates correct schema) 
{
  inputSchema: z.object({ input: z.string() })
}
```

The `inputSchema` format ensures Zod generates the required JSON schema structure that Anthropic expects.

[1] https://github.com/vercel/ai/issues/6947
[2] https://upstash.com/blog/ai-sdk-chat-history
[3] https://vercel.com/blog/ai-sdk-5
[4] https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0
[5] https://www.reddit.com/r/nextjs/comments/1l3zy43/vercel_ai_sdk_silent_failure_mismatched_maxsteps/
[6] https://github.com/vercel/ai/issues/7502
[7] https://github.com/vercel/ai/issues/7180
[8] https://mastra.ai/docs/frameworks/ai-sdk-v5
[9] https://mastra.ai/docs/frameworks/agentic-uis/ai-sdk
[10] https://github.com/vercel/ai/issues/7993
[11] https://jhakim.com/blog/ai-sdk-v5-migration
[12] https://www.braingrid.ai/blog/migrating-to-ai-sdk-v5
[13] https://docs.anthropic.com/en/docs/agents-and-tools/tool-use/implement-tool-use
[14] https://github.com/vercel/ai/issues/5318
[15] https://github.com/MCPJam/inspector/issues/369
[16] https://dev.to/yigit-konur/vercel-ai-sdk-v5-internals-part-7-decoupling-your-backend-the-chattransport-abstraction-1a83
[17] https://github.com/vercel/ai/discussions/4845
[18] https://vercel.com/changelog/gpt-5-gpt-5-mini-and-gpt-5-nano-are-now-available-in-vercel-ai-gateway
[19] https://cloud.google.com/vertex-ai/generative-ai/docs/deprecations/genai-vertexai-sdk
[20] https://ai-sdk.dev/docs/introduction
[21] https://www.youtube.com/watch?v=nDgs4Z58Hrc
[22] https://ai-sdk.dev/docs/migration-guides/versioning
[23] https://ai-sdk.dev/docs/migration-guides
[24] https://vercel.com/blog/ai-sdk-4-0
[25] https://dev.to/yigit-konur/vercel-ai-sdk-v5-internals-part-6-one-store-many-hooks-unified-chat-state-across-frameworks-3cab
[26] https://github.com/vercel/ai/issues/7612
[27] https://community.openai.com/t/gpt-5-responses-api-is-extremely-slow/1338478?page=2
[28] https://www.youtube.com/watch?v=lp1RtS7RKtw
[29] https://ai-sdk.dev/docs/reference/ai-sdk-core/model-message
[30] https://timhanlon.com/how-to-send-only-the-last-message-in-ai-sdk-v5
[31] https://v5.ai-sdk.dev/docs/reference/ai-sdk-core/ui-message
[32] https://community.vercel.com/t/streaming-not-displaying-incrementally-on-client-ai-sdk/17716
[33] https://ai-sdk.dev/docs/ai-sdk-ui/chatbot
[34] https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling
[35] https://www.youtube.com/watch?v=mojZpktAiYQ
[36] https://sdk.vercel.ai/docs/guides/r1
[37] https://sdk.vercel.ai/cookbook/next/human-in-the-loop
[38] https://ai-sdk.dev
[39] https://www.youtube.com/watch?v=6lur_Yit4PM