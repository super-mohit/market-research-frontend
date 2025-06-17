import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'title' | 'card' | 'circle' | 'button' | 'image';
  lines?: number;
  animated?: boolean;
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className,
  variant = 'text',
  lines = 1,
  animated = true
}) => {
  const baseClasses = 'bg-slate-200 rounded-md';
  
  const variantClasses = {
    text: 'h-4',
    title: 'h-6',
    card: 'h-32',
    circle: 'h-12 w-12 rounded-full',
    button: 'h-10 w-24',
    image: 'h-48 w-full'
  };

  const animationClasses = animated ? 'animate-pulse' : '';

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={clsx(
              baseClasses,
              variantClasses[variant],
              animationClasses,
              i === lines - 1 && 'w-3/4', // Last line is shorter
              className
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={clsx(
        baseClasses,
        variantClasses[variant],
        animationClasses,
        className
      )}
    />
  );
};

// Specialized skeleton components for common patterns
export const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
  <div className={clsx('card p-4 space-y-3', className)}>
    <div className="flex items-center space-x-3">
      <Skeleton variant="circle" className="shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="title" className="w-1/2" />
        <Skeleton variant="text" className="w-3/4" />
      </div>
    </div>
    <Skeleton variant="text" lines={3} />
    <div className="flex items-center justify-between pt-2">
      <Skeleton variant="text" className="w-1/4" />
      <Skeleton variant="button" className="w-20" />
    </div>
  </div>
);

export const SkeletonJobCard: React.FC<{ className?: string }> = ({ className }) => (
  <motion.div
    className={clsx('card p-6 space-y-4', className)}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Status badge */}
    <div className="flex items-start justify-between">
      <Skeleton variant="button" className="w-20 h-6 rounded-full" />
    </div>
    
    {/* Title */}
    <Skeleton variant="title" className="w-4/5" />
    
    {/* Stats */}
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Skeleton variant="circle" className="w-4 h-4" />
        <Skeleton variant="text" className="w-16" />
      </div>
      <div className="flex items-center gap-1">
        <Skeleton variant="circle" className="w-4 h-4" />
        <Skeleton variant="text" className="w-16" />
      </div>
    </div>
    
    {/* Footer */}
    <div className="flex items-center justify-between pt-4 border-t border-border">
      <Skeleton variant="text" className="w-1/3" />
      <Skeleton variant="text" className="w-1/4" />
    </div>
  </motion.div>
);

export const SkeletonDataCard: React.FC<{ className?: string }> = ({ className }) => (
  <motion.div
    className={clsx('card p-4 space-y-3', className)}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    {/* Header with badge and external link */}
    <div className="flex items-start justify-between">
      <div className="flex items-center space-x-2">
        <Skeleton variant="button" className="w-16 h-5 rounded-full" />
        <Skeleton variant="text" className="w-20" />
      </div>
      <Skeleton variant="circle" className="w-4 h-4" />
    </div>
    
    {/* Title */}
    <Skeleton variant="title" className="w-full" />
    
    {/* Content */}
    <Skeleton variant="text" lines={3} />
    
    {/* Read more button */}
    <Skeleton variant="text" className="w-1/4" />
  </motion.div>
);

export const SkeletonReportViewer: React.FC = () => (
  <div className="space-y-6">
    {/* Action Bar */}
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton variant="title" className="w-32" />
          <Skeleton className="h-2 w-32 rounded-full" />
        </div>
        <div className="flex items-center space-x-1">
          <Skeleton variant="circle" className="w-8 h-8" />
          <Skeleton variant="circle" className="w-8 h-8" />
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Report Content */}
      <div className="lg:col-span-8">
        <div className="card p-8 space-y-6">
          <Skeleton variant="title" className="w-3/4 h-8" />
          <Skeleton variant="text" lines={2} />
          
          <Skeleton variant="title" className="w-1/2 h-6" />
          <Skeleton variant="text" lines={4} />
          
          <Skeleton variant="title" className="w-2/3 h-6" />
          <Skeleton variant="text" lines={3} />
          
          <Skeleton variant="title" className="w-1/2 h-6" />
          <Skeleton variant="text" lines={5} />
        </div>
      </div>

      {/* Table of Contents */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-4">
          <Skeleton variant="title" className="w-32" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} variant="text" className={`w-${['full', '5/6', '3/4', '4/5', '2/3'][i] || 'full'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
); 