import { cn } from '@/lib/utils';
import { Package, Receipt, CreditCard, AlertTriangle } from 'lucide-react';

interface Activity {
  id: string;
  type: 'stock' | 'expense' | 'payment' | 'alert';
  title: string;
  description: string;
  time: string;
}

const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'stock',
    title: 'Stock Updated',
    description: 'Dasani Water 500ml restocked (+100 units)',
    time: '10 min ago',
  },
  {
    id: '2',
    type: 'expense',
    title: 'Expense Submitted',
    description: 'Delivery Van Fuel - ₦1,200 pending approval',
    time: '45 min ago',
  },
  {
    id: '3',
    type: 'alert',
    title: 'Low Stock Alert',
    description: 'Fanta Orange 1.5L below minimum threshold',
    time: '2 hours ago',
  },
  {
    id: '4',
    type: 'payment',
    title: 'Payment Due Soon',
    description: 'Equipment Lease Co. - ₦45,000 due in 2 days',
    time: '3 hours ago',
  },
  {
    id: '5',
    type: 'expense',
    title: 'Expense Approved',
    description: 'Electricity Bill approved - ₦4,500',
    time: '1 day ago',
  },
];

const activityIcons = {
  stock: Package,
  expense: Receipt,
  payment: CreditCard,
  alert: AlertTriangle,
};

const activityStyles = {
  stock: 'bg-chart-2/10 text-chart-2',
  expense: 'bg-chart-1/10 text-chart-1',
  payment: 'bg-chart-3/10 text-chart-3',
  alert: 'bg-danger/10 text-danger',
};

export function RecentActivity() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-5 py-4">
        <h3 className="font-semibold">Recent Activity</h3>
      </div>
      <div className="divide-y divide-border">
        {mockActivities.map((activity, index) => {
          const Icon = activityIcons[activity.type];
          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 px-5 py-4 data-row animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
                  activityStyles[activity.type]
                )}
              >
                <Icon className="h-4 w-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
