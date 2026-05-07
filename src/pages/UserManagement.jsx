import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { users, permissions, invoices, maintenanceRequests, installmentPlans, partsRequests, orders, vehicles, vehicleAssignments, products, devices, technicalReports, reviews, vehicleActivityLogs, recentActivity, teams } from '../data'
import { useToast } from '../App'
import { 
  Users, 
  UserPlus, 
  User,
  ShieldCheck, 
  Search, 
  Download, 
  LayoutGrid, 
  List, 
  Eye, 
  Pencil, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Briefcase,
  TrendingUp,
  UserCheck,
  Globe,
  MoreVertical,
  Activity,
  ArrowRight,
  Shield,
  FileText,
  CreditCard,
  ShoppingBag,
  Package,
  DollarSign,
  Award,
  Zap,
  Lock,
  Truck,
  HardDrive,
  History,
  Clipboard,
  ClipboardList,
  Map,
  Settings,
  Plus,
  Filter,
  Layers,
  Box,
  Wrench
} from 'lucide-react'

const ROLES = ['Client', 'Technician', 'Engineer', 'Accountant', 'Management']
const ROLE_COLORS = {
  Client: '#3b82f6', 
  Technician: '#10b981', 
  Engineer: '#06b6d4',
  Accountant: '#8b5cf6', 
  Management: '#475569', 
  Admin: '#ef4444'
}
const STATUS_COLORS = { 
  Active: 'success', 
  Online: 'success', 
  Offline: 'gray', 
  Inactive: 'gray', 
  Busy: 'warning' 
}

