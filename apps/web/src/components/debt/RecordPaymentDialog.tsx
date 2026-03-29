import { useState } from 'react';
import { Banknote, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockCustomerDebts, formatCurrency } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  preselectedCustomerId?: string;
}

export function RecordPaymentDialog({ open, onOpenChange, preselectedCustomerId }: RecordPaymentDialogProps) {
  const { toast } = useToast();
  const [customerId, setCustomerId] = useState(preselectedCustomerId || '');
  const [amount, setAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'transfer'>('cash');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const selectedCustomer = mockCustomerDebts.find(c => c.id === customerId);
  const remainingBalance = selectedCustomer ? selectedCustomer.totalOwed - amount : 0;

  const handleSubmit = () => {
    if (!customerId) {
      toast({
        title: 'Error',
        description: 'Please select a customer',
        variant: 'destructive',
      });
      return;
    }
    if (amount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid payment amount',
        variant: 'destructive',
      });
      return;
    }
    if (selectedCustomer && amount > selectedCustomer.totalOwed) {
      toast({
        title: 'Error',
        description: 'Payment amount cannot exceed the outstanding balance',
        variant: 'destructive',
      });
      return;
    }

    const isFullPayment = remainingBalance === 0;

    toast({
      title: 'Payment Recorded',
      description: isFullPayment 
        ? `${selectedCustomer?.customerName}'s debt has been fully paid!`
        : `${formatCurrency(amount)} payment recorded. Remaining: ${formatCurrency(remainingBalance)}`,
    });

    // Reset form
    setCustomerId('');
    setAmount(0);
    setPaymentMethod('cash');
    setReference('');
    setNotes('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-primary" />
            <DialogTitle>Record Payment</DialogTitle>
          </div>
          <DialogDescription>
            Record a payment received from a customer against their outstanding balance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Customer selection */}
          <div className="space-y-2">
            <Label htmlFor="customer">Customer</Label>
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger>
                <SelectValue placeholder="Select customer" />
              </SelectTrigger>
              <SelectContent>
                {mockCustomerDebts.filter(c => c.totalOwed > 0).map((customer) => (
                  <SelectItem key={customer.id} value={customer.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{customer.customerName}</span>
                      <span className="text-muted-foreground ml-2">
                        {formatCurrency(customer.totalOwed)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Show current balance */}
          {selectedCustomer && (
            <div className="rounded-lg border border-border bg-muted/30 p-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Outstanding Balance</span>
                <span className="font-mono font-medium text-destructive">
                  {formatCurrency(selectedCustomer.totalOwed)}
                </span>
              </div>
              <div className="flex justify-between text-sm mt-1">
                <span className="text-muted-foreground">Phone</span>
                <span className="font-medium">{selectedCustomer.customerPhone}</span>
              </div>
            </div>
          )}

          {/* Payment amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Payment Amount (₦)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              max={selectedCustomer?.totalOwed}
              placeholder="0"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Payment method */}
          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as 'cash' | 'transfer')}>
              <SelectTrigger>
                <SelectValue placeholder="Select method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" />
                    Cash
                  </div>
                </SelectItem>
                <SelectItem value="transfer">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Bank Transfer
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reference for transfers */}
          {paymentMethod === 'transfer' && (
            <div className="space-y-2">
              <Label htmlFor="reference">Transfer Reference</Label>
              <Input
                id="reference"
                placeholder="e.g., TRF-123456"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          )}

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any notes about this payment..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Summary */}
          {selectedCustomer && amount > 0 && (
            <div className="rounded-lg bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Balance</span>
                <span className="font-mono">{formatCurrency(selectedCustomer.totalOwed)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment</span>
                <span className="font-mono text-success">- {formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-medium">Remaining Balance</span>
                <span className={`text-lg font-bold font-mono ${remainingBalance === 0 ? 'text-success' : ''}`}>
                  {formatCurrency(remainingBalance)}
                  {remainingBalance === 0 && ' ✓'}
                </span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            <Banknote className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
