import React from 'react';
import { clsx } from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-muted-foreground">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-3 bg-background border border-input rounded-lg',
          'text-foreground placeholder-muted-foreground/70',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
          'transition-all duration-200',
          error && 'border-destructive focus:ring-destructive',
          className
        )}
        {...props}
      />
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
};