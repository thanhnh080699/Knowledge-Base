import * as React from 'react';
import { cn } from '@/lib/utils';

export interface TagProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

function Tag({ className, variant = 'default', ...props }: TagProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--app-ring)] focus:ring-offset-2 focus:ring-offset-[var(--app-bg)]',
        {
          'border-transparent bg-[var(--foreground)] text-[var(--app-surface)] hover:opacity-90': variant === 'default',
          'border-transparent bg-[var(--app-surface-muted)] text-[var(--foreground)] hover:bg-[var(--app-surface-hover)]': variant === 'secondary',
          'border-transparent bg-red-500 text-slate-50 hover:bg-red-500/80': variant === 'destructive',
          'border-transparent bg-green-500 text-slate-50 hover:bg-green-500/80': variant === 'success',
          'border-transparent bg-yellow-500 text-slate-50 hover:bg-yellow-500/80': variant === 'warning',
          'border-[var(--app-border)] bg-transparent text-[var(--foreground)]': variant === 'outline',
        },
        className
      )}
      {...props}
    />
  );
}

export { Tag };
