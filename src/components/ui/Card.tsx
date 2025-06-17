import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  glow = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={clsx(
        'glass-card p-6',
        hover && 'hover:bg-white/10 hover:border-white/20 cursor-pointer',
        glow && 'glow-lime',
        className
      )}
    >
      {children}
    </motion.div>
  );
};