import { useState } from 'react'
import { 
  Shield, 
  Lock, 
  Eye, 
  Edit3, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Search,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Key,
  Users,
  AlertTriangle,
  History,
  Activity,
  UserPlus,
  Settings as SettingsIcon,
  Mail,
  Phone,
  FolderPlus,
  ArrowRight,
  Globe,
  Info
} from 'lucide-react'
import { users as initialUsers } from '../data'

// Initial data moved to state
const INITIAL_ROLES = [
  { id: 'r1', name: 'MANAGEMENT', description: 'Executive oversight and strategic decision making', users: 1, level: 'System', permissions: {} },
  { id: 'r2', name: 'ADMIN', description: 'Full administrative control and system configuration', users: 2, level: 'System', permissions: {} },
  { id: 'r3', name: 'ACCOUNTANT', description: 'Financial auditing, payroll and fiscal management', users: 1, level: 'Department', permissions: {} },
  { id: 'r4', name: 'ENGINEER', description: 'Technical architecture and complex problem solving', users: 1, level: 'Department', permissions: {} },
  { id: 'r5', name: 'HR', description: 'Personnel management and organizational culture', users: 0, level: 'Department', permissions: {} },
]

const INITIAL_SCHEMA = [
  { module: 'User Management', permissions: ['View', 'Create', 'Edit', 'Delete', 'Audit'] },
  { module: 'Financials', permissions: ['View', 'Create', 'Edit', 'Approve'] },
  { module: 'Inventory', permissions: ['View', 'Create', 'Edit', 'Stock-Out'] },
  { module: 'Fleet', permissions: ['View', 'Assign', 'Telemetry', 'Maintenance'] },
  { module: 'Settings', permissions: ['View', 'Edit Roles', 'System Config'] },
]

