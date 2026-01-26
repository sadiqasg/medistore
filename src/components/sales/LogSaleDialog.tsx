import { useState } from 'react';
import { Plus, Trash2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Badge } from '@/components/ui/badge';
import {
  mockInventory,
  formatCurrency,
  getProductDisplayName,
  BOTTLES_PER_CRATE,
} from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface SaleLineItem {
  id: string;
  productId: string;
  productName: string;
  crates: number;
  bottles: number;
  unitPrice: number;
  total: number;
}

interface LogSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogSaleDialog({ open, onOpenChange }: LogSaleDialogProps) {
  const { toast } = useToast();
  const [items, setItems] = useState<SaleLineItem[]>([]);
  const [paymentType, setPaymentType] = useState<'cash' | 'credit' | 'partial'>('cash');
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  const availableProducts = mockInventory.filter((item) => item.category === 'crates');

  const addItem = () => {
    setItems([
      ...items,
      {
        id: Date.now().toString(),
        productId: '',
        productName: '',
        crates: 0,
        bottles: 0,
        unitPrice: 0,
        total: 0,
      },
    ]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const updateItem = (id: string, field: string, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;

        const updated = { ...item, [field]: value };

        if (field === 'productId') {
          const product = availableProducts.find((p) => p.id === value);
          if (product) {
            updated.productName = getProductDisplayName(product);
            updated.unitPrice = product.unitPrice;
          }
        }

        // Recalculate total
        const crateTotal = updated.crates * BOTTLES_PER_CRATE * updated.unitPrice;
        const bottleTotal = updated.bottles * updated.unitPrice;
        updated.total = crateTotal + bottleTotal;

        return updated;
      })
    );
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);
  const amountOwed = paymentType === 'cash' ? 0 : total - amountPaid;

  const handleSubmit = () => {
    if (items.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one item',
        variant: 'destructive',
      });
      return;
    }

    if (items.some((item) => !item.productId)) {
      toast({
        title: 'Error',
        description: 'Please select a product for all items',
        variant: 'destructive',
      });
      return;
    }

    if (paymentType !== 'cash' && (!customerName.trim() || !customerPhone.trim())) {
      toast({
        title: 'Error',
        description: 'Customer details are required for credit sales',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Sale Logged',
      description: `${formatCurrency(total)} - ${
        paymentType === 'cash'
          ? 'Paid in full'
          : paymentType === 'credit'
          ? 'On credit'
          : `${formatCurrency(amountPaid)} paid, ${formatCurrency(amountOwed)} owed`
      }`,
    });

    // Reset form
    setItems([]);
    setPaymentType('cash');
    setAmountPaid(0);
    setCustomerName('');
    setCustomerPhone('');
    onOpenChange(false);
  };

  const isProductOutOfStock = (productId: string) => {
    const product = availableProducts.find((p) => p.id === productId);
    return product?.isOutOfStock || product?.currentStock === 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Sale</DialogTitle>
          <DialogDescription>
            Record a new sale. Select products from your inventory.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Products Sold</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-1 h-4 w-4" />
                Add Product
              </Button>
            </div>

            {items.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-muted-foreground">No products added yet</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addItem}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => {
                  const selectedProduct = availableProducts.find(
                    (p) => p.id === item.productId
                  );

                  return (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border bg-muted/30 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          Item {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-4">
                        <div className="sm:col-span-2">
                          <Label className="text-xs">Product</Label>
                          <Select
                            value={item.productId}
                            onValueChange={(value) =>
                              updateItem(item.id, 'productId', value)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableProducts.map((product) => {
                                const outOfStock = product.isOutOfStock || product.currentStock === 0;
                                return (
                                  <SelectItem
                                    key={product.id}
                                    value={product.id}
                                    disabled={outOfStock}
                                    className={cn(
                                      outOfStock && 'opacity-50'
                                    )}
                                  >
                                    <div className="flex items-center gap-2">
                                      <span>{getProductDisplayName(product)}</span>
                                      {outOfStock && (
                                        <Badge variant="secondary" className="text-xs">
                                          Out of Stock
                                        </Badge>
                                      )}
                                      {!outOfStock && (
                                        <span className="text-xs text-muted-foreground">
                                          ({product.currentStock} in stock)
                                        </span>
                                      )}
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label className="text-xs">Crates</Label>
                          <Input
                            type="number"
                            min="0"
                            max={selectedProduct?.currentStock || 0}
                            placeholder="0"
                            value={item.crates || ''}
                            onChange={(e) =>
                              updateItem(item.id, 'crates', parseInt(e.target.value) || 0)
                            }
                          />
                        </div>

                        <div>
                          <Label className="text-xs">Extra Bottles</Label>
                          <Input
                            type="number"
                            min="0"
                            max={BOTTLES_PER_CRATE - 1}
                            placeholder="0"
                            value={item.bottles || ''}
                            onChange={(e) =>
                              updateItem(item.id, 'bottles', parseInt(e.target.value) || 0)
                            }
                          />
                        </div>
                      </div>

                      {item.productId && (
                        <div className="mt-3 flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {item.crates} crate{item.crates !== 1 ? 's' : ''} + {item.bottles} bottle{item.bottles !== 1 ? 's' : ''} @ {formatCurrency(item.unitPrice)}/bottle
                          </span>
                          <span className="font-mono font-medium">
                            {formatCurrency(item.total)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Total */}
          {items.length > 0 && (
            <>
              <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
                <span className="text-lg font-medium">Total</span>
                <span className="text-2xl font-bold font-mono">{formatCurrency(total)}</span>
              </div>

              {/* Payment type */}
              <div className="space-y-3">
                <Label>Payment Type</Label>
                <RadioGroup
                  value={paymentType}
                  onValueChange={(value) => setPaymentType(value as typeof paymentType)}
                  className="grid grid-cols-3 gap-3"
                >
                  <div>
                    <RadioGroupItem
                      value="cash"
                      id="cash"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="cash"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-border bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                    >
                      <span className="text-sm font-medium">Cash</span>
                      <span className="text-xs text-muted-foreground">Paid in full</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="partial"
                      id="partial"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="partial"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-border bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                    >
                      <span className="text-sm font-medium">Partial</span>
                      <span className="text-xs text-muted-foreground">Pay some now</span>
                    </Label>
                  </div>
                  <div>
                    <RadioGroupItem
                      value="credit"
                      id="credit"
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor="credit"
                      className="flex flex-col items-center justify-between rounded-lg border-2 border-border bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary cursor-pointer"
                    >
                      <span className="text-sm font-medium">Credit</span>
                      <span className="text-xs text-muted-foreground">Pay later</span>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Partial payment amount */}
              {paymentType === 'partial' && (
                <div className="space-y-2">
                  <Label>Amount Paid Now</Label>
                  <Input
                    type="number"
                    min="0"
                    max={total}
                    placeholder="0"
                    value={amountPaid || ''}
                    onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Balance: <span className="font-mono font-medium text-warning">{formatCurrency(amountOwed)}</span>
                  </p>
                </div>
              )}

              {/* Customer details for credit/partial */}
              {paymentType !== 'cash' && (
                <div className="space-y-4 rounded-lg border border-warning/30 bg-warning/5 p-4">
                  <div className="flex items-center gap-2 text-warning">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Customer Details Required</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Customer Name</Label>
                      <Input
                        placeholder="e.g., Mama Chidi"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Phone Number</Label>
                      <Input
                        placeholder="e.g., 08012345678"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} disabled={items.length === 0}>
            Log Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
