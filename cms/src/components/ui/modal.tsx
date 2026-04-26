import * as React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, description, children, className }: ModalProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Prevent page scroll while keeping the modal panel itself scrollable.
  React.useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[var(--app-overlay)] backdrop-blur-sm"
          />
          <div className="fixed inset-0 overflow-y-auto p-4 pointer-events-none">
            <div className="flex min-h-full items-start justify-center py-4 sm:items-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: 'spring', duration: 0.5, bounce: 0 }}
                className={cn(
                  "pointer-events-auto flex max-h-[calc(100dvh-4rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] shadow-lg",
                  className
                )}
              >
                <div className="flex shrink-0 items-start justify-between gap-4 border-b border-[var(--app-border)] px-6 py-4">
                  <div className="min-w-0">
                    {title && <h2 className="text-lg font-semibold text-[var(--foreground)]">{title}</h2>}
                    {description && <p className="text-sm text-[var(--app-muted)]">{description}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 shrink-0 rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="overflow-y-auto px-6 py-6">{children}</div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

