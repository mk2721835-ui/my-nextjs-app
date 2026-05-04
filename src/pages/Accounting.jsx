import { useState, useEffect, createElement } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts'
import Modal from '../components/Modal'
import { invoices, monthlyRevenue, users } from '../data'
import { useToast } from '../App'
import { 
  Wallet, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus, 
  Download, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ArrowUpRight, 
  ArrowDownRight,
  Receipt,
  FileText,
  CreditCard,
  User,
  Activity,
  History,
  ShieldCheck,
  Zap,
  MoreVertical,
  ChevronRight,
  ArrowRight,
  Eye
} from 'lucide-react'

const STATUS_META = {
  Paid:    { color: '#10B981', icon: CheckCircle, label: 'Success' },
  Pending: { color: '#F59E0B', icon: Clock, label: 'Pending' },
  Overdue: { color: '#EF4444', icon: AlertCircle, label: 'Critical' }
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

// ── Creative Invoice Card ─────────────────────────────────────────────
function CreativeInvoiceCard({ invoice, onView, onCollect }) {
  const [hovered, setHovered] = useState(false)
  const meta = STATUS_META[invoice.status] || STATUS_META.Pending
  const StatusIcon = meta.icon
  const paidPct = Math.round((invoice.paid / invoice.total) * 100)

  return (
    <div 
      className="glass-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: '24px',
        borderRadius: '32px',
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: hovered ? 'translateY(-10px)' : 'translateY(0)',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: hovered 
          ? `0 30px 60px -12px ${meta.color}20` 
          : '0 4px 20px -5px rgba(0,0,0,0.05)',
        overflow: 'hidden',
        borderTop: `4px solid ${meta.color}`
      }}
      onClick={() => onView(invoice)}
    >
      {/* Mesh Background Glow */}
      <div style={{
        position: 'absolute',
        bottom: '-40px',
        right: '-40px',
        width: '120px',
        height: '120px',
        background: `radial-gradient(circle, ${meta.color}15 0%, transparent 70%)`,
        borderRadius: '50%',
        transition: 'all 0.5s',
        transform: hovered ? 'scale(2)' : 'scale(1)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '13px', fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace' }}>{invoice.id}</span>
            {invoice.isNew && (
              <span className="badge-new" style={{ fontSize: '9px', padding: '2px 8px', borderRadius: '6px' }}>NEW</span>
            )}
          </div>
          <div style={{ fontSize: '16px', fontWeight: 950, color: '#0f172a', marginTop: '4px' }}>{invoice.client}</div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          borderRadius: '12px',
          background: `${meta.color}15`,
          color: meta.color,
          fontSize: '11px',
          fontWeight: 900,
          textTransform: 'uppercase'
        }}>
          <StatusIcon size={14} /> {invoice.status}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px' }}>{invoice.type}</span>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '4px 10px', borderRadius: '8px' }}>{invoice.date}</span>
      </div>

      {/* Financial Box */}
      <div style={{ 
        background: '#f8fafc', 
        borderRadius: '24px', 
        padding: '20px', 
        border: '1px solid #f1f5f9',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>GROSS TOTAL</div>
            <div style={{ fontSize: '24px', fontWeight: 950, color: '#0f172a' }}>
              <span style={{ fontSize: '14px', color: '#64748b', marginRight: '4px' }}>SAR</span>
              {invoice.total.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>RECEIVED</div>
            <div style={{ fontSize: '18px', fontWeight: 950, color: invoice.paid === invoice.total ? '#10b981' : '#f59e0b' }}>
              {invoice.paid.toLocaleString()}
            </div>
          </div>
        </div>

        {invoice.status !== 'Paid' && (
          <>
            <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '6px' }}>
              <div style={{ width: `${paidPct}%`, height: '100%', background: meta.color, borderRadius: '3px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 800, color: '#64748b' }}>
              <span>{paidPct}% Collected</span>
              <span style={{ color: '#ef4444' }}>SAR {(invoice.total - invoice.paid).toLocaleString()} Due</span>
            </div>
          </>
        )}
      </div>

      {/* Action Reveal */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(12px)',
        height: hovered ? '64px' : '0px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        opacity: hovered ? 1 : 0,
        zIndex: 2,
        padding: hovered ? '0 24px' : '0'
      }} onClick={e => e.stopPropagation()}>
        <button className="btn btn-primary btn-sm" style={{ flex: 1, borderRadius: '16px', height: '40px', gap: '8px' }} onClick={() => onView(invoice)}>
          <FileText size={16} /> View Details
        </button>
        {invoice.status !== 'Paid' && (
          <button className="btn btn-success btn-sm" style={{ flex: 1, borderRadius: '16px', height: '40px', gap: '8px' }} onClick={() => onCollect(invoice)}>
            <Wallet size={16} /> Collect
          </button>
        )}
      </div>
    </div>
  )
}

