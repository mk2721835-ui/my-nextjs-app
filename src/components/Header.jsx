import { useState } from 'react'
import { 
  Menu, 
  Search, 
  Bell, 
  ChevronDown, 
  FileText, 
  Package, 
  AlertTriangle, 
  CreditCard 
} from 'lucide-react'

export default function Header({ pageLabel, onToggle, onLogout }) {
  const [notifOpen, setNotifOpen] = useState(false)

  const notifications = [
    { icon: FileText, text: 'New invoice INV-0045 from field', time: '5 min ago', unread: true, color: '#3b82f6' },
    { icon: Package, text: 'Parts request PR-003 pending approval', time: '2 hrs ago', unread: true, color: '#8b5cf6' },
    { icon: AlertTriangle, text: 'Low stock: Inverter 5kW (3 left)', time: '3 hrs ago', unread: true, color: '#f59e0b' },
    { icon: CreditCard, text: 'Overdue payment: Fatima Hassan', time: '1 day ago', unread: false, color: '#ef4444' },
  ]

  return (
    <header className="header">
      {/* Sidebar toggle */}
      <button className="header-toggle btn" onClick={onToggle} title="Toggle sidebar">
        <Menu size={20} />
      </button>

      {/* Breadcrumb */}
      <div className="header-breadcrumb">
        <span style={{ fontWeight: 600, color: 'var(--text-3)', fontSize: 13, letterSpacing: '0.5px' }}>ACZONE</span>
        <span className="header-breadcrumb-sep" style={{ color: 'var(--text-3)', margin: '0 8px', opacity: 0.5 }}>/</span>
        <span className="header-breadcrumb-active" style={{ fontWeight: 700, color: 'var(--text-1)' }}>{pageLabel}</span>
      </div>

      {/* Right Side */}
      <div className="header-right">
        {/* Search */}
        <div className="header-search">
          <Search size={16} style={{ color: 'var(--text-3)' }} />
          <input placeholder="Search records..." />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button
            className="header-icon-btn btn"
            onClick={() => setNotifOpen(o => !o)}
            title="Notifications"
          >
            <Bell size={20} />
            <span className="header-notif-dot" />
          </button>
          
          {notifOpen && (
            <div className="dropdown-menu" style={{
              position: 'absolute', right: 0, top: '120%',
              background: '#ffffff', borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)', border: '1px solid #f1f5f9',
              width: 320, zIndex: 200, overflow: 'hidden'
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 14, color: '#1e293b' }}>Notifications</span>
                <span className="badge badge-danger" style={{ fontSize: 10 }}>3 New</span>
              </div>
              
              <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {notifications.map((n, i) => {
                  const Icon = n.icon
                  return (
                    <div key={i} style={{
                      display: 'flex', gap: 12, padding: '14px 16px',
                      background: n.unread ? '#f8fafc' : 'white',
                      borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                      onMouseLeave={e => e.currentTarget.style.background = n.unread ? '#f8fafc' : 'white'}
                    >
                      <div style={{ 
                        width: 36, height: 36, borderRadius: '10px', 
                        background: `${n.color}15`, color: n.color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={18} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, fontWeight: n.unread ? 600 : 500, color: '#334155', lineHeight: 1.4 }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4 }}>{n.time}</div>
                      </div>
                      {n.unread && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444', marginTop: 6 }} />}
                    </div>
                  )
                })}
              </div>
              
              <div style={{ padding: '12px', textAlign: 'center', borderTop: '1px solid #f1f5f9' }}>
                <button className="btn btn-ghost btn-sm" onClick={() => setNotifOpen(false)} style={{ width: '100%', fontSize: 12, fontWeight: 600 }}>
                  View All Notifications
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: 1, height: 24, background: '#e2e8f0', margin: '0 8px' }} />

        {/* Profile */}
        <div className="header-profile" style={{ cursor: 'pointer' }}>
          <div className="header-profile-avatar" style={{ 
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)'
          }}>SM</div>
          <div className="hide-mobile">
            <div className="header-profile-name" style={{ fontWeight: 700 }}>Saud Al-Maliki</div>
            <div className="header-profile-role">Administrator</div>
          </div>
          <ChevronDown size={14} style={{ color: 'var(--text-3)', marginLeft: 4 }} />
        </div>
      </div>
    </header>
  )
}
