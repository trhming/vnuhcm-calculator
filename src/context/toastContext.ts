import { createContext } from 'react';

export type ToastType = 'success' | 'info' | 'warning';

export type ToastAction = {
  label: string;
  onClick: () => void;
};

export type ToastOptions = {
  title: string;
  description?: string;
  type?: ToastType;
  duration?: number;
  action?: ToastAction;
};

export type ToastContextValue = {
  showToast: (options: ToastOptions) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);
