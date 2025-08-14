'use client'

import { useState, useEffect } from 'react'
import { Contact, Lead, Task } from '@/types'

interface CRMViewProps {
  refreshTrigger: number
}

export default function CRMView({ refreshTrigger }: CRMViewProps) {
  const [activeTab, setActiveTab] = useState<'contacts' | 'leads' | 'tasks'>('leads')
  const [contacts, setContacts] = useState<Contact[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    setLoading(true)
    try {
      const [contactsRes, leadsRes, tasksRes] = await Promise.all([
        fetch('/api/contacts'),
        fetch('/api/leads'),
        fetch('/api/tasks')
      ])
      
      if (!contactsRes.ok || !leadsRes.ok || !tasksRes.ok) {
        throw new Error('Failed to fetch data')
      }
      
      const [contactsData, leadsData, tasksData] = await Promise.all([
        contactsRes.json(),
        leadsRes.json(),
        tasksRes.json()
      ])
      
      setContacts(contactsData)
      setLeads(leadsData)
      setTasks(tasksData)
    } catch (error) {
      console.error('Error loading data:', error)
    }
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [refreshTrigger])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800'
      case 'qualified': return 'bg-yellow-100 text-yellow-800'
      case 'contacted': return 'bg-purple-100 text-purple-800'
      case 'converted': return 'bg-green-100 text-green-800'
      case 'lost': return 'bg-red-100 text-red-800'
      case 'todo': return 'bg-gray-100 text-gray-800'
      case 'in_progress': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'high': return 'bg-red-100 text-red-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Tabs */}
      <div className="border-b bg-white">
        <nav className="flex space-x-8 px-6">
          {[
            { id: 'leads', name: 'Leads', count: leads.length },
            { id: 'contacts', name: 'Contacts', count: contacts.length },
            { id: 'tasks', name: 'Tasks', count: tasks.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {contacts.length === 0 ? (
              <p className="text-gray-500">No contacts yet. Ask the AI to create some!</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="bg-white p-4 rounded-lg border">
                    <h3 className="font-medium text-gray-900">{contact.name}</h3>
                    <p className="text-sm text-gray-600">{contact.email}</p>
                    {contact.phone && <p className="text-sm text-gray-600">{contact.phone}</p>}
                    {contact.company && <p className="text-sm text-gray-600">{contact.company}</p>}
                    <p className="text-xs text-gray-400 mt-2">
                      Added {formatDate(contact.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'leads' && (
          <div className="space-y-4">
            {leads.length === 0 ? (
              <p className="text-gray-500">No leads yet. Ask the AI to create some!</p>
            ) : (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div key={lead.id} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">{lead.name}</h3>
                        <p className="text-sm text-gray-600">{lead.email}</p>
                        {lead.company && <p className="text-sm text-gray-600">{lead.company}</p>}
                      </div>
                      <div className="text-right">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                        {lead.value && <p className="text-sm font-medium text-gray-900 mt-1">{formatCurrency(lead.value)}</p>}
                      </div>
                    </div>
                    {lead.notes && <p className="text-sm text-gray-600 mt-2">{lead.notes}</p>}
                    <p className="text-xs text-gray-400 mt-2">
                      Added {formatDate(lead.created_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'tasks' && (
          <div className="space-y-4">
            {tasks.length === 0 ? (
              <p className="text-gray-500">No tasks yet. Ask the AI to create some!</p>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div key={task.id} className="bg-white p-4 rounded-lg border">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{task.title}</h3>
                        {task.description && <p className="text-sm text-gray-600 mt-1">{task.description}</p>}
                      </div>
                      <div className="flex space-x-2">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(task.status)}`}>
                          {task.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center mt-2 text-xs text-gray-400">
                      <span>Created {formatDate(task.created_at)}</span>
                      {task.due_date && <span>Due {formatDate(task.due_date)}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}