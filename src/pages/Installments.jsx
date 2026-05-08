import { useState, useEffect } from 'react'
import { installmentPlans as initialPlans } from '../data'
import Modal from '../components/Modal'
import { useToast } from '../App'
import { 
  CreditCard, 
  Search, 
  Filter, 
  Calendar, 
  User, 
  ArrowUpRight, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Download,
  Plus,
  ArrowRight,
  TrendingUp,
  DollarSign,
  LayoutGrid,
  List,
  Trash2
} from 'lucide-react'

const STATUS_CONFIG = {
  Active:    { color: '#3b82f6', bg: '#eff6ff', icon: Clock },
  Overdue:   { color: '#ef4444', bg: '#fef2f2', icon: AlertCircle },
  Completed: { color: '#10b981', bg: '#f0fdf4', icon: CheckCircle2 }
}

function VTog({ mode, setMode }) {
  return (
    <div style={{ display: 'flex', gap: '6px', background: 'white', borderRadius: '14px', padding: '5px', border: '1px solid #e2e8f0' }}>
      {[
        { id: 'grid', icon: LayoutGrid, label: 'Cards' },
        { id: 'table', icon: List, label: 'List' }
      ].map(({ id, icon: Icon, label }) => (
        <button key={id} onClick={() => setMode(id)}
          style={{ 
            padding: '8px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 900,
            display: 'flex', alignItems: 'center', gap: '8px', letterSpacing: '0.5px',
            background: mode === id ? '#0f172a' : 'transparent',
            boxShadow: mode === id ? '0 8px 16px -4px rgba(15, 23, 42, 0.25)' : 'none',
            color: mode === id ? 'white' : '#64748b',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          }}>
          <Icon size={14} strokeWidth={2.5} /> {label.toUpperCase()}
        </button>
      ))}
    </div>
  )
}

function CreativeInstallmentCard({ plan, onOpenView }) {
  const [hovered, setHovered] = useState(false)
  const config = STATUS_CONFIG[plan.status] || STATUS_CONFIG.Active
  const StatusIcon = config.icon
  const progress = Math.round((plan.paid / plan.totalAmount) * 100)

  return (
    <div 
      className="glass-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '32px',
        padding: '28px',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        cursor: 'pointer',
        background: 'white',
        border: '1px solid #e2e8f0',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxShadow: hovered 
          ? `0 30px 60px -12px ${config.color}20` 
          : '0 4px 20px -5px rgba(0,0,0,0.05)',
      }}
      onClick={(e) => onOpenView(plan, e)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ 
          width: '64px', 
          height: '64px', 
          borderRadius: '20px', 
          background: `${config.color}15`, 
          color: config.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          fontWeight: 950,
          transform: hovered ? 'rotate(-10deg)' : 'none',
          transition: 'transform 0.3s'
        }}>
          {(plan.client || '??').split(' ').map(n => n[0]).join('')}
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '6px', 
          padding: '6px 14px', 
          borderRadius: '99px',
          background: config.bg,
          color: config.color,
          fontSize: '10px',
          fontWeight: 900,
          letterSpacing: '0.5px'
        }}>
          <StatusIcon size={12} /> {plan.status.toUpperCase()}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', margin: '0 0 6px 0' }}>{plan.client}</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '13px', fontWeight: 600 }}>
          <span style={{ fontFamily: 'monospace', background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px' }}>{plan.id}</span>
          <span>•</span>
          <span>{plan.product}</span>
        </div>
      </div>

      <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ fontSize: '9px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px' }}>PAYMENT PROGRESS</div>
          <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a' }}>{progress}%</div>
        </div>
        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ width: `${progress}%`, height: '100%', background: config.color, borderRadius: '4px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', fontSize: '12px', fontWeight: 700 }}>
          <span style={{ color: '#64748b' }}>SAR {plan.paid.toLocaleString()} Paid</span>
          <span style={{ color: '#0f172a' }}>{plan.paymentsCompleted}/{plan.paymentsTotal}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>NEXT INSTALLMENT</div>
          {plan.nextDue ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', fontWeight: 900, color: plan.status === 'Overdue' ? '#ef4444' : '#0f172a' }}>
              <Calendar size={14} /> {new Date(plan.nextDue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </div>
          ) : (
            <div style={{ fontSize: '14px', fontWeight: 900, color: '#94a3b8' }}>N/A</div>
          )}
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>AMOUNT</div>
          <div style={{ fontSize: '18px', fontWeight: 950, color: '#0f172a' }}>
            <span style={{ fontSize: '12px', color: '#64748b', marginRight: '2px' }}>SAR</span>
            {plan.monthlyPayment.toLocaleString()}
          </div>
        </div>
      </div>

      <button className="btn btn-primary" style={{ 
        width: '100%', 
        borderRadius: '16px', 
        height: '52px', 
        background: hovered ? config.color : '#0f172a',
        border: 'none',
        transition: 'all 0.3s',
        fontWeight: 900,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
      }}>
        Manage Account <ArrowRight size={18} />
      </button>
    </div>
  )
}

