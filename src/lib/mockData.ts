// MEDIS Mock Data - Store Dashboard

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'manager' | 'clerk';
  avatar?: string;
}

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: 'beverages' | 'snacks' | 'supplies' | 'merchandise';
  currentStock: number;
  minStock: number;
  maxStock: number;
  unitPrice: number;
  costPrice: number;
  cratesOut: number;
  cratesReturned: number;
  lastRestocked: string;
  trend: number[]; // Last 7 days stock levels
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: 'utilities' | 'transport' | 'maintenance' | 'supplies' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  submittedBy: string;
  submittedAt: string;
  approvedBy?: string;
  approvedAt?: string;
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

export interface DailySummary {
  date: string;
  revenue: number;
  expenses: number;
  netProfit: number;
  transactions: number;
}

// Mock current user
export const mockUser: User = {
  id: '1',
  email: 'admin@medina.store',
  name: 'Admin Medina',
  role: 'admin',
};

// Mock inventory items
export const mockInventory: InventoryItem[] = [
  {
    id: '1',
    sku: 'CC-350ML',
    name: 'Coca-Cola 350ml',
    category: 'beverages',
    currentStock: 240,
    minStock: 100,
    maxStock: 500,
    unitPrice: 25,
    costPrice: 18,
    cratesOut: 45,
    cratesReturned: 38,
    lastRestocked: '2026-01-24',
    trend: [280, 265, 250, 248, 245, 242, 240],
  },
  {
    id: '2',
    sku: 'CC-1L',
    name: 'Coca-Cola 1L',
    category: 'beverages',
    currentStock: 85,
    minStock: 50,
    maxStock: 200,
    unitPrice: 45,
    costPrice: 32,
    cratesOut: 20,
    cratesReturned: 18,
    lastRestocked: '2026-01-23',
    trend: [120, 115, 105, 98, 92, 88, 85],
  },
  {
    id: '3',
    sku: 'SP-500ML',
    name: 'Sprite 500ml',
    category: 'beverages',
    currentStock: 180,
    minStock: 80,
    maxStock: 300,
    unitPrice: 30,
    costPrice: 22,
    cratesOut: 30,
    cratesReturned: 28,
    lastRestocked: '2026-01-25',
    trend: [150, 160, 170, 175, 178, 179, 180],
  },
  {
    id: '4',
    sku: 'FT-1.5L',
    name: 'Fanta Orange 1.5L',
    category: 'beverages',
    currentStock: 42,
    minStock: 60,
    maxStock: 150,
    unitPrice: 55,
    costPrice: 40,
    cratesOut: 15,
    cratesReturned: 12,
    lastRestocked: '2026-01-20',
    trend: [80, 72, 65, 58, 52, 48, 42],
  },
  {
    id: '5',
    sku: 'WTR-500ML',
    name: 'Dasani Water 500ml',
    category: 'beverages',
    currentStock: 450,
    minStock: 200,
    maxStock: 600,
    unitPrice: 15,
    costPrice: 10,
    cratesOut: 60,
    cratesReturned: 55,
    lastRestocked: '2026-01-26',
    trend: [420, 430, 440, 445, 448, 449, 450],
  },
  {
    id: '6',
    sku: 'SNK-CHIPS',
    name: 'Potato Chips Assorted',
    category: 'snacks',
    currentStock: 95,
    minStock: 50,
    maxStock: 200,
    unitPrice: 35,
    costPrice: 25,
    cratesOut: 0,
    cratesReturned: 0,
    lastRestocked: '2026-01-22',
    trend: [110, 108, 105, 102, 100, 98, 95],
  },
];

// Mock expenses
export const mockExpenses: Expense[] = [
  {
    id: '1',
    description: 'Electricity Bill - January',
    amount: 4500,
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
    amount: 1200,
    category: 'transport',
    status: 'pending',
    submittedBy: 'clerk@medina.store',
    submittedAt: '2026-01-25T09:15:00',
  },
  {
    id: '3',
    description: 'Refrigerator Repair',
    amount: 3500,
    category: 'maintenance',
    status: 'pending',
    submittedBy: 'manager@medina.store',
    submittedAt: '2026-01-26T08:00:00',
  },
  {
    id: '4',
    description: 'Cleaning Supplies',
    amount: 650,
    category: 'supplies',
    status: 'approved',
    submittedBy: 'clerk@medina.store',
    submittedAt: '2026-01-18T11:45:00',
    approvedBy: 'admin@medina.store',
    approvedAt: '2026-01-18T16:30:00',
  },
  {
    id: '5',
    description: 'Staff Lunch Allowance',
    amount: 800,
    category: 'other',
    status: 'rejected',
    submittedBy: 'clerk@medina.store',
    submittedAt: '2026-01-15T13:00:00',
  },
];

// Mock debt records
export const mockDebts: DebtRecord[] = [
  {
    id: '1',
    creditor: 'Coca-Cola Bottlers',
    principal: 150000,
    outstanding: 85000,
    interestRate: 0,
    startDate: '2026-01-01',
    dueDate: '2026-02-15',
    daysToDefault: 20,
    status: 'current',
    creditLimit: 200000,
  },
  {
    id: '2',
    creditor: 'Snacks Distributor Ltd',
    principal: 25000,
    outstanding: 22000,
    interestRate: 2.5,
    startDate: '2026-01-10',
    dueDate: '2026-02-01',
    daysToDefault: 6,
    status: 'warning',
    creditLimit: 30000,
  },
  {
    id: '3',
    creditor: 'Equipment Lease Co.',
    principal: 45000,
    outstanding: 45000,
    interestRate: 5,
    startDate: '2026-01-20',
    dueDate: '2026-01-28',
    daysToDefault: 2,
    status: 'critical',
    creditLimit: 50000,
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

// Dashboard KPIs
export const dashboardKPIs = {
  todayRevenue: 13500,
  todayExpenses: 6200,
  todayNetProfit: 7300,
  todayTransactions: 151,
  weekRevenue: 102500,
  weekExpenses: 54300,
  weekNetProfit: 48200,
  totalInventoryValue: 245680,
  lowStockItems: 2,
  pendingExpenses: 2,
  totalDebtOutstanding: 152000,
  creditUtilization: 76, // percentage
  cratesOutstanding: 22,
};

// Format currency (Nigerian Naira assumed)
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
export const getStockStatus = (current: number, min: number, max: number): 'low' | 'normal' | 'high' => {
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
