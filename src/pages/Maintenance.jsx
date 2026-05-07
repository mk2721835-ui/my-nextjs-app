import { useState, useEffect, createElement } from 'react'
import Modal from '../components/Modal'
import { maintenanceRequests, users, monthlyRevenue, techPerformance, statusDistribution, partsRequests, invoices, teams } from '../data'
import { useToast } from '../App'
import { 
  Wrench, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  AlertTriangle, 
  CheckCircle, 
  Calendar, 
  User, 
  MapPin, 
  Camera, 
  MoreVertical, 
  ArrowRight, 
  Settings, 
  Shield,
  Eye,
  Zap,
  Activity,
  Clock,
  List
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area 
} from 'recharts'

const STATUS_FLOW  = ['Under Review','Accepted','Scheduled','In Progress','Awaiting Parts','Completed','Closed']
const STATUS_META = {
  'Under Review':  { color: '#8B5CF6', icon: Search, label: 'Reviewing' },
  Accepted:        { color: '#3B82F6', icon: CheckCircle, label: 'Accepted' },
  Scheduled:       { color: '#06B6D4', icon: Calendar, label: 'Scheduled' },
  'In Progress':   { color: '#F59E0B', icon: Activity, label: 'Active' },
  'Awaiting Parts':{ color: '#EF4444', icon: AlertTriangle, label: 'Delayed' },
  Completed:       { color: '#10B981', icon: CheckCircle, label: 'Done' },
  Closed:          { color: '#64748B', icon: Shield, label: 'Closed' },
}

const PRIORITY_META = {
  Critical: { color: '#A4161A', label: 'Urgent' },
  High:     { color: '#F59E0B', label: 'High' },
  Medium:   { color: '#3B82F6', label: 'Standard' },
  Low:      { color: '#94A3B8', label: 'Low' },
}

const technicians = users.filter(u => u.role === 'Technician')


