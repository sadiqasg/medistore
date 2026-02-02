import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Receipt,
  CreditCard,
  Truck,
} from 'lucide-react';

type ViewPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

export default function History() {
  const [activeTab, setActiveTab] = useState('sales');
  const [revenueView, setRevenueView] = useState<ViewPeriod>('daily');

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

  // Calculate revenue based on view period
  const getRevenueData = () => {
    switch (revenueView) {
      case 'daily':
        return mockDailySummaries;
      case 'weekly':
        return mockWeeklySummaries;
      case 'monthly':
        return mockMonthlySummaries;
      case 'yearly':
        return mockYearlySummaries;
      default:
        return mockDailySummaries;
    }
  };

  const currentPeriodRevenue = (() => {
    switch (revenueView) {
      case 'daily':
        return mockDailySummaries[mockDailySummaries.length - 1];
      case 'weekly':
        return mockWeeklySummaries[mockWeeklySummaries.length - 1];
      case 'monthly':
        return mockMonthlySummaries[mockMonthlySummaries.length - 1];
      case 'yearly':
        return mockYearlySummaries[mockYearlySummaries.length - 1];
    }
  })();

  const getPeriodLabel = () => {
    if (revenueView === 'yearly' && 'year' in currentPeriodRevenue) {
      return currentPeriodRevenue.year;
    }
    return '2026';
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">History</h1>
          <p className="text-muted-foreground">
            View your sales, expenses, and debt history. Toggle between time periods to see revenue trends.
          </p>
        </div>

        {/* Revenue Overview */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Revenue Overview</h2>
            <Select value={revenueView} onValueChange={(v) => setRevenueView(v as ViewPeriod)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
                <SelectItem value="yearly">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <MetricCard
              title={`${revenueView.charAt(0).toUpperCase() + revenueView.slice(1)} Revenue`}
              value={formatCurrency(currentPeriodRevenue.revenue)}
              subtitle={getPeriodLabel()}
              icon={TrendingUp}
              variant="success"
            />
            <MetricCard
              title={`${revenueView.charAt(0).toUpperCase() + revenueView.slice(1)} Expenses`}
              value={formatCurrency(currentPeriodRevenue.expenses)}
              subtitle={getPeriodLabel()}
              icon={TrendingDown}
            />
            <MetricCard
              title="Net Profit"
              value={formatCurrency(currentPeriodRevenue.netProfit)}
              subtitle={`${((currentPeriodRevenue.netProfit / currentPeriodRevenue.revenue) * 100).toFixed(1)}% margin`}
              icon={DollarSign}
              variant={currentPeriodRevenue.netProfit > 0 ? 'success' : 'danger'}
            />
          </div>

          {/* Revenue Table */}
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Period</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Expenses</TableHead>
                  <TableHead className="text-right">Net Profit</TableHead>
                  {revenueView === 'daily' && <TableHead className="text-right">Transactions</TableHead>}
                </TableRow>
              </TableHeader>
              <TableBody>
                {getRevenueData().map((item: any, index) => (
                  <TableRow key={index} className="data-row">
                    <TableCell className="font-medium">
                      {revenueView === 'daily' && formatShortDate(item.date)}
                      {revenueView === 'weekly' && item.week}
                      {revenueView === 'monthly' && item.month}
                      {revenueView === 'yearly' && item.year}
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
                    {revenueView === 'daily' && (
                      <TableCell className="text-right">{item.transactions}</TableCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* History Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                    <TableHead>Submitted By</TableHead>
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
                      <TableCell className="text-muted-foreground">
                        {expense.submittedBy.split('@')[0]}
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
      </div>
    </DashboardLayout>
  );
}
