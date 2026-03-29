// MEDIS Mock Data - Store Dashboard
// Soft drinks/minerals from Coca-Cola only

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'sub-admin';
  canWrite: boolean;
  avatar?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'crates' | 'bottles' | 'cash';
  size: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  costPrice: number;
  cratesOut: number;
  cratesReturned: number;
  lastRestocked: string;
  trend: number[];
  isOutOfStock: boolean;
}

export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
}

export interface Expense {
  id: string;
  description: string;
  items: ExpenseItem[];
  totalAmount: number;
  category: 'utilities' | 'transport' | 'maintenance' | 'supplies' | 'tax' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
}

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  note?: string;
}

export interface SaleRecord {
  id: string;
  date: string;
  items: SaleItem[];
  totalAmount: number;
  paymentType: 'cash' | 'credit' | 'partial';
  amountPaid: number;
  amountOwed: number;
  customerName?: string;
  customerPhone?: string;
  payments: PaymentRecord[];
  status: 'paid' | 'partial' | 'credit';
}

export interface SaleItem {
  productId: string;
  productName: string;
  crates: number;
  bottles: number;
  unitPrice: number;
  total: number;
}

export interface DebtRecord {
  id: string;
  creditor: string;
  principal: number;
  outstanding: number;
  interestRate: number;
  startDate: string;
  dueDate: string;
  daysToDefault: number;
  status: 'current' | 'warning' | 'critical';
  creditLimit: number;
}

export interface CustomerDebt {
  id: string;
  customerName: string;
  customerPhone: string;
  totalOwed: number;
  maxDebtAllowed: number;
  sales: SaleRecord[];
  status: 'current' | 'warning' | 'exceeded';
}

export interface DailySummary {
  date: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  transactions: number;
}

export interface SystemNotification {
  id: string;
  type: 'low_stock' | 'debt_exceeded' | 'expense_pending' | 'payment_due';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  severity: 'info' | 'warning' | 'critical';
}

export interface CompanySettings {
  name: string;
  maxDebtPerCustomer: number;
  lowStockThreshold: number;
  debtWarningThreshold: number;
}

export interface CocaColaOrderItem {
  productId: string;
  productName: string;
  crates: number;
  unitCost: number;
}

export interface OrderPaymentRecord {
  id: string;
  date: string;
  amount: number;
  note?: string;
}

export interface CocaColaOrder {
  id: string;
  orderDate: string;
  customerName: string;
  items: CocaColaOrderItem[];
  orderTotal: number;
  amountPaid: number;
  balance: number;
  isDelivered: boolean;
  payments: OrderPaymentRecord[];
  notes?: string;
}

// Mock current user
export const mockUser: User = {
  id: '1',
  email: 'admin@medina.store',
  name: 'Admin Medina',
  role: 'admin',
  canWrite: true,
};

// Mock users list
export const mockUsers: User[] = [
  mockUser,
  {
    id: '2',
    email: 'manager@medina.store',
    name: 'Store Manager',
    role: 'sub-admin',
    canWrite: true,
  },
  {
    id: '3',
    email: 'clerk@medina.store',
    name: 'Sales Clerk',
    role: 'sub-admin',
    canWrite: false,
  },
];

// Mock company settings
export const mockCompanySettings: CompanySettings = {
  name: 'MEDIS Store',
  maxDebtPerCustomer: 50000,
  lowStockThreshold: 20,
  debtWarningThreshold: 40000,
};

