export interface Contact {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  created_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone?: string
  company?: string
  status: 'new' | 'qualified' | 'contacted' | 'converted' | 'lost'
  value?: number
  notes?: string
  created_at: string
}

export interface Task {
  id: string
  title: string
  description?: string
  status: 'todo' | 'in_progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  due_date?: string
  contact_id?: string
  lead_id?: string
  created_at: string
}

export interface ChatMessage {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: string
}

export interface CRMData {
  contacts: Contact[]
  leads: Lead[]
  tasks: Task[]
}