import { cn } from '@/lib/utils';

interface DebtGaugeProps {
  value: number;
  max: number;
  label: string;
  className?: string;
}

export function DebtGauge({ value, max, label, className }: DebtGaugeProps) {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getColor = () => {
    if (percentage >= 90) return 'stroke-danger';
    if (percentage >= 70) return 'stroke-warning';
    return 'stroke-success';
  };

  const getTextColor = () => {
    if (percentage >= 90) return 'text-danger';
    if (percentage >= 70) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div className="relative">
        <svg width="120" height="120" viewBox="0 0 100 100" className="-rotate-90">
          {/* Background track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="gauge-track"
            strokeWidth="8"
          />
          {/* Value arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className={cn('gauge-value', getColor())}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              transition: 'stroke-dashoffset 0.8s ease-out',
            }}
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn('text-2xl font-bold font-mono tabular-nums', getTextColor())}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground text-center">{label}</p>
    </div>
  );
}
