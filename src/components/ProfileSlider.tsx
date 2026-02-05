import { cn } from '@/lib/utils';

interface ProfileSliderProps {
  leftLabel: string;
  rightLabel: string;
  categoryName: string; // 가운데 표시될 항목 이름
  value: number; // 1~5 (1: 완전 왼쪽, 5: 완전 오른쪽)
  color?: string; // Tailwind color class (e.g., 'bg-chart-1')
}

/**
 * MBTI 스타일 프로필 슬라이더
 * value 1~5를 왼쪽/오른쪽 퍼센트로 변환하여 표시
 */
export const ProfileSlider = ({
  leftLabel,
  rightLabel,
  categoryName,
  value,
  color = 'bg-primary',
}: ProfileSliderProps) => {
  // value 1~5를 퍼센트로 변환 (1=100% 왼쪽, 5=100% 오른쪽)
  const rightPercent = ((value - 1) / 4) * 100;
  const leftPercent = 100 - rightPercent;

  // 왼쪽이 더 큰 경우 왼쪽 색상, 오른쪽이 더 큰 경우 오른쪽 색상
  const isLeftDominant = leftPercent >= rightPercent;

  return (
    <div className="w-full space-y-1">
      {/* Category name - centered */}
      <div className="text-center mb-2">
        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded">
          {categoryName}
        </span>
      </div>

      {/* Labels with percentages */}
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "font-medium",
            isLeftDominant ? "text-foreground" : "text-muted-foreground"
          )}>
            {leftLabel}
          </span>
          <span className={cn(
            "font-semibold text-xs",
            isLeftDominant ? "text-foreground" : "text-muted-foreground"
          )}>
            {Math.round(leftPercent)}%
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn(
            "font-semibold text-xs",
            !isLeftDominant ? "text-foreground" : "text-muted-foreground"
          )}>
            {Math.round(rightPercent)}%
          </span>
          <span className={cn(
            "font-medium",
            !isLeftDominant ? "text-foreground" : "text-muted-foreground"
          )}>
            {rightLabel}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-secondary rounded-full overflow-hidden flex">
        {/* Left bar */}
        <div
          className={cn(
            "h-full transition-all duration-500 rounded-l-full",
            isLeftDominant ? color : "bg-secondary"
          )}
          style={{ width: `${leftPercent}%` }}
        />
        {/* Right bar */}
        <div
          className={cn(
            "h-full transition-all duration-500 rounded-r-full",
            !isLeftDominant ? color : "bg-secondary"
          )}
          style={{ width: `${rightPercent}%` }}
        />
      </div>
    </div>
  );
};
