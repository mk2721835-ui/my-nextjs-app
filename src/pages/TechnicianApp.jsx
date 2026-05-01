import { useState, useMemo, useEffect, createElement } from 'react'
import { useToast } from '../App'
import Modal from '../components/Modal'
import {
  maintenanceRequests as initRequests,
  invoices as initInvoices,
  partsRequests as initPartsReqs,
  spareParts,
  vehicles,
  vehicleAssignments,
  vehicleActivityLogs as initVehicleLogs,
  users,
} from '../data'
import { 
  Zap, 
  LayoutDashboard, 
  ClipboardList, 
  Truck, 
  FileText, 
  Box, 
  Users, 
  MapPin, 
  Wallet, 
  LogOut, 
  Bell, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  MoreVertical, 
  ArrowRight, 
  Star, 
  Activity, 
  DollarSign, 
  ShieldCheck, 
  Plus, 
  Navigation,
  Smartphone,
  ChevronRight,
  Target,
  Wrench,
  Key,
  Smartphone as PhoneIcon,
  MessageSquare,
  ArrowUpRight,
  User
} from 'lucide-react'

const PRIORITY_COLORS = {
  Critical: '#EF4444', High: '#F59E0B', Medium: '#3B82F6', Low: '#10B981',
}

const STATUS_META = {
  'Completed':      { color: '#10B981', icon: CheckCircle },
  'In Progress':    { color: '#3B82F6', icon: Activity },
  'Scheduled':      { color: '#F59E0B', icon: Clock },
  'Accepted':       { color: '#8B5CF6', icon: ShieldCheck },
  'Awaiting Parts': { color: '#EF4444', icon: Box },
}

const JOB_ICONS = t => t.includes('Solar') ? '☀️' : t.includes('Water') ? '💧' : t.includes('Battery') ? '🔋' : '🔧'

