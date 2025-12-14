import { cn } from '@/lib/utils';

interface HeaderProps {
    title?: string;
    leftAction?: React.ReactNode;
    rightAction?: React.ReactNode;
    className?: string;
}

export function Header({ title, leftAction, rightAction, className }: HeaderProps) {
    return (
        <header className={cn(
            "sticky top-0 left-0 right-0 h-14 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 z-50",
            className
        )}>
            <div className="flex-shrink-0 w-10 flex items-center justify-start h-full">
                {leftAction}
            </div>
            <h1 className="text-[17px] font-bold text-gray-900 truncate">
                {title}
            </h1>
            <div className="flex-shrink-0 w-10 flex items-center justify-end h-full">
                {rightAction}
            </div>
        </header>
    );
}