export default function Accounting() {
  const toast = useToast()
  const [tab, setTab]               = useState('invoices')
  const [search, setSearch]         = useState('')
  const [modal, setModal]           = useState(null)
  const [selected, setSelected]     = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [viewMode, setViewMode]     = useState('grid')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const switchTab = id => { setTab(id); setViewMode('grid'); setStatusFilter('All'); setSearch('') }

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((s, i) => s + i.paid, 0)
  const totalPending = invoices.filter(i => i.status === 'Pending').reduce((s, i) => s + i.total, 0)
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((s, i) => s + (i.total - i.paid), 0)

  const filtered = invoices.filter(inv => {
    const matchStatus = statusFilter === 'All' || inv.status === statusFilter
    const matchSearch = inv.id.toLowerCase().includes(search.toLowerCase()) ||
      inv.client.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const openView     = inv => { setSelected(inv); setModal('view') }
  const handleMarkPaid = () => {
    toast(`Invoice ${selected.id} marked as Paid — SAR ${selected.total.toLocaleString()} collected`, 'success')
    setModal(null)
  }
  const handleExportPDF = inv => toast(`Invoice ${inv.id} exported as PDF`, 'info')

  const financialData  = monthlyRevenue.map(m => ({ ...m, profit: m.revenue - m.expenses }))
  const fTotalRevenue  = monthlyRevenue.reduce((s, m) => s + m.revenue, 0)
  const fTotalExpenses = monthlyRevenue.reduce((s, m) => s + m.expenses, 0)
  const fTotalProfit   = fTotalRevenue - fTotalExpenses

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease' }}>
      {/* Premium Header */}
      <div className="page-header" style={{ marginBottom: '40px' }}>
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            background: 'rgba(16, 185, 129, 0.1)',
            padding: '6px 16px',
            borderRadius: '99px',
            width: 'fit-content',
            marginBottom: '12px',
            fontSize: '12px',
            fontWeight: 800,
            color: '#10b981',
            letterSpacing: '1px'
          }}>
            <ShieldCheck size={14} /> FINANCIAL GOVERNANCE
          </div>
          <h1 className="page-title" style={{ fontSize: '36px', fontWeight: 950, letterSpacing: '-1.5px' }}>
            Accounting Control
          </h1>
          <p className="page-subtitle" style={{ fontSize: '15px', marginTop: '4px', opacity: 0.7 }}>
            Real-time fiscal monitoring, field invoice orchestration, and revenue analytics.
          </p>
        </div>
        <div className="page-header-actions" style={{ gap: '16px' }}>
          <button className="btn btn-ghost" onClick={() => toast('Financial report exported', 'success')} style={{ borderRadius: '18px', padding: '12px 24px', gap: '8px' }}>
            <Download size={18} /> Export Records
          </button>
          <button className="btn btn-success" onClick={() => setModal('pay_tech')} style={{ 
            borderRadius: '18px', 
            padding: '12px 24px', 
            background: '#10b981',
            color: 'white',
            border: 'none',
            gap: '8px'
          }}>
            <Wallet size={18} /> Pay Technician
          </button>
          <button className="btn btn-primary" onClick={() => setModal('create')} style={{ 
            borderRadius: '18px', 
            padding: '14px 32px', 
            background: '#0f172a',
            border: 'none',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)',
            gap: '10px'
          }}>
            <Plus size={20} /> Create Invoice
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {[
          { label:'Capital Collected', val:totalRevenue, icon:CheckCircle, color:'#10B981', filter:'Paid' },
          { label:'Pending Revenue',  val:totalPending, icon:Clock, color:'#F59E0B', filter:'Pending' },
          { label:'Critical Overdue',  val:totalOverdue, icon:AlertCircle, color:'#EF4444', filter:'Overdue' },
        ].map((s, idx) => (
          <div key={s.label} 
            className="glass-card" 
            onClick={() => { switchTab('invoices'); setStatusFilter(s.filter) }}
            style={{ 
              padding: '24px', 
              borderRadius: '28px', 
              cursor: 'pointer', 
              transition: 'all 0.3s',
              borderLeft: `6px solid ${s.color}`,
              animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both`
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ background: `${s.color}15`, color: s.color, width: '40px', height: '40px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <s.icon size={20} />
              </div>
              <span style={{ fontSize: '10px', fontWeight: 900, color: s.color, background: `${s.color}10`, padding: '4px 10px', borderRadius: '8px' }}>{s.filter.toUpperCase()}</span>
            </div>
            <div style={{ fontSize: '24px', fontWeight: 950, color: '#0f172a', letterSpacing: '-0.5px' }}>SAR {s.val.toLocaleString()}</div>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', marginTop: '4px' }}>{s.label}</div>
            <div style={{ marginTop: '12px', fontSize: '10px', fontWeight: 900, color: s.color, display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', opacity: 0.8 }}>
              VIEW DETAILS <ArrowRight size={12} />
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Nav & Filter Bar */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '32px',
        padding: '12px',
        background: '#f8fafc',
        borderRadius: '24px',
        border: '1px solid #e2e8f0',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id:'invoices', label:'Invoice Ledger', icon: FileText },
            { id:'payments', label:'Payment Log',    icon: Receipt },
            { id:'reports',  label:'Fiscal Reports', icon: TrendingUp },
          ].map(t => (
            <button key={t.id} 
              onClick={() => switchTab(t.id)}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'flex-end' }}>
          {tab === 'invoices' && (
            <div className="search-input-wrap" style={{ minWidth: '240px', background: 'white', borderRadius: '16px', padding: '10px 18px' }}>
              <Search size={18} color="#94a3b8" />
              <input placeholder="Search client or ID..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontWeight: 600 }} />
            </div>
          )}
          <VTog mode={viewMode} setMode={setViewMode} />
        </div>
      </div>

      {/* ── INVOICES TAB ── */}
      {tab === 'invoices' && (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: 800, color: '#64748b', marginRight: '12px' }}>
              <Filter size={14} /> STATUS
            </div>
            {['All', 'Paid', 'Pending', 'Overdue'].map(s => (
              <button key={s} 
                onClick={() => setStatusFilter(s)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 800,
                  transition: 'all 0.3s',
                  background: statusFilter === s ? '#0f172a' : 'white',
                  color: statusFilter === s ? 'white' : '#64748b',
                  border: '1px solid #e2e8f0'
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '32px' }}>
              {filtered.map((inv, idx) => (
                <div key={inv.id} style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
                  <CreativeInvoiceCard invoice={inv} onView={openView} onCollect={i => { setSelected(i); setModal('payment') }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="table-container" style={{ borderRadius: '32px', border: '1px solid #e2e8f0', background: 'white', overflow: 'hidden' }}>
              <table className="table">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '24px' }}>IDENTIFIER</th>
                    <th>CLIENT IDENTITY</th>
                    <th>FISCAL STATUS</th>
                    <th>VALUATION</th>
                    <th>COLLECTED</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(inv => {
                    const meta = STATUS_META[inv.status] || STATUS_META.Pending
                    return (
                      <tr key={inv.id} style={{ cursor: 'pointer' }} onClick={() => openView(inv)}>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace', fontSize: '15px' }}>{inv.id}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{inv.date}</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{inv.client}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{inv.tech || 'Office Ops'}</div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: `${meta.color}15`, color: meta.color, padding: '6px 12px', borderRadius: '10px', width: 'fit-content', fontSize: '11px', fontWeight: 900 }}>
                            {createElement(meta.icon, { size: 14 })} {inv.status.toUpperCase()}
                          </div>
                        </td>
                        <td style={{ fontWeight: 950, fontSize: '16px', color: '#0f172a' }}>
                          <span style={{ fontSize: '12px', color: '#94a3b8', marginRight: '4px' }}>SAR</span>
                          {inv.total.toLocaleString()}
                        </td>
                        <td style={{ fontWeight: 800, fontSize: '15px', color: inv.paid === inv.total ? '#10b981' : '#f59e0b' }}>
                          {inv.paid.toLocaleString()}
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <div className="table-actions">
                            <button className="btn btn-ghost btn-sm" onClick={() => openView(inv)}><Eye size={16} /></button>
                            <button className="btn btn-ghost btn-sm" onClick={() => handleExportPDF(inv)}><Download size={16} /></button>
                            {inv.status !== 'Paid' && (
                              <button className="btn btn-success btn-sm" style={{ borderRadius: '10px' }} onClick={() => { setSelected(inv); setModal('payment') }}>
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
        </>
      )}

      {/* ── PAYMENTS TAB ── */}
      {tab === 'payments' && (
        <>
          {viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '24px' }}>
              {invoices.filter(i => i.paid > 0).map((inv, idx) => (
                <div key={`${inv.id}-pay`} className="glass-card" onClick={() => openView(inv)} style={{ cursor: 'pointer', padding: '24px', borderRadius: '24px', animation: `fadeIn 0.4s ease-out ${idx * 0.05}s both`, borderLeft: `6px solid ${inv.paid === inv.total ? '#10b981' : '#3b82f6'}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <div style={{ fontWeight: 950, color: '#0f172a', fontSize: '16px' }}>{inv.client}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{inv.id} · {inv.date}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: inv.paid === inv.total ? '#10b98115' : '#3b82f615', color: inv.paid === inv.total ? '#10b981' : '#3b82f6', padding: '6px 12px', borderRadius: '10px', fontSize: '10px', fontWeight: 900, alignSelf: 'flex-start' }}>
                      {inv.paid === inv.total ? 'SETTLED' : 'PENDING'}
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>AMOUNT COLLECTED</div>
                      <div style={{ fontWeight: 950, fontSize: '20px', color: '#10b981' }}>SAR {inv.paid.toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '6px' }}>METHOD</div>
                      <div style={{ fontWeight: 800, fontSize: '13px', color: '#475569', display: 'flex', alignItems: 'center', gap: '6px', justifyContent: 'flex-end' }}>
                        {inv.method === 'Cash' ? <DollarSign size={14} color="#10b981" /> : <CreditCard size={14} color="#3b82f6" />} 
                        {inv.method || 'Bank Transfer'}
                      </div>
                    </div>
                  </div>
                  <button className="btn btn-ghost" style={{ width: '100%', height: '40px', borderRadius: '12px', fontSize: '12px', gap: '8px' }} onClick={(e) => { e.stopPropagation(); openView(inv); }}>
                    <Eye size={16} /> View Receipt
                  </button>
                </div>
              ))}
              {invoices.filter(i => i.paid > 0).length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#94a3b8', fontWeight: 800, background: 'white', borderRadius: '24px' }}>No payments have been logged yet.</div>
              )}
            </div>
          ) : (
            <div className="table-container" style={{ borderRadius: '32px', border: '1px solid #e2e8f0', background: 'white', overflow: 'hidden', animation: 'fadeIn 0.5s ease-out' }}>
              <table className="table">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '24px' }}>REFERENCE</th>
                    <th>CLIENT</th>
                    <th>AMOUNT COLLECTED</th>
                    <th>PAYMENT METHOD</th>
                    <th>SETTLEMENT STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {invoices.filter(i => i.paid > 0).map((inv, idx) => (
                    <tr key={`${inv.id}-pay`} style={{ animation: `fadeIn 0.4s ease-out ${idx * 0.05}s both`, cursor: 'pointer' }} onClick={() => openView(inv)}>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace', fontSize: '15px' }}>{inv.id}</div>
                        <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{inv.date}</div>
                      </td>
                      <td>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{inv.client}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>Processed by: {inv.tech || 'Office Admin'}</div>
                      </td>
                      <td style={{ fontWeight: 950, fontSize: '16px', color: '#10b981' }}>
                        <span style={{ fontSize: '12px', color: '#94a3b8', marginRight: '4px' }}>SAR</span>
                        {inv.paid.toLocaleString()}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#475569', fontSize: '13px' }}>
                          {inv.method === 'Cash' ? <DollarSign size={16} color="#10b981" /> : <CreditCard size={16} color="#3b82f6" />} 
                          {inv.method || 'Bank Transfer'}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: inv.paid === inv.total ? '#10b98115' : '#3b82f615', color: inv.paid === inv.total ? '#10b981' : '#3b82f6', padding: '6px 12px', borderRadius: '10px', width: 'fit-content', fontSize: '11px', fontWeight: 900 }}>
                          {inv.paid === inv.total ? <CheckCircle size={14} /> : <Activity size={14} />} 
                          {inv.paid === inv.total ? 'SETTLED' : 'PENDING'}
                        </div>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <button className="btn btn-ghost btn-sm" onClick={() => openView(inv)}>
                          <Eye size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {invoices.filter(i => i.paid > 0).length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontWeight: 800 }}>No payments have been logged yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── REPORTS TAB ── */}
      {tab === 'reports' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
          <div className="glass-card" style={{ padding: '32px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 950, margin: 0 }}>Revenue Dynamics</h3>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#3b82f6', background: '#3b82f615', padding: '6px 14px', borderRadius: '10px' }}>LAST 6 MONTHS</div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={financialData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} tickFormatter={v => `${v/1000}k`} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card" style={{ padding: '32px', borderRadius: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 950, margin: 0 }}>Fiscal Comparison</h3>
              <button className="btn btn-ghost btn-sm" style={{ borderRadius: '12px' }}>Full Report</button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={financialData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 700, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="revenue" fill="#10B981" radius={[8, 8, 0, 0]} barSize={20} />
                <Bar dataKey="expenses" fill="#EF4444" radius={[8, 8, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ── MODALS ── */}
      {modal === 'view' && selected && (
        <Modal title={`Invoice Manifest: ${selected.id}`} onClose={() => setModal(null)} size="lg"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Dismiss</button>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => handleExportPDF(selected)}>
                <Download size={18} style={{ marginRight: '8px' }} /> Export PDF
              </button>
              {selected.status !== 'Paid' && (
                <button className="btn btn-success" style={{ borderRadius: '16px', background: '#10b981', gap: '8px' }} onClick={() => setModal('payment')}>
                  <Wallet size={18} /> Collect SAR {(selected.total - selected.paid).toLocaleString()}
                </button>
              )}
            </>
          }
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px', background: '#0f172a', padding: '32px', borderRadius: '32px', color: 'white' }}>
            <div>
              <div style={{ fontSize: '32px', fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace' }}>{selected.id}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, opacity: 0.6, marginTop: '4px' }}>ISSUED ON {selected.date.toUpperCase()}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ background: STATUS_META[selected.status].color + '20', color: STATUS_META[selected.status].color, padding: '10px 24px', borderRadius: '14px', fontSize: '14px', fontWeight: 900, textTransform: 'uppercase' }}>
                {selected.status}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>CLIENT ACCOUNT</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <User size={20} color="#3b82f6" /> {selected.client}
              </div>
            </div>
            <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>ORIGINATING OFFICER</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#10b981" /> {selected.tech || 'Office HQ'}
              </div>
            </div>
          </div>

          <div style={{ background: '#f8fafc', borderRadius: '32px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f1f5f9' }}>
                  <th style={{ padding: '20px 24px', textAlign: 'left', fontSize: '11px', fontWeight: 900 }}>LINE ITEM</th>
                  <th style={{ padding: '20px 24px', textAlign: 'center', fontSize: '11px', fontWeight: 900 }}>QTY</th>
                  <th style={{ padding: '20px 24px', textAlign: 'right', fontSize: '11px', fontWeight: 900 }}>UNIT VALUATION</th>
                  <th style={{ padding: '20px 24px', textAlign: 'right', fontSize: '11px', fontWeight: 900 }}>SUBTOTAL</th>
                </tr>
              </thead>
              <tbody>
                {selected.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '16px 24px', fontWeight: 700, color: '#334155' }}>{item.name}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'center', fontWeight: 800, color: '#64748b' }}>{item.qty}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 700, color: '#64748b' }}>SAR {item.unit.toLocaleString()}</td>
                    <td style={{ padding: '16px 24px', textAlign: 'right', fontWeight: 900, color: '#0f172a' }}>SAR {(item.qty * item.unit).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '32px', background: '#f8fafc', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ width: '280px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#64748b' }}>GROSS TOTAL</span>
                  <span style={{ fontSize: '14px', fontWeight: 950, color: '#0f172a' }}>SAR {selected.total.toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#10b981' }}>TOTAL COLLECTED</span>
                  <span style={{ fontSize: '14px', fontWeight: 950, color: '#10b981' }}>SAR {selected.paid.toLocaleString()}</span>
                </div>
                <div style={{ height: '1px', background: '#e2e8f0', margin: '16px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '16px', fontWeight: 950, color: '#0f172a' }}>NET BALANCE</span>
                  <span style={{ fontSize: '20px', fontWeight: 950, color: selected.paid === selected.total ? '#10b981' : '#ef4444' }}>
                    SAR {(selected.total - selected.paid).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'payment' && selected && (
        <Modal title="Recalibrate Account Balance" onClose={() => setModal(null)} size="sm"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-success" style={{ borderRadius: '16px', background: '#10b981', gap: '8px' }} onClick={handleMarkPaid}>
                <CheckCircle size={18} /> Confirm Collection
              </button>
            </>
          }
        >
          <div style={{ textAlign: 'center', padding: '24px 0', background: '#f8fafc', borderRadius: '24px', marginBottom: '24px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#10b98115', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CreditCard size={32} />
            </div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>OUTSTANDING BALANCE</div>
            <div style={{ fontSize: '32px', fontWeight: 950, color: '#10b981' }}>SAR {(selected.total - selected.paid).toLocaleString()}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#475569', marginTop: '8px' }}>{selected.client}</div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>COLLECTION PROTOCOL</label>
            <select className="form-control form-select" style={{ borderRadius: '14px', fontWeight: 600 }}>
              <option>Cash (Physical Currency)</option>
              <option>Bank Wire Transfer</option>
              <option>Digital Credit/Debit</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>AMOUNT TO RECONCILE (SAR)</label>
            <input className="form-control" style={{ borderRadius: '14px', fontWeight: 950, fontSize: '18px', padding: '12px 18px' }} type="number" defaultValue={selected.total - selected.paid} />
          </div>
        </Modal>
      )}

      {modal === 'create' && (
        <Modal title="Generate Fiscal Manifest" onClose={() => setModal(null)} size="lg"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a', gap: '8px' }} onClick={() => { toast('Invoice Generated', 'success'); setModal(null) }}>
                <Zap size={18} /> Initialize Invoice
              </button>
            </>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>CLIENT ACCOUNT</label>
              <select className="form-control form-select" style={{ borderRadius: '16px', fontWeight: 600 }}><option>Select account...</option></select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>REVENUE STREAM</label>
              <select className="form-control form-select" style={{ borderRadius: '16px', fontWeight: 600 }}>
                <option>Infrastructure Sales</option>
                <option>Maintenance Contracts</option>
                <option>Subscription Installments</option>
              </select>
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a' }}>LEDGER ITEMS</div>
              <button className="btn btn-ghost btn-sm" style={{ borderRadius: '10px' }}>+ New Entry</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1fr 40px', gap: '16px', alignItems: 'center' }}>
                <input className="form-control" style={{ borderRadius: '12px' }} placeholder="Technical Specification / Service" />
                <input className="form-control" style={{ borderRadius: '12px', textAlign: 'center' }} type="number" defaultValue={1} />
                <input className="form-control" style={{ borderRadius: '12px' }} placeholder="SAR Value" />
                <button className="btn btn-danger btn-sm" style={{ borderRadius: '8px', padding: 0, height: '32px' }}>✕</button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* ── PAY TECHNICIAN MODAL ── */}
      {modal === 'pay_tech' && (
        <Modal title="Dispatch Salary / Commission" onClose={() => setModal(null)} size="md"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-success" style={{ borderRadius: '16px', background: '#10b981', gap: '8px', border: 'none' }} onClick={() => { toast('Funds transferred to Technician', 'success'); setModal(null) }}>
                <CheckCircle size={18} /> Confirm Dispatch
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '16px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px', fontWeight: 800 }}>SELECT TECHNICIAN</label>
              <select className="form-control form-select" style={{ borderRadius: '16px', fontWeight: 800, background: '#f8fafc', border: '1px solid #e2e8f0', height: '48px', padding: '0 16px' }}>
                <option>Select a technician...</option>
                {users.filter(u => u.role === 'Technician').map(t => (
                  <option key={t.id}>{t.name}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px', fontWeight: 800 }}>AMOUNT (SAR)</label>
                <input className="form-control" type="number" placeholder="0.00" style={{ borderRadius: '16px', fontWeight: 900, fontSize: '18px', height: '48px', border: '1px solid #e2e8f0', padding: '0 16px' }} />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px', fontWeight: 800 }}>TRANSFER METHOD</label>
                <select className="form-control form-select" style={{ borderRadius: '16px', fontWeight: 800, background: '#f8fafc', border: '1px solid #e2e8f0', height: '48px', padding: '0 16px' }}>
                  <option>Bank Transfer (IBAN)</option>
                  <option>Prepaid Salary Card</option>
                  <option>Cash Dispense</option>
                </select>
              </div>
            </div>

            <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '16px', border: '1px solid #fef3c7', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <AlertCircle size={24} color="#f59e0b" />
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#92400e' }}>
                <span style={{ fontWeight: 800, display: 'block', marginBottom: '2px' }}>Account Notice:</span>
                Dispatching funds will immediately deduct from the corporate operating ledger. Ensure amount and method are verified.
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
