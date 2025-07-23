'use client';

import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

export function Toaster() {
  const { toasts } = useToast();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="fixed top-0 right-0 z-50 flex flex-col gap-2 p-4 max-w-md w-full">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-md border p-4 shadow-md transition-all animate-in fade-in slide-in-from-top-1 ${
            toast.variant === 'destructive'
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-background text-foreground'
          }`}
        >
          <div className="flex justify-between items-start gap-2">
            <div>
              {toast.title && <h3 className="font-medium">{toast.title}</h3>}
              {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
            </div>
            <button className="opacity-70 hover:opacity-100">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}