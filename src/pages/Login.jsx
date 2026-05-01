import { useState, useEffect } from 'react'
import { users } from '../data'
import { 
  Zap, 
  ShieldCheck, 
  Truck, 
  BarChart3, 
  Wallet, 
  Lock, 
  Mail, 
  ChevronRight, 
  Smartphone, 
  Activity, 
  User, 
  Key, 
  Building2, 
  Hammer,
  ArrowRight,
  AlertTriangle
} from 'lucide-react'

const TECHS = users.filter(u => u.role === 'Technician')

export default function Login({ onLogin }) {
  const [mode, setMode] = useState('admin')
  const [email, setEmail] = useState('smaliki@kirby.com')
  const [password, setPassword] = useState('')
  const [techId, setTechId] = useState('')
  const [pin, setPin] = useState('')
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const submit = () => {
    setErr('')
    setLoading(true)
    setTimeout(() => {
      if (mode === 'admin') {
        if (!password) { setErr('Credential verification failed. Enter password.'); setLoading(false); return }
        onLogin('admin', 12)
      } else {
        if (!techId) { setErr('Field ID selection required.'); setLoading(false); return }
        if (!pin)    { setErr('PIN verification required.'); setLoading(false); return }
        onLogin('technician', Number(techId))
      }
    }, 800)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      fontFamily: 'Outfit, sans-serif',
      opacity: mounted ? 1 : 0,
      transition: 'opacity 0.8s ease'
    }}>
      {/* ── Left Branding Matrix ── */}
      <div style={{
        width: '44%',
        background: '#0f172a',
        padding: '64px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        color: 'white'
      }}>
        {/* Animated Mesh Glows */}
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%)', filter: 'blur(40px)' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '64px' }}>
            <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #3b82f6, #10b981)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={28} color="white" />
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 950, letterSpacing: '-1px' }}>ACZONE</div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', letterSpacing: '2px' }}>OPERATIONS v2.0</div>
            </div>
          </div>

          <h1 style={{ fontSize: '48px', fontWeight: 950, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '24px' }}>
            Next-Gen<br />Logistics<br />Governance.
          </h1>
          <p style={{ fontSize: '18px', color: '#94a3b8', lineHeight: 1.6, marginBottom: '64px', maxWidth: '400px' }}>
            One unified platform for solar infrastructure, field team deployment, and fiscal intelligence.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {[
              { icon: BarChart3, label: 'Real-time Analytics' },
              { icon: Truck, label: 'Fleet Telemetry' },
              { icon: Wallet, label: 'Fiscal Manifests' },
              { icon: ShieldCheck, label: 'Secure Protocols' },
            ].map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <f.icon size={16} color="#3b82f6" />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#94a3b8' }}>{f.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: '64px', left: '64px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '6px 16px', borderRadius: '99px', fontSize: '12px', fontWeight: 900 }}>
            <Activity size={14} /> LIVE SYSTEMS NOMINAL
          </div>
        </div>
      </div>

      {/* ── Right Interaction Panel ── */}
      <div style={{ 
        flex: 1, 
        background: '#f8fafc', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        padding: '64px'
      }}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ marginBottom: '48px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a', letterSpacing: '-1.5px', marginBottom: '8px' }}>Authentication</h2>
            <p style={{ fontSize: '15px', color: '#64748b', fontWeight: 600 }}>Provision your access credentials below.</p>
          </div>

          {/* Mode Switcher */}
          <div style={{ 
            display: 'flex', 
            background: 'white', 
            padding: '6px', 
            borderRadius: '20px', 
            border: '1px solid #e2e8f0', 
            marginBottom: '32px',
            boxShadow: '0 4px 20px -5px rgba(0,0,0,0.05)'
          }}>
            {[
              { id: 'admin', label: 'Management', icon: Building2 },
              { id: 'tech', label: 'Field Team', icon: Hammer }
            ].map(m => (
              <button 
                key={m.id} 
                onClick={() => { setMode(m.id); setErr('') }}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '16px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 800,
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  background: mode === m.id ? '#0f172a' : 'transparent',
                  color: mode === m.id ? 'white' : '#64748b',
                  boxShadow: mode === m.id ? '0 10px 20px -5px rgba(15, 23, 42, 0.3)' : 'none'
                }}
              >
                <m.icon size={16} /> {m.label}
              </button>
            ))}
          </div>

          {/* Form Card */}
          <div className="glass-card" style={{ padding: '40px', borderRadius: '32px', marginBottom: '24px' }}>
            {mode === 'admin' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>ENTERPRISE EMAIL</label>
                  <div style={{ position: 'relative' }}>
                    <Mail style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} size={18} color="#94a3b8" />
                    <input 
                      className="form-control" 
                      style={{ paddingLeft: '48px', height: '56px', borderRadius: '18px', fontWeight: 600 }} 
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>PASSKEY</label>
                  <div style={{ position: 'relative' }}>
                    <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} size={18} color="#94a3b8" />
                    <input 
                      type="password"
                      className="form-control" 
                      style={{ paddingLeft: '48px', height: '56px', borderRadius: '18px', fontWeight: 900, letterSpacing: '4px' }} 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>FIELD IDENTITY</label>
                  <div style={{ position: 'relative' }}>
                    <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} size={18} color="#94a3b8" />
                    <select 
                      className="form-control" 
                      style={{ paddingLeft: '48px', height: '56px', borderRadius: '18px', fontWeight: 600, appearance: 'none' }} 
                      value={techId}
                      onChange={e => setTechId(e.target.value)}
                    >
                      <option value="">Select Technician...</option>
                      {TECHS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 900, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>OPERATIONAL PIN</label>
                  <div style={{ position: 'relative' }}>
                    <Key style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} size={18} color="#94a3b8" />
                    <input 
                      type="password"
                      className="form-control" 
                      style={{ paddingLeft: '48px', height: '56px', borderRadius: '18px', fontWeight: 900, letterSpacing: '8px' }} 
                      value={pin}
                      onChange={e => setPin(e.target.value)}
                      placeholder="••••"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {err && (
              <div style={{ marginTop: '24px', padding: '12px 16px', background: '#ef444415', color: '#ef4444', borderRadius: '14px', fontSize: '13px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={16} /> {err}
              </div>
            )}

            <button 
              onClick={submit} 
              disabled={loading}
              style={{
                width: '100%',
                height: '60px',
                marginTop: '32px',
                background: '#0f172a',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '15px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
                boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)',
                transition: 'all 0.3s'
              }}
            >
              {loading ? (
                'VERIFYING...'
              ) : (
                <>INITIALIZE SESSION <ArrowRight size={20} /></>
              )}
            </button>
          </div>

          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#94a3b8', fontWeight: 700 }}>
              Authorized Personnel Only. System activity is logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
