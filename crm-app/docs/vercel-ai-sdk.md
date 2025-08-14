# Latest Anthropic Provider Documentation for Vercel AI SDK

## Installation

```bash
npm install @ai-sdk/anthropic ai
```

## Basic Setup

### 1. Configure API Key

```typescript
// Set your Anthropic API key as environment variable
ANTHROPIC_API_KEY=your_api_key_here
```

### 2. Provider Instance

```typescript
import { anthropic } from '@ai-sdk/anthropic';

// Default provider instance
const model = anthropic('claude-3-haiku-20240307');

// Custom provider with settings
import { createAnthropic } from '@ai-sdk/anthropic';

const customAnthropic = createAnthropic({
  apiKey: 'your-api-key',
  baseURL: 'https://api.anthropic.com/v1', // Optional
  headers: { 'custom-header': 'value' }, // Optional
});
```

## Core Functions

### Generate Text

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

const { text } = await generateText({
  model: anthropic('claude-3-haiku-20240307'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});
```

### Stream Text

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

const result = await streamText({
  model: anthropic('claude-3-haiku-20240307'),
  prompt: 'Explain quantum physics',
});

for await (const delta of result.textStream) {
  process.stdout.write(delta);
}
```

### Generate Structured Objects

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { generateObject } from 'ai';
import { z } from 'zod';

const { object } = await generateObject({
  model: anthropic('claude-3-haiku-20240307'),
  schema: z.object({
    recipe: z.object({
      name: z.string(),
      ingredients: z.array(z.string()),
      instructions: z.array(z.string()),
    }),
  }),
  prompt: 'Generate a simple recipe for chocolate chip cookies.',
});
```

## Available Models[1][2]

| Model | ID | Capabilities |
|-------|----|----|
| Claude 4 Opus | `claude-opus-4-20250514` | Latest flagship model |
| Claude 4 Sonnet | `claude-sonnet-4-20250514` | Balanced performance |
| Claude 3.7 Sonnet | `claude-3-7-sonnet-20250219` | Reasoning support |
| Claude 3.5 Sonnet | `claude-3-5-sonnet-20241022` | Multi-modal, PDF support |
| Claude 3.5 Haiku | `claude-3-5-haiku-20241022` | Fast, efficient |
| Claude 3 Opus | `claude-3-opus-20240229` | Most powerful v3 |
| Claude 3 Sonnet | `claude-3-sonnet-20240229` | Balanced v3 |
| Claude 3 Haiku | `claude-3-haiku-20240307` | Fastest, most affordable |

## React Integration

### useChat Hook

```typescript
'use client';

import { useChat } from '@ai-sdk/react';

export default function ChatComponent() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/chat', // Your API endpoint
  });

  return (
    
      {messages.map((message) => (
        
          {message.role}: 
          {message.content}
        
      ))}
      
      
        
        
          Send
        
      
    
  );
}
```

### API Route (Next.js)

```typescript
// app/api/chat/route.ts
import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: anthropic('claude-3-5-sonnet-20241022'),
    messages,
  });

  return result.toAIStreamResponse();
}
```

## Advanced Features

### Reasoning Support[1]

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { generateText } from 'ai';

const { text, reasoning, reasoningDetails } = await generateText({
  model: anthropic('claude-3-7-sonnet-20250219'),
  prompt: 'How many people will live in the world in 2040?',
  providerOptions: {
    anthropic: {
      thinking: {
        type: 'enabled',
        budgetTokens: 12000,
      },
    },
  },
});
```

### PDF Support[2][1]

```typescript
const result = await generateText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What is this document about?' },
        {
          type: 'file',
          data: fs.readFileSync('./document.pdf'),
          mimeType: 'application/pdf',
        },
      ],
    },
  ],
});
```

### Image Input[1]

```typescript
const result = await generateText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe this image' },
        {
          type: 'image',
          image: fs.readFileSync('./image.jpg'),
        },
      ],
    },
  ],
});
```

