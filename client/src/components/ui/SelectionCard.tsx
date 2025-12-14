import { Card } from './Card';
import { cn } from '@/lib/utils';

interface SelectionCardProps {
    title: string;
    description?: string;
    selected?: boolean;
    onClick?: () => void;
    className?: string;
}

export function SelectionCard({
    title,
    description,
    selected = false,
    onClick,
    className
}: SelectionCardProps) {
    return (
        <Card
            hover
            onClick={onClick}
            className={cn(
                "cursor-pointer border-2 shadow-none select-none",
                selected
                    ? "border-blue-600 bg-blue-50/50"
                    : "border-transparent bg-gray-50",
                className
            )}
        >
            <h3 className={cn(
                "font-bold text-lg mb-1 leading-tight",
                selected ? "text-blue-700" : "text-gray-900"
            )}>
                {title}
            </h3>
            {description && (
                <p className={cn(
                    "text-sm font-medium",
                    selected ? "text-blue-600/80" : "text-gray-500"
                )}>
                    {description}
                </p>
            )}
        </Card>
    );
}
