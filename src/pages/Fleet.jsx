import { useState, useMemo, useEffect, createElement } from 'react'
import { useToast } from '../App'
import Modal from '../components/Modal'
import {
  vehicles as initVehicles,
  vehicleAssignments as initAssignments,
  vehicleActivityLogs as initLogs,
  users,
} from '../data'
import { 
  Truck, 
  MapPin, 
  User, 
  Calendar, 
  Activity, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  ArrowRight, 
  Fuel, 
  Wrench, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  MoreVertical, 
  ChevronRight, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Download,
  Gauge,
  Key,
  Archive,
  Trash2,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
  ClipboardList,
  History
} from 'lucide-react'

const TECHNICIANS = users.filter(u => u.role === 'Technician')

const STATUS_META = {
  'Available':         { color: '#10B981', icon: CheckCircle, label: 'Ready' },
  'In Use':            { color: '#3B82F6', icon: Key, label: 'Deployed' },
  'Under Maintenance': { color: '#F59E0B', icon: Wrench, label: 'Service' },
  'Archived':          { color: '#94A3B8', icon: Archive, label: 'Retired' },
}

const LOG_META = {
  'Fuel':   { color: '#3B82F6', icon: Fuel },
  'Fault':  { color: '#EF4444', icon: AlertTriangle },
  'Damage': { color: '#F59E0B', icon: AlertTriangle },
  'Note':   { color: '#64748b', icon: ClipboardList },
}

