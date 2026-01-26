import { useState } from 'react';
import { Plus, Trash2, X } from 'lucide-react';
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
import { formatCurrency } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

interface ExpenseLineItem {
  id: string;
  description: string;
  amount: number;
  quantity: number;
}

interface NewExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  { value: 'utilities', label: 'Utilities' },
  { value: 'transport', label: 'Transport' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'supplies', label: 'Supplies' },
  { value: 'tax', label: 'Tax' },
  { value: 'other', label: 'Other' },
];

export function NewExpenseDialog({ open, onOpenChange }: NewExpenseDialogProps) {
  const { toast } = useToast();
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [items, setItems] = useState<ExpenseLineItem[]>([
    { id: '1', description: '', amount: 0, quantity: 1 },
  ]);

  const addItem = () => {
    setItems([
      ...items,
      { id: Date.now().toString(), description: '', amount: 0, quantity: 1 },
    ]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof ExpenseLineItem, value: string | number) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const total = items.reduce((sum, item) => sum + item.amount * item.quantity, 0);

  const handleSubmit = () => {
    if (!description.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an expense description',
        variant: 'destructive',
      });
      return;
    }
    if (!category) {
      toast({
        title: 'Error',
        description: 'Please select a category',
        variant: 'destructive',
      });
      return;
    }
    if (total <= 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one item with a valid amount',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Expense Submitted',
      description: `${description} - ${formatCurrency(total)} submitted for approval`,
    });

    // Reset form
    setDescription('');
    setCategory('');
    setItems([{ id: '1', description: '', amount: 0, quantity: 1 }]);
    onOpenChange(false);
  };

  const handleReset = () => {
    setDescription('');
    setCategory('');
    setItems([{ id: '1', description: '', amount: 0, quantity: 1 }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Expense</DialogTitle>
          <DialogDescription>
            Submit an expense for approval. Add all items and their amounts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Main description */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="e.g., Monthly utilities"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Line items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="mr-1 h-4 w-4" />
                Add Item
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
                      <Label className="text-xs">Description</Label>
                      <Input
                        placeholder="Item description"
                        value={item.description}
                        onChange={(e) =>
                          updateItem(item.id, 'description', e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Amount (₦)</Label>
                      <Input
                        type="number"
                        min="0"
                        placeholder="0"
                        value={item.amount || ''}
                        onChange={(e) =>
                          updateItem(item.id, 'amount', parseFloat(e.target.value) || 0)
                        }
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Quantity</Label>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1"
                        value={item.quantity || ''}
                        onChange={(e) =>
                          updateItem(item.id, 'quantity', parseInt(e.target.value) || 1)
                        }
                      />
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <span className="text-muted-foreground">Subtotal: </span>
                    <span className="font-mono font-medium">
                      {formatCurrency(item.amount * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="flex items-center justify-between rounded-lg bg-primary/5 p-4">
            <span className="text-lg font-medium">Total</span>
            <span className="text-2xl font-bold font-mono">{formatCurrency(total)}</span>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button type="button" variant="outline" onClick={handleReset}>
            Reset
          </Button>
          <Button type="button" onClick={handleSubmit}>
            Submit Expense
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
