import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DebtTracker } from '@/components/debt/DebtTracker';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomerDebtList } from '@/components/debt/CustomerDebtList';
import { OtherDebtList } from '@/components/debt/OtherDebtList';
import { Users, Truck, Wallet } from 'lucide-react';

export default function Debt() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Customer Ledger</h1>
          <p className="text-muted-foreground">
            Manage customer registries, track credit balances, and monitor payment schedules.
          </p>
        </div>

        {/* Tabs for customer vs supplier vs other debt */}
        <Tabs defaultValue="customer" className="space-y-6">
          <div className="flex gap-2">
            <TabsList className="h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger 
                value="customer" 
                className="gap-2 px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
              >
                <Users className="h-4 w-4" />
                Customer Debt
              </TabsTrigger>
            </TabsList>
            <TabsList className="h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger 
                value="supplier" 
                className="gap-2 px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
              >
                <Truck className="h-4 w-4" />
                Supplier (Coca-Cola)
              </TabsTrigger>
            </TabsList>
            <TabsList className="h-auto p-1 bg-muted/50 rounded-xl">
              <TabsTrigger 
                value="other" 
                className="gap-2 px-4 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-lg"
              >
                <Wallet className="h-4 w-4" />
                Other Debts
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="customer" className="space-y-6">
            <CustomerDebtList />
          </TabsContent>

          <TabsContent value="supplier" className="space-y-6">
            <DebtTracker />
          </TabsContent>

          <TabsContent value="other" className="space-y-6">
            <OtherDebtList />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
