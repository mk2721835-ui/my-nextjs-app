import { useState, useEffect } from 'react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import {
  users, invoices, maintenanceRequests, vehicles,
  monthlyRevenue, techPerformance, statusDistribution, recentActivity
} from '../data'
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Wrench,
  DollarSign, 
  CheckCircle, 
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  BarChart3,
  Calendar,
  Zap,
  MoreVertical,
  ChevronRight,
  Briefcase,
  Truck,
  Star,
  Clock,
  ExternalLink,
  Wallet,
  ArrowRight
} from 'lucide-react'

const fmt = n => n >= 1000 ? `${(n/1000).toFixed(0)}k` : n

// ── Unique Stat Card ────────────────────────────────────────────────────────
function StatCard({ stat, onClick }) {
  const [hovered, setHovered] = useState(false)
  const Icon = stat.iconComp

  return (
    <div 
      className="glass-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '24px',
        borderRadius: '28px',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: hovered ? 'translateY(-8px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        boxShadow: hovered 
          ? `0 25px 50px -12px ${stat.color}25` 
          : '0 4px 20px -5px rgba(0,0,0,0.05)',
      }}
      onClick={onClick}
    >
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-40px',
        width: '120px',
        height: '120px',
        background: `radial-gradient(circle, ${stat.color}15 0%, transparent 70%)`,
        borderRadius: '50%',
        transition: 'all 0.5s',
        transform: hovered ? 'scale(2)' : 'scale(1)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: `${stat.color}10`,
          color: stat.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: `0 8px 16px ${stat.color}15`,
          transform: hovered ? 'rotate(-8deg) scale(1.1)' : 'none',
          transition: 'all 0.3s'
        }}>
          <Icon size={24} />
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          fontSize: '11px',
          fontWeight: 800,
          color: stat.trendUp ? '#10b981' : '#ef4444',
          background: stat.trendUp ? '#10b98110' : '#ef444410',
          padding: '4px 10px',
          borderRadius: '99px'
        }}>
          {stat.trendUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {stat.trend.split(' ')[0]}
        </div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ fontSize: '12px', fontWeight: 800, color: '#64748b', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '4px' }}>
          {stat.label}
        </div>
        <div style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a', letterSpacing: '-1px' }}>
          {stat.value}
        </div>
      </div>

      <div style={{ 
        marginTop: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        fontWeight: 700,
        color: '#94a3b8',
        position: 'relative',
        zIndex: 1
      }}>
        <span>{stat.trend.split(' ').slice(1).join(' ')}</span>
        {hovered && <ArrowRight size={14} style={{ animation: 'fadeIn 0.3s' }} />}
      </div>
    </div>
  )
}

