import { cn } from '@/lib/utils';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    className?: string;
}

export function StepIndicator({ currentStep, totalSteps, className }: StepIndicatorProps) {
    return (
        <div className={cn("flex gap-1 mb-6 px-1", className)}>
            {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        "h-1 flex-1 rounded-full transition-colors duration-300",
                        i < currentStep ? "bg-blue-600" : "bg-gray-200"
                    )}
                />
            ))}
        </div>
    );
}
