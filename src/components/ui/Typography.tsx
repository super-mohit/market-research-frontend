import React from 'react';
import { clsx } from 'clsx';

// Typography scale following design systems best practices
export const typographyVariants = {
  // Display text - for hero sections and main page titles
  'display-2xl': 'text-5xl md:text-6xl font-bold leading-none tracking-tight',
  'display-xl': 'text-4xl md:text-5xl font-bold leading-none tracking-tight',
  'display-lg': 'text-3xl md:text-4xl font-bold leading-tight tracking-tight',
  
  // Headlines - for page sections and major components
  'headline-lg': 'text-2xl md:text-3xl font-bold leading-tight tracking-tight',
  'headline-md': 'text-xl md:text-2xl font-bold leading-tight',
  'headline-sm': 'text-lg md:text-xl font-semibold leading-tight',
  
  // Titles - for cards, sections, and component headers
  'title-lg': 'text-lg font-semibold leading-tight',
  'title-md': 'text-base font-semibold leading-tight',
  'title-sm': 'text-sm font-semibold leading-tight',
  
  // Body text - for content and descriptions
  'body-lg': 'text-lg leading-relaxed',
  'body-md': 'text-base leading-relaxed',
  'body-sm': 'text-sm leading-relaxed',
  
  // Labels and UI text - for form labels, metadata, etc.
  'label-lg': 'text-sm font-medium leading-tight',
  'label-md': 'text-xs font-medium leading-tight uppercase tracking-wide',
  'label-sm': 'text-xs font-medium leading-tight',
  
  // Caption and helper text
  'caption': 'text-xs leading-tight',
  'overline': 'text-xs font-medium uppercase tracking-wide leading-tight',
} as const;

export const colorVariants = {
  primary: 'text-foreground',
  secondary: 'text-muted-foreground',
  tertiary: 'text-slate-500',
  success: 'text-lime-600',
  warning: 'text-yellow-600',
  error: 'text-red-600',
  inverse: 'text-background',
} as const;

interface TypographyProps {
  variant?: keyof typeof typographyVariants;
  color?: keyof typeof colorVariants;
  className?: string;
  children: React.ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const Typography: React.FC<TypographyProps> = ({
  variant = 'body-md',
  color = 'primary',
  className,
  children,
  as: Component = 'p',
}) => {
  return (
    <Component
      className={clsx(
        typographyVariants[variant],
        colorVariants[color],
        className
      )}
    >
      {children}
    </Component>
  );
};

// Convenient component shortcuts for common use cases
export const PageTitle: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography variant="display-lg" as="h1" {...props} />
);

export const SectionTitle: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography variant="headline-md" as="h2" {...props} />
);

export const CardTitle: React.FC<Omit<TypographyProps, 'variant' | 'as'>> = (props) => (
  <Typography variant="title-lg" as="h3" {...props} />
);

export const BodyText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="body-md" {...props} />
);

export const CaptionText: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="caption" color="secondary" {...props} />
);

export const Label: React.FC<Omit<TypographyProps, 'variant'>> = (props) => (
  <Typography variant="label-lg" color="primary" {...props} />
); 