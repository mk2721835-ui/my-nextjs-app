import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import { products, orders, offers } from '../data'
import { useToast } from '../App'
import { 
  ShoppingBag, 
  Plus, 
  Search, 
  LayoutGrid, 
  List, 
  Filter, 
  ArrowRight, 
  Star, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  ShoppingCart,
  Tag,
  TrendingUp,
  MoreVertical,
  Pencil,
  Trash2,
  Eye,
  Box,
  CreditCard,
  Calendar,
  Layers,
  Zap,
  Activity,
  Download,
  Users,
  DollarSign
} from 'lucide-react'

const ORDER_STATUS = { Delivered:'success', Processing:'warning', Shipped:'info', Pending:'gray', Cancelled:'danger' }
const OFFER_STATUS = { Active:'success', Upcoming:'info', Expired:'gray' }
const STOCK_COLOR  = { 'In Stock':'success', 'Low Stock':'warning', 'Out of Stock':'danger' }
const CAT_ICON     = { 
  'Solar Systems': Zap, 
  'Water Filters': Activity, 
  Accessories: Layers, 
  'Spare Parts': Box 
}
const CAT_COLORS = {
  'Solar Systems': '#F59E0B',
  'Water Filters': '#3B82F6',
  Accessories: '#8B5CF6',
  'Spare Parts': '#64748B'
}

// ── Creative Product Card ──────────────────────────────────────────────────
function CreativeProductCard({ product, onEdit, onDelete, onAdjustStock, onView }) {
  const [hovered, setHovered] = useState(false)
  const CatIcon = CAT_ICON[product.category] || Box
  const accentColor = CAT_COLORS[product.category] || '#475569'

  return (
    <div 
      className="glass-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '32px',
        padding: '24px',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: hovered 
          ? `0 30px 60px -12px ${accentColor}25` 
          : '0 4px 20px -5px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}
      onClick={() => onView(product)}
    >
      <div style={{
        margin: '-24px -24px 24px -24px',
        height: product.image ? '180px' : '100px',
        background: product.image ? `url(${product.image}) center/cover` : `linear-gradient(135deg, ${accentColor}15 0%, transparent 100%)`,
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        padding: '24px',
        alignItems: 'flex-start'
      }}>
        {product.image && <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, transparent 100%)' }} />}
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '8px' }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 900,
            color: 'white',
            background: accentColor === CAT_COLORS['Solar Systems'] ? '#0f172a' : accentColor,
            padding: '6px 14px',
            borderRadius: '99px',
            letterSpacing: '0.5px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            {product.category.toUpperCase()}
          </div>
        </div>

        <div style={{
          position: 'relative', zIndex: 1,
          fontSize: '10px',
          fontWeight: 800,
          color: product.status === 'In Stock' ? '#10b981' : product.status === 'Low Stock' ? '#f59e0b' : '#ef4444',
          background: 'white',
          padding: '6px 12px',
          borderRadius: '99px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor' }} />
          {product.status.toUpperCase()}
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.2 }}>{product.name}</h3>
          <p style={{ fontSize: '13px', color: '#64748b', fontWeight: 500, margin: 0, opacity: 0.8, lineHeight: 1.5 }}>{product.description.slice(0, 80)}...</p>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr', 
          gap: '12px',
          marginTop: 'auto'
        }}>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '22px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>PRICE</div>
            <div style={{ fontSize: '18px', fontWeight: 950, color: '#0f172a' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginRight: '2px' }}>SAR</span>
              {product.price.toLocaleString()}
            </div>
          </div>
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '22px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>INVENTORY</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
              <span style={{ fontSize: '20px', fontWeight: 950, color: product.stock <= 5 ? '#ef4444' : '#0f172a' }}>{product.stock}</span>
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#94a3b8', paddingBottom: '3px' }}>UNITS</span>
            </div>
            <div style={{ width: '100%', height: '4px', background: '#e2e8f0', borderRadius: '2px', marginTop: '8px', overflow: 'hidden' }}>
              <div style={{ 
                width: `${Math.min((product.stock/50)*100, 100)}%`, 
                height: '100%', 
                background: product.stock <= 5 ? '#ef4444' : accentColor,
                borderRadius: '2px'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Hover Reveal Actions */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        height: hovered ? '70px' : '0px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        opacity: hovered ? 1 : 0,
        zIndex: 2,
        padding: hovered ? '0 24px' : '0'
      }} onClick={e => e.stopPropagation()}>
        <button className="btn btn-primary btn-sm" style={{ flex: 1, borderRadius: '16px', height: '44px', gap: '8px' }} onClick={() => onView(product)}>
          <Eye size={16} /> View Details
        </button>
        <button className="btn btn-ghost btn-sm" style={{ width: '44px', height: '44px', borderRadius: '16px', padding: 0 }} onClick={e => onEdit(product, e)}>
          <Pencil size={16} />
        </button>
        <button className="btn btn-ghost btn-sm" style={{ width: '44px', height: '44px', borderRadius: '16px', padding: 0 }} onClick={e => onAdjustStock(product, e)}>
          <Package size={16} />
        </button>
        <button className="btn btn-danger btn-sm" style={{ width: '44px', height: '44px', borderRadius: '16px', padding: 0 }} onClick={e => onDelete(product, e)}>
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  )
}

