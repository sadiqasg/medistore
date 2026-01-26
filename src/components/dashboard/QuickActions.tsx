import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Plus, Package, Receipt, FileText } from 'lucide-react';
import { LogSaleDialog } from '@/components/sales/LogSaleDialog';
import { NewExpenseDialog } from '@/components/expenses/NewExpenseDialog';
import { Link } from 'react-router-dom';

const actions = [
  {
    name: 'Add Inventory',
    description: 'Log incoming stock',
    href: '/inventory?action=add',
    icon: Package,
    color: 'bg-chart-1/10 text-chart-1 hover:bg-chart-1/20',
    action: 'navigate',
  },
  {
    name: 'New Expense',
    description: 'Submit expense for approval',
    icon: Receipt,
    color: 'bg-chart-2/10 text-chart-2 hover:bg-chart-2/20',
    action: 'expense',
  },
  {
    name: 'Log Sale',
    description: 'Record a transaction',
    icon: Plus,
    color: 'bg-chart-3/10 text-chart-3 hover:bg-chart-3/20',
    action: 'sale',
  },
  {
    name: 'View History',
    description: 'Sales & expense records',
    href: '/history',
    icon: FileText,
    color: 'bg-chart-5/10 text-chart-5 hover:bg-chart-5/20',
    action: 'navigate',
  },
];

export function QuickActions() {
  const [showSaleDialog, setShowSaleDialog] = useState(false);
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);

  const handleAction = (action: string) => {
    if (action === 'sale') {
      setShowSaleDialog(true);
    } else if (action === 'expense') {
      setShowExpenseDialog(true);
    }
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {actions.map((action, index) => {
          const content = (
            <div
              className={cn(
                'group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-5 text-center transition-all hover:shadow-md hover:border-border/80 animate-fade-in cursor-pointer',
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                  action.color
                )}
              >
                <action.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-medium">{action.name}</p>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {action.description}
                </p>
              </div>
            </div>
          );

          if (action.action === 'navigate' && action.href) {
            return (
              <Link key={action.name} to={action.href}>
                {content}
              </Link>
            );
          }

          return (
            <div key={action.name} onClick={() => handleAction(action.action)}>
              {content}
            </div>
          );
        })}
      </div>

      <LogSaleDialog open={showSaleDialog} onOpenChange={setShowSaleDialog} />
      <NewExpenseDialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog} />
    </>
  );
}
