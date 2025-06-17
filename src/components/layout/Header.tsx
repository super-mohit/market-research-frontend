import React from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  title?: string;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "Market Intelligence Dashboard", 
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
            <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center">
              <Search className="w-4 h-4 text-navy-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground leading-tight">Supervity</h1>
              <p className="text-sm text-muted-foreground leading-tight">{title}</p>
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