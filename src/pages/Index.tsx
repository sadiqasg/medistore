import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { DebtGauge } from '@/components/dashboard/DebtGauge';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { ProfitChart } from '@/components/dashboard/ProfitChart';
import { dashboardKPIs, formatCurrency } from '@/lib/mockData';
import {
  Banknote,
  TrendingUp,
  Package,
  AlertTriangle,
  CreditCard,
  ShoppingCart,
} from 'lucide-react';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your store overview for today.
          </p>
        </div>

        {/* Quick actions */}
        <QuickActions />

        {/* KPI Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Today's Revenue"
            value={formatCurrency(dashboardKPIs.todayRevenue)}
            icon={Banknote}
            trend={{ value: 8.2, label: 'vs yesterday' }}
            variant="success"
          />
          <MetricCard
            title="Net Profit"
            value={formatCurrency(dashboardKPIs.todayNetProfit)}
            icon={TrendingUp}
            trend={{ value: 12.5, label: 'vs yesterday' }}
          />
          <MetricCard
            title="Transactions"
            value={dashboardKPIs.todayTransactions}
            icon={ShoppingCart}
            trend={{ value: -3.1, label: 'vs yesterday' }}
          />
          <MetricCard
            title="Low Stock Items"
            value={dashboardKPIs.lowStockItems}
            icon={AlertTriangle}
            variant={dashboardKPIs.lowStockItems > 0 ? 'warning' : 'default'}
            subtitle="Items below threshold"
          />
        </div>

        {/* Secondary metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <MetricCard
            title="Weekly Revenue"
            value={formatCurrency(dashboardKPIs.weekRevenue)}
            subtitle={`${formatCurrency(dashboardKPIs.weekNetProfit)} net profit`}
            icon={Banknote}
            trend={{ value: 15.3, label: 'vs last week' }}
          />
          <MetricCard
            title="Total Debt Outstanding"
            value={formatCurrency(dashboardKPIs.totalDebtOutstanding)}
            icon={CreditCard}
            variant={dashboardKPIs.creditUtilization > 80 ? 'danger' : 'default'}
            subtitle={`${dashboardKPIs.creditUtilization}% credit utilization`}
          />
          <MetricCard
            title="Inventory Value"
            value={formatCurrency(dashboardKPIs.totalInventoryValue)}
            icon={Package}
            subtitle={`${dashboardKPIs.cratesOutstanding} crates outstanding`}
          />
        </div>

        {/* Main content grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* P&L Chart */}
          <div className="lg:col-span-2">
            <ProfitChart />
          </div>

          {/* Debt Gauge */}
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h3 className="font-semibold mb-4">Credit Utilization</h3>
            <div className="flex flex-col items-center">
              <DebtGauge
                value={dashboardKPIs.totalDebtOutstanding}
                max={200000}
                label="of ₦200,000 credit limit"
              />
              <div className="mt-6 w-full space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Outstanding</span>
                  <span className="font-medium font-mono">
                    {formatCurrency(dashboardKPIs.totalDebtOutstanding)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Available Credit</span>
                  <span className="font-medium font-mono text-success">
                    {formatCurrency(200000 - dashboardKPIs.totalDebtOutstanding)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Pending Expenses</span>
                  <span className="font-medium font-mono text-warning">
                    {dashboardKPIs.pendingExpenses} awaiting approval
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
}
