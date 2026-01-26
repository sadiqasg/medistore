import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: {
    value: number;
    label?: string;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: MetricCardProps) {
  const variantStyles = {
    default: 'border-border',
    success: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    danger: 'border-danger/30 bg-danger/5',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary',
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    danger: 'bg-danger/20 text-danger',
  };

  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return TrendingUp;
    if (trend.value < 0) return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();

  return (
    <div
      className={cn(
        'metric-card rounded-xl border bg-card p-5 shadow-sm transition-shadow hover:shadow-md animate-fade-in',
        variantStyles[variant],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold tracking-tight font-mono tabular-nums">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg',
              iconStyles[variant]
            )}
          >
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      {trend && TrendIcon && (
        <div className="mt-3 flex items-center gap-1.5">
          <div
            className={cn(
              'flex items-center gap-0.5 text-xs font-medium',
              trend.value > 0 && 'text-metric-positive',
              trend.value < 0 && 'text-metric-negative',
              trend.value === 0 && 'text-metric-neutral'
            )}
          >
            <TrendIcon className="h-3.5 w-3.5" />
            <span>{Math.abs(trend.value)}%</span>
          </div>
          {trend.label && (
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          )}
        </div>
      )}
    </div>
  );
}
