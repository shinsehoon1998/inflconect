import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
}

export function Card({ className, hover = false, children, ...props }: CardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100",
                hover && "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
