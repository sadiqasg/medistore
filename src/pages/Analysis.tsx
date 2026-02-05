import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  mockSales,
  mockExpenses,
  mockCustomerDebts,
  mockDailySummaries,
  mockWeeklySummaries,
  mockMonthlySummaries,
  mockYearlySummaries,
  formatCurrency,
} from '@/lib/mockData';

// Mock orders data for history
const mockOrdersHistory = [
  {
    id: '1',
    orderNumber: 'ORD-001',
    date: '2026-02-01T10:30:00',
    supplier: 'Coca-Cola',
    items: 24,
    totalAmount: 288000,
    status: 'delivered' as const,
  },
  {
    id: '2',
    orderNumber: 'ORD-002',
    date: '2026-01-28T14:15:00',
    supplier: 'Coca-Cola',
    items: 18,
    totalAmount: 216000,
    status: 'delivered' as const,
  },
  {
    id: '3',
    orderNumber: 'ORD-003',
    date: '2026-01-25T09:00:00',
    supplier: 'Coca-Cola',
    items: 30,
    totalAmount: 360000,
    status: 'delivered' as const,
  },
];

// Historical yearly data
const historicalYears = [
  {
    year: 2025,
    revenue: 42500000,
    expenses: 18200000,
    debt: 3500000,
    profit: 24300000,
    months: [
      { month: 'January', revenue: 3200000, expenses: 1400000, debt: 250000, profit: 1800000 },
      { month: 'February', revenue: 3100000, expenses: 1350000, debt: 220000, profit: 1750000 },
      { month: 'March', revenue: 3500000, expenses: 1500000, debt: 300000, profit: 2000000 },
      { month: 'April', revenue: 3400000, expenses: 1480000, debt: 280000, profit: 1920000 },
      { month: 'May', revenue: 3600000, expenses: 1550000, debt: 320000, profit: 2050000 },
      { month: 'June', revenue: 3700000, expenses: 1600000, debt: 350000, profit: 2100000 },
      { month: 'July', revenue: 3800000, expenses: 1650000, debt: 330000, profit: 2150000 },
      { month: 'August', revenue: 3650000, expenses: 1580000, debt: 310000, profit: 2070000 },
      { month: 'September', revenue: 3450000, expenses: 1500000, debt: 290000, profit: 1950000 },
      { month: 'October', revenue: 3550000, expenses: 1520000, debt: 300000, profit: 2030000 },
      { month: 'November', revenue: 3750000, expenses: 1620000, debt: 320000, profit: 2130000 },
      { month: 'December', revenue: 3800000, expenses: 1650000, debt: 330000, profit: 2150000 },
    ],
  },
  {
    year: 2024,
    revenue: 38000000,
    expenses: 16500000,
    debt: 4200000,
    profit: 21500000,
    months: [
      { month: 'January', revenue: 2900000, expenses: 1300000, debt: 350000, profit: 1600000 },
      { month: 'February', revenue: 2800000, expenses: 1250000, debt: 320000, profit: 1550000 },
      { month: 'March', revenue: 3100000, expenses: 1350000, debt: 380000, profit: 1750000 },
      { month: 'April', revenue: 3000000, expenses: 1320000, debt: 360000, profit: 1680000 },
      { month: 'May', revenue: 3200000, expenses: 1400000, debt: 390000, profit: 1800000 },
      { month: 'June', revenue: 3300000, expenses: 1450000, debt: 400000, profit: 1850000 },
      { month: 'July', revenue: 3400000, expenses: 1500000, debt: 370000, profit: 1900000 },
      { month: 'August', revenue: 3250000, expenses: 1420000, debt: 350000, profit: 1830000 },
      { month: 'September', revenue: 3150000, expenses: 1380000, debt: 340000, profit: 1770000 },
      { month: 'October', revenue: 3200000, expenses: 1400000, debt: 350000, profit: 1800000 },
      { month: 'November', revenue: 3350000, expenses: 1480000, debt: 360000, profit: 1870000 },
      { month: 'December', revenue: 3350000, expenses: 1450000, debt: 330000, profit: 1900000 },
    ],
  },
];

import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Receipt,
  CreditCard,
  Truck,
  History,
  ChevronRight,
  BarChart3,
} from 'lucide-react';

type FilterPeriod = 'today' | 'week' | 'month' | 'year';

