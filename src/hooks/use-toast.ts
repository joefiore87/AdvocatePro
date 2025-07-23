'use client';

// Adapted from shadcn/ui toast
import { useState, useEffect } from 'react';

type ToastProps = {
  title?: string;
  description?: string;
  variant?: 'default' | 'destructive';
  duration?: number;
};

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>([]);

  const toast = (props: ToastProps) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...props, id };
    setToasts((prevToasts) => [...prevToasts, newToast]);

    // Auto dismiss after duration
    setTimeout(() => {
      setToasts((prevToasts) => prevToasts.filter((t) => t.id !== id));
    }, props.duration || 5000);
  };

  return { toast, toasts };
}