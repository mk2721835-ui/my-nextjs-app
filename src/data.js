// ── Mock Data for KIRBY Admin Dashboard ──

export const COLORS = ['#3B82F6','#10B981','#F59E0B','#EF4444','#8B5CF6','#06B6D4'];

export const users = [
  { id: 1, name: 'Ahmed Al-Rashidi', initials: 'AA', role: 'Client', email: 'ahmed@email.com', phone: '+966 50 123 4567', status: 'Active', city: 'Riyadh', joinDate: '2024-01-15', lastActive: '2 hours ago', color: '#3B82F6', totalOrders: 3, totalPaid: 8500 },
  { id: 2, name: 'Sara Al-Ghamdi', initials: 'SG', role: 'Client', email: 'sara@email.com', phone: '+966 55 234 5678', status: 'Active', city: 'Jeddah', joinDate: '2024-02-20', lastActive: '5 hours ago', color: '#8B5CF6', totalOrders: 1, totalPaid: 12000 },
  { id: 3, name: 'Khalid Bin Naif', initials: 'KN', role: 'Client', email: 'khalid@email.com', phone: '+966 54 345 6789', status: 'Active', city: 'Dammam', joinDate: '2024-03-10', lastActive: '1 day ago', color: '#06B6D4', totalOrders: 2, totalPaid: 5200 },
  { id: 4, name: 'Fatima Hassan', initials: 'FH', role: 'Client', email: 'fatima@email.com', phone: '+966 56 456 7890', status: 'Inactive', city: 'Mecca', joinDate: '2024-04-01', lastActive: '2 weeks ago', color: '#10B981', totalOrders: 0, totalPaid: 0 },
  { id: 5, name: 'Omar Al-Zahrani', initials: 'OZ', role: 'Client', email: 'omar@email.com', phone: '+966 58 567 8901', status: 'Active', city: 'Medina', joinDate: '2024-04-15', lastActive: '3 days ago', color: '#F59E0B', totalOrders: 4, totalPaid: 22000 },
  { id: 6, name: 'Mohammed Salim', initials: 'MS', role: 'Technician', email: 'msalim@kirby.com', phone: '+966 50 678 9012', status: 'Online', city: 'Riyadh', joinDate: '2023-06-01', lastActive: 'Now', color: '#10B981', jobsDone: 142, rating: 4.8, specialty: 'Solar Systems', paymentsCollected: 45200, reportsCount: 28 },
  { id: 7, name: 'Ali Al-Otaibi', initials: 'AO', role: 'Technician', email: 'aotaibi@kirby.com', phone: '+966 55 789 0123', status: 'Offline', city: 'Jeddah', joinDate: '2023-07-15', lastActive: '3 hours ago', color: '#F59E0B', jobsDone: 98, rating: 4.5, specialty: 'Water Filters', paymentsCollected: 31800, reportsCount: 15 },
  { id: 8, name: 'Yusuf Al-Shammari', initials: 'YS', role: 'Technician', email: 'yshammari@kirby.com', phone: '+966 54 890 1234', status: 'Busy', city: 'Dammam', joinDate: '2023-08-20', lastActive: 'Now', color: '#3B82F6', jobsDone: 76, rating: 4.3, specialty: 'Maintenance', paymentsCollected: 22400, reportsCount: 12 },
  { id: 9, name: 'Nasser Al-Dosari', initials: 'ND', role: 'Technician', email: 'ndosari@kirby.com', phone: '+966 58 901 2345', status: 'Online', city: 'Riyadh', joinDate: '2023-10-01', lastActive: 'Now', color: '#EF4444', jobsDone: 55, rating: 4.6, specialty: 'Solar Systems', paymentsCollected: 18500, reportsCount: 9 },
  { id: 10, name: 'Hana Al-Mutairi', initials: 'HM', role: 'Accountant', email: 'hmutairi@kirby.com', phone: '+966 56 012 3456', status: 'Active', city: 'Riyadh', joinDate: '2023-03-01', lastActive: '30 min ago', color: '#8B5CF6' },
  { id: 11, name: 'Tariq Al-Anazi', initials: 'TA', role: 'Engineer', email: 'tanazi@kirby.com', phone: '+966 50 123 6789', status: 'Active', city: 'Riyadh', joinDate: '2022-11-01', lastActive: '1 hour ago', color: '#06B6D4' },
  { id: 12, name: 'Saud Al-Maliki', initials: 'SM', role: 'Management', email: 'smaliki@kirby.com', phone: '+966 55 234 7890', status: 'Active', city: 'Riyadh', joinDate: '2022-01-01', lastActive: '20 min ago', color: '#0F172A' },
];

