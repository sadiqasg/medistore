import { useState } from 'react';
import { DollarSign, Plus } from 'lucide-react';
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
import { formatCurrency, type CocaColaOrder } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface RecordOrderPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: CocaColaOrder | null;
}

export function RecordOrderPaymentDialog({ open, onOpenChange, order }: RecordOrderPaymentDialogProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState<number>(0);
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    if (amount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid payment amount',
        variant: 'destructive',
      });
      return;
    }

    if (order && amount > order.balance) {
      toast({
        title: 'Warning',
        description: 'Payment amount exceeds balance due. Overpayment will be recorded.',
        variant: 'warning',
      });
    }

    toast({
      title: 'Payment Recorded! 💰',
      description: `Payment of ${formatCurrency(amount)} has been recorded.`,
      variant: 'success',
    });

    setAmount(0);
    setNote('');
    onOpenChange(false);
  };

  if (!order) return null;

  const newBalance = order.balance - amount;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-success" />
            <DialogTitle>Record Payment</DialogTitle>
          </div>
          <DialogDescription>
            Record a payment for order from {order.customerName}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Order Summary */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Total</span>
              <span className="font-mono font-medium">{formatCurrency(order.orderTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Already Paid</span>
              <span className="font-mono font-medium text-success">{formatCurrency(order.amountPaid)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-medium">Current Balance</span>
              <span className={`font-bold font-mono ${order.balance > 0 ? 'text-destructive' : 'text-success'}`}>
                {formatCurrency(order.balance)}
              </span>
            </div>
          </div>

          {/* Payment History */}
          {order.payments.length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm text-muted-foreground">Payment History</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {order.payments.map((payment) => (
                  <div key={payment.id} className="flex justify-between text-sm p-2 rounded bg-muted/50">
                    <div>
                      <span className="font-medium">{formatCurrency(payment.amount)}</span>
                      {payment.note && <span className="text-muted-foreground ml-2">- {payment.note}</span>}
                    </div>
                    <span className="text-muted-foreground text-xs">
                      {new Date(payment.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Amount */}
          <div className="space-y-2">
            <Label htmlFor="payment-amount">Payment Amount (₦)</Label>
            <Input
              id="payment-amount"
              type="number"
              min="0"
              placeholder="Enter amount"
              value={amount || ''}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
            />
          </div>

          {/* Note */}
          <div className="space-y-2">
            <Label htmlFor="payment-note">Note (Optional)</Label>
            <Textarea
              id="payment-note"
              placeholder="e.g., Bank transfer, Cash payment..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
            />
          </div>

          {/* New Balance Preview */}
          {amount > 0 && (
            <div className="rounded-lg bg-primary/5 p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">This Payment</span>
                <span className="font-mono font-medium text-success">+{formatCurrency(amount)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="font-medium">New Balance</span>
                <span className={`text-lg font-bold font-mono ${newBalance > 0 ? 'text-destructive' : 'text-success'}`}>
                  {formatCurrency(Math.max(0, newBalance))}
                  {newBalance < 0 && <span className="text-sm ml-1">(overpaid by {formatCurrency(Math.abs(newBalance))})</span>}
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
            <Plus className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
