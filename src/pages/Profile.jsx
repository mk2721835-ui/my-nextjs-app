import { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Camera, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  Smartphone,
  Eye,
  EyeOff,
  CheckCircle,
  Activity,
  History,
  Zap,
  Star,
  Award
} from 'lucide-react'
import { useToast } from '../App'

export default function Profile() {
  const toast = useToast()
  const [tab, setTab] = useState('personal')
  const [showPass, setShowPass] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Mock user data
  const [user, setUser] = useState({
    name: 'Saud Al-Maliki',
    role: 'Administrator',
    email: 'saud@aczone.sa',
    phone: '+966 50 123 4567',
    location: 'Riyadh, Saudi Arabia',
    joined: 'Jan 2024',
    avatar: 'SM',
    bio: 'Lead system administrator for ACZone infrastructure. Focused on security, scalability, and operational excellence.'
  })

  useState(() => {
    setTimeout(() => setMounted(true), 100)
  }, [])

  const handleUpdate = (e) => {
    e.preventDefault()
    toast('Profile credentials updated successfully', 'success')
  }

  const handleSecurityUpdate = (e) => {
    e.preventDefault()
    toast('Security protocols recalibrated', 'info')
  }

  return (
    <div className="profile-page" style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh', opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease' }}>
      <header className="page-header" style={{ marginBottom: '40px' }}>
        <h1 className="page-title" style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a', margin: 0 }}>My Personal Identity</h1>
        <p className="page-subtitle" style={{ fontSize: '15px', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>Manage your account settings, security preferences and personal bio</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '32px' }}>
        {/* Left Side: Avatar & Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="glass-card" style={{ background: 'white', padding: '40px', borderRadius: '32px', textAlign: 'center', boxShadow: '0 4px 24px rgba(0,0,0,0.03)', border: '1.5px solid #f1f5f9' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 24px' }}>
              <div style={{ 
                width: '100%', height: '100%', borderRadius: '40px', 
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '42px', fontWeight: 950, boxShadow: '0 20px 40px rgba(37, 99, 235, 0.25)',
                transform: 'rotate(-5deg)'
              }}>
                {user.avatar}
              </div>
              <button style={{ 
                position: 'absolute', bottom: '-5px', right: '-5px',
                width: '40px', height: '40px', borderRadius: '15px',
                background: '#0f172a', color: 'white', border: '4px solid white',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
              >
                <Camera size={18} />
              </button>
            </div>
            <h2 style={{ fontSize: '24px', fontWeight: 950, color: '#0f172a', marginBottom: '8px' }}>{user.name}</h2>
            <div style={{ padding: '4px 12px', background: '#3b82f615', color: '#3b82f6', borderRadius: '10px', fontSize: '12px', fontWeight: 800, display: 'inline-block', marginBottom: '20px' }}>
              {user.role.toUpperCase()}
            </div>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>
              {user.bio}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="glass-card" style={{ background: 'white', padding: '32px', borderRadius: '32px', boxShadow: '0 4px 24px rgba(0,0,0,0.03)', border: '1.5px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '24px' }}>Account Authority</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award size={20} /></div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>Senior Admin</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>L3 Security Clearance</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f0f9ff', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Zap size={20} /></div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>Active Status</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Connected via Riyadh HUB-01</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fff7ed', color: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Shield size={20} /></div>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b' }}>2FA Enabled</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Last login: 20 min ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Settings Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{ background: 'white', padding: '8px', borderRadius: '20px', display: 'flex', gap: '8px', border: '1.5px solid #f1f5f9', width: 'fit-content' }}>
            {[
              { id: 'personal', label: 'Personal Information', icon: User },
              { id: 'security', label: 'Login & Security', icon: Lock },
              { id: 'preferences', label: 'Preferences', icon: Bell },
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 24px', borderRadius: '14px', border: 'none',
                  background: tab === t.id ? '#0f172a' : 'transparent',
                  color: tab === t.id ? 'white' : '#64748b',
                  fontWeight: 800, fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <t.icon size={18} /> {t.label}
              </button>
            ))}
          </div>

          <div style={{ background: 'white', borderRadius: '32px', border: '1.5px solid #f1f5f9', padding: '40px', boxShadow: '0 4px 30px rgba(0,0,0,0.02)' }}>
            {tab === 'personal' && (
              <form onSubmit={handleUpdate}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', margin: 0 }}>Identity Details</h3>
                  <button type="submit" className="btn btn-primary" style={{ borderRadius: '14px', padding: '12px 32px', fontWeight: 800 }}>Save Changes</button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.5px' }}>FULL LEGAL NAME</label>
                    <div style={{ position: 'relative' }}>
                      <User size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input className="form-control" value={user.name} onChange={e => setUser({...user, name: e.target.value})} style={{ paddingLeft: '48px', borderRadius: '16px', height: '52px', fontWeight: 700 }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.5px' }}>AUTHENTICATED EMAIL</label>
                    <div style={{ position: 'relative' }}>
                      <Mail size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input className="form-control" type="email" value={user.email} style={{ paddingLeft: '48px', borderRadius: '16px', height: '52px', fontWeight: 700 }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.5px' }}>MOBILE CONTACT</label>
                    <div style={{ position: 'relative' }}>
                      <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input className="form-control" value={user.phone} style={{ paddingLeft: '48px', borderRadius: '16px', height: '52px', fontWeight: 700 }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.5px' }}>BASE LOCATION</label>
                    <div style={{ position: 'relative' }}>
                      <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                      <input className="form-control" value={user.location} style={{ paddingLeft: '48px', borderRadius: '16px', height: '52px', fontWeight: 700 }} />
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginTop: '24px' }}>
                  <label className="form-label" style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.5px' }}>PROFESSIONAL BIOGRAPHY</label>
                  <textarea className="form-control" rows="4" value={user.bio} onChange={e => setUser({...user, bio: e.target.value})} style={{ borderRadius: '16px', padding: '16px', fontWeight: 600, resize: 'none' }} />
                </div>
              </form>
            )}

            {tab === 'security' && (
              <form onSubmit={handleSecurityUpdate}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                  <h3 style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', margin: 0 }}>Access Credentials</h3>
                  <button type="submit" className="btn btn-primary" style={{ borderRadius: '14px', padding: '12px 32px', fontWeight: 800 }}>Recalibrate Security</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1.5px solid #f1f5f9' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: '#1e293b', marginBottom: '4px' }}>Change Access Passkey</div>
                        <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Update your system password regularly to maintain security.</div>
                      </div>
                      <Shield size={24} color="#3b82f6" />
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8' }}>NEW PASSKEY</label>
                        <div style={{ position: 'relative' }}>
                          <input className="form-control" type={showPass ? 'text' : 'password'} placeholder="••••••••" style={{ borderRadius: '14px', height: '48px', fontWeight: 700 }} />
                          <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        </div>
                      </div>
                      <div className="form-group">
                        <label className="form-label" style={{ fontSize: '11px', fontWeight: 900, color: '#94a3b8' }}>CONFIRM PASSKEY</label>
                        <input className="form-control" type={showPass ? 'text' : 'password'} placeholder="••••••••" style={{ borderRadius: '14px', height: '48px', fontWeight: 700 }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', background: '#f0fdf4', borderRadius: '24px', border: '1.5px solid #dcfce7' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Smartphone size={24} /></div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: 900, color: '#166534' }}>Two-Factor Authentication</div>
                        <div style={{ fontSize: '13px', color: '#15803d', fontWeight: 600 }}>Secured via +966 •••• 567</div>
                      </div>
                    </div>
                    <div style={{ color: '#10b981', fontWeight: 900, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={16} /> ACTIVE
                    </div>
                  </div>

                  <div style={{ background: '#ffffff', padding: '24px', borderRadius: '24px', border: '1.5px solid #f1f5f9' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: 900, color: '#1e293b', marginBottom: '16px' }}>Active System Sessions</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <Smartphone size={18} color="#3b82f6" />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 800 }}>iPhone 15 Pro - Riyadh</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Last active: Now</div>
                          </div>
                        </div>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444', fontWeight: 800 }}>Logout</button>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#f8fafc', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                          <Globe size={18} color="#3b82f6" />
                          <div>
                            <div style={{ fontSize: '14px', fontWeight: 800 }}>Chrome on macOS - Dammam</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>Last active: 2 hours ago</div>
                          </div>
                        </div>
                        <button className="btn btn-ghost btn-sm" style={{ color: '#ef4444', fontWeight: 800 }}>Logout</button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {tab === 'preferences' && (
              <div>
                <h3 style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', marginBottom: '32px' }}>System Preferences</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', background: '#f8fafc', borderRadius: '24px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#1e293b', marginBottom: '4px' }}>Push Notifications</div>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Receive real-time alerts for critical system events.</div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', background: '#f8fafc', borderRadius: '24px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#1e293b', marginBottom: '4px' }}>Email Reports</div>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Daily summary of operational performance and financials.</div>
                    </div>
                    <label className="switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider round"></span>
                    </label>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px', background: '#f8fafc', borderRadius: '24px' }}>
                    <div>
                      <div style={{ fontSize: '16px', fontWeight: 900, color: '#1e293b', marginBottom: '4px' }}>Language & Localization</div>
                      <div style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Current: English (KSA). Support for Arabic coming soon.</div>
                    </div>
                    <select className="form-control" style={{ width: '150px', borderRadius: '12px', fontWeight: 800 }}>
                      <option>English</option>
                      <option disabled>Arabic</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