export const devices = [
  { id: 1, clientId: 1, name: 'Solar Array 5kW', serial: 'SOL-X992-01', status: 'Optimal', history: ['Apr 12: Cleaning', 'Feb 01: Insp.'] },
  { id: 2, clientId: 1, name: 'Smart Inverter Pro', serial: 'INV-P883-02', status: 'Warning', history: ['Mar 28: Firmware', 'Jan 15: Install'] },
  { id: 3, clientId: 1, name: 'RO Water Filter', serial: 'WF-R772-03', status: 'Optimal', history: ['Apr 20: Membrane', 'Dec 10: Service'] },
  { id: 4, clientId: 2, name: 'Water Filter 9-Stage', serial: 'WF-9S-1042', status: 'Optimal', history: ['Apr 25: Installed'] },
  { id: 5, clientId: 5, name: 'Solar System 10kW', serial: 'SOL-10KW-402', status: 'Optimal', history: ['Apr 01: Installed', 'Apr 22: Cleaning'] },
];

export const technicalReports = [
  { id: 'REP-001', techId: 6, tech: 'Mohammed Salim', siteId: 'SITE-402', title: 'Solar Efficiency Audit', date: '2026-04-30', time: '10:45 AM', status: 'Approved', content: 'System performing at 98% efficiency after cleaning.' },
  { id: 'REP-002', techId: 7, tech: 'Ali Al-Otaibi', siteId: 'SITE-201', title: 'Filter Membrane Analysis', date: '2026-04-29', time: '02:30 PM', status: 'Under Review', content: 'Detected high TDS in input water. Membrane life at 40%.' },
  { id: 'REP-003', techId: 8, tech: 'Yusuf Al-Shammari', siteId: 'SITE-105', title: 'Inverter Fault Diagnostics', date: '2026-04-28', time: '11:15 AM', status: 'Approved', content: 'Replaced cooling fan. Heat dissipation normalized.' },
];

export const reviews = [
  { id: 1, clientId: 1, type: 'Device', target: 'Solar Array 5kW', rating: 5, comment: 'Solar array is peak efficiency', date: '2026-04-20' },
  { id: 2, clientId: 1, type: 'Technician', target: 'Mohammed Salim', rating: 4, comment: 'Mohammed was very professional', date: '2026-04-21' },
  { id: 3, clientId: 2, type: 'Device', target: 'Water Filter 9-Stage', rating: 5, comment: 'Water taste is amazing now.', date: '2026-04-26' },
];