export default function Dashboard({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const clients    = users.filter(u => u.role === 'Client').length
  const techs      = users.filter(u => u.role === 'Technician')
  const onlineTech = techs.filter(t => t.status === 'Online' || t.status === 'Busy').length
  const openReqs   = maintenanceRequests.filter(r => !['Completed','Closed'].includes(r.status)).length
  const newInvoices = invoices.filter(i => i.isNew).length
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.paid, 0)
  const overdueAmt   = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + (i.total - i.paid), 0)

  const stats = [
    { label: 'Total Clients', value: clients, iconComp: Users, color: '#3B82F6', trend: '+3 this month', trendUp: true, page: 'users' },
    { label: 'Field Techs', value: `${onlineTech}/${techs.length}`, iconComp: Briefcase, color: '#10B981', trend: `${onlineTech} active now`, trendUp: true, page: 'users' },
    { label: 'Maintenance', value: openReqs, iconComp: Wrench, color: '#F59E0B', trend: `${newInvoices} new alerts`, trendUp: false, page: 'maintenance' },
    { label: 'Net Revenue', value: `SAR ${fmt(84000)}`, iconComp: DollarSign, color: '#8B5CF6', trend: '+18% vs last', trendUp: true, page: 'accounting' },
    { label: 'SLA Success', value: '94%', iconComp: CheckCircle, color: '#06B6D4', trend: '↑ 2% this week', trendUp: true, page: 'reports' },
    { label: 'Active Fleet', value: `${vehicles.filter(v=>v.status==='In Use').length}/${vehicles.length}`, iconComp: Truck, color: '#F43F5E', trend: '3 operational units', trendUp: true, page: 'fleet' },
    { label: 'Overdue', value: `SAR ${fmt(overdueAmt)}`, iconComp: AlertTriangle, color: '#EF4444', trend: '1 critical alert', trendUp: false, page: 'installments' },
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
            <Zap size={14} /> COMMAND CENTER
          </div>
          <h1 className="page-title" style={{ fontSize: '36px', fontWeight: 950, letterSpacing: '-1px' }}>
            Operations Dashboard
          </h1>
          <p className="page-subtitle" style={{ fontSize: '15px', marginTop: '4px', opacity: 0.7 }}>
            Real-time infrastructure and business metrics orchestration.
          </p>
        </div>
        <div className="page-header-actions" style={{ gap: '16px' }}>
          <button className="btn btn-ghost" onClick={() => onNavigate('reports')} style={{ gap: '10px', borderRadius: '18px', padding: '12px 24px' }}>
            <BarChart3 size={20} /> Analytics
          </button>
          <button className="btn btn-primary" onClick={() => onNavigate('maintenance')} style={{ 
            gap: '10px', 
            padding: '14px 32px', 
            borderRadius: '18px',
            background: '#0f172a',
            border: 'none',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)'
          }}>
            <Plus size={20} />
            New Request
          </button>
        </div>
      </div>

      {/* Critical Alert */}
      {newInvoices > 0 && (
        <div className="mesh-glow" style={{ 
          padding: '16px 24px', 
          borderRadius: '24px', 
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          color: 'white',
          boxShadow: '0 20px 40px -10px rgba(231, 60, 126, 0.3)',
          cursor: 'pointer'
        }} onClick={() => onNavigate('accounting')}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '12px', borderRadius: '16px' }}>
            <Wallet size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 900, fontSize: '16px' }}>Pending Financial Review</div>
            <div style={{ opacity: 0.8, fontSize: '13px' }}>{newInvoices} field invoices are awaiting validation from management.</div>
          </div>
          <ArrowRight size={24} />
        </div>
      )}

      {/* KPI Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', 
        gap: '24px',
        marginBottom: '40px'
      }}>
        {stats.map((s, idx) => (
          <div key={s.label} style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
            <StatCard stat={s} onClick={() => onNavigate(s.page)} />
          </div>
        ))}
      </div>

      {/* Main Insights Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginBottom: '40px' }}>
        {/* Revenue Flow */}
        <div className="glass-card" style={{ padding: '32px', borderRadius: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <div>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#3b82f6', letterSpacing: '1px', marginBottom: '4px' }}>GROWTH ANALYTICS</div>
              <h2 style={{ fontSize: '24px', fontWeight: 950, color: '#0f172a', margin: 0 }}>Revenue Flow</h2>
            </div>
            <select style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px', fontWeight: 700 }}>
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyRevenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={v => `$${v/1000}k`} />
              <Tooltip 
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', padding: '16px' }}
                itemStyle={{ fontSize: '13px', fontWeight: 800 }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Request Distribution */}
        <div className="glass-card" style={{ padding: '32px', borderRadius: '32px', background: '#0f172a', color: 'white' }}>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#3b82f6', letterSpacing: '1px', marginBottom: '4px' }}>INFRASTRUCTURE</div>
            <h2 style={{ fontSize: '24px', fontWeight: 950, color: 'white', margin: 0 }}>Requests</h2>
          </div>
          
          <div style={{ position: 'relative', height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusDistribution}
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                  onMouseEnter={(_, i) => setActiveIndex(i)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {statusDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" opacity={activeIndex === null || activeIndex === i ? 1 : 0.6} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', fontWeight: 950 }}>{statusDistribution.reduce((s, d) => s + d.value, 0)}</div>
              <div style={{ fontSize: '10px', fontWeight: 800, opacity: 0.5 }}>TOTAL</div>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {statusDistribution.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.05)', padding: '10px 16px', borderRadius: '16px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: s.color }} />
                <span style={{ fontSize: '12px', fontWeight: 700, flex: 1 }}>{s.name}</span>
                <span style={{ fontSize: '12px', fontWeight: 900 }}>{s.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Activity Feed */}
        <div className="glass-card" style={{ padding: '32px', borderRadius: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Clock size={22} color="#3b82f6" /> Activity Timeline
            </h3>
            <button className="btn btn-ghost btn-sm" style={{ borderRadius: '12px' }}>View History</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {recentActivity.map((a, i) => (
              <div key={a.id} style={{ display: 'flex', gap: '20px', position: 'relative' }}>
                {i < recentActivity.length - 1 && (
                  <div style={{ position: 'absolute', left: '20px', top: '40px', bottom: '-10px', width: '2px', background: '#f1f5f9' }} />
                )}
                <div style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '14px', 
                  background: `${a.color}15`, 
                  color: a.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  fontSize: '18px'
                }}>
                  {a.icon}
                </div>
                <div style={{ flex: 1, paddingBottom: '12px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#334155', marginBottom: '2px' }}>{a.text}</div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Technician Pulse */}
        <div className="glass-card" style={{ padding: '32px', borderRadius: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Activity size={22} color="#10b981" /> Technician Pulse
            </h3>
            <button className="btn btn-ghost btn-sm" onClick={() => onNavigate('users')} style={{ borderRadius: '12px' }}>Directory</button>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {users.filter(u => u.role === 'Technician').slice(0, 5).map(t => (
              <div key={t.id} className="card-hover-lift" style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '16px', 
                padding: '16px', 
                borderRadius: '20px', 
                background: '#f8fafc',
                border: '1px solid #f1f5f9',
                cursor: 'pointer'
              }} onClick={() => onNavigate('users')}>
                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '14px', 
                  background: t.color, 
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '16px'
                }}>{t.initials}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>{t.name}</div>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>{t.specialty} · {t.jobsDone} jobs</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', marginBottom: '2px' }}>
                    <Star size={12} fill="#f59e0b" /> {t.rating}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: t.status === 'Online' ? '#10b981' : t.status === 'Busy' ? '#f59e0b' : '#94a3b8' }} />
                    <span style={{ fontSize: '10px', fontWeight: 800, color: '#64748b' }}>{t.status.toUpperCase()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