### Tool Usage[1]

```typescript
import { anthropic } from '@ai-sdk/anthropic';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const weatherTool = tool({
  description: 'Get weather information',
  parameters: z.object({
    location: z.string().describe('Location to get weather for'),
  }),
  execute: async ({ location }) => {
    // Your weather API call here
    return { temperature: 72, condition: 'sunny' };
  },
});

const result = await generateText({
  model: anthropic('claude-3-5-sonnet-20241022'),
  prompt: 'What is the weather in San Francisco?',
  tools: { weather: weatherTool },
});
```

### Cache Control[1]

```typescript
const result = await generateText({
  model: anthropic('claude-3-5-sonnet-20240620'),
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Long context that should be cached' },
        {
          type: 'text',
          text: 'This will be cached',
          providerOptions: {
            anthropic: {
              cacheControl: { type: 'ephemeral' },
            },
          },
        },
        { type: 'text', text: 'Your question here' },
      ],
    },
  ],
});
```

## Key Points

**Latest Version**: AI SDK 5 is now available with breaking changes[3]
**Provider Support**: Full Anthropic integration with all major models[2][1]
**Streaming**: Real-time text streaming supported[4][1]
**Multi-modal**: Image and PDF inputs supported[2][1]
**Tool Calling**: Function calling capabilities available[1]
**React Hooks**: Built-in `useChat` and `useCompletion` hooks[5][4]
**TypeScript**: Full TypeScript support with type safety[6][1]

This covers everything you need to integrate Anthropic models with the Vercel AI SDK for chat completions and more advanced AI features.

[1] https://vercel.com/docs/ai-sdk
[2] https://ai-sdk.dev/providers/ai-sdk-providers/anthropic
[3] https://vercel.com/blog/ai-sdk-5
[4] https://blog.logrocket.com/unified-ai-interfaces-vercel-sdk/
[5] https://www.telerik.com/blogs/practical-guide-using-vercel-ai-sdk-next-js-applications
[6] https://ai-sdk.dev/docs/introduction
[7] https://vercel.com/docs/ai-gateway/models-and-providers
[8] https://voltagent.dev/blog/vercel-ai-sdk/
[9] https://vercel.com/blog/ai-sdk-4-0
[10] https://www.npmjs.com/package/@ai-sdk/anthropic/v/0.0.16
[11] https://apidog.com/blog/vercel-ai-sdk/
[12] https://vercel.com/blog/ai-sdk-4-2
[13] https://github.com/nalaso/anthropic-vertex-ai
[14] https://www.npmjs.com/package/@anthropic-ai/sdk
[15] https://docs.anthropic.com/en/docs/about-claude/models/overview
[16] https://ai-sdk.dev
[17] https://developers.cloudflare.com/ai-gateway/integrations/vercel-ai-sdk/
[18] https://www.youtube.com/watch?v=mojZpktAiYQ
[19] https://vercel.com/docs/ai-gateway/model-variants
[20] https://portkey.ai/blog/vercel-ai-sdk-integration
[21] https://github.com/OpenRouterTeam/ai-sdk-provider
[22] https://docs.anthropic.com/en/api/client-sdks
[23] https://ai-sdk.dev/providers/ai-sdk-providers
[24] https://cloud.google.com/vertex-ai/generative-ai/docs/samples/generativeaionvertexai-claude-3-streaming
[25] https://www.assistant-ui.com/docs/runtimes/ai-sdk/use-chat-hook
[26] https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude-text-completion.html
[27] https://voltagent.dev/docs/providers/anthropic-ai/
[28] https://semaphore.io/blog/vercel-ai-sdk
[29] https://github.com/vercel/ai
[30] https://www.npmjs.com/package/@ai-sdk/anthropic/v/0.0.11
[31] https://ai-sdk.dev/docs/reference/ai-sdk-ui/use-chat