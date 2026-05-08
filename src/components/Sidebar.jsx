import React from 'react';
import './Sidebar.css';
import { 
  LayoutDashboard, 
  Users, 
  Wrench, 
  DollarSign, 
  CreditCard, 
  ShoppingCart, 
  Package, 
  BarChart3, 
  Car, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flame,
  Settings,
  MessageSquare
} from 'lucide-react';

const NAV_DATA = [
  {
    section: null,
    items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ],
  },
  {
    section: 'Management',
    items: [
      { id: 'users', icon: Users, label: 'Users' },
      { id: 'maintenance', icon: Wrench, label: 'Maintenance', badge: 3 },
    ],
  },
  {
    section: 'Finance',
    items: [
      { id: 'accounting', icon: DollarSign, label: 'Accounting System', badge: 3 },
      { id: 'installments', icon: CreditCard, label: 'Installments' },
    ],
  },
  {
    section: 'Operations',
    items: [
      { id: 'sales', icon: ShoppingCart, label: 'Sales' },
      { id: 'inventory', icon: Package, label: 'Inventory' },
      { id: 'reports', icon: BarChart3, label: 'Reports' },
    ],
  },
  {
    section: 'Fleet',
    items: [
      { id: 'fleet', icon: Car, label: 'Fleet / Vehicles' },
    ],
  },
  {
    section: 'System',
    items: [
      { id: 'chat', icon: MessageSquare, label: 'Communication' },
      { id: 'settings', icon: Settings, label: 'Settings' },
    ],
  },
];

export default function Sidebar({ page, onNavigate, collapsed, onLogout, onToggleCollapse }) {
  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      {/* Brand Section */}
      <div className="brand-section">
        <div className="brand-logo">
          <Flame size={24} fill="currentColor" />
        </div>
        {!collapsed && <div className="brand-name">KIRBY</div>}
      </div>

      {/* Navigation */}
      <nav className="nav-container">
        {NAV_DATA.map((section, idx) => (
          <div key={section.section || `sec-${idx}`}>
            {!collapsed && section.section && (
              <div className="nav-section-title">{section.section}</div>
            )}
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = page === item.id;
              
              return (
                <div
                  key={item.id}
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => onNavigate(item.id)}
                  title={collapsed ? item.label : ''}
                >
                  <div className="nav-icon">
                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <span className="nav-label">{item.label}</span>
                  {item.badge && !collapsed && (
                    <span className="nav-badge">{item.badge}</span>
                  )}
                  {item.badge && collapsed && (
                    <div 
                      style={{ 
                        position: 'absolute', 
                        top: 10, 
                        right: 10, 
                        width: 8, 
                        height: 8, 
                        background: 'var(--accent-primary)', 
                        borderRadius: '50%',
                        border: '2px solid var(--sidebar-bg)'
                      }} 
                    />
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </nav>

      {/* User Footer Section */}
      <div className="sidebar-footer">
        <div className="user-avatar">
          SM
        </div>
        {!collapsed && (
          <div className="user-info">
            <div className="user-name">Saud Al-Maliki</div>
            <div className="user-role">Administrator</div>
          </div>
        )}
        <button 
          className="logout-btn" 
          onClick={onLogout} 
          title="Sign Out"
        >
          <LogOut size={18} />
        </button>
      </div>
    </aside>
  );
}