export const maintenanceRequests = [
  { id: 'MR-001', client: 'Ahmed Al-Rashidi', clientId: 1, type: 'Solar Panel Fault', priority: 'High', status: 'In Progress', technicianId: 6, technician: 'Mohammed Salim', date: '2026-04-26', scheduled: '2026-04-28', city: 'Riyadh', description: 'Solar panels not generating expected output. Possible inverter issue.', faultPhotos: 2 },
  { id: 'MR-002', client: 'Sara Al-Ghamdi', clientId: 2, type: 'Water Filter Maintenance', priority: 'Medium', status: 'Scheduled', technicianId: 7, technician: 'Ali Al-Otaibi', date: '2026-04-25', scheduled: '2026-04-29', city: 'Jeddah', description: 'Annual maintenance for RO water filter system.', faultPhotos: 0 },
  { id: 'MR-003', client: 'Khalid Bin Naif', clientId: 3, type: 'Inverter Replacement', priority: 'Critical', status: 'Awaiting Parts', technicianId: 8, technician: 'Yusuf Al-Shammari', date: '2026-04-24', scheduled: '2026-04-27', city: 'Dammam', description: 'Inverter completely failed. Needs replacement unit.', faultPhotos: 3 },
  { id: 'MR-004', client: 'Omar Al-Zahrani', clientId: 5, type: 'Panel Cleaning', priority: 'Low', status: 'Completed', technicianId: 9, technician: 'Nasser Al-Dosari', date: '2026-04-22', scheduled: '2026-04-23', city: 'Medina', description: 'Full panel cleaning and efficiency check.', faultPhotos: 1 },
  { id: 'MR-005', client: 'Ahmed Al-Rashidi', clientId: 1, type: 'Battery Check', priority: 'Medium', status: 'Under Review', technicianId: null, technician: 'Unassigned', date: '2026-04-28', scheduled: null, city: 'Riyadh', description: 'Battery backup not holding charge properly.', faultPhotos: 1 },
  { id: 'MR-006', client: 'Sara Al-Ghamdi', clientId: 2, type: 'Filter Replacement', priority: 'High', status: 'Accepted', technicianId: 7, technician: 'Ali Al-Otaibi', date: '2026-04-27', scheduled: '2026-04-30', city: 'Jeddah', description: 'All filter membranes need replacement.', faultPhotos: 2 },
  { id: 'MR-007', client: 'Fatima Hassan', clientId: 4, type: 'Solar Installation Check', priority: 'Low', status: 'Closed', technicianId: 6, technician: 'Mohammed Salim', date: '2026-04-20', scheduled: '2026-04-21', city: 'Mecca', description: 'Post-installation inspection completed.', faultPhotos: 0 },
  { id: 'MR-008', client: 'Omar Al-Zahrani', clientId: 5, type: 'Smart Monitoring Setup', priority: 'Medium', status: 'In Progress', technicianId: 8, technician: 'Yusuf Al-Shammari', date: '2026-04-27', scheduled: '2026-04-28', city: 'Medina', description: 'Installing IoT monitoring for solar production tracking.', faultPhotos: 0 },
];

export const invoices = [
  { id: 'INV-0041', clientId: 1, client: 'Ahmed Al-Rashidi', techId: 6, tech: 'Mohammed Salim', requestId: 'MR-001', type: 'Maintenance', items: [{name:'Service Labor',qty:2,unit:150},{name:'Connector Repair',qty:1,unit:80}], total: 380, paid: 380, status: 'Paid', method: 'Cash', date: '2026-04-26', isNew: false },
  { id: 'INV-0042', clientId: 3, client: 'Khalid Bin Naif', techId: 8, tech: 'Yusuf Al-Shammari', requestId: 'MR-003', type: 'Maintenance + Parts', items: [{name:'Service Labor',qty:3,unit:150},{name:'Inverter Unit (5kW)',qty:1,unit:2200},{name:'Cables & Fittings',qty:1,unit:120}], total: 2770, paid: 0, status: 'Pending', method: null, date: '2026-04-27', isNew: true },
  { id: 'INV-0043', clientId: 5, client: 'Omar Al-Zahrani', techId: 9, tech: 'Nasser Al-Dosari', requestId: 'MR-004', type: 'Maintenance', items: [{name:'Panel Cleaning (20 panels)',qty:1,unit:350},{name:'Efficiency Report',qty:1,unit:50}], total: 400, paid: 400, status: 'Paid', method: 'Cash', date: '2026-04-23', isNew: false },
  { id: 'INV-0044', clientId: 2, client: 'Sara Al-Ghamdi', techId: 7, tech: 'Ali Al-Otaibi', requestId: 'MR-002', type: 'Maintenance', items: [{name:'Annual Service Fee',qty:1,unit:500}], total: 500, paid: 250, status: 'Partial', method: 'Cash', date: '2026-04-25', isNew: false },
  { id: 'INV-0045', clientId: 5, client: 'Omar Al-Zahrani', techId: 8, tech: 'Yusuf Al-Shammari', requestId: 'MR-008', type: 'Installation', items: [{name:'IoT Monitoring Kit',qty:1,unit:850},{name:'Installation Labor',qty:4,unit:150}], total: 1450, paid: 0, status: 'Pending', method: null, date: '2026-04-28', isNew: true },
  { id: 'INV-0040', clientId: 1, client: 'Ahmed Al-Rashidi', techId: 6, tech: 'Mohammed Salim', requestId: 'MR-001', type: 'Sales', items: [{name:'Solar System 10kW',qty:1,unit:18000},{name:'Battery Storage 5kWh',qty:1,unit:6500},{name:'Installation',qty:1,unit:2000}], total: 26500, paid: 26500, status: 'Paid', method: 'Cash', date: '2026-01-15', isNew: false },
  { id: 'INV-0039', clientId: 3, client: 'Khalid Bin Naif', techId: 6, tech: 'Mohammed Salim', requestId: null, type: 'Installment', items: [{name:'Installment Plan Payment #3',qty:1,unit:1500}], total: 1500, paid: 1500, status: 'Paid', method: 'Bank Transfer', date: '2026-04-01', isNew: false },
  { id: 'INV-0038', clientId: 4, client: 'Fatima Hassan', techId: null, tech: null, requestId: null, type: 'Overdue', items: [{name:'Water Filter System 6-Stage',qty:1,unit:3200}], total: 3200, paid: 800, status: 'Overdue', method: 'Installment', date: '2026-02-15', isNew: false },
];

