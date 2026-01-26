import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Plus, Package, Receipt, FileText } from 'lucide-react';

const actions = [
  {
    name: 'Add Stock',
    description: 'Log incoming inventory',
    href: '/inventory?action=add',
    icon: Package,
    color: 'bg-chart-1/10 text-chart-1 hover:bg-chart-1/20',
  },
  {
    name: 'New Expense',
    description: 'Submit expense for approval',
    href: '/expenses?action=add',
    icon: Receipt,
    color: 'bg-chart-2/10 text-chart-2 hover:bg-chart-2/20',
  },
  {
    name: 'Log Sale',
    description: 'Record a transaction',
    href: '/inventory?action=sale',
    icon: Plus,
    color: 'bg-chart-3/10 text-chart-3 hover:bg-chart-3/20',
  },
  {
    name: 'View Report',
    description: 'Daily P&L summary',
    href: '/reports',
    icon: FileText,
    color: 'bg-chart-5/10 text-chart-5 hover:bg-chart-5/20',
  },
];

export function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {actions.map((action, index) => (
        <Link
          key={action.name}
          to={action.href}
          className={cn(
            'group flex flex-col items-center gap-2 rounded-xl border border-border bg-card p-4 text-center transition-all hover:shadow-md animate-fade-in',
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
        </Link>
      ))}
    </div>
  );
}
