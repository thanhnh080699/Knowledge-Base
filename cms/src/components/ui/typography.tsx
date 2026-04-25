import * as React from 'react';
import { cn } from '@/lib/utils';

interface TypographyProps extends React.HTMLAttributes<HTMLHeadingElement | HTMLParagraphElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'lead' | 'large' | 'small' | 'muted';
}

export function Typography({ variant = 'p', className, children, ...props }: TypographyProps) {
  switch (variant) {
    case 'h1':
      return <h1 className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight text-[var(--foreground)] lg:text-5xl', className)} {...props}>{children}</h1>;
    case 'h2':
      return <h2 className={cn('scroll-m-20 border-b border-[var(--app-border)] pb-2 text-3xl font-semibold tracking-tight text-[var(--foreground)] first:mt-0', className)} {...props}>{children}</h2>;
    case 'h3':
      return <h3 className={cn('scroll-m-20 text-2xl font-semibold tracking-tight text-[var(--foreground)]', className)} {...props}>{children}</h3>;
    case 'h4':
      return <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight text-[var(--foreground)]', className)} {...props}>{children}</h4>;
    case 'lead':
      return <p className={cn('text-xl text-[var(--app-muted)]', className)} {...props}>{children}</p>;
    case 'large':
      return <div className={cn('text-lg font-semibold text-[var(--foreground)]', className)} {...props}>{children}</div>;
    case 'small':
      return <small className={cn('text-sm font-medium leading-none text-[var(--foreground)]', className)} {...props}>{children}</small>;
    case 'muted':
      return <p className={cn('text-sm text-[var(--app-muted)]', className)} {...props}>{children}</p>;
    case 'p':
    default:
      return <p className={cn('leading-7 text-[var(--app-muted-strong)] [&:not(:first-child)]:mt-6', className)} {...props}>{children}</p>;
  }
}
