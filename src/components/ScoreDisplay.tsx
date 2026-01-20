import { cn } from '@/lib/utils';

interface ScoreDisplayProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}

export const ScoreDisplay = ({ score, size = 'md', label }: ScoreDisplayProps) => {
  const sizeClasses = {
    sm: 'w-16 h-16 text-xl',
    md: 'w-24 h-24 text-3xl',
    lg: 'w-32 h-32 text-4xl',
  };

  const getColor = () => {
    if (score >= 70) return 'text-primary stroke-primary';
    if (score >= 50) return 'text-warning stroke-warning';
    return 'text-muted-foreground stroke-muted-foreground';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={cn("relative", sizeClasses[size])}>
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-border"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className={cn("transition-all duration-500", getColor())}
          />
        </svg>
        <div className={cn(
          "absolute inset-0 flex items-center justify-center font-bold font-mono",
          getColor()
        )}>
          {score}
        </div>
      </div>
      {label && (
        <span className="text-sm text-muted-foreground">{label}</span>
      )}
    </div>
  );
};
