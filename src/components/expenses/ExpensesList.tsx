import { useState } from 'react';
import { cn } from '@/lib/utils';
import { mockExpenses, formatCurrency } from '@/lib/mockData';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { NewExpenseDialog } from './NewExpenseDialog';
import {
  MoreHorizontal,
  Plus,
  Zap,
  Truck,
  Wrench,
  ShoppingBag,
  MoreVertical,
  Landmark,
  Receipt,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

const categoryIcons: Record<string, typeof Zap> = {
  utilities: Zap,
  transport: Truck,
  maintenance: Wrench,
  supplies: ShoppingBag,
  tax: Landmark,
  other: MoreVertical,
};

const categoryColors: Record<string, string> = {
  utilities: 'bg-chart-3/10 text-chart-3',
  transport: 'bg-chart-1/10 text-chart-1',
  maintenance: 'bg-chart-4/10 text-chart-4',
  supplies: 'bg-chart-2/10 text-chart-2',
  tax: 'bg-chart-5/10 text-chart-5',
  other: 'bg-muted text-muted-foreground',
};

export function ExpensesList() {
  const [expenses] = useState(mockExpenses);
  const [showNewExpense, setShowNewExpense] = useState(false);
  const [expandedExpenses, setExpandedExpenses] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedExpenses(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">All Expenses</h2>
          <p className="text-sm text-muted-foreground">
            {expenses.length} expense{expenses.length !== 1 ? 's' : ''} recorded
          </p>
        </div>
        <Button size="sm" onClick={() => setShowNewExpense(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Expense
        </Button>
      </div>

      {/* Expenses Table */}
      <div className="table-container">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[40px]"></TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Submitted By</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((expense, index) => {
              const CategoryIcon = categoryIcons[expense.category] || MoreVertical;
              const isExpanded = expandedExpenses.has(expense.id);
              const hasMultipleItems = expense.items.length > 1;

              return (
                <>
                  <TableRow
                    key={expense.id}
                    className={cn(
                      'data-row animate-fade-in cursor-pointer',
                      isExpanded && 'bg-muted/30'
                    )}
                    style={{ animationDelay: `${index * 30}ms` }}
                    onClick={() => hasMultipleItems && toggleExpanded(expense.id)}
                  >
                    <TableCell>
                      {hasMultipleItems ? (
                        <Button variant="ghost" size="icon" className="h-6 w-6">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      ) : null}
                    </TableCell>
                    <TableCell className="font-mono text-sm">
                      {formatDate(expense.submittedAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'flex h-8 w-8 items-center justify-center rounded-lg',
                            categoryColors[expense.category] || categoryColors.other
                          )}
                        >
                          <CategoryIcon className="h-4 w-4" />
                        </div>
                        <span className="font-medium">{expense.description}</span>
                        {hasMultipleItems && (
                          <span className="text-xs text-muted-foreground">
                            ({expense.items.length} items)
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="capitalize">{expense.category}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {expense.submittedBy.split('@')[0]}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums font-semibold">
                      {formatCurrency(expense.totalAmount)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>

                  {/* Expanded items breakdown */}
                  {isExpanded && expense.items.map((item, itemIndex) => (
                    <TableRow
                      key={`${expense.id}-item-${itemIndex}`}
                      className="bg-muted/20 hover:bg-muted/30"
                    >
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell colSpan={3} className="pl-12">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Receipt className="h-3.5 w-3.5" />
                          <span>{item.description}</span>
                          {item.quantity > 1 && (
                            <span className="text-xs">× {item.quantity}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-mono tabular-nums text-sm">
                        {formatCurrency(item.amount)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))}
                </>
              );
            })}
          </TableBody>
        </Table>

        {expenses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Receipt className="h-12 w-12 mb-3 opacity-50" />
            <p className="font-medium">No expenses found</p>
            <p className="text-sm">Start by adding a new expense</p>
          </div>
        )}
      </div>

      <NewExpenseDialog open={showNewExpense} onOpenChange={setShowNewExpense} />
    </div>
  );
}
