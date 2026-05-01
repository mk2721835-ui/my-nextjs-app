import { useState, useEffect, createElement } from 'react'
import {
  AreaChart, Area, BarChart, Bar, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, LineChart, Line
} from 'recharts'
import {
  monthlyRevenue, techPerformance, users,
  invoices, maintenanceRequests, installmentPlans,
} from '../data'
import { useToast } from '../App'
import { 
  TrendingUp, 
  Users, 
  Wrench, 
  DollarSign, 
  Activity, 
  BarChart3, 
  PieChart as PieChartIcon, 
  Calendar, 
  Download, 
  Filter, 
  LayoutGrid, 
  List, 
  ArrowUpRight, 
  ArrowDownRight, 
  Award, 
  Target, 
  Clock, 
  ShieldCheck, 
  Zap, 
  MoreVertical,
  ChevronRight,
  ClipboardList,
  History,
  Star,
  MapPin,
  Mail,
  Phone,
  ArrowRight,
  Wallet
} from 'lucide-react'

const RADAR_COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']

const radarData = [
  { metric: 'Speed',       M_Salim: 90, A_Otaibi: 75, Y_Shammari: 60, N_Dosari: 82 },
  { metric: 'Quality',     M_Salim: 95, A_Otaibi: 88, Y_Shammari: 80, N_Dosari: 92 },
  { metric: 'Punctuality', M_Salim: 88, A_Otaibi: 72, Y_Shammari: 65, N_Dosari: 85 },
  { metric: 'Rating',      M_Salim: 96, A_Otaibi: 90, Y_Shammari: 86, N_Dosari: 92 },
  { metric: 'Jobs',        M_Salim: 88, A_Otaibi: 70, Y_Shammari: 54, N_Dosari: 64 },
]

const clientData = [
  { name: 'Omar Al-Zahrani',  val: 28500, pct: 95, color: '#3B82F6', orders: 4, maint: 2, city: 'Medina', plan: 'Completed', phone: '+966 58 567 8901', email: 'omar@email.com',   joinDate: '2024-04-15', lastOrder: '2026-04-28' },
  { name: 'Ahmed Al-Rashidi', val: 22000, pct: 73, color: '#10B981', orders: 3, maint: 2, city: 'Riyadh',  plan: 'Active',    phone: '+966 50 123 4567', email: 'ahmed@email.com',  joinDate: '2024-01-15', lastOrder: '2026-04-22' },
  { name: 'Sara Al-Ghamdi',   val: 12000, pct: 40, color: '#8B5CF6', orders: 1, maint: 2, city: 'Jeddah',  plan: 'Active',    phone: '+966 55 234 5678', email: 'sara@email.com',   joinDate: '2024-02-20', lastOrder: '2026-04-25' },
  { name: 'Khalid Bin Naif',  val: 5200,  pct: 17, color: '#F59E0B', orders: 2, maint: 1, city: 'Dammam',  plan: 'Active',    phone: '+966 54 345 6789', email: 'khalid@email.com', joinDate: '2024-03-10', lastOrder: '2026-04-27' },
  { name: 'Fatima Hassan',    val: 800,   pct: 3,  color: '#EF4444', orders: 0, maint: 1, city: 'Mecca',   plan: 'Overdue ⚠️', phone: '+966 56 456 7890', email: 'fatima@email.com', joinDate: '2024-04-01', lastOrder: '—' },
]

const serviceBreakdown = [
  { type: 'Solar Systems', revenue: 196000, jobs: 89, pct: 52, color: '#F59E0B' },
  { type: 'Maintenance',   revenue: 118000, jobs: 112, pct: 31, color: '#10B981' },
  { type: 'Water Filters', revenue: 45000,  jobs: 38,  pct: 12, color: '#3B82F6' },
  { type: 'Installments',  revenue: 16000,  jobs: 12,  pct: 5,  color: '#8B5CF6' },
]

function VTog({ mode, setMode }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: '#e2e8f0', borderRadius: '16px', padding: '4px' }}>
      {[
        { id: 'charts', icon: BarChart3, label: 'Analytics' },
        { id: 'data', icon: List, label: 'Raw Data' }
      ].map(({ id, icon: Icon, label }) => (
        <button key={id} onClick={() => setMode(id)}
          style={{ 
            padding: '8px 18px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 800,
            display: 'flex', alignItems: 'center', gap: 8,
            background: mode === id ? '#0f172a' : 'transparent',
            boxShadow: mode === id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none',
            color: mode === id ? 'white' : '#64748b',
            transition: 'all 0.3s',
          }}>
          <Icon size={14} /> {label}
        </button>
      ))}
    </div>
  )
}

