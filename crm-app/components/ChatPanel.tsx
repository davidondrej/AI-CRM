'use client'

import { useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { ChatMessage } from '@/types'

export default function ChatPanel({ onDataUpdate }: { onDataUpdate: () => void }) {
  const [input, setInput] = useState('')
  
  const chatResult = useChat({
    api: '/api/chat',
    onFinish: () => {
      console.log('🎉 Chat finished, triggering data refresh')
      onDataUpdate()
    },
    onError: (error) => {
      console.log('❌ Chat error:', error)
    }
  })
  
  console.log('🔍 useChat returned:', chatResult)
  
  const { messages, sendMessage, isLoading } = chatResult
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('🚀 Send button clicked, input value:', input)
    if (input.trim() && sendMessage) {
      sendMessage({ text: input })
      setInput('')
    }
    console.log('📤 SendMessage called')
  }

  return (
    <div className="h-full flex flex-col bg-gray-100 border-r">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <h2 className="font-semibold text-gray-800">AI Assistant</h2>
        <p className="text-sm text-gray-600">Ask me about your CRM data</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-gray-500 text-sm">
            <p>Try asking:</p>
            <ul className="mt-2 space-y-1">
              <li>• "Show me all leads"</li>
              <li>• "Create a new contact"</li>
              <li>• "What tasks are pending?"</li>
            </ul>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg text-sm ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white border text-gray-800'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border rounded-lg px-3 py-2 text-sm text-gray-600">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your CRM..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm text-gray-900 placeholder:text-gray-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}