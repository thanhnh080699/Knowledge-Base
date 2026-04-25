'use client';

import { useEffect, type ReactNode } from 'react';
import { useThemeStore, type Theme } from '@/stores/theme';

function resolveDarkMode(theme: Theme) {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function applyTheme(theme: Theme) {
  const resolvedTheme = resolveDarkMode(theme) ? 'dark' : 'light';
  const root = document.documentElement;

  root.dataset.theme = resolvedTheme;
  root.style.colorScheme = resolvedTheme;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const syncTheme = () => applyTheme(theme);

    syncTheme();
    mediaQuery.addEventListener('change', syncTheme);

    return () => mediaQuery.removeEventListener('change', syncTheme);
  }, [theme]);

  return children;
}