// ── Creative Maintenance Card ─────────────────────────────────────────────
function MaintenanceCard({ request, onView, onAssign, onStatus }) {
  const [hovered, setHovered] = useState(false)
  const statusInfo = STATUS_META[request.status] || STATUS_META.Closed
  const priorityInfo = PRIORITY_META[request.priority] || PRIORITY_META.Low
  const StatusIcon = statusInfo.icon

  return (
    <div 
      className="glass-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '28px',
        borderRadius: '32px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: hovered ? 'translateY(-12px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: hovered 
          ? `0 30px 60px -12px ${statusInfo.color}20` 
          : '0 4px 20px -5px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        background: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
      }}
      onClick={() => onView(request)}
    >
      {/* Background ID Watermark */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '48px',
        fontWeight: 950,
        color: statusInfo.color,
        opacity: 0.03,
        userSelect: 'none'
      }}>
        {request.id.slice(-3)}
      </div>

      {/* Top Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '18px',
          background: `${statusInfo.color}15`,
          color: statusInfo.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 10px 20px ${statusInfo.color}10`,
          transform: hovered ? 'scale(1.1) rotate(-5deg)' : 'none',
          transition: 'all 0.3s'
        }}>
          <StatusIcon size={28} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 900,
            color: 'white',
            background: priorityInfo.color,
            padding: '4px 12px',
            borderRadius: '99px',
            letterSpacing: '1px'
          }}>
            {priorityInfo.label.toUpperCase()}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8' }}>{request.date}</div>
        </div>
      </div>

      {/* Main Info */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '11px', fontWeight: 900, color: statusInfo.color, letterSpacing: '1px', marginBottom: '6px' }}>{request.id}</div>
        <h3 style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.2 }}>{request.type}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
          <User size={14} /> {request.client}
        </div>
      </div>

      {/* Detail Chip */}
      <div style={{ 
        background: '#f8fafc', 
        padding: '16px', 
        borderRadius: '20px', 
        border: '1px solid #f1f5f9',
        fontSize: '13px',
        color: '#475569',
        fontWeight: 500,
        lineHeight: 1.5,
        position: 'relative',
        zIndex: 1
      }}>
        {request.description.slice(0, 85)}...
      </div>

      {/* Tech Footer */}
      <div style={{ 
        marginTop: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1
      }}>
        {request.technician === 'Unassigned' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f59e0b', background: '#f59e0b10', padding: '8px 16px', borderRadius: '14px', fontSize: '12px', fontWeight: 800 }}>
            <AlertTriangle size={14} /> ASSIGN TECH
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <div style={{ display: 'flex', marginRight: '8px' }}>
              {(request.assignedTechs || [request.technicianId]).slice(0, 3).map((tid, i) => {
                const u = users.find(usr => usr.id === tid)
                return (
                  <div key={tid} style={{ 
                    width: '32px', 
                    height: '32px', 
                    borderRadius: '10px', 
                    background: u?.color || '#3b82f6', 
                    color: 'white', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '10px', 
                    fontWeight: 900,
                    border: '2px solid white',
                    marginLeft: i > 0 ? '-12px' : 0,
                    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                  }}>
                    {u?.initials || '??'}
                  </div>
                )
              })}
              {(request.assignedTechs?.length > 3) && (
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#cbd5e1', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900, border: '2px solid white', marginLeft: '-12px' }}>
                  +{request.assignedTechs.length - 3}
                </div>
              )}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{request.teamId ? (teams.find(t => t.id === request.teamId)?.name || 'Team Assigned') : request.technician}</div>
              <div style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8' }}>{request.teamId ? 'Field Team' : 'Technician'}</div>
            </div>
          </div>
        )}
        <div style={{ color: '#94a3b8' }}>
          <ArrowRight size={20} />
        </div>
      </div>

      {/* Action Overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(15, 23, 42, 0.9)',
        backdropFilter: 'blur(10px)',
        height: hovered ? '64px' : '0px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px',
        opacity: hovered ? 1 : 0,
        zIndex: 2,
      }} onClick={e => e.stopPropagation()}>
        <button onClick={() => onView(request)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800 }}>
          <Eye size={16} /> VIEW DETAILS
        </button>
        <button onClick={(e) => onAssign(request, e)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800 }}>
          <User size={16} /> ASSIGN
        </button>
        <button onClick={(e) => onStatus(request, e)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800 }}>
          <Settings size={16} /> STATUS
        </button>
      </div>
    </div>
  )
}

function VTog({ mode, setMode }) {
  return (
    <div style={{ display: 'flex', gap: '6px', background: '#f1f5f9', borderRadius: '14px', padding: '5px', border: '1px solid #e2e8f0' }}>
      {[
        { id: 'grid', icon: LayoutGrid, label: 'Cards' },
        { id: 'table', icon: List, label: 'List' }
      ].map(({ id, icon: Icon, label }) => (
        <button key={id} onClick={() => setMode(id)}
          style={{ 
            padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 900,
            display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.5px',
            background: mode === id ? '#b91c1c' : 'transparent',
            boxShadow: mode === id ? '0 8px 16px -4px rgba(185, 28, 28, 0.25)' : 'none',
            color: mode === id ? 'white' : '#64748b',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
          <Icon size={14} strokeWidth={2.5} /> {label.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function AnalyticsView() {
  const kpis = [
    { label: 'Total Deployments', value: '1,284', change: '+12%', icon: Activity, color: '#3b82f6' },
    { label: 'Completion Rate', value: '94.2%', change: '+5%', icon: CheckCircle, color: '#10b981' },
    { label: 'Avg. Resolution', value: '4.2 hrs', change: '-18%', icon: Clock, color: '#8b5cf6' },
    { label: 'Urgent Alerts', value: '12', change: '+2', icon: AlertTriangle, color: '#ef4444' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', animation: 'fadeIn 0.5s ease-out' }}>
      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
        {kpis.map((kpi, i) => (
          <div key={i} className="glass-card" style={{ padding: '24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: `${kpi.color}15`, color: kpi.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {createElement(kpi.icon, { size: 28 })}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b', marginBottom: '4px' }}>{kpi.label}</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <div style={{ fontSize: '24px', fontWeight: 900, color: '#0f172a' }}>{kpi.value}</div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: kpi.change.startsWith('+') ? '#10b981' : '#ef4444' }}>{kpi.change}</div>
              </div>
              <div style={{ fontSize: '10px', fontWeight: 900, color: kpi.color, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                VIEW DETAILS <ArrowRight size={10} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '32px' }}>
        {/* Monthly Volume */}
        <div className="glass-card" style={{ padding: '32px', borderRadius: '32px', minHeight: '400px' }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 950, color: '#0f172a' }}>Performance Trends</div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8' }}>MONTHLY JOBS VOLUME</div>
          </div>
          <div style={{ width: '100%', height: '300px' }}>
            <ResponsiveContainer>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} dx={-10} />
                <Tooltip 
                  contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: 'none', borderRadius: '12px', color: 'white', padding: '12px' }}
                  itemStyle={{ color: 'white', fontSize: '12px', fontWeight: 700 }}
                  labelStyle={{ marginBottom: '4px', fontWeight: 900, color: '#3b82f6' }}
                />
                <Area type="monotone" dataKey="jobs" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorJobs)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="glass-card" style={{ padding: '32px', borderRadius: '32px', minHeight: '400px' }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: '16px', fontWeight: 950, color: '#0f172a' }}>Status Breakdown</div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8' }}>SERVICE ALLOCATION</div>
          </div>
          <div style={{ width: '100%', height: '300px', display: 'flex', alignItems: 'center' }}>
            <div style={{ flex: 1, height: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusDistribution} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                    {statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div style={{ width: '50%', display: 'flex', flexDirection: 'column', gap: '12px', paddingLeft: '20px' }}>
              {statusDistribution.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: item.color }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Technician Efficiency */}
      <div className="glass-card" style={{ padding: '32px', borderRadius: '32px' }}>
        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '16px', fontWeight: 950, color: '#0f172a' }}>Resource Efficiency</div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8' }}>AVERAGE RESPONSE TIME BY TECH (HRS)</div>
        </div>
        <div style={{ width: '100%', height: '300px' }}>
          <ResponsiveContainer>
            <BarChart data={techPerformance}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 600, fill: '#94a3b8' }} dx={-10} />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="time" fill="#8b5cf6" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default function Maintenance() {
  const toast = useToast()
  const [statusFilter, setStatusFilter]   = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [search, setSearch]               = useState('')
  const [viewMode, setViewMode]           = useState('grid')
  const [modal, setModal]                 = useState(null)
  const [viewTab, setViewTab]             = useState('client')
  const [selected, setSelected]           = useState(null)
  const [assignTech, setAssignTech]       = useState('')
  const [assignMode, setAssignMode] = useState('single')
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [mounted, setMounted]   = useState(false)
  const [multiTechs, setMultiTechs]       = useState([])
  const [newStatus, setNewStatus]         = useState('')
  const [showAnalytics, setShowAnalytics] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const filtered = maintenanceRequests.filter(r => {
    const matchStatus   = statusFilter === 'All' || r.status === statusFilter
    const matchPriority = priorityFilter === 'All' || r.priority === priorityFilter
    const matchSearch   = r.client.toLowerCase().includes(search.toLowerCase()) ||
                          r.id.toLowerCase().includes(search.toLowerCase()) ||
                          r.type.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchPriority && matchSearch
  })

  const openView   = r => { setSelected(r); setNewStatus(r.status); setViewTab('client'); setModal('view') }
  const openAssign = (r, e) => { e?.stopPropagation(); setSelected(r); setAssignTech(r.technician !== 'Unassigned' ? r.technician : ''); setModal('assign') }
  const openStatus = (r, e) => { e?.stopPropagation(); setSelected(r); setNewStatus(r.status); setModal('status') }

  const counts = { All: maintenanceRequests.length, ...Object.fromEntries(STATUS_FLOW.map(s => [s, maintenanceRequests.filter(r => r.status === s).length])) }

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease' }}>
      {/* Premium Header */}
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            background: 'rgba(139, 92, 246, 0.1)',
            padding: '6px 16px',
            borderRadius: '99px',
            width: 'fit-content',
            marginBottom: '12px',
            fontSize: '12px',
            fontWeight: 800,
            color: '#8b5cf6',
            letterSpacing: '1px'
          }}>
            <Wrench size={14} /> MAINTENANCE PROTOCOL
          </div>
          <h1 className="page-title" style={{ fontSize: '36px', fontWeight: 950, letterSpacing: '-1.5px' }}>
            Infrastructure Support
          </h1>
          <p className="page-subtitle" style={{ fontSize: '15px', marginTop: '4px', opacity: 0.7 }}>
            Managing {maintenanceRequests.length} active service deployments across regions.
          </p>
        </div>
        <div className="page-header-actions" style={{ gap: '16px' }}>
          <button 
            className={`btn ${showAnalytics ? 'btn-primary' : 'btn-ghost'}`} 
            onClick={() => setShowAnalytics(!showAnalytics)} 
            style={{ 
              borderRadius: '18px', 
              padding: '12px 24px', 
              gap: '8px',
              background: showAnalytics ? '#0f172a' : 'transparent',
              color: showAnalytics ? 'white' : '#0f172a'
            }}
          >
            <Activity size={18} /> Analytics
          </button>
          <button className="btn btn-primary" onClick={() => setModal('create')} style={{ 
            borderRadius: '18px', 
            padding: '14px 32px', 
            background: '#0f172a',
            border: 'none',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)',
            gap: '10px'
          }}>
            <Plus size={20} /> New Ticket
          </button>
        </div>
      </div>

      {!showAnalytics && (
        <>
          {/* Status Pipeline Track */}
          <div className="glass-card" style={{ marginBottom: '40px', borderRadius: '32px', padding: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '14px', fontWeight: 950, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Clock size={18} color="#3b82f6" /> Service Lifecycle
              </div>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8' }}>ACTIVE PIPELINE FLOW</div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '12px' }}>
              {STATUS_FLOW.map((s, idx) => {
                const info = STATUS_META[s]
                const active = statusFilter === s
                return (
                  <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
                    <button 
                      onClick={() => setStatusFilter(active ? 'All' : s)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '12px 20px',
                        borderRadius: '20px',
                        border: '1px solid #e2e8f0',
                        background: active ? '#0f172a' : 'white',
                        color: active ? 'white' : '#64748b',
                        cursor: 'pointer',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        boxShadow: active ? '0 10px 25px -5px rgba(0,0,0,0.1)' : 'none',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {createElement(info.icon, { size: 16, color: active ? 'white' : info.color })}
                      <span style={{ fontSize: '13px', fontWeight: 800 }}>{s}</span>
                      <span style={{ 
                        background: active ? 'rgba(255,255,255,0.1)' : '#f1f5f9',
                        color: active ? 'white' : '#94a3b8',
                        padding: '2px 8px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        fontWeight: 900
                      }}>{counts[s]}</span>
                    </button>
                    {idx < STATUS_FLOW.length - 1 && <ArrowRight size={16} color="#e2e8f0" style={{ margin: '0 8px' }} />}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Controls Bar */}
          <div style={{ 
            display: 'flex', 
            gap: '24px', 
            alignItems: 'center', 
            marginBottom: '40px',
            flexWrap: 'wrap'
          }}>
            <div className="search-input-wrap" style={{ flex: 1, minWidth: '300px', background: 'white', borderRadius: '18px', padding: '12px 20px', border: '1px solid #e2e8f0' }}>
              <Search size={18} color="#94a3b8" />
              <input 
                placeholder="Filter by ID, Client or Type..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                style={{ fontWeight: 600, fontSize: '14px' }}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', marginRight: '8px' }}>PRIORITY:</div>
              {['All', 'Critical', 'High', 'Medium', 'Low'].map(p => (
                <button 
                  key={p} 
                  onClick={() => setPriorityFilter(p)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '12px',
                    border: 'none',
                    background: priorityFilter === p ? '#0f172a' : '#f1f5f9',
                    color: priorityFilter === p ? 'white' : '#64748b',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {p}
                </button>
              ))}
            </div>
            <VTog mode={viewMode} setMode={setViewMode} />
          </div>

          {viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
              {filtered.map(req => (
                <MaintenanceCard 
                  key={req.id} 
                  request={req} 
                  onView={openView} 
                  onAssign={openAssign} 
                  onStatus={openStatus} 
                />
              ))}
            </div>
          ) : (
            <div className="table-container" style={{ borderRadius: '32px', border: '1px solid #e2e8f0', background: 'white', overflow: 'hidden' }}>
              <table className="table">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '24px' }}>TICKET ID</th>
                    <th>CLIENT & LOCATION</th>
                    <th>SERVICE TYPE</th>
                    <th>PRIORITY</th>
                    <th>STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(req => {
                    const statusInfo = STATUS_META[req.status] || STATUS_META.Closed
                    const prioInfo = PRIORITY_META[req.priority] || PRIORITY_META.Low
                    return (
                      <tr key={req.id} style={{ cursor: 'pointer' }} onClick={() => openView(req)}>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace' }}>{req.id}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{req.date}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{req.client}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{req.city.toUpperCase()} AREA</div>
                        </td>
                        <td style={{ fontWeight: 700, color: '#475569', fontSize: '13px' }}>{req.type}</td>
                        <td>
                          <div style={{ color: prioInfo.color, fontWeight: 900, fontSize: '11px', letterSpacing: '0.5px' }}>{prioInfo.label.toUpperCase()}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: `${statusInfo.color}15`, color: statusInfo.color, padding: '6px 12px', borderRadius: '10px', width: 'fit-content', fontSize: '11px', fontWeight: 900 }}>
                            {createElement(statusInfo.icon, { size: 12 })} {req.status.toUpperCase()}
                          </div>
                        </td>
                        <td style={{ padding: '0 24px' }}>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={(e) => { e.stopPropagation(); openAssign(req) }} className="btn-icon" title="Assign"><User size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); openStatus(req) }} className="btn-icon" title="Status"><Settings size={14} /></button>
                            <button onClick={(e) => { e.stopPropagation(); openView(req) }} className="btn-icon" title="View"><ArrowRight size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {showAnalytics && <AnalyticsView />}

      {/* Detail Modal */}
      {modal === 'view' && selected && (
        <Modal title={`Infrastructure Support Ticket: ${selected.id}`} onClose={() => setModal(null)} size="lg"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Dismiss</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a', gap: '8px' }} onClick={() => setModal('status')}>
                <Settings size={16} /> Update Status
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', overflowX: 'auto' }}>
            {[
              { id: 'client', label: 'Issue Details' },
              { id: 'admin', label: 'Admin Controls' },
              { id: 'ops', label: 'Field Operations' },
              { id: 'technician', label: 'Field Report' }
            ].map(t => (
              <button 
                key={t.id} 
                onClick={() => setViewTab(t.id)}
                style={{
                  background: viewTab === t.id ? '#b91c1c' : 'transparent',
                  color: viewTab === t.id ? 'white' : '#64748b',
                  padding: '10px 18px',
                  borderRadius: '12px',
                  fontWeight: 900,
                  fontSize: '11px',
                  letterSpacing: '0.5px',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  whiteSpace: 'nowrap',
                  boxShadow: viewTab === t.id ? '0 8px 16px -4px rgba(185, 28, 28, 0.2)' : 'none'
                }}
              >
                {t.label.toUpperCase()}
              </button>
            ))}
          </div>

          {viewTab === 'client' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '32px' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
                    <span style={{ background: PRIORITY_META[selected.priority].color + '15', color: PRIORITY_META[selected.priority].color, padding: '6px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 900 }}>{selected.priority.toUpperCase()} PRIORITY</span>
                    <span style={{ background: STATUS_META[selected.status].color + '15', color: STATUS_META[selected.status].color, padding: '6px 16px', borderRadius: '10px', fontSize: '12px', fontWeight: 900 }}>{selected.status.toUpperCase()}</span>
                  </div>
                  <h2 style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a', marginBottom: '8px', letterSpacing: '-1px' }}>{selected.type}</h2>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><User size={16} /> {selected.client}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {selected.city}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px' }}>TICKET OPENED</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>{selected.date}</div>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', marginBottom: '12px', letterSpacing: '1px' }}>CLIENT ISSUE DESCRIPTION & FAULT TYPE</div>
                <p style={{ fontSize: '15px', color: '#475569', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{selected.description}</p>
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <span style={{ padding: '6px 12px', background: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: 800, border: '1px solid #e2e8f0', color: '#64748b' }}>Device: AC-Split Unit</span>
                  <span style={{ padding: '6px 12px', background: 'white', borderRadius: '8px', fontSize: '12px', fontWeight: 800, border: '1px solid #e2e8f0', color: '#64748b' }}>Model: 2024 Pro</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Camera size={16} color="#3b82f6" /> CLIENT ISSUE PHOTOS / VIDEO ({selected.faultPhotos || 2})
                </div>
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {Array.from({ length: selected.faultPhotos || 2 }).map((_, i) => (
                    <div key={i} style={{ minWidth: '120px', height: '90px', borderRadius: '16px', background: '#f1f5f9', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer' }}>
                      <Camera size={24} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {viewTab === 'admin' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', marginBottom: '16px' }}>ADMIN LIFECYCLE CONTROLS</div>
                <div className="form-control">
                  <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>MAINTENANCE STATUS</label>
                  <select 
                    value={newStatus} 
                    onChange={e => setNewStatus(e.target.value)}
                    style={{ width: '100%', height: '48px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '0 16px', fontWeight: 800, background: 'white' }}
                  >
                    {STATUS_FLOW.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                {newStatus === 'Awaiting Parts' && (
                  <div style={{ marginTop: '16px', padding: '16px', background: '#fff1f2', borderRadius: '16px', border: '1px solid #fecdd3', color: '#e11d48' }}>
                    <div style={{ fontWeight: 900, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={16} /> AWAITING PARTS ACTION REQUIRED
                    </div>
                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', fontWeight: 600 }}>Technician requested specific spare parts for this service. Admin must approve the logistics transfer.</p>
                    <button className="btn btn-sm" style={{ marginTop: '12px', background: '#e11d48', color: 'white', borderRadius: '8px', border: 'none', fontWeight: 800 }} onClick={() => toast('Redirecting to Spare Parts Module...', 'info')}>View Parts Request</button>
                  </div>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginTop: '24px' }}>
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', marginBottom: '16px' }}>LOGISTICS SCHEDULE</div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155' }}>
                    {selected.scheduled ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Calendar size={18} color="#3b82f6" /> {selected.scheduled}
                      </div>
                    ) : 'Not yet deployed to schedule'}
                  </div>
                </div>
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', marginBottom: '16px' }}>PERSONNEL DEPLOYMENT</div>
                  {selected.technician === 'Unassigned' ? (
                    <button className="btn btn-warning btn-sm" style={{ width: '100%', borderRadius: '12px' }} onClick={e => openAssign(selected, e)}>Deploy Technician</button>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#3b82f6', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 900 }}>{selected.technician.charAt(0)}</div>
                      <div style={{ fontWeight: 800 }}>{selected.technician}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {viewTab === 'ops' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: '#0f172a', padding: '24px', borderRadius: '24px', color: 'white' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', marginBottom: '16px', letterSpacing: '1px' }}>DISPATCHED PERSONNEL</div>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  {(selected.assignedTechs || [selected.technicianId]).map(tid => {
                    const u = users.find(usr => usr.id === tid)
                    return (
                      <div key={tid} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.1)', padding: '8px 16px', borderRadius: '14px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: u?.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 950 }}>{u?.initials}</div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 800 }}>{u?.name}</div>
                          <div style={{ fontSize: '10px', opacity: 0.6 }}>{u?.specialty}</div>
                        </div>
                      </div>
                    )
                  })}
                  <button className="btn btn-ghost btn-sm" style={{ border: '1px dashed rgba(255,255,255,0.3)', color: 'white', borderRadius: '12px', padding: '8px 16px' }} onClick={() => setModal('assign')}>
                    <Plus size={14} /> Dispatch More
                  </button>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', letterSpacing: '1px' }}>OPERATIONAL TIMELINE & LOGS</div>
                  <button className="btn btn-primary btn-sm" style={{ borderRadius: '10px', fontSize: '11px', background: '#0f172a' }} onClick={() => toast('Manual log entry initiated', 'info')}>+ Add Log</button>
                </div>
                
                <div style={{ position: 'relative', paddingLeft: '32px' }}>
                  <div style={{ position: 'absolute', left: '15px', top: '10px', bottom: '10px', width: '2px', background: '#e2e8f0' }} />
                  
                  {/* Arrival Log */}
                  <div style={{ position: 'relative', marginBottom: '24px' }}>
                    <div style={{ position: 'absolute', left: '-25px', top: '0', width: '18px', height: '18px', borderRadius: '50%', background: selected.logs?.some(l => l.event === 'Technician Arrived') ? '#10b981' : '#cbd5e1', border: '4px solid white', zIndex: 1 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Technician Arrival</div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{selected.logs?.find(l => l.event === 'Technician Arrived')?.time || 'Awaiting Arrival...'}</div>
                      </div>
                      {!selected.logs?.some(l => l.event === 'Technician Arrived') && (
                        <button className="btn btn-ghost btn-sm" style={{ fontSize: '10px', fontWeight: 900, color: '#3b82f6' }} onClick={() => toast('Arrival logged manually', 'success')}>LOG NOW</button>
                      )}
                    </div>
                  </div>

                  {/* Completion Log */}
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: '-25px', top: '0', width: '18px', height: '18px', borderRadius: '50%', background: selected.logs?.some(l => l.event === 'Work Completed') ? '#10b981' : '#cbd5e1', border: '4px solid white', zIndex: 1 }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>Work Completion</div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{selected.logs?.find(l => l.event === 'Work Completed')?.time || 'In Progress...'}</div>
                      </div>
                      {selected.logs?.some(l => l.event === 'Technician Arrived') && !selected.logs?.some(l => l.event === 'Work Completed') && (
                        <button className="btn btn-ghost btn-sm" style={{ fontSize: '10px', fontWeight: 900, color: '#3b82f6' }} onClick={() => toast('Completion logged manually', 'success')}>LOG NOW</button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {viewTab === 'technician' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', marginBottom: '16px' }}>FIELD DIAGNOSTICS & REPORT</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>FAULT SUMMARY</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Compressor short-circuit verified. Freon gas leakage detected at main valve.</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>WORK PERFORMED</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Isolated power supply. Evacuated remaining gas. Removed damaged compressor and prepped mounts for replacement.</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>RECOMMENDATION</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>Requires immediate 1x Compressor Unit and 2x Freon Canisters to complete repair.</div>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Camera size={16} color="#3b82f6" /> BEFORE & AFTER EVIDENCE
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ height: '120px', borderRadius: '16px', background: '#f1f5f9', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s' }} className="hover-scale">
                    <Camera size={24} style={{ marginBottom: '8px' }} />
                    <span style={{ fontSize: '10px', fontWeight: 800 }}>UPLOAD BEFORE MEDIA</span>
                  </div>
                  <div style={{ height: '120px', borderRadius: '16px', background: '#f1f5f9', border: '1px dashed #cbd5e1', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', cursor: 'pointer', transition: 'all 0.2s' }} className="hover-scale">
                    <Camera size={24} style={{ marginBottom: '8px' }} />
                    <span style={{ fontSize: '10px', fontWeight: 800 }}>UPLOAD AFTER MEDIA</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
                {/* 1. Spare Parts Module */}
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <AlertTriangle size={16} color="#f59e0b" /> SPARE PARTS REQUESTS
                    </div>
                    <button className="btn btn-outline btn-sm" style={{ borderRadius: '10px', fontSize: '11px', borderColor: '#e2e8f0' }} onClick={() => toast('Drafting new part request...', 'info')}>+ New Request</button>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {partsRequests.filter(p => p.requestId === selected.id).length > 0 ? (
                      partsRequests.filter(p => p.requestId === selected.id).map(req => (
                        <div key={req.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '13px', color: '#1e293b' }}>
                              {req.items[0]?.part} {req.items.length > 1 ? `(+${req.items.length - 1})` : ''} 
                              <span style={{ color: '#94a3b8', fontSize: '11px', fontWeight: 700, marginLeft: '8px' }}>(x{req.items.reduce((sum, i) => sum + i.qty, 0)})</span>
                            </div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', fontWeight: 600 }}>ID: {req.id} · {req.date}</div>
                            <button className="btn btn-ghost btn-sm" style={{ padding: 0, fontSize: '10px', height: 'auto', minHeight: 0, marginTop: '4px' }} onClick={() => setSelectedRequest(req)}>View Manifest</button>
                          </div>
                          <div style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 900, background: req.status === 'Approved' ? '#ecfdf5' : req.status === 'Rejected' ? '#fef2f2' : '#fffbeb', color: req.status === 'Approved' ? '#10b981' : req.status === 'Rejected' ? '#ef4444' : '#f59e0b' }}>
                            {req.status.toUpperCase()}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div style={{ padding: '16px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#94a3b8', background: 'white', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>No parts requested for this ticket.</div>
                    )}
                  </div>
                </div>

                {/* 2. Payment & Invoice Module */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Zap size={16} color="#10b981" /> FIELD PAYMENT COLLECTION
                    </div>
                    <div className="form-control" style={{ marginBottom: '12px' }}>
                      <input type="number" placeholder="Amount (SAR)" style={{ width: '100%', height: '42px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 12px', fontWeight: 800, fontSize: '13px' }} />
                    </div>
                    <div className="form-control" style={{ marginBottom: '16px' }}>
                      <select style={{ width: '100%', height: '42px', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '0 12px', fontWeight: 800, fontSize: '13px', background: 'white' }}>
                        <option>Cash Payment</option>
                        <option>Credit/Debit Card (POS)</option>
                        <option>Bank Transfer</option>
                      </select>
                    </div>
                    <button className="btn btn-primary" style={{ width: '100%', borderRadius: '12px', background: '#10b981', border: 'none', fontWeight: 900 }} onClick={() => toast('Payment Registered', 'success')}>Record Payment</button>
                  </div>

                  <div style={{ background: '#0f172a', padding: '24px', borderRadius: '24px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}><LayoutGrid size={120} /></div>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', marginBottom: '8px' }}>INVOICE GENERATION</div>
                      <div style={{ fontSize: '18px', fontWeight: 950, marginBottom: '16px', lineHeight: 1.2 }}>Create detailed invoice to send to Admin & Client</div>
                      <button className="btn" style={{ background: 'white', color: '#0f172a', borderRadius: '12px', fontWeight: 900, width: '100%', border: 'none' }} onClick={() => toast('Invoice Builder Opened', 'info')}>Generate Invoice</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Assign Modal */}
      {modal === 'assign' && selected && (
        <Modal title="Workforce Deployment Center" onClose={() => setModal(null)} size="md"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a' }} onClick={() => { toast(`Mission personnel deployed`, 'success'); setModal(null) }}>Confirm Dispatch</button>
            </>
          }
        >
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: '#f1f5f9', padding: '4px', borderRadius: '14px' }}>
            {[
              { id: 'single', label: 'Individual Tech' },
              { id: 'team', label: 'Field Team' },
              { id: 'multi', label: 'Custom Group' }
            ].map(m => (
              <button key={m.id} onClick={() => setAssignMode(m.id)} style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 800, background: assignMode === m.id ? 'white' : 'transparent', color: assignMode === m.id ? '#0f172a' : '#64748b', boxShadow: assignMode === m.id ? '0 4px 10px rgba(0,0,0,0.05)' : 'none', transition: 'all 0.2s' }}>
                {m.label}
              </button>
            ))}
          </div>

          {assignMode === 'single' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto' }}>
              {technicians.map(t => (
                <div key={t.id} onClick={() => setAssignTech(t.name)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '18px', border: `2px solid ${assignTech === t.name ? '#3b82f6' : '#f1f5f9'}`, background: assignTech === t.name ? '#3b82f608' : 'white', cursor: 'pointer' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: t.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{t.initials}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{t.specialty}</div>
                  </div>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {assignTech === t.name && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />}
                  </div>
                </div>
              ))}
            </div>
          )}

          {assignMode === 'team' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {teams.map(t => (
                <div key={t.id} onClick={() => setSelectedTeam(t.id)} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px', borderRadius: '18px', border: `2px solid ${selectedTeam === t.id ? '#10b981' : '#f1f5f9'}`, background: selectedTeam === t.id ? '#10b98108' : 'white', cursor: 'pointer' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: t.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={20} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{t.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{t.members.length} Members · {t.area}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {assignMode === 'multi' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', marginBottom: '8px', fontSize: '12px', fontWeight: 700, color: '#475569' }}>
                Selected: {multiTechs.length} Technicians
              </div>
              <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {technicians.map(t => (
                  <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '14px', border: '1px solid #e2e8f0', cursor: 'pointer' }}>
                    <input type="checkbox" checked={multiTechs.includes(t.id)} onChange={e => {
                      if(e.target.checked) setMultiTechs([...multiTechs, t.id])
                      else setMultiTechs(multiTechs.filter(id => id !== t.id))
                    }} style={{ width: '18px', height: '18px' }} />
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: t.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 900 }}>{t.initials}</div>
                    <span style={{ fontSize: '13px', fontWeight: 700 }}>{t.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </Modal>
      )}

      {/* Status Modal */}
      {modal === 'status' && selected && (
        <Modal title="Service Lifecycle Update" onClose={() => setModal(null)} size="sm"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a' }} onClick={() => { toast(`Status recalibrated`, 'success'); setModal(null) }}>Sync Status</button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {STATUS_FLOW.map(s => {
              const info = STATUS_META[s]
              const active = newStatus === s
              return (
                <label 
                  key={s} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    cursor: 'pointer', 
                    padding: '14px 18px', 
                    borderRadius: '16px', 
                    border: `1.5px solid ${active ? info.color : '#f1f5f9'}`, 
                    background: active ? `${info.color}08` : 'white', 
                    transition: 'all 0.2s' 
                  }}
                >
                  <input type="radio" name="status" checked={active} onChange={() => setNewStatus(s)} />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', fontWeight: 800, color: active ? info.color : '#475569' }}>
                    {createElement(info.icon, { size: 16 })} {s}
                  </div>
                </label>
              )
            })}
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      {modal === 'create' && (
        <Modal title="Issue Support Manifest" onClose={() => setModal(null)} size="lg"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Abort</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a', gap: '8px' }} onClick={() => { toast('Ticket Issued', 'success'); setModal(null) }}>
                <Zap size={18} /> Initialize Support
              </button>
            </>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>CLIENT IDENTITY</label>
              <select className="form-control form-select" style={{ borderRadius: '16px', fontWeight: 600 }}>
                <option>Select client identifier...</option>
                {users.filter(u=>u.role==='Client').map(u=><option key={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>TICKET CATEGORY</label>
              <select className="form-control form-select" style={{ borderRadius: '16px', fontWeight: 600 }}>
                <option>Solar Array Fault</option>
                <option>Filtration System Sync</option>
                <option>Power Inverter Maintenance</option>
                <option>Infrastructure Inspection</option>
              </select>
            </div>
          </div>
          <div className="form-group" style={{ marginTop: '24px' }}>
            <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>PROBLEM MANIFEST</label>
            <textarea className="form-control" style={{ borderRadius: '16px', minHeight: '120px', padding: '16px' }} placeholder="Provide a detailed technical overview of the issue..." />
          </div>
        </Modal>
      )}

      {selectedRequest && (
        <Modal title={`Technical Manifest Audit: ${selectedRequest.id}`} onClose={() => setSelectedRequest(null)} size="md">
          <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '32px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#8b5cf6', letterSpacing: '1px', marginBottom: '4px' }}>PARTS MANIFEST</div>
                <div style={{ fontSize: '20px', fontWeight: 900, color: '#0f172a' }}>{selectedRequest.tech}</div>
              </div>
              <div style={{ padding: '8px 16px', borderRadius: '12px', background: selectedRequest.status === 'Approved' ? '#ecfdf5' : '#fffbeb', color: selectedRequest.status === 'Approved' ? '#10b981' : '#f59e0b', fontSize: '12px', fontWeight: 900 }}>
                {selectedRequest.status.toUpperCase()}
              </div>
            </div>

            <div style={{ background: 'white', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9', marginBottom: '24px' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '16px' }}>RESOURCE ALLOCATION</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {selectedRequest.items.map((item, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                    <div style={{ fontWeight: 800, fontSize: '14px', color: '#1e293b' }}>{item.part}</div>
                    <div style={{ fontSize: '16px', fontWeight: 950, color: '#8b5cf6' }}>x{item.qty}</div>
                  </div>
                ))}
              </div>
            </div>

            {selectedRequest.reason && (
              <div style={{ background: '#8b5cf608', padding: '24px', borderRadius: '24px', border: '1px dashed #8b5cf630' }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: '#8b5cf6', marginBottom: '8px', letterSpacing: '1px' }}>DIAGNOSTIC JUSTIFICATION</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', lineHeight: 1.5 }}>{selectedRequest.reason}</div>
              </div>
            )}

            <button className="btn btn-ghost" style={{ width: '100%', marginTop: '32px', borderRadius: '16px', padding: '14px' }} onClick={() => setSelectedRequest(null)}>Dismiss Audit</button>
          </div>
        </Modal>
      )}
    </div>
  )
}