// Mock inventory items - Coca-Cola soft drinks only
export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    sku: 'CC-35CL',
    name: 'Coca-Cola',
    size: '35cl',
    category: 'crates',
    currentStock: 24,
    minStock: 10,
    maxStock: 50,
    unitPrice: 200,
    costPrice: 150,
    cratesOut: 45,
    cratesReturned: 38,
    lastRestocked: '2026-01-24',
    trend: [28, 26, 25, 24, 24, 24, 24],
    isOutOfStock: false,
  },
  {
    id: '2',
    sku: 'CC-50CL',
    name: 'Coca-Cola',
    size: '50cl',
    category: 'crates',
    currentStock: 18,
    minStock: 8,
    maxStock: 40,
    unitPrice: 250,
    costPrice: 190,
    cratesOut: 20,
    cratesReturned: 18,
    lastRestocked: '2026-01-23',
    trend: [22, 21, 20, 19, 18, 18, 18],
    isOutOfStock: false,
  },
  {
    id: '3',
    sku: 'CC-1L',
    name: 'Coca-Cola',
    size: '1 Litre',
    category: 'crates',
    currentStock: 12,
    minStock: 6,
    maxStock: 30,
    unitPrice: 400,
    costPrice: 320,
    cratesOut: 15,
    cratesReturned: 12,
    lastRestocked: '2026-01-25',
    trend: [15, 14, 13, 13, 12, 12, 12],
    isOutOfStock: false,
  },
  {
    id: '4',
    sku: 'FT-35CL',
    name: 'Fanta Orange',
    size: '35cl',
    category: 'crates',
    currentStock: 20,
    minStock: 10,
    maxStock: 50,
    unitPrice: 200,
    costPrice: 150,
    cratesOut: 30,
    cratesReturned: 28,
    lastRestocked: '2026-01-25',
    trend: [22, 21, 21, 20, 20, 20, 20],
    isOutOfStock: false,
  },
  {
    id: '5',
    sku: 'FT-50CL',
    name: 'Fanta Orange',
    size: '50cl',
    category: 'crates',
    currentStock: 0,
    minStock: 8,
    maxStock: 40,
    unitPrice: 250,
    costPrice: 190,
    cratesOut: 12,
    cratesReturned: 10,
    lastRestocked: '2026-01-20',
    trend: [8, 6, 4, 2, 1, 0, 0],
    isOutOfStock: true,
  },
  {
    id: '6',
    sku: 'SP-35CL',
    name: 'Sprite',
    size: '35cl',
    category: 'crates',
    currentStock: 15,
    minStock: 10,
    maxStock: 50,
    unitPrice: 200,
    costPrice: 150,
    cratesOut: 25,
    cratesReturned: 22,
    lastRestocked: '2026-01-24',
    trend: [18, 17, 16, 16, 15, 15, 15],
    isOutOfStock: false,
  },
  {
    id: '7',
    sku: 'SP-50CL',
    name: 'Sprite',
    size: '50cl',
    category: 'crates',
    currentStock: 22,
    minStock: 8,
    maxStock: 40,
    unitPrice: 250,
    costPrice: 190,
    cratesOut: 18,
    cratesReturned: 16,
    lastRestocked: '2026-01-25',
    trend: [20, 21, 21, 22, 22, 22, 22],
    isOutOfStock: false,
  },
  {
    id: '8',
    sku: 'SCH-50CL',
    name: 'Schweppes',
    size: '50cl',
    category: 'crates',
    currentStock: 8,
    minStock: 6,
    maxStock: 30,
    unitPrice: 250,
    costPrice: 190,
    cratesOut: 10,
    cratesReturned: 8,
    lastRestocked: '2026-01-22',
    trend: [12, 11, 10, 9, 9, 8, 8],
    isOutOfStock: false,
  },
  {
    id: '9',
    sku: 'EVA-75CL',
    name: 'Eva Water',
    size: '75cl',
    category: 'crates',
    currentStock: 35,
    minStock: 15,
    maxStock: 60,
    unitPrice: 150,
    costPrice: 100,
    cratesOut: 40,
    cratesReturned: 38,
    lastRestocked: '2026-01-26',
    trend: [32, 33, 34, 34, 35, 35, 35],
    isOutOfStock: false,
  },
  {
    id: '10',
    sku: 'FG-35CL',
    name: 'Fanta Grape',
    size: '35cl',
    category: 'crates',
    currentStock: 5,
    minStock: 10,
    maxStock: 40,
    unitPrice: 200,
    costPrice: 150,
    cratesOut: 8,
    cratesReturned: 6,
    lastRestocked: '2026-01-18',
    trend: [12, 10, 8, 7, 6, 5, 5],
    isOutOfStock: false,
  },
];

