'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun, Search, Bell, Menu } from 'lucide-react';
import { useThemeStore } from '@/stores/theme';
import { useSidebarStore } from '@/stores/sidebar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { UserMenu } from './user-menu';

export function Topbar() {
  const { theme, setTheme } = useThemeStore();
  const { isOpen, toggle } = useSidebarStore();

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const syncThemeState = () => {
      setIsDarkMode(theme === 'dark' || (theme === 'system' && mediaQuery.matches));
    };

    syncThemeState();
    mediaQuery.addEventListener('change', syncThemeState);

    return () => mediaQuery.removeEventListener('change', syncThemeState);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? 'light' : 'dark';
    setTheme(newTheme);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-topbar-bg)] px-4 shadow-sm backdrop-blur-md">
      <div className="flex flex-1 items-center gap-4">
        {!isOpen && (
          <Button variant="ghost" size="icon" onClick={toggle} className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div className="relative w-full max-w-md hidden md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            placeholder="Search tours, bookings, users..."
            className="h-9 border-transparent bg-[var(--app-bg)] pl-9 text-sm transition-all focus:border-[var(--app-border)] focus:bg-[var(--app-surface)]"
          />
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full text-[var(--app-muted)] hover:text-[var(--foreground)]">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 rounded-full text-[var(--app-muted)] hover:text-[var(--foreground)]">
          {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
        
        <div className="ml-2 flex items-center border-l border-[var(--app-border)] pl-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

