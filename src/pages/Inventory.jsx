import { useState, useEffect, createElement } from 'react'
import Modal from '../components/Modal'
import { spareParts, partsRequests } from '../data'
import { useToast } from '../App'
import { 
  Box, 
  Package, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  AlertTriangle, 
  CheckCircle, 
  Truck, 
  ShoppingCart, 
  TrendingUp, 
  Download, 
  Activity, 
  History, 
  ShieldCheck, 
  Zap, 
  MoreVertical, 
  ArrowRight, 
  Settings, 
  XCircle,
  Eye,
  User,
  ExternalLink,
  ChevronRight,
  ClipboardList,
  Layers
} from 'lucide-react'

const STOCK_META = {
  'In Stock':    { color: '#10B981', icon: CheckCircle, label: 'Optimal' },
  'Low Stock':   { color: '#F59E0B', icon: AlertTriangle, label: 'Warning' },
  'Out of Stock': { color: '#EF4444', icon: XCircle, label: 'Critical' }
}

const CAT_ICON = { 
  Panels: '☀️', Inverters: '⚡', Controllers: '🔋', 'Filter Parts': '💧', 
  Cables: '🔌', Connectors: '🔗', Batteries: '🔋', Monitoring: '📡', Mounting: '🔩' 
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

// ── Creative Inventory Card ──────────────────────────────────────────
function CreativeInventoryCard({ part, onView, onAdjust, onRestock }) {
  const [hovered, setHovered] = useState(false)
  const meta = STOCK_META[part.status] || STOCK_META['In Stock']
  const StatusIcon = meta.icon
  const maxQ = Math.max(part.minQty * 3, 1)
  const pct = Math.min((part.qty / maxQ) * 100, 100)

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
      onClick={() => onView(part)}
    >
      {/* Visual Identity Watermark */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        fontSize: '48px',
        opacity: 0.1,
        userSelect: 'none',
        transform: hovered ? 'scale(1.2) rotate(10deg)' : 'none',
        transition: 'all 0.4s'
      }}>
        {CAT_ICON[part.category] || '📦'}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ 
            fontSize: '11px', 
            fontWeight: 900, 
            color: meta.color, 
            background: `${meta.color}10`,
            padding: '4px 12px',
            borderRadius: '10px',
            width: 'fit-content',
            marginBottom: '8px',
            letterSpacing: '1px'
          }}>
            {meta.label.toUpperCase()}
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', margin: 0, letterSpacing: '-0.5px' }}>{part.name}</h3>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace', marginTop: '2px' }}>{part.code}</div>
        </div>
      </div>

      {/* Stock Level Visualization */}
      <div style={{ 
        background: '#f8fafc', 
        padding: '24px', 
        borderRadius: '24px', 
        border: '1px solid #f1f5f9',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>CURRENT INVENTORY</div>
        <div style={{ fontSize: '48px', fontWeight: 950, color: meta.color, lineHeight: 1 }}>{part.qty}</div>
        <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginTop: '4px' }}>UNITS QUANTIFIED</div>
        
        <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '3px', marginTop: '16px', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: meta.color, borderRadius: '3px', transition: 'width 1s' }} />
        </div>
      </div>

      {/* Pricing and Minimums */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', position: 'relative', zIndex: 1 }}>
        <div>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>UNIT VALUATION</div>
          <div style={{ fontSize: '14px', fontWeight: 900, color: '#0f172a' }}>SAR {part.price}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>MIN THRESHOLD</div>
          <div style={{ fontSize: '14px', fontWeight: 900, color: '#475569' }}>{part.minQty} UNITS</div>
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
        <button onClick={() => onAdjust(part)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800 }}>
          <Settings size={16} /> ADJUST
        </button>
        <button onClick={() => onRestock(part)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800 }}>
          <ShoppingCart size={16} /> RESTOCK
        </button>
      </div>
    </div>
  )
}

