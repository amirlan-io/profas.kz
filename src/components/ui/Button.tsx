import React from 'react';
import { cn } from '@/src/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const variants = {
      primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/20',
      secondary: 'bg-slate-900 text-white hover:bg-slate-800',
      outline: 'border border-slate-200 bg-transparent hover:bg-slate-50 text-slate-900',
      ghost: 'bg-transparent hover:bg-slate-100 text-slate-600',
    };

    const sizes = {
      sm: 'min-h-12 px-4 py-3 text-sm',
      md: 'min-h-12 px-6 py-3 text-base',
      lg: 'min-h-12 px-8 py-4 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-xl font-semibold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