export const products = [
  { id: 1, name: 'Solar System 5kW', category: 'Solar Systems', price: 12500, stock: 8, status: 'In Stock', sku: 'SOL-5KW-01', description: 'Complete 5kW solar system with panels, inverter, and mounting' },
  { id: 2, name: 'Solar System 10kW', category: 'Solar Systems', price: 22000, stock: 4, status: 'In Stock', sku: 'SOL-10KW-01', description: 'High-capacity 10kW solar system for large homes and businesses' },
  { id: 3, name: 'Solar System 3kW', category: 'Solar Systems', price: 8500, stock: 0, status: 'Out of Stock', sku: 'SOL-3KW-01', description: 'Compact 3kW solar system suitable for small homes' },
  { id: 4, name: 'Water Filter 6-Stage RO', category: 'Water Filters', price: 3200, stock: 15, status: 'In Stock', sku: 'WF-6S-RO-01', description: '6-stage reverse osmosis water filtration system' },
  { id: 5, name: 'Water Filter 9-Stage', category: 'Water Filters', price: 4800, stock: 3, status: 'Low Stock', sku: 'WF-9S-01', description: 'Advanced 9-stage water purification with UV sterilization' },
  { id: 6, name: 'Battery Storage 5kWh', category: 'Accessories', price: 6500, stock: 2, status: 'Low Stock', sku: 'BAT-5KWH-01', description: 'Lithium battery storage for solar energy systems' },
  { id: 7, name: 'Smart Inverter 5kW', category: 'Accessories', price: 2800, stock: 10, status: 'In Stock', sku: 'INV-5KW-01', description: 'Grid-tie hybrid inverter with WiFi monitoring' },
  { id: 8, name: 'Solar Panel 400W Mono', category: 'Spare Parts', price: 380, stock: 45, status: 'In Stock', sku: 'PNL-400W-M', description: 'High-efficiency monocrystalline solar panel' },
];

export const orders = [
  { id: 'ORD-1045', clientId: 5, client: 'Omar Al-Zahrani', items: ['Solar System 10kW', 'Battery Storage 5kWh'], amount: 28500, status: 'Delivered', date: '2026-04-01', paymentType: 'Cash' },
  { id: 'ORD-1046', clientId: 2, client: 'Sara Al-Ghamdi', items: ['Water Filter 9-Stage'], amount: 4800, status: 'Processing', date: '2026-04-20', paymentType: 'Installment' },
  { id: 'ORD-1047', clientId: 1, client: 'Ahmed Al-Rashidi', items: ['Solar Panel 400W Mono x5'], amount: 1900, status: 'Shipped', date: '2026-04-22', paymentType: 'Cash' },
  { id: 'ORD-1048', clientId: 3, client: 'Khalid Bin Naif', items: ['Smart Inverter 5kW'], amount: 2800, status: 'Pending', date: '2026-04-27', paymentType: 'Cash' },
  { id: 'ORD-1049', clientId: 5, client: 'Omar Al-Zahrani', items: ['Water Filter 6-Stage RO', 'Smart Inverter 5kW'], amount: 6000, status: 'Pending', date: '2026-04-28', paymentType: 'Installment' },
];

