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
      <div className="flex flex-wrap gap-2">
        {actions.map((action, index) => {
          const content = (
            <div
              className={cn(
                'group flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 transition-all hover:shadow-sm hover:border-border/80 animate-fade-in cursor-pointer',
                action.color
              )}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <action.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{action.name}</span>
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
