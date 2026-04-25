'use client';

import { Toaster as SonnerToaster } from 'sonner';
import { useThemeStore } from '@/stores/theme';

export function Toaster() {
  const theme = useThemeStore((state) => state.theme);

  return (
    <SonnerToaster
      theme={theme}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:border-[var(--app-border)] group-[.toaster]:bg-[var(--app-surface)] group-[.toaster]:text-[var(--foreground)] group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-[var(--app-muted)]',
          actionButton:
            'group-[.toast]:bg-[var(--foreground)] group-[.toast]:text-[var(--app-surface)]',
          cancelButton:
            'group-[.toast]:bg-[var(--app-surface-muted)] group-[.toast]:text-[var(--app-muted-strong)]',
        },
      }}
    />
  );
}
