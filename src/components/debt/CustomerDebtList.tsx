import { useState } from 'react';
import { cn } from '@/lib/utils';
import { mockCustomerDebts, mockInventory, mockExpenses, mockSales, formatCurrency } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Banknote,
  Package,
  Wallet,
  TrendingUp,
  Users,
  CreditCard,
} from 'lucide-react';
import { RecordPaymentDialog } from './RecordPaymentDialog';

const statusStyles = {
  current: 'bg-success/10 text-success border-success/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
  exceeded: 'bg-destructive/10 text-destructive border-destructive/30',
};

export function CustomerDebtList() {
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>();

  // Calculate customer debt data with additional fields
  const customerData = mockCustomerDebts.map(customer => {
    // Simulate total amount (what customer bought) - in real app this comes from sales
    const totalAmount = customer.totalOwed + (customer.maxDebtAllowed * 0.3); // Mock: assume they paid 30% of limit
    const amountPaid = totalAmount - customer.totalOwed;
    const percentNotPaid = totalAmount > 0 ? (customer.totalOwed / totalAmount) * 100 : 0;
    
    return {
      ...customer,
      totalAmount,
      amountPaid,
      percentNotPaid,
    };
  });

  // Calculate totals
  const totalBalancePaid = customerData.reduce((sum, c) => sum + c.amountPaid, 0);
  const totalBalanceWithCustomers = customerData.reduce((sum, c) => sum + c.totalOwed, 0);
  const grandTotal = customerData.reduce((sum, c) => sum + c.totalAmount, 0);

  // Calculate empty crates from inventory
  const totalCratesOut = mockInventory.reduce((sum, item) => sum + item.cratesOut, 0);
  const totalCratesReturned = mockInventory.reduce((sum, item) => sum + item.cratesReturned, 0);
  const emptyCratesAvailable = totalCratesReturned; // Returned crates are available
  const emptyCratesWithCustomers = totalCratesOut - totalCratesReturned;

  // Calculate cash (revenue - expenses)
  const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.amountPaid, 0);
  const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.totalAmount, 0);
  const cashInHand = totalRevenue * 0.4; // Mock: 40% kept in hand
  const cashInBank = totalRevenue * 0.6 - totalExpenses; // Mock: 60% in bank minus expenses
  const totalCash = cashInHand + cashInBank;

  const handleRecordPayment = (customerId?: string) => {
    setSelectedCustomerId(customerId);
    setShowPaymentDialog(true);
  };

  return (
    <>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance Paid by Customers</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">{formatCurrency(totalBalancePaid)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance with Customers</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{formatCurrency(totalBalanceWithCustomers)}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empty Crates Available</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{emptyCratesAvailable}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Empty Crates with Customers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">{emptyCratesWithCustomers}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cash (After Expenses)</CardTitle>
              <Banknote className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalCash)}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Hand: {formatCurrency(cashInHand)} | Bank: {formatCurrency(cashInBank)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{formatCurrency(totalRevenue)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Header with action */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Customer Debt Ledger</h2>
            <p className="text-sm text-muted-foreground">
              Track customer balances and payment history
            </p>
          </div>
          <Button onClick={() => handleRecordPayment()}>
            <Banknote className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </div>

        {/* Customer Debt Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer Name</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Amount Paid</TableHead>
                  <TableHead className="text-right">Debt Amount</TableHead>
                  <TableHead className="text-right">% Not-Paid</TableHead>
                  <TableHead className="text-right">Overall Debt %</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customerData.map((customer) => {
                  const overallDebtPercent = grandTotal > 0 
                    ? (customer.totalOwed / totalBalanceWithCustomers) * 100 
                    : 0;

                  return (
                    <TableRow key={customer.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{customer.customerName}</span>
                          <Badge variant="outline" className={cn('text-xs', statusStyles[customer.status])}>
                            {customer.status}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground">{customer.customerPhone}</div>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(customer.totalAmount)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-success">
                        {formatCurrency(customer.amountPaid)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-destructive font-semibold">
                        {formatCurrency(customer.totalOwed)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge 
                          variant="outline" 
                          className={cn(
                            customer.percentNotPaid > 70 ? 'bg-destructive/10 text-destructive' :
                            customer.percentNotPaid > 40 ? 'bg-warning/10 text-warning' :
                            'bg-success/10 text-success'
                          )}
                        >
                          {customer.percentNotPaid.toFixed(1)}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono">
                        {overallDebtPercent.toFixed(1)}%
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRecordPayment(customer.id)}
                        >
                          Pay
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {/* Totals Row */}
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right font-mono">
                    {formatCurrency(grandTotal)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-success">
                    {formatCurrency(totalBalancePaid)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-destructive">
                    {formatCurrency(totalBalanceWithCustomers)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline">
                      {grandTotal > 0 ? ((totalBalanceWithCustomers / grandTotal) * 100).toFixed(1) : 0}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">100%</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <RecordPaymentDialog 
        open={showPaymentDialog} 
        onOpenChange={setShowPaymentDialog}
        preselectedCustomerId={selectedCustomerId}
      />
    </>
  );
}
