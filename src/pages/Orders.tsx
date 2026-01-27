import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { OrdersList } from '@/components/orders/OrdersList';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { mockCocaColaOrders, formatCurrency } from '@/lib/mockData';
import { Truck, Package, Clock, CheckCircle2 } from 'lucide-react';

export default function Orders() {
  const pendingOrders = mockCocaColaOrders.filter(o => o.status === 'pending').length;
  const confirmedOrders = mockCocaColaOrders.filter(o => o.status === 'confirmed').length;
  const deliveredOrders = mockCocaColaOrders.filter(o => o.status === 'delivered').length;
  const totalDeposits = mockCocaColaOrders.reduce((sum, o) => sum + o.depositAmount, 0);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Coca-Cola Orders</h1>
          <p className="text-muted-foreground">
            Book orders, track deposits, and manage deliveries from Coca-Cola.
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Pending Orders"
            value={pendingOrders}
            subtitle="awaiting confirmation"
            icon={Clock}
            variant={pendingOrders > 0 ? 'warning' : 'default'}
          />
          <MetricCard
            title="Confirmed"
            value={confirmedOrders}
            subtitle="awaiting delivery"
            icon={Package}
          />
          <MetricCard
            title="Delivered"
            value={deliveredOrders}
            subtitle="this month"
            icon={CheckCircle2}
            variant="success"
          />
          <MetricCard
            title="Total Deposits"
            value={formatCurrency(totalDeposits)}
            subtitle="this month"
            icon={Truck}
          />
        </div>

        {/* Orders list */}
        <OrdersList orders={mockCocaColaOrders} />
      </div>
    </DashboardLayout>
  );
}
