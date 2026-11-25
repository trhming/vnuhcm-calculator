import { createContext } from 'react';

export type ToastType = 'success' | 'info' | 'warning';

export type ToastOptions = {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
};

export type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
