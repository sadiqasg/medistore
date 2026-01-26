import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { mockInventory, formatCurrency } from '@/lib/mockData';
import { Package, AlertTriangle, RotateCcw, TrendingUp } from 'lucide-react';

export default function Inventory() {
  const totalItems = mockInventory.reduce((sum, item) => sum + item.currentStock, 0);
  const lowStockItems = mockInventory.filter(
    (item) => item.currentStock <= item.minStock
  ).length;
  const totalValue = mockInventory.reduce(
    (sum, item) => sum + item.currentStock * item.costPrice,
    0
  );
  const cratesOutstanding = mockInventory.reduce(
    (sum, item) => sum + (item.cratesOut - item.cratesReturned),
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your stock levels, track trends, and monitor crate returns.
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Stock"
            value={totalItems.toLocaleString()}
            subtitle="units across all items"
            icon={Package}
          />
          <MetricCard
            title="Low Stock Alerts"
            value={lowStockItems}
            subtitle="items below minimum"
            icon={AlertTriangle}
            variant={lowStockItems > 0 ? 'warning' : 'default'}
          />
          <MetricCard
            title="Inventory Value"
            value={formatCurrency(totalValue)}
            subtitle="at cost price"
            icon={TrendingUp}
          />
          <MetricCard
            title="Crates Outstanding"
            value={cratesOutstanding}
            subtitle="pending return"
            icon={RotateCcw}
            variant={cratesOutstanding > 10 ? 'warning' : 'default'}
          />
        </div>

        {/* Inventory table */}
        <InventoryTable />
      </div>
    </DashboardLayout>
  );
}
