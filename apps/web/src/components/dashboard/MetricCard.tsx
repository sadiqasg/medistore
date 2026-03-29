import { Link } from 'react-router-dom';
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
  href?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
  href,
}: MetricCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return TrendingUp;
    if (trend.value < 0) return TrendingDown;
    return Minus;
  };

  const TrendIcon = getTrendIcon();

  const variantStyles = {
    default: 'border-border/50 hover:border-primary/30',
    success: 'border-success/20 hover:border-success/40',
    warning: 'border-warning/20 hover:border-warning/40',
    danger: 'border-danger/20 hover:border-danger/40',
  };

  const iconStyles = {
    default: 'bg-primary/10 text-primary shadow-[0_0_15px_rgba(var(--primary),0.1)]',
    success: 'bg-success/15 text-success shadow-[0_0_15px_rgba(var(--success),0.2)]',
    warning: 'bg-warning/15 text-warning shadow-[0_0_15px_rgba(var(--warning),0.2)]',
    danger: 'bg-danger/15 text-danger shadow-[0_0_15px_rgba(var(--danger),0.2)]',
  };

  const wavyStyles = {
    default: 'opacity-[0.03] dark:opacity-[0.05]',
    success: 'text-success opacity-[0.07]',
    warning: 'text-warning opacity-[0.07]',
    danger: 'text-danger opacity-[0.07]',
  };

  const cardContent = (
    <div className="relative z-10">
      <div className="flex items-start justify-between">
        <div className="space-y-1.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80">{title}</p>
          <div className="flex items-baseline gap-1">
            <p className="text-3xl font-bold tracking-tight font-mono tabular-nums">
              {value}
            </p>
          </div>
          {subtitle && (
            <p className="text-xs text-muted-foreground font-medium">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3',
              iconStyles[variant]
            )}
          >
            <Icon className="h-6 w-6 stroke-[2.5px]" />
          </div>
        )}
      </div>

      {trend && TrendIcon && (
        <div className="mt-4 flex items-center gap-2">
          <div
            className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold shadow-sm',
              trend.value > 0 && 'bg-success/10 text-success',
              trend.value < 0 && 'bg-danger/10 text-danger',
              trend.value === 0 && 'bg-muted/10 text-muted-foreground'
            )}
          >
            <TrendIcon className="h-3 w-3" />
            <span>{Math.abs(trend.value)}%</span>
          </div>
          {trend.label && (
            <span className="text-[10px] font-medium text-muted-foreground/70 uppercase tracking-tight">
              {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );

  const cardClasses = cn(
    'metric-card group relative overflow-hidden rounded-[2rem] border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5',
    variantStyles[variant],
    href && 'cursor-pointer',
    className
  );

  const wavyPattern = (
    <div className={cn("absolute inset-0 pointer-events-none transition-opacity duration-500", wavyStyles[variant])}>
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path 
          d="M0 20 Q 25 40 50 20 T 100 20 V 100 H 0 Z" 
          fill="currentColor" 
          className="animate-pulse-subtle" 
          style={{ animationDuration: '4s' }}
        />
      </svg>
    </div>
  );

  if (href) {
    return (
      <Link to={href} className={cardClasses}>
        {wavyPattern}
        {cardContent}
      </Link>
    );
  }

  return (
    <div className={cardClasses}>
      {wavyPattern}
      {cardContent}
    </div>
  );
}
