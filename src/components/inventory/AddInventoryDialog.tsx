import { useState } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
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

interface InventoryAddItem {
  id: string;
  productId: string;
  productName: string;
  crates: number;
  bottles: number;
}

interface AddInventoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddInventoryDialog({ open, onOpenChange }: AddInventoryDialogProps) {
  const { toast } = useToast();
  const [source, setSource] = useState<'delivery' | 'return' | 'adjustment'>('delivery');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');
  const [items, setItems] = useState<InventoryAddItem[]>([
    { id: '1', productId: '', productName: '', crates: 0, bottles: 0 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), productId: '', productName: '', crates: 0, bottles: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InventoryAddItem, value: string | number) => {
    setItems(
      items.map((item) => {
        if (item.id !== id) return item;
        
        if (field === 'productId') {
          const product = mockInventory.find(p => p.id === value);
          return {
            ...item,
            productId: value as string,
            productName: product ? getProductDisplayName(product) : '',
          };
        }
        return { ...item, [field]: value };
      })
    );
  };

  const totalCrates = items.reduce((sum, item) => sum + item.crates, 0);
  const totalBottles = items.reduce((sum, item) => sum + item.bottles, 0);

  const handleSubmit = () => {
    if (items.filter(i => i.productId && (i.crates > 0 || i.bottles > 0)).length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one product with quantity',
        variant: 'destructive',
      });
      return;
    }

    const sourceLabels = {
      delivery: 'Delivery received',
      return: 'Crates returned',
      adjustment: 'Inventory adjusted',
    };

    toast({
      title: 'Inventory Updated',
      description: `${sourceLabels[source]}: ${totalCrates} crates, ${totalBottles} bottles added.`,
    });

    // Reset form
    setSource('delivery');
    setReference('');
    setNotes('');
    setItems([{ id: '1', productId: '', productName: '', crates: 0, bottles: 0 }]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            <DialogTitle>Add Inventory</DialogTitle>
          </div>
          <DialogDescription>
            Log incoming stock from deliveries, returns, or adjustments.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Source selection */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="source">Source</Label>
              <Select value={source} onValueChange={(v) => setSource(v as typeof source)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="delivery">Delivery from Coca-Cola</SelectItem>
                  <SelectItem value="return">Crate Returns</SelectItem>
                  <SelectItem value="adjustment">Stock Adjustment</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reference">Reference (Optional)</Label>
              <Input
                id="reference"
                placeholder="e.g., Order #123 or Receipt number"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
              />
            </div>
          </div>

          {/* Inventory items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Products</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-1 h-4 w-4" />
                Add Product
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className="grid gap-3 rounded-lg border border-border bg-muted/30 p-4"
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
                    <div className="sm:col-span-1">
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
                              {getProductDisplayName(product)}
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
                    <div>
                      <Label className="text-xs">Bottles (extra)</Label>
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
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any notes about this inventory update..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          {/* Summary */}
          <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
            <span className="text-lg font-medium">Total to Add</span>
            <span className="text-xl font-bold font-mono">
              {totalCrates} crates, {totalBottles} bottles
            </span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit}>
            <Package className="mr-2 h-4 w-4" />
            Add to Inventory
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