export const installmentPlans = [
  { id: 'PLAN-001', clientId: 1, client: 'Ahmed Al-Rashidi', product: 'Solar System 10kW', totalAmount: 22000, downPayment: 4000, months: 18, monthlyPayment: 1000, paid: 8000, remaining: 14000, nextDue: '2026-05-01', status: 'Active', paymentsCompleted: 8, paymentsTotal: 18 },
  { id: 'PLAN-002', clientId: 2, client: 'Sara Al-Ghamdi', product: 'Water Filter 9-Stage', totalAmount: 4800, downPayment: 800, months: 8, monthlyPayment: 500, paid: 4300, remaining: 500, nextDue: '2026-05-10', status: 'Active', paymentsCompleted: 7, paymentsTotal: 8 },
  { id: 'PLAN-003', clientId: 3, client: 'Khalid Bin Naif', product: 'Solar System 5kW', totalAmount: 12500, downPayment: 2500, months: 10, monthlyPayment: 1000, paid: 5500, remaining: 7000, nextDue: '2026-05-05', status: 'Active', paymentsCompleted: 5, paymentsTotal: 10 },
  { id: 'PLAN-004', clientId: 4, client: 'Fatima Hassan', product: 'Water Filter 6-Stage RO', totalAmount: 3200, downPayment: 800, months: 6, monthlyPayment: 400, paid: 800, remaining: 2400, nextDue: '2026-03-15', status: 'Overdue', paymentsCompleted: 0, paymentsTotal: 6 },
  { id: 'PLAN-005', clientId: 5, client: 'Omar Al-Zahrani', product: 'Solar System 10kW + Battery', totalAmount: 28500, downPayment: 5000, months: 24, monthlyPayment: 979, paid: 28500, remaining: 0, nextDue: null, status: 'Completed', paymentsCompleted: 24, paymentsTotal: 24 },
];

export const spareParts = [
  { id: 1, name: 'Solar Panel 400W Mono', code: 'PNL-400W-M', qty: 45, minQty: 10, price: 380, category: 'Panels', status: 'In Stock' },
  { id: 2, name: 'Inverter 5kW Hybrid', code: 'INV-5KW-H', qty: 3, minQty: 5, price: 2800, category: 'Inverters', status: 'Low Stock' },
  { id: 3, name: 'MPPT Charge Controller 40A', code: 'CTRL-40A-M', qty: 8, minQty: 5, price: 420, category: 'Controllers', status: 'In Stock' },
  { id: 4, name: 'RO Membrane 75GPD', code: 'MEM-75G-RO', qty: 22, minQty: 10, price: 85, category: 'Filter Parts', status: 'In Stock' },
  { id: 5, name: 'Carbon Block Filter', code: 'FLT-CB-10', qty: 35, minQty: 15, price: 35, category: 'Filter Parts', status: 'In Stock' },
  { id: 6, name: 'DC Cable 6mm² (per meter)', code: 'CBL-DC-6M', qty: 4, minQty: 20, price: 12, category: 'Cables', status: 'Low Stock' },
  { id: 7, name: 'MC4 Connector Pair', code: 'CON-MC4-P', qty: 120, minQty: 30, price: 8, category: 'Connectors', status: 'In Stock' },
  { id: 8, name: 'Battery 150Ah AGM', code: 'BAT-150A-G', qty: 0, minQty: 4, price: 650, category: 'Batteries', status: 'Out of Stock' },
];

