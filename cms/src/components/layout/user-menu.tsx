'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, ChevronDown, Shield } from 'lucide-react';
import { Button } from '../ui/button';
import { ProfileModal } from '../users/profile-modal';
import { toast } from 'sonner';

export function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Đăng xuất thành công');
    router.push('/');
  };

  const displayName = user?.fullName || 'User';
  const displayRole = user?.roles?.[0]?.name || 'Member';

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 rounded-full border border-[var(--app-border)] bg-[var(--app-bg)] p-1.5 pr-3 transition-all hover:ring-2 hover:ring-[var(--app-border)] active:scale-95"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
          <User className="h-4 w-4" />
        </div>
        <div className="hidden flex-col items-start text-left sm:flex">
          <span className="text-xs font-bold leading-none text-[var(--foreground)]">{displayName}</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-[var(--app-muted)]">{displayRole}</span>
        </div>
        <ChevronDown className={`h-3 w-3 text-[var(--app-muted)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-56 origin-top-right overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-xl z-50"
          >
            <div className="p-2">
              <div className="mb-2 px-3 py-2 border-b border-[var(--app-border)]">
                <p className="text-sm font-semibold text-[var(--foreground)] truncate">{displayName}</p>
                <p className="text-xs text-[var(--app-muted)] truncate">{user?.email}</p>
              </div>

              <button
                onClick={() => {
                  setIsOpen(false);
                  setIsProfileOpen(true);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--foreground)] transition-colors hover:bg-[var(--app-bg)]"
              >
                <Settings className="h-4 w-4 text-[var(--app-muted)]" />
                <span>Thông tin cá nhân</span>
              </button>

              <div className="my-1 border-t border-[var(--app-border)]" />

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-[var(--app-danger-soft-fg)] transition-colors hover:bg-[var(--app-danger-hover-bg)]"
              >
                <LogOut className="h-4 w-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </div>
  );
}
