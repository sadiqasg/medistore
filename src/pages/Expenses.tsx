import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ExpensesList } from '@/components/expenses/ExpensesList';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { mockExpenses, formatCurrency } from '@/lib/mockData';
import { Receipt, Calendar, TrendingUp, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewExpenseDialog } from '@/components/expenses/NewExpenseDialog';

export default function Expenses() {
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);

  const totalExpenses = mockExpenses.reduce((sum, e) => sum + e.totalAmount, 0);
  const expenseCount = mockExpenses.length;
  const avgExpense = expenseCount > 0 ? totalExpenses / expenseCount : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
            <p className="text-muted-foreground">
              Track and manage all business expenses with itemized breakdowns.
            </p>
          </div>
          <Button onClick={() => setShowExpenseDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Expense
          </Button>
        </div>

        {/* Summary metrics */}
        <div className="grid gap-4 sm:grid-cols-3">
          <MetricCard
            title="Total Expenses"
            value={formatCurrency(totalExpenses)}
            subtitle="This month"
            icon={Receipt}
          />
          <MetricCard
            title="Number of Expenses"
            value={expenseCount}
            subtitle="This month"
            icon={Calendar}
          />
          <MetricCard
            title="Average Expense"
            value={formatCurrency(avgExpense)}
            subtitle="Per transaction"
            icon={TrendingUp}
          />
        </div>

        {/* Expenses List */}
        <ExpensesList />
      </div>

      <NewExpenseDialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog} />
    </DashboardLayout>
  );
}