export default function Reports() {
  const toast = useToast()
  const [tab, setTab]         = useState('overview')
  const [dateRange, setDateRange] = useState('6months')
  const [viewMode, setViewMode] = useState('charts')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // Aggregates
  const technicians   = users.filter(u => u.role === 'Technician')
  const totalRevenue  = monthlyRevenue.reduce((s, m) => s + m.revenue, 0)
  const totalExpenses = monthlyRevenue.reduce((s, m) => s + m.expenses, 0)
  const totalProfit   = totalRevenue - totalExpenses
  const totalJobs     = monthlyRevenue.reduce((s, m) => s + m.jobs, 0)
  const avgRevenue    = Math.round(totalRevenue / monthlyRevenue.length)
  const growthPct     = Math.round(((monthlyRevenue[5].revenue - monthlyRevenue[0].revenue) / monthlyRevenue[0].revenue) * 100)
  const financialData = monthlyRevenue.map(m => ({ ...m, profit: m.revenue - m.expenses }))

  const techRevenue = {}
  invoices.filter(i => i.status === 'Paid' && i.techId).forEach(inv => {
    techRevenue[inv.techId] = (techRevenue[inv.techId] || 0) + inv.paid
  })

  const techWithScore = technicians.map((t, i) => {
    const perf = techPerformance[i] || {}
    const score = Math.round(Math.random() * 20 + 80) // Mock logic
    return { ...t, ...perf, score, revenue: techRevenue[t.id] || 0 }
  }).sort((a, b) => b.score - a.score)

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease' }}>
      {/* Premium Header */}
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
            letterSpacing: '1px'
          }}>
            <Target size={14} /> INTELLIGENCE HUB
          </div>
          <h1 className="page-title" style={{ fontSize: '36px', fontWeight: 950, letterSpacing: '-1.5px' }}>
            Executive Analytics
          </h1>
          <p className="page-subtitle" style={{ fontSize: '15px', marginTop: '4px', opacity: 0.7 }}>
            Synthesizing field operations, financial growth, and technical excellence.
          </p>
        </div>
        <div className="page-header-actions" style={{ gap: '16px' }}>
          <select className="form-control form-select" value={dateRange} onChange={e => setDateRange(e.target.value)} style={{ width: 180, borderRadius: '18px', fontWeight: 700 }}>
            <option value="1month">Last 30 Days</option>
            <option value="6months">Last 6 Months</option>
            <option value="year">Fiscal Year 2026</option>
          </select>
          <button className="btn btn-primary" onClick={() => toast('Comprehensive report generated', 'success')} style={{ 
            borderRadius: '18px', 
            padding: '14px 32px', 
            background: '#0f172a',
            border: 'none',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)',
            gap: '10px'
          }}>
            <Download size={20} /> Generate Manifest
          </button>
        </div>
      </div>

      {/* Global Performance Summary */}
      <div className="mesh-glow" style={{ 
        padding: '32px', 
        borderRadius: '32px', 
        marginBottom: '40px',
        display: 'flex',
        alignItems: 'center',
        gap: '40px',
        color: 'white',
        boxShadow: '0 30px 60px -12px rgba(15, 23, 42, 0.25)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '11px', fontWeight: 900, color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', marginBottom: '8px' }}>FISCAL PERFORMANCE INDICATOR</div>
          <div style={{ fontSize: '48px', fontWeight: 950, letterSpacing: '-2px' }}>SAR {totalRevenue.toLocaleString()}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#4ade80', fontSize: '14px', fontWeight: 800, marginTop: '8px' }}>
            <ArrowUpRight size={18} /> +{growthPct}% YEAR-OVER-YEAR VELOCITY
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', flex: 1, position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>JOB COMPLETION</div>
            <div style={{ fontSize: '24px', fontWeight: 950 }}>{totalJobs}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>OPERATIONAL UNITS</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>TEAM EFFICIENCY</div>
            <div style={{ fontSize: '24px', fontWeight: 950 }}>98.2%</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>SLA COMPLIANCE</div>
          </div>
        </div>
      </div>

      {/* Primary Nav Controls */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '40px',
        background: '#f8fafc',
        padding: '12px',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id: 'overview',    label: 'Overview', icon: BarChart3 },
            { id: 'technicians', label: 'Field Team', icon: Users },
            { id: 'financial',   label: 'Revenue', icon: Wallet },
            { id: 'clients',     label: 'Clients', icon: Star },
          ].map(t => (
            <button key={t.id} 
              onClick={() => { setTab(t.id); setViewMode('charts') }}
              style={{
                padding: '10px 24px',
                borderRadius: '16px',
                border: 'none',
                background: tab === t.id ? 'white' : 'transparent',
                color: tab === t.id ? '#0f172a' : '#64748b',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: tab === t.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <t.icon size={16} />
              {t.label}
            </button>
          ))}
        </div>
        <VTog mode={viewMode} setMode={setViewMode} />
      </div>

      {/* Content Rendering */}
      {tab === 'overview' && (
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          {/* Main Trend Area */}
          <div className="glass-card" style={{ padding: '32px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: 950, margin: 0 }}>Revenue & Growth Velocity</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} /> REVENUE
                </span>
                <span style={{ fontSize: '11px', fontWeight: 900, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444' }} /> EXPENSES
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart data={financialData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={v => `${v/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Service Sector Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div className="glass-card" style={{ padding: '24px', borderRadius: '32px' }}>
              <div style={{ fontSize: '14px', fontWeight: 950, marginBottom: '20px' }}>Market Concentration</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {serviceBreakdown.map(s => (
                  <div key={s.type}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#475569' }}>{s.type}</span>
                      <span style={{ fontSize: '13px', fontWeight: 950, color: s.color }}>{s.pct}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: `${s.pct}%`, height: '100%', background: s.color, borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="glass-card" style={{ padding: '24px', borderRadius: '32px', background: '#0f172a', color: 'white' }}>
              <div style={{ fontSize: '14px', fontWeight: 950, marginBottom: '16px' }}>Performance Rating</div>
              <div style={{ fontSize: '42px', fontWeight: 950, color: '#f59e0b' }}>4.92<span style={{ fontSize: '18px', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>/5.0</span></div>
              <div style={{ marginTop: '12px', display: 'flex', gap: '4px' }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '12px' }}>Based on 892 client verifications.</div>
            </div>
          </div>
        </div>
      )}

      {tab === 'technicians' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
          <div className="glass-card" style={{ gridColumn: '1 / -1', padding: '32px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 950, margin: 0 }}>Personnel Capability Matrix</h3>
              <div style={{ background: '#f1f5f9', padding: '6px 16px', borderRadius: '10px', fontSize: '11px', fontWeight: 900 }}>TOP PERFORMERS</div>
            </div>
            <ResponsiveContainer width="100%" height={340}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                {['M_Salim', 'A_Otaibi', 'Y_Shammari', 'N_Dosari'].map((k, i) => (
                  <Radar key={k} name={k.replace('_', '. ')} dataKey={k} stroke={RADAR_COLORS[i]} fill={RADAR_COLORS[i]} fillOpacity={0.1} strokeWidth={2} />
                ))}
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Legend iconType="circle" />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          {techWithScore.map((t, idx) => (
            <div key={t.id} className="glass-card" style={{ padding: '28px', borderRadius: '32px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: t.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 950, boxShadow: `0 10px 20px ${t.color}20` }}>
                    {t.initials}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 950 }}>{t.name}</div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8' }}>{t.specialty}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '24px', fontWeight: 950, color: t.color }}>{t.score}%</div>
                  <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px' }}>EFFICIENCY</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', marginBottom: '4px' }}>TOTAL JOBS</div>
                  <div style={{ fontSize: '18px', fontWeight: 950 }}>{t.jobsDone}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', marginBottom: '4px' }}>REVENUE GEN</div>
                  <div style={{ fontSize: '18px', fontWeight: 950, color: '#10b981' }}>SAR {t.revenue.toLocaleString()}</div>
                </div>
              </div>

              <button className="btn btn-ghost btn-sm" style={{ width: '100%', borderRadius: '14px', gap: '8px' }}>
                View Full Dossier <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {tab === 'financial' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <div className="glass-card" style={{ padding: '32px', borderRadius: '32px' }}>
            <div style={{ fontSize: '20px', fontWeight: 950, marginBottom: '32px' }}>Financial Volume Analysis</div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#64748b' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#10b981" radius={[8, 8, 0, 0]} />
                <Bar dataKey="expenses" fill="#ef4444" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '24px' }}>
            {financialData.map(m => (
              <div key={m.month} className="glass-card" style={{ padding: '24px', borderRadius: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 950 }}>{m.month} 2026</span>
                  <span style={{ background: '#3b82f615', color: '#3b82f6', padding: '4px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 900 }}>{m.jobs} JOBS</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Revenue</span>
                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#10b981' }}>SAR {m.revenue.toLocaleString()}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Profit</span>
                    <span style={{ fontSize: '12px', fontWeight: 900, color: '#3b82f6' }}>SAR {m.profit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'clients' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px' }}>
          {clientData.map((c, idx) => (
            <div key={c.name} className="glass-card" style={{ padding: '28px', borderRadius: '32px', animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${c.color}15`, color: c.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950 }}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 950 }}>{c.name}</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>{c.city.toUpperCase()}</div>
                  </div>
                </div>
                <div style={{ background: '#f1f5f9', padding: '4px 12px', borderRadius: '10px', fontSize: '10px', fontWeight: 900 }}>PLATINUM</div>
              </div>
              
              <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>LIFETIME VALUE</div>
                    <div style={{ fontSize: '18px', fontWeight: 950, color: '#0f172a' }}>SAR {c.val.toLocaleString()}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>ORDER VOLUME</div>
                    <div style={{ fontSize: '18px', fontWeight: 950, color: '#3b82f6' }}>{c.orders}</div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, borderRadius: '14px' }}><Mail size={14} /></button>
                <button className="btn btn-ghost btn-sm" style={{ flex: 1, borderRadius: '14px' }}><Phone size={14} /></button>
                <button className="btn btn-primary btn-sm" style={{ flex: 3, borderRadius: '14px', background: '#0f172a' }}>View Profile</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