// Mock expenses with items
export const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Electricity Bill - January',
    items: [
      { id: '1-1', description: 'PHCN Bill', amount: 4500, quantity: 1 },
    ],
    totalAmount: 4500,
    category: 'utilities',
    status: 'approved',
    submittedBy: 'clerk@medina.store',
    submittedAt: '2026-01-20T10:30:00',
    approvedBy: 'admin@medina.store',
    approvedAt: '2026-01-20T14:00:00',
  },
  {
    id: '2',
    description: 'Delivery Van Fuel',
    items: [
      { id: '2-1', description: 'Petrol (10 litres)', amount: 800, quantity: 1 },
      { id: '2-2', description: 'Engine Oil', amount: 400, quantity: 1 },
    ],
    totalAmount: 1200,
    category: 'transport',
    status: 'pending',
    submittedBy: 'clerk@medina.store',
    submittedAt: '2026-01-25T09:15:00',
  },
  {
    id: '3',
    description: 'Refrigerator Repair',
    items: [
      { id: '3-1', description: 'Compressor repair', amount: 2500, quantity: 1 },
      { id: '3-2', description: 'Gas refill', amount: 1000, quantity: 1 },
    ],
    totalAmount: 3500,
    category: 'maintenance',
    status: 'pending',
    submittedBy: 'manager@medina.store',
    submittedAt: '2026-01-26T08:00:00',
  },
  {
    id: '4',
    description: 'Cleaning Supplies',
    items: [
      { id: '4-1', description: 'Detergent', amount: 350, quantity: 2 },
      { id: '4-2', description: 'Mop and bucket', amount: 300, quantity: 1 },
    ],
    totalAmount: 650,
    category: 'supplies',
    status: 'approved',
    submittedBy: 'clerk@medina.store',
    submittedAt: '2026-01-18T11:45:00',
    approvedBy: 'admin@medina.store',
    approvedAt: '2026-01-18T16:30:00',
  },
  {
    id: '5',
    description: 'VAT Payment - Q4 2025',
    items: [
      { id: '5-1', description: 'VAT', amount: 12000, quantity: 1 },
    ],
    totalAmount: 12000,
    category: 'tax',
    status: 'approved',
    submittedBy: 'admin@medina.store',
    submittedAt: '2026-01-10T09:00:00',
    approvedBy: 'admin@medina.store',
    approvedAt: '2026-01-10T09:05:00',
  },
];

// Mock sales records
export const mockSales: SaleRecord[] = [
  {
    id: 'S001',
    date: '2026-01-26T10:30:00',
    items: [
      { productId: '1', productName: 'Coca-Cola 35cl', crates: 2, bottles: 6, unitPrice: 200, total: 5400 },
      { productId: '4', productName: 'Fanta Orange 35cl', crates: 1, bottles: 0, unitPrice: 200, total: 2400 },
    ],
    totalAmount: 7800,
    paymentType: 'cash',
    amountPaid: 7800,
    amountOwed: 0,
    payments: [],
    status: 'paid',
  },
  {
    id: 'S002',
    date: '2026-01-26T11:15:00',
    items: [
      { productId: '3', productName: 'Coca-Cola 1L', crates: 3, bottles: 0, unitPrice: 400, total: 14400 },
    ],
    totalAmount: 14400,
    paymentType: 'credit',
    amountPaid: 0,
    amountOwed: 14400,
    customerName: 'Mama Chidi',
    customerPhone: '08012345678',
    payments: [],
    status: 'credit',
  },
  {
    id: 'S003',
    date: '2026-01-26T14:00:00',
    items: [
      { productId: '6', productName: 'Sprite 35cl', crates: 1, bottles: 8, unitPrice: 200, total: 4000 },
      { productId: '9', productName: 'Eva Water 75cl', crates: 2, bottles: 0, unitPrice: 150, total: 3600 },
    ],
    totalAmount: 7600,
    paymentType: 'partial',
    amountPaid: 5000,
    amountOwed: 2600,
    customerName: 'Oga Tunde',
    customerPhone: '08098765432',
    payments: [
      { id: 'P001', date: '2026-01-26T14:00:00', amount: 5000, note: 'Will pay balance tomorrow' },
    ],
    status: 'partial',
  },
];

