import { useState } from 'react';
import { cn } from '@/lib/utils';
import { mockExpenses, formatCurrency, type Expense } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NewExpenseDialog } from './NewExpenseDialog';
import {
  Check,
  X,
  MoreHorizontal,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  Truck,
  Wrench,
  ShoppingBag,
  MoreVertical,
  Landmark,
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

const statusConfig = {
  pending: {
    label: 'Pending',
    variant: 'outline' as const,
    icon: Clock,
    color: 'text-warning',
  },
  approved: {
    label: 'Approved',
    variant: 'secondary' as const,
    icon: CheckCircle2,
    color: 'text-success',
  },
  rejected: {
    label: 'Rejected',
    variant: 'destructive' as const,
    icon: XCircle,
    color: 'text-danger',
  },
};

interface ExpensesListProps {
  filter?: 'all' | 'pending' | 'approved' | 'rejected';
}

export function ExpensesList({ filter = 'all' }: ExpensesListProps) {
  const [expenses] = useState(mockExpenses);
  const [showNewExpense, setShowNewExpense] = useState(false);

  const filteredExpenses =
    filter === 'all'
      ? expenses
      : expenses.filter((expense) => expense.status === filter);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Expenses</h2>
          <p className="text-sm text-muted-foreground">
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}{' '}
            {filter !== 'all' && `(${filter})`}
          </p>
        </div>
        <Button size="sm" onClick={() => setShowNewExpense(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Expense
        </Button>
      </div>

      {/* Expense cards */}
      <div className="space-y-3">
        {filteredExpenses.map((expense, index) => {
          const CategoryIcon = categoryIcons[expense.category] || MoreVertical;
          const status = statusConfig[expense.status];
          const StatusIcon = status.icon;

          return (
            <Card
              key={expense.id}
              className={cn(
                'transition-all hover:shadow-md animate-fade-in',
                expense.status === 'pending' && 'border-warning/30'
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Category icon */}
                  <div
                    className={cn(
                      'flex h-11 w-11 shrink-0 items-center justify-center rounded-lg',
                      categoryColors[expense.category] || categoryColors.other
                    )}
                  >
                    <CategoryIcon className="h-5 w-5" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {expense.category} • {formatDate(expense.submittedAt)}
                        </p>
                        {expense.items.length > 1 && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {expense.items.length} items
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-lg font-semibold font-mono tabular-nums">
                          {formatCurrency(expense.totalAmount)}
                        </span>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
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
                      </div>
                    </div>

                    {/* Status and actions */}
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={status.variant} className="gap-1">
                          <StatusIcon className={cn('h-3 w-3', status.color)} />
                          {status.label}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          by {expense.submittedBy.split('@')[0]}
                        </span>
                      </div>

                      {expense.status === 'pending' && (
                        <div className="flex items-center gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-success hover:text-success hover:bg-success/10"
                          >
                            <Check className="h-3.5 w-3.5" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 gap-1 text-danger hover:text-danger hover:bg-danger/10"
                          >
                            <X className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredExpenses.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Clock className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="font-medium text-muted-foreground">No expenses found</p>
            <p className="text-sm text-muted-foreground">
              {filter === 'pending'
                ? 'All expenses have been reviewed'
                : 'Start by adding a new expense'}
            </p>
          </CardContent>
        </Card>
      )}

      <NewExpenseDialog open={showNewExpense} onOpenChange={setShowNewExpense} />
    </div>
  );
}
