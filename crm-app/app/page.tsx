'use client'

import { useState } from 'react'
import ChatPanel from '@/components/ChatPanel'
import CRMView from '@/components/CRMView'

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleDataUpdate = () => {
    setRefreshTrigger(prev => prev + 1)
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Chat Panel - Left Side */}
      <div className="w-80 flex-shrink-0">
        <ChatPanel onDataUpdate={handleDataUpdate} />
      </div>

      {/* CRM View - Right Side */}
      <CRMView refreshTrigger={refreshTrigger} />
    </div>
  )
}