// Mock customer debts
export const mockCustomerDebts: CustomerDebt[] = [
  {
    id: 'CD001',
    customerName: 'Mama Chidi',
    customerPhone: '08012345678',
    totalOwed: 45000,
    maxDebtAllowed: 50000,
    sales: [],
    status: 'warning',
  },
  {
    id: 'CD002',
    customerName: 'Oga Tunde',
    customerPhone: '08098765432',
    totalOwed: 12600,
    maxDebtAllowed: 50000,
    sales: [],
    status: 'current',
  },
  {
    id: 'CD003',
    customerName: 'Mr. Johnson',
    customerPhone: '08055555555',
    totalOwed: 52000,
    maxDebtAllowed: 50000,
    sales: [],
    status: 'exceeded',
  },
];

// Mock debt records (supplier debts)
export const mockDebts: DebtRecord[] = [
  {
    id: '1',
    creditor: 'Coca-Cola Bottling Company',
    principal: 150000,
    outstanding: 85000,
    interestRate: 0,
    startDate: '2026-01-01',
    dueDate: '2026-02-15',
    daysToDefault: 20,
    status: 'current',
    creditLimit: 200000,
  },
];

// Mock daily summaries (last 7 days)
export const mockDailySummaries: DailySummary[] = [
  { date: '2026-01-20', revenue: 12500, expenses: 8200, netProfit: 4300, transactions: 145 },
  { date: '2026-01-21', revenue: 15200, expenses: 6800, netProfit: 8400, transactions: 168 },
  { date: '2026-01-22', revenue: 11800, expenses: 9500, netProfit: 2300, transactions: 132 },
  { date: '2026-01-23', revenue: 18500, expenses: 7200, netProfit: 11300, transactions: 195 },
  { date: '2026-01-24', revenue: 14200, expenses: 8900, netProfit: 5300, transactions: 158 },
  { date: '2026-01-25', revenue: 16800, expenses: 7500, netProfit: 9300, transactions: 182 },
  { date: '2026-01-26', revenue: 13500, expenses: 6200, netProfit: 7300, transactions: 151 },
];

// Mock weekly summaries
export const mockWeeklySummaries = [
  { week: 'Week 1', startDate: '2026-01-01', endDate: '2026-01-07', revenue: 85000, expenses: 42000, netProfit: 43000 },
  { week: 'Week 2', startDate: '2026-01-08', endDate: '2026-01-14', revenue: 92000, expenses: 48000, netProfit: 44000 },
  { week: 'Week 3', startDate: '2026-01-15', endDate: '2026-01-21', revenue: 78000, expenses: 45000, netProfit: 33000 },
  { week: 'Week 4', startDate: '2026-01-22', endDate: '2026-01-26', revenue: 62500, expenses: 38300, netProfit: 24200 },
];

// Mock monthly summaries
export const mockMonthlySummaries = [
  { month: 'January 2026', revenue: 317500, expenses: 173300, netProfit: 144200 },
];

// Mock yearly summaries
export const mockYearlySummaries = [
  { year: '2023', revenue: 3250000, expenses: 1850000, netProfit: 1400000 },
  { year: '2024', revenue: 3890000, expenses: 2100000, netProfit: 1790000 },
  { year: '2025', revenue: 4120000, expenses: 2250000, netProfit: 1870000 },
];

