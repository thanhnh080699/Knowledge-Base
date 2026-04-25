import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--app-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--app-bg)] disabled:pointer-events-none disabled:opacity-50',
          {
            'bg-[var(--foreground)] text-[var(--app-surface)] hover:opacity-90': variant === 'default',
            'bg-red-500 text-white hover:bg-red-500/90': variant === 'destructive',
            'border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--foreground)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--foreground)]': variant === 'outline',
            'bg-[var(--app-surface-muted)] text-[var(--foreground)] hover:bg-[var(--app-surface-hover)]': variant === 'secondary',
            'text-[var(--app-muted-strong)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--foreground)]': variant === 'ghost',
            'text-[var(--foreground)] underline-offset-4 hover:underline': variant === 'link',
            'h-10 px-4 py-2': size === 'default',
            'h-9 rounded-md px-3': size === 'sm',
            'h-11 rounded-md px-8': size === 'lg',
            'h-10 w-10': size === 'icon',
          },
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';

export { Button };
