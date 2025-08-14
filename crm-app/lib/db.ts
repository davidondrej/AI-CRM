import Database from 'better-sqlite3'
import { Contact, Lead, Task } from '@/types'
import { randomUUID } from 'crypto'

const db = new Database('crm.db')

// Initialize tables
db.exec(`
  CREATE TABLE IF NOT EXISTS contacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    status TEXT DEFAULT 'new',
    value REAL,
    notes TEXT,
    created_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'todo',
    priority TEXT DEFAULT 'medium',
    due_date TEXT,
    contact_id TEXT,
    lead_id TEXT,
    created_at TEXT NOT NULL
  );
`)

// Contact queries
export async function getContacts(): Promise<Contact[]> {
  const stmt = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC')
  return stmt.all() as Contact[]
}

export async function createContact(contact: Omit<Contact, 'id' | 'created_at'>): Promise<Contact> {
  const id = randomUUID()
  const created_at = new Date().toISOString()
  const newContact = { id, ...contact, created_at }
  
  const stmt = db.prepare('INSERT INTO contacts (id, name, email, phone, company, created_at) VALUES (?, ?, ?, ?, ?, ?)')
  stmt.run(id, contact.name, contact.email, contact.phone || null, contact.company || null, created_at)
  
  return newContact
}

// Lead queries
export async function getLeads(): Promise<Lead[]> {
  const stmt = db.prepare('SELECT * FROM leads ORDER BY created_at DESC')
  return stmt.all() as Lead[]
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> {
  const id = randomUUID()
  const created_at = new Date().toISOString()
  const newLead = { id, ...lead, created_at }
  
  const stmt = db.prepare('INSERT INTO leads (id, name, email, phone, company, status, value, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
  stmt.run(id, lead.name, lead.email, lead.phone || null, lead.company || null, lead.status, lead.value || null, lead.notes || null, created_at)
  
  return newLead
}

export async function updateLead(id: string, updates: Partial<Lead>): Promise<Lead> {
  const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at')
  const setClause = fields.map(field => `${field} = ?`).join(', ')
  const values = fields.map(field => updates[field as keyof Lead])
  
  const stmt = db.prepare(`UPDATE leads SET ${setClause} WHERE id = ?`)
  stmt.run(...values, id)
  
  const getStmt = db.prepare('SELECT * FROM leads WHERE id = ?')
  return getStmt.get(id) as Lead
}

// Task queries
export async function getTasks(): Promise<Task[]> {
  const stmt = db.prepare('SELECT * FROM tasks ORDER BY created_at DESC')
  return stmt.all() as Task[]
}

export async function createTask(task: Omit<Task, 'id' | 'created_at'>): Promise<Task> {
  const id = randomUUID()
  const created_at = new Date().toISOString()
  const newTask = { id, ...task, created_at }
  
  const stmt = db.prepare('INSERT INTO tasks (id, title, description, status, priority, due_date, contact_id, lead_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
  stmt.run(id, task.title, task.description || null, task.status, task.priority, task.due_date || null, task.contact_id || null, task.lead_id || null, created_at)
  
  return newTask
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task> {
  const fields = Object.keys(updates).filter(key => key !== 'id' && key !== 'created_at')
  const setClause = fields.map(field => `${field} = ?`).join(', ')
  const values = fields.map(field => updates[field as keyof Task])
  
  const stmt = db.prepare(`UPDATE tasks SET ${setClause} WHERE id = ?`)
  stmt.run(...values, id)
  
  const getStmt = db.prepare('SELECT * FROM tasks WHERE id = ?')
  return getStmt.get(id) as Task
}