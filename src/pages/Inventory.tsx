import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { InventoryTable } from '@/components/inventory/InventoryTable';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { mockInventory, formatCurrency } from '@/lib/mockData';
import { Package, AlertTriangle, RotateCcw, Banknote } from 'lucide-react';

export default function Inventory() {
  const totalCrates = mockInventory.reduce((sum, item) => sum + item.currentStock, 0);
  const lowStockItems = mockInventory.filter(
    (item) => item.currentStock <= item.minStock
  ).length;
  const outOfStockItems = mockInventory.filter(
    (item) => item.currentStock === 0
  ).length;
  const totalValue = mockInventory.reduce(
    (sum, item) => sum + item.currentStock * 12 * item.costPrice, // 12 bottles per crate
    0
  );
  const cratesOutstanding = mockInventory.reduce(
    (sum, item) => sum + (item.cratesOut - item.cratesReturned),
    0
  );

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">
            Manage your stock levels for crates, bottles, and cash. Track trends and monitor crate returns.
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Crates"
            value={totalCrates.toLocaleString()}
            subtitle="crates in stock"
            icon={Package}
          />
          <MetricCard
            title="Stock Alerts"
            value={lowStockItems + outOfStockItems}
            subtitle={`${outOfStockItems} out of stock, ${lowStockItems} low`}
            icon={AlertTriangle}
            variant={lowStockItems + outOfStockItems > 0 ? 'warning' : 'default'}
          />
          <MetricCard
            title="Inventory Value"
            value={formatCurrency(totalValue)}
            subtitle="at cost price"
            icon={Banknote}
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