export default function Installments() {
  const toast = useToast()
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewMode, setViewMode] = useState('grid')
  const [plans, setPlans] = useState(initialPlans)
  const [modal, setModal] = useState(null) // null | 'add' | 'view' | 'delete'
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [form, setForm] = useState({ client: '', product: '', totalAmount: '', downPayment: '', months: '', monthlyPayment: '', nextDue: '' })

  useEffect(() => { setMounted(true) }, [])

  const stats = [
    { label: 'Total Portfolio', value: `SAR ${plans.reduce((acc, p) => acc + p.totalAmount, 0).toLocaleString()}`, icon: DollarSign, trend: '+12%', color: '#0f172a' },
    { label: 'Active Plans', value: plans.filter(p => p.status === 'Active').length, icon: Clock, trend: '85%', color: '#3b82f6' },
    { label: 'Total Collected', value: `SAR ${plans.reduce((acc, p) => acc + p.paid, 0).toLocaleString()}`, icon: TrendingUp, trend: '+18%', color: '#10b981' },
    { label: 'Overdue Amount', value: `SAR ${plans.filter(p => p.status === 'Overdue').reduce((acc, p) => acc + (p.totalAmount - p.paid), 0).toLocaleString()}`, icon: AlertCircle, trend: `${plans.filter(p => p.status === 'Overdue').length} Accounts`, color: '#ef4444' },
  ]

  const filteredPlans = plans.filter(p => {
    const matchStatus = statusFilter === 'All' || p.status === statusFilter
    const matchSearch = p.client.toLowerCase().includes(search.toLowerCase()) || 
                       p.id.toLowerCase().includes(search.toLowerCase()) ||
                       p.product.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const openAdd = () => {
    setForm({ client: '', product: '', totalAmount: '', downPayment: '', months: '', monthlyPayment: '', nextDue: '' })
    setModal('add')
  }

  const openView = (plan, e) => {
    e?.stopPropagation()
    setSelectedPlan(plan)
    setModal('view')
  }

  const openDelete = (plan, e) => {
    e?.stopPropagation()
    setSelectedPlan(plan)
    setModal('delete')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const total = parseFloat(form.totalAmount)
    const down = parseFloat(form.downPayment)
    const m = parseInt(form.months)
    
    if (isNaN(total) || isNaN(down) || isNaN(m) || m <= 0) {
      toast('Invalid plan parameters', 'error')
      return
    }

    if (down >= total) {
      toast('Down payment cannot exceed total amount', 'error')
      return
    }

    const monthly = (total - down) / m

    const newPlan = {
      id: `PLAN-${Math.floor(Math.random() * 900) + 100}`,
      client: form.client,
      product: form.product,
      totalAmount: total,
      downPayment: down,
      months: m,
      monthlyPayment: Math.round(monthly),
      paid: down,
      remaining: total - down,
      nextDue: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
      status: 'Active',
      paymentsCompleted: 0,
      paymentsTotal: m
    }

    setPlans([newPlan, ...plans])
    setModal(null)
    toast('New installment plan created successfully', 'success')
  }

  const handleDelete = () => {
    setPlans(plans.filter(p => p.id !== selectedPlan.id))
    setModal(null)
    toast('Plan deleted successfully', 'warning')
  }

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease' }}>
      {/* Header */}
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
            <CreditCard size={14} /> FINANCIAL RECOVERY
          </div>
          <h1 className="page-title" style={{ fontSize: '36px', fontWeight: 950, letterSpacing: '-1px' }}>
            Installment Management
          </h1>
          <p className="page-subtitle" style={{ fontSize: '15px', marginTop: '4px', opacity: 0.7 }}>
            Monitor payment schedules, overdue accounts, and collection performance.
          </p>
        </div>
        <div className="page-header-actions" style={{ gap: '16px' }}>
          <button className="btn btn-ghost" onClick={() => toast('Financial report exported', 'success')} style={{ gap: '10px', borderRadius: '18px', padding: '12px 24px' }}>
            <Download size={20} /> Export
          </button>
          <button className="btn btn-primary" onClick={openAdd} style={{ 
            gap: '10px', 
            padding: '14px 32px', 
            borderRadius: '18px',
            background: '#0f172a',
            border: 'none',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)'
          }}>
            <Plus size={20} /> New Plan
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {stats.map((s, idx) => (
          <div key={idx} className="glass-card" style={{ 
            padding: '24px', 
            borderRadius: '24px',
            background: 'white',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            animation: `fadeIn 0.5s ease-out ${idx * 0.1}s both`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '16px', 
                background: `${s.color}10`, 
                color: s.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <s.icon size={24} />
              </div>
              <div style={{ 
                fontSize: '11px', 
                fontWeight: 900, 
                color: s.color, 
                background: `${s.color}10`, 
                padding: '4px 10px', 
                borderRadius: '8px' 
              }}>
                {s.trend}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize: '24px', fontWeight: 950, color: '#0f172a' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '32px', 
        gap: '24px',
        padding: '12px',
        background: '#f8fafc',
        borderRadius: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['All', 'Active', 'Overdue', 'Completed'].map(s => (
            <button key={s} 
              onClick={() => setStatusFilter(s)}
              style={{
                padding: '10px 20px',
                borderRadius: '16px',
                border: 'none',
                background: statusFilter === s ? 'white' : 'transparent',
                color: statusFilter === s ? '#0f172a' : '#64748b',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: statusFilter === s ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              {s}
            </button>
          ))}
        </div>
        
        <div className="search-input-wrap" style={{ 
          minWidth: '400px', 
          borderRadius: '16px', 
          background: 'white',
          padding: '10px 18px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
        }}>
          <Search size={18} color="#94a3b8" />
          <input 
            placeholder="Search clients, products or plan IDs..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            style={{ fontSize: '14px', fontWeight: 500 }}
          />
          <VTog mode={viewMode} setMode={setViewMode} />
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '32px', marginBottom: '40px' }}>
          {filteredPlans.map((p, idx) => (
            <div key={p.id} style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
              <CreativeInstallmentCard plan={p} onOpenView={openView} />
            </div>
          ))}
        </div>
      ) : (
        <div className="table-container" style={{ borderRadius: '30px', border: '1px solid #e2e8f0', background: 'white', overflow: 'hidden', marginBottom: '40px' }}>
          <table className="table">
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '24px' }}>CLIENT & PLAN</th>
                <th>PRODUCT ASSET</th>
                <th>FINANCIAL STATUS</th>
                <th>PROGRESS</th>
                <th>NEXT DUE</th>
                <th style={{ textAlign: 'right', paddingRight: '24px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPlans.map((p, idx) => {
                const config = STATUS_CONFIG[p.status] || STATUS_CONFIG.Active
                const StatusIcon = config.icon
                const progress = Math.round((p.paid / p.totalAmount) * 100)

                return (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={(e) => openView(p, e)}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ 
                          width: '48px', 
                          height: '48px', 
                          borderRadius: '16px', 
                          background: `${config.color}10`, 
                          color: config.color,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 900
                        }}>
                          {(p.client || '??').split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '15px', color: '#0f172a' }}>{p.client}</div>
                          <div style={{ fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>{p.id}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: '14px', color: '#0f172a' }}>{p.product}</div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>SAR {p.totalAmount.toLocaleString()} Total</div>
                    </td>
                    <td>
                      <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        padding: '6px 14px', 
                        borderRadius: '12px',
                        background: config.bg,
                        color: config.color,
                        fontSize: '12px',
                        fontWeight: 800
                      }}>
                        <StatusIcon size={14} />
                        {p.status.toUpperCase()}
                      </div>
                    </td>
                    <td style={{ width: '200px' }}>
                      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                        <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a' }}>{progress}%</span>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>{p.paymentsCompleted}/{p.paymentsTotal} Pmts</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                          width: `${progress}%`, 
                          height: '100%', 
                          background: config.color, 
                          borderRadius: '3px',
                          transition: 'width 1s ease-out'
                        }} />
                      </div>
                    </td>
                    <td>
                      {p.nextDue ? (
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '14px', color: p.status === 'Overdue' ? '#ef4444' : '#0f172a' }}>
                            {new Date(p.nextDue).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>SAR {p.monthlyPayment.toLocaleString()} Due</div>
                        </div>
                      ) : (
                        <span style={{ color: '#94a3b8', fontSize: '13px', fontWeight: 600 }}>No upcoming</span>
                      )}
                    </td>
                    <td style={{ paddingRight: '24px' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <button className="btn btn-ghost btn-sm" style={{ height: '36px', borderRadius: '10px' }} onClick={(e) => { e.stopPropagation(); toast(`Record payment for ${p.client}`, 'info') }}>
                          Collect
                        </button>
                        <button className="btn btn-primary btn-sm" style={{ height: '36px', borderRadius: '10px', padding: '0 12px' }} onClick={(e) => openView(p, e)}>
                          <ArrowUpRight size={16} />
                        </button>
                        <button className="btn btn-ghost btn-sm" style={{ width: '36px', height: '36px', padding: 0 }} onClick={(e) => openDelete(p, e)}>
                          <Trash2 size={16} color="#ef4444" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Bottom Layout: Recent History & Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px', marginTop: '40px' }}>
        <div className="glass-card" style={{ padding: '32px', borderRadius: '32px', background: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, margin: 0 }}>Collection Forecast</h3>
            <button className="btn btn-ghost btn-sm">View Schedule</button>
          </div>
          <div style={{ height: '150px', display: 'flex', alignItems: 'flex-end', gap: '12px', paddingBottom: '20px' }}>
            {[45, 65, 35, 85, 55, 75, 45].map((h, i) => (
              <div key={i} style={{ flex: 1, background: i === 3 ? '#0f172a' : '#f1f5f9', height: `${h}%`, borderRadius: '8px', position: 'relative' }}>
                <div style={{ position: 'absolute', bottom: '-25px', left: 0, right: 0, textAlign: 'center', fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '32px', borderRadius: '32px', background: '#0f172a', color: 'white', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h3 style={{ fontSize: '18px', fontWeight: 900, margin: '0 0 8px 0' }}>Recovery Performance</h3>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '24px' }}>System-wide collection health</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>
                  <span>ON-TIME PAYMENTS</span>
                  <span>94%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ width: '94%', height: '100%', background: '#10b981', borderRadius: '2px' }} />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 800, marginBottom: '8px' }}>
                  <span>SETTLEMENT RATIO</span>
                  <span>78%</span>
                </div>
                <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' }}>
                  <div style={{ width: '78%', height: '100%', background: '#3b82f6', borderRadius: '2px' }} />
                </div>
              </div>
            </div>
            
            <button className="btn btn-primary" style={{ width: '100%', marginTop: '32px', background: 'white', color: '#0f172a', border: 'none', borderRadius: '14px', fontWeight: 900 }}>
              Audit All Plans
            </button>
          </div>
          <div style={{ position: 'absolute', bottom: '-20px', right: '-20px', width: '140px', height: '140px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%' }} />
        </div>
      </div>
      
      {/* ── MODALS ── */}
      {modal === 'add' && (
        <Modal title="Create New Installment Plan" onClose={() => setModal(null)} size="lg">
          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', padding: '12px' }}>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Client Name</label>
              <input required value={form.client} onChange={e => setForm({...form, client: e.target.value})} placeholder="Full legal name" />
            </div>
            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label>Product / Asset</label>
              <input required value={form.product} onChange={e => setForm({...form, product: e.target.value})} placeholder="e.g. Solar System 10kW" />
            </div>
            <div className="form-group">
              <label>Total Amount (SAR)</label>
              <input required type="number" value={form.totalAmount} onChange={e => setForm({...form, totalAmount: e.target.value})} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Down Payment (SAR)</label>
              <input required type="number" value={form.downPayment} onChange={e => setForm({...form, downPayment: e.target.value})} placeholder="0.00" />
            </div>
            <div className="form-group">
              <label>Duration (Months)</label>
              <input required type="number" value={form.months} onChange={e => setForm({...form, months: e.target.value})} placeholder="e.g. 12" />
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '12px' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '48px', borderRadius: '12px' }}>Initialize Plan</button>
            </div>
          </form>
        </Modal>
      )}

      {modal === 'view' && selectedPlan && (
        <Modal title={`Plan Details: ${selectedPlan.id}`} onClose={() => setModal(null)} size="lg">
          <div style={{ padding: '12px' }}>
            <div style={{ display: 'flex', gap: '32px', marginBottom: '32px', background: '#f8fafc', padding: '24px', borderRadius: '24px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: STATUS_CONFIG[selectedPlan.status].bg, color: STATUS_CONFIG[selectedPlan.status].color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 950 }}>
                {(selectedPlan.client || '??').split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 950 }}>{selectedPlan.client}</h2>
                <div style={{ display: 'flex', gap: '16px', marginTop: '8px', color: '#64748b', fontSize: '14px', fontWeight: 600 }}>
                  <span>{selectedPlan.product}</span>
                  <span>•</span>
                  <span style={{ color: STATUS_CONFIG[selectedPlan.status].color }}>{selectedPlan.status.toUpperCase()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
              {[
                { label: 'Total Valuation', value: `SAR ${selectedPlan.totalAmount.toLocaleString()}` },
                { label: 'Amount Paid', value: `SAR ${selectedPlan.paid.toLocaleString()}` },
                { label: 'Remaining Balance', value: `SAR ${selectedPlan.remaining.toLocaleString()}` },
                { label: 'Monthly Installment', value: `SAR ${selectedPlan.monthlyPayment.toLocaleString()}` },
                { label: 'Payments Completed', value: `${selectedPlan.paymentsCompleted} / ${selectedPlan.paymentsTotal}` },
                { label: 'Next Due Date', value: selectedPlan.nextDue || 'N/A' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '16px', background: '#f1f5f9', borderRadius: '16px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>{item.label.toUpperCase()}</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a' }}>{item.value}</div>
                </div>
              ))}
            </div>

            <div className="table-container" style={{ borderRadius: '20px', border: '1px solid #e2e8f0' }}>
              <table className="table">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '16px' }}>Installment #</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(3)].map((_, i) => (
                    <tr key={i}>
                      <td style={{ padding: '12px 16px', fontWeight: 800 }}>Pmt-{i+1}</td>
                      <td style={{ fontSize: '13px' }}>{new Date(new Date().setMonth(new Date().getMonth() - (3-i))).toLocaleDateString()}</td>
                      <td style={{ fontWeight: 900 }}>SAR {selectedPlan.monthlyPayment.toLocaleString()}</td>
                      <td><span className="badge badge-success">PAID</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'delete' && selectedPlan && (
        <Modal title="Confirm Deletion" onClose={() => setModal(null)}>
          <div style={{ padding: '12px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: '#fef2f2', color: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <AlertCircle size={32} />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '8px' }}>Delete Installment Plan?</h3>
            <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '32px' }}>
              Are you sure you want to delete the plan for <strong>{selectedPlan.client}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-ghost" style={{ flex: 1, height: '48px', borderRadius: '12px' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-danger" style={{ flex: 1, height: '48px', borderRadius: '12px' }} onClick={handleDelete}>Delete Permanently</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
