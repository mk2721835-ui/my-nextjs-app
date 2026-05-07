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
  technicianCashBalances as initCashBalances,
  cashSubmissions as initCashSubs,
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
  User,
  Trash2,
  CreditCard,
  Send,
  Receipt,
  Banknote,
  Eye,
  Download,
  Fuel
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
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [showPartsModal, setShowPartsModal] = useState(false)
  const [showCashSubmitModal, setShowCashSubmitModal] = useState(false)
  const [showPayCollectModal, setShowPayCollectModal] = useState(null)
  const [viewInvoiceModal, setViewInvoiceModal] = useState(null)
  const [jobSort, setJobSort] = useState('priority')
  const [mounted, setMounted] = useState(false)
  const [invFilter, setInvFilter] = useState('All')
  const [modal, setModal] = useState(null)

  // Invoice creation form
  const [invForm, setInvForm] = useState({ clientId: '', service: '', items: [{ name: '', qty: 1, unit: 0 }] })
  const invTotal = invForm.items.reduce((s, i) => s + (i.qty * i.unit), 0)

  // Parts request form
  const [partsForm, setPartsForm] = useState({ items: [{ part: '', qty: 1 }], reason: '' })

  const [myJobs, setMyJobs] = useState(initRequests.filter(r => r.technicianId === techUser.id))
  const [myInvoices, setMyInvoices] = useState(initInvoices.filter(i => i.techId === techUser.id))
  const [myParts, setMyParts] = useState(initPartsReqs.filter(p => p.techId === techUser.id))
  const [myCashBalance, setMyCashBalance] = useState(() => {
    const b = initCashBalances.find(c => c.techId === techUser.id)
    return b || { techId: techUser.id, techName: techUser.name, totalCashCollected: 0, submittedToAccounting: 0, remainingBalance: 0, lastSubmission: null }
  })
  const [myCashSubs, setMyCashSubs] = useState(initCashSubs.filter(s => s.techId === techUser.id))

  const clients = users.filter(u => u.role === 'Client')
  const selectedClient = clients.find(c => c.id === Number(invForm.clientId))

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
                        <div style={{ fontSize: '10px', fontWeight: 900, color: '#3b82f6', marginTop: '4px' }}>VIEW DETAILS</div>
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
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 950, margin: 0 }}>Task Board</h3>
              <select style={{ padding: '10px 16px', borderRadius: '14px', border: '1px solid #e2e8f0', fontWeight: 800, fontSize: '13px', background: 'white' }} value={jobSort} onChange={e => setJobSort(e.target.value)}>
                <option value="priority">Sort by Priority</option>
                <option value="location">Sort by Location</option>
                <option value="time">Sort by Time</option>
              </select>
            </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '32px' }}>
            {[...myJobs].sort((a, b) => {
              if (jobSort === 'priority') {
                const p = { Critical: 1, High: 2, Medium: 3, Low: 4 }
                return p[a.priority] - p[b.priority]
              }
              if (jobSort === 'location') return a.city.localeCompare(b.city)
              return a.id.localeCompare(b.id)
            }).map((job, idx) => {
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
                    <button className="btn btn-ghost" style={{ flex: 1, borderRadius: '16px' }} onClick={() => setSelectedJobId(job.id)}>VIEW DETAILS</button>
                    <button className="btn btn-primary" style={{ flex: 2, borderRadius: '16px', background: '#0f172a', gap: '10px' }} onClick={() => toast('Mission Initialized', 'success')}>
                      <Zap size={18} /> START MISSION
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          </div>
        )}

        {nav === 'vehicle' && myVehicle && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '48px', borderRadius: '48px', background: '#0f172a', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden', marginBottom: '40px' }}>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 950, marginBottom: '24px' }}>Operational Logging</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                  <button className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s' }} onClick={() => setModal('log-fuel')}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#3b82f615', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Fuel size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: 900 }}>Log Fuel Entry</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Record liters and expense</div>
                    </div>
                    <ChevronRight size={20} color="#cbd5e1" />
                  </button>

                  <button className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s' }} onClick={() => setModal('log-fault')}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#ef444415', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertTriangle size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: 900 }}>Report Tactical Fault</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Technical issues or damage</div>
                    </div>
                    <ChevronRight size={20} color="#cbd5e1" />
                  </button>

                  <button className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '24px', borderRadius: '24px', border: '1px solid #e2e8f0', cursor: 'pointer', textAlign: 'left', transition: 'all 0.3s' }} onClick={() => setModal('log-note')}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#8b5cf615', color: '#8b5cf6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <MessageSquare size={24} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '16px', fontWeight: 900 }}>Mission Note</div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>General operational remarks</div>
                    </div>
                    <ChevronRight size={20} color="#cbd5e1" />
                  </button>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 950, marginBottom: '24px' }}>Unit History</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto', paddingRight: '8px' }}>
                  {initVehicleLogs.filter(l => l.vehicleId === myVehicle.id).slice(0, 8).map(l => (
                    <div key={l.id} style={{ background: 'white', padding: '16px', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', gap: '12px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Activity size={16} color="#3b82f6" />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <div style={{ fontSize: '13px', fontWeight: 800 }}>{l.type}</div>
                          <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8' }}>{l.date}</div>
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>{l.description}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {nav === 'parts' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 950, margin: 0 }}>Supply Chain Requests</h3>
              <button className="btn btn-primary" style={{ borderRadius: '14px', background: '#0f172a' }} onClick={() => setShowPartsModal(true)}>
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
                    <div style={{ fontSize: '10px', fontWeight: 900, color: '#3b82f6', marginTop: '8px', cursor: 'pointer' }}>VIEW DETAILS</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {nav === 'invoices' && (() => {
          const cashInvs = myInvoices.filter(i => i.method === 'Cash' && i.status === 'Paid')
          const onlineInvs = myInvoices.filter(i => i.method && i.method !== 'Cash' && i.status === 'Paid')
          const pendingInvs = myInvoices.filter(i => i.status === 'Pending')
          const totalCash = cashInvs.reduce((s,i) => s+i.paid, 0)
          const totalOnline = onlineInvs.reduce((s,i) => s+i.paid, 0)
          const filteredInvs = invFilter === 'All' ? myInvoices : myInvoices.filter(i => {
            if (invFilter === 'Paid (Cash)') return i.status === 'Paid' && i.method === 'Cash'
            if (invFilter === 'Paid (Online)') return i.status === 'Paid' && i.method && i.method !== 'Cash'
            return i.status === invFilter
          })
          return (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            {/* Cash Balance Banner */}
            {myCashBalance.remainingBalance > 0 && (
              <div style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', borderRadius: '32px', padding: '28px 32px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Banknote size={28} /></div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: '#f59e0b', letterSpacing: '1px' }}>CASH ON HAND</div>
                    <div style={{ fontSize: '28px', fontWeight: 950 }}>SAR {myCashBalance.remainingBalance.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)' }}>Must be submitted to Accounting at end of day</div>
                  </div>
                </div>
                <button onClick={() => setShowCashSubmitModal(true)} style={{ background: '#f59e0b', color: '#0f172a', border: 'none', padding: '14px 28px', borderRadius: '16px', fontWeight: 900, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}><Send size={18} /> SUBMIT TO ACCOUNTING</button>
              </div>
            )}

            {/* KPI Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
              {[
                { label: 'Cash Collected', val: totalCash, icon: DollarSign, color: '#10B981' },
                { label: 'Online Payments', val: totalOnline, icon: CreditCard, color: '#3B82F6' },
                { label: 'Pending Invoices', val: pendingInvs.reduce((s,i)=>s+i.total,0), icon: Clock, color: '#F59E0B', count: pendingInvs.length },
              ].map(s => (
                <div key={s.label} className="glass-card" style={{ padding: '24px', borderRadius: '28px', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: `${s.color}15`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><s.icon size={24} /></div>
                  <div>
                    <div style={{ fontSize: '22px', fontWeight: 950, color: '#0f172a' }}>SAR {s.val.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8' }}>{s.label.toUpperCase()}{s.count != null ? ` (${s.count})` : ''}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Header + Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '24px', fontWeight: 950, margin: 0 }}>Fiscal Logs</h3>
              <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a', gap: '8px' }} onClick={() => { setInvForm({ clientId: '', service: '', items: [{ name: '', qty: 1, unit: 0 }] }); setShowInvoiceModal(true) }}>
                <Plus size={18} /> Create Invoice
              </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {['All', 'Paid (Cash)', 'Paid (Online)', 'Pending'].map(f => (
                <button key={f} onClick={() => setInvFilter(f)} style={{ padding: '8px 18px', borderRadius: '14px', fontSize: '12px', fontWeight: 800, border: '1px solid #e2e8f0', background: invFilter === f ? '#0f172a' : 'white', color: invFilter === f ? 'white' : '#64748b', cursor: 'pointer', transition: 'all 0.3s' }}>{f}</button>
              ))}
            </div>

            {/* Invoice List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {filteredInvs.map((inv, idx) => {
                const isPaid = inv.status === 'Paid'
                const methodColor = inv.method === 'Cash' ? '#10b981' : inv.method ? '#3b82f6' : '#94a3b8'
                return (
                <div key={inv.id} className="glass-card" style={{ padding: '24px', borderRadius: '28px', display: 'flex', alignItems: 'center', gap: '20px', animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: isPaid ? '#10b98115' : '#f8fafc', color: isPaid ? '#10b981' : '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {isPaid ? <CheckCircle size={28} /> : <FileText size={28} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace' }}>{inv.id}</span>
                      {isPaid && inv.method && <span style={{ fontSize: '10px', fontWeight: 900, color: methodColor, background: `${methodColor}15`, padding: '2px 10px', borderRadius: '8px' }}>{inv.method === 'Cash' ? '💵 CASH' : '💳 ONLINE'}</span>}
                    </div>
                    <div style={{ fontSize: '17px', fontWeight: 950, color: '#0f172a' }}>{inv.client}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>{inv.type} · {inv.date}</div>
                  </div>
                  <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a' }}>SAR {inv.total.toLocaleString()}</div>
                    <div style={{ fontSize: '11px', fontWeight: 900, color: isPaid ? '#10b981' : '#f59e0b', background: isPaid ? '#10b98115' : '#f59e0b15', padding: '4px 12px', borderRadius: '10px' }}>{isPaid ? `PAID (${inv.method || '—'})` : 'PENDING'}</div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={() => setViewInvoiceModal(inv)} style={{ fontSize: '10px', fontWeight: 900, color: '#3b82f6', background: '#3b82f615', border: 'none', padding: '4px 12px', borderRadius: '8px', cursor: 'pointer' }}>VIEW</button>
                      {!isPaid && <button onClick={() => setShowPayCollectModal(inv)} style={{ fontSize: '10px', fontWeight: 900, color: '#10b981', background: '#10b98115', border: 'none', padding: '4px 12px', borderRadius: '8px', cursor: 'pointer' }}>COLLECT</button>}
                    </div>
                  </div>
                </div>
              )})}
              {filteredInvs.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: '#94a3b8', fontWeight: 800, background: 'white', borderRadius: '28px' }}>No invoices match this filter.</div>
              )}
            </div>
          </div>
        )})()}

        {nav === 'salary' && (
          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            <div className="glass-card" style={{ padding: '40px', borderRadius: '40px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: 950, margin: 0 }}>Compensation Manifest</h3>
                  <div style={{ fontSize: '14px', color: '#64748b', fontWeight: 600, marginTop: '4px' }}>Fiscal Year 2026 Tracking</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '11px', fontWeight: 900, color: '#10b981', letterSpacing: '1px' }}>TOTAL CUMULATIVE</div>
                  <div style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a' }}>SAR 37,450</div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '24px', marginBottom: '40px' }}>
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', marginBottom: '8px' }}>BASE SALARY</div>
                  <div style={{ fontSize: '20px', fontWeight: 950 }}>SAR 8,500</div>
                  <div style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, marginTop: '4px' }}>FIXED MONTHLY</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', marginBottom: '8px' }}>PERFORMANCE BONUS</div>
                  <div style={{ fontSize: '20px', fontWeight: 950, color: '#3b82f6' }}>SAR 1,200</div>
                  <div style={{ fontSize: '11px', color: '#3b82f6', fontWeight: 700, marginTop: '4px' }}>APRIL ACCRUED</div>
                </div>
                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                  <div style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', marginBottom: '8px' }}>DEDUCTIONS</div>
                  <div style={{ fontSize: '20px', fontWeight: 950, color: '#ef4444' }}>SAR 0.00</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginTop: '4px' }}>NO DISCREPANCIES</div>
                </div>
              </div>

              <div style={{ fontSize: '16px', fontWeight: 950, marginBottom: '20px', color: '#0f172a' }}>Historical Disbursement Log</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { month: 'April 2026', total: 9700, bonus: 1200, status: 'Disbursed', date: 'May 01, 2026' },
                  { month: 'March 2026', total: 9200, bonus: 800, status: 'Disbursed', date: 'April 01, 2026' },
                  { month: 'February 2026', total: 9450, bonus: 950, status: 'Disbursed', date: 'March 01, 2026' },
                ].map(sal => (
                  <div key={sal.month} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Wallet size={20} color="#64748b" />
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 900 }}>{sal.month}</div>
                        <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700 }}>Transfer Date: {sal.date}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '18px', fontWeight: 950, color: '#0f172a' }}>SAR {sal.total.toLocaleString()}</div>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: '#10b981' }}>{sal.status.toUpperCase()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Job Details Modal */}
      {selectedJob && (
        <Modal 
          title="Mission Diagnostics & Control" 
          onClose={() => setSelectedJobId(null)}
          size="lg"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setSelectedJobId(null)}>Close</button>
              <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a' }} onClick={() => { toast('Report and Status updated', 'success'); setSelectedJobId(null); }}>
                Update Mission
              </button>
            </>
          }
        >
          <div style={{ display: 'grid', gap: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8fafc', padding: '24px', borderRadius: '24px' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace' }}>{selectedJob.id}</div>
                <div style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a' }}>{selectedJob.type}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                   <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>{selectedJob.client}</div>
                   <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
                   <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{selectedJob.city}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                   <button className="btn btn-ghost" style={{ padding: '8px', borderRadius: '10px' }} onClick={() => toast(`Calling ${selectedJob.client}...`, 'info')}><PhoneIcon size={16}/></button>
                   <button className="btn btn-ghost" style={{ padding: '8px', borderRadius: '10px' }} onClick={() => toast(`Messaging ${selectedJob.client}...`, 'info')}><MessageSquare size={16}/></button>
                </div>
                <select style={{ padding: '8px 16px', borderRadius: '12px', border: '1px solid #e2e8f0', fontWeight: 800, fontSize: '13px', background: 'white' }}>
                  <option>Scheduled</option>
                  <option>In Progress</option>
                  <option>Paused</option>
                  <option>Completed</option>
                </select>
                <div style={{ fontSize: '11px', fontWeight: 900, color: PRIORITY_COLORS[selectedJob.priority], background: `${PRIORITY_COLORS[selectedJob.priority]}15`, padding: '4px 12px', borderRadius: '99px' }}>
                  {selectedJob.priority.toUpperCase()} PRIORITY
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>FAULT CAUSE & DIAGNOSTICS</label>
                <textarea className="form-control" placeholder="Describe the fault cause and initial condition..." style={{ width: '100%', height: '100px', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', fontWeight: 600 }}></textarea>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>FUTURE RECOMMENDATIONS</label>
                <textarea className="form-control" placeholder="Maintenance recommendations for the client..." style={{ width: '100%', height: '100px', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', fontWeight: 600 }}></textarea>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>LOG ARRIVAL TIME</label>
                <input type="time" className="form-control" style={{ width: '100%', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', fontWeight: 600 }} />
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>LOG COMPLETION TIME</label>
                <input type="time" className="form-control" style={{ width: '100%', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '16px', fontWeight: 600 }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>MEDIA ATTACHMENTS (BEFORE/AFTER)</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <button style={{ flex: 1, padding: '24px', borderRadius: '20px', border: '1.5px dashed #cbd5e1', background: '#f8fafc', color: '#64748b', fontWeight: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <Smartphone size={24} /> Upload Before Photo
                </button>
                <button style={{ flex: 1, padding: '24px', borderRadius: '20px', border: '1.5px dashed #cbd5e1', background: '#f8fafc', color: '#64748b', fontWeight: 800, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <Smartphone size={24} /> Upload After Photo
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
              <button className="btn btn-primary" style={{ flex: 1, background: '#10b981', border: 'none', borderRadius: '16px', height: '48px', gap: '8px' }} onClick={() => toast('Maintenance Started', 'info')}>
                <Activity size={18} /> Start
              </button>
              <button className="btn btn-primary" style={{ flex: 1, background: '#f59e0b', border: 'none', borderRadius: '16px', height: '48px', gap: '8px' }} onClick={() => toast('Maintenance Paused', 'warning')}>
                <Clock size={18} /> Pause
              </button>
              <button className="btn btn-primary" style={{ flex: 1, background: '#3b82f6', border: 'none', borderRadius: '16px', height: '48px', gap: '8px' }} onClick={() => toast('Maintenance Completed', 'success')}>
                <CheckCircle size={18} /> Complete
              </button>
            </div>
            
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-ghost" style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '16px', height: '48px', gap: '8px' }} onClick={() => { setNav('parts'); setSelectedJobId(null); toast('Redirecting to parts supply', 'info') }}>
                <Wrench size={18} /> Request Parts
              </button>
              <button className="btn btn-ghost" style={{ flex: 1, border: '1px solid #e2e8f0', borderRadius: '16px', height: '48px', gap: '8px' }} onClick={() => toast('Dispatched additional technician', 'info')}>
                <Users size={18} /> Dispatch Help
              </button>
            </div>

          </div>
        </Modal>
      )}

      {showPartsModal && (
        <Modal title="Request Tactical Assets" onClose={() => setShowPartsModal(false)} size="md" footer={
          <>
            <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setShowPartsModal(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a' }} onClick={() => { 
              if (partsForm.items.some(i => !i.part) || !partsForm.reason) { toast('Please specify parts and reason', 'warning'); return }
              const newId = `PR-${String(Math.floor(Math.random()*900)+100)}`
              const newReq = { 
                id: newId, 
                techId: techUser.id, 
                tech: techUser.name, 
                requestId: selectedJobId || 'UNASSIGNED', 
                items: partsForm.items.map(i => ({ 
                  part: i.part, 
                  partCode: spareParts.find(sp => sp.name === i.part)?.code || 'GENERIC', 
                  qty: i.qty 
                })), 
                status: 'Pending', 
                date: new Date().toISOString().slice(0,10), 
                reason: partsForm.reason 
              }
              setMyParts(prev => [newReq, ...prev])
              toast('Strategic asset request submitted successfully', 'success'); 
              setShowPartsModal(false); 
              setPartsForm({ items: [{ part: '', qty: 1 }], reason: '' });
            }}>Submit Request</button>
          </>
        }>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a' }}>REQUIRED COMPONENTS</div>
                <button onClick={() => setPartsForm(f => ({ ...f, items: [...f.items, { part: '', qty: 1 }] }))} style={{ fontSize: '11px', fontWeight: 900, color: '#3b82f6', background: '#3b82f615', border: 'none', padding: '6px 14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={14} /> Add Item</button>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {partsForm.items.map((item, i) => (
                  <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 40px', gap: '10px', alignItems: 'center' }}>
                    <select className="form-control" value={item.part} onChange={e => { const items = [...partsForm.items]; items[i].part = e.target.value; setPartsForm(f => ({ ...f, items })) }} style={{ borderRadius: '12px', padding: '12px', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: '13px' }}>
                      <option value="">Select part...</option>
                      {spareParts.map(sp => <option key={sp.id} value={sp.name}>{sp.name}</option>)}
                    </select>
                    <input type="number" min="1" value={item.qty} onChange={e => { const items = [...partsForm.items]; items[i].qty = Math.max(1, +e.target.value); setPartsForm(f => ({ ...f, items })) }} style={{ borderRadius: '12px', padding: '12px', border: '1px solid #e2e8f0', fontWeight: 800, fontSize: '13px', textAlign: 'center' }} />
                    {partsForm.items.length > 1 && (
                      <button onClick={() => setPartsForm(f => ({ ...f, items: f.items.filter((_, j) => j !== i) }))} style={{ width: '40px', height: '40px', borderRadius: '10px', border: 'none', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>ALLOCATION REASON / MISSION NOTES</label>
              <textarea className="form-control" placeholder="Explain why these assets are required for the mission..." value={partsForm.reason} onChange={e => setPartsForm(f => ({ ...f, reason: e.target.value }))} style={{ width: '100%', height: '100px', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', fontWeight: 600, fontSize: '14px' }}></textarea>
            </div>

            <div style={{ background: '#fffbeb', padding: '16px', borderRadius: '16px', border: '1px solid #fef3c7', display: 'flex', gap: '12px' }}>
              <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#92400e' }}>All requests are logged for auditing. Misallocation of assets may result in disciplinary review.</div>
            </div>
          </div>
        </Modal>
      )}

      {/* Invoice Creation Modal */}
      {showInvoiceModal && (
        <Modal title="Create Client Invoice" onClose={() => setShowInvoiceModal(false)} size="lg" footer={
          <>
            <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setShowInvoiceModal(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#0f172a', gap: '8px' }} onClick={() => {
              if (!invForm.clientId || !invForm.service || invTotal <= 0) { toast('Please fill all fields', 'warning'); return }
              const newId = `INV-${String(Math.floor(Math.random()*9000)+1000).padStart(4,'0')}`
              const cl = clients.find(c => c.id === Number(invForm.clientId))
              const newInv = { id: newId, clientId: cl.id, client: cl.name, techId: techUser.id, tech: techUser.name, requestId: null, type: invForm.service, items: invForm.items.filter(i=>i.name&&i.unit>0), total: invTotal, paid: 0, status: 'Pending', method: null, date: new Date().toISOString().slice(0,10), isNew: true }
              setMyInvoices(prev => [newInv, ...prev])
              toast(`Invoice ${newId} created & sent to ${cl.name}`, 'success')
              setShowInvoiceModal(false)
            }}>
              <Zap size={18} /> Confirm & Send
            </button>
          </>
        }>
          <div style={{ display: 'grid', gap: '20px' }}>
            {/* Client + Service */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>CLIENT</label>
                <select className="form-control" value={invForm.clientId} onChange={e => setInvForm(f=>({...f,clientId:e.target.value}))} style={{ width: '100%', borderRadius: '16px', padding: '14px', border: '1px solid #e2e8f0', fontWeight: 700 }}>
                  <option value="">Select client...</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>SERVICE PERFORMED</label>
                <select className="form-control" value={invForm.service} onChange={e => setInvForm(f=>({...f,service:e.target.value}))} style={{ width: '100%', borderRadius: '16px', padding: '14px', border: '1px solid #e2e8f0', fontWeight: 700 }}>
                  <option value="">Select service...</option>
                  <option>Maintenance</option><option>Installation</option><option>Repair</option><option>Inspection</option><option>Panel Cleaning</option>
                </select>
              </div>
            </div>

            {/* Line Items */}
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a' }}>PARTS & LABOR ITEMS</div>
                <button onClick={() => setInvForm(f=>({...f, items:[...f.items,{name:'',qty:1,unit:0}]}))} style={{ fontSize: '12px', fontWeight: 900, color: '#3b82f6', background: '#3b82f615', border: 'none', padding: '6px 14px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}><Plus size={14} /> Add Item</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.5fr 40px', gap: '8px', marginBottom: '8px' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8' }}>DESCRIPTION</div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textAlign: 'center' }}>QTY</div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', textAlign: 'right' }}>UNIT PRICE</div>
                <div></div>
              </div>
              {invForm.items.map((item, i) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 1.5fr 40px', gap: '8px', marginBottom: '8px', alignItems: 'center' }}>
                  <input placeholder="e.g. Service Labor, Filter Membrane..." value={item.name} onChange={e => { const items = [...invForm.items]; items[i].name = e.target.value; setInvForm(f=>({...f,items})) }} style={{ borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px', fontWeight: 700, fontSize: '13px' }} />
                  <input type="number" min="1" value={item.qty} onChange={e => { const items = [...invForm.items]; items[i].qty = Math.max(1,+e.target.value); setInvForm(f=>({...f,items})) }} style={{ borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px', textAlign: 'center', fontWeight: 800, fontSize: '13px' }} />
                  <input type="number" min="0" value={item.unit || ''} placeholder="SAR" onChange={e => { const items = [...invForm.items]; items[i].unit = +e.target.value; setInvForm(f=>({...f,items})) }} style={{ borderRadius: '12px', border: '1px solid #e2e8f0', padding: '12px', textAlign: 'right', fontWeight: 800, fontSize: '13px' }} />
                  {invForm.items.length > 1 && <button onClick={() => setInvForm(f=>({...f, items: f.items.filter((_,j)=>j!==i)}))} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: '#fee2e2', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trash2 size={16} /></button>}
                </div>
              ))}
            </div>

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px 24px', background: '#0f172a', borderRadius: '20px', color: 'white' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: '1px' }}>INVOICE TOTAL</div>
                <div style={{ fontSize: '28px', fontWeight: 950 }}>SAR {invTotal.toLocaleString()}</div>
              </div>
            </div>

            <div style={{ background: '#eff6ff', padding: '16px', borderRadius: '16px', border: '1px solid #bfdbfe', display: 'flex', gap: '12px', alignItems: 'center' }}>
              <ShieldCheck size={20} color="#3b82f6" />
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af' }}>No admin approval required. Invoice will be sent to the client and registered in Accounting automatically.</div>
            </div>
          </div>
        </Modal>
      )}

      {/* Collect Payment Modal */}
      {showPayCollectModal && (
        <Modal title="Collect Payment" onClose={() => setShowPayCollectModal(null)} size="sm" footer={
          <>
            <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setShowPayCollectModal(null)}>Cancel</button>
            <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#10b981', border: 'none', gap: '8px' }} onClick={() => {
              const inv = showPayCollectModal
              const method = document.getElementById('payMethodSelect')?.value || 'Cash'
              setMyInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'Paid', paid: i.total, method } : i))
              if (method === 'Cash') {
                setMyCashBalance(b => ({ ...b, totalCashCollected: b.totalCashCollected + inv.total, remainingBalance: b.remainingBalance + inv.total }))
                toast(`SAR ${inv.total.toLocaleString()} cash collected — added to your balance`, 'success')
              } else {
                toast(`SAR ${inv.total.toLocaleString()} online payment recorded — sent to company`, 'success')
              }
              setShowPayCollectModal(null)
            }}>
              <CheckCircle size={18} /> Confirm Payment
            </button>
          </>
        }>
          <div style={{ textAlign: 'center', padding: '24px 0', background: '#f8fafc', borderRadius: '24px', marginBottom: '20px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#10b98115', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Wallet size={28} /></div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>AMOUNT TO COLLECT</div>
            <div style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a' }}>SAR {showPayCollectModal.total.toLocaleString()}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', marginTop: '4px' }}>{showPayCollectModal.client}</div>
          </div>
          <div className="form-group">
            <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>PAYMENT METHOD</label>
            <select id="payMethodSelect" className="form-control" style={{ width: '100%', borderRadius: '16px', padding: '14px', border: '1px solid #e2e8f0', fontWeight: 700 }}>
              <option value="Cash">💵 Cash (Collect from Client)</option>
              <option value="Online">💳 Online (Card / Gateway)</option>
            </select>
          </div>
          <div style={{ background: '#fefce8', padding: '14px', borderRadius: '14px', border: '1px solid #fef08a', marginTop: '16px', fontSize: '12px', fontWeight: 600, color: '#854d0e', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <AlertTriangle size={18} color="#eab308" />
            <span><strong>Cash:</strong> Added to your daily balance. <strong>Online:</strong> Goes directly to company.</span>
          </div>
        </Modal>
      )}

      {/* Submit Cash to Accounting Modal */}
      {showCashSubmitModal && (
        <Modal title="Submit Cash to Accounting" onClose={() => setShowCashSubmitModal(false)} size="sm" footer={
          <>
            <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setShowCashSubmitModal(false)}>Cancel</button>
            <button className="btn btn-primary" style={{ borderRadius: '16px', background: '#f59e0b', color: '#0f172a', border: 'none', gap: '8px' }} onClick={() => {
              const subId = `CS-${String(Math.floor(Math.random()*900)+100)}`
              setMyCashSubs(prev => [{ id: subId, techId: techUser.id, techName: techUser.name, amount: myCashBalance.remainingBalance, date: new Date().toISOString().slice(0,10), method: 'Hand Delivery', status: 'Pending', confirmedBy: null, confirmedAt: null, notes: 'End of day cash submission', invoiceIds: [] }, ...prev])
              setMyCashBalance(b => ({ ...b, submittedToAccounting: b.submittedToAccounting + b.remainingBalance, remainingBalance: 0 }))
              toast(`SAR ${myCashBalance.remainingBalance.toLocaleString()} submitted — pending admin confirmation`, 'success')
              setShowCashSubmitModal(false)
            }}>
              <Send size={18} /> Confirm Submission
            </button>
          </>
        }>
          <div style={{ textAlign: 'center', padding: '24px 0', background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '24px', marginBottom: '20px', color: 'white' }}>
            <Banknote size={40} color="#f59e0b" style={{ margin: '0 auto 12px' }} />
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#f59e0b', letterSpacing: '1px' }}>TOTAL CASH ON HAND</div>
            <div style={{ fontSize: '36px', fontWeight: 950 }}>SAR {myCashBalance.remainingBalance.toLocaleString()}</div>
          </div>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Total Collected Today</span>
              <span style={{ fontSize: '13px', fontWeight: 900 }}>SAR {myCashBalance.totalCashCollected.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Already Submitted</span>
              <span style={{ fontSize: '13px', fontWeight: 900, color: '#10b981' }}>SAR {myCashBalance.submittedToAccounting.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ background: '#fef3c7', padding: '14px', borderRadius: '14px', border: '1px solid #fde68a', fontSize: '12px', fontWeight: 600, color: '#92400e', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <AlertTriangle size={18} color="#f59e0b" />
            Admin will confirm the amount upon receipt. Your balance will be cleared once confirmed.
          </div>
        </Modal>
      )}

      {/* View Invoice Detail Modal */}
      {viewInvoiceModal && (
        <Modal title={`Invoice ${viewInvoiceModal.id}`} onClose={() => setViewInvoiceModal(null)} size="md" footer={
          <button className="btn btn-ghost" style={{ borderRadius: '16px' }} onClick={() => setViewInvoiceModal(null)}>Close</button>
        }>
          <div style={{ background: '#0f172a', padding: '24px', borderRadius: '24px', color: 'white', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace' }}>{viewInvoiceModal.id}</div>
              <div style={{ fontSize: '12px', fontWeight: 700, opacity: 0.5, marginTop: '4px' }}>ISSUED {viewInvoiceModal.date}</div>
            </div>
            <div style={{ background: (viewInvoiceModal.status === 'Paid' ? '#10b981' : '#f59e0b') + '20', color: viewInvoiceModal.status === 'Paid' ? '#10b981' : '#f59e0b', padding: '8px 20px', borderRadius: '12px', fontSize: '13px', fontWeight: 900 }}>{viewInvoiceModal.status.toUpperCase()}{viewInvoiceModal.method ? ` (${viewInvoiceModal.method})` : ''}</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px' }}><div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>CLIENT</div><div style={{ fontWeight: 900 }}>{viewInvoiceModal.client}</div></div>
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px' }}><div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', marginBottom: '4px' }}>SERVICE</div><div style={{ fontWeight: 900 }}>{viewInvoiceModal.type}</div></div>
          </div>
          <div style={{ background: '#f8fafc', borderRadius: '20px', overflow: 'hidden', border: '1px solid #f1f5f9' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={{ background: '#f1f5f9' }}><th style={{ padding: '12px 16px', textAlign: 'left', fontSize: '10px', fontWeight: 900 }}>ITEM</th><th style={{ padding: '12px', textAlign: 'center', fontSize: '10px', fontWeight: 900 }}>QTY</th><th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '10px', fontWeight: 900 }}>UNIT</th><th style={{ padding: '12px 16px', textAlign: 'right', fontSize: '10px', fontWeight: 900 }}>SUBTOTAL</th></tr></thead>
              <tbody>
                {viewInvoiceModal.items.map((item, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}><td style={{ padding: '12px 16px', fontWeight: 700, fontSize: '13px' }}>{item.name}</td><td style={{ padding: '12px', textAlign: 'center', fontWeight: 800 }}>{item.qty}</td><td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#64748b' }}>SAR {item.unit.toLocaleString()}</td><td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 900 }}>SAR {(item.qty * item.unit).toLocaleString()}</td></tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '16px 16px 16px', display: 'flex', justifyContent: 'flex-end' }}>
              <div style={{ fontSize: '18px', fontWeight: 950 }}>Total: <span style={{ color: '#0f172a' }}>SAR {viewInvoiceModal.total.toLocaleString()}</span></div>
            </div>
          </div>
        </Modal>
      )}

      {/* Fleet Logging Modals */}
      {modal === 'log-fuel' && (
        <Modal title="Log Fuel Entry" onClose={() => setModal(null)} size="sm">
          <div style={{ display: 'grid', gap: '20px' }}>
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>FUEL QUANTITY (LITERS)</label>
              <input type="number" className="form-control" placeholder="e.g. 55" style={{ width: '100%', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', fontWeight: 600 }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>TOTAL COST (SAR)</label>
              <input type="number" className="form-control" placeholder="e.g. 143.00" style={{ width: '100%', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', fontWeight: 600 }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>CURRENT ODOMETER</label>
              <input type="number" className="form-control" placeholder="e.g. 48200" style={{ width: '100%', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', fontWeight: 600 }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>STATION NAME / LOCATION</label>
              <input type="text" className="form-control" placeholder="e.g. Al-Noor Station" style={{ width: '100%', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', fontWeight: 600 }} />
            </div>
            <button className="btn btn-primary" style={{ height: '56px', borderRadius: '18px', background: '#0f172a', fontWeight: 900, marginTop: '8px' }} onClick={() => { toast('Fuel log recorded successfully', 'success'); setModal(null); }}>
              SAVE FUEL LOG
            </button>
          </div>
        </Modal>
      )}

      {modal === 'log-fault' && (
        <Modal title="Report Tactical Fault" onClose={() => setModal(null)} size="sm">
          <div style={{ display: 'grid', gap: '20px' }}>
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>FAULT CATEGORY</label>
              <select className="form-control" style={{ width: '100%', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', fontWeight: 600 }}>
                <option>Engine Issue</option>
                <option>Tire Damage</option>
                <option>Exterior Damage</option>
                <option>Interior Issue</option>
                <option>Other</option>
              </select>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>DESCRIPTION OF ISSUE</label>
              <textarea className="form-control" placeholder="Describe the fault or damage in detail..." style={{ width: '100%', height: '100px', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', fontWeight: 600 }}></textarea>
            </div>
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>UPLOAD EVIDENCE (PHOTO)</label>
              <button style={{ width: '100%', padding: '20px', borderRadius: '16px', border: '1.5px dashed #cbd5e1', background: '#f8fafc', color: '#64748b', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                <Smartphone size={20} /> Attach Photo
              </button>
            </div>
            <button className="btn btn-primary" style={{ height: '56px', borderRadius: '18px', background: '#ef4444', border: 'none', fontWeight: 900, marginTop: '8px' }} onClick={() => { toast('Fault report submitted', 'warning'); setModal(null); }}>
              SUBMIT FAULT REPORT
            </button>
          </div>
        </Modal>
      )}

      {modal === 'log-note' && (
        <Modal title="Mission Note" onClose={() => setModal(null)} size="sm">
          <div style={{ display: 'grid', gap: '20px' }}>
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>NOTE CONTENT</label>
              <textarea className="form-control" placeholder="General observations or notes during usage..." style={{ width: '100%', height: '150px', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', fontWeight: 600 }}></textarea>
            </div>
            <button className="btn btn-primary" style={{ height: '56px', borderRadius: '18px', background: '#8b5cf6', border: 'none', fontWeight: 900, marginTop: '8px' }} onClick={() => { toast('Mission note saved', 'success'); setModal(null); }}>
              SAVE MISSION NOTE
            </button>
          </div>
        </Modal>
      )}

    </div>
  )
}
