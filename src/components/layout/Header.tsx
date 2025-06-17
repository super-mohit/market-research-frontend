import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import supervityLogo from '../../assets/supervity-logo.svg';

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "Intelligence Agent", 
  children
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50"
    >
      <div className="max-w-screen-xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <img src={supervityLogo} alt="Supervity Logo" className="h-8 w-auto" />
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">{title}</h1>
            </div>
          </Link>
          
          {children && (
            <div className="flex items-center space-x-3">
              {children}
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};