export const partsRequests = [
  { id: 'PR-001', techId: 8, tech: 'Yusuf Al-Shammari', requestId: 'MR-003', part: 'Inverter 5kW Hybrid', partCode: 'INV-5KW-H', qty: 1, status: 'Pending', date: '2026-04-27', reason: 'Client inverter completely failed, needs replacement.' },
  { id: 'PR-002', techId: 6, tech: 'Mohammed Salim', requestId: 'MR-001', part: 'DC Cable 6mm² (per meter)', partCode: 'CBL-DC-6M', qty: 5, status: 'Approved', date: '2026-04-26', reason: 'Damaged cable causing power loss.' },
  { id: 'PR-003', techId: 9, tech: 'Nasser Al-Dosari', requestId: 'MR-008', part: 'WiFi Logger Module', partCode: 'MOD-WIFI-L', qty: 1, status: 'Pending', date: '2026-04-28', reason: 'Required for IoT monitoring installation.' },
  { id: 'PR-004', techId: 7, tech: 'Ali Al-Otaibi', requestId: 'MR-006', part: 'RO Membrane 75GPD', partCode: 'MEM-75G-RO', qty: 3, status: 'Rejected', date: '2026-04-25', reason: 'Filter replacement for Sara Al-Ghamdi.' },
];

export const monthlyRevenue = [
  { month: 'Nov', revenue: 42000, expenses: 18000, jobs: 28 },
  { month: 'Dec', revenue: 68000, expenses: 22000, jobs: 41 },
  { month: 'Jan', revenue: 52000, expenses: 19000, jobs: 35 },
  { month: 'Feb', revenue: 71000, expenses: 24000, jobs: 47 },
  { month: 'Mar', revenue: 58000, expenses: 21000, jobs: 38 },
  { month: 'Apr', revenue: 84000, expenses: 28000, jobs: 52 },
];

export const techPerformance = [
  { name: 'M. Salim', jobs: 22, rating: 4.8, time: 2.1 },
  { name: 'A. Otaibi', jobs: 18, rating: 4.5, time: 2.4 },
  { name: 'Y. Shammari', jobs: 14, rating: 4.3, time: 2.8 },
  { name: 'N. Dosari', jobs: 16, rating: 4.6, time: 2.2 },
];

export const statusDistribution = [
  { name: 'Completed', value: 24, color: '#10B981' },
  { name: 'In Progress', value: 8, color: '#3B82F6' },
  { name: 'Scheduled', value: 6, color: '#F59E0B' },
  { name: 'Under Review', value: 4, color: '#8B5CF6' },
  { name: 'Awaiting Parts', value: 3, color: '#EF4444' },
];

export const recentActivity = [
  { id: 1, icon: '📄', type: 'invoice', text: 'New invoice INV-0045 submitted by Yusuf Al-Shammari', time: '5 min ago', color: '#EF4444' },
  { id: 2, icon: '✅', type: 'complete', text: 'MR-004 marked as Completed by Nasser Al-Dosari', time: '1 hour ago', color: '#10B981' },
  { id: 3, icon: '📦', type: 'parts', text: 'Parts request PR-003 submitted by Nasser Al-Dosari', time: '2 hours ago', color: '#F59E0B' },
  { id: 4, icon: '🛒', type: 'order', text: 'New order ORD-1049 from Omar Al-Zahrani', time: '3 hours ago', color: '#3B82F6' },
  { id: 5, icon: '📄', type: 'invoice', text: 'New invoice INV-0042 submitted by Yusuf Al-Shammari', time: '4 hours ago', color: '#EF4444' },
  { id: 6, icon: '👤', type: 'user', text: 'New client registration: Fatima Hassan', time: '1 day ago', color: '#8B5CF6' },
];

// ── Fleet Management Data ──

export const vehicles = [
  { id: 'VH-001', indexNumber: 1, plate: 'ABC-1234', model: 'Toyota Hilux', year: 2022, status: 'In Use', color: '#3B82F6', odometerCurrent: 48200 },
  { id: 'VH-002', indexNumber: 2, plate: 'XYZ-5678', model: 'Ford Ranger', year: 2021, status: 'Available', color: '#10B981', odometerCurrent: 62450 },
  { id: 'VH-003', indexNumber: 3, plate: 'DEF-9012', model: 'Nissan Navara', year: 2023, status: 'In Use', color: '#F59E0B', odometerCurrent: 21300 },
  { id: 'VH-004', indexNumber: 4, plate: 'GHI-3456', model: 'Toyota LC 200', year: 2020, status: 'Under Maintenance', color: '#EF4444', odometerCurrent: 94700 },
  { id: 'VH-005', indexNumber: 5, plate: 'JKL-7890', model: 'Mitsubishi L200', year: 2022, status: 'In Use', color: '#8B5CF6', odometerCurrent: 33600 },
];

