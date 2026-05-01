import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { installmentPlans, users } from '../data'
import { useToast } from '../App'
import { 
  CreditCard, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ArrowRight, 
  User, 
  Package, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Zap, 
  TrendingUp, 
  Shield, 
  Wallet,
  Activity,
  Send,
  MoreVertical,
  ChevronRight,
  DollarSign
} from 'lucide-react'

const STATUS_META = {
  Active:    { color: '#3B82F6', icon: Activity, label: 'Active' },
  Completed: { color: '#10B981', icon: CheckCircle, label: 'Full' },
  Overdue:   { color: '#EF4444', icon: AlertCircle, label: 'Delinquent' },
  Paused:    { color: '#F59E0B', icon: Clock, label: 'On Hold' }
}

function VTog({ mode, setMode }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: '#e2e8f0', borderRadius: '16px', padding: '4px' }}>
      {[
        { id: 'grid', icon: LayoutGrid, label: 'Cards' },
        { id: 'table', icon: List, label: 'List' }
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

// ── Creative Installment Card ──────────────────────────────────────────
function CreativeInstallmentCard({ plan, onView, onRecordPayment }) {
  const [hovered, setHovered] = useState(false)
  const meta = STATUS_META[plan.status] || STATUS_META.Active
  const StatusIcon = meta.icon
  const pct = Math.round((plan.paid / plan.totalAmount) * 100)
  const isOverdue = plan.status === 'Overdue'

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
          ? `0 30px 60px -12px ${meta.color}20` 
          : '0 4px 20px -5px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        background: hovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.8)',
      }}
      onClick={() => onView(plan)}
    >
      {/* Visual Identity Ring */}
      <div style={{
        position: 'absolute',
        top: '-20px',
        right: '-20px',
        width: '100px',
        height: '100px',
        border: `12px solid ${meta.color}08`,
        borderRadius: '50%',
        zIndex: 0
      }} />

      {/* Top Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            borderRadius: '14px', 
            background: meta.color, 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: `0 10px 20px ${meta.color}30`
          }}>
            <StatusIcon size={24} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 950, color: '#0f172a' }}>{plan.client}</div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8' }}>{plan.id}</div>
          </div>
        </div>
        <div style={{
          background: isOverdue ? '#ef4444' : '#f1f5f9',
          color: isOverdue ? 'white' : '#64748b',
          fontSize: '10px',
          fontWeight: 900,
          padding: '4px 12px',
          borderRadius: '99px',
          letterSpacing: '0.5px'
        }}>
          {plan.status.toUpperCase()}
        </div>
      </div>

      {/* Asset Description */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative', zIndex: 1 }}>
        <Package size={14} color="#94a3b8" />
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>{plan.product}</span>
      </div>

      {/* Financial Health Box */}
      <div style={{ 
        background: isOverdue ? '#fff5f5' : '#f8fafc', 
        padding: '20px', 
        borderRadius: '24px', 
        border: `1px solid ${isOverdue ? '#feb2b2' : '#f1f5f9'}`,
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>REPAYMENT FLOW</div>
            <div style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8', marginRight: '2px' }}>SAR</span>
              {plan.paid.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>REMAINING</div>
            <div style={{ fontSize: '20px', fontWeight: 950, color: isOverdue ? '#ef4444' : '#0f172a' }}>
              {plan.remaining.toLocaleString()}
            </div>
          </div>
        </div>
        
        {/* Progress System */}
        <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '8px' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: meta.color, borderRadius: '4px', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 800, color: '#64748b' }}>
          <span>{pct}% PROTOCOL COMPLETED</span>
          <span>{plan.paymentsCompleted}/{plan.paymentsTotal} STAGES</span>
        </div>
      </div>

      {/* Monthly Installment Pulse */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={16} color="#3b82f6" />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 950, color: '#0f172a' }}>SAR {plan.monthlyPayment.toLocaleString()}</div>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8' }}>MONTHLY REVENUE</div>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '11px', fontWeight: 900, color: isOverdue ? '#ef4444' : '#0f172a' }}>{plan.nextDue || 'N/A'}</div>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8' }}>NEXT PAYMENT</div>
        </div>
      </div>

      {/* Action Hover Reveal */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(15, 23, 42, 0.95)',
        backdropFilter: 'blur(10px)',
        height: hovered ? '64px' : '0px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '24px',
        opacity: hovered ? 1 : 0,
        zIndex: 2,
      }} onClick={e => e.stopPropagation()}>
        <button onClick={() => onView(plan)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800 }}>
          <Clock size={16} /> SCHEDULE
        </button>
        {plan.status !== 'Completed' && (
          <button onClick={() => onRecordPayment(plan)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800 }}>
            <Wallet size={16} /> COLLECT
          </button>
        )}
      </div>
    </div>
  )
}

