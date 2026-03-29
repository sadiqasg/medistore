import { useState, useEffect } from 'react';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
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
import { mockInventory, formatCurrency, getProductDisplayName, BOTTLES_PER_CRATE, type CocaColaOrder } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  crates: number;
  unitCost: number;
}

interface EditOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: CocaColaOrder | null;
}

export function EditOrderDialog({ open, onOpenChange, order }: EditOrderDialogProps) {
  const { toast } = useToast();
  const [customerName, setCustomerName] = useState('');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [isDelivered, setIsDelivered] = useState('true');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    if (order) {
      setCustomerName(order.customerName);
      setAmountPaid(order.amountPaid);
      setIsDelivered(order.isDelivered ? 'true' : 'false');
      setNotes(order.notes || '');
      setItems(order.items.map((item, idx) => ({
        id: idx.toString(),
        productId: item.productId,
        productName: item.productName,
        crates: item.crates,
        unitCost: item.unitCost,
      })));
    }
  }, [order]);

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
  const balance = orderTotal - amountPaid;

  const handleSubmit = () => {
    if (!customerName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter the customer/supplier name',
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
      title: 'Order Updated ✏️',
      description: `Order has been updated successfully.`,
      variant: 'info',
    });

    onOpenChange(false);
  };

  if (!order) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Pencil className="h-5 w-5 text-primary" />
            <DialogTitle>Edit Order</DialogTitle>
          </div>
          <DialogDescription>
            Update order details, items, or payment information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer/Supplier Name */}
          <div className="space-y-2">
            <Label htmlFor="customer-name">Customer/Supplier Name</Label>
            <Input
              id="customer-name"
              placeholder="e.g., Coca-Cola Depot"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
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

          {/* Payment details */}
          <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-4">
            <h3 className="font-medium">Payment Details</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount-paid">Amount Paid (₦)</Label>
                <Input
                  id="amount-paid"
                  type="number"
                  min="0"
                  placeholder="0"
                  value={amountPaid || ''}
                  onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                />
              </div>
              <div className="space-y-2">
                <Label>Balance (₦)</Label>
                <div className={`flex items-center h-10 px-3 rounded-md border border-input bg-background font-mono ${balance > 0 ? 'text-destructive' : 'text-success'}`}>
                  {formatCurrency(balance)}
                </div>
              </div>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="space-y-3">
            <Label>Delivery Status</Label>
            <RadioGroup
              value={isDelivered}
              onValueChange={setIsDelivered}
              className="flex gap-6"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="true" id="edit-delivered" />
                <Label htmlFor="edit-delivered" className="font-normal cursor-pointer">Delivered</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="false" id="edit-not-delivered" />
                <Label htmlFor="edit-not-delivered" className="font-normal cursor-pointer">Not Delivered</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes (Optional)</Label>
            <Textarea
              id="edit-notes"
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
              <span className="text-muted-foreground">Amount Paid</span>
              <span className="font-mono font-medium text-success">{formatCurrency(amountPaid)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2">
              <span className="font-medium">Balance Due</span>
              <span className={`text-lg font-bold font-mono ${balance > 0 ? 'text-destructive' : 'text-success'}`}>
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            <Pencil className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