export const vehicleAssignments = [
  { id: 'VA-001', vehicleId: 'VH-001', techId: 6, techName: 'Mohammed Salim', startDate: '2026-04-25', startOdometer: 47800, endDate: null, endOdometer: null, status: 'Active', notes: 'Riyadh zone maintenance' },
  { id: 'VA-002', vehicleId: 'VH-003', techId: 8, techName: 'Yusuf Al-Shammari', startDate: '2026-04-27', startOdometer: 21100, endDate: null, endOdometer: null, status: 'Active', notes: 'Dammam service route' },
  { id: 'VA-003', vehicleId: 'VH-005', techId: 7, techName: 'Ali Al-Otaibi', startDate: '2026-04-26', startOdometer: 33200, endDate: null, endOdometer: null, status: 'Active', notes: 'Jeddah and surroundings' },
];

export const vehicleActivityLogs = [
  { id: 'AL-001', vehicleId: 'VH-001', assignmentId: 'VA-001', techId: 6, techName: 'Mohammed Salim',    type: 'Fuel',   date: '2026-04-26', description: 'Fuel refill at Al-Noor station',            fuelLiters: 55, cost: 143,   odometerReading: 47950 },
  { id: 'AL-002', vehicleId: 'VH-001', assignmentId: 'VA-001', techId: 6, techName: 'Mohammed Salim',    type: 'Note',   date: '2026-04-27', description: 'Vehicle running well, no issues',            fuelLiters: null, cost: null, odometerReading: 48100 },
  { id: 'AL-003', vehicleId: 'VH-003', assignmentId: 'VA-002', techId: 8, techName: 'Yusuf Al-Shammari', type: 'Fuel',   date: '2026-04-27', description: 'Refuel at Dammam highway station',           fuelLiters: 48, cost: 124.8, odometerReading: 21180 },
];

export const offers = [
  { id: 1, title: 'Ramadan Solar Special', discount: 15, type: 'Percentage', appliesTo: 'Solar Systems', validFrom: '2026-03-01', validTo: '2026-04-30', status: 'Active', used: 12 },
  { id: 2, title: 'Summer Maintenance Package', discount: 10, type: 'Percentage', appliesTo: 'Maintenance Services', validFrom: '2026-05-01', validTo: '2026-08-31', status: 'Upcoming', used: 0 },
  { id: 3, title: 'Water Filter Bundle Deal', discount: 500, type: 'Fixed', appliesTo: 'Water Filters', validFrom: '2026-04-01', validTo: '2026-04-30', status: 'Active', used: 7 },
  { id: 4, title: 'New Year Starter Pack', discount: 20, type: 'Percentage', appliesTo: 'All Products', validFrom: '2026-01-01', validTo: '2026-01-31', status: 'Expired', used: 24 },
];

export const permissions = {
  Management: { viewAll: true, editAll: true, deleteAll: true, manageUsers: true, viewReports: true, manageAccounting: true, assignJobs: true, manageInventory: true },
  Admin: { viewAll: true, editAll: true, deleteAll: true, manageUsers: true, viewReports: true, manageAccounting: true, assignJobs: true, manageInventory: true },
  Accountant: { viewAll: true, editAll: false, deleteAll: false, manageUsers: false, viewReports: true, manageAccounting: true, assignJobs: false, manageInventory: false },
  Engineer: { viewAll: true, editAll: true, deleteAll: false, manageUsers: false, viewReports: true, manageAccounting: false, assignJobs: true, manageInventory: true },
  Technician: { viewAll: false, editAll: false, deleteAll: false, manageUsers: false, viewReports: false, manageAccounting: false, assignJobs: false, manageInventory: false },
  Client: { viewAll: false, editAll: false, deleteAll: false, manageUsers: false, viewReports: false, manageAccounting: false, assignJobs: false, manageInventory: false },
};
