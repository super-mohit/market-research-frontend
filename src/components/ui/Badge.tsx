import React from 'react';
import { clsx } from 'clsx';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

const badgeVariants = {
  default: 'bg-muted text-muted-foreground',
  success: 'bg-lime-500/10 text-lime-700 border border-lime-500/20',
  warning: 'bg-yellow-500/10 text-yellow-700 border border-yellow-500/20',
  error: 'bg-coral/10 text-coral border border-coral/20',
  info: 'bg-blue-soft/10 text-blue-soft border border-blue-soft/20',
};

const sizeVariants = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1 text-sm',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className,
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full font-medium',
        badgeVariants[variant],
        sizeVariants[size],
        className
      )}
    >
      {children}
    </span>
  );
};