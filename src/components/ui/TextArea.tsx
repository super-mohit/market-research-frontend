import React from 'react';
import { clsx } from 'clsx';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  charLimit?: number;
}

export const TextArea: React.FC<TextAreaProps> = ({
  label,
  error,
  hint,
  charLimit,
  className,
  value,
  ...props
}) => {
  const currentLength = typeof value === 'string' ? value.length : 0;
  const isNearLimit = charLimit ? currentLength > charLimit * 0.8 : false;
  const isOverLimit = charLimit ? currentLength > charLimit : false;

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-muted-foreground">
            {label}
          </label>
          {charLimit && (
            <span className={clsx(
              'text-xs',
              isOverLimit ? 'text-destructive' : isNearLimit ? 'text-yellow-600' : 'text-muted-foreground'
            )}>
              {currentLength}/{charLimit}
            </span>
          )}
        </div>
      )}
      <textarea
        className={clsx(
          'w-full px-4 py-3 bg-background border border-input rounded-lg',
          'text-foreground placeholder-muted-foreground/70 resize-none scrollbar-thin',
          'focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent',
          'transition-all duration-200',
          error && 'border-destructive focus:ring-destructive',
          isOverLimit && 'border-destructive focus:ring-destructive',
          className
        )}
        value={value}
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