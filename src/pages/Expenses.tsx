import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ExpensesList } from '@/components/expenses/ExpensesList';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { mockExpenses, formatCurrency } from '@/lib/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Receipt, Clock, CheckCircle2, XCircle } from 'lucide-react';

export default function Expenses() {
  const [activeTab, setActiveTab] = useState('all');

  const totals = {
    all: mockExpenses.reduce((sum, e) => sum + e.amount, 0),
    pending: mockExpenses
      .filter((e) => e.status === 'pending')
      .reduce((sum, e) => sum + e.amount, 0),
    approved: mockExpenses
      .filter((e) => e.status === 'approved')
      .reduce((sum, e) => sum + e.amount, 0),
  };

  const counts = {
    pending: mockExpenses.filter((e) => e.status === 'pending').length,
    approved: mockExpenses.filter((e) => e.status === 'approved').length,
    rejected: mockExpenses.filter((e) => e.status === 'rejected').length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">
            Submit and manage expense claims. Managers can approve or reject submissions.
          </p>
        </div>

        {/* Summary metrics */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Expenses"
            value={formatCurrency(totals.all)}
            subtitle="This month"
            icon={Receipt}
          />
          <MetricCard
            title="Pending Approval"
            value={formatCurrency(totals.pending)}
            subtitle={`${counts.pending} expense${counts.pending !== 1 ? 's' : ''}`}
            icon={Clock}
            variant={counts.pending > 0 ? 'warning' : 'default'}
          />
          <MetricCard
            title="Approved"
            value={formatCurrency(totals.approved)}
            subtitle={`${counts.approved} expense${counts.approved !== 1 ? 's' : ''}`}
            icon={CheckCircle2}
            variant="success"
          />
          <MetricCard
            title="Rejected"
            value={counts.rejected}
            subtitle="This month"
            icon={XCircle}
            variant={counts.rejected > 0 ? 'danger' : 'default'}
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="all">All Expenses</TabsTrigger>
            <TabsTrigger value="pending" className="gap-1.5">
              Pending
              {counts.pending > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-warning text-warning-foreground text-xs font-medium">
                  {counts.pending}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ExpensesList filter="all" />
          </TabsContent>
          <TabsContent value="pending" className="mt-4">
            <ExpensesList filter="pending" />
          </TabsContent>
          <TabsContent value="approved" className="mt-4">
            <ExpensesList filter="approved" />
          </TabsContent>
          <TabsContent value="rejected" className="mt-4">
            <ExpensesList filter="rejected" />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
