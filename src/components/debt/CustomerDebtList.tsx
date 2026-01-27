import { useState } from 'react';
import { cn } from '@/lib/utils';
import { mockCustomerDebts, formatCurrency } from '@/lib/mockData';
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
  Phone,
  User,
  CreditCard,
  Banknote,
  Plus,
} from 'lucide-react';
import { RecordPaymentDialog } from './RecordPaymentDialog';
import { MetricCard } from '@/components/dashboard/MetricCard';

const statusStyles = {
  current: {
    badge: 'bg-success/10 text-success border-success/30',
    progress: 'bg-success',
  },
  warning: {
    badge: 'bg-warning/10 text-warning border-warning/30',
    progress: 'bg-warning',
  },
  exceeded: {
    badge: 'bg-danger/10 text-danger border-danger/30',
    progress: 'bg-danger',
  },
};

export function CustomerDebtList() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>();

  const totalOwed = mockCustomerDebts.reduce((sum, c) => sum + c.totalOwed, 0);
  const customersWithDebt = mockCustomerDebts.filter(c => c.totalOwed > 0).length;
  const exceededCount = mockCustomerDebts.filter(c => c.status === 'exceeded').length;

  const handleRecordPayment = (customerId?: string) => {
    setSelectedCustomerId(customerId);
    setShowPaymentDialog(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Customer Debt"
            value={formatCurrency(totalOwed)}
            subtitle="outstanding balance"
            icon={CreditCard}
          />
          <MetricCard
            title="Customers with Debt"
            value={customersWithDebt}
            subtitle="active balances"
            icon={User}
          />
          <MetricCard
            title="Exceeded Limit"
            value={exceededCount}
            subtitle="need attention"
            icon={AlertTriangle}
            variant={exceededCount > 0 ? 'danger' : 'default'}
          />
          <Card className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <CardContent className="flex flex-col items-center justify-center h-full py-6">
              <Button onClick={() => handleRecordPayment()}>
                <Banknote className="mr-2 h-4 w-4" />
                Record Payment
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Customer debt cards */}
        <div className="space-y-4">
          {mockCustomerDebts.map((customer, index) => {
            const style = statusStyles[customer.status];
            const utilizationPercent = (customer.totalOwed / customer.maxDebtAllowed) * 100;

            return (
              <Card
                key={customer.id}
                className={cn(
                  'overflow-hidden animate-fade-in',
                  customer.status === 'exceeded' && 'border-danger/50'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row">
                    <div className="flex-1 p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-lg">{customer.customerName}</h3>
                            <Badge variant="outline" className={style.badge}>
                              {customer.status === 'exceeded' && (
                                <AlertTriangle className="mr-1 h-3 w-3" />
                              )}
                              {customer.status === 'exceeded' ? 'Limit Exceeded' : customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Phone className="h-3 w-3" />
                            {customer.customerPhone}
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold font-mono tabular-nums text-destructive">
                            {formatCurrency(customer.totalOwed)}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            of {formatCurrency(customer.maxDebtAllowed)} limit
                          </p>
                        </div>
                      </div>

                      {/* Utilization bar */}
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Debt Utilization</span>
                          <span className="font-medium">{utilizationPercent.toFixed(0)}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all duration-500', style.progress)}
                            style={{ width: `${Math.min(utilizationPercent, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action panel */}
                    <div className="bg-muted/30 border-t lg:border-t-0 lg:border-l border-border p-4 lg:w-40 flex flex-col items-center justify-center">
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => handleRecordPayment(customer.id)}
                      >
                        <Banknote className="mr-2 h-4 w-4" />
                        Record Payment
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <RecordPaymentDialog 
        open={showPaymentDialog} 
        onOpenChange={setShowPaymentDialog}
        preselectedCustomerId={selectedCustomerId}
      />
    </>
  );
}