export default function TechnicianApp({ techUser, onLogout }) {
  const toast = useToast()
  const [nav, setNav] = useState('dashboard')
  const [selectedJobId, setSelectedJobId] = useState(null)
  const [mounted, setMounted] = useState(false)

  const [myJobs, setMyJobs] = useState(initRequests.filter(r => r.technicianId === techUser.id))
  const [myInvoices, setMyInvoices] = useState(initInvoices.filter(i => i.techId === techUser.id))
  const [myParts, setMyParts] = useState(initPartsReqs.filter(p => p.techId === techUser.id))

  useEffect(() => { setMounted(true) }, [])

  const stats = useMemo(() => ({
    active: myJobs.filter(j => j.status === 'In Progress').length,
    completed: myJobs.filter(j => j.status === 'Completed').length,
    pending: myParts.filter(p => p.status === 'Pending').length,
  }), [myJobs, myParts])

  const myVehicleAssign = useMemo(() => vehicleAssignments.find(a => a.techId === techUser.id && a.status === 'Active'), [techUser.id])
  const myVehicle = myVehicleAssign ? vehicles.find(v => v.id === myVehicleAssign.vehicleId) : null

  const selectedJob = myJobs.find(j => j.id === selectedJobId)

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f1f5f9', 
      display: 'flex', 
      opacity: mounted ? 1 : 0, 
      transition: 'opacity 0.6s ease',
      fontFamily: 'Outfit, sans-serif'
    }}>
      {/* Premium Sidebar */}
      <aside style={{
        width: '300px',
        background: '#0f172a',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        color: 'white',
        borderRight: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '48px' }}>
          <div style={{ width: '44px', height: '44px', background: 'linear-gradient(135deg, #10b981, #059669)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={24} color="white" />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 950, letterSpacing: '-0.5px' }}>ACZONE</div>
            <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '1px' }}>FIELD PORTAL</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Control Center' },
            { id: 'jobs', icon: ClipboardList, label: 'Active Missions' },
            { id: 'vehicle', icon: Truck, label: 'Assigned Unit' },
            { id: 'parts', icon: Box, label: 'Supply Chain' },
            { id: 'invoices', icon: FileText, label: 'Fiscal Logs' },
            { id: 'salary', icon: Wallet, label: 'Compensation' },
          ].map(item => {
            const isActive = nav === item.id
            return (
              <button 
                key={item.id}
                onClick={() => { setNav(item.id); setSelectedJobId(null) }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '14px 20px',
                  borderRadius: '16px',
                  border: 'none',
                  background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  color: isActive ? '#3b82f6' : '#94a3b8',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '14px',
                  transition: 'all 0.3s'
                }}
              >
                <item.icon size={20} />
                {item.label}
                {isActive && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6' }} />}
              </button>
            )
          })}
        </nav>

        <div style={{ marginTop: 'auto', padding: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: techUser.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 950 }}>
              {techUser.initials}
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 800 }}>{techUser.name}</div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>{techUser.specialty}</div>
            </div>
          </div>
          <button onClick={onLogout} style={{ width: '100%', marginTop: '20px', padding: '10px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <LogOut size={16} /> TERMINATE SESSION
          </button>
        </div>
      </aside>

      {/* Main View Area */}
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        {/* Mobile-Style Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '48px' }}>
          <div>
            <h2 style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a', letterSpacing: '-1.5px', margin: 0 }}>
              {nav.charAt(0).toUpperCase() + nav.slice(1)} Matrix
            </h2>
            <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>Logged in as Field Engineer #{techUser.id}</div>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <button style={{ width: '48px', height: '48px', borderRadius: '16px', background: 'white', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}>
              <Bell size={20} color="#64748b" />
              <div style={{ position: 'absolute', top: '12px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', border: '2px solid white' }} />
            </button>
            <div style={{ height: '48px', display: 'flex', alignItems: 'center', gap: '12px', background: '#0f172a', color: 'white', padding: '0 20px', borderRadius: '16px' }}>
              <Clock size={18} color="#3b82f6" />
              <span style={{ fontSize: '14px', fontWeight: 900 }}>14:22 <span style={{ opacity: 0.5, fontWeight: 700 }}>AST</span></span>
            </div>
          </div>
        </div>

        {nav === 'dashboard' && (
          <>
            {/* Quick Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', marginBottom: '40px' }}>
              {[
                { label: 'Active Missions', val: stats.active, icon: Target, color: '#3B82F6' },
                { label: 'Verified Complete', val: stats.completed, icon: CheckCircle, color: '#10B981' },
                { label: 'Supply Chain Alert', val: stats.pending, icon: AlertTriangle, color: '#F59E0B' },
              ].map((s, idx) => (
                <div key={s.label} className="glass-card" style={{ padding: '32px', borderRadius: '32px', display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={32} />
                  </div>
                  <div>
                    <div style={{ fontSize: '36px', fontWeight: 950, color: '#0f172a', lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', marginTop: '4px', letterSpacing: '1px' }}>{s.label.toUpperCase()}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '40px' }}>
              {/* Mission Queue */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 950, margin: 0 }}>Mission Queue</h3>
                  <button onClick={() => setNav('jobs')} style={{ fontSize: '13px', fontWeight: 900, color: '#3b82f6', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ALL MISSIONS <ChevronRight size={16} />
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {myJobs.slice(0, 4).map(job => (
                    <div key={job.id} onClick={() => { setSelectedJobId(job.id); setNav('jobs') }} className="glass-card" style={{ padding: '24px', borderRadius: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '20px', transition: 'all 0.3s' }}>
                      <div style={{ width: '56px', height: '56px', borderRadius: '16px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
                        {JOB_ICONS(job.type)}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '16px', fontWeight: 950 }}>{job.type}</div>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <MapPin size={12} /> {job.city}
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '11px', fontWeight: 900, color: PRIORITY_COLORS[job.priority], background: `${PRIORITY_COLORS[job.priority]}15`, padding: '4px 12px', borderRadius: '99px' }}>
                          {job.priority.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Asset & Team Sidecards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {myVehicle && (
                  <div className="glass-card" style={{ padding: '28px', borderRadius: '32px', background: '#0f172a', color: 'white' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: '#3b82f6', letterSpacing: '1px' }}>LOGISTICS UNIT</div>
                      <Truck size={20} color="#3b82f6" />
                    </div>
                    <div style={{ fontSize: '24px', fontWeight: 950 }}>{myVehicle.model}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, opacity: 0.6, fontFamily: 'monospace', marginBottom: '24px' }}>{myVehicle.plate}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '20px' }}>
                      <div>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>ODOMETER</div>
                        <div style={{ fontSize: '16px', fontWeight: 950 }}>{myVehicle.odometerCurrent.toLocaleString()} <span style={{ fontSize: '10px', opacity: 0.5 }}>KM</span></div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>STATUS</div>
                        <div style={{ fontSize: '14px', fontWeight: 900, color: '#10b981' }}>OPTIMAL</div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="glass-card" style={{ padding: '28px', borderRadius: '32px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 950, marginBottom: '20px' }}>Field Rating</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ fontSize: '42px', fontWeight: 950, color: '#f59e0b' }}>4.9</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
                        {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>BASED ON 42 REVIEWS</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {nav === 'jobs' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
            {myJobs.map((job, idx) => {
              const meta = STATUS_META[job.status] || STATUS_META['Scheduled']
              return (
                <div key={job.id} className="glass-card" style={{ padding: '32px', borderRadius: '32px', animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both`, borderLeft: `6px solid ${PRIORITY_COLORS[job.priority]}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace' }}>{job.id}</div>
                      <div style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', marginTop: '4px' }}>{job.type}</div>
                    </div>
                    <div style={{ background: `${meta.color}15`, color: meta.color, padding: '4px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 900 }}>{job.status.toUpperCase()}</div>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <User size={16} color="#64748b" />
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#475569' }}>{job.client}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <MapPin size={16} color="#64748b" />
                      </div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#475569' }}>{job.city}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn btn-ghost" style={{ flex: 1, borderRadius: '16px' }} onClick={() => setSelectedJobId(job.id)}>LOG DETAILS</button>
                    <button className="btn btn-primary" style={{ flex: 2, borderRadius: '16px', background: '#0f172a', gap: '10px' }} onClick={() => toast('Mission Initialized', 'success')}>
                      <Zap size={18} /> START MISSION
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {nav === 'vehicle' && myVehicle && (
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '48px', borderRadius: '48px', background: '#0f172a', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
               <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '200px', height: '200px', background: 'rgba(59,130,246,0.1)', borderRadius: '50%' }} />
               <Truck size={80} color="#3b82f6" style={{ margin: '0 auto 24px' }} />
               <h2 style={{ fontSize: '42px', fontWeight: 950, letterSpacing: '-2px', margin: 0 }}>{myVehicle.model}</h2>
               <div style={{ fontSize: '18px', fontWeight: 700, opacity: 0.5, fontFamily: 'monospace', letterSpacing: '2px', marginTop: '8px' }}>{myVehicle.plate}</div>
               
               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginTop: '48px' }}>
                 <div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                   <div style={{ fontSize: '32px', fontWeight: 950 }}>{myVehicle.odometerCurrent.toLocaleString()}</div>
                   <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.5, letterSpacing: '1px', marginTop: '4px' }}>KILOMETERS LOGGED</div>
                 </div>
                 <div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                   <div style={{ fontSize: '32px', fontWeight: 950 }}>{myVehicle.year}</div>
                   <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.5, letterSpacing: '1px', marginTop: '4px' }}>MODEL YEAR</div>
                 </div>
                 <div style={{ padding: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '24px' }}>
                   <div style={{ fontSize: '32px', fontWeight: 950, color: '#10b981' }}>100%</div>
                   <div style={{ fontSize: '11px', fontWeight: 800, opacity: 0.5, letterSpacing: '1px', marginTop: '4px' }}>UNIT INTEGRITY</div>
                 </div>
               </div>
            </div>
          </div>
        )}

        {nav === 'parts' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 950, margin: 0 }}>Supply Chain Requests</h3>
              <button className="btn btn-primary" style={{ borderRadius: '14px', background: '#0f172a' }} onClick={() => toast('New part request initialized', 'info')}>
                <Plus size={18} /> Request Component
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myParts.map((p, idx) => (
                <div key={p.id} className="glass-card" style={{ padding: '24px', borderRadius: '28px', display: 'flex', alignItems: 'center', gap: '20px', animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: p.status === 'Approved' ? '#10b98115' : '#f59e0b15', color: p.status === 'Approved' ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Box size={28} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace' }}>{p.id}</div>
                    <div style={{ fontSize: '17px', fontWeight: 950, color: '#0f172a' }}>{p.part}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>QTY: {p.qty} · CODE: {p.partCode}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: p.status === 'Approved' ? '#10b981' : '#f59e0b', background: p.status === 'Approved' ? '#10b98115' : '#f59e0b15', padding: '4px 12px', borderRadius: '99px', marginBottom: '8px' }}>
                      {p.status.toUpperCase()}
                    </div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>{p.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {nav === 'invoices' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 950, margin: 0 }}>Fiscal Logs</h3>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-ghost" style={{ borderRadius: '14px' }}><Download size={18} /></button>
                <button className="btn btn-primary" style={{ borderRadius: '14px', background: '#0f172a' }} onClick={() => toast('Invoice draft created', 'info')}>
                  <Plus size={18} /> New Invoice
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {myInvoices.map((inv, idx) => (
                <div key={inv.id} className="glass-card" style={{ padding: '24px', borderRadius: '28px', display: 'flex', alignItems: 'center', gap: '20px', animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#f8fafc', color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={28} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace' }}>{inv.id}</div>
                    <div style={{ fontSize: '17px', fontWeight: 950, color: '#0f172a' }}>{inv.client}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>{inv.type} · {inv.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', marginBottom: '4px' }}>SAR {inv.total.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: inv.status === 'Paid' ? '#10b981' : '#f59e0b' }}>
                      {inv.status.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {nav === 'salary' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '40px', borderRadius: '40px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 950, margin: 0 }}>Compensation History</h3>
                <div style={{ background: '#10b98115', color: '#10b981', padding: '6px 16px', borderRadius: '12px', fontSize: '12px', fontWeight: 900 }}>TOTAL DISBURSED: SAR 37,450</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {[
                  { month: 'April 2026', total: 9700, bonus: 1200, status: 'Disbursed' },
                  { month: 'March 2026', total: 9200, bonus: 800, status: 'Disbursed' },
                  { month: 'February 2026', total: 9450, bonus: 950, status: 'Disbursed' },
                ].map(sal => (
                  <div key={sal.month} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', background: '#f8fafc', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: 950 }}>{sal.month}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>BONUS ACCRUED: SAR {sal.bonus}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '22px', fontWeight: 950, color: '#0f172a' }}>SAR {sal.total.toLocaleString()}</div>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: '#10b981' }}>{sal.status.toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
