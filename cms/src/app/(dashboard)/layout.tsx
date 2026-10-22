'use client';

import { Modal } from '@/components/ui/modal';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import { useHydrated } from '@/hooks/use-hydrated';
import { Sidebar } from '@/components/layout/sidebar';
import { Topbar } from '@/components/layout/topbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();
  const hydrated = useHydrated();
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)');
    const closeMobileNavigation = () => { if (desktop.matches) setMobileNavigationOpen(false); };
    desktop.addEventListener('change', closeMobileNavigation);
    return () => desktop.removeEventListener('change', closeMobileNavigation);
  }, []);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || !isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--app-bg)] text-[var(--foreground)]">
      <Sidebar className="hidden shrink-0 md:flex" />
      <Modal isOpen={mobileNavigationOpen} onClose={() => setMobileNavigationOpen(false)} title="Điều hướng" className="max-w-sm md:hidden">
        <Sidebar mobile className="w-full border-0" onNavigate={() => setMobileNavigationOpen(false)} />
      </Modal>
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <Topbar onOpenNavigation={() => setMobileNavigationOpen(true)} />
        <main className="flex min-w-0 flex-1 flex-col overflow-y-auto p-4 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