export default function Installments() {
  const toast = useToast()
  const [tab, setTab]           = useState('plans')
  const [modal, setModal]       = useState(null)
  const [selected, setSelected] = useState(null)
  const [search, setSearch]     = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const totalActive    = installmentPlans.filter(p => p.status === 'Active').length
  const totalCollected = installmentPlans.reduce((s, p) => s + p.paid, 0)
  const totalPending   = installmentPlans.filter(p => p.status !== 'Completed').reduce((s, p) => s + p.remaining, 0)
  const totalOverdue   = installmentPlans.filter(p => p.status === 'Overdue').length

  const filtered = installmentPlans.filter(p => {
    const matchSearch = p.client.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()) || p.product.toLowerCase().includes(search.toLowerCase())
    const matchTab    = tab === 'plans' || (tab === 'overdue' && p.status === 'Overdue') || (tab === 'completed' && p.status === 'Completed')
    return matchSearch && matchTab
  })

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
            <Shield size={14} /> CREDIT GOVERNANCE
          </div>
          <h1 className="page-title" style={{ fontSize: '36px', fontWeight: 950, letterSpacing: '-1.5px' }}>
            Installment Capital
          </h1>
          <p className="page-subtitle" style={{ fontSize: '15px', marginTop: '4px', opacity: 0.7 }}>
            Orchestrating {installmentPlans.length} payment cycles with real-time exposure monitoring.
          </p>
        </div>
        <div className="page-header-actions" style={{ gap: '16px' }}>
          <button className="btn btn-ghost" onClick={() => toast('Reminders deployed', 'success')} style={{ borderRadius: '18px', padding: '12px 24px', gap: '10px' }}>
            <Send size={18} /> Bulk Reminders
          </button>
          <button className="btn btn-primary" onClick={() => setModal('create')} style={{ 
            borderRadius: '18px', 
            padding: '14px 32px', 
            background: '#0f172a',
            border: 'none',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)',
            gap: '10px'
          }}>
            <Plus size={20} /> Initialize Plan
          </button>
        </div>
      </div>

      {/* Critical Exposure Alert */}
      {totalOverdue > 0 && (
        <div className="mesh-glow" style={{ 
          padding: '20px 32px', 
          borderRadius: '32px', 
          marginBottom: '40px',
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          color: 'white',
          boxShadow: '0 20px 40px -10px rgba(239, 68, 68, 0.3)',
          cursor: 'pointer'
        }} onClick={() => setTab('overdue')}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '14px', borderRadius: '18px' }}>
            <Shield size={28} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 950, fontSize: '18px' }}>Risk Management Alert</div>
            <div style={{ opacity: 0.8, fontSize: '14px', fontWeight: 600 }}>{totalOverdue} payment cycles have exceeded the settlement threshold. Immediate intervention required.</div>
          </div>
          <button className="btn btn-white btn-sm" style={{ borderRadius: '12px', fontWeight: 900 }}>RECONCILE NOW</button>
        </div>
      )}

      {/* Capital Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: 'Active Protocols', val: totalActive, icon: Activity, color: '#3B82F6' },
          { label: 'Capital Recovered', val: `SAR ${totalCollected.toLocaleString()}`, icon: TrendingUp, color: '#10B981' },
          { label: 'Pending Receivables', val: `SAR ${totalPending.toLocaleString()}`, icon: Wallet, color: '#F59E0B' },
          { label: 'High-Risk Plans', val: totalOverdue, icon: AlertCircle, color: '#EF4444' },
        ].map((s, idx) => (
          <div key={s.label} className="glass-card" style={{ padding: '28px', borderRadius: '28px', animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
            <div style={{ background: `${s.color}15`, color: s.color, width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <s.icon size={22} />
            </div>
            <div style={{ fontSize: '24px', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.5px' }}>{s.val}</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', marginTop: '4px' }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div style={{ 
        display: 'flex', 
        gap: '24px', 
        alignItems: 'center', 
        marginBottom: '40px',
        background: '#f8fafc',
        padding: '12px',
        borderRadius: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id:'plans',     label:'Entire Ledger', count:installmentPlans.length },
            { id:'overdue',   label:'High Risk',     count:totalOverdue },
            { id:'completed', label:'Settled',       count:installmentPlans.filter(p=>p.status==='Completed').length },
          ].map(t => (
            <button key={t.id} 
              onClick={() => { setTab(t.id); setViewMode('grid') }}
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
              <span style={{ marginLeft: '8px', background: tab === t.id ? '#0f172a' : '#e2e8f0', color: tab === t.id ? 'white' : '#64748b', padding: '2px 8px', borderRadius: '8px', fontSize: '10px' }}>{t.count}</span>
            </button>
          ))}
        </div>

        <div className="search-input-wrap" style={{ flex: 1, minWidth: '300px', background: 'white', borderRadius: '18px', padding: '10px 18px' }}>
          <Search size={18} color="#94a3b8" />
          <input placeholder="Filter client identity or asset ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontWeight: 600 }} />
        </div>
        
        <VTog mode={viewMode} setMode={setViewMode} />
      </div>

      {/* Main Grid */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '32px' }}>
          {filtered.map((plan, idx) => (
            <div key={plan.id} style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
              <CreativeInstallmentCard 
                plan={plan} 
                onView={p => { setSelected(p); setModal('view') }}
                onRecordPayment={p => toast(`Collect SAR ${p.monthlyPayment}`, 'info')}
              />
            </div>
          ))}
          <div 
            className="glass-card" 
            style={{ 
              border: '2px dashed #e2e8f0', 
              background: 'transparent', 
              borderRadius: '32px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '340px',
              cursor: 'pointer'
            }}
            onClick={() => setModal('create')}
          >
            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Plus size={40} />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a' }}>New Protocol</div>
              <div style={{ fontSize: '13px', marginTop: '8px', fontWeight: 600 }}>Initialize a multi-cycle payment plan</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="table-container" style={{ borderRadius: '32px', border: '1px solid #e2e8f0', background: 'white', overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '24px' }}>PROTOCOL ID</th>
                <th>CLIENT IDENTITY</th>
                <th>ASSET TYPE</th>
                <th>VALUATION</th>
                <th>SETTLED</th>
                <th>CYCLE PROGRESS</th>
                <th>NEXT CYCLE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const meta = STATUS_META[p.status] || STATUS_META.Active
                const pct = Math.round((p.paid / p.totalAmount) * 100)
                return (
                  <tr key={p.id} style={{ cursor: 'pointer' }} onClick={() => { setSelected(p); setModal('view') }}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace', fontSize: '15px' }}>{p.id}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>PLAN INITIATED</div>
                    </td>
                    <td>
                      <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{p.client}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>VERIFIED PARTNER</div>
                    </td>
                    <td style={{ fontWeight: 700, color: '#475569', fontSize: '13px' }}>{p.product}</td>
                    <td style={{ fontWeight: 950, fontSize: '16px', color: '#0f172a' }}>
                      <span style={{ fontSize: '12px', color: '#94a3b8', marginRight: '4px' }}>SAR</span>
                      {p.totalAmount.toLocaleString()}
                    </td>
                    <td style={{ fontWeight: 800, fontSize: '15px', color: '#10b981' }}>{p.paid.toLocaleString()}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '60px', height: '6px', background: '#f1f5f9', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: meta.color, borderRadius: '3px' }} />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 900, color: meta.color }}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{ fontSize: '12px', fontWeight: 800, color: p.status === 'Overdue' ? '#ef4444' : '#0f172a' }}>
                      {p.nextDue || 'SETTLED'}
                    </td>
                    <td onClick={e => e.stopPropagation()}>
                      <div className="table-actions">
                        <button className="btn btn-ghost btn-sm" onClick={() => { setSelected(p); setModal('view') }}><Clock size={16} /></button>
                        {p.status !== 'Completed' && (
                          <button className="btn btn-success btn-sm" style={{ borderRadius: '10px' }} onClick={() => toast(`Collect Payment`, 'info')}>
                            <Wallet size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {modal === 'view' && selected && (
        <Modal title={`Installment Schedule Manifest: ${selected.id}`} onClose={() => setModal(null)} size="lg"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Dismiss</button>
              {selected.status !== 'Completed' && (
                <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a', gap: '8px' }} onClick={() => { toast('Payment Processed', 'success'); setModal(null) }}>
                  <CreditCard size={18} /> Record SAR {selected.monthlyPayment.toLocaleString()} Payment
                </button>
              )}
            </>
          }
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px', background: '#0f172a', padding: '32px', borderRadius: '32px', color: 'white' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace' }}>{selected.id}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, opacity: 0.6, marginTop: '4px' }}>PROTOCOL STATUS: {selected.status.toUpperCase()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, opacity: 0.6, letterSpacing: '2px', marginBottom: '8px' }}>CYCLE PROGRESS</div>
              <div style={{ fontSize: '36px', fontWeight: 950, color: '#10b981' }}>{Math.round((selected.paid/selected.totalAmount)*100)}%</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '32px' }}>
            {[
              { label: 'GROSS CONTRACT', val: `SAR ${selected.totalAmount.toLocaleString()}`, color: '#3b82f6' },
              { label: 'TOTAL RECOVERED', val: `SAR ${selected.paid.toLocaleString()}`, color: '#10b981' },
              { label: 'REMAINING EXPOSURE', val: `SAR ${selected.remaining.toLocaleString()}`, color: selected.status === 'Overdue' ? '#ef4444' : '#f59e0b' }
            ].map(i => (
              <div key={i.label} style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>{i.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 950, color: i.color }}>{i.val}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '32px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={20} color="#3b82f6" /> RECENT TRANSACTION LEDGER
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {Array.from({ length: Math.min(selected.paymentsCompleted, 5) }).map((_, i) => (
                <div key={i} style={{ background: 'white', padding: '16px 24px', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#10b98115', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#334155' }}>Payment Cycle #{selected.paymentsCompleted - i}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>VERIFIED TRANSACTION</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 900, color: '#0f172a' }}>SAR {selected.monthlyPayment.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Create Modal */}
      {modal === 'create' && (
        <Modal title="Initialize Credit Protocol" onClose={() => setModal(null)} size="lg"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Abort</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a', gap: '8px' }} onClick={() => { toast('Protocol Initiated', 'success'); setModal(null) }}>
                <Zap size={18} /> Launch Plan
              </button>
            </>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>CLIENT IDENTITY</label>
              <select className="form-control form-select" style={{ borderRadius: '16px', fontWeight: 600 }}>
                <option>Select client account...</option>
                {users.filter(u=>u.role==='Client').map(u=><option key={u.id}>{u.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>ASSET SPECIFICATION</label>
              <input className="form-control" style={{ borderRadius: '16px', fontWeight: 600 }} placeholder="e.g. Industrial Solar Array 20kW" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>GROSS VALUATION (SAR)</label>
              <input className="form-control" style={{ borderRadius: '16px', fontWeight: 900 }} type="number" placeholder="45000" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>INITIAL SETTLEMENT (DOWN PAYMENT)</label>
              <input className="form-control" style={{ borderRadius: '16px', fontWeight: 900 }} type="number" placeholder="5000" />
            </div>
          </div>
          <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '24px', borderRadius: '24px', border: '1px dashed #3b82f6' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#3b82f6', marginBottom: '8px' }}>AUTOMATED REPAYMENT CALCULATION</div>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0, fontWeight: 500 }}>System will automatically generate a recurring schedule based on the selected duration (6-36 months). Client will receive a legally binding digital manifest.</p>
          </div>
        </Modal>
      )}
    </div>
  )
}
