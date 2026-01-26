import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DebtTracker } from '@/components/debt/DebtTracker';

export default function Debt() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Debt Tracking</h1>
          <p className="text-muted-foreground">
            Monitor credit utilization, payment schedules, and days to default.
          </p>
        </div>

        {/* Debt tracker */}
        <DebtTracker />
      </div>
    </DashboardLayout>
  );
}