export default function Analysis() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [filterPeriod, setFilterPeriod] = useState<FilterPeriod>('today');
  const [selectedYear, setSelectedYear] = useState<typeof historicalYears[0] | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatShortDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Get filter label
  const getFilterLabel = (period: FilterPeriod) => {
    switch (period) {
      case 'today': return 'Today';
      case 'week': return 'This Week';
      case 'month': return 'This Month';
      case 'year': return 'This Year';
    }
  };

  // Get current period data based on filter
  const getCurrentPeriodData = () => {
    switch (filterPeriod) {
      case 'today':
        return mockDailySummaries[mockDailySummaries.length - 1];
      case 'week':
        return mockWeeklySummaries[mockWeeklySummaries.length - 1];
      case 'month':
        return mockMonthlySummaries[mockMonthlySummaries.length - 1];
      case 'year':
        return mockYearlySummaries[mockYearlySummaries.length - 1];
      default:
        return mockDailySummaries[mockDailySummaries.length - 1];
    }
  };

  // Get table data based on filter
  const getTableData = () => {
    switch (filterPeriod) {
      case 'today':
        return mockDailySummaries;
      case 'week':
        return mockWeeklySummaries;
      case 'month':
        return mockMonthlySummaries;
      case 'year':
        return mockYearlySummaries;
      default:
        return mockDailySummaries;
    }
  };

  const currentData = getCurrentPeriodData();

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analysis</h1>
          <p className="text-muted-foreground">
            View your business performance, historical data, and detailed breakdowns.
          </p>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex gap-2">
            <TabsList className="h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger 
                value="analysis" 
                className="gap-2 px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
              >
                <BarChart3 className="h-4 w-4" />
                Analysis
              </TabsTrigger>
            </TabsList>
            <TabsList className="h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger 
                value="history" 
                className="gap-2 px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
              >
                <History className="h-4 w-4" />
                History
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="mt-6 space-y-6">
            {/* Filter Period Selector */}
            <div className="flex items-center gap-2">
              {(['today', 'week', 'month', 'year'] as FilterPeriod[]).map((period) => (
                <Button
                  key={period}
                  variant={filterPeriod === period ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterPeriod(period)}
                  className="capitalize"
                >
                  {getFilterLabel(period)}
                </Button>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <MetricCard
                title={`${getFilterLabel(filterPeriod)}'s Revenue`}
                value={formatCurrency(currentData.revenue)}
                subtitle={getFilterLabel(filterPeriod)}
                icon={TrendingUp}
                variant="success"
              />
              <MetricCard
                title={`${getFilterLabel(filterPeriod)}'s Expenses`}
                value={formatCurrency(currentData.expenses)}
                subtitle={getFilterLabel(filterPeriod)}
                icon={TrendingDown}
              />
              <MetricCard
                title="Net Profit"
                value={formatCurrency(currentData.netProfit)}
                subtitle={`${((currentData.netProfit / currentData.revenue) * 100).toFixed(1)}% margin`}
                icon={DollarSign}
                variant={currentData.netProfit > 0 ? 'success' : 'danger'}
              />
            </div>

            {/* Breakdown Table */}
            <div className="table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Period</TableHead>
                    <TableHead className="text-right">Revenue</TableHead>
                    <TableHead className="text-right">Expenses</TableHead>
                    <TableHead className="text-right">Net Profit</TableHead>
                    {filterPeriod === 'today' && <TableHead className="text-right">Transactions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {getTableData().map((item: any, index) => (
                    <TableRow key={index} className="data-row">
                      <TableCell className="font-medium">
                        {filterPeriod === 'today' && formatShortDate(item.date)}
                        {filterPeriod === 'week' && item.week}
                        {filterPeriod === 'month' && item.month}
                        {filterPeriod === 'year' && item.year}
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(item.revenue)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-muted-foreground">
                        {formatCurrency(item.expenses)}
                      </TableCell>
                      <TableCell className={`text-right font-mono ${item.netProfit >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(item.netProfit)}
                      </TableCell>
                      {filterPeriod === 'today' && (
                        <TableCell className="text-right">{item.transactions}</TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Historical Years Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Historical Years</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {historicalYears.map((yearData) => (
                  <div
                    key={yearData.year}
                    className="group cursor-pointer rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-md"
                    onClick={() => setSelectedYear(yearData)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-bold">{yearData.year}</h4>
                        <p className="text-sm text-muted-foreground">Click to view monthly breakdown</p>
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="font-mono font-semibold text-success">{formatCurrency(yearData.revenue)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Expenses</p>
                        <p className="font-mono font-semibold">{formatCurrency(yearData.expenses)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Debt</p>
                        <p className="font-mono font-semibold text-warning">{formatCurrency(yearData.debt)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Profit</p>
                        <p className="font-mono font-semibold text-success">{formatCurrency(yearData.profit)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history" className="mt-6 space-y-6">
            <Tabs defaultValue="sales">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="sales" className="gap-2">
                  <ShoppingCart className="h-4 w-4" />
                  Sales
                </TabsTrigger>
                <TabsTrigger value="expenses" className="gap-2">
                  <Receipt className="h-4 w-4" />
                  Expenses
                </TabsTrigger>
                <TabsTrigger value="debts" className="gap-2">
                  <CreditCard className="h-4 w-4" />
                  Debts
                </TabsTrigger>
                <TabsTrigger value="orders" className="gap-2">
                  <Truck className="h-4 w-4" />
                  Orders
                </TabsTrigger>
              </TabsList>

              {/* Sales History */}
              <TabsContent value="sales" className="mt-6">
                <div className="table-container">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead className="text-right">Paid</TableHead>
                        <TableHead className="text-right">Owed</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Customer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSales.map((sale) => (
                        <TableRow key={sale.id} className="data-row">
                          <TableCell className="font-medium">
                            {formatDate(sale.date)}
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              {sale.items.map((item, i) => (
                                <span key={i} className="text-sm">
                                  {item.productName}
                                  {i < sale.items.length - 1 && ', '}
                                </span>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(sale.totalAmount)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-success">
                            {formatCurrency(sale.amountPaid)}
                          </TableCell>
                          <TableCell className={`text-right font-mono ${sale.amountOwed > 0 ? 'text-warning' : ''}`}>
                            {formatCurrency(sale.amountOwed)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                sale.status === 'paid'
                                  ? 'secondary'
                                  : sale.status === 'partial'
                                  ? 'outline'
                                  : 'destructive'
                              }
                              className={
                                sale.status === 'paid'
                                  ? 'bg-success/10 text-success'
                                  : sale.status === 'partial'
                                  ? 'border-warning text-warning'
                                  : ''
                              }
                            >
                              {sale.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {sale.customerName || '—'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Expenses History */}
              <TabsContent value="expenses" className="mt-6">
                <div className="table-container">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockExpenses.map((expense) => (
                        <TableRow key={expense.id} className="data-row">
                          <TableCell className="font-medium">
                            {formatDate(expense.submittedAt)}
                          </TableCell>
                          <TableCell>{expense.description}</TableCell>
                          <TableCell className="capitalize">
                            <Badge variant="outline">{expense.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(expense.totalAmount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                expense.status === 'approved'
                                  ? 'secondary'
                                  : expense.status === 'pending'
                                  ? 'outline'
                                  : 'destructive'
                              }
                              className={
                                expense.status === 'approved'
                                  ? 'bg-success/10 text-success'
                                  : expense.status === 'pending'
                                  ? 'border-warning text-warning'
                                  : ''
                              }
                            >
                              {expense.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Customer Debts */}
              <TabsContent value="debts" className="mt-6">
                <div className="table-container">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead className="text-right">Total Owed</TableHead>
                        <TableHead className="text-right">Max Allowed</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockCustomerDebts.map((debt) => (
                        <TableRow key={debt.id} className="data-row">
                          <TableCell className="font-medium">{debt.customerName}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {debt.customerPhone}
                          </TableCell>
                          <TableCell className={`text-right font-mono ${
                            debt.status === 'exceeded' ? 'text-danger' : 
                            debt.status === 'warning' ? 'text-warning' : ''
                          }`}>
                            {formatCurrency(debt.totalOwed)}
                          </TableCell>
                          <TableCell className="text-right font-mono text-muted-foreground">
                            {formatCurrency(debt.maxDebtAllowed)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                debt.status === 'current'
                                  ? 'secondary'
                                  : debt.status === 'warning'
                                  ? 'outline'
                                  : 'destructive'
                              }
                              className={
                                debt.status === 'current'
                                  ? 'bg-success/10 text-success'
                                  : debt.status === 'warning'
                                  ? 'border-warning text-warning'
                                  : ''
                              }
                            >
                              {debt.status === 'exceeded' ? 'Limit Exceeded' : debt.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Orders History */}
              <TabsContent value="orders" className="mt-6">
                <div className="table-container">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Order #</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead className="text-right">Items</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrdersHistory.map((order) => (
                        <TableRow key={order.id} className="data-row">
                          <TableCell className="font-medium">
                            {formatDate(order.date)}
                          </TableCell>
                          <TableCell className="font-mono text-sm">
                            {order.orderNumber}
                          </TableCell>
                          <TableCell>{order.supplier}</TableCell>
                          <TableCell className="text-right">{order.items} crates</TableCell>
                          <TableCell className="text-right font-mono">
                            {formatCurrency(order.totalAmount)}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="secondary"
                              className="bg-success/10 text-success"
                            >
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>

      {/* Year Breakdown Dialog */}
      <Dialog open={!!selectedYear} onOpenChange={() => setSelectedYear(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{selectedYear?.year} Monthly Breakdown</DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto max-h-[60vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Debt</TableHead>
                  <TableHead className="text-right">Profit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedYear?.months.map((month, index) => (
                  <TableRow key={index} className="data-row">
                    <TableCell className="font-medium">{month.month}</TableCell>
                    <TableCell className="text-right font-mono text-success">
                      {formatCurrency(month.revenue)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {formatCurrency(month.expenses)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-warning">
                      {formatCurrency(month.debt)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-success">
                      {formatCurrency(month.profit)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}
