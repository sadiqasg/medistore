import { useMemo } from 'react';
import { cn } from '@/lib/utils';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  className?: string;
  strokeWidth?: number;
  showArea?: boolean;
}

export function Sparkline({
  data,
  width = 80,
  height = 24,
  className,
  strokeWidth = 1.5,
  showArea = false,
}: SparklineProps) {
  const { path, areaPath, isPositive } = useMemo(() => {
    if (data.length < 2) return { path: '', areaPath: '', isPositive: true };

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const padding = 2;
    const innerWidth = width - padding * 2;
    const innerHeight = height - padding * 2;

    const points = data.map((value, index) => {
      const x = padding + (index / (data.length - 1)) * innerWidth;
      const y = padding + innerHeight - ((value - min) / range) * innerHeight;
      return { x, y };
    });

    // Create smooth curve using bezier
    let path = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx = (prev.x + curr.x) / 2;
      path += ` C ${cpx} ${prev.y}, ${cpx} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    // Area path
    const areaPath = `${path} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

    const isPositive = data[data.length - 1] >= data[0];

    return { path, areaPath, isPositive };
  }, [data, width, height]);

  if (data.length < 2) return null;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn('overflow-visible', className)}
    >
      {showArea && (
        <path
          d={areaPath}
          className={cn(
            'transition-all duration-300',
            isPositive ? 'fill-metric-positive/10' : 'fill-metric-negative/10'
          )}
        />
      )}
      <path
        d={path}
        fill="none"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          'transition-all duration-300',
          isPositive ? 'stroke-metric-positive' : 'stroke-metric-negative'
        )}
      />
    </svg>
  );
}
