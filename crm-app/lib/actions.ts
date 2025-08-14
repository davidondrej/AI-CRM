import { z } from 'zod'
import { 
  getContacts, 
  createContact, 
  getLeads, 
  createLead, 
  updateLead,
  getTasks,
  createTask,
  updateTask
} from './db'

export const crmTools = {
  getContacts: {
    description: 'Get all contacts from the CRM',
    parameters: z.object({}),
    execute: async () => {
      const contacts = await getContacts()
      return {
        contacts,
        message: `Found ${contacts.length} contacts`
      }
    }
  },

  createContact: {
    description: 'Create a new contact',
    parameters: z.object({
      name: z.string().describe('Contact name'),
      email: z.string().email().describe('Contact email'),
      phone: z.string().optional().describe('Contact phone number'),
      company: z.string().optional().describe('Contact company')
    }),
    execute: async (params: any) => {
      console.log('\ud83d\udc64 createContact executing with:', params)
      const contact = await createContact(params)
      return {
        contact,
        message: `Created contact: ${contact.name}`
      }
    }
  },

  getLeads: {
    description: 'Get all leads from the CRM',
    parameters: z.object({
      status: z.enum(['new', 'qualified', 'contacted', 'converted', 'lost']).optional()
        .describe('Filter leads by status')
    }),
    execute: async (params: any) => {
      const allLeads = await getLeads()
      const leads = params.status 
        ? allLeads.filter(lead => lead.status === params.status)
        : allLeads
      
      return {
        leads,
        message: `Found ${leads.length} leads${params.status ? ` with status: ${params.status}` : ''}`
      }
    }
  },

  createLead: {
    description: 'Create a new lead',
    parameters: z.object({
      name: z.string().describe('Lead name'),
      email: z.string().email().describe('Lead email'),
      phone: z.string().optional().describe('Lead phone number'),
      company: z.string().optional().describe('Lead company'),
      status: z.enum(['new', 'qualified', 'contacted', 'converted', 'lost'])
        .default('new').describe('Lead status'),
      value: z.number().optional().describe('Lead value in dollars'),
      notes: z.string().optional().describe('Additional notes about the lead')
    }),
    execute: async (params: any) => {
      const lead = await createLead(params)
      return {
        lead,
        message: `Created lead: ${lead.name}`
      }
    }
  },

  updateLead: {
    description: 'Update an existing lead',
    parameters: z.object({
      id: z.string().describe('Lead ID'),
      status: z.enum(['new', 'qualified', 'contacted', 'converted', 'lost']).optional(),
      value: z.number().optional(),
      notes: z.string().optional()
    }),
    execute: async (params: any) => {
      const { id, ...updates } = params
      const lead = await updateLead(id, updates)
      return {
        lead,
        message: `Updated lead: ${lead.name}`
      }
    }
  },

  getTasks: {
    description: 'Get all tasks from the CRM',
    parameters: z.object({
      status: z.enum(['todo', 'in_progress', 'completed']).optional()
        .describe('Filter tasks by status')
    }),
    execute: async (params: any) => {
      const allTasks = await getTasks()
      const tasks = params.status 
        ? allTasks.filter(task => task.status === params.status)
        : allTasks
      
      return {
        tasks,
        message: `Found ${tasks.length} tasks${params.status ? ` with status: ${params.status}` : ''}`
      }
    }
  },

  createTask: {
    description: 'Create a new task',
    parameters: z.object({
      title: z.string().describe('Task title'),
      description: z.string().optional().describe('Task description'),
      status: z.enum(['todo', 'in_progress', 'completed']).default('todo'),
      priority: z.enum(['low', 'medium', 'high']).default('medium'),
      due_date: z.string().optional().describe('Due date in YYYY-MM-DD format'),
      contact_id: z.string().optional().describe('Associated contact ID'),
      lead_id: z.string().optional().describe('Associated lead ID')
    }),
    execute: async (params: any) => {
      const task = await createTask(params)
      return {
        task,
        message: `Created task: ${task.title}`
      }
    }
  },

  updateTask: {
    description: 'Update an existing task',
    parameters: z.object({
      id: z.string().describe('Task ID'),
      status: z.enum(['todo', 'in_progress', 'completed']).optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      due_date: z.string().optional(),
      description: z.string().optional()
    }),
    execute: async (params: any) => {
      const { id, ...updates } = params
      const task = await updateTask(id, updates)
      return {
        task,
        message: `Updated task: ${task.title}`
      }
    }
  }
}