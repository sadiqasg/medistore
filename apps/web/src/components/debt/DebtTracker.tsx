import { cn } from '@/lib/utils';
import { mockDebts, formatCurrency, type DebtRecord } from '@/lib/mockData';
import { DebtGauge } from '@/components/dashboard/DebtGauge';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  AlertTriangle,
  Calendar,
  CreditCard,
  Clock,
  TrendingUp,
  Plus,
} from 'lucide-react';

const statusStyles = {
  current: {
    badge: 'bg-success/10 text-success border-success/30',
    progress: 'bg-success',
  },
  warning: {
    badge: 'bg-warning/10 text-warning border-warning/30',
    progress: 'bg-warning',
  },
  critical: {
    badge: 'bg-danger/10 text-danger border-danger/30',
    progress: 'bg-danger',
  },
};

export function DebtTracker() {
  const totalOutstanding = mockDebts.reduce((sum, debt) => sum + debt.outstanding, 0);
  const totalCreditLimit = mockDebts.reduce((sum, debt) => sum + debt.creditLimit, 0);
  const utilizationPercentage = (totalOutstanding / totalCreditLimit) * 100;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="animate-fade-in">
          <CardHeader className="pb-2">
            <CardDescription>Total Outstanding</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono tabular-nums">
              {formatCurrency(totalOutstanding)}
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '50ms' }}>
          <CardHeader className="pb-2">
            <CardDescription>Credit Limit</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono tabular-nums">
              {formatCurrency(totalCreditLimit)}
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '100ms' }}>
          <CardHeader className="pb-2">
            <CardDescription>Active Loans</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold font-mono tabular-nums">
              {mockDebts.length}
            </p>
          </CardContent>
        </Card>

        <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
          <CardHeader className="pb-2">
            <CardDescription>Credit Utilization</CardDescription>
          </CardHeader>
          <CardContent>
            <DebtGauge
              value={totalOutstanding}
              max={totalCreditLimit}
              label=""
              className="scale-75 -my-4"
            />
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Active Debts</h2>
          <p className="text-sm text-muted-foreground">
            Monitor payment schedules and credit limits
          </p>
        </div>
        <Button size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      {/* Debt cards */}
      <div className="space-y-4">
        {mockDebts.map((debt, index) => {
          const style = statusStyles[debt.status];
          const paymentProgress = ((debt.principal - debt.outstanding) / debt.principal) * 100;

          return (
            <Card
              key={debt.id}
              className={cn(
                'overflow-hidden animate-fade-in',
                debt.status === 'critical' && 'border-danger/50'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Main content */}
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{debt.creditor}</h3>
                          <Badge variant="outline" className={style.badge}>
                            {debt.status === 'critical' && (
                              <AlertTriangle className="mr-1 h-3 w-3" />
                            )}
                            {debt.status.charAt(0).toUpperCase() + debt.status.slice(1)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {debt.interestRate > 0
                            ? `${debt.interestRate}% interest rate`
                            : 'Interest-free'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold font-mono tabular-nums">
                          {formatCurrency(debt.outstanding)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          of {formatCurrency(debt.principal)}
                        </p>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Payment Progress</span>
                        <span className="font-medium">{paymentProgress.toFixed(0)}%</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all duration-500', style.progress)}
                          style={{ width: `${paymentProgress}%` }}
                        />
                      </div>
                    </div>

                    {/* Details grid */}
                    <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Due Date</p>
                          <p className="text-sm font-medium">{formatDate(debt.dueDate)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Days to Default</p>
                          <p
                            className={cn(
                              'text-sm font-bold font-mono',
                              debt.daysToDefault <= 3 && 'text-danger',
                              debt.daysToDefault <= 7 && debt.daysToDefault > 3 && 'text-warning'
                            )}
                          >
                            {debt.daysToDefault}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Credit Limit</p>
                          <p className="text-sm font-medium">
                            {formatCurrency(debt.creditLimit)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-xs text-muted-foreground">Utilization</p>
                          <p className="text-sm font-medium">
                            {((debt.outstanding / debt.creditLimit) * 100).toFixed(0)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Side action panel for critical debts */}
                  {debt.status === 'critical' && (
                    <div className="bg-danger/5 border-t lg:border-t-0 lg:border-l border-danger/20 p-4 lg:w-48 flex flex-col items-center justify-center">
                      <AlertTriangle className="h-8 w-8 text-danger mb-2" />
                      <p className="text-sm font-medium text-danger text-center">
                        Urgent Payment Required
                      </p>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="mt-3 w-full"
                      >
                        Pay Now
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