function VTog({ mode, setMode }) {
  return (
    <div style={{ display: 'flex', gap: 4, background: '#e2e8f0', borderRadius: '16px', padding: '4px' }}>
      {[
        { id: 'grid', icon: LayoutGrid, label: 'Catalog' },
        { id: 'table', icon: List, label: 'Manifest' }
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

// ── Creative Vehicle Card ──────────────────────────────────────────
function CreativeVehicleCard({ vehicle, onView, onEdit, onArchive }) {
  const [hovered, setHovered] = useState(false)
  const meta = STATUS_META[vehicle.status] || STATUS_META['Available']
  const StatusIcon = meta.icon

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
      onClick={() => onView(vehicle)}
    >
      {/* Decorative Index */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        fontSize: '48px',
        fontWeight: 950,
        color: meta.color,
        opacity: 0.05,
        userSelect: 'none'
      }}>
        {String(vehicle.indexNumber).padStart(2, '0')}
      </div>

      {/* Top Identity */}
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
            <Truck size={24} />
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: 950, color: '#0f172a' }}>{vehicle.model}</div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', fontFamily: 'monospace' }}>{vehicle.plate}</div>
          </div>
        </div>
        <div style={{
          background: `${meta.color}15`,
          color: meta.color,
          fontSize: '10px',
          fontWeight: 900,
          padding: '4px 12px',
          borderRadius: '99px',
          letterSpacing: '0.5px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <StatusIcon size={12} /> {meta.label.toUpperCase()}
        </div>
      </div>

      {/* Visual Odometer Gauge */}
      <div style={{ 
        background: '#f8fafc', 
        padding: '24px', 
        borderRadius: '24px', 
        border: '1px solid #f1f5f9',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>ODOMETER MANIFEST</div>
        <div style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a', fontFamily: 'monospace', letterSpacing: '-1px' }}>
          {vehicle.odometerCurrent.toLocaleString()}
          <span style={{ fontSize: '14px', color: '#94a3b8', marginLeft: '4px' }}>KM</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px' }}>
          <div style={{ width: '40px', height: '4px', background: meta.color, borderRadius: '2px' }} />
          <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px' }} />
          <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px' }} />
        </div>
      </div>

      {/* Details Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Calendar size={14} color="#94a3b8" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>MOD {vehicle.year}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
          <ShieldCheck size={14} color="#10b981" />
          <span style={{ fontSize: '13px', fontWeight: 700, color: '#10b981' }}>VERIFIED</span>
        </div>
      </div>

      {/* Action Hover Reveal */}
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
        gap: '24px',
        opacity: hovered ? 1 : 0,
        zIndex: 2,
      }} onClick={e => e.stopPropagation()}>
        <button onClick={() => onEdit(vehicle)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800 }}>
          <Settings size={16} /> CONFIG
        </button>
        <button onClick={() => onView(vehicle)} style={{ background: 'none', border: 'none', color: '#10b981', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 800 }}>
          <Eye size={16} /> DATA
        </button>
      </div>
    </div>
  )
}

export default function Fleet() {
  const toast = useToast()
  const [tab, setTab] = useState('vehicles')
  const [viewMode, setViewMode] = useState('grid')
  const [mounted, setMounted] = useState(false)

  const [vehicles, setVehicles] = useState(initVehicles)
  const [assignments, setAssignments] = useState(initAssignments)
  const [logs, setLogs] = useState(initLogs)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => { setMounted(true) }, [])

  const filteredVehicles = useMemo(() => vehicles.filter(v => {
    const q = search.toLowerCase()
    const matchSearch = !q || v.plate.toLowerCase().includes(q) || v.model.toLowerCase().includes(q)
    return matchSearch && (statusFilter === 'All' || v.status === statusFilter)
  }), [vehicles, search, statusFilter])

  const stats = useMemo(() => ({
    total: vehicles.filter(v => v.status !== 'Archived').length,
    available: vehicles.filter(v => v.status === 'Available').length,
    inUse: vehicles.filter(v => v.status === 'In Use').length,
    maint: vehicles.filter(v => v.status === 'Under Maintenance').length,
    activeAssign: assignments.filter(a => a.status === 'Active').length,
  }), [vehicles, assignments])

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
            <Activity size={14} /> LOGISTICS GOVERNANCE
          </div>
          <h1 className="page-title" style={{ fontSize: '36px', fontWeight: 950, letterSpacing: '-1.5px' }}>
            Infrastructure Fleet
          </h1>
          <p className="page-subtitle" style={{ fontSize: '15px', marginTop: '4px', opacity: 0.7 }}>
            Orchestrating {vehicles.length} tactical units across the operational grid.
          </p>
        </div>
        <div className="page-header-actions" style={{ gap: '16px' }}>
          <button className="btn btn-ghost" onClick={() => toast('Logistics manifest exported', 'success')} style={{ borderRadius: '18px', padding: '12px 24px', gap: '8px' }}>
            <Download size={18} /> Export Manifest
          </button>
          <button className="btn btn-primary" onClick={() => setModal('add-vehicle')} style={{ 
            borderRadius: '18px', 
            padding: '14px 32px', 
            background: '#0f172a',
            border: 'none',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.3)',
            gap: '10px'
          }}>
            <Plus size={20} /> Register Unit
          </button>
        </div>
      </div>

      {/* Stats Bento */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {[
          { label: 'Total Deployable', val: stats.total, icon: Truck, color: '#3B82F6' },
          { label: 'Operational Ready', val: stats.available, icon: CheckCircle, color: '#10B981' },
          { label: 'Active Missions', val: stats.activeAssign, icon: Key, color: '#8B5CF6' },
          { label: 'Under Service', val: stats.maint, icon: Wrench, color: '#F59E0B' },
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

      {/* Control Bar */}
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
            { id: 'vehicles',    label: 'Asset Registry', icon: Truck },
            { id: 'assignments', label: 'Mission Logs', icon: ClipboardList },
            { id: 'activity',    label: 'Telemetry', icon: Activity },
          ].map(t => (
            <button key={t.id} 
              onClick={() => setTab(t.id)}
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="search-input-wrap" style={{ minWidth: '280px', background: 'white', borderRadius: '16px', padding: '10px 18px' }}>
            <Search size={18} color="#94a3b8" />
            <input placeholder="Search plate or model..." value={search} onChange={e => setSearch(e.target.value)} style={{ fontWeight: 600 }} />
          </div>
          <VTog mode={viewMode} setMode={setViewMode} />
        </div>
      </div>

      {/* Main Grid Render */}
      {tab === 'vehicles' && (
        <>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
            {['All', 'Available', 'In Use', 'Under Maintenance'].map(s => (
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
              {filteredVehicles.map((v, idx) => (
                <div key={v.id} style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
                  <CreativeVehicleCard 
                    vehicle={v} 
                    onView={v => { setSelected(v); setModal('view-vehicle') }}
                    onEdit={v => { setSelected(v); setModal('edit-vehicle') }}
                    onArchive={v => toast(`${v.model} archived`, 'info')}
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
                onClick={() => setModal('add-vehicle')}
              >
                <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '24px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                    <Plus size={40} />
                  </div>
                  <div style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a' }}>Register Unit</div>
                  <div style={{ fontSize: '13px', marginTop: '8px', fontWeight: 600 }}>Provision new tactical vehicle</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="table-container" style={{ borderRadius: '32px', border: '1px solid #e2e8f0', background: 'white', overflow: 'hidden' }}>
              <table className="table">
                <thead>
                  <tr style={{ background: '#f8fafc' }}>
                    <th style={{ padding: '24px' }}>UNIT ID</th>
                    <th>ASSET IDENTITY</th>
                    <th>CAPABILITY</th>
                    <th>ODOMETER</th>
                    <th>MISSION STATUS</th>
                    <th>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVehicles.map(v => {
                    const meta = STATUS_META[v.status] || STATUS_META['Available']
                    return (
                      <tr key={v.id} style={{ cursor: 'pointer' }} onClick={() => { setSelected(v); setModal('view-vehicle') }}>
                        <td style={{ padding: '20px 24px' }}>
                          <div style={{ fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace', fontSize: '15px' }}>{String(v.indexNumber).padStart(3, '0')}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>FISCAL UNIT</div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '14px' }}>{v.model}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{v.year} SPECIFICATION</div>
                        </td>
                        <td style={{ fontWeight: 700, color: '#475569', fontSize: '13px' }}>{v.plate}</td>
                        <td style={{ fontWeight: 950, fontSize: '16px', color: '#0f172a' }}>
                          {v.odometerCurrent.toLocaleString()}
                          <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '4px' }}>KM</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: `${meta.color}15`, color: meta.color, padding: '6px 12px', borderRadius: '10px', width: 'fit-content', fontSize: '11px', fontWeight: 900 }}>
                            {createElement(meta.icon, { size: 14 })} {v.status.toUpperCase()}
                          </div>
                        </td>
                        <td onClick={e => e.stopPropagation()}>
                          <div className="table-actions">
                            <button className="btn btn-ghost btn-sm" onClick={() => { setSelected(v); setModal('view-vehicle') }}><Eye size={16} /></button>
                            <button className="btn btn-ghost btn-sm" onClick={() => { setSelected(v); setModal('edit-vehicle') }}><Settings size={16} /></button>
                            <button className="btn btn-danger btn-sm" style={{ borderRadius: '10px' }} onClick={() => toast(`Archived`, 'info')}>
                              <Archive size={14} />
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

      {/* Assignments View */}
      {tab === 'assignments' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
          {assignments.map((a, idx) => {
            const v = vehicles.find(veh => veh.id === a.vehicleId)
            return (
              <div key={a.id} className="glass-card" style={{ padding: '24px', borderRadius: '32px', animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace' }}>{a.id}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>DEPLOYED: {a.startDate}</div>
                  </div>
                  <div style={{ background: a.status === 'Active' ? '#3b82f615' : '#64748b15', color: a.status === 'Active' ? '#3b82f6' : '#64748b', padding: '4px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 900 }}>{a.status.toUpperCase()}</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', border: '1px solid #f1f5f9', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0f172a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 800 }}>{a.techName}</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Assigned Pilot</div>
                    </div>
                  </div>
                  <div style={{ height: '1px', background: '#e2e8f0', margin: '12px 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>UNIT</div>
                      <div style={{ fontSize: '14px', fontWeight: 800 }}>{v?.model}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>PLATE</div>
                      <div style={{ fontSize: '14px', fontWeight: 900, color: '#3b82f6' }}>{v?.plate}</div>
                    </div>
                  </div>
                </div>
                {a.status === 'Active' ? (
                  <button className="btn btn-primary" style={{ width: '100%', borderRadius: '14px', background: '#0f172a' }} onClick={() => toast('Mission termination requested', 'info')}>TERMINATE MISSION</button>
                ) : (
                  <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Mission completed on {a.endDate}</div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Telemetry View */}
      {tab === 'activity' && (
        <div style={{ background: 'white', borderRadius: '32px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table className="table">
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ padding: '24px' }}>TELEMETRY ID</th>
                <th>EVENT TYPE</th>
                <th>MANIFEST</th>
                <th>METRICS</th>
                <th>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(l => {
                const meta = LOG_META[l.type] || LOG_META.Note
                return (
                  <tr key={l.id}>
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace' }}>{l.id}</div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: meta.color, fontWeight: 800, fontSize: '12px' }}>
                        {createElement(meta.icon, { size: 14 })} {l.type.toUpperCase()}
                      </div>
                    </td>
                    <td style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>{l.description}</td>
                    <td>
                      {l.cost ? (
                        <div style={{ fontWeight: 900, color: '#10b981' }}>SAR {l.cost}</div>
                      ) : (
                        <div style={{ color: '#94a3b8' }}>—</div>
                      )}
                    </td>
                    <td style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{l.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Modals */}
      {modal === 'view-vehicle' && selected && (
        <Modal title={`Telemetry Manifest: ${selected.plate}`} onClose={() => setModal(null)} size="lg">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
            <div>
              <div style={{ background: '#f8fafc', padding: '32px', borderRadius: '32px', textAlign: 'center', marginBottom: '24px' }}>
                <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚗</div>
                <h2 style={{ fontSize: '24px', fontWeight: 950, margin: 0 }}>{selected.model}</h2>
                <div style={{ fontSize: '14px', fontWeight: 800, color: '#94a3b8', fontFamily: 'monospace', marginTop: '4px' }}>{selected.plate}</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 950 }}>{selected.year}</div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>PRODUCTION</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 950 }}>{selected.odometerCurrent.toLocaleString()}</div>
                  <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>KM LOGGED</div>
                </div>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 950, marginBottom: '20px' }}>Historical Activity</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {logs.filter(l => l.vehicleId === selected.id).slice(0, 5).map(l => (
                  <div key={l.id} style={{ background: 'white', padding: '16px', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 800 }}>{l.type}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8' }}>{l.date}</div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 900 }}>{l.cost ? `SAR ${l.cost}` : 'Log'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {modal === 'add-vehicle' && (
        <Modal title="Register Operational Unit" onClose={() => setModal(null)} size="sm">
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>MODEL SPECIFICATION</label>
            <input className="form-control" style={{ borderRadius: '16px', fontWeight: 600 }} placeholder="e.g. Toyota Hilux 2024" />
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>PLATE REGISTRY</label>
            <input className="form-control" style={{ borderRadius: '16px', fontWeight: 900, fontFamily: 'monospace' }} placeholder="ABC-1234" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>PRODUCTION YEAR</label>
              <input className="form-control" type="number" style={{ borderRadius: '16px' }} defaultValue={2024} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '11px', letterSpacing: '1px' }}>INITIAL ODOMETER</label>
              <input className="form-control" type="number" style={{ borderRadius: '16px' }} defaultValue={0} />
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', borderRadius: '18px', padding: '14px', background: '#0f172a', marginTop: '12px' }} onClick={() => { toast('Unit Registered', 'success'); setModal(null) }}>INITIALIZE UNIT</button>
        </Modal>
      )}
    </div>
  )
}
