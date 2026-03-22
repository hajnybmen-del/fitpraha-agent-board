import React, { useState, useEffect, useRef } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ozwbaxffgtygszkwaira.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im96d2JheGZmZ3R5Z3N6a3dhaXJhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTA5NDIsImV4cCI6MjA4OTE2Njk0Mn0.ZhMvTGHelGuhwd6Lh94bGglyaXGFcPGCNRz1hNDxd_E'
const supabase = createClient(supabaseUrl, supabaseKey)

const css = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #02243D;
    color: #E5E7EB;
  }

  .app-container {
    display: flex;
    height: 100vh;
    background: linear-gradient(135deg, #02243D 0%, #0F3460 100%);
    overflow: hidden;
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .header {
    background: linear-gradient(90deg, #02243D 0%, #0F3460 100%);
    border-bottom: 2px solid #FAB945;
    padding: 16px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
  }

  .header-title {
    font-size: 24px;
    font-weight: 700;
    color: #FAB945;
    letter-spacing: 0.5px;
  }

  .header-controls {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  .filter-bar {
    display: flex;
    gap: 8px;
    padding: 12px 24px;
    background: rgba(15, 52, 96, 0.5);
    border-bottom: 1px solid rgba(250, 185, 69, 0.2);
  }

  .filter-btn {
    padding: 8px 16px;
    border: 1px solid rgba(250, 185, 69, 0.3);
    background: transparent;
    color: #E5E7EB;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
    font-weight: 500;
  }

  .filter-btn.active {
    background: #FAB945;
    color: #02243D;
    border-color: #FAB945;
  }

  .filter-btn:hover {
    border-color: #FAB945;
  }

  .stats-panel {
    display: flex;
    gap: 24px;
    padding: 12px 24px;
    background: rgba(15, 52, 96, 0.7);
    border-bottom: 1px solid rgba(75, 186, 173, 0.2);
    font-size: 14px;
  }

  .stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .stat-label {
    color: #9CA3AF;
  }

  .stat-value {
    font-weight: 700;
    color: #FAB945;
    font-size: 16px;
  }

  .stat-item.completed .stat-value {
    color: #4BBEAD;
  }

  .stat-item.inprogress .stat-value {
    color: #3B82F6;
  }

  .stat-item.overdue .stat-value {
    color: #E43D45;
  }

  .kanban-wrapper {
    flex: 1;
    overflow-x: auto;
    overflow-y: hidden;
    padding: 20px 24px;
  }

  .kanban-board {
    display: grid;
    grid-template-columns: repeat(6, 340px);
    gap: 20px;
    height: 100%;
    min-width: fit-content;
  }

  .column {
    background: rgba(15, 52, 96, 0.6);
    border: 1px solid rgba(250, 185, 69, 0.2);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .column-header {
    padding: 16px;
    border-bottom: 2px solid rgba(250, 185, 69, 0.3);
    background: rgba(15, 52, 96, 0.8);
  }

  .column-title {
    font-size: 16px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  .agent-icon {
    font-size: 20px;
  }

  .agent-status {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  .agent-status.running {
    background: #4BBEAD;
    box-shadow: 0 0 8px rgba(75, 186, 173, 0.5);
  }

  .agent-status.warning {
    background: #F59E0B;
    box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
  }

  .agent-status.error {
    background: #E43D45;
    box-shadow: 0 0 8px rgba(228, 61, 69, 0.5);
  }

  .agent-status.idle {
    background: #6B7280;
  }

  .agent-info {
    font-size: 12px;
    color: #9CA3AF;
    margin-top: 4px;
  }

  .column-tasks {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .column-tasks::-webkit-scrollbar {
    width: 6px;
  }

  .column-tasks::-webkit-scrollbar-thumb {
    background: rgba(250, 185, 69, 0.3);
    border-radius: 3px;
  }

  .column-tasks::-webkit-scrollbar-thumb:hover {
    background: rgba(250, 185, 69, 0.5);
  }

  .task-card {
    background: rgba(5, 36, 61, 0.8);
    border: 1px solid rgba(250, 185, 69, 0.2);
    border-radius: 6px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.2s;
    border-left: 3px solid #FAB945;
  }

  .task-card:hover {
    border-color: #FAB945;
    box-shadow: 0 4px 12px rgba(250, 185, 69, 0.15);
    transform: translateY(-2px);
  }

  .task-card.priority-high {
    border-left-color: #E43D45;
  }

  .task-card.priority-medium {
    border-left-color: #F59E0B;
  }

  .task-card.priority-low {
    border-left-color: #4BBEAD;
  }

  .task-title {
    font-size: 14px;
    font-weight: 600;
    color: #F3F4F6;
    margin-bottom: 6px;
    word-wrap: break-word;
  }

  .task-description {
    font-size: 12px;
    color: #D1D5DB;
    margin-bottom: 8px;
    line-height: 1.4;
    word-wrap: break-word;
  }

  .task-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    margin-bottom: 8px;
  }

  .task-priority {
    padding: 2px 6px;
    border-radius: 3px;
    font-weight: 600;
  }

  .task-priority.high {
    background: rgba(228, 61, 69, 0.2);
    color: #E43D55;
  }

  .task-priority.medium {
    background: rgba(245, 158, 11, 0.2);
    color: #F59E0B;
  }

  .task-priority.low {
    background: rgba(75, 186, 173, 0.2);
    color: #4BBEAD;
  }

  .task-deadline {
    color: #9CA3AF;
    font-size: 11px;
  }

  .task-deadline.soon {
    color: #F59E0B;
  }

  .task-deadline.overdue {
    color: #E43D45;
    font-weight: 600;
  }

  .task-tags {
    display: flex;
    gap: 4px;
    flex-wrap: wrap;
  }

  .task-tag {
    padding: 2px 6px;
    border-radius: 3px;
    font-size: 10px;
    font-weight: 600;
    background: rgba(59, 130, 246, 0.2);
    color: #3B82F6;
  }

  .task-tag.novo {
    background: rgba(250, 185, 69, 0.2);
    color: #FAB945;
  }

  .task-tag.probíhá {
    background: rgba(59, 130, 246, 0.2);
    color: #3B82F6;
  }

  .task-tag.čeká {
    background: rgba(245, 158, 11, 0.2);
    color: #F59E0B;
  }

  .task-tag.hotovo {
    background: rgba(75, 186, 173, 0.2);
    color: #4BBEAD;
  }

  .column-footer {
    padding: 12px;
    border-top: 1px solid rgba(250, 185, 69, 0.2);
  }

  .add-task-btn {
    width: 100%;
    padding: 10px;
    background: rgba(250, 185, 69, 0.1);
    border: 1px dashed rgba(250, 185, 69, 0.4);
    color: #FAB945;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    transition: all 0.2s;
  }

  .add-task-btn:hover {
    background: rgba(250, 185, 69, 0.2);
    border-color: #FAB945;
  }

  .sidebar {
    width: 300px;
    background: rgba(15, 52, 96, 0.8);
    border-left: 1px solid rgba(250, 185, 69, 0.2);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: transform 0.3s;
  }

  .sidebar.hidden {
    transform: translateX(100%);
    position: absolute;
    width: 320px;
    right: 0;
    height: 100%;
  }

  .sidebar-header {
    padding: 16px;
    border-bottom: 1px solid rgba(250, 185, 69, 0.2);
    font-weight: 700;
    color: #FAB945;
  }

  .sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }

  .sidebar-content::-webkit-scrollbar {
    width: 6px;
  }

  .sidebar-content::-webkit-scrollbar-thumb {
    background: rgba(250, 185, 69, 0.3);
    border-radius: 3px;
  }

  .activity-item {
    padding: 12px;
    background: rgba(5, 36, 61, 0.6);
    border: 1px solid rgba(250, 185, 69, 0.1);
    border-radius: 6px;
    margin-bottom: 8px;
    font-size: 12px;
  }

  .activity-time {
    color: #9CA3AF;
    margin-top: 4px;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 200;
  }

  .modal {
    background: linear-gradient(135deg, #02243D 0%, #0F3460 100%);
    border: 1px solid rgba(250, 185, 69, 0.3);
    border-radius: 8px;
    padding: 24px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .modal-title {
    font-size: 20px;
    font-weight: 700;
    color: #FAB945;
    margin-bottom: 20px;
  }

  .form-group {
    margin-bottom: 16px;
  }

  .form-label {
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #E5E7EB;
    margin-bottom: 6px;
  }

  .form-input,
  .form-select,
  .form-textarea {
    width: 100%;
    padding: 10px 12px;
    background: rgba(5, 36, 61, 0.8);
    border: 1px solid rgba(250, 185, 69, 0.2);
    border-radius: 6px;
    color: #E5E7EB;
    font-family: inherit;
    font-size: 14px;
    transition: all 0.2s;
  }

  .form-input:focus,
  .form-select:focus,
  .form-textarea:focus {
    outline: none;
    border-color: #FAB945;
    box-shadow: 0 0 8px rgba(250, 185, 69, 0.2);
  }

  .form-textarea {
    min-height: 80px;
    resize: vertical;
  }

  .form-input::placeholder,
  .form-textarea::placeholder {
    color: #6B7280;
  }

  .modal-buttons {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  .btn {
    flex: 1;
    padding: 10px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    font-size: 14px;
  }

  .btn-primary {
    background: #FAB945;
    color: #02243D;
  }

  .btn-primary:hover {
    background: #F59E0B;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(250, 185, 69, 0.3);
  }

  .btn-secondary {
    background: rgba(250, 185, 69, 0.1);
    color: #FAB945;
    border: 1px solid rgba(250, 185, 69, 0.3);
  }

  .btn-secondary:hover {
    background: rgba(250, 185, 69, 0.2);
  }

  .btn-danger {
    background: rgba(228, 61, 69, 0.2);
    color: #E43D45;
    border: 1px solid rgba(228, 61, 69, 0.4);
    flex: none;
  }

  .btn-danger:hover {
    background: rgba(228, 61, 69, 0.3);
  }

  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: linear-gradient(135deg, #02243D 0%, #0F3460 100%);
  }

  .login-box {
    background: rgba(15, 52, 96, 0.8);
    border: 1px solid rgba(250, 185, 69, 0.3);
    border-radius: 8px;
    padding: 40px;
    width: 100%;
    max-width: 400px;
    text-align: center;
  }

  .login-title {
    font-size: 28px;
    font-weight: 700;
    color: #FAB945;
    margin-bottom: 30px;
  }

  .sidebar-toggle {
    background: none;
    border: none;
    color: #FAB945;
    cursor: pointer;
    font-size: 18px;
    padding: 8px 12px;
    transition: all 0.2s;
  }

  .sidebar-toggle:hover {
    color: #F59E0B;
  }

  .comments-section {
    margin-top: 20px;
    border-top: 1px solid rgba(250, 185, 69, 0.2);
    padding-top: 16px;
  }

  .comments-title {
    font-size: 12px;
    font-weight: 700;
    color: #FAB945;
    margin-bottom: 12px;
    text-transform: uppercase;
  }

  .comment {
    background: rgba(5, 36, 61, 0.6);
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 8px;
    font-size: 12px;
  }

  .comment-author {
    font-weight: 600;
    color: #FAB945;
    margin-bottom: 4px;
  }

  .comment-text {
    color: #D1D5DB;
    line-height: 1.4;
  }

  .comment-time {
    color: #6B7280;
    font-size: 11px;
    margin-top: 4px;
  }

  .comment-input-group {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }

  .comment-input {
    flex: 1;
    padding: 8px;
    background: rgba(5, 36, 61, 0.8);
    border: 1px solid rgba(250, 185, 69, 0.2);
    border-radius: 4px;
    color: #E5E7EB;
    font-size: 12px;
  }

  .comment-input:focus {
    outline: none;
    border-color: #FAB945;
  }

  .comment-btn {
    padding: 8px 12px;
    background: #FAB945;
    color: #02243D;
    border: none;
    border-radius: 4px;
    font-weight: 600;
    font-size: 12px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .comment-btn:hover {
    background: #F59E0B;
  }

  @media (max-width: 1400px) {
    .kanban-board {
      grid-template-columns: repeat(3, 340px);
    }
  }

  @media (max-width: 768px) {
    .kanban-board {
      grid-template-columns: 1fr;
    }

    .sidebar {
      position: fixed;
      right: 0;
      top: 0;
      height: 100%;
      z-index: 150;
    }

    .filter-bar {
      flex-wrap: wrap;
    }

    .stats-panel {
      flex-wrap: wrap;
      gap: 12px;
    }
  }
`

const INIT_TASKS = [
  {
    id: 1,
    title: 'Klientské briefing zaslání',
    description: 'Příprava týdenního briefingu pro klienty',
    agent: 'ceo',
    status: 'inprogress',
    priority: 'high',
    deadline: '2026-03-24',
    assigned_to: 'Lukáš',
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    comments: [],
  },
  {
    id: 2,
    title: 'FAPI sync kontrola',
    description: 'Ověřit synchronizaci faktur z FAPI.cz',
    agent: 'finance',
    status: 'done',
    priority: 'medium',
    deadline: '2026-03-23',
    assigned_to: 'Lukáš',
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    comments: [],
  },
  {
    id: 3,
    title: 'Gmail faktury automatizace',
    description: 'Nastavit automatické stahování faktur z Gmailu',
    agent: 'mail',
    status: 'todo',
    priority: 'high',
    deadline: '2026-03-25',
    assigned_to: 'Andrea',
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    comments: [],
  },
  {
    id: 4,
    title: 'Funnel copy generátor',
    description: 'Vytvořit 4 varianty marketing copy',
    agent: 'marketing',
    status: 'inprogress',
    priority: 'medium',
    deadline: '2026-03-26',
    assigned_to: 'Pavel',
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    comments: [],
  },
  {
    id: 5,
    title: 'Video repurposing AI',
    description: 'Rozpracovat video na Instagram/TikTok',
    agent: 'content',
    status: 'todo',
    priority: 'low',
    deadline: '2026-03-28',
    assigned_to: 'Jakub',
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    comments: [],
  },
  {
    id: 6,
    title: 'Kalendář se AI',
    description: 'Testovací run AI kalendáře',
    agent: 'organizer',
    status: 'done',
    priority: 'low',
    deadline: '2026-03-22',
    assigned_to: 'Radek',
    created_by: 'system',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    comments: [],
  },
]

const AGENTS = [
  { id: 'ceo', name: 'CEO Orchestrátor', icon: '🧠', color: '#7C3AED', status: 'running', info: 'OK — 8 nástrojů' },
  { id: 'finance', name: 'CFO Agent', icon: '💰', color: '#4BBEAD', status: 'running', info: 'FAPI OK — 955 faktur' },
  { id: 'mail', name: 'Mail Agent', icon: '📧', color: '#3B82F6', status: 'warning', info: 'Gmail OK — fitpraha chybí' },
  { id: 'marketing', name: 'Marketing', icon: '📈', color: '#FAB945', status: 'idle', info: 'Funnel OK — Ads chybí' },
  { id: 'content', name: 'Content', icon: '🎬', color: '#E43D45', status: 'error', info: 'Koncept — ready soon' },
  { id: 'organizer', name: 'Organizátor', icon: '📅', color: '#06B6D4', status: 'running', info: 'OK — 5/5 akcí' },
]

const PROFILES = {
  'lukas@fitpraha.cz': { name: 'Lukáš', role: 'admin' },
  'andrea@fitpraha.cz': { name: 'Andrea', role: 'admin' },
  'pavel@fitpraha.cz': { name: 'Pavel', role: 'user' },
  'jakub@fitpraha.cz': { name: 'Jakub', role: 'user' },
  'radek@fitpraha.cz': { name: 'Radek', role: 'user' },
}

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Vyplňte prosím email a heslo')
      return
    }

    if (email.includes('@fitpraha.cz') || email === 'demo@fitpraha.cz') {
      if (password === 'demo123') {
        const profile = PROFILES[email] || { name: 'Uživatel', role: 'user' }
        onLogin({ email, ...profile })
        return
      }
    }

    setError('Nesprávný email nebo heslo')
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-title">🧠 FITPRAHA Agent Board</div>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <input
              type="email"
              className="form-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              className="form-input"
              placeholder="Heslo"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div style={{ color: '#E43D45', fontSize: '12px', marginBottom: '12px' }}>{error}</div>}
          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Přihlásit se
          </button>
        </form>
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#9CA3AF' }}>
          Demo: lukas@fitpraha.cz / demo123
        </div>
      </div>
    </div>
  )
}

function TaskDetailModal({ task, agent, onClose, onSave, onDelete, user }) {
  const [formData, setFormData] = useState(task || {})
  const [commentText, setCommentText] = useState('')

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return
    const newComments = [
      ...(formData.comments || []),
      { author: user.name, text: commentText, time: new Date().toISOString() },
    ]
    setFormData((prev) => ({ ...prev, comments: newComments }))
    setCommentText('')
  }

  const handleSave = () => {
    if (!formData.title?.trim()) {
      alert('Zadejte prosím název úkolu')
      return
    }
    onSave(formData)
  }

  const statusLabels = { todo: 'Nový', inprogress: 'Probíhá', done: 'Hotovo', waiting: 'Čeká' }
  const priorityLabels = { high: 'Vysoká', medium: 'Střední', low: 'Nízká' }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">{task?.id ? 'Upravit úkol' : 'Přidat nový úkol'}</div>

        <div className="form-group">
          <label className="form-label">Název úkolu</label>
          <input
            type="text"
            className="form-input"
            value={formData.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Zadejte název"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Popis</label>
          <textarea
            className="form-textarea"
            value={formData.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Detailní popis úkolu"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Priorita</label>
          <select
            className="form-select"
            value={formData.priority || 'medium'}
            onChange={(e) => handleChange('priority', e.target.value)}
          >
            <option value="high">Vysoká - 🔴</option>
            <option value="medium">Střední - 🟠</option>
            <option value="low">Nízká - 🟢</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Stav</label>
          <select
            className="form-select"
            value={formData.status || 'todo'}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="todo">Nový</option>
            <option value="inprogress">Probíhá</option>
            <option value="waiting">Čeká</option>
            <option value="done">Hotovo</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Přiřazeno</label>
          <input
            type="text"
            className="form-input"
            value={formData.assigned_to || ''}
            onChange={(e) => handleChange('assigned_to', e.target.value)}
            placeholder="Jméno osoby"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Termín</label>
          <input
            type="date"
            className="form-input"
            value={formData.deadline || ''}
            onChange={(e) => handleChange('deadline', e.target.value)}
          />
        </div>

        <div className="comments-section">
          <div className="comments-title">Poznámky ({(formData.comments || []).length})</div>
          {(formData.comments || []).map((comment, idx) => (
            <div key={idx} className="comment">
              <div className="comment-author">{comment.author}</div>
              <div className="comment-text">{comment.text}</div>
              <div className="comment-time">{new Date(comment.time).toLocaleString('cs-CZ')}</div>
            </div>
          ))}
          <div className="comment-input-group">
            <input
              type="text"
              className="comment-input"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Přidat poznámku..."
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button className="comment-btn" onClick={handleAddComment}>
              ✓
            </button>
          </div>
        </div>

        <div className="modal-buttons">
          <button className="btn btn-primary" onClick={handleSave}>
            Uložit
          </button>
          <button className="btn btn-secondary" onClick={onClose}>
            Zrušit
          </button>
          {task?.id && (
            <button className="btn btn-danger" onClick={() => onDelete(task.id)}>
              Smazat
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function KanbanColumn({ agent, tasks, onTaskClick, onAddTask, user }) {
  const statusIcon = {
    running: '✓',
    warning: '⚠',
    error: '✗',
    idle: '-',
  }

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return ''
    const now = new Date()
    const due = new Date(deadline)
    const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24))

    if (daysLeft < 0) return 'overdue'
    if (daysLeft === 0) return 'today'
    if (daysLeft <= 2) return 'soon'
    return ''
  }

  const getCountdown = (deadline) => {
    if (!deadline) return ''
    const now = new Date()
    const due = new Date(deadline)
    const daysLeft = Math.ceil((due - now) / (1000 * 60 * 60 * 24))

    if (daysLeft < 0) return `${Math.abs(daysLeft)} dní zpožděno`
    if (daysLeft === 0) return 'Dnes'
    if (daysLeft === 1) return 'Zítra'
    return `Za ${daysLeft} dní`
  }

  const statusLabels = { todo: 'Nový', inprogress: 'Probíhá', done: 'Hotovo', waiting: 'Čeká' }

  return (
    <div className="column">
      <div className="column-header">
        <div className="column-title">
          <span className="agent-icon">{agent.icon}</span>
          <span>{agent.name}</span>
          <span className={`agent-status ${agent.status}`} title={agent.status} />
        </div>
        <div className="agent-info">{agent.info}</div>
      </div>

      <div className="column-tasks">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`task-card priority-${task.priority}`}
            onClick={() => onTaskClick(task)}
          >
            <div className="task-title">{task.title}</div>
            {task.description && <div className="task-description">{task.description}</div>}
            <div className="task-meta">
              <span className={`task-priority ${task.priority}`}>{task.priority.toUpperCase()}</span>
              <span className={`task-deadline ${getDeadlineStatus(task.deadline)}`}>{getCountdown(task.deadline)}</span>
            </div>
            <div className="task-tags">
              <span className={`task-tag ${task.status}`}>{statusLabels[task.status]}</span>
              {task.assigned_to && <span style={{ fontSize: '10px', color: '#9CA3AF' }}>👤 {task.assigned_to}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="column-footer">
        <button className="add-task-btn" onClick={() => onAddTask(agent.id)}>
          + Přidat úkol
        </button>
      </div>
    </div>
  )
}

export default function App() {
  const [user, setUser] = useState(null)
  const [tasks, setTasks] = useState([])
  const [filter, setFilter] = useState('all')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [selectedTask, setSelectedTask] = useState(null)
  const [newTaskAgent, setNewTaskAgent] = useState(null)
  const [activity, setActivity] = useState([])
  const subscriptionRef = useRef(null)

  useEffect(() => {
    loadTasks()
  }, [user])

  const loadTasks = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.from('tasks').select('*')

      if (error) {
        console.log('Supabase unavailable, using demo data')
        setTasks(INIT_TASKS)
      } else {
        setTasks(data || INIT_TASKS)
      }

      subscribeToTasks()
    } catch (err) {
      console.log('Using demo data:', err.message)
      setTasks(INIT_TASKS)
    }
  }

  const subscribeToTasks = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe()
    }

    subscriptionRef.current = supabase
      .channel('tasks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tasks' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setTasks((prev) => [...prev, payload.new])
            addActivity(`Nový úkol: ${payload.new.title}`)
          } else if (payload.eventType === 'UPDATE') {
            setTasks((prev) => prev.map((t) => (t.id === payload.new.id ? payload.new : t)))
            addActivity(`Aktualizován: ${payload.new.title}`)
          } else if (payload.eventType === 'DELETE') {
            setTasks((prev) => prev.filter((t) => t.id !== payload.old.id))
            addActivity(`Smazán: ${payload.old.title}`)
          }
        }
      )
      .subscribe()
  }

  const addActivity = (message) => {
    const newActivity = {
      id: Date.now(),
      message,
      time: new Date(),
    }
    setActivity((prev) => [newActivity, ...prev.slice(0, 49)])
  }

  const handleSaveTask = async (formData) => {
    try {
      if (formData.id) {
        const { error } = await supabase
          .from('tasks')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (error) throw error
        addActivity(`Aktualizován: ${formData.title}`)
      } else {
        const { error } = await supabase.from('tasks').insert([
          {
            ...formData,
            created_by: user.email,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])

        if (error) throw error
        addActivity(`Nový úkol: ${formData.title}`)
      }

      setSelectedTask(null)
      setNewTaskAgent(null)
    } catch (err) {
      console.error('Error saving task:', err)
      alert('Chyba při ukládání úkolu')
    }
  }

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Opravdu chcete smazat tento úkol?')) return

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId)

      if (error) throw error
      setSelectedTask(null)
      addActivity('Úkol smazán')
    } catch (err) {
      console.error('Error deleting task:', err)
      alert('Chyba při mazání úkolu')
    }
  }

  const getFilteredTasks = (agentId) => {
    let filtered = tasks.filter((t) => t.agent === agentId)

    if (filter === 'critical') filtered = filtered.filter((t) => t.priority === 'high')
    if (filter === 'inprogress') filtered = filtered.filter((t) => t.status === 'inprogress')
    if (filter === 'waiting') filtered = filtered.filter((t) => t.status === 'waiting')

    return filtered
  }

  const stats = {
    completed: tasks.filter((t) => t.status === 'done').length,
    inprogress: tasks.filter((t) => t.status === 'inprogress').length,
    overdue: tasks.filter((t) => {
      if (!t.deadline) return false
      return new Date(t.deadline) < new Date() && t.status !== 'done'
    }).length,
  }

  if (!user) {
    return (
      <>
        <style>{css}</style>
        <LoginScreen onLogin={setUser} />
      </>
    )
  }

  return (
    <>
      <style>{css}</style>
      <div className="app-container">
        <div className="main-content">
          <div className="header">
            <div className="header-title">🧠 FITPRAHA.CZ Agent Board</div>
            <div className="header-controls">
              <span style={{ fontSize: '14px' }}>👤 {user.name}</span>
              <button
                className="sidebar-toggle"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title="Aktivita"
              >
                📋
              </button>
              <button className="sidebar-toggle" onClick={() => setUser(null)} title="Odhlásit se">
                🚪
              </button>
            </div>
          </div>

          <div className="filter-bar">
            {[
              { value: 'all', label: '👁️ Vše' },
              { value: 'critical', label: '🔴 Kritické' },
              { value: 'inprogress', label: '⚙️ Probíhá' },
              { value: 'waiting', label: '⏸️ Čeká' },
            ].map((f) => (
              <button
                key={f.value}
                className={`filter-btn ${filter === f.value ? 'active' : ''}`}
                onClick={() => setFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="stats-panel">
            <div className="stat-item completed">
              <span className="stat-label">✅ Splněno:</span>
              <span className="stat-value">{stats.completed}</span>
            </div>
            <div className="stat-item inprogress">
              <span className="stat-label">⚙️ Probíhá:</span>
              <span className="stat-value">{stats.inprogress}</span>
            </div>
            <div className="stat-item overdue">
              <span className="stat-label">🔴 Po termínu:</span>
              <span className="stat-value">{stats.overdue}</span>
            </div>
          </div>

          <div className="kanban-wrapper">
            <div className="kanban-board">
              {AGENTS.map((agent) => (
                <KanbanColumn
                  key={agent.id}
                  agent={agent}
                  tasks={getFilteredTasks(agent.id)}
                  onTaskClick={setSelectedTask}
                  onAddTask={(agentId) => {
                    setNewTaskAgent(agentId)
                    setSelectedTask({ agent: agentId })
                  }}
                  user={user}
                />
              ))}
            </div>
          </div>
        </div>

        <div className={`sidebar ${!sidebarOpen ? 'hidden' : ''}`}>
          <div className="sidebar-header">📋 Aktivita (posledních {activity.length})</div>
          <div className="sidebar-content">
            {activity.length === 0 ? (
              <div style={{ color: '#6B7280', fontSize: '12px', padding: '12px' }}>Zatím žádná aktivita</div>
            ) : (
              activity.map((item) => (
                <div key={item.id} className="activity-item">
                  <div>{item.message}</div>
                  <div className="activity-time">{item.time.toLocaleTimeString('cs-CZ')}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {(selectedTask || newTaskAgent) && (
          <TaskDetailModal
            task={selectedTask && selectedTask.id ? selectedTask : null}
            agent={selectedTask?.agent || newTaskAgent}
            onClose={() => {
              setSelectedTask(null)
              setNewTaskAgent(null)
            }}
            onSave={handleSaveTask}
            onDelete={handleDeleteTask}
            user={user}
          />
        )}
      </div>
    </>
  )
}