export default function Settings() {
  const [tab, setTab] = useState('roles')
  const [roles, setRoles] = useState(INITIAL_ROLES)
  const [schema, setSchema] = useState(INITIAL_SCHEMA)
  const [selectedRoleId, setSelectedRoleId] = useState(roles[0].id)
  const [search, setSearch] = useState('')
  const [userSearch, setUserSearch] = useState('')
  const [users, setUsers] = useState(initialUsers)
  const [modal, setModal] = useState(null) 
  const [editItem, setEditItem] = useState(null)

  const selectedRole = roles.find(r => r.id === selectedRoleId) || roles[0]

  const handleDeleteRole = (id) => {
    if (id === 'r1') return alert("Cannot delete System Super Admin")
    if (window.confirm("Are you sure you want to delete this role? All assigned permissions will be lost.")) {
      setRoles(roles.filter(r => r.id !== id))
      if (selectedRoleId === id) setSelectedRoleId(roles[0].id)
    }
  }

  const togglePermission = (roleId, module, perm) => {
    if (roleId === 'r1') return 
    setRoles(roles.map(r => {
      if (r.id === roleId) {
        const rolePerms = { ...r.permissions }
        if (!rolePerms[module]) rolePerms[module] = []
        
        if (rolePerms[module].includes(perm)) {
          rolePerms[module] = rolePerms[module].filter(p => p !== perm)
        } else {
          rolePerms[module] = [...rolePerms[module], perm]
        }
        return { ...r, permissions: rolePerms }
      }
      return r
    }))
  }

  const isPermActive = (role, module, perm) => {
    if (role.id === 'r1') return true
    return role.permissions[module]?.includes(perm)
  }

  const handleAddRole = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newRole = {
      id: `r${Date.now()}`,
      name: formData.get('name').toUpperCase(),
      description: formData.get('description'),
      level: formData.get('level'),
      users: 0,
      permissions: {}
    }
    setRoles([...roles, newRole])
    setModal(null)
  }

  const handleEditRole = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    setRoles(roles.map(r => {
      if (r.id === editItem.id) {
        return {
          ...r,
          name: formData.get('name').toUpperCase(),
          description: formData.get('description'),
          level: formData.get('level'),
        }
      }
      return r
    }))
    setModal(null)
    setEditItem(null)
  }

  const handleAddCategory = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const moduleName = formData.get('module')
    if (schema.find(s => s.module === moduleName)) return alert("Category already exists")
    setSchema([...schema, { module: moduleName, permissions: [] }])
    setModal(null)
  }

  const handleEditCategory = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newName = formData.get('module')
    const oldName = editItem.module

    setSchema(schema.map(s => s.module === oldName ? { ...s, module: newName } : s))
    
    setRoles(roles.map(r => {
      const rolePerms = { ...r.permissions }
      if (rolePerms[oldName]) {
        rolePerms[newName] = rolePerms[oldName]
        delete rolePerms[oldName]
      }
      return { ...r, permissions: rolePerms }
    }))

    setModal(null)
    setEditItem(null)
  }

  const handleDeleteCategory = (moduleName) => {
    if (window.confirm(`Delete entire category "${moduleName}" and all its permissions?`)) {
      setSchema(schema.filter(s => s.module !== moduleName))
      setRoles(roles.map(r => {
        const rolePerms = { ...r.permissions }
        delete rolePerms[moduleName]
        return { ...r, permissions: rolePerms }
      }))
    }
  }

  const handleAddPermission = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const moduleName = formData.get('module')
    const permName = formData.get('permission')

    setSchema(schema.map(s => {
      if (s.module === moduleName) {
        return { ...s, permissions: [...s.permissions, permName] }
      }
      return s
    }))
    setModal(null)
  }

  const handleDeletePermission = (moduleName, permName) => {
    if (window.confirm(`Are you sure you want to delete the "${permName}" permission?`)) {
      setSchema(schema.map(s => {
        if (s.module === moduleName) {
          return { ...s, permissions: s.permissions.filter(p => p !== permName) }
        }
        return s
      }))
      setRoles(roles.map(r => {
        const rolePerms = { ...r.permissions }
        if (rolePerms[moduleName]) {
          rolePerms[moduleName] = rolePerms[moduleName].filter(p => p !== permName)
        }
        return { ...r, permissions: rolePerms }
      }))
    }
  }

  const handleEditPermission = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newName = formData.get('permission')
    const { module: moduleName, permission: oldName } = editItem

    setSchema(schema.map(s => {
      if (s.module === moduleName) {
        return { ...s, permissions: s.permissions.map(p => p === oldName ? newName : p) }
      }
      return s
    }))

    setRoles(roles.map(r => {
      const rolePerms = { ...r.permissions }
      if (rolePerms[moduleName] && rolePerms[moduleName].includes(oldName)) {
        rolePerms[moduleName] = rolePerms[moduleName].map(p => p === oldName ? newName : p)
      }
      return { ...r, permissions: rolePerms }
    }))

    setModal(null)
    setEditItem(null)
  }

  const handleAddMember = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const name = formData.get('name')
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase()
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']
    const randomColor = colors[Math.floor(Math.random() * colors.length)]

    const newMember = {
      id: Date.now(),
      name,
      initials,
      role: formData.get('role'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      color: randomColor,
      status: 'Active'
    }
    setUsers([newMember, ...users])
    setModal(null)
  }

  return (
    <div className="settings-page" style={{ padding: '40px', background: '#f8fafc', minHeight: '100vh' }}>
      <header className="page-header" style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="page-header-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{ padding: '10px', background: 'white', borderRadius: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', color: '#3b82f6' }}>
              <SettingsIcon size={24} />
            </div>
            <h1 className="page-title" style={{ fontSize: '32px', fontWeight: 950, color: '#0f172a', margin: 0 }}>System Control Center</h1>
          </div>
          <p className="page-subtitle" style={{ fontSize: '15px', color: '#64748b', fontWeight: 500, marginLeft: '48px' }}>Manage organizational hierarchy, security protocols, and member access</p>
        </div>
        <div className="page-header-actions" style={{ display: 'flex', gap: '12px' }}>
          <button className="btn btn-outline-primary" style={{ borderRadius: '16px', fontWeight: 700 }} onClick={() => setModal('add-category')}>
            <FolderPlus size={18} /> Add Module Category
          </button>
          <button className="btn btn-primary" style={{ borderRadius: '16px', fontWeight: 700, boxShadow: '0 8px 20px rgba(59, 130, 246, 0.25)' }} onClick={() => setModal('add-role')}>
            <Shield size={18} /> Create New Role
          </button>
        </div>
      </header>

      <div className="settings-nav-card" style={{ background: 'white', padding: '8px', borderRadius: '24px', display: 'inline-flex', gap: '8px', marginBottom: '40px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)', border: '1.5px solid #f1f5f9' }}>
        {[
          { id: 'roles', label: 'Role Hierarchy', icon: Shield },
          { id: 'members', label: 'Member Access', icon: UserPlus },
          { id: 'permissions', label: 'Global Matrix', icon: Lock },
          { id: 'security', label: 'Audit & Health', icon: History },
        ].map(t => (
          <button 
            key={t.id} 
            className={`tab-btn ${tab === t.id ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 24px',
              borderRadius: '18px',
              border: 'none',
              background: tab === t.id ? '#0f172a' : 'transparent',
              color: tab === t.id ? 'white' : '#64748b',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          >
            <t.icon size={18} /> {t.label}
          </button>
        ))}
      </div>

      {tab === 'roles' && (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '32px' }}>
          {/* Roles Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="search-box" style={{ position: 'relative' }}>
              <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)' }} />
              <input 
                placeholder="Search roles..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '18px 20px 18px 52px',
                  background: 'white',
                  border: '1.5px solid #f1f5f9',
                  borderRadius: '24px',
                  fontSize: '15px',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                  outline: 'none'
                }} 
              />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '4px' }}>
              {roles.filter(r => r.name.toLowerCase().includes(search.toLowerCase())).map(role => (
                <div 
                  key={role.id}
                  onClick={() => setSelectedRoleId(role.id)}
                  style={{
                    background: selectedRoleId === role.id ? '#3b82f6' : 'white',
                    padding: '24px',
                    borderRadius: '24px',
                    border: '1.5px solid',
                    borderColor: selectedRoleId === role.id ? '#3b82f6' : '#f1f5f9',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    boxShadow: selectedRoleId === role.id ? '0 12px 24px rgba(59, 130, 246, 0.15)' : '0 4px 12px rgba(0,0,0,0.02)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ 
                        width: '32px', height: '32px', borderRadius: '10px', 
                        background: selectedRoleId === role.id ? 'rgba(255,255,255,0.2)' : '#f8fafc',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: selectedRoleId === role.id ? 'white' : '#3b82f6'
                      }}>
                        <Shield size={18} />
                      </div>
                      <div style={{ fontWeight: 900, fontSize: '16px', color: selectedRoleId === role.id ? 'white' : '#0f172a' }}>{role.name}</div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button 
                        className="btn btn-ghost" 
                        style={{ padding: '8px', minWidth: 'auto', background: selectedRoleId === role.id ? 'rgba(255,255,255,0.1)' : '#f8fafc', color: selectedRoleId === role.id ? 'white' : '#64748b', borderRadius: '10px' }}
                        onClick={(e) => { e.stopPropagation(); setEditItem(role); setModal('edit-role'); }}
                        title="Edit Role"
                      >
                        <Edit3 size={16} />
                      </button>
                      {role.id !== 'r1' && (
                        <button 
                          className="btn btn-ghost" 
                          style={{ padding: '8px', minWidth: 'auto', background: selectedRoleId === role.id ? 'rgba(255,255,255,0.1)' : '#fee2e2', color: selectedRoleId === role.id ? 'white' : '#ef4444', borderRadius: '10px' }}
                          onClick={(e) => { e.stopPropagation(); handleDeleteRole(role.id); }}
                          title="Delete Role"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', color: selectedRoleId === role.id ? 'rgba(255,255,255,0.8)' : '#64748b', fontWeight: 500, marginBottom: '16px', lineHeight: 1.5 }}>
                    {role.description}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '10px', 
                      fontWeight: 800, 
                      background: selectedRoleId === role.id ? 'rgba(255,255,255,0.2)' : role.level === 'System' ? '#ef444415' : '#3b82f615',
                      color: selectedRoleId === role.id ? 'white' : role.level === 'System' ? '#ef4444' : '#3b82f6',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>{role.level}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: 700, color: selectedRoleId === role.id ? 'white' : '#94a3b8' }}>
                      <Users size={14} /> {role.users} Users
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Editor Content */}
          <div style={{ background: 'white', borderRadius: '32px', border: '1.5px solid #f1f5f9', padding: '40px', boxShadow: '0 4px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', paddingBottom: '24px', borderBottom: '1.5px solid #f1f5f9' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <h2 style={{ fontSize: '26px', fontWeight: 950, color: '#0f172a', margin: 0 }}>{selectedRole.name}</h2>
                  <div style={{ padding: '4px 12px', background: '#f0f9ff', borderRadius: '10px', color: '#0369a1', fontSize: '11px', fontWeight: 800 }}>MODULE CONFIGURATION</div>
                </div>
                <p style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>
                  {selectedRole.id === 'r1' 
                    ? 'Root administrator with absolute system override capabilities.' 
                    : `Configure granular access control for the ${selectedRole.name.toLowerCase()} hierarchy level.`}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-outline-primary" style={{ borderRadius: '14px', fontWeight: 800 }}>Discard</button>
                <button className="btn btn-primary" style={{ borderRadius: '14px', fontWeight: 800, boxShadow: '0 8px 20px rgba(59, 130, 246, 0.2)' }}>Deploy Changes</button>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              {schema.map((module, mIdx) => (
                <div key={mIdx} className="module-group" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }}></div>
                      <h3 style={{ fontSize: '18px', fontWeight: 900, color: '#1e293b', margin: 0 }}>{module.module}</h3>
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>({module.permissions.length} PERMISSIONS)</span>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        className="btn btn-outline-primary btn-sm" 
                        onClick={() => { setEditItem({ module: module.module }); setModal('add-permission'); }}
                        style={{ fontSize: '11px', padding: '6px 12px', borderRadius: '10px' }}
                      >
                        <Plus size={14} /> Add Permission
                      </button>
                      <button className="btn btn-ghost btn-sm" onClick={() => { setEditItem(module); setModal('edit-category'); }} style={{ color: '#94a3b8', padding: '6px' }}><Edit3 size={16} /></button>
                      <button className="btn btn-ghost btn-sm" onClick={() => handleDeleteCategory(module.module)} style={{ color: '#ef4444', padding: '6px' }}><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px', padding: '24px', background: '#f8fafc', borderRadius: '24px', border: '1.5px solid #f1f5f9' }}>
                    {module.permissions.map((perm, pIdx) => {
                      const active = isPermActive(selectedRole, module.module, perm)
                      return (
                        <div 
                          key={pIdx}
                          onClick={() => togglePermission(selectedRole.id, module.module, perm)}
                          style={{
                            padding: '16px',
                            borderRadius: '16px',
                            background: 'white',
                            border: '1.5px solid',
                            borderColor: active ? '#3b82f6' : '#e2e8f0',
                            cursor: selectedRole.id === 'r1' ? 'default' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px',
                            boxShadow: active ? '0 8px 20px rgba(59, 130, 246, 0.08)' : 'none'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ 
                              width: '20px', height: '20px', borderRadius: '6px', 
                              background: active ? '#3b82f6' : '#f1f5f9',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: 'white'
                            }}>
                              {active && <CheckCircle2 size={12} />}
                            </div>
                            <div style={{ display: 'flex', gap: '2px' }}>
                                <button className="btn btn-ghost btn-sm" style={{ padding: '2px', color: '#cbd5e1' }} onClick={(e) => { e.stopPropagation(); setEditItem({ module: module.module, permission: perm }); setModal('edit-permission'); }}><Edit3 size={12} /></button>
                                <button className="btn btn-ghost btn-sm" style={{ padding: '2px', color: '#cbd5e1' }} onClick={(e) => { e.stopPropagation(); handleDeletePermission(module.module, perm); }}><Trash2 size={12} /></button>
                            </div>
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 800, color: active ? '#1e293b' : '#64748b' }}>{perm}</div>
                        </div>
                      )
                    })}
                    <button 
                      onClick={() => { setEditItem({ module: module.module }); setModal('add-permission'); }}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        background: 'rgba(59, 130, 246, 0.03)',
                        border: '2px dashed #3b82f644',
                        color: '#3b82f6',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        fontSize: '13px',
                        fontWeight: 800,
                        transition: 'all 0.2s'
                      }}
                    >
                      <Plus size={18} /> New Protocol
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'permissions' && (
        <div style={{ background: 'white', borderRadius: '32px', padding: '40px', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 950, color: '#0f172a', margin: 0 }}>Global Permission Matrix</h2>
                <div style={{ padding: '4px 12px', background: '#f0fdf4', borderRadius: '10px', color: '#166534', fontSize: '11px', fontWeight: 800 }}>LIVE SYNC OVERVIEW</div>
              </div>
              <p style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>High-density overview of cross-module protocols across all system hierarchies</p>
            </div>
          </div>

          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table className="table" style={{ borderCollapse: 'separate', borderSpacing: '0 12px' }}>
              <thead>
                <tr style={{ background: 'transparent' }}>
                  <th style={{ background: 'transparent', padding: '0 20px', color: '#94a3b8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>Protocol Category</th>
                  {roles.map(r => (
                    <th key={r.id} style={{ background: 'transparent', padding: '0 20px', color: '#94a3b8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', textAlign: 'center' }}>{r.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {schema.map((module) => (
                  module.permissions.map((perm, pIdx) => (
                    <tr key={`${module.module}-${perm}`} style={{ background: '#f8fafc', transition: 'all 0.2s' }}>
                      <td style={{ padding: '20px', borderRadius: '16px 0 0 16px', border: '1px solid #f1f5f9', borderRight: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
                            <div>
                                <div style={{ fontSize: '10px', color: '#3b82f6', fontWeight: 800, marginBottom: '2px' }}>{module.module.toUpperCase()}</div>
                                <div style={{ fontSize: '14px', fontWeight: 900, color: '#1e293b' }}>{perm}</div>
                            </div>
                        </div>
                      </td>
                      {roles.map((role, rIdx) => {
                        const active = isPermActive(role, module.module, perm)
                        return (
                          <td 
                            key={role.id} 
                            style={{ 
                                textAlign: 'center', 
                                borderTop: '1px solid #f1f5f9', 
                                borderBottom: '1px solid #f1f5f9',
                                borderRadius: rIdx === roles.length - 1 ? '0 16px 16px 0' : '0',
                                borderRight: rIdx === roles.length - 1 ? '1px solid #f1f5f9' : 'none'
                            }}
                          >
                            <div 
                              onClick={() => togglePermission(role.id, module.module, perm)}
                              style={{ 
                                width: '32px', 
                                height: '32px', 
                                borderRadius: '10px', 
                                background: active ? '#10b981' : 'white',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: active ? 'white' : '#e2e8f0',
                                cursor: role.id === 'r1' ? 'default' : 'pointer',
                                transition: 'all 0.2s',
                                border: active ? 'none' : '1.5px solid #e2e8f0',
                                boxShadow: active ? '0 4px 12px rgba(16, 185, 129, 0.2)' : 'none'
                              }}
                            >
                              {active ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'members' && (
        <div style={{ background: 'white', borderRadius: '32px', padding: '40px', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 30px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <h2 style={{ fontSize: '24px', fontWeight: 950, color: '#0f172a', margin: 0 }}>Member Access Control</h2>
                <div style={{ padding: '4px 12px', background: '#f5f3ff', borderRadius: '10px', color: '#5b21b6', fontSize: '11px', fontWeight: 800 }}>{users.length} ACTIVE DIRECTORY</div>
              </div>
              <p style={{ fontSize: '15px', color: '#64748b', fontWeight: 500 }}>Manage administrative assignments and identity authentication</p>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div className="search-box" style={{ position: 'relative' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  placeholder="Filter by name or role..." 
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  style={{ 
                    padding: '12px 16px 12px 44px', 
                    background: '#f8fafc', 
                    borderRadius: '16px', 
                    border: '1.5px solid #f1f5f9',
                    fontSize: '13px',
                    fontWeight: 600,
                    width: '280px',
                    outline: 'none'
                  }} 
                />
              </div>
              <button className="btn btn-primary" style={{ borderRadius: '16px', fontWeight: 800 }} onClick={() => setModal('add-member')}>
                <UserPlus size={18} /> Register Member
              </button>
            </div>
          </div>

          <div className="table-container" style={{ border: 'none', boxShadow: 'none' }}>
            <table className="table">
              <thead>
                <tr style={{ background: 'transparent' }}>
                  <th style={{ background: 'transparent', padding: '0 20px', color: '#94a3b8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>User Identity</th>
                  <th style={{ background: 'transparent', padding: '0 20px', color: '#94a3b8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Assigned Protocol</th>
                  <th style={{ background: 'transparent', padding: '0 20px', color: '#94a3b8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Hierarchy</th>
                  <th style={{ background: 'transparent', padding: '0 20px', color: '#94a3b8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>Authentication</th>
                  <th style={{ background: 'transparent', padding: '0 20px', color: '#94a3b8', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.role.toLowerCase().includes(userSearch.toLowerCase())).map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '24px 20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div style={{ 
                            width: '48px', height: '48px', borderRadius: '16px', 
                            background: `linear-gradient(135deg, ${u.color}22, ${u.color}44)`, 
                            color: u.color, display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            fontWeight: 950, fontSize: '16px', boxShadow: `0 4px 12px ${u.color}22`
                        }}>
                          {u.initials}
                        </div>
                        <div>
                          <div style={{ fontWeight: 900, fontSize: '15px', color: '#0f172a' }}>{u.name}</div>
                          <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700, marginTop: '2px' }}>ID: USR-{u.id.toString().slice(-4)}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#3b82f6' }}></div>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#1e293b' }}>{u.role.toUpperCase()}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
                        {roles.find(r => r.name === u.role.toUpperCase())?.level || 'Operational'}
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail size={14} color="#94a3b8" /> {u.email}
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        <select 
                            className="form-control" 
                            style={{ width: '160px', fontSize: '12px', fontWeight: 800, borderRadius: '12px', height: '40px', background: '#f8fafc' }}
                            value={u.role.toUpperCase()}
                            onChange={(e) => {
                            const newRole = e.target.value
                            setUsers(users.map(user => user.id === u.id ? { ...user, role: newRole } : user))
                            }}
                        >
                            {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                            <option value="Technician">Technician</option>
                            <option value="Client">Client</option>
                        </select>
                        <button className="btn btn-ghost" style={{ padding: '8px', borderRadius: '10px' }}><MoreVertical size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'security' && (
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ 
                background: 'linear-gradient(135deg, #0f172a, #1e293b)', 
                padding: '40px', borderRadius: '32px', color: 'white',
                boxShadow: '0 20px 40px rgba(15, 23, 42, 0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '32px' }}>
                <div style={{ padding: '10px', background: 'rgba(16, 185, 129, 0.2)', borderRadius: '14px', color: '#10b981' }}>
                    <Shield size={28} />
                </div>
                <div>
                    <div style={{ fontSize: '20px', fontWeight: 950 }}>Security Health</div>
                    <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600 }}>SYSTEM PROTECTED</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px' }}>FIREWALL ARCHITECTURE</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#10b981' }}>ACTIVE & ENCRYPTED</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 800, marginBottom: '8px', letterSpacing: '1px' }}>SUSPICIOUS ACTIVITY (24H)</div>
                  <div style={{ fontSize: '16px', fontWeight: 900, color: '#ef4444' }}>08 BLOCKED THREATS</div>
                </div>
              </div>
            </div>

            <div style={{ background: 'white', padding: '32px', borderRadius: '32px', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 950, color: '#0f172a', marginBottom: '24px' }}>Security Protocol Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'space-between', borderRadius: '16px', padding: '16px 20px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800, color: '#475569' }}>
                    <Key size={18} /> Reset All Passwords
                  </div>
                  <ArrowRight size={16} />
                </button>
                <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'space-between', borderRadius: '16px', padding: '16px 20px', background: '#f8fafc' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 800, color: '#475569' }}>
                    <Globe size={18} /> Update IP Whitelist
                  </div>
                  <ArrowRight size={16} />
                </button>
                <button className="btn btn-danger" style={{ width: '100%', justifyContent: 'center', borderRadius: '16px', padding: '16px', fontWeight: 900, marginTop: '12px' }}>
                  TERMINATE ALL SESSIONS
                </button>
              </div>
            </div>
          </div>

          <div style={{ background: 'white', borderRadius: '32px', padding: '40px', border: '1.5px solid #f1f5f9', boxShadow: '0 4px 30px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 950, color: '#0f172a', margin: 0 }}>System Audit Trail</h2>
                <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 500, marginTop: '4px' }}>Real-time synchronization of all administrative operations</p>
              </div>
              <button className="btn btn-ghost" style={{ borderRadius: '14px', fontWeight: 800, background: '#f8fafc' }}>Export Security Log</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {[
                { type: 'LOGIN', user: 'Saud Al-Maliki', action: 'Successful login from Riyadh, SA', time: '10 min ago', status: 'Success' },
                { type: 'PROTOCOL', user: 'ADMIN', action: 'Modified "Fleet" permissions for ENGINEER role', time: '1 hour ago', status: 'Warning' },
                { type: 'THREAT', user: 'Firewall', action: 'Blocked suspicious IP 192.168.1.105', time: '3 hours ago', status: 'Danger' },
                { type: 'AUTH', user: 'Hana Al-Mutairi', action: 'Password successfully changed', time: '5 hours ago', status: 'Success' },
                { type: 'DATA', user: 'Tariq Al-Anazi', action: 'Exported "Sales Reports Q2"', time: '1 day ago', status: 'Info' },
              ].map((log, i) => (
                <div key={i} style={{ display: 'flex', gap: '20px', padding: '20px', borderRadius: '24px', background: '#f8fafc', border: '1.5px solid #f1f5f9', transition: 'all 0.2s' }}>
                  <div style={{ 
                    width: '52px', height: '52px', borderRadius: '18px', 
                    background: log.status === 'Success' ? '#10b98115' : log.status === 'Danger' ? '#ef444415' : log.status === 'Warning' ? '#f59e0b15' : '#3b82f615',
                    color: log.status === 'Success' ? '#10b981' : log.status === 'Danger' ? '#ef4444' : log.status === 'Warning' ? '#f59e0b' : '#3b82f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid currentColor'
                  }}>
                    {log.type === 'THREAT' ? <AlertTriangle size={24} /> : <Activity size={24} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 900, color: '#3b82f6', letterSpacing: '0.5px' }}>{log.type} PROTOCOL</div>
                      <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 700 }}>{log.time}</div>
                    </div>
                    <div style={{ fontSize: '15px', color: '#1e293b', fontWeight: 800, marginBottom: '4px' }}>{log.action}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700, color: '#64748b' }}>
                        <Users size={14} /> OPERATOR: {log.user.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Modern Glass Modals */}
      {modal && (
        <div className="modal-backdrop" style={{ 
            position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.4)', 
            backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', 
            justifyContent: 'center', zIndex: 1000, padding: '20px'
        }} onClick={() => { setModal(null); setEditItem(null); }}>
          <div className="modal-content" style={{ 
              background: 'white', width: '100%', maxWidth: '500px', 
              borderRadius: '32px', boxShadow: '0 30px 60px rgba(0,0,0,0.15)', 
              overflow: 'hidden', animation: 'modalSlideUp 0.3s ease-out'
          }} onClick={e => e.stopPropagation()}>
            
            <div style={{ padding: '32px 40px', borderBottom: '1.5px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', margin: 0 }}>
                    {modal === 'add-role' && 'Establish New Role'}
                    {modal === 'edit-role' && 'Update Role Configuration'}
                    {modal === 'add-category' && 'New Module Category'}
                    {modal === 'edit-category' && 'Rename Module Category'}
                    {modal === 'add-permission' && 'Define Action Protocol'}
                    {modal === 'edit-permission' && 'Modify Protocol'}
                    {modal === 'add-member' && 'Register System Member'}
                </h3>
                <button style={{ border: 'none', background: 'transparent', color: '#94a3b8', cursor: 'pointer' }} onClick={() => { setModal(null); setEditItem(null); }}><XCircle size={24} /></button>
            </div>

            <form onSubmit={
                modal === 'add-role' ? handleAddRole :
                modal === 'edit-role' ? handleEditRole :
                modal === 'add-category' ? handleAddCategory :
                modal === 'edit-category' ? handleEditCategory :
                modal === 'add-permission' ? handleAddPermission :
                modal === 'edit-permission' ? handleEditPermission :
                handleAddMember
            }>
                <div style={{ padding: '40px' }}>
                    {modal === 'add-role' || modal === 'edit-role' ? (
                        <>
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>Role Identity</label>
                                <input className="form-control" name="name" required placeholder="e.g. REGIONAL MANAGER" defaultValue={editItem?.name} style={{ borderRadius: '14px', padding: '14px 20px', background: '#f8fafc' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>Hierarchy Tier</label>
                                <select className="form-control" name="level" defaultValue={editItem?.level} style={{ borderRadius: '14px', padding: '14px 20px', background: '#f8fafc' }}>
                                    <option>Operational</option>
                                    <option>Department</option>
                                    <option>System</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>Operational Scope</label>
                                <textarea className="form-control" name="description" placeholder="Define the responsibilities..." defaultValue={editItem?.description} style={{ borderRadius: '14px', padding: '14px 20px', background: '#f8fafc', height: '100px' }} />
                            </div>
                        </>
                    ) : modal === 'add-category' || modal === 'edit-category' ? (
                        <div className="form-group">
                            <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>Category Identity</label>
                            <input className="form-control" name="module" required placeholder="e.g. Logistics & Supply" defaultValue={editItem?.module} style={{ borderRadius: '14px', padding: '14px 20px', background: '#f8fafc' }} />
                        </div>
                    ) : modal === 'add-permission' || modal === 'edit-permission' ? (
                        <>
                            <div className="form-group" style={{ marginBottom: '24px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>Parent Module</label>
                                <select className="form-control" name="module" disabled={modal === 'edit-permission'} defaultValue={editItem?.module} style={{ borderRadius: '14px', padding: '14px 20px', background: '#f8fafc' }}>
                                    {schema.map(s => <option key={s.module}>{s.module}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>Protocol Name</label>
                                <input className="form-control" name="permission" required placeholder="e.g. Force Sync" defaultValue={editItem?.permission} style={{ borderRadius: '14px', padding: '14px 20px', background: '#f8fafc' }} />
                            </div>
                        </>
                    ) : (
                        <>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>Full Identity</label>
                                <input className="form-control" name="name" required placeholder="Omar Al-Farsi" style={{ borderRadius: '14px', padding: '14px 20px', background: '#f8fafc' }} />
                            </div>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>Primary Protocol Assignment</label>
                                <select className="form-control" name="role" style={{ borderRadius: '14px', padding: '14px 20px', background: '#f8fafc' }}>
                                    {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                                    <option value="Technician">Technician</option>
                                    <option value="Client">Client</option>
                                </select>
                            </div>
                            <div className="form-group" style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>Auth Email</label>
                                <input className="form-control" name="email" type="email" required placeholder="omar@aczone.com" style={{ borderRadius: '14px', padding: '14px 20px', background: '#f8fafc' }} />
                            </div>
                            <div className="form-group">
                                <label style={{ display: 'block', fontSize: '13px', fontWeight: 800, color: '#1e293b', marginBottom: '10px' }}>Contact Vector</label>
                                <input className="form-control" name="phone" required placeholder="+966 50 XXX XXXX" style={{ borderRadius: '14px', padding: '14px 20px', background: '#f8fafc' }} />
                            </div>
                        </>
                    )}
                </div>
                <div style={{ padding: '32px 40px', background: '#f8fafc', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                    <button type="button" className="btn btn-ghost" style={{ fontWeight: 800 }} onClick={() => { setModal(null); setEditItem(null); }}>Cancel Request</button>
                    <button type="submit" className="btn btn-primary" style={{ borderRadius: '14px', fontWeight: 800, padding: '12px 32px' }}>
                        {modal.startsWith('add') ? 'Establish Now' : 'Apply Updates'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes modalSlideUp {
            from { transform: translateY(30px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
        }
        .tab-btn:hover {
            transform: translateY(-2px);
            background: #f1f5f9;
        }
        .tab-btn.active:hover {
            background: #0f172a;
        }
        .module-group:hover .btn-ghost {
            opacity: 1;
        }
        ::-webkit-scrollbar {
            width: 6px;
        }
        ::-webkit-scrollbar-track {
            background: transparent;
        }
        ::-webkit-scrollbar-thumb {
            background: #e2e8f0;
            border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #cbd5e1;
        }
      `}} />
    </div>
  )
}
