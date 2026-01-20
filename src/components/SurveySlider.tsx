import { cn } from '@/lib/utils';

interface SurveySliderProps {
  value: number;
  onChange: (value: number) => void;
  leftLabel: string;
  rightLabel: string;
  min?: number;
  max?: number;
}

export const SurveySlider = ({
  value,
  onChange,
  leftLabel,
  rightLabel,
  min = 1,
  max = 5,
}: SurveySliderProps) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between text-sm text-muted-foreground">
        <span className="max-w-[40%] text-left">{leftLabel}</span>
        <span className="max-w-[40%] text-right">{rightLabel}</span>
      </div>
      
      <div className="relative py-2">
        {/* Track background */}
        <div className="h-2 bg-secondary rounded-full relative">
          {/* Filled track */}
          <div
            className="absolute h-full bg-primary rounded-full transition-all duration-150"
            style={{ width: `${percentage}%` }}
          />
        </div>
        
        {/* Slider input */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {/* Custom thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-background border-[3px] border-primary rounded-full shadow-md transition-all duration-150 pointer-events-none"
          style={{ left: `calc(${percentage}% - 12px)` }}
        />
      </div>
      
      {/* Step indicators */}
      <div className="flex justify-between px-1">
        {Array.from({ length: max - min + 1 }, (_, i) => (
          <button
            key={i + min}
            onClick={() => onChange(i + min)}
            className={cn(
              "w-8 h-8 rounded-full text-sm font-medium transition-colors",
              value === i + min
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            )}
          >
            {i + min}
          </button>
        ))}
      </div>
    </div>
  );
};
