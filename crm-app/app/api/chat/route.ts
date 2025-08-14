import { streamText, convertToModelMessages } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { modelName, systemPrompt } from '@/lib/ai'
import { crmTools } from '@/lib/actions'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    console.log('\ud83d\udcac Chat API received:', { messages, messageCount: messages.length })

    const result = await streamText({
      model: anthropic(modelName),
      system: systemPrompt,
      messages: convertToModelMessages(messages),
      tools: crmTools,
      maxSteps: 3
    })

    console.log('\u2705 StreamText created, returning response')
    return result.toUIMessageStreamResponse()
  } catch (error) {
    console.error('Chat API error:', error)
    return new Response('Internal Server Error', { status: 500 })
  }
}