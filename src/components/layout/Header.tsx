import React from 'react';
import { motion } from 'framer-motion';
import { Search, Settings, User } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  title?: string;
  showActions?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "Market Intelligence Dashboard", 
  showActions = true 
}) => {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-lime-500 rounded-lg flex items-center justify-center">
                <Search className="w-4 h-4 text-navy-900" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Supervity</h1>
                <p className="text-sm text-muted-foreground">{title}</p>
              </div>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="ghost" size="sm">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.header>
  );
};