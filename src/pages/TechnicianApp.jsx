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
  Target,
  Wrench,
  Key,
  Smartphone,
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

const JOB_ICONS = t => (t || '').includes('Solar') ? '☀️' : (t || '').includes('Water') ? '💧' : (t || '').includes('Battery') ? '🔋' : '🔧'

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

  useEffect(() => { setMounted(true) }, [])

  const stats = useMemo(() => ({
    active: myJobs.filter(j => j.status === 'In Progress').length,
    completed: myJobs.filter(j => j.status === 'Completed').length,
    pending: myParts.filter(p => p.status === 'Pending').length,
    new: myJobs.filter(j => j.status === 'Scheduled').length
  }), [myJobs, myParts])

  const [teamForm, setTeamForm] = useState({ name: '', members: [] })
  const otherTechs = users.filter(u => u.role === 'Technician' && u.id !== techUser.id)

  const myVehicleAssign = useMemo(() => vehicleAssignments.find(a => a.techId === techUser.id && a.status === 'Active'), [techUser.id])
  const myVehicle = myVehicleAssign ? vehicles.find(v => v.id === myVehicleAssign.vehicleId) : null

  const selectedJob = myJobs.find(j => j.id === selectedJobId)

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      display: 'flex', 
      flexDirection: 'column',
      opacity: mounted ? 1 : 0, 
      transition: 'opacity 0.6s ease',
      fontFamily: 'Outfit, sans-serif',
      paddingBottom: '80px', 
      maxWidth: '500px', 
      margin: '0 auto',
      position: 'relative',
      boxShadow: '0 0 40px rgba(0,0,0,0.05)',
      overflow: 'hidden'
    }}>
      {/* Mobile Top Header */}
      <header style={{
        padding: '16px 20px',
        background: 'white',
        borderBottom: '1px solid #f1f5f9',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: techUser.color, 
            color: 'white', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            fontWeight: 950,
            fontSize: '12px',
            boxShadow: `0 4px 10px ${techUser.color}30`
          }}>
            {techUser.initials}
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 900, color: '#0f172a' }}>{techUser.name}</div>
            <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600 }}>{techUser.specialty}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button style={{ 
            width: '36px', 
            height: '36px', 
            borderRadius: '10px', 
            background: '#f1f5f9', 
            border: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: '#64748b'
          }} onClick={onLogout}>
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>

        {nav === 'dashboard' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Quick Summary Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Tasks', val: stats.active, icon: Target, color: '#3B82F6' },
                { label: 'Done', val: stats.completed, icon: CheckCircle, color: '#10B981' },
                { label: 'Cash', val: `SAR ${myCashBalance.remainingBalance}`, icon: Wallet, color: '#F59E0B' },
              ].map((s) => (
                <div key={s.label} style={{ background: 'white', padding: '12px', borderRadius: '16px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                  <div style={{ color: s.color, marginBottom: '4px' }}><s.icon size={18} style={{ margin: '0 auto' }} /></div>
                  <div style={{ fontSize: '16px', fontWeight: 950, color: '#0f172a' }}>{s.label === 'Cash' ? (myCashBalance.remainingBalance > 1000 ? (myCashBalance.remainingBalance / 1000).toFixed(1) + 'k' : myCashBalance.remainingBalance) : s.val}</div>
                  <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8' }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>

            {/* Current Job Focus */}
            <section>
              <h3 style={{ fontSize: '16px', fontWeight: 950, margin: '0 0 12px 0' }}>Ongoing Mission</h3>
              {myJobs.filter(j => j.status === 'In Progress').slice(0, 1).map(job => (
                <div key={job.id} onClick={() => { setSelectedJobId(job.id); }} className="glass-card" style={{ padding: '20px', borderRadius: '24px', background: '#0f172a', color: 'white' }}>
                  <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                      {JOB_ICONS(job.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '15px', fontWeight: 950 }}>{job.type}</div>
                      <div style={{ fontSize: '12px', fontWeight: 600, opacity: 0.6 }}>{job.client}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', opacity: 0.6, fontSize: '12px', fontWeight: 600 }}>
                    <MapPin size={14} /> {job.city}
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); setSelectedJobId(job.id); }} className="btn btn-primary" style={{ width: '100%', marginTop: '16px', borderRadius: '12px', height: '44px', background: '#3b82f6' }}>OPEN JOB DETAILS</button>
                </div>
              ))}
              {myJobs.filter(j => j.status === 'In Progress').length === 0 && (
                <div style={{ textAlign: 'center', padding: '32px', background: 'white', borderRadius: '24px', border: '1px solid #f1f5f9', color: '#94a3b8', fontSize: '13px', fontWeight: 700 }}>No active mission at the moment.</div>
              )}
            </section>

            {/* Upcoming Jobs (Admin Assigned) */}
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 950, margin: 0 }}>Missions from HQ</h3>
                <span style={{ fontSize: '10px', fontWeight: 900, color: '#3b82f6', background: '#3b82f615', padding: '2px 8px', borderRadius: '6px' }}>NEW: {stats.new}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {myJobs.filter(j => j.status === 'Scheduled').slice(0, 3).map(job => (
                  <div key={job.id} onClick={() => setSelectedJobId(job.id)} style={{ background: 'white', padding: '16px', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
                    {job.invitedBy && (
                      <div style={{ position: 'absolute', top: '-8px', right: '12px', background: '#8b5cf6', color: 'white', fontSize: '8px', fontWeight: 900, padding: '2px 8px', borderRadius: '6px', boxShadow: '0 4px 8px rgba(139, 92, 246, 0.3)' }}>
                        INVITED BY {job.invitedBy.toUpperCase()}
                      </div>
                    )}
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                      {JOB_ICONS(job.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '14px', fontWeight: 900 }}>{job.type}</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{job.client} · {job.city}</div>
                    </div>
                    <ArrowRight size={16} color="#cbd5e1" />
                  </div>
                ))}
              </div>
            </section>

            {/* Team Collaboration */}
            <section style={{ background: 'white', padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                 <div>
                   <h3 style={{ fontSize: '15px', fontWeight: 950, margin: 0 }}>Team Operations</h3>
                   <p style={{ fontSize: '10px', color: '#94a3b8', margin: 0, fontWeight: 700 }}>Collaborate with other specialists</p>
                 </div>
                 <button onClick={() => setModal('create_team')} style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#8b5cf6', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                   <Users size={18} />
                 </button>
               </div>
               <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0' }}>
                 {otherTechs.slice(0, 5).map(t => (
                   <div key={t.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', minWidth: '60px' }}>
                     <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: t.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '12px', boxShadow: `0 4px 8px ${t.color}20` }}>{t.initials}</div>
                     <span style={{ fontSize: '9px', fontWeight: 800, color: '#64748b' }}>{t.name.split(' ')[0]}</span>
                   </div>
                 ))}
                 <div style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}><Plus size={16} /></div>
               </div>
            </section>

            {/* Wallet Info */}
            <div onClick={() => setNav('invoices')} style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
              padding: '20px', 
              borderRadius: '24px', 
              color: 'white',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '10px', fontWeight: 800, opacity: 0.8, letterSpacing: '1px' }}>MY FIELD WALLET</div>
                <div style={{ fontSize: '24px', fontWeight: 950 }}>SAR {myCashBalance.remainingBalance.toLocaleString()}</div>
              </div>
              <Wallet size={32} opacity={0.3} />
            </div>
          </div>
        )}

        {nav === 'jobs' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: 950, margin: '0 0 8px 0' }}>All Tasks</h3>
            {myJobs.map(job => {
              const meta = STATUS_META[job.status] || STATUS_META['Scheduled']
              return (
                <div key={job.id} onClick={() => setSelectedJobId(job.id)} className="glass-card" style={{ padding: '16px', borderRadius: '20px', borderLeft: `5px solid ${PRIORITY_COLORS[job.priority]}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace' }}>{job.id}</span>
                    <span style={{ fontSize: '9px', fontWeight: 900, color: meta.color, background: `${meta.color}15`, padding: '2px 8px', borderRadius: '6px' }}>{job.status.toUpperCase()}</span>
                  </div>
                  <div style={{ fontSize: '16px', fontWeight: 950, marginBottom: '2px' }}>{job.type}</div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>{job.client} · {job.city}</div>
                </div>
              )
            })}
          </div>
        )}

        {nav === 'vehicle' && myVehicle && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#0f172a', padding: '24px', borderRadius: '24px', color: 'white', textAlign: 'center' }}>
              <Truck size={48} color="#3b82f6" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '20px', fontWeight: 950 }}>{myVehicle.model}</div>
              <div style={{ fontSize: '13px', opacity: 0.6, fontFamily: 'monospace' }}>{myVehicle.plate}</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 950 }}>{myVehicle.odometerCurrent.toLocaleString()}</div>
                  <div style={{ fontSize: '8px', opacity: 0.5, fontWeight: 800 }}>KM TOTAL</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 950, color: '#10b981' }}>READY</div>
                  <div style={{ fontSize: '8px', opacity: 0.5, fontWeight: 800 }}>STATUS</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left' }} onClick={() => setModal('log-fuel')}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#3b82f615', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Fuel size={18} /></div>
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 800 }}>Log Fuel / Expenses</div>
                <ChevronRight size={16} color="#cbd5e1" />
              </button>
              <button className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', cursor: 'pointer', textAlign: 'left' }} onClick={() => setModal('log-fault')}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ef444415', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle size={18} /></div>
                <div style={{ flex: 1, fontSize: '14px', fontWeight: 800 }}>Report Damage</div>
                <ChevronRight size={16} color="#cbd5e1" />
              </button>
            </div>
          </div>
        )}

        {nav === 'parts' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 950, margin: 0 }}>Parts Orders</h3>
              <button onClick={() => setShowPartsModal(true)} style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#0f172a', color: 'white', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Plus size={18} /></button>
            </div>
            {myParts.map(p => (
              <div key={p.id} className="glass-card" style={{ padding: '16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: p.status === 'Approved' ? '#10b98115' : '#f59e0b15', color: p.status === 'Approved' ? '#10b981' : '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Box size={18} /></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 900 }}>{p.part}</div>
                  <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700 }}>QTY: {p.qty} · {p.date}</div>
                </div>
                <div style={{ fontSize: '9px', fontWeight: 900, color: p.status === 'Approved' ? '#10b981' : '#f59e0b' }}>{p.status.toUpperCase()}</div>
              </div>
            ))}
          </div>
        )}

        {nav === 'invoices' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: '#0f172a', padding: '24px', borderRadius: '24px', color: 'white' }}>
              <div style={{ fontSize: '10px', fontWeight: 800, opacity: 0.6, letterSpacing: '1px' }}>CASH ON HAND</div>
              <div style={{ fontSize: '28px', fontWeight: 950, margin: '4px 0' }}>SAR {myCashBalance.remainingBalance.toLocaleString()}</div>
              <button onClick={() => setShowCashSubmitModal(true)} style={{ width: '100%', marginTop: '12px', padding: '12px', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontWeight: 900, fontSize: '13px' }}>SUBMIT TO OFFICE</button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 950, margin: 0 }}>Payments</h3>
              <button onClick={() => setShowInvoiceModal(true)} style={{ fontSize: '11px', fontWeight: 800, color: '#3b82f6', background: 'none', border: 'none' }}>+ NEW INVOICE</button>
            </div>

            {myInvoices.map(inv => (
              <div key={inv.id} onClick={() => setViewInvoiceModal(inv)} className="glass-card" style={{ padding: '16px', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: inv.status === 'Paid' ? '#10b98115' : '#f1f5f9', color: inv.status === 'Paid' ? '#10b981' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Receipt size={18} /></div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 900 }}>{inv.client}</div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>{inv.date} · {inv.method || 'Pending'}</div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '15px', fontWeight: 950 }}>SAR {inv.total}</div>
                  <div style={{ fontSize: '9px', fontWeight: 900, color: inv.status === 'Paid' ? '#10b981' : '#f59e0b' }}>{inv.status.toUpperCase()}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {nav === 'salary' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '4px' }}>ESTIMATED PAYOUT</div>
              <div style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a' }}>SAR 9,450</div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '20px' }}>
                <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '16px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 900 }}>SAR 8,500</div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#94a3b8' }}>BASE SALARY</div>
                </div>
                <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: '16px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#10b981' }}>SAR 1,200</div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#10b981' }}>BONUSES</div>
                </div>
                <div style={{ background: '#fff1f2', padding: '12px', borderRadius: '16px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#ef4444' }}>- SAR 250</div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#ef4444' }}>DEDUCTIONS</div>
                </div>
                <div style={{ background: '#f5f3ff', padding: '12px', borderRadius: '16px' }}>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#8b5cf6' }}>98%</div>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#8b5cf6' }}>SCORE</div>
                </div>
              </div>
            </div>

            <div style={{ background: '#fefce8', padding: '16px', borderRadius: '20px', border: '1px solid #fef08a', display: 'flex', gap: '12px' }}>
              <AlertTriangle size={18} color="#eab308" />
              <div style={{ fontSize: '11px', fontWeight: 700, color: '#854d0e', lineHeight: 1.4 }}>
                Deductions include fleet maintenance surcharges and tool replacements. Bonuses are calculated based on job completion speed and client ratings.
              </div>
            </div>

            <h3 style={{ fontSize: '16px', fontWeight: 950, margin: '8px 0' }}>Payment History</h3>
            {[
              { month: 'April', total: 9700, date: 'May 01' },
              { month: 'March', total: 9200, date: 'Apr 01' }
            ].map(s => (
              <div key={s.month} style={{ background: 'white', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '15px', fontWeight: 900 }}>{s.month} 2026</div>
                  <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>Transferred on {s.date}</div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: 950, color: '#10b981' }}>SAR {s.total}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <nav style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '500px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderTop: '1px solid #f1f5f9',
        height: '70px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0 10px',
        zIndex: 1000
      }}>
        {[
          { id: 'dashboard', icon: LayoutDashboard, label: 'Home' },
          { id: 'jobs', icon: ClipboardList, label: 'Tasks' },
          { id: 'vehicle', icon: Truck, label: 'Fleet' },
          { id: 'invoices', icon: Wallet, label: 'Wallet' },
          { id: 'salary', icon: DollarSign, label: 'Salary' },
        ].map(item => {
          const isActive = nav === item.id
          return (
            <button 
              key={item.id}
              onClick={() => { setNav(item.id); setSelectedJobId(null) }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                background: 'none',
                border: 'none',
                color: isActive ? '#3b82f6' : '#94a3b8',
                padding: '4px',
                cursor: 'pointer',
                transition: 'all 0.3s',
                width: '55px'
              }}
            >
              <item.icon size={isActive ? 22 : 20} strokeWidth={isActive ? 2.5 : 2} />
              <span style={{ fontSize: '9px', fontWeight: isActive ? 900 : 700 }}>{item.label}</span>
            </button>
          )
        })}
      </nav>

      {/* Mobile-Friendly Job Full-Screen Overlay */}
      {selectedJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '500px',
          height: '100%',
          background: '#f8fafc',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideUp 0.3s ease-out'
        }}>
          <div style={{ padding: '16px 20px', background: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 950, margin: 0 }}>Mission Matrix</h3>
            <button onClick={() => setSelectedJobId(null)} style={{ background: '#f8fafc', border: 'none', padding: '6px 12px', borderRadius: '10px', fontSize: '11px', fontWeight: 900 }}>CLOSE</button>
          </div>
          
          <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ background: '#0f172a', padding: '20px', borderRadius: '24px', color: 'white' }}>
              <div style={{ fontSize: '10px', fontWeight: 900, color: '#3b82f6', fontFamily: 'monospace' }}>{selectedJob.id}</div>
              <div style={{ fontSize: '20px', fontWeight: 950, margin: '4px 0' }}>{selectedJob.type}</div>
              <div style={{ fontSize: '14px', fontWeight: 800, opacity: 0.7 }}>{selectedJob.client}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', opacity: 0.6, fontSize: '12px', fontWeight: 600, marginTop: '12px' }}>
                <MapPin size={14} /> {selectedJob.city}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <button onClick={() => toast(`Calling ${selectedJob.client}...`, 'info')} style={{ height: '48px', borderRadius: '14px', background: '#f0f9ff', color: '#3b82f6', border: 'none', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '13px' }}>
                <Smartphone size={18} /> CALL
              </button>
              <button onClick={() => toast('Navigation started...', 'info')} style={{ height: '48px', borderRadius: '14px', background: '#f0fdf4', color: '#10b981', border: 'none', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', fontSize: '13px' }}>
                <Navigation size={18} /> NAVIGATE
              </button>
            </div>

            <div style={{ background: 'white', padding: '20px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>FIELD DIAGNOSTICS</label>
              <textarea className="form-control" placeholder="Update job status, findings..." style={{ width: '100%', height: '100px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '12px', fontWeight: 600, fontSize: '13px' }}></textarea>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '16px' }}>
                <button onClick={() => toast('Status: In Progress', 'info')} style={{ height: '44px', borderRadius: '12px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 900, fontSize: '13px' }}>START WORK</button>
                <button onClick={() => { toast('Job Finished', 'success'); setSelectedJobId(null); }} style={{ height: '44px', borderRadius: '12px', background: '#10b981', color: 'white', border: 'none', fontWeight: 900, fontSize: '13px' }}>COMPLETE</button>
              </div>
            </div>

            <button onClick={() => { setShowPartsModal(true); }} style={{ width: '100%', height: '50px', borderRadius: '16px', background: 'white', border: '1px solid #e2e8f0', color: '#64748b', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <Wrench size={18} /> REQUEST PARTS
            </button>
            
            <button onClick={() => { setShowInvoiceModal(true); }} style={{ width: '100%', height: '50px', borderRadius: '16px', background: '#0f172a', color: 'white', border: 'none', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
              <Receipt size={18} /> COLLECT PAYMENT
            </button>
          </div>
        </div>
      )}

      {/* Refactored Modals for Mobile */}

      {showPartsModal && (
        <Modal title="Parts Request" onClose={() => setShowPartsModal(false)} size="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {partsForm.items.map((item, idx) => (
              <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 60px', gap: '8px' }}>
                <select className="form-control" value={item.part} onChange={e => { const items = [...partsForm.items]; items[idx].part = e.target.value; setPartsForm(f => ({ ...f, items })) }} style={{ borderRadius: '14px', padding: '14px', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: '13px' }}>
                  <option value="">Select Part...</option>
                  {spareParts.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
                <input className="form-control" type="number" value={item.qty} onChange={e => { const items = [...partsForm.items]; items[idx].qty = +e.target.value; setPartsForm(f => ({ ...f, items })) }} style={{ borderRadius: '14px', padding: '14px', border: '1px solid #e2e8f0', fontWeight: 900, textAlign: 'center', fontSize: '13px' }} />
              </div>
            ))}
            <button onClick={() => setPartsForm(f => ({ ...f, items: [...f.items, { part: '', qty: 1 }] }))} style={{ width: '100%', padding: '10px', border: '1px dashed #cbd5e1', background: 'transparent', borderRadius: '14px', fontSize: '12px', fontWeight: 800, color: '#3b82f6' }}>+ ADD ANOTHER PART</button>
            
            <textarea className="form-control" placeholder="Reason for request..." value={partsForm.reason} onChange={e => setPartsForm(f => ({ ...f, reason: e.target.value }))} style={{ width: '100%', height: '80px', borderRadius: '14px', border: '1px solid #e2e8f0', padding: '14px', fontWeight: 600, fontSize: '13px' }}></textarea>
            
            <button onClick={() => { 
              if (partsForm.items.some(i => !i.part)) { toast('Please select parts', 'warning'); return }
              toast('Parts Request Submitted', 'success'); 
              setShowPartsModal(false);
              setPartsForm({ items: [{ part: '', qty: 1 }], reason: '' });
            }} style={{ width: '100%', height: '56px', borderRadius: '18px', background: '#0f172a', color: 'white', border: 'none', fontWeight: 950, fontSize: '15px', marginTop: '10px' }}>SUBMIT REQUEST</button>
          </div>
        </Modal>
      )}

      {/* Invoice Creation Modal */}
      {showInvoiceModal && (
        <Modal title="Create Invoice" onClose={() => setShowInvoiceModal(false)} size="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <select className="form-control" value={invForm.clientId} onChange={e => setInvForm(f => ({ ...f, clientId: e.target.value }))} style={{ borderRadius: '14px', padding: '14px', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: '13px' }}>
                <option value="">Client</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <select className="form-control" value={invForm.service} onChange={e => setInvForm(f => ({ ...f, service: e.target.value }))} style={{ borderRadius: '14px', padding: '14px', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: '13px' }}>
                <option value="">Service</option>
                <option>Maintenance</option><option>Repair</option><option>Installation</option>
              </select>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '20px', border: '1px solid #f1f5f9' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                 <div style={{ fontSize: '11px', fontWeight: 900, color: '#0f172a' }}>LINE ITEMS</div>
                 <button onClick={() => setInvForm(f => ({ ...f, items: [...f.items, { name: '', qty: 1, unit: 0 }] }))} style={{ fontSize: '10px', fontWeight: 950, color: '#3b82f6', background: 'transparent', border: 'none', cursor: 'pointer' }}>+ ADD</button>
               </div>
               {invForm.items.map((item, idx) => (
                 <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '6px', marginBottom: '6px' }}>
                   <input className="form-control" placeholder="Description" value={item.name} onChange={e => { const items = [...invForm.items]; items[idx].name = e.target.value; setInvForm(f => ({ ...f, items })) }} style={{ borderRadius: '10px', padding: '10px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 600 }} />
                   <input className="form-control" type="number" placeholder="SAR" value={item.unit} onChange={e => { const items = [...invForm.items]; items[idx].unit = +e.target.value; setInvForm(f => ({ ...f, items })) }} style={{ borderRadius: '10px', padding: '10px', border: '1px solid #e2e8f0', fontWeight: 900, textAlign: 'center', fontSize: '12px' }} />
                 </div>
               ))}
            </div>

            <div style={{ background: '#0f172a', padding: '18px', borderRadius: '20px', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <span style={{ fontSize: '12px', fontWeight: 800, opacity: 0.6 }}>TOTAL AMOUNT</span>
               <span style={{ fontSize: '24px', fontWeight: 950 }}>SAR {invTotal.toLocaleString()}</span>
            </div>

            <button onClick={() => { 
                if (!invForm.clientId || invTotal <= 0) { toast('Please complete invoice', 'warning'); return }
                const cl = clients.find(c => c.id === Number(invForm.clientId))
                if (!cl) { toast('Invalid client selected', 'error'); return }
                const newInv = { id: `INV-${Date.now().toString().slice(-4)}`, client: cl.name, total: invTotal, status: 'Paid', date: new Date().toISOString().slice(0,10), items: invForm.items }
                setMyInvoices(prev => [newInv, ...prev])
                setMyCashBalance(b => ({ ...b, remainingBalance: b.remainingBalance + invTotal }))
                toast(`Invoice created & Cash collected`, 'success')
                setShowInvoiceModal(false)
             }} style={{ width: '100%', height: '56px', borderRadius: '18px', background: '#3b82f6', color: 'white', border: 'none', fontWeight: 950, fontSize: '15px' }}>GENERATE & COLLECT</button>
          </div>
        </Modal>
      )}

      {showPayCollectModal && (
        <Modal title="Collect Payment" onClose={() => setShowPayCollectModal(null)} size="sm">
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#10b98115', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}><Wallet size={28} /></div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>AMOUNT DUE</div>
            <div style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a' }}>SAR {showPayCollectModal.total.toLocaleString()}</div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#64748b', marginTop: '4px', marginBottom: '20px' }}>{showPayCollectModal.client}</div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <button onClick={() => {
                const inv = showPayCollectModal
                setMyInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'Paid', paid: i.total, method: 'Cash' } : i))
                setMyCashBalance(b => ({ ...b, remainingBalance: b.remainingBalance + inv.total }))
                toast(`SAR ${inv.total.toLocaleString()} Cash Collected`, 'success')
                setShowPayCollectModal(null)
              }} style={{ height: '56px', borderRadius: '16px', background: '#10b981', color: 'white', border: 'none', fontWeight: 950, fontSize: '15px' }}>CASH COLLECTED</button>
              
              <button onClick={() => {
                const inv = showPayCollectModal
                setMyInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status: 'Paid', paid: i.total, method: 'Online' } : i))
                toast(`Online Payment Confirmed`, 'success')
                setShowPayCollectModal(null)
              }} style={{ height: '56px', borderRadius: '16px', background: 'white', color: '#0f172a', border: '1px solid #e2e8f0', fontWeight: 950, fontSize: '15px' }}>ONLINE / CARD</button>
            </div>
          </div>
        </Modal>
      )}

      {showCashSubmitModal && (
        <Modal title="Office Handover" onClose={() => setShowCashSubmitModal(false)} size="sm">
          <div style={{ textAlign: 'center', padding: '10px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: '#f59e0b15', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}><Banknote size={32} /></div>
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#64748b', letterSpacing: '1px', marginBottom: '4px' }}>CASH TO SUBMIT</div>
            <div style={{ fontSize: '36px', fontWeight: 950, color: '#0f172a', marginBottom: '20px' }}>SAR {myCashBalance.remainingBalance.toLocaleString()}</div>
            
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '18px', textAlign: 'left', marginBottom: '24px', border: '1px solid #f1f5f9' }}>
               <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', lineHeight: 1.5 }}>By clicking confirm, you acknowledge that this physical cash amount has been handed over to the authorized accounting personnel at the office.</div>
            </div>

            <button onClick={() => { 
              setMyCashBalance(b => ({ ...b, submittedToAccounting: b.submittedToAccounting + b.remainingBalance, remainingBalance: 0 }))
              toast('Cash submission recorded', 'success')
              setShowCashSubmitModal(false)
            }} style={{ width: '100%', height: '56px', borderRadius: '18px', background: '#10b981', color: 'white', border: 'none', fontWeight: 950, fontSize: '15px' }}>CONFIRM HANDOVER</button>
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

      {modal === 'create_team' && (
        <Modal title="Form a Task Force" onClose={() => setModal(null)} size="md">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>TEAM NAME</label>
              <input className="form-control" placeholder="e.g. Rapid Repair Squad" value={teamForm.name} onChange={e => setTeamForm(f => ({ ...f, name: e.target.value }))} style={{ width: '100%', borderRadius: '16px', padding: '16px', border: '1px solid #e2e8f0', fontWeight: 700, fontSize: '14px' }} />
            </div>
            <div className="form-group">
              <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', marginBottom: '8px', display: 'block' }}>SELECT COLLEAGUES</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '250px', overflowY: 'auto' }}>
                {otherTechs.map(t => (
                  <label key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '16px', border: `1px solid ${teamForm.members.includes(t.id) ? '#8b5cf6' : '#f1f5f9'}`, background: teamForm.members.includes(t.id) ? '#8b5cf608' : 'white', cursor: 'pointer' }}>
                    <input type="checkbox" checked={teamForm.members.includes(t.id)} onChange={e => {
                      if(e.target.checked) setTeamForm(f => ({ ...f, members: [...f.members, t.id] }))
                      else setTeamForm(f => ({ ...f, members: f.members.filter(id => id !== t.id) }))
                    }} style={{ width: '18px', height: '18px' }} />
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: t.color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '11px' }}>{t.initials}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 800 }}>{t.name}</div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700 }}>{t.specialty}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
            <button className="btn btn-primary" style={{ height: '56px', borderRadius: '18px', background: '#8b5cf6', fontWeight: 950, fontSize: '15px' }} onClick={() => {
              if(!teamForm.name || teamForm.members.length === 0) { toast('Please name the team and select members', 'warning'); return }
              toast(`Team "${teamForm.name}" created!`, 'success')
              setModal(null)
              setTeamForm({ name: '', members: [] })
            }}>CREATE TASK FORCE</button>
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

      {/* Internal CSS for Animations & UI Polish */}
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .btn-ghost {
          background: #f8fafc;
          border: 1px solid #f1f5f9;
          color: #64748b;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-ghost:active { transform: scale(0.95); background: #f1f5f9; }
        .btn-primary {
          color: white;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-weight: 800;
          transition: all 0.2s ease;
        }
        .btn-primary:active { transform: scale(0.98); }
        main::-webkit-scrollbar { display: none; }
        .glass-card {
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
      `}</style>
    </div>
  )
}