// Mock Coca-Cola orders
export const mockCocaColaOrders: CocaColaOrder[] = [
  {
    id: 'ORD001',
    orderDate: '2026-01-24T09:00:00',
    customerName: 'Coca-Cola Depot',
    items: [
      { productId: '1', productName: 'Coca-Cola 35cl', crates: 30, unitCost: 1800 },
      { productId: '4', productName: 'Fanta Orange 35cl', crates: 20, unitCost: 1800 },
      { productId: '6', productName: 'Sprite 35cl', crates: 15, unitCost: 1800 },
    ],
    orderTotal: 117000,
    amountPaid: 117000,
    balance: 0,
    isDelivered: true,
    payments: [
      { id: 'P001', date: '2026-01-24T09:00:00', amount: 117000, note: 'Full payment' },
    ],
    notes: 'Regular weekly order',
  },
  {
    id: 'ORD002',
    orderDate: '2026-01-20T10:30:00',
    customerName: 'Coca-Cola Main',
    items: [
      { productId: '3', productName: 'Coca-Cola 1L', crates: 20, unitCost: 3840 },
      { productId: '9', productName: 'Eva Water 75cl', crates: 25, unitCost: 1200 },
    ],
    orderTotal: 106800,
    amountPaid: 100000,
    balance: 6800,
    isDelivered: true,
    payments: [
      { id: 'P002', date: '2026-01-20T10:30:00', amount: 100000, note: 'Initial deposit' },
    ],
  },
  {
    id: 'ORD003',
    orderDate: '2026-01-26T08:00:00',
    customerName: 'Coca-Cola Depot',
    items: [
      { productId: '5', productName: 'Fanta Orange 50cl', crates: 25, unitCost: 2280 },
      { productId: '7', productName: 'Sprite 50cl', crates: 15, unitCost: 2280 },
    ],
    orderTotal: 91200,
    amountPaid: 80000,
    balance: 11200,
    isDelivered: false,
    payments: [
      { id: 'P003', date: '2026-01-26T08:00:00', amount: 80000, note: 'Deposit' },
    ],
    notes: 'Urgent restock for Fanta 50cl',
  },
];


export const mockNotifications: SystemNotification[] = [
  {
    id: 'N001',
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Fanta Orange 50cl is out of stock',
    createdAt: '2026-01-26T09:00:00',
    read: false,
    severity: 'critical',
  },
  {
    id: 'N002',
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Fanta Grape 35cl is below minimum stock level (5 crates remaining)',
    createdAt: '2026-01-26T08:30:00',
    read: false,
    severity: 'warning',
  },
  {
    id: 'N003',
    type: 'debt_exceeded',
    title: 'Customer Debt Exceeded',
    message: 'Mr. Johnson has exceeded the maximum debt limit (₦52,000 / ₦50,000)',
    createdAt: '2026-01-25T16:00:00',
    read: false,
    severity: 'critical',
  },
  {
    id: 'N004',
    type: 'expense_pending',
    title: 'Expense Pending Approval',
    message: '2 expenses are awaiting your approval',
    createdAt: '2026-01-26T08:00:00',
    read: true,
    severity: 'info',
  },
];

// Dashboard KPIs
export const dashboardKPIs = {
  todayRevenue: 29800,
  todayExpenses: 6200,
  todayNetProfit: 23600,
  todayTransactions: 3,
  weekRevenue: 62500,
  weekExpenses: 38300,
  weekNetProfit: 24200,
  totalInventoryValue: 89250,
  lowStockItems: 2,
  pendingExpenses: 2,
  totalDebtOutstanding: 85000,
  creditUtilization: 42.5,
  cratesOutstanding: 22,
  totalCustomerDebt: 109600,
};

// Format currency (Nigerian Naira)
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Get stock status
export const getStockStatus = (current: number, min: number, max: number): 'low' | 'normal' | 'high' | 'out' => {
  if (current === 0) return 'out';
  if (current <= min) return 'low';
  if (current >= max * 0.9) return 'high';
  return 'normal';
};

// Get debt status color
export const getDebtStatusColor = (status: DebtRecord['status']): string => {
  switch (status) {
    case 'current': return 'success';
    case 'warning': return 'warning';
    case 'critical': return 'danger';
    default: return 'muted';
  }
};

// Get product display name
export const getProductDisplayName = (item: InventoryItem): string => {
  return `${item.name} ${item.size}`;
};

// Calculate bottles per crate (standard is 12)
export const BOTTLES_PER_CRATE = 12;
