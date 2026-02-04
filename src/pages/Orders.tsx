import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OrdersList } from '@/components/orders/OrdersList';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { mockCocaColaOrders, formatCurrency } from '@/lib/mockData';
import { Truck, Package, Clock, CheckCircle2 } from 'lucide-react';

export default function Orders() {
  const pendingOrders = mockCocaColaOrders.filter(o => !o.isDelivered).length;
  const deliveredOrders = mockCocaColaOrders.filter(o => o.isDelivered).length;
  const totalPaid = mockCocaColaOrders.reduce((sum, o) => sum + o.amountPaid, 0);
  const totalBalance = mockCocaColaOrders.reduce((sum, o) => sum + o.balance, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
          <p className="text-muted-foreground">
            Book orders, track payments, and manage deliveries.
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Pending Orders"
            value={pendingOrders}
            subtitle="awaiting delivery"
            icon={Clock}
            variant={pendingOrders > 0 ? 'warning' : 'default'}
          />
          <MetricCard
            title="Delivered"
            value={deliveredOrders}
            subtitle="completed orders"
            icon={CheckCircle2}
            variant="success"
          />
          <MetricCard
            title="Total Paid"
            value={formatCurrency(totalPaid)}
            subtitle="this month"
            icon={Package}
          />
          <MetricCard
            title="Total Balance"
            value={formatCurrency(totalBalance)}
            subtitle="outstanding"
            icon={Truck}
            variant={totalBalance > 0 ? 'danger' : 'default'}
          />
        </div>

        {/* Orders list */}
        <OrdersList orders={mockCocaColaOrders} />
      </div>
    </DashboardLayout>
  );
}