function CreativeOrderCard({ order, onEdit, onView }) {
  const [hovered, setHovered] = useState(false)
  const statusColor = order.status === 'Delivered' ? '#10b981' : order.status === 'Processing' ? '#f59e0b' : order.status === 'Shipped' ? '#3b82f6' : order.status === 'Cancelled' ? '#ef4444' : '#64748b'

  return (
    <div 
      className="glass-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative',
        borderRadius: '32px',
        padding: '24px',
        transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        boxShadow: hovered 
          ? `0 30px 60px -12px ${statusColor}25` 
          : '0 4px 20px -5px rgba(0,0,0,0.05)',
        overflow: 'hidden'
      }}
      onClick={() => onView(order)}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative', zIndex: 1 }}>
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '20px',
          background: `${statusColor}15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: statusColor,
          transform: hovered ? 'rotate(-8deg) scale(1.1)' : 'none',
          transition: 'all 0.3s'
        }}>
          <Truck size={28} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', alignItems: 'flex-end' }}>
          <div style={{
            fontSize: '10px',
            fontWeight: 900,
            color: 'white',
            background: statusColor,
            padding: '4px 12px',
            borderRadius: '99px',
            letterSpacing: '0.5px'
          }}>
            {order.status.toUpperCase()}
          </div>
          <div style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8' }}>
            <Calendar size={10} style={{ marginRight:'4px' }} /> {order.date.toUpperCase()}
          </div>
        </div>
      </div>

      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontSize: '18px', fontWeight: 950, color: '#0f172a', margin: '0 0 4px 0', fontFamily: 'monospace' }}>{order.id}</h3>
        <p style={{ fontSize: '14px', color: '#64748b', fontWeight: 800, margin: 0 }}>{order.client}</p>
        <p style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 600, margin: '4px 0 0 0' }}>{order.items.length} Items • <CreditCard size={12} style={{verticalAlign:'middle', margin:'-2px 2px 0 2px'}} /> {order.paymentType}</p>
      </div>

      <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '22px', border: '1px solid #f1f5f9' }}>
        <div style={{ fontSize: '9px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '4px' }}>ORDER VALUATION</div>
        <div style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a' }}>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b', marginRight: '4px' }}>SAR</span>
          {order.amount.toLocaleString()}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        background: 'rgba(255,255,255,0.9)',
        backdropFilter: 'blur(12px)',
        height: hovered ? '70px' : '0px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        opacity: hovered ? 1 : 0,
        zIndex: 2,
        padding: hovered ? '0 24px' : '0'
      }} onClick={e => e.stopPropagation()}>
        <button className="btn btn-primary btn-sm" style={{ flex: 1, borderRadius: '16px', height: '44px', gap: '8px' }} onClick={() => onView(order)}>
          <Eye size={16} /> View Details
        </button>
        <button className="btn btn-ghost btn-sm" style={{ flex: 1, borderRadius: '16px', height: '44px', gap: '8px', background:'#f8fafc' }} onClick={e => { e.stopPropagation(); onEdit(order, e) }}>
          <Pencil size={16} /> Edit
        </button>
      </div>
    </div>
  )
}

function VTog({ mode, setMode }) {
  return (
    <div style={{ 
      display: 'flex', 
      gap: 4, 
      background: '#e2e8f0', 
      borderRadius: '16px', 
      padding: '4px', 
      border: '1px solid #cbd5e1'
    }}>
      {[
        { id: 'grid', icon: LayoutGrid, label: 'Creative' },
        { id: 'table', icon: List, label: 'List' }
      ].map(({ id, icon: Icon, label }) => (
        <button 
          key={id} 
          onClick={() => setMode(id)}
          style={{ 
            padding: '8px 18px', 
            borderRadius: '12px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '12px', 
            fontWeight: 800,
            display: 'flex', 
            alignItems: 'center', 
            gap: 10,
            background: mode === id ? '#0f172a' : 'transparent',
            boxShadow: mode === id ? '0 10px 15px -3px rgba(0,0,0,0.2)' : 'none',
            color: mode === id ? 'white' : '#64748b',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          <Icon size={14} />
          {label}
        </button>
      ))}
    </div>
  )
}

export default function Sales() {
  const toast = useToast()
  const [tab, setTab]               = useState('products')
  const [modal, setModal]           = useState(null)
  const [selected, setSelected]     = useState(null)
  const [search, setSearch]         = useState('')
  const [catFilter, setCatFilter]   = useState('All')
  const [orderStatusFilter, setOrderStatusFilter] = useState('All')
  const [offerStatusFilter, setOfferStatusFilter] = useState('All')
  const [viewMode, setViewMode]     = useState('grid')
  const [form, setForm] = useState({ name:'', category:'Solar Systems', price:'', stock:'', status:'In Stock', description:'', image:'', title:'', discount:'', type:'', appliesTo:'', validTo:'' })
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const cats = ['All', 'Solar Systems', 'Water Filters', 'Accessories', 'Spare Parts']

  const filteredProducts = products.filter(p => {
    const matchCat  = catFilter === 'All' || p.category === catFilter
    const matchSrch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSrch
  })

  const filteredOrders = orders.filter(o => {
    const matchStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter
    const matchSearch = o.client.toLowerCase().includes(search.toLowerCase()) || o.id.toLowerCase().includes(search.toLowerCase())
    return matchStatus && matchSearch
  })

  const filteredOffers = offers.filter(o =>
    offerStatusFilter === 'All' || o.status === offerStatusFilter
  )

  const openEdit = (item, e) => {
    e?.stopPropagation()
    setSelected(item)
    setForm({ name:item.name, category:item.category, price:item.price, stock:item.stock, status:item.status, description:item.description, image:item.image||'' })
    setModal('product-edit')
  }

  const openAdd = () => {
    setSelected(null)
    setForm({ name:'', category:'Solar Systems', price:'', stock:'', status:'In Stock', description:'', image:'' })
    setModal('product-add')
  }

  return (
    <div style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.6s ease' }}>
      {/* Dynamic Header */}
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
            letterSpacing: '0.5px'
          }}>
            <ShoppingBag size={14} /> SALES & COMMERCE
          </div>
          <h1 className="page-title" style={{ fontSize: '36px', fontWeight: 950, letterSpacing: '-1px' }}>
            {tab === 'products' ? 'Product Catalog' : tab === 'orders' ? 'Order Logistics' : 'Marketing Center'}
          </h1>
          <p className="page-subtitle" style={{ fontSize: '15px', marginTop: '4px', opacity: 0.7 }}>
            Manage infrastructure assets, real-time orders, and promotional campaigns.
          </p>
        </div>
        <div className="page-header-actions" style={{ gap: '16px' }}>
          <button className="btn btn-ghost" onClick={() => toast('Sales report exported', 'success')} style={{ gap: '10px', borderRadius: '18px', padding: '12px 24px' }}>
            <Download size={20} /> Export
          </button>
          <button className="btn btn-primary" onClick={tab === 'products' ? openAdd : tab === 'offers' ? () => setModal('offer-add') : () => toast('New order form', 'info')} style={{ 
            gap: '10px', 
            padding: '14px 32px', 
            borderRadius: '18px',
            background: '#0f172a',
            border: 'none',
            boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.4)'
          }}>
            <Plus size={20} />
            {tab === 'products' ? 'Add Product' : tab === 'offers' ? 'New Offer' : 'Create Order'}
          </button>
        </div>
      </div>

      {/* Unique Tab System */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        marginBottom: '40px', 
        flexWrap: 'wrap', 
        gap: '24px',
        padding: '12px',
        background: '#f8fafc',
        borderRadius: '24px',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[
            { id:'products', label:'Products',            icon: Package, count:products.length },
            { id:'orders',   label:'Live Orders',         icon: Truck,   count:orders.length },
            { id:'offers',   label:'Marketing & Offers',  icon: Tag,     count:offers.length },
          ].map(t => (
            <button key={t.id} 
              onClick={() => { setTab(t.id); setSearch(''); setViewMode('grid') }}
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
              <span style={{ 
                marginLeft: '4px',
                background: tab === t.id ? '#0f172a' : '#e2e8f0',
                color: tab === t.id ? 'white' : '#64748b',
                padding: '2px 8px',
                borderRadius: '8px',
                fontSize: '11px'
              }}>{t.count}</span>
            </button>
          ))}
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, justifyContent: 'flex-end' }}>
          <div className="search-input-wrap" style={{ 
            minWidth: '300px', 
            borderRadius: '16px', 
            background: 'white',
            padding: '10px 18px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.02)'
          }}>
            <Search size={18} color="#94a3b8" />
            <input 
              placeholder={`Filter ${tab}...`} 
              value={search} 
              onChange={e => setSearch(e.target.value)}
              style={{ fontSize: '14px', fontWeight: 500 }}
            />
          </div>
          <VTog mode={viewMode} setMode={setViewMode} />
        </div>
      </div>

      {/* ── PRODUCTS TAB ── */}
      {tab === 'products' && (
        <>
          <div style={{ display:'flex', gap:'12px', alignItems:'center', marginBottom:'32px', overflowX:'auto', paddingBottom:'8px' }}>
            <div style={{ 
              display:'flex', 
              alignItems:'center', 
              gap:'8px', 
              background:'#f1f5f9', 
              padding:'6px 12px', 
              borderRadius:'14px',
              fontSize:'12px',
              fontWeight:800,
              color:'#64748b',
              marginRight:'12px'
            }}>
              <Filter size={14} /> CATEGORY
            </div>
            {cats.map(c => (
              <button 
                key={c} 
                className={`filter-pill${catFilter===c?' active':''}`} 
                onClick={() => setCatFilter(c)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 800,
                  transition: 'all 0.3s',
                  background: catFilter === c ? '#3b82f6' : 'white',
                  color: catFilter === c ? 'white' : '#64748b',
                  border: '1px solid #e2e8f0',
                  boxShadow: catFilter === c ? '0 8px 16px rgba(59, 130, 246, 0.2)' : 'none'
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {viewMode === 'grid' ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'32px' }}>
              {filteredProducts.map((p, idx) => (
                <div key={p.id} style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
                  <CreativeProductCard 
                    product={p} 
                    onEdit={openEdit} 
                    onDelete={p => toast(`"${p.name}" deleted`, 'warning')}
                    onAdjustStock={p => { setSelected(p); setModal('stock-adjust') }}
                    onView={p => { setSelected(p); setModal('product-view') }}
                  />
                </div>
              ))}
              <div 
                className="glass-card" 
                style={{ 
                  border:'2px dashed #e2e8f0', 
                  background:'transparent', 
                  display:'flex',
                  flexDirection:'column',
                  alignItems:'center', 
                  justifyContent:'center', 
                  minHeight:'320px', 
                  cursor:'pointer', 
                  boxShadow:'none',
                  borderRadius:'32px',
                  transition: 'all 0.3s'
                }} 
                onClick={openAdd}
              >
                <div style={{ textAlign:'center', color:'#94a3b8', padding:'32px' }}>
                  <div style={{ background:'#f1f5f9', width:'80px', height:'80px', borderRadius:'24px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px' }}>
                    <Plus size={40} />
                  </div>
                  <div style={{ fontWeight:900, fontSize:18, color:'#0f172a' }}>Add New Asset</div>
                  <div style={{ fontSize:13, marginTop:8, fontWeight:500 }}>Create a new solar system or filter in the catalog</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="table-container" style={{ borderRadius:'30px', border:'1px solid #e2e8f0', background:'white' }}>
              <table className="table">
                <thead>
                  <tr style={{ background:'#f8fafc' }}>
                    <th style={{ padding:'24px', borderRadius:'30px 0 0 0' }}>PRODUCT SPECIFICATION</th>
                    <th>CATEGORY</th>
                    <th>INVENTORY STATUS</th>
                    <th>UNIT PRICE</th>
                    <th>SKU ID</th>
                    <th style={{ borderRadius:'0 30px 0 0' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map(p => (
                    <tr key={p.id} style={{ cursor:'pointer' }} onClick={() => { setSelected(p); setModal('product-view') }}>
                      <td style={{ padding:'20px 24px' }}>
                        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                          <div style={{ 
                            width:'48px', 
                            height:'48px', 
                            borderRadius:'16px', 
                            background: p.image ? `url(${p.image}) center/cover` : CAT_COLORS[p.category] + '15',
                            color: CAT_COLORS[p.category],
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            boxShadow: `0 8px 16px ${CAT_COLORS[p.category]}10`
                          }}>
                            {!p.image && (() => { const Icon = CAT_ICON[p.category] || Package; return <Icon size={24} />; })()}
                          </div>
                          <div>
                            <div style={{ fontWeight:800, fontSize:'15px', color:'#0f172a' }}>{p.name}</div>
                            <div style={{ fontSize:'12px', color:'#64748b' }}>{p.description.slice(0, 40)}...</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ 
                          fontSize:'11px', 
                          fontWeight:900, 
                          color:CAT_COLORS[p.category], 
                          background:CAT_COLORS[p.category]+'10', 
                          padding:'6px 14px', 
                          borderRadius:'10px',
                          letterSpacing:'0.5px'
                        }}>
                          {p.category.toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <span style={{ fontWeight:900, fontSize:'15px', minWidth:'24px' }}>{p.stock}</span>
                          <div style={{ width:'80px', height:'6px', background:'#f1f5f9', borderRadius:'3px', overflow:'hidden' }}>
                            <div style={{ width:`${Math.min((p.stock/50)*100,100)}%`, height:'100%', background:p.stock<=5?'#ef4444':CAT_COLORS[p.category], borderRadius:'3px' }} />
                          </div>
                          <span className={`badge badge-${STOCK_COLOR[p.status]}`} style={{ borderRadius:'8px', fontSize:'10px', fontWeight:800 }}>{p.status}</span>
                        </div>
                      </td>
                      <td style={{ fontWeight:950, fontSize:'15px', color:'#0f172a' }}>
                        <span style={{ fontSize:'12px', color:'#94a3b8', marginRight:'4px' }}>SAR</span>
                        {p.price.toLocaleString()}
                      </td>
                      <td style={{ fontFamily:'monospace', fontSize:'12px', fontWeight:700, color:'#64748b' }}>{p.sku}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="table-actions" style={{ gap:'10px' }}>
                          <button className="btn btn-ghost btn-sm" style={{ width:'36px', height:'36px' }} onClick={() => openEdit(p)}>
                            <Pencil size={16} />
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ width:'36px', height:'36px' }} onClick={() => { setSelected(p); setModal('stock-adjust') }}>
                            <Package size={16} />
                          </button>
                          <button className="btn btn-danger btn-sm" style={{ width:'36px', height:'36px' }} onClick={() => toast(`"${p.name}" deleted`, 'warning')}>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── ORDERS TAB ── */}
      {tab === 'orders' && (
        <>
          <div style={{ display:'flex', gap:'12px', alignItems:'center', marginBottom:'32px', overflowX:'auto', paddingBottom:'8px' }}>
            <div style={{ 
              display:'flex', 
              alignItems:'center', 
              gap:'8px', 
              background:'#f1f5f9', 
              padding:'6px 12px', 
              borderRadius:'14px',
              fontSize:'12px',
              fontWeight:800,
              color:'#64748b',
              marginRight:'12px'
            }}>
              <Activity size={14} /> STATUS
            </div>
            {['All','Pending','Processing','Shipped','Delivered'].map(s => (
              <button 
                key={s} 
                className={`filter-pill${orderStatusFilter===s?' active':''}`} 
                onClick={() => setOrderStatusFilter(s)}
                style={{
                  padding: '8px 20px',
                  borderRadius: '14px',
                  fontSize: '13px',
                  fontWeight: 800,
                  transition: 'all 0.3s',
                  background: orderStatusFilter === s ? '#0f172a' : 'white',
                  color: orderStatusFilter === s ? 'white' : '#64748b',
                  border: '1px solid #e2e8f0',
                  boxShadow: orderStatusFilter === s ? '0 8px 16px rgba(15, 23, 42, 0.15)' : 'none'
                }}
              >
                {s}
              </button>
            ))}
          </div>

          {viewMode === 'grid' ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(320px, 1fr))', gap:'32px' }}>
              {filteredOrders.map((o, idx) => (
                <div key={o.id} style={{ animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both` }}>
                  <CreativeOrderCard 
                    order={o} 
                    onView={order => { setSelected(order); setModal('order-view') }}
                    onEdit={order => { setSelected(order); setForm({status:order.status}); setModal('order-edit') }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="table-container" style={{ borderRadius:'30px', border:'1px solid #e2e8f0', background:'white' }}>
              <table className="table">
                <thead>
                  <tr style={{ background:'#f8fafc' }}>
                    <th style={{ padding:'24px', borderRadius:'30px 0 0 0' }}>ORDER HIERARCHY</th>
                    <th>CLIENT IDENTITY</th>
                    <th>LOGISTICS STATUS</th>
                    <th>VALUATION</th>
                    <th>PAYMENT</th>
                    <th style={{ borderRadius:'0 30px 0 0' }}>ACTIONS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map(o => (
                    <tr key={o.id} style={{ cursor:'pointer' }} onClick={() => { setSelected(o); setModal('order-view') }}>
                      <td style={{ padding:'20px 24px' }}>
                        <div>
                          <div style={{ fontWeight:950, color:'#3b82f6', fontFamily:'monospace', fontSize:'15px', letterSpacing:'-0.5px' }}>{o.id}</div>
                          <div style={{ fontSize:'11px', color:'#94a3b8', fontWeight:700, marginTop:'4px' }}>
                            <Calendar size={10} style={{ marginRight:'4px' }} /> {o.date.toUpperCase()}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                          <div style={{ 
                            width:'40px', 
                            height:'40px', 
                            borderRadius:'14px', 
                            background:'#3b82f615', 
                            color:'#3b82f6',
                            display:'flex',
                            alignItems:'center',
                            justifyContent:'center',
                            fontWeight:900,
                            fontSize:'14px'
                          }}>
                            {o.client.split(' ').map(n=>n[0]).join('').slice(0,2)}
                          </div>
                          <div>
                            <div style={{ fontWeight:800, fontSize:'14px', color:'#0f172a' }}>{o.client}</div>
                            <div style={{ fontSize:'11px', color:'#64748b', fontWeight:600 }}>PREMIUM PARTNER</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className={`badge badge-${ORDER_STATUS[o.status]}`} style={{ borderRadius:'10px', fontSize:'11px', fontWeight:900, padding:'6px 14px', textTransform:'uppercase' }}>
                          {o.status}
                        </div>
                      </td>
                      <td style={{ fontWeight:950, fontSize:'16px', color:'#0f172a' }}>
                        <span style={{ fontSize:'12px', color:'#94a3b8', marginRight:'4px' }}>SAR</span>
                        {o.amount.toLocaleString()}
                      </td>
                      <td>
                        <div style={{ display:'flex', alignItems:'center', gap:8, fontSize:'12px', fontWeight:800, color:'#64748b' }}>
                          <CreditCard size={14} /> {o.paymentType.toUpperCase()}
                        </div>
                      </td>
                      <td onClick={e => e.stopPropagation()}>
                        <div className="table-actions" style={{ gap:'10px' }}>
                          <button className="btn btn-ghost btn-sm" style={{ width:'36px', height:'36px' }} onClick={() => { setSelected(o); setModal('order-view') }}>
                            <Eye size={16} />
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ width:'36px', height:'36px' }} onClick={() => { setSelected(o); setForm({status:o.status}); setModal('order-edit') }}>
                            <Pencil size={16} />
                          </button>
                          <button className="btn btn-primary btn-sm" style={{ height:'36px', borderRadius:'10px', padding:'0 16px', gap:'8px' }} onClick={() => toast(`Invoice ${o.id}`, 'success')}>
                            <Plus size={14} /> INVOICE
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {/* ── OFFERS TAB ── */}
      {tab === 'offers' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(340px, 1fr))', gap:'32px' }}>
          {filteredOffers.map((o, idx) => (
            <div key={o.id} className="glass-card" style={{ 
              borderRadius:'32px', 
              padding:'28px', 
              position:'relative', 
              overflow:'hidden',
              animation: `fadeIn 0.5s ease-out ${idx * 0.05}s both`
            }}>
              <div style={{ 
                position:'absolute', 
                top:0, 
                right:0, 
                width:'120px', 
                height:'120px', 
                background:o.status==='Active'?'rgba(16, 185, 129, 0.08)':'rgba(59, 130, 246, 0.08)',
                borderRadius:'0 0 0 100%' 
              }} />
              
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'24px', position:'relative', zIndex:1 }}>
                <span className={`badge badge-${OFFER_STATUS[o.status]}`} style={{ borderRadius:'10px', fontSize:'10px', fontWeight:900, textTransform:'uppercase', padding:'6px 14px' }}>
                  {o.status}
                </span>
                <div style={{ fontSize:'10px', fontWeight:900, color:'#94a3b8', letterSpacing:'1px' }}>{o.type.toUpperCase()}</div>
              </div>
              
              <h3 style={{ fontSize:'20px', fontWeight:950, color:'#0f172a', marginBottom:'8px', lineHeight:1.2 }}>{o.title}</h3>
              <p style={{ fontSize:'13px', color:'#64748b', fontWeight:600, marginBottom:'24px' }}>Target: {o.appliesTo}</p>
              
              <div style={{ 
                background:'#0f172a', 
                borderRadius:'24px', 
                padding:'24px', 
                textAlign:'center', 
                marginBottom:'24px',
                boxShadow:'0 15px 30px -10px rgba(15, 23, 42, 0.3)'
              }}>
                <div style={{ fontSize:'48px', fontWeight:950, color:o.status==='Active'?'#10b981':'#3b82f6', lineHeight:1 }}>
                  {o.type==='Percentage'?`${o.discount}%`:`SAR ${o.discount}`}
                </div>
                <div style={{ fontSize:'11px', fontWeight:800, color:'white', opacity:0.6, letterSpacing:'2px', marginTop:'8px' }}>DISCOUNT PROTOCOL</div>
              </div>
              
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 8px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
                  <Calendar size={14} color="#94a3b8" />
                  <span style={{ fontSize:'12px', fontWeight:800, color:'#334155' }}>{o.validTo}</span>
                </div>
                <div style={{ fontSize:'11px', fontWeight:800, color:'#3b82f6', background:'#3b82f615', padding:'4px 10px', borderRadius:'8px' }}>
                  {o.used} REDEEMED
                </div>
              </div>

              <div style={{ display:'flex', gap:'8px', marginTop:'16px' }}>
                <button className="btn btn-ghost btn-sm" style={{ flex:1, borderRadius:'12px', background:'#f8fafc' }} onClick={() => { setSelected(o); setModal('offer-view'); }}>
                  <Eye size={16} style={{ marginRight:'6px' }} /> View Details
                </button>
                <button className="btn btn-ghost btn-sm" style={{ flex:1, borderRadius:'12px', background:'#f8fafc' }} onClick={() => { 
                  setSelected(o); 
                  setForm({ title:o.title, discount:o.discount, type:o.type, appliesTo:o.appliesTo, validTo:o.validTo, status:o.status }); 
                  setModal('offer-edit'); 
                }}>
                  <Pencil size={16} style={{ marginRight:'6px' }} /> Edit
                </button>
              </div>
            </div>
          ))}
          <div 
            className="glass-card" 
            style={{ 
              border:'2px dashed #e2e8f0', 
              background:'transparent', 
              display:'flex',
              flexDirection:'column',
              alignItems:'center', 
              justifyContent:'center', 
              minHeight:'300px', 
              cursor:'pointer', 
              borderRadius:'32px'
            }} 
            onClick={() => setModal('offer-add')}
          >
            <div style={{ textAlign:'center', color:'#94a3b8' }}>
              <div style={{ background:'#f1f5f9', width:'70px', height:'70px', borderRadius:'22px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px' }}>
                <Zap size={32} />
              </div>
              <div style={{ fontWeight:950, fontSize:18, color:'#0f172a' }}>Launch Promotion</div>
              <div style={{ fontSize:12, marginTop:6, fontWeight:600 }}>Create a new seasonal deal or bundle</div>
            </div>
          </div>
        </div>
      )}

      {/* ── PRODUCT MODALS ── */}
      {modal === 'product-view' && selected && (
        <Modal title="Infrastructure Asset Details" onClose={() => setModal(null)} size="lg"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius:'16px' }} onClick={() => setModal(null)}>Dismiss</button>
              <button className="btn btn-primary" style={{ borderRadius:'16px', background:'#0f172a', gap:'8px' }} onClick={e => openEdit(selected, e)}>
                <Pencil size={16} /> Modify Specs
              </button>
            </>
          }
        >
          <div style={{ display:'flex', gap:'32px', alignItems:'center', marginBottom: '32px' }}>
            <div style={{ 
              background: selected.image ? `url(${selected.image}) center/cover` : CAT_COLORS[selected.category], 
              width: '100px', 
              height: '100px', 
              borderRadius: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              boxShadow: `0 20px 40px ${CAT_COLORS[selected.category]}40`,
              transform: 'rotate(-5deg)'
            }}>
              {!selected.image && (() => { const Icon = CAT_ICON[selected.category] || Package; return <Icon size={48} />; })()}
            </div>
            <div style={{ flex:1 }}>
              <h2 style={{ fontSize: '28px', fontWeight: 950, color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.5px' }}>{selected.name}</h2>
              <div style={{ display:'flex', gap:'12px' }}>
                <span style={{ 
                  background: CAT_COLORS[selected.category]+'15', 
                  color: CAT_COLORS[selected.category],
                  fontSize: '12px', 
                  fontWeight: 900, 
                  padding: '6px 16px', 
                  borderRadius: '10px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {selected.category}
                </span>
                <span className={`badge badge-${STOCK_COLOR[selected.status]}`} style={{ borderRadius: '10px', padding: '6px 16px', fontSize: '12px' }}>
                  {selected.status}
                </span>
              </div>
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'20px', marginBottom:'32px' }}>
            {[
              { label:'UNIT VALUATION', val:`SAR ${selected.price.toLocaleString()}`, color:'#3b82f6', icon: DollarSign },
              { label:'INVENTORY COUNT', val:`${selected.stock} UNITS`, color:'#10b981', icon: Package },
              { label:'ASSET SERIAL (SKU)', val:selected.sku, color:'#8b5cf6', icon: ArrowRight }
            ].map(i => (
              <div key={i.label} style={{ background:'#f8fafc', padding:'24px', borderRadius:'24px', border:'1px solid #f1f5f9', textAlign:'center' }}>
                <div style={{ background:'white', width:'36px', height:'36px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', border:'1px solid #f1f5f9' }}>
                  <i.icon size={18} color={i.color} />
                </div>
                <div style={{ fontSize: '20px', fontWeight: 950, color: '#0f172a', marginBottom:'4px' }}>{i.val}</div>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px' }}>{i.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '24px', border: '1px solid #f1f5f9' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Pencil size={16} color="#3b82f6" /> ASSET DESCRIPTION
            </div>
            <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, margin: 0, fontWeight: 500 }}>{selected.description}</p>
          </div>
        </Modal>
      )}

      {/* Stock Adjust Modal */}
      {modal === 'stock-adjust' && selected && (
        <Modal title="Inventory Recalibration" onClose={() => setModal(null)} size="sm"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius:'16px' }} onClick={() => setModal(null)}>Abort</button>
              <button className="btn btn-primary" style={{ borderRadius:'16px', background:'#0f172a' }} onClick={() => { toast(`Stock updated`, 'success'); setModal(null) }}>Synchronize</button>
            </>
          }
        >
          <div style={{ marginBottom:'24px', background:'#f8fafc', padding:'20px', borderRadius:'20px', display:'flex', alignItems:'center', gap:'16px' }}>
            <div style={{ background:CAT_COLORS[selected.category], width:'48px', height:'48px', borderRadius:'14px', display:'flex', alignItems:'center', justifyContent:'center', color:'white' }}>
              <Package size={24} />
            </div>
            <div>
              <div style={{ fontWeight:900, color:'#0f172a' }}>{selected.name}</div>
              <div style={{ fontSize:12, color:'#64748b', fontWeight:700 }}>Current: <span style={{ color:'#3b82f6' }}>{selected.stock} Units</span></div>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>ADJUSTMENT PROTOCOL</label>
            <select className="form-control form-select" style={{ borderRadius:'14px', fontWeight:600 }}><option>Add Units</option><option>Remove Units</option><option>Override Quantity</option></select>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>UNIT QUANTITY</label>
            <input className="form-control" style={{ borderRadius:'14px', padding:'12px 16px', fontWeight:900 }} type="number" defaultValue={0} min={0} />
          </div>
        </Modal>
      )}

      {/* Product Add/Edit Modal */}
      {(modal === 'product-add' || modal === 'product-edit') && (
        <Modal title={modal==='product-add'?'Onboard New Asset':'Synchronize Asset Data'} onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius:'16px' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ borderRadius:'16px', background:'#0f172a' }} onClick={() => { toast(modal==='product-add'?'Asset created':'Asset updated', 'success'); setModal(null) }}>
                {modal==='product-add'?'Add Identity':'Confirm Sync'}
              </button>
            </>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'10px', letterSpacing:'1px' }}>PRODUCT IDENTITY</label>
              <input className="form-control" style={{ borderRadius:'16px', padding:'12px 18px', fontWeight:600 }} value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="e.g. Solar System 5kW" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'10px', letterSpacing:'1px' }}>ASSET CATEGORY</label>
              <select className="form-control form-select" style={{ borderRadius:'16px', fontWeight:600 }} value={form.category} onChange={e => setForm(f=>({...f,category:e.target.value}))}>
                {cats.filter(c=>c!=='All').map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'10px', letterSpacing:'1px' }}>UNIT VALUATION (SAR)</label>
              <input className="form-control" style={{ borderRadius:'16px', padding:'12px 18px', fontWeight:900 }} type="number" value={form.price} onChange={e => setForm(f=>({...f,price:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'10px', letterSpacing:'1px' }}>INITIAL STOCK VOLUME</label>
              <input className="form-control" style={{ borderRadius:'16px', padding:'12px 18px', fontWeight:900 }} type="number" value={form.stock} onChange={e => setForm(f=>({...f,stock:e.target.value}))} />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'10px', letterSpacing:'1px' }}>PRODUCT IMAGE URL</label>
              <input className="form-control" style={{ borderRadius:'16px', padding:'12px 18px', fontWeight:600 }} value={form.image || ''} onChange={e => setForm(f=>({...f,image:e.target.value}))} placeholder="https://..." />
            </div>
          </div>
          <div className="form-group" style={{ marginTop:'24px' }}>
            <label className="form-label" style={{ fontSize:'10px', letterSpacing:'1px' }}>TECHNICAL SPECIFICATIONS</label>
            <textarea className="form-control" style={{ borderRadius:'16px', padding:'16px', minHeight:'120px', fontWeight:500 }} value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="Enter detailed asset overview..." />
          </div>
        </Modal>
      )}

      {/* Order View Modal */}
      {modal === 'order-view' && selected && (
        <Modal title={`Transaction Record ${selected.id}`} onClose={() => setModal(null)} size="lg"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius:'16px' }} onClick={() => setModal(null)}>Dismiss</button>
              <button className="btn btn-primary" style={{ borderRadius:'16px', background:'#0f172a', gap:'8px' }} onClick={() => toast('Status recalibrated', 'success')}>
                <Activity size={18} /> Update Logistics
              </button>
            </>
          }
        >
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'32px', background:'#0f172a', padding:'32px', borderRadius:'32px', color:'white' }}>
            <div>
              <div style={{ fontSize:'32px', fontWeight:950, color:'#3b82f6', fontFamily:'monospace', letterSpacing:'-1px' }}>{selected.id}</div>
              <div style={{ fontSize:'14px', fontWeight:700, opacity:0.6, marginTop:'4px' }}>PROCESSED ON {selected.date.toUpperCase()}</div>
            </div>
            <div className={`badge badge-${ORDER_STATUS[selected.status]}`} style={{ borderRadius:'14px', padding:'10px 24px', fontSize:'14px', fontWeight:900 }}>
              {selected.status.toUpperCase()}
            </div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'24px', marginBottom:'32px' }}>
            {[
              { label:'CLIENT IDENTITY', val:selected.client, icon:Users },
              { label:'PAYMENT PROTOCOL', val:selected.paymentType, icon:CreditCard },
              { label:'GROSS VALUATION', val:`SAR ${selected.amount.toLocaleString()}`, icon:DollarSign }
            ].map(i => (
              <div key={i.label} style={{ background:'#f8fafc', padding:'24px', borderRadius:'24px', border:'1px solid #f1f5f9' }}>
                <div style={{ fontSize: '10px', fontWeight: 800, color: '#94a3b8', letterSpacing: '1px', marginBottom: '8px' }}>{i.label}</div>
                <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', display:'flex', alignItems:'center', gap:'8px' }}>
                  <i.icon size={16} color="#3b82f6" /> {i.val}
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:'#f8fafc', padding:'24px', borderRadius:'32px', border:'1px solid #f1f5f9' }}>
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#0f172a', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Package size={20} color="#3b82f6" /> CONSIGNMENT INVENTORY
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
              {selected.items.map((item, i) => (
                <div key={i} style={{ background:'white', padding:'16px 20px', borderRadius:'16px', border:'1px solid #f1f5f9', display:'flex', alignItems:'center', gap:'12px', fontSize:'14px', fontWeight:700, color:'#334155' }}>
                  <div style={{ width:'8px', height:'8px', borderRadius:'50%', background:'#3b82f6' }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </Modal>
      )}

      {/* Order Edit Modal */}
      {modal === 'order-edit' && selected && (
        <Modal title={`Update Logistics Record ${selected.id}`} onClose={() => setModal(null)} size="sm"
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius:'16px' }} onClick={() => setModal(null)}>Cancel</button>
              <button className="btn btn-primary" style={{ borderRadius:'16px', background:'#0f172a' }} onClick={() => { toast('Logistics updated', 'success'); setModal(null) }}>
                Confirm Update
              </button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>LOGISTICS STATUS</label>
            <select className="form-control form-select" style={{ borderRadius:'14px', fontWeight:600 }} value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))}>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
              <option>Cancelled</option>
            </select>
          </div>
        </Modal>
      )}

      {/* Offer Add Modal */}
      {modal === 'offer-add' && (
        <Modal title="Initialize Promotional Campaign" onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius:'16px' }} onClick={() => setModal(null)}>Abort</button>
              <button className="btn btn-primary" style={{ borderRadius:'16px', background:'#0f172a', gap:'8px' }} onClick={() => { toast('Campaign published', 'success'); setModal(null) }}>
                <Zap size={18} /> Deploy Campaign
              </button>
            </>
          }
        >
          <div className="form-group">
            <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>CAMPAIGN TITLE</label>
            <input className="form-control" style={{ borderRadius:'16px', padding:'12px 18px', fontWeight:700 }} placeholder="e.g. Summer Solar Fusion" />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>DISCOUNT PROTOCOL</label>
              <select className="form-control form-select" style={{ borderRadius:'14px', fontWeight:600 }}><option>Percentage-Based (%)</option><option>Fixed Value (SAR)</option></select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>VALUATION</label>
              <input className="form-control" style={{ borderRadius:'14px', padding:'12px 18px', fontWeight:900 }} type="number" placeholder="20" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>TARGET ASSET GROUP</label>
            <select className="form-control form-select" style={{ borderRadius:'14px', fontWeight:600 }}><option>Universal (All Assets)</option><option>Solar Systems Only</option><option>Water Filtration Units</option><option>Maintenance Protocols</option></select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>CAMPAIGN START</label>
              <input className="form-control" style={{ borderRadius:'14px', padding:'12px 18px' }} type="date" />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>EXPIRATION DATE</label>
              <input className="form-control" style={{ borderRadius:'14px', padding:'12px 18px' }} type="date" />
            </div>
          </div>
        </Modal>
      )}

      {/* Offer Edit Modal */}
      {(modal === 'offer-edit' || modal === 'offer-view') && selected && (
        <Modal title={modal==='offer-edit' ? "Update Promotional Campaign" : "Promotional Campaign Details"} onClose={() => setModal(null)}
          footer={
            <>
              <button className="btn btn-ghost" style={{ borderRadius:'16px' }} onClick={() => setModal(null)}>Close</button>
              {modal === 'offer-edit' && (
                <button className="btn btn-primary" style={{ borderRadius:'16px', background:'#0f172a', gap:'8px' }} onClick={() => { toast('Campaign updated', 'success'); setModal(null) }}>
                  <Zap size={18} /> Save Changes
                </button>
              )}
            </>
          }
        >
          <div className="form-group">
            <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>CAMPAIGN TITLE</label>
            <input className="form-control" style={{ borderRadius:'16px', padding:'12px 18px', fontWeight:700 }} value={form.title} onChange={e => setForm(f=>({...f,title:e.target.value}))} disabled={modal==='offer-view'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>DISCOUNT PROTOCOL</label>
              <select className="form-control form-select" style={{ borderRadius:'14px', fontWeight:600 }} value={form.type} onChange={e => setForm(f=>({...f,type:e.target.value}))} disabled={modal==='offer-view'}>
                <option>Percentage</option>
                <option>Fixed</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>VALUATION</label>
              <input className="form-control" style={{ borderRadius:'14px', padding:'12px 18px', fontWeight:900 }} type="number" value={form.discount} onChange={e => setForm(f=>({...f,discount:e.target.value}))} disabled={modal==='offer-view'} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>TARGET ASSET GROUP</label>
            <input className="form-control" style={{ borderRadius:'14px', padding:'12px 18px', fontWeight:600 }} value={form.appliesTo} onChange={e => setForm(f=>({...f,appliesTo:e.target.value}))} disabled={modal==='offer-view'} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>CAMPAIGN STATUS</label>
              <select className="form-control form-select" style={{ borderRadius:'14px', fontWeight:600 }} value={form.status} onChange={e => setForm(f=>({...f,status:e.target.value}))} disabled={modal==='offer-view'}>
                <option>Active</option>
                <option>Upcoming</option>
                <option>Expired</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" style={{ fontSize:'11px', letterSpacing:'1px' }}>EXPIRATION DATE</label>
              <input className="form-control" style={{ borderRadius:'14px', padding:'12px 18px' }} type="date" value={form.validTo} onChange={e => setForm(f=>({...f,validTo:e.target.value}))} disabled={modal==='offer-view'} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
