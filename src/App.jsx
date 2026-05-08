import { useState, createContext, useContext, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import UserManagement from './pages/UserManagement'
import Sales from './pages/Sales'
import Maintenance from './pages/Maintenance'
import Accounting from './pages/Accounting'
import Inventory from './pages/Inventory'
import Reports from './pages/Reports'
import Fleet from './pages/Fleet'
import Login from './pages/Login'
import TechnicianApp from './pages/TechnicianApp'
import Chat from './pages/Chat'
import Settings from './pages/Settings'
import Installments from './pages/Installments'
import { users } from './data'

// ── Toast Context ──────────────────────────────────────────────────────────────
export const ToastContext = createContext(null)

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const showToast = useCallback((msg, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, msg, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const icons = { success: '✅', warning: '⚠️', error: '❌', info: 'ℹ️' }

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast toast-${t.type}`}>
            <span className="toast-icon">{icons[t.type]}</span>
            <span className="toast-msg">{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}

// ── Page labels ────────────────────────────────────────────────────────────────
const PAGE_LABELS = {
  dashboard:    'Dashboard',
  users:        'User Management',
  sales:        'Sales',
  maintenance:  'Maintenance',
  accounting:   'Accounting System',
  installments: 'Installment Management',
  inventory:    'Inventory',
  reports:      'Reports',
  fleet:        'Fleet / Vehicles',
  chat:         'Communication Center',
  settings:     'System Settings',
}

// ── Admin app ──────────────────────────────────────────────────────────────────
function AdminApp({ onLogout }) {
  const [page, setPage] = useState('dashboard')
  const [collapsed, setCollapsed] = useState(false)

  const renderPage = () => {
    switch (page) {
      case 'dashboard':    return <Dashboard onNavigate={setPage} />
      case 'users':        return <UserManagement />
      case 'sales':        return <Sales />
      case 'maintenance':  return <Maintenance />
      case 'accounting':   return <Accounting />
      case 'installments': return <Installments />
      case 'inventory':    return <Inventory />
      case 'reports':      return <Reports />
      case 'fleet':        return <Fleet />
      case 'chat':         return <Chat />
      case 'settings':     return <Settings />
      default:             return <Dashboard onNavigate={setPage} />
    }
  }

  return (
    <div className="app-root">
      <Sidebar page={page} onNavigate={setPage} collapsed={collapsed} onLogout={onLogout} />
      <div className="main-content">
        <Header
          pageLabel={PAGE_LABELS[page]}
          onToggle={() => setCollapsed(c => !c)}
          collapsed={collapsed}
          onLogout={onLogout}
          onNavigate={setPage}
        />
        <div className="page-wrap">
          {renderPage()}
        </div>
      </div>
    </div>
  )
}

// ── Auth router ────────────────────────────────────────────────────────────────
function AuthRouter() {
  const [auth, setAuth] = useState(null) // null | { role: 'admin' | 'technician', userId: number }

  const handleLogin  = (role, userId) => setAuth({ role, userId })
  const handleLogout = () => setAuth(null)

  if (!auth) return <Login onLogin={handleLogin} />

  if (auth.role === 'technician') {
    const techUser = users.find(u => u.id === auth.userId)
    return <TechnicianApp techUser={techUser} onLogout={handleLogout} />
  }

  return <AdminApp onLogout={handleLogout} />
}

// ── Root ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ToastProvider>
      <AuthRouter />
    </ToastProvider>
  )
}