// ── Unique Card Component ───────────────────────────────────────────────────
function UserIdentityCard({ user, onEdit, onDelete, onView }) {
  const [hovered, setHovered] = useState(false)
  const roleColor = ROLE_COLORS[user.role] || '#475569'

  return (
    <div 
      className="glass-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ 
        position: 'relative',
        padding: '24px',
        borderRadius: '30px',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: hovered ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        height: '100%',
        boxShadow: hovered 
          ? `0 30px 60px -12px ${roleColor}25, 0 18px 36px -18px rgba(0,0,0,0.3)` 
          : '0 10px 30px -10px rgba(0,0,0,0.1)',
        overflow: 'hidden'
      }}
      onClick={() => onView(user)}
    >
      {/* Dynamic Role Glow Background */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        background: `radial-gradient(circle, ${roleColor}20 0%, transparent 70%)`,
        borderRadius: '50%',
        pointerEvents: 'none',
        transition: 'all 0.5s',
        transform: hovered ? 'scale(2)' : 'scale(1)',
      }} />

      {/* Top Section: Identity */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', position: 'relative', zIndex: 1 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '24px',
            background: `linear-gradient(135deg, ${user.color} 0%, ${roleColor} 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px',
            fontWeight: 900,
            color: 'white',
            boxShadow: `0 12px 24px ${roleColor}40`,
            transform: hovered ? 'rotate(-5deg) scale(1.1)' : 'rotate(0) scale(1)',
            transition: 'all 0.3s'
          }}>
            {user.initials}
          </div>
          <div style={{
            position: 'absolute',
            bottom: '-6px',
            right: '-6px',
            background: 'white',
            padding: '4px',
            borderRadius: '12px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
          }}>
            <div className={`online-dot ${user.status==='Online' ? 'online' : user.status==='Busy' ? 'busy' : 'offline'}`} 
              style={{ width: '12px', height: '12px', border: 'none' }} 
            />
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 900, 
            color: roleColor, 
            textTransform: 'uppercase', 
            letterSpacing: '1.5px',
            marginBottom: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{ width: '8px', height: '2px', background: 'currentColor' }} />
            {user.role}
          </div>
          <h3 style={{ 
            fontSize: '19px', 
            fontWeight: 900, 
            color: '#0f172a', 
            margin: 0,
            lineHeight: 1.2
          }}>{user.name}</h3>
        </div>
      </div>

      {/* Middle Section: Bento Info */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '12px',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ 
          background: 'rgba(255,255,255,0.4)', 
          padding: '12px', 
          borderRadius: '18px', 
          border: '1px solid rgba(255,255,255,0.5)'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', marginBottom: '4px' }}>CONTACT</div>
          <div style={{ fontSize: '12px', color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Phone size={12} /> {user.phone.slice(-4)}
          </div>
        </div>
        <div style={{ 
          background: 'rgba(255,255,255,0.4)', 
          padding: '12px', 
          borderRadius: '18px', 
          border: '1px solid rgba(255,255,255,0.5)'
        }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b', marginBottom: '4px' }}>LOCATION</div>
          <div style={{ fontSize: '12px', color: '#334155', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={12} /> {user.city || '—'}
          </div>
        </div>
      </div>

      {/* Stats Section: High Visibility */}
      <div style={{ 
        marginTop: '4px',
        padding: '16px',
        background: '#0f172a',
        borderRadius: '22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        {user.role === 'Technician' ? (
          <>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 950, lineHeight: 1 }}>{user.jobsDone}</div>
              <div style={{ fontSize: '9px', fontWeight: 700, opacity: 0.6, letterSpacing: '1px' }}>JOBS</div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '24px', fontWeight: 950, lineHeight: 1, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                <Star size={18} fill="#f59e0b" /> {user.rating}
              </div>
              <div style={{ fontSize: '9px', fontWeight: 700, opacity: 0.6, letterSpacing: '1px' }}>RATING</div>
            </div>
          </>
        ) : (
          <>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 950, lineHeight: 1 }}>{user.totalOrders || 0}</div>
              <div style={{ fontSize: '9px', fontWeight: 700, opacity: 0.6, letterSpacing: '1px' }}>ORDERS</div>
            </div>
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }} />
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '18px', fontWeight: 950, lineHeight: 1, color: '#10b981' }}>
                {user.totalPaid ? `SAR ${Math.round(user.totalPaid/1000)}k` : '—'}
              </div>
              <div style={{ fontSize: '9px', fontWeight: 700, opacity: 0.6, letterSpacing: '1px' }}>REVENUE</div>
            </div>
          </>
        )}
      </div>

      {/* Hover Actions: Sleek revealing buttons */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,255,255,0.85)',
        backdropFilter: 'blur(10px)',
        height: hovered ? '70px' : '0px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        opacity: hovered ? 1 : 0,
        zIndex: 2,
        padding: hovered ? '0 24px' : '0'
      }} onClick={e => e.stopPropagation()}>
        <button className="btn btn-primary btn-sm" style={{ flex: 1, borderRadius: '14px', height: '42px', gap: '8px' }} onClick={() => onView(user)}>
          <Eye size={16} /> View Details
        </button>
        <button className="btn btn-ghost btn-sm" style={{ width: '42px', height: '42px', borderRadius: '14px', padding: 0 }} onClick={e => onEdit(user, e)}>
          <Pencil size={16} />
        </button>
        <button className="btn btn-danger btn-sm" style={{ width: '42px', height: '42px', borderRadius: '14px', padding: 0 }} onClick={e => onDelete(user, e)}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

function ViewToggle({ mode, setMode }) {
  return (
    <div style={{ 
      display: 'flex', 
      gap: 4, 
      background: '#e2e8f0', 
      borderRadius: '16px', 
      padding: '4px', 
      border: '1px solid #cbd5e1'
    }}>
      {[
        { id: 'grid', icon: LayoutGrid, label: 'Creative' },
        { id: 'table', icon: List, label: 'List' }
      ].map(({ id, icon: Icon, label }) => (
        <button 
          key={id} 
          onClick={() => setMode(id)}
          style={{ 
            padding: '8px 18px', 
            borderRadius: '12px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '12px', 
            fontWeight: 800,
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
            background: mode === id ? '#0f172a' : 'transparent',
            boxShadow: mode === id ? '0 10px 15px -3px rgba(0,0,0,0.2)' : 'none',
            color: mode === id ? 'white' : '#64748b',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  )
}

function SectionTitle({ icon: Icon, title, color = '#3b82f6' }) {
  return (
    <div style={{ 
      fontSize: '16px', 
      fontWeight: 900, 
      color: '#0f172a', 
      marginBottom: '20px', 
      marginTop: '40px',
      display: 'flex', 
      alignItems: 'center', 
      gap: '12px' 
    }}>
      <div style={{ 
        width: '36px', 
        height: '36px', 
        borderRadius: '10px', 
        background: `${color}15`, 
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={20} />
      </div>
      {title.toUpperCase()}
    </div>
  )
}

function DeviceCard({ device, onServiceRequest, onViewDetails }) {
  const [showHistory, setShowHistory] = useState(false)

  return (
    <div className="glass-card" style={{ padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#3b82f615', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <HardDrive size={24} />
        </div>
        <div style={{ 
          background: device.status === 'Optimal' ? '#10b98115' : '#f59e0b15', 
          color: device.status === 'Optimal' ? '#10b981' : '#f59e0b', 
          padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 900 
        }}>{device.status.toUpperCase()}</div>
      </div>
      <div style={{ fontWeight: 900, fontSize: '15px', color: '#0f172a', marginBottom: '4px' }}>{device.name}</div>
      <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, marginBottom: '16px' }}>SN: {device.serial}</div>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className="btn btn-ghost" style={{ flex: 1, borderRadius: '12px', padding: '10px', fontSize: '11px', border: '1px solid #e2e8f0' }} onClick={() => onViewDetails && onViewDetails(device)}>
          View Details
        </button>
        <button className="btn btn-ghost" style={{ flex: 1, borderRadius: '12px', padding: '10px', fontSize: '11px', border: '1px solid #e2e8f0', background: showHistory ? '#f1f5f9' : 'transparent' }} onClick={() => setShowHistory(!showHistory)}>
          Service History
        </button>
      </div>

      {showHistory && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>SERVICE HISTORY LOG</div>
          {device.history && device.history.map((h, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
              <History size={12} color="#94a3b8" /> {h}
            </div>
          ))}
          {(!device.history || device.history.length === 0) && (
            <div style={{ fontSize: '11px', color: '#94a3b8', fontStyle: 'italic' }}>No history available.</div>
          )}
        </div>
      )}

      <button className="btn btn-primary" style={{ width: '100%', borderRadius: '12px', padding: '10px', fontSize: '12px' }} onClick={() => onServiceRequest(device.name)}>
        Request Service
      </button>
    </div>
  )
}

export default function UserManagement() {
  const toast = useToast()
  const [tab, setTab]           = useState('all')
  const [search, setSearch]     = useState('')
  const [modal, setModal]       = useState(null)
  const [profileTab, setProfileTab] = useState('overview')
  const [selected, setSelected] = useState(null)
  const [selectedReport, setSelectedReport] = useState(null)
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [selectedDevice, setSelectedDevice] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [viewMode, setViewMode] = useState('grid')
  const [form, setForm]         = useState({ name:'', role:'Client', email:'', phone:'', city:'', status:'Active' })
  const [mounted, setMounted]   = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filtered = users.filter(u => {
    const matchTab    = tab === 'all' || u.role.toLowerCase() === tab
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  })

  const openAdd    = () => { setForm({ name:'', role:'Client', email:'', phone:'', city:'', status:'Active' }); setModal('add') }
  const openEdit   = (u, e) => { e.stopPropagation(); setSelected(u); setForm({ name:u.name, role:u.role, email:u.email, phone:u.phone, city:u.city||'', status:u.status }); setModal('edit') }
  const openView   = u => { setSelected(u); setProfileTab('overview'); setModal('view') }
  const openDelete = (u, e) => { e.stopPropagation(); setSelected(u); setModal('delete') }

  const handleSave   = () => { toast(modal==='add' ? `User "${form.name}" added successfully` : `User "${form.name}" updated`, 'success'); setModal(null) }
  const handleDelete = () => { toast(`User "${selected.name}" removed`, 'warning'); setModal(null) }

  const TABS = [
    { id:'all',         label:'Entire Directory', count:users.length },
    { id:'client',      label:'Clients',          count:users.filter(u => u.role==='Client').length },
    { id:'technician',  label:'Technicians',      count:users.filter(u => u.role==='Technician').length },
    { id:'teams',       label:'Operational Teams', count:teams.length },
    { id:'management',  label:'Staff',            count:users.filter(u => ['Engineer','Accountant','Management'].includes(u.role)).length },
  ]

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease' }}>
      {/* Dynamic Header */}
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            background: 'rgba(59, 130, 246, 0.1)',
            padding: '6px 16px',
            borderRadius: '99px',
            width: 'fit-content',
            marginBottom: '12px',
            fontSize: '12px',
            fontWeight: 800,
            color: '#3b82f6',
            letterSpacing: '0.5px'
          }}>
            <Activity size={14} /> DIRECTORY ACCESS
          </div>
          <h1 className="page-title" style={{ fontSize: '36px', fontWeight: 950, letterSpacing: '-1px' }}>
            User Management
          </h1>
          <p className="page-subtitle" style={{ fontSize: '15px', marginTop: '4px', opacity: 0.7 }}>
            System-wide user directory and permission orchestration.
          </p>
        </div>
        <div className="page-header-actions" style={{ gap: '16px' }}>
          <button className="btn btn-ghost" onClick={() => setModal('rbac')} style={{ gap: '10px', borderRadius: '18px', padding: '12px 24px' }}>
            <ShieldCheck size={20} /> Permissions
          </button>
          <button className="btn btn-primary" onClick={openAdd} style={{ 
            gap: '10px', 
            padding: '14px 32px', 
            borderRadius: '18px',
            background: '#0f172a',
            border: 'none',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)'
          }}>
            <UserPlus size={20} />
            Add Identity
          </button>
        </div>
      </div>

      {/* Unique Search & Filter Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '40px', 
        flexWrap: 'wrap', 
        gap: '24px',
        padding: '12px',
        background: '#f8fafc',
        borderRadius: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {TABS.map(t => (
            <button key={t.id} 
              onClick={() => { setTab(t.id); setViewMode(viewMode); setSearch('') }}
              style={{
                padding: '10px 20px',
                borderRadius: '16px',
                border: 'none',
                background: tab === t.id ? 'white' : 'transparent',
                color: tab === t.id ? '#0f172a' : '#64748b',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: tab === t.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {t.label} 
              <span style={{ 
                marginLeft: '8px',
                background: tab === t.id ? '#0f172a' : '#e2e8f0',
                color: tab === t.id ? 'white' : '#64748b',
                padding: '2px 8px',
                borderRadius: '8px',
                fontSize: '11px'
              }}>{t.count}</span>
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'flex-end' }}>
          <div className="search-input-wrap" style={{ 
            minWidth: '320px', 
            borderRadius: '16px', 
            background: 'white',
            padding: '10px 18px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
          }}>
            <Search size={18} color="#94a3b8" />
            <input 
              placeholder="Filter by name, email or city..." 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: '14px', fontWeight: 500 }}
            />
          </div>
          <ViewToggle mode={viewMode} setMode={setViewMode} />
          <button className="btn btn-ghost" onClick={() => toast('Users exported', 'success')} style={{ width: '48px', height: '48px', borderRadius: '16px' }}>
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* ── GRID VIEW ── */}
      {viewMode === 'grid' ? (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
          gap: '32px',
          perspective: '1000px'
        }}>
          {tab === 'teams' ? (
            <>
              {teams.map((team, idx) => (
                <div key={team.id} className="glass-card" style={{ padding: '24px', borderRadius: '30px', animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both`, borderLeft: `6px solid ${team.color}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${team.color}15`, color: team.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Layers size={28} />
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px' }}>TEAM ID</div>
                      <div style={{ fontSize: '14px', fontWeight: 950, color: '#0f172a' }}>{team.id}</div>
                    </div>
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', margin: '0 0 4px 0' }}>{team.name}</h3>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginBottom: '20px' }}>{team.area}</div>
                  
                  <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', marginBottom: '20px' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '12px' }}>TEAM MEMBERS</div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {team.members.map(mid => {
                        const m = users.find(u => u.id === mid)
                        return (
                          <div key={mid} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', padding: '4px 10px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '5px', background: m?.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 900 }}>{m?.initials}</div>
                            <span style={{ fontSize: '11px', fontWeight: 700 }}>{m?.name.split(' ')[0]}</span>
                          </div>
                        )
                      })}
                      <button className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', borderRadius: '8px', border: '1px dashed #cbd5e1' }} onClick={() => toast('Redirecting to member selection...', 'info')}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#10b981' }}>{team.activeJobs} Active Jobs</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-ghost btn-sm" style={{ width: '36px', height: '36px' }} onClick={() => toast('Team analytics loading...', 'info')}><Activity size={16} /></button>
                      <button className="btn btn-ghost btn-sm" style={{ width: '36px', height: '36px' }} onClick={() => setModal('edit_team')}><Pencil size={16} /></button>
                    </div>
                  </div>
                </div>
              ))}
              <div 
                className="glass-card" 
                style={{ border: '2px dashed #cbd5e1', background: 'transparent', borderRadius: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '280px', cursor: 'pointer' }}
                onClick={() => setModal('add_team')}
              >
                <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                  <Plus size={32} color="#94a3b8" />
                </div>
                <div style={{ fontWeight: 950, color: '#0f172a' }}>Assemble New Team</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>Combine experts for field ops</div>
              </div>
            </>
          ) : (
            filtered.map((u, idx) => (
              <div key={u.id} style={{ 
                animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both`,
              }}>
                <UserIdentityCard 
                  user={u} 
                  onEdit={openEdit} 
                  onDelete={openDelete} 
                  onView={openView} 
                />
              </div>
            ))
          )}
          
          {filtered.length === 0 && (
            <div style={{ gridColumn:'1/-1', textAlign:'center', padding:'100px 0' }}>
              <div style={{ 
                background: '#f1f5f9', 
                width: '100px', 
                height: '100px', 
                borderRadius: '35px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                margin: '0 auto 24px',
                transform: 'rotate(10deg)'
              }}>
                <XCircle size={48} color="#94a3b8" />
              </div>
              <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>Zero Results Found</h2>
              <p style={{ opacity: 0.6 }}>No identities match your current selection.</p>
            </div>
          )}
        </div>
      ) : (
        /* ── TABLE VIEW ── */
        <div className="table-container" style={{ borderRadius: '30px', border: '1px solid #e2e8f0', background: 'white' }}>
          <table className="table">
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '24px', borderRadius: '30px 0 0 0' }}>MEMBER IDENTITY</th>
                <th>SECURITY ROLE</th>
                <th>CONTACT DETAILS</th>
                <th>LOCATION</th>
                <th>VITALITY</th>
                <th>ONBOARDED</th>
                <th style={{ borderRadius: '0 30px 0 0' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
               {tab === 'teams' ? (
                teams.map(team => (
                  <tr key={team.id} style={{ transition: 'all 0.2s' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                        <div style={{ background: `${team.color}15`, color: team.color, width: '48px', height: '48px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Layers size={24} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{team.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{team.area}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '12px' }}>{users.find(u => u.id === team.leadId)?.initials}</div>
                        <div style={{ fontSize: '13px', fontWeight: 700 }}>{team.leadName}</div>
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>{team.members.length} Members</td>
                    <td style={{ fontSize: '13px', color: '#64748b' }}>{team.area}</td>
                    <td>
                      <div style={{ color: '#10b981', fontSize: '11px', fontWeight: 900 }}>{team.activeJobs} ACTIVE JOBS</div>
                    </td>
                    <td style={{ fontSize: '12px', color: '#94a3b8' }}>{team.id}</td>
                    <td>
                      <div className="table-actions" style={{ gap: '10px' }}>
                        <button className="btn btn-ghost btn-sm" style={{ width: '36px', height: '36px' }} onClick={() => toast('Team analytics loading...', 'info')}>
                          <Activity size={16} />
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ width: '36px', height: '36px' }} onClick={() => setModal('edit_team')}>
                          <Settings size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                filtered.map(u => (
                  <tr key={u.id} onClick={() => openView(u)} style={{ transition: 'all 0.2s' }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                        <div className="avatar" style={{ 
                          background: u.color, 
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '16px',
                          fontSize: '18px',
                          fontWeight: 900,
                          boxShadow: `0 8px 16px ${u.color}30`
                        }}>{u.initials}</div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{u.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: 8,
                        background: `${ROLE_COLORS[u.role] || '#475569'}10`, 
                        color: ROLE_COLORS[u.role] || '#475569',
                        fontSize: '11px', 
                        fontWeight: 900, 
                        padding: '6px 14px', 
                        borderRadius: '10px',
                        letterSpacing: '0.5px'
                      }}>
                        <Briefcase size={12} />
                        {u.role.toUpperCase()}
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', color: '#334155', fontWeight: 600 }}>{u.phone}</td>
                    <td style={{ fontSize: '13px', color: '#64748b' }}>{u.city || '—'}</td>
                    <td>
                      <div className={`badge badge-${STATUS_COLORS[u.status] || 'gray'}`} style={{ 
                        borderRadius: '10px', 
                        padding: '6px 14px',
                        fontSize: '11px',
                        fontWeight: 800,
                        gap: 8
                      }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'currentColor', boxShadow: '0 0 10px currentColor' }} />
                        {u.status}
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', color: '#94a3b8' }}>{u.joinDate}</td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="table-actions" style={{ gap: '10px' }}>
                        <button className="btn btn-ghost btn-sm" style={{ width: '36px', height: '36px' }} onClick={() => openView(u)}>
                          <Eye size={16} />
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ width: '36px', height: '36px' }} onClick={e => openEdit(u, e)}>
                          <Pencil size={16} />
                        </button>
                        <button className="btn btn-danger btn-sm" style={{ width: '36px', height: '36px' }} onClick={e => openDelete(u, e)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="table-pagination" style={{ padding: '24px' }}>
            <span style={{ fontSize: '14px', color: '#64748b', fontWeight: 600 }}>
              Viewing <span style={{ color: '#0f172a' }}>{filtered.length}</span> of <span style={{ color: '#0f172a' }}>{users.length}</span> system identities
            </span>
            <div className="table-pagination-btns">
              <button className="table-pagination-btn active">1</button>
              <button className="table-pagination-btn">2</button>
            </div>
          </div>
        </div>
      )}

      {/* ── All Modals keep their premium structure from before but with updated branding ── */}
      {/* ── Standardized Identity Profile Modal ── */}
      {modal === 'view' && selected && (() => {
        const clientTabs = [
          { id: 'overview', icon: User, label: 'Profile' },
          { id: 'assets', icon: HardDrive, label: 'Device', count: devices.filter(d => d.clientId === selected.id).length },
          { id: 'maintenance', icon: Wrench, label: 'Maintenance', count: maintenanceRequests.filter(m => m.client === selected.name).length },
          { id: 'finance', icon: ShoppingBag, label: 'Order', count: orders.filter(o => o.clientId === selected.id).length },
          { id: 'invoices', icon: FileText, label: 'Invoice', count: invoices.filter(i => i.clientId === selected.id).length },
          { id: 'installments', icon: CreditCard, label: 'Installment', count: installmentPlans.filter(p => p.clientId === selected.id).length },
          { id: 'activity', icon: Activity, label: 'Activity' },
          { id: 'reviews', icon: Star, label: 'Review' },
        ]

        const techTabs = [
          { id: 'overview', icon: User, label: 'Profile' },
          { id: 'tasks', icon: ClipboardList, label: 'Task', count: maintenanceRequests.filter(r => r.technician === selected.name).length },
          { id: 'vehicle', icon: Truck, label: 'Vehicle' },
          { id: 'team', icon: Users, label: 'Team' },
          { id: 'spare-parts', icon: Package, label: 'Spare Parts' },
          { id: 'salary', icon: DollarSign, label: 'Salary' },
          { id: 'invoices', icon: FileText, label: 'Invoice', count: invoices.filter(i => i.techId === selected.id).length },
          { id: 'reports', icon: Clipboard, label: 'Report' },
          { id: 'activity', icon: Activity, label: 'Activity' },
          { id: 'reviews', icon: Star, label: 'Review' },
        ]

        const activeTabs = selected.role === 'Client' ? clientTabs : techTabs

        return (
          <Modal title={selected.name} onClose={() => setModal(null)} size="lg"
            footer={
              <>
                <button className="btn btn-ghost" style={{ borderRadius: '16px', padding: '10px 24px' }} onClick={() => setModal(null)}>Dismiss</button>
                <button className="btn btn-primary" style={{ borderRadius: '16px', padding: '10px 32px', gap: '8px', background: '#0f172a' }} onClick={e => openEdit(selected, { stopPropagation: () => {} })}>
                  <Pencil size={18} /> Update Profile
                </button>
              </>
            }
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {/* Header Identity */}
              <div style={{ display: 'flex', gap: '24px', alignItems: 'center', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
                <div style={{ 
                  width: '100px', 
                  height: '100px', 
                  borderRadius: '32px', 
                  background: selected.color || '#3b82f6', 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '40px', 
                  fontWeight: 950,
                  boxShadow: `0 20px 40px ${selected.color || '#3b82f6'}30`
                }}>
                  {selected.initials || selected.name.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <h2 style={{ fontSize: '32px', fontWeight: 950, margin: 0, color: '#0f172a', letterSpacing: '-1px' }}>{selected.name}</h2>
                    <span style={{ background: '#0f172a', color: 'white', fontSize: '10px', fontWeight: 900, padding: '4px 12px', borderRadius: '99px', letterSpacing: '1px' }}>{selected.role.toUpperCase()}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '24px', marginTop: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
                      <Mail size={16} /> {selected.email}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
                      <Phone size={16} /> {selected.phone}
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab Navigation */}
              <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '4px', paddingBottom: '12px' }}>
                {activeTabs.map(t => (
                  <button key={t.id} onClick={() => setProfileTab(t.id)}
                    style={{
                      padding: '12px 20px',
                      borderRadius: '16px',
                      border: profileTab === t.id ? 'none' : '1px solid #e2e8f0',
                      background: profileTab === t.id ? '#b91c1c' : 'white',
                      color: profileTab === t.id ? 'white' : '#64748b',
                      fontSize: '13px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.3s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      whiteSpace: 'nowrap',
                      boxShadow: profileTab === t.id ? '0 10px 20px -5px rgba(185, 28, 28, 0.4)' : 'none'
                    }}
                  >
                    <t.icon size={16} />
                    {t.label}
                    {t.count > 0 && (
                      <div style={{
                        background: profileTab === t.id ? 'white' : '#b91c1c',
                        color: profileTab === t.id ? '#b91c1c' : 'white',
                        fontSize: '10px',
                        fontWeight: 900,
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {t.count}
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              {profileTab === 'overview' && (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {[
                      { icon: Mail, label: 'EMAIL DESTINATION', val: selected.email },
                      { icon: Phone, label: 'CONTACT LINE', val: selected.phone },
                      { icon: MapPin, label: 'REGISTERED CITY', val: selected.city || 'UNSET' },
                      { icon: Calendar, label: 'ONBOARDING DATE', val: selected.joinDate || '—' },
                      { icon: Clock, label: 'LAST SYSTEM INTERACTION', val: selected.lastActive || '—' },
                      { icon: TrendingUp, label: 'SECURITY SCORE', val: '98% (HEALTHY)' }
                    ].map(({ icon: Icon, label, val }) => (
                      <div key={label} style={{ background: '#f8fafc', padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9', display: 'flex', gap: '16px' }}>
                        <div style={{ color: '#0f172a', background: 'white', width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>
                          <Icon size={20} />
                        </div>
                        <div>
                          <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, letterSpacing: '1px', marginBottom: '4px' }}>{label}</div>
                          <div style={{ fontSize: '15px', fontWeight: 800, color: '#1e293b' }}>{val}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selected.role === 'Technician' && (
                    <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '24px', border: '1px solid #dcfce7', display: 'flex', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Users size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 900, color: '#10b981', letterSpacing: '1px' }}>TEAM MEMBERSHIP</div>
                        <div style={{ fontSize: '15px', fontWeight: 850, color: '#064e3b' }}>
                          {teams.find(t => t.members.includes(selected.id))?.name || 'Independent Specialist'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#166534', fontWeight: 600 }}>
                          {teams.find(t => t.members.includes(selected.id)) ? `Operational Area: ${teams.find(t => t.members.includes(selected.id)).area}` : 'Not currently assigned to a permanent team.'}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {selected.role === 'Client' && profileTab === 'assets' && (() => {
                const clientDevices = devices.filter(d => d.clientId === selected.id)
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                      {[
                        { label: 'Total Assets', val: clientDevices.length, color: '#3b82f6' },
                        { label: 'Optimal Status', val: clientDevices.filter(d => d.status === 'Optimal').length, color: '#10b981' },
                        { label: 'Active Alerts', val: clientDevices.filter(d => d.status === 'Warning').length, color: '#f59e0b' }
                      ].map(s => (
                        <div key={s.label} style={{ background: '#f8fafc', padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                          <div style={{ fontSize: '28px', fontWeight: 950, color: s.color }}>{s.val}</div>
                          <div style={{ fontSize: '10px', fontWeight: 900, color: '#64748b', letterSpacing: '1px' }}>{s.label.toUpperCase()}</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ borderRadius: '24px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f8fafc' }}>
                            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: '#94a3b8' }}>ASSET</th>
                            <th style={{ padding: '16px 24px', textAlign: 'left', fontSize: '11px', color: '#94a3b8' }}>SERIAL</th>
                            <th style={{ padding: '16px 24px', textAlign: 'center', fontSize: '11px', color: '#94a3b8' }}>STATUS</th>
                            <th style={{ padding: '16px 24px', textAlign: 'right', fontSize: '11px', color: '#94a3b8' }}>ACTION</th>
                          </tr>
                        </thead>
                        <tbody>
                          {clientDevices.map(d => (
                            <tr key={d.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                              <td style={{ padding: '16px 24px', fontWeight: 800 }}>{d.name}</td>
                              <td style={{ padding: '16px 24px', fontSize: '12px', fontFamily: 'monospace' }}>{d.serial}</td>
                              <td style={{ padding: '16px 24px', textAlign: 'center' }}>
                                <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '10px', fontWeight: 900, background: d.status === 'Optimal' ? '#ecfdf5' : '#fffbeb', color: d.status === 'Optimal' ? '#10b981' : '#f59e0b' }}>
                                  {d.status.toUpperCase()}
                                </span>
                              </td>
                              <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                <button className="btn btn-ghost btn-sm" onClick={() => setSelectedDevice(d)}><Eye size={14}/></button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              })()}

              {selected.role === 'Client' && profileTab === 'maintenance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {maintenanceRequests.filter(m => m.client === selected.name).map(req => (
                    <div key={req.id} style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                          <Wrench size={20} color="#64748b" />
                        </div>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: '16px', color: '#0f172a' }}>{req.type}</div>
                          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 700 }}>{req.id} · {req.date}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', fontWeight: 900, color: req.status === 'Completed' ? '#10b981' : '#3b82f6', marginBottom: '8px' }}>{req.status.toUpperCase()}</div>
                        <button className="btn btn-ghost btn-sm" style={{ fontSize: '11px', fontWeight: 800 }} onClick={() => setSelectedTask(req)}>Audit Ticket</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(selected.role === 'Client' || selected.role === 'Technician') && profileTab === 'invoices' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {invoices.filter(i => (selected.role === 'Client' ? i.clientId === selected.id : i.techId === selected.id)).map(inv => (
                    <div key={inv.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: inv.status === 'Paid' ? '#10b98115' : '#f59e0b15', color: inv.status === 'Paid' ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <FileText size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{inv.id} — {inv.type}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{inv.date}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontWeight: 900, color: inv.status === 'Paid' ? '#10b981' : '#f59e0b' }}>SAR {inv.total.toLocaleString()}</div>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>{inv.status.toUpperCase()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selected.role === 'Client' && profileTab === 'finance' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.filter(o => o.clientId === selected.id).map(order => (
                    <div key={order.id} style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: '16px' }}>{order.id}</div>
                          <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 700 }}>{order.date} · {order.items.length} units</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '18px', fontWeight: 950, color: '#0f172a' }}>SAR {order.amount.toLocaleString()}</div>
                          <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 900 }}>{order.status.toUpperCase()}</div>
                        </div>
                      </div>
                      {/* Visual Tracker */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', position: 'relative', marginTop: '20px', padding: '0 10px' }}>
                        <div style={{ position: 'absolute', top: '10px', left: '20px', right: '20px', height: '2px', background: '#e2e8f0', zIndex: 0 }} />
                        <div style={{ position: 'absolute', top: '10px', left: '20px', width: order.status === 'Delivered' ? '100%' : '50%', height: '2px', background: '#3b82f6', zIndex: 0 }} />
                        {['Placed', 'Shipped', 'Delivered'].map((step, idx) => (
                          <div key={idx} style={{ position: 'relative', zIndex: 1, textAlign: 'center' }}>
                            <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: (idx === 0 || (idx === 1 && (order.status === 'Shipped' || order.status === 'Delivered')) || (idx === 2 && order.status === 'Delivered')) ? '#3b82f6' : '#e2e8f0', border: '4px solid white', margin: '0 auto 8px' }} />
                            <div style={{ fontSize: '10px', fontWeight: 800, color: '#64748b' }}>{step.toUpperCase()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selected.role === 'Client' && profileTab === 'installments' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {installmentPlans.filter(p => p.clientId === selected.id).map(plan => (
                    <div key={plan.id} style={{ padding: '24px', background: '#0f172a', borderRadius: '24px', color: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                        <div>
                          <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.6, letterSpacing: '1px' }}>{plan.status.toUpperCase()} PLAN</div>
                          <div style={{ fontSize: '18px', fontWeight: 900 }}>{plan.product}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.6, letterSpacing: '1px' }}>REMAINING</div>
                          <div style={{ fontSize: '18px', fontWeight: 900, color: '#f59e0b' }}>SAR {plan.remaining.toLocaleString()}</div>
                        </div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.1)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
                        <div style={{ width: `${(plan.paid/plan.totalAmount)*100}%`, height: '100%', background: plan.status === 'Completed' ? '#10b981' : plan.status === 'Overdue' ? '#ef4444' : '#f59e0b' }} />
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 800, opacity: 0.8 }}>
                        <span>PROGRESS: {Math.round((plan.paid/plan.totalAmount)*100)}%</span>
                        <span>{plan.paymentsCompleted} / {plan.paymentsTotal} PAYMENTS</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selected.role === 'Technician' && profileTab === 'tasks' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {maintenanceRequests.filter(m => m.technician === selected.name).map(req => (
                    <div key={req.id} style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontWeight: 900, fontSize: '16px' }}>{req.type}</div>
                        <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 700 }}>{req.id} · {req.client}</div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#f59e0b', fontWeight: 900, fontSize: '12px' }}>{req.status.toUpperCase()}</div>
                        <button className="btn btn-ghost btn-sm" onClick={() => setSelectedTask(req)}>Audit Ticket</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selected.role === 'Technician' && profileTab === 'vehicle' && (() => {
                const vAsgn = vehicleAssignments.find(a => a.techName === selected.name && a.status === 'Active')
                const vehicle = vAsgn ? vehicles.find(v => v.id === vAsgn.vehicleId) : null
                return vehicle ? (
                  <div style={{ background: '#0f172a', padding: '32px', borderRadius: '32px', color: 'white' }}>
                    <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '32px' }}>
                      <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Truck size={32} />
                      </div>
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: 900 }}>{vehicle.model}</div>
                        <div style={{ fontSize: '12px', fontWeight: 900, color: '#3b82f6', letterSpacing: '1px' }}>PLATE: {vehicle.plate}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>ODOMETER</div>
                        <div style={{ fontSize: '18px', fontWeight: 900 }}>{vehicle.odometerCurrent.toLocaleString()} KM</div>
                      </div>
                      <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>FUEL LEVEL</div>
                        <div style={{ fontSize: '18px', fontWeight: 900 }}>85%</div>
                      </div>
                    </div>
                  </div>
                ) : <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0', color: '#94a3b8' }}>No active vehicle assignment.</div>
              })()}

              {selected.role === 'Technician' && profileTab === 'team' && (() => {
                const team = teams.find(t => t.members.includes(selected.id))
                return team ? (
                  <div style={{ background: '#f0fdf4', padding: '24px', borderRadius: '24px', border: '1px solid #dcfce7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <div style={{ fontWeight: 950, color: '#10b981', fontSize: '20px' }}>{team.name}</div>
                      <span style={{ background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '99px', fontSize: '10px', fontWeight: 900 }}>{team.area.toUpperCase()}</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: '12px' }}>
                      {team.members.map(mId => {
                        const m = users.find(u => u.id === mId)
                        return (
                          <div key={mId} style={{ background: 'white', padding: '12px', borderRadius: '16px', border: '1px solid #dcfce7', textAlign: 'center' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f0fdf4', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px', fontWeight: 900, fontSize: '11px' }}>{m?.name.charAt(0)}</div>
                            <div style={{ fontSize: '12px', fontWeight: 800, color: '#064e3b' }}>{m?.name.split(' ')[0]}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ) : <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0', color: '#94a3b8' }}>No team assigned.</div>
              })()}

              {selected.role === 'Technician' && profileTab === 'spare-parts' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {partsRequests.filter(p => p.techId === selected.id).map(req => (
                    <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: req.status === 'Approved' ? '#ecfdf5' : '#fffbeb', color: req.status === 'Approved' ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Package size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{req.items[0]?.part} {req.items.length > 1 ? `(+${req.items.length - 1})` : ''}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{req.id} · {req.date}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', fontWeight: 900, color: req.status === 'Approved' ? '#10b981' : '#f59e0b' }}>{req.status.toUpperCase()}</div>
                        <button className="btn btn-ghost btn-sm" style={{ fontSize: '11px', fontWeight: 800 }} onClick={() => setSelectedRequest(req)}>View Manifest</button>
                      </div>
                    </div>
                  ))}
                  {partsRequests.filter(p => p.techId === selected.id).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0', color: '#94a3b8' }}>No spare parts requests found.</div>
                  )}
                </div>
              )}

              {selected.role === 'Technician' && profileTab === 'salary' && (
                <div style={{ background: '#0f172a', padding: '40px', borderRadius: '32px', color: 'white', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#3b82f6', letterSpacing: '2px', marginBottom: '8px' }}>MONTHLY DISBURSEMENT</div>
                  <div style={{ fontSize: '48px', fontWeight: 950, marginBottom: '16px', letterSpacing: '-1px' }}>SAR 12,450</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 20px', borderRadius: '12px', background: '#10b981', color: 'white', fontSize: '13px', fontWeight: 900 }}>
                    <CheckCircle size={16} /> FUNDS DISBURSED
                  </div>
                  <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', textAlign: 'left' }}>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>BASE SALARY</div>
                      <div style={{ fontSize: '16px', fontWeight: 800 }}>SAR 8,500</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '16px', textAlign: 'left' }}>
                      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', fontWeight: 800 }}>PERFORMANCE BONUS</div>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#3b82f6' }}>SAR 3,950</div>
                    </div>
                  </div>
                </div>
              )}

              {selected.role === 'Technician' && profileTab === 'reports' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {technicalReports.filter(r => r.techId === selected.id).map(rep => (
                    <div key={rep.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <Clipboard size={20} />
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '14px', color: '#0f172a' }}>{rep.title}</div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{rep.id} · {rep.date}</div>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', fontWeight: 900, color: rep.status === 'Approved' ? '#10b981' : '#f59e0b' }}>{rep.status.toUpperCase()}</div>
                        <button className="btn btn-ghost btn-sm" style={{ fontSize: '11px', fontWeight: 800 }} onClick={() => setSelectedReport(rep)}>View Full Audit</button>
                      </div>
                    </div>
                  ))}
                  {technicalReports.filter(r => r.techId === selected.id).length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#f8fafc', borderRadius: '24px', border: '1px dashed #e2e8f0', color: '#94a3b8' }}>No technical reports submitted.</div>
                  )}
                </div>
              )}

              {profileTab === 'activity' && (() => {
                const userActivity = [
                  ...recentActivity.filter(a => a.text.includes(selected.name)).map(a => ({ ...a, date: a.time })),
                  ...maintenanceRequests.filter(m => m.client === selected.name || m.technician === selected.name).map(m => ({
                    id: `act-mr-${m.id}`,
                    icon: <Wrench size={18}/>,
                    type: 'maintenance',
                    text: m.client === selected.name ? `Requested maintenance for ${m.type}` : `Assigned to maintenance task ${m.id}`,
                    time: m.date,
                    color: '#3b82f6'
                  })),
                  ...invoices.filter(i => i.client === selected.name || i.tech === selected.name).map(i => ({
                    id: `act-inv-${i.id}`,
                    icon: <FileText size={18}/>,
                    type: 'invoice',
                    text: i.client === selected.name ? `Invoice ${i.id} issued for ${i.total} SAR` : `Generated invoice ${i.id} for ${i.client}`,
                    time: i.date,
                    color: '#10b981'
                  }))
                ].sort((a,b) => (b.id > a.id ? 1 : -1)).slice(0, 5)

                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {userActivity.map(l => (
                      <div key={l.id} style={{ display: 'flex', gap: '16px', padding: '20px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                        <div style={{ width: '44px', height: '44px', borderRadius: '14px', background: 'white', color: l.color, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e2e8f0' }}>
                          {l.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '14px', color: '#1e293b' }}>{l.text}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginTop: '4px' }}>{l.time} · System Protocol: {l.type.toUpperCase()}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )
              })()}

              {profileTab === 'reviews' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {reviews.filter(r => (selected.role === 'Client' ? r.clientId === selected.id : (r.type === 'Technician' && r.target === selected.name))).map(review => (
                    <div key={review.id} style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '12px' }}>
                        {[1,2,3,4,5].map(s => <Star key={s} size={14} fill={s <= review.rating ? "#f59e0b" : "none"} color="#f59e0b" />)}
                      </div>
                      <div style={{ fontWeight: 800, fontSize: '14px', color: '#1e293b', lineHeight: 1.5 }}>"{review.comment}"</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '12px', fontWeight: 700 }}>{review.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Modal>
        )
      })()}

      {/* ── Create / Update Modal ── */}
      {(modal === 'add' || modal === 'edit') && (
        <Modal 
          title={modal==='add' ? 'Onboard New Identity' : 'Recalibrate Access'} 
          onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', padding: '12px 32px', background: '#0f172a' }} onClick={handleSave}>
                {modal==='add' ? 'Confirm Onboarding' : 'Synchronize Changes'}
              </button>
            </>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '10px', letterSpacing: '1px' }}>FULL LEGAL IDENTITY</label>
              <input className="form-control" style={{ borderRadius: '16px', padding: '14px 18px', fontWeight: 600 }} value={form.name} onChange={e => setForm(f => ({ ...f, name:e.target.value }))} placeholder="Ahmed Al-Rashidi" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '10px', letterSpacing: '1px' }}>ORGANIZATIONAL ROLE</label>
              <select className="form-control form-select" style={{ borderRadius: '16px', fontWeight: 600 }} value={form.role} onChange={e => setForm(f => ({ ...f, role:e.target.value }))}>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '10px', letterSpacing: '1px' }}>COMMUNICATION ENDPOINT</label>
              <input className="form-control" style={{ borderRadius: '16px', padding: '14px 18px', fontWeight: 600 }} type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email:e.target.value }))} placeholder="user@domain.com" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '10px', letterSpacing: '1px' }}>MOBILE PROTOCOL</label>
              <input className="form-control" style={{ borderRadius: '16px', padding: '14px 18px', fontWeight: 600 }} value={form.phone} onChange={e => setForm(f => ({ ...f, phone:e.target.value }))} placeholder="+966 5X XXX XXXX" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '10px', letterSpacing: '1px' }}>PRIMARY OPERATION BASE</label>
              <input className="form-control" style={{ borderRadius: '16px', padding: '14px 18px', fontWeight: 600 }} value={form.city} onChange={e => setForm(f => ({ ...f, city:e.target.value }))} placeholder="Riyadh, SA" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '10px', letterSpacing: '1px' }}>ACCOUNT VITALITY</label>
              <select className="form-control form-select" style={{ borderRadius: '16px', fontWeight: 600 }} value={form.status} onChange={e => setForm(f => ({ ...f, status:e.target.value }))}>
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Removal Modal ── */}
      {modal === 'delete' && selected && (
        <Modal title="Security Protocol" onClose={() => setModal(null)} size="sm"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Abort</button>
              <button className="btn btn-danger" style={{ borderRadius: '16px', padding: '12px 32px' }} onClick={handleDelete}>Decommission</button>
            </>
          }
        >
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ background: '#fef2f2', color: '#ef4444', width: '80px', height: '80px', borderRadius: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', transform: 'rotate(5deg)' }}>
              <AlertCircle size={40} />
            </div>
            <h3 style={{ fontSize: '22px', fontWeight: 950, color: '#0f172a', marginBottom: '12px', letterSpacing: '-0.5px' }}>Terminate Access?</h3>
            <p style={{ fontSize: '15px', color: '#64748b', lineHeight: 1.6 }}>
              This will permanently decommission <strong>{selected.name}</strong> from the active directory. All associated data will be archived.
            </p>
          </div>
        </Modal>
      )}

      {/* ── RBAC Center ── */}
      {modal === 'rbac' && (
        <Modal title="Permission Governance" onClose={() => setModal(null)} size="xl"
          footer={<button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Exit Matrix</button>}
        >
          <div style={{ 
            background: '#0f172a', 
            padding: '24px', 
            borderRadius: '24px', 
            marginBottom: '32px', 
            display: 'flex', 
            gap: '16px', 
            alignItems: 'center',
            color: 'white',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)'
          }}>
            <ShieldCheck size={28} color="#3b82f6" />
            <div>
              <div style={{ fontSize: '16px', fontWeight: 900 }}>Permission Governance Engine</div>
              <p style={{ fontSize: '12px', opacity: 0.6, margin: 0 }}> Granular authorization orchestration across all system protocols.</p>
            </div>
          </div>
          
          <div style={{ overflowX:'auto', borderRadius: '28px', border: '1px solid #e2e8f0', background: 'white' }}>
            <table className="perm-table">
              <thead>
                <tr>
                  <th style={{ background: '#f8fafc', padding: '24px' }}>ACCESS PROTOCOL</th>
                  {Object.keys(permissions).map(r => (
                    <th key={r} style={{ background: '#f8fafc', textAlign: 'center' }}>{r.toUpperCase()}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['viewAll',          'Global Inspection'],
                  ['editAll',          'Data Mutation'],
                  ['deleteAll',        'Entity Deletion'],
                  ['manageUsers',      'Directory Control'],
                  ['viewReports',      'Insight Intelligence'],
                  ['manageAccounting', 'Asset Management'],
                  ['assignJobs',       'Workforce Deployment'],
                  ['manageInventory',  'Resource Logistics'],
                ].map(([key, label]) => (
                  <tr key={key}>
                    <td style={{ fontWeight: 800, fontSize: '13px', color: '#1e293b', padding: '18px 24px' }}>{label}</td>
                    {Object.keys(permissions).map(role => (
                      <td key={role} style={{ textAlign: 'center' }}>
                        <div 
                          onClick={() => toast(`Updated ${key} for ${role}`, 'success')}
                          style={{ 
                            color: permissions[role][key] ? '#10b981' : '#94a3b8', 
                            background: permissions[role][key] ? '#ecfdf5' : '#f8fafc', 
                            width: '32px', 
                            height: '32px', 
                            borderRadius: '12px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            margin: '0 auto',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            border: permissions[role][key] ? '1.5px solid #10b981' : '1.5px solid #e2e8f0'
                          }}
                        >
                          {permissions[role][key] ? <CheckCircle size={18} /> : <XCircle size={18} />}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Modal>
      )}

      {/* ── Technical Report Details Modal ── */}
      {selectedReport && (
        <Modal 
          title="Technical Audit & Diagnostics" 
          onClose={() => setSelectedReport(null)}
          size="lg"
          footer={
            <>
              <button className="btn btn-ghost" onClick={() => setSelectedReport(null)}>Close</button>
              <button className="btn btn-primary" onClick={() => { toast('Report marked as reviewed', 'success'); setSelectedReport(null); }}>
                Mark as Reviewed
              </button>
            </>
          }
        >
          <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#3b82f6', letterSpacing: '1px', marginBottom: '4px' }}>{selectedReport.id}</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>{selectedReport.title}</div>
              </div>
              <div style={{ padding: '8px 16px', borderRadius: '12px', background: selectedReport.status === 'Approved' ? '#ecfdf5' : '#fef2f2', color: selectedReport.status === 'Approved' ? '#10b981' : '#ef4444', fontSize: '12px', fontWeight: 900 }}>
                {selectedReport.status.toUpperCase()}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '32px' }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>TECHNICIAN</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>{selectedReport.tech}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>SUBMISSION TIME</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>{selectedReport.date} at {selectedReport.time}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>LOGGED ARRIVAL TIME</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>{selectedReport.arrivalTime || '14:22'}</div>
              </div>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>LOGGED COMPLETION TIME</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>{selectedReport.completionTime || '16:45'}</div>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>SITE ASSIGNMENT</div>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>Site ID: {selectedReport.siteId}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
              <div style={{ padding: '24px', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', minHeight: '120px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '12px' }}>FAULT CAUSE & DIAGNOSTICS</div>
                <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  {selectedReport.faultCause || selectedReport.content}
                </p>
              </div>
              <div style={{ padding: '24px', background: 'white', borderRadius: '20px', border: '1px solid #e2e8f0', minHeight: '120px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '12px' }}>FUTURE RECOMMENDATIONS</div>
                <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                  {selectedReport.recommendations || 'Recommend quarterly preventive maintenance to ensure unit integrity.'}
                </p>
              </div>
            </div>

            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '12px' }}>MEDIA ATTACHMENTS (BEFORE/AFTER)</div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1, padding: '24px', borderRadius: '20px', border: '1.5px dashed #cbd5e1', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#3b82f6', fontWeight: 800 }}>
                  <span style={{ fontSize: '24px', marginBottom: '8px' }}>📷</span> Before Photo (Attached)
                </div>
                <div style={{ flex: 1, padding: '24px', borderRadius: '20px', border: '1.5px dashed #cbd5e1', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#10b981', fontWeight: 800 }}>
                  <span style={{ fontSize: '24px', marginBottom: '8px' }}>📷</span> After Photo (Attached)
                </div>
              </div>
            </div>

          </div>
        </Modal>
      )}

      {/* ── Vehicle Assignment Modal ── */}
      {selectedVehicle && (
        <Modal 
          title="Fleet Operations Details" 
          onClose={() => setSelectedVehicle(null)}
          footer={<button className="btn btn-ghost" onClick={() => setSelectedVehicle(null)}>Close Tracker</button>}
        >
          <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Truck size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>{selectedVehicle.model}</div>
                  <div style={{ fontSize: '12px', fontWeight: 900, color: '#3b82f6', letterSpacing: '1px' }}>PLATE: {selectedVehicle.plate}</div>
                </div>
              </div>
              <div style={{ padding: '8px 16px', borderRadius: '12px', background: selectedVehicle.status === 'In Use' ? '#eff6ff' : '#ecfdf5', color: selectedVehicle.status === 'In Use' ? '#3b82f6' : '#10b981', fontSize: '12px', fontWeight: 900 }}>
                {selectedVehicle.status.toUpperCase()}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '32px' }}>
              <div style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>CURRENT ODOMETER</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>{selectedVehicle.odometerCurrent.toLocaleString()} KM</div>
              </div>
              <div style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>FLEET INDEX</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a' }}>#{selectedVehicle.indexNumber}</div>
              </div>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 900, color: '#1e293b', marginBottom: '16px' }}>RECENT FLEET ACTIVITY</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {vehicleActivityLogs.filter(l => l.vehicleId === selectedVehicle.id).map(log => (
                <div key={log.id} style={{ padding: '16px 20px', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: log.type === 'Fuel' ? '#eff6ff' : '#f8fafc', color: log.type === 'Fuel' ? '#3b82f6' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {log.type === 'Fuel' ? <Zap size={20} /> : <FileText size={20} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>{log.description}</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', marginTop: '2px' }}>{log.date} · ODO: {log.odometerReading} KM</div>
                  </div>
                  {log.cost && (
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '13px', fontWeight: 900, color: '#ef4444' }}>- SAR {log.cost}</div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>{log.fuelLiters}L</div>
                    </div>
                  )}
                </div>
              ))}
              {vehicleActivityLogs.filter(l => l.vehicleId === selectedVehicle.id).length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '12px', fontWeight: 700, background: 'white', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                  No recent activity logged for this vehicle.
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* ── Device Details Modal ── */}
      {selectedDevice && (
        <Modal 
          title="Device Diagnostics & Audit" 
          onClose={() => setSelectedDevice(null)}
          footer={<button className="btn btn-ghost" onClick={() => setSelectedDevice(null)}>Close Viewer</button>}
        >
          <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <HardDrive size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>{selectedDevice.name}</div>
                  <div style={{ fontSize: '12px', fontWeight: 900, color: '#3b82f6', letterSpacing: '1px' }}>SN: {selectedDevice.serial}</div>
                </div>
              </div>
              <div style={{ padding: '8px 16px', borderRadius: '12px', background: selectedDevice.status === 'Optimal' ? '#ecfdf5' : '#f59e0b15', color: selectedDevice.status === 'Optimal' ? '#10b981' : '#f59e0b', fontSize: '12px', fontWeight: 900 }}>
                {selectedDevice.status.toUpperCase()}
              </div>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 900, color: '#1e293b', marginBottom: '16px' }}>FULL SERVICE HISTORY</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedDevice.history && selectedDevice.history.map((h, i) => (
                <div key={i} style={{ padding: '16px 20px', background: 'white', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f8fafc', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <History size={20} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>{h.split(' - ')[1] || h}</div>
                    <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', marginTop: '2px' }}>{h.split(' - ')[0] || 'Unknown Date'}</div>
                  </div>
                </div>
              ))}
              {(!selectedDevice.history || selectedDevice.history.length === 0) && (
                <div style={{ textAlign: 'center', padding: '20px', color: '#94a3b8', fontSize: '12px', fontWeight: 700, background: 'white', borderRadius: '16px', border: '1px dashed #e2e8f0' }}>
                  No historical records logged for this device.
                </div>
              )}
            </div>
            
            <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
              <button className="btn btn-primary" style={{ flex: 1, borderRadius: '16px', padding: '14px', fontSize: '13px', fontWeight: 800 }} onClick={() => toast(`Service requested for ${selectedDevice.name}`, 'success')}>
                Initiate New Service
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* ── Task Details Modal ── */}
      {selectedTask && (
        <Modal 
          title="Maintenance Task Overview" 
          onClose={() => setSelectedTask(null)}
          footer={<button className="btn btn-ghost" onClick={() => setSelectedTask(null)}>Close Overview</button>}
        >
          <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Briefcase size={28} />
                </div>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>{selectedTask.type}</div>
                  <div style={{ fontSize: '12px', fontWeight: 900, color: '#10b981', letterSpacing: '1px' }}>TASK ID: {selectedTask.id}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ padding: '6px 12px', borderRadius: '8px', background: selectedTask.status === 'Completed' ? '#ecfdf5' : '#fffbeb', color: selectedTask.status === 'Completed' ? '#10b981' : '#f59e0b', fontSize: '11px', fontWeight: 900, marginBottom: '6px', display: 'inline-block' }}>
                  {selectedTask.status.toUpperCase()}
                </div>
                <div style={{ padding: '6px 12px', borderRadius: '8px', background: selectedTask.priority === 'High' || selectedTask.priority === 'Critical' ? '#fef2f2' : '#f1f5f9', color: selectedTask.priority === 'High' || selectedTask.priority === 'Critical' ? '#ef4444' : '#64748b', fontSize: '11px', fontWeight: 900, display: 'inline-block', marginLeft: '6px' }}>
                  {selectedTask.priority.toUpperCase()} PRIORITY
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>CLIENT DETAILS</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#1e293b' }}>{selectedTask.client}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><MapPin size={12}/> {selectedTask.city}</div>
              </div>
              <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>SCHEDULE LOG</div>
                <div style={{ fontSize: '14px', fontWeight: 900, color: '#1e293b' }}>{selectedTask.scheduled || selectedTask.date}</div>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}><Calendar size={12}/> Scheduled Visit</div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileText size={14} /> DIAGNOSTIC DESCRIPTION
              </div>
              <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.6, margin: 0, fontWeight: 600 }}>
                {selectedTask.description || 'No detailed diagnostic description provided.'}
              </p>
            </div>

            {selectedTask.faultPhotos > 0 && (
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '12px' }}>ATTACHED MEDIA ({selectedTask.faultPhotos} PHOTOS)</div>
                <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(selectedTask.faultPhotos, 3)}, 1fr)`, gap: '12px' }}>
                  {Array.from({ length: selectedTask.faultPhotos }).slice(0, 3).map((_, i) => (
                    <div key={i} style={{ height: '80px', borderRadius: '16px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                      📷
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </Modal>
      )}

      {/* ── Team Management Modals ── */}
      {modal === 'add_team' && (
        <Modal title="Assemble Operational Team" onClose={() => setModal(null)} size="md"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', padding: '10px 32px', background: '#0f172a' }} onClick={() => { toast('New Team Assembled', 'success'); setModal(null) }}>
                Assemble Team
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', letterSpacing: '0.5px' }}>TEAM DESIGNATION</label>
              <input className="form-control" placeholder="e.g. Solar Strike Team" style={{ borderRadius: '14px', height: '48px', fontWeight: 700 }} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', letterSpacing: '0.5px' }}>OPERATIONAL AREA</label>
              <input className="form-control" placeholder="e.g. Riyadh East" style={{ borderRadius: '14px', height: '48px', fontWeight: 700 }} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', letterSpacing: '0.5px' }}>TEAM LEAD</label>
              <select className="form-control form-select" style={{ borderRadius: '14px', height: '48px', fontWeight: 700 }}>
                <option>Select Lead Engineer...</option>
                {users.filter(u => ['Engineer', 'Technician'].includes(u.role)).map(u => (
                  <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', letterSpacing: '0.5px' }}>MEMBER SELECTION</label>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '200px', overflowY: 'auto' }}>
                {users.filter(u => u.role === 'Technician').map(u => (
                  <label key={u.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', padding: '8px', borderRadius: '10px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'white'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <input type="checkbox" style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{u.name}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{u.specialty} · {u.city}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'edit_team' && (
        <Modal title="Reconfigure Team" onClose={() => setModal(null)} size="md"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', padding: '10px 32px', background: '#0f172a' }} onClick={() => { toast('Team configuration updated', 'success'); setModal(null) }}>
                Save Changes
              </button>
            </>
          }
        >
          <div style={{ background: '#f0f9ff', padding: '16px', borderRadius: '16px', marginBottom: '24px', border: '1px solid #bae6fd' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={16} /> TEAM ACTIVE
            </div>
            <p style={{ fontSize: '13px', color: '#0c4a6e', margin: '4px 0 0 0', fontWeight: 600 }}>Currently managing <strong>1 active job</strong> in Riyadh Central.</p>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', letterSpacing: '0.5px' }}>TEAM LEAD</label>
            <select className="form-control form-select" defaultValue="6" style={{ borderRadius: '14px', height: '48px', fontWeight: 700 }}>
              {users.filter(u => ['Engineer', 'Technician'].includes(u.role)).map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
        </Modal>
      )}

      {selectedRequest && (
        <Modal title={`Logistics Manifest: ${selectedRequest.id}`} onClose={() => setSelectedRequest(null)} size="md">
          <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#3b82f6', letterSpacing: '1px', marginBottom: '4px' }}>PARTS REQUEST</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>{selectedRequest.tech}</div>
              </div>
              <div style={{ padding: '8px 16px', borderRadius: '12px', background: selectedRequest.status === 'Approved' ? '#ecfdf5' : '#fffbeb', color: selectedRequest.status === 'Approved' ? '#10b981' : '#f59e0b', fontSize: '12px', fontWeight: 900 }}>
                {selectedRequest.status.toUpperCase()}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9', marginBottom: '24px' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '12px' }}>MANIFEST ITEMS</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedRequest.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', background: '#f8fafc', borderRadius: '14px' }}>
                    <div style={{ fontWeight: 800, fontSize: '14px' }}>{item.part}</div>
                    <div style={{ fontWeight: 950, color: '#3b82f6' }}>x{item.qty}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '8px' }}>DIAGNOSTIC REASON</div>
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#475569', margin: 0, lineHeight: 1.5 }}>
                {selectedRequest.reason || 'Requested for active maintenance ticket.'}
              </p>
            </div>

            <button className="btn btn-ghost" style={{ width: '100%', marginTop: '24px', borderRadius: '16px' }} onClick={() => setSelectedRequest(null)}>Dismiss Manifest</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