export default function Inventory() {
  const toast = useToast()
  const [tab, setTab]             = useState('parts')
  const [modal, setModal]         = useState(null)
  const [selected, setSelected]   = useState(null)
  const [search, setSearch]       = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [reqFilter, setReqFilter] = useState('All')
  const [viewMode, setViewMode]   = useState('grid')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const filtered = spareParts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.code.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'All' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const filteredReqs = partsRequests.filter(r => reqFilter === 'All' || r.status === reqFilter)

  const inStock    = spareParts.filter(p => p.status === 'In Stock').length
  const lowStock   = spareParts.filter(p => p.status === 'Low Stock').length
  const outStock   = spareParts.filter(p => p.status === 'Out of Stock').length
  const pendingReqs = partsRequests.filter(p => p.status === 'Pending').length

  const handleApprove = req => { toast(`Parts request ${req.id} approved`, 'success'); setModal(null) }
  const handleReject  = req => { toast(`Parts request ${req.id} rejected`, 'warning'); setModal(null) }

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
            <Layers size={14} /> ASSET GOVERNANCE
          </div>
          <h1 className="page-title" style={{ fontSize: '36px', fontWeight: 950, letterSpacing: '-1.5px' }}>
            Infrastructure Inventory
          </h1>
          <p className="page-subtitle" style={{ fontSize: '15px', marginTop: '4px', opacity: 0.7 }}>
            Managing {spareParts.length} technical assets across logistics nodes.
          </p>
        </div>
        <div className="page-header-actions" style={{ gap: '16px' }}>
          <button className="btn btn-ghost" onClick={() => toast('Inventory records exported', 'success')} style={{ borderRadius: '18px', padding: '12px 24px', gap: '8px' }}>
            <Download size={18} /> Export Records
          </button>
          <button className="btn btn-primary" onClick={() => setModal('add-part')} style={{ 
            borderRadius: '18px', 
            padding: '14px 32px', 
            background: '#0f172a',
            border: 'none',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)',
            gap: '10px'
          }}>
            <Plus size={20} /> Register Part
          </button>
        </div>
      </div>

      {/* Critical Status Alerts */}
      {(lowStock > 0 || pendingReqs > 0) && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {lowStock > 0 && (
            <div className="mesh-glow" style={{ 
              padding: '24px', 
              borderRadius: '28px', 
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              boxShadow: '0 20px 40px -10px rgba(245, 158, 11, 0.3)'
            }}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <AlertTriangle size={24} />
                <div style={{ fontWeight: 950, fontSize: '18px' }}>Supply Warning</div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 600, opacity: 0.9 }}>{lowStock} critical assets have dropped below safety thresholds.</div>
            </div>
          )}
          {pendingReqs > 0 && (
            <div className="mesh-glow" style={{ 
              padding: '24px', 
              borderRadius: '28px', 
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              boxShadow: '0 20px 40px -10px rgba(59, 130, 246, 0.3)',
              cursor: 'pointer'
            }} onClick={() => setTab('requests')}>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <Truck size={24} />
                <div style={{ fontWeight: 950, fontSize: '18px' }}>Logistics Requests</div>
              </div>
              <div style={{ marginTop: '8px', fontSize: '14px', fontWeight: 600, opacity: 0.9 }}>{pendingReqs} technician deployments are awaiting asset allocation.</div>
            </div>
          )}
        </div>
      )}

      {/* Stats Bento */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: 'Asset SKU Count', val: spareParts.length, icon: Package, color: '#3B82F6' },
          { label: 'Optimal Stock', val: inStock, icon: CheckCircle, color: '#10B981' },
          { label: 'Supply Risk', val: lowStock, icon: AlertTriangle, color: '#F59E0B' },
          { label: 'Critical Depletion', val: outStock, icon: XCircle, color: '#EF4444' },
        ].map((s, idx) => (
          <div key={s.label} className="glass-card" style={{ padding: '24px', borderRadius: '28px', animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
            <div style={{ background: `${s.color}15`, color: s.color, width: '44px', height: '44px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
              <s.icon size={22} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: 950, color: '#0f172a', letterSpacing: '-1px' }}>{s.val}</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', marginTop: '4px' }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* Tab & Filter Bar */}
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
            { id:'parts',    label:'Asset Catalog', icon: ClipboardList, count: spareParts.length },
            { id:'requests', label:'Field Allocations', icon: Truck, count: partsRequests.length },
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
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: tab === t.id ? '0 4px 12px rgba(0,0,0,0.05)' : 'none'
              }}
            >
              <t.icon size={16} />
              {t.label}
              <span style={{ fontSize: '10px', background: tab === t.id ? '#0f172a' : '#e2e8f0', color: tab === t.id ? 'white' : '#64748b', padding: '2px 8px', borderRadius: '8px' }}>{t.count}</span>
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'flex-end' }}>
          {tab === 'parts' && (
            <div className="search-input-wrap" style={{ minWidth: '240px', background: 'white', borderRadius: '16px', padding: '10px 18px' }}>
              <Search size={18} color="#94a3b8" />
              <input placeholder="Search catalog..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontWeight: 600 }} />
            </div>
          )}
          <VTog mode={viewMode} setMode={setViewMode} />
        </div>
      </div>

      {/* ── CATALOG VIEW ── */}
      {tab === 'parts' && (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '6px 12px', borderRadius: '14px', fontSize: '12px', fontWeight: 800, color: '#64748b', marginRight: '12px' }}>
              <Filter size={14} /> STOCK STATUS
            </div>
            {['All', 'In Stock', 'Low Stock', 'Out of Stock'].map(s => (
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
              {filtered.map((part, idx) => (
                <div key={part.id} style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
                  <CreativeInventoryCard 
                    part={part} 
                    onView={p => { setSelected(p); setModal('view-part') }}
                    onAdjust={p => { setSelected(p); setModal('adjust') }}
                    onRestock={p => toast(`Order placed for ${p.name}`, 'success')}
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
                onClick={() => setModal('add-part')}
              >
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Plus size={40} />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a' }}>New Asset SKU</div>
                  <div style={{ fontSize: '13px', marginTop: '8px', fontWeight: 600 }}>Register technical component in catalog</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="table-container" style={{ borderRadius: '32px', border: '1px solid #e2e8f0', background: 'white', overflow: 'hidden' }}>
              <table className="table">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '24px' }}>IDENTIFIER</th>
                    <th>ASSET SPECIFICATION</th>
                    <th>VALUATION</th>
                    <th>QUANTITY</th>
                    <th>LOGISTICS STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(part => {
                    const meta = STOCK_META[part.status] || STOCK_META['In Stock']
                    return (
                      <tr key={part.id} style={{ cursor: 'pointer' }} onClick={() => { setSelected(part); setModal('view-part') }}>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace', fontSize: '15px' }}>{part.code}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>VERIFIED SKU</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{CAT_ICON[part.category] || '📦'} {part.name}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{part.category.toUpperCase()} CATEGORY</div>
                        </td>
                        <td style={{ fontWeight: 950, fontSize: '16px', color: '#0f172a' }}>
                          <span style={{ fontSize: '12px', color: '#94a3b8', marginRight: '4px' }}>SAR</span>
                          {part.price.toLocaleString()}
                        </td>
                        <td style={{ fontWeight: 950, fontSize: '18px', color: meta.color }}>{part.qty}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: `${meta.color}15`, color: meta.color, padding: '6px 12px', borderRadius: '10px', width: 'fit-content', fontSize: '11px', fontWeight: 900 }}>
                            {createElement(meta.icon, { size: 14 })} {part.status.toUpperCase()}
                          </div>
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <div className="table-actions">
                            <button className="btn btn-ghost btn-sm" onClick={() => { setSelected(part); setModal('view-part') }}><Eye size={16} /></button>
                            <button className="btn btn-ghost btn-sm" onClick={() => { setSelected(part); setModal('adjust') }}><Settings size={16} /></button>
                            <button className="btn btn-success btn-sm" style={{ borderRadius: '10px' }} onClick={() => toast(`Order Placed`, 'success')}>
                              <ShoppingCart size={14} />
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
        </>
      )}

      {/* ── REQUESTS VIEW ── */}
      {tab === 'requests' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
          {filteredReqs.map((req, idx) => (
            <div key={req.id} className="glass-card" style={{ padding: '24px', borderRadius: '32px', animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace' }}>{req.id}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{req.date}</div>
                </div>
                <div style={{ background: req.status === 'Pending' ? '#f59e0b15' : '#10b98115', color: req.status === 'Pending' ? '#f59e0b' : '#10b981', padding: '4px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 900 }}>{req.status.toUpperCase()}</div>
              </div>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>{req.tech.charAt(0)}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 800 }}>{req.tech}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Assigned Technician</div>
                  </div>
                </div>
                <div style={{ height: '1px', background: '#e2e8f0', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>ALLOCATION UNIT</div>
                    <div style={{ fontSize: '14px', fontWeight: 800 }}>{req.part}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>QTY</div>
                    <div style={{ fontSize: '14px', fontWeight: 900, color: '#3b82f6' }}>{req.qty} UNITS</div>
                  </div>
                </div>
              </div>
              {req.status === 'Pending' ? (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-ghost" style={{ flex: 1, borderRadius: '14px' }} onClick={() => handleReject(req)}>REJECT</button>
                  <button className="btn btn-primary" style={{ flex: 2, borderRadius: '14px', background: '#0f172a' }} onClick={() => handleApprove(req)}>ALLOCATE ASSETS</button>
                </div>
              ) : (
                <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '10px', borderRadius: '14px' }}>
                  Request processed on {req.date}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── MODALS ── */}
      {modal === 'view-part' && selected && (
        <Modal title={`Asset Specifications: ${selected.name}`} onClose={() => setModal(null)} size="sm"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Dismiss</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a' }} onClick={() => setModal('adjust')}>Adjust Inventory</button>
            </>
          }
        >
          <div style={{ textAlign: 'center', padding: '32px 0', background: '#f8fafc', borderRadius: '32px', marginBottom: '24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>{CAT_ICON[selected.category] || '📦'}</div>
            <h2 style={{ fontSize: '24px', fontWeight: 950, color: '#0f172a', margin: 0 }}>{selected.name}</h2>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8', fontFamily: 'monospace', marginTop: '4px' }}>{selected.code}</div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: `${STOCK_META[selected.status].color}15`, color: STOCK_META[selected.status].color, padding: '8px 20px', borderRadius: '12px', marginTop: '16px', fontSize: '13px', fontWeight: 900 }}>
              {createElement(STOCK_META[selected.status].icon, { size: 16 })} {selected.status.toUpperCase()}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[
              { label: 'QUANTITY', val: selected.qty, color: STOCK_META[selected.status].color },
              { label: 'MINIMUM', val: selected.minQty, color: '#475569' },
              { label: 'VALUATION', val: `SAR ${selected.price}`, color: '#3b82f6' }
            ].map(i => (
              <div key={i.label} style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', textAlign: 'center', border: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '18px', fontWeight: 950, color: i.color }}>{i.val}</div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginTop: '4px' }}>{i.label}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {modal === 'adjust' && selected && (
        <Modal title="Inventory Recalibration" onClose={() => setModal(null)} size="sm"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a' }} onClick={() => { toast('Inventory Synced', 'success'); setModal(null) }}>Sync Inventory</button>
            </>
          }
        >
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '16px', fontWeight: 950, color: '#0f172a' }}>{selected.name}</div>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Asset Identity: {selected.code}</div>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>ADJUSTMENT PROTOCOL</label>
            <select className="form-control form-select" style={{ borderRadius: '14px', fontWeight: 600 }}>
              <option>Inventory Influx (Restock)</option>
              <option>Resource Depletion (Allocated)</option>
              <option>Set Absolute Quantity</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>UNIT DIFFERENTIAL</label>
            <input className="form-control" type="number" style={{ borderRadius: '14px', fontWeight: 950, fontSize: '18px' }} defaultValue={0} />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>MANIFEST NOTE</label>
            <input className="form-control" style={{ borderRadius: '14px' }} placeholder="Provide reasoning for manual adjustment..." />
          </div>
        </Modal>
      )}

      {modal === 'add-part' && (
        <Modal title="Register Technical Asset" onClose={() => setModal(null)} size="lg"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setModal(null)}>Abort</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a', gap: '8px' }} onClick={() => { toast('Asset Registered', 'success'); setModal(null) }}>
                <Zap size={18} /> Initialize SKU
              </button>
            </>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>ASSET NAME</label>
              <input className="form-control" style={{ borderRadius: '16px', fontWeight: 600 }} placeholder="Technical identifier..." />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>GLOBAL SKU CODE</label>
              <input className="form-control" style={{ borderRadius: '16px', fontWeight: 900, fontFamily: 'monospace' }} placeholder="PNL-MXXXX" />
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>ASSET CLASSIFICATION</label>
              <select className="form-control form-select" style={{ borderRadius: '16px', fontWeight: 600 }}>
                {Object.keys(CAT_ICON).map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>UNIT VALUATION (SAR)</label>
              <input className="form-control" style={{ borderRadius: '16px', fontWeight: 900 }} type="number" />
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px dashed #3b82f6' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#3b82f6', marginBottom: '8px' }}>AUTOMATED REORDER PROTOCOL</div>
            <p style={{ fontSize: '14px', color: '#475569', margin: 0, fontWeight: 500 }}>System will trigger a logistical alert when physical units fall below the minimum safety threshold defined above.</p>
          </div>
        </Modal>
      )}
    </div>
  )
}
