import { useState } from 'react';
import { formatCurrency } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Building2, Users, Landmark, Wallet } from 'lucide-react';

// Mock data for other debts
const mockOtherDebts = [
  {
    id: '1',
    source: 'Family Loan',
    type: 'family' as const,
    lender: 'Uncle John',
    totalAmount: 50000,
    amountPaid: 20000,
    interestRate: 0,
    dueDate: '2026-06-15',
    status: 'active' as const,
    notes: 'Business startup loan',
  },
  {
    id: '2',
    source: 'Bank Loan',
    type: 'bank' as const,
    lender: 'First Bank',
    totalAmount: 200000,
    amountPaid: 75000,
    interestRate: 12,
    dueDate: '2027-01-15',
    status: 'active' as const,
    notes: 'SME business loan',
  },
  {
    id: '3',
    source: 'Friend Loan',
    type: 'friend' as const,
    lender: 'Michael Okonkwo',
    totalAmount: 30000,
    amountPaid: 30000,
    interestRate: 0,
    dueDate: '2025-12-01',
    status: 'paid' as const,
    notes: 'Emergency stock purchase',
  },
  {
    id: '4',
    source: 'Government Grant',
    type: 'government' as const,
    lender: 'SMEDAN',
    totalAmount: 100000,
    amountPaid: 0,
    interestRate: 5,
    dueDate: '2028-03-01',
    status: 'active' as const,
    notes: 'Youth entrepreneurship program',
  },
];

const typeIcons = {
  family: Users,
  friend: Users,
  bank: Building2,
  government: Landmark,
};

const typeLabels = {
  family: 'Family',
  friend: 'Friend',
  bank: 'Bank',
  government: 'Government',
};

export function OtherDebtList() {
  const [dialogOpen, setDialogOpen] = useState(false);

  const totalDebt = mockOtherDebts.reduce((sum, d) => sum + d.totalAmount, 0);
  const totalPaid = mockOtherDebts.reduce((sum, d) => sum + d.amountPaid, 0);
  const totalOutstanding = totalDebt - totalPaid;
  const activeDebts = mockOtherDebts.filter((d) => d.status === 'active').length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Borrowed</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDebt)}</div>
            <p className="text-xs text-muted-foreground">All loan sources</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <Wallet className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{formatCurrency(totalPaid)}</div>
            <p className="text-xs text-muted-foreground">
              {((totalPaid / totalDebt) * 100).toFixed(1)}% repaid
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <Wallet className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{formatCurrency(totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground">Remaining balance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Loans</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDebts}</div>
            <p className="text-xs text-muted-foreground">
              of {mockOtherDebts.length} total loans
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Debts Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Loan Records</CardTitle>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Loan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Loan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Loan Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="bank">Bank</SelectItem>
                      <SelectItem value="government">Government</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lender Name</Label>
                  <Input placeholder="e.g., First Bank, Uncle John" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                  <div className="space-y-2">
                    <Label>Interest Rate (%)</Label>
                    <Input type="number" placeholder="0" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Due Date</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Notes</Label>
                  <Input placeholder="Purpose of loan..." />
                </div>
                <Button className="w-full" onClick={() => setDialogOpen(false)}>
                  Add Loan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          <div className="table-container">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Lender</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Paid</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead className="text-center">Interest</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockOtherDebts.map((debt) => {
                  const Icon = typeIcons[debt.type];
                  const balance = debt.totalAmount - debt.amountPaid;
                  return (
                    <TableRow key={debt.id} className="data-row">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
                            <Icon className="h-4 w-4" />
                          </div>
                          <span className="text-sm font-medium">
                            {typeLabels[debt.type]}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{debt.lender}</TableCell>
                      <TableCell className="text-right font-mono">
                        {formatCurrency(debt.totalAmount)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-success">
                        {formatCurrency(debt.amountPaid)}
                      </TableCell>
                      <TableCell className={`text-right font-mono ${balance > 0 ? 'text-warning' : 'text-success'}`}>
                        {formatCurrency(balance)}
                      </TableCell>
                      <TableCell className="text-center">
                        {debt.interestRate > 0 ? `${debt.interestRate}%` : '—'}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {formatDate(debt.dueDate)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={debt.status === 'paid' ? 'secondary' : 'outline'}
                          className={
                            debt.status === 'paid'
                              ? 'bg-success/10 text-success'
                              : 'border-warning text-warning'
                          }
                        >
                          {debt.status === 'paid' ? 'Paid' : 'Active'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
