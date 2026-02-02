import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DebtTracker } from '@/components/debt/DebtTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerDebtList } from '@/components/debt/CustomerDebtList';
import { OtherDebtList } from '@/components/debt/OtherDebtList';

export default function Debt() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Debt Tracking</h1>
          <p className="text-muted-foreground">
            Monitor credit utilization, payment schedules, and customer balances.
          </p>
        </div>

        {/* Tabs for supplier vs customer vs other debt */}
        <Tabs defaultValue="supplier" className="space-y-6">
          <TabsList>
            <TabsTrigger value="supplier">Supplier Debt (Coca-Cola)</TabsTrigger>
            <TabsTrigger value="customer">Customer Debt</TabsTrigger>
            <TabsTrigger value="other">Other Debts</TabsTrigger>
          </TabsList>

          <TabsContent value="supplier" className="space-y-6">
            <DebtTracker />
          </TabsContent>

          <TabsContent value="customer" className="space-y-6">
            <CustomerDebtList />
          </TabsContent>

          <TabsContent value="other" className="space-y-6">
            <OtherDebtList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
