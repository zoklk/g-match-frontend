import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export const ProgressSteps = ({ currentStep, totalSteps, labels }: ProgressStepsProps) => {
  return (
    <div className="flex items-center justify-center gap-2 w-full max-w-md mx-auto">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
        <div key={step} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 border-2",
                step < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : step === currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : "bg-surface border-border text-muted-foreground"
              )}
              initial={false}
              animate={{
                scale: step === currentStep ? 1.1 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {step < currentStep ? (
                <Check className="w-5 h-5" />
              ) : (
                step
              )}
            </motion.div>
            {labels && labels[index] && (
              <span className={cn(
                "text-xs mt-2 font-medium",
                step <= currentStep ? "text-primary" : "text-muted-foreground"
              )}>
                {labels[index]}
              </span>
            )}
          </div>
          {index < totalSteps - 1 && (
            <div className="w-12 h-0.5 mx-2 bg-border relative overflow-hidden">
              <motion.div
                className="absolute inset-0 bg-primary origin-left"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: step < currentStep ? 1 : 0 }}
                transition={{ duration: 0.3 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
