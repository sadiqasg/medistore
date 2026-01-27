import { useState } from 'react';
import { Plus, Trash2, Truck } from 'lucide-react';
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
import { mockInventory, formatCurrency, getProductDisplayName, BOTTLES_PER_CRATE } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  crates: number;
  unitCost: number;
}

interface CocaColaOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CocaColaOrderDialog({ open, onOpenChange }: CocaColaOrderDialogProps) {
  const { toast } = useToast();
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [depositReference, setDepositReference] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([
    { id: '1', productId: '', productName: '', crates: 0, unitCost: 0 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), productId: '', productName: '', crates: 0, unitCost: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof OrderItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        
        if (field === 'productId') {
          const product = mockInventory.find(p => p.id === value);
          return {
            ...item,
            productId: value as string,
            productName: product ? getProductDisplayName(product) : '',
            unitCost: product ? product.costPrice * BOTTLES_PER_CRATE : 0,
          };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const orderTotal = items.reduce((sum, item) => sum + (item.crates * item.unitCost), 0);
  const balance = depositAmount - orderTotal;

  const handleSubmit = () => {
    if (depositAmount <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter the deposit amount',
        variant: 'destructive',
      });
      return;
    }
    if (!depositReference.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter the deposit reference/receipt number',
        variant: 'destructive',
      });
      return;
    }
    if (items.filter(i => i.productId && i.crates > 0).length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one product to the order',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Order Booked',
      description: `Coca-Cola order of ${formatCurrency(orderTotal)} booked. Deposit: ${formatCurrency(depositAmount)}`,
    });

    // Reset form
    setDepositAmount(0);
    setDepositReference('');
    setNotes('');
    setItems([{ id: '1', productId: '', productName: '', crates: 0, unitCost: 0 }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            <DialogTitle>Book Coca-Cola Order</DialogTitle>
          </div>
          <DialogDescription>
            Deposit into Coca-Cola account and book your order for delivery.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Deposit details */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
            <h3 className="font-medium">Deposit Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Deposit Amount (₦)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={depositAmount || ''}
                  onChange={(e) => setDepositAmount(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit-reference">Receipt/Reference Number</Label>
                <Input
                  id="deposit-reference"
                  placeholder="e.g., TRF-123456"
                  value={depositReference}
                  onChange={(e) => setDepositReference(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Order Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-1 h-4 w-4" />
                Add Product
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-lg border border-border bg-card p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      Item {index + 1}
                    </span>
                    {items.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="sm:col-span-2">
                      <Label className="text-xs">Product</Label>
                      <Select
                        value={item.productId}
                        onValueChange={(value) => updateItem(item.id, 'productId', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {mockInventory.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {getProductDisplayName(product)} - {formatCurrency(product.costPrice * BOTTLES_PER_CRATE)}/crate
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs">Crates</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.crates || ''}
                        onChange={(e) =>
                          updateItem(item.id, 'crates', parseInt(e.target.value) || 0)
                        }
                      />
                    </div>
                  </div>
                  {item.productId && item.crates > 0 && (
                    <div className="text-right text-sm">
                      <span className="text-muted-foreground">Subtotal: </span>
                      <span className="font-mono font-medium">
                        {formatCurrency(item.crates * item.unitCost)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any special instructions or notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Summary */}
          <div className="rounded-lg bg-primary/5 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Order Total</span>
              <span className="font-mono font-medium">{formatCurrency(orderTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Deposit</span>
              <span className="font-mono font-medium">{formatCurrency(depositAmount)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-medium">Balance</span>
              <span className={`text-lg font-bold font-mono ${balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                {formatCurrency(Math.abs(balance))} {balance >= 0 ? 'credit' : 'due'}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            <Truck className="mr-2 h-4 w-4" />
            Book Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
