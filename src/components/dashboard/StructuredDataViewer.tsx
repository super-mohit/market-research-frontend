// src/components/dashboard/StructuredDataViewer.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, FileText, Calendar, Building, Package } from 'lucide-react';
import { StructuredDataItem } from '../../types';
import { DataCard } from './DataCard';
import { Badge } from '../ui/Badge';

const TABS = [
  { id: 'News', label: 'News', icon: Newspaper },
  { id: 'Legalnews', label: 'Legal', icon: Building },
  { id: 'Patents', label: 'Patents', icon: FileText },
  { id: 'Conference', label: 'Conferences', icon: Calendar },
  { id: 'Other', label: 'Other', icon: Package },
];

interface StructuredDataViewerProps {
  data: {
    News: StructuredDataItem[];
    Patents: StructuredDataItem[];
    Conference: StructuredDataItem[];
    Legalnews: StructuredDataItem[];
    Other: StructuredDataItem[];
  };
}

export const StructuredDataViewer: React.FC<StructuredDataViewerProps> = ({ data }) => {
  const [activeTab, setActiveTab] = useState('News');

  const getCount = (id: string) => data[id as keyof typeof data]?.length || 0;
  const currentData = data[activeTab as keyof typeof data] || [];

  return (
    <div className="h-full flex flex-col">
      {/* CHANGE: Update tab styling for consistency */}
      <div className="flex items-center space-x-2 border-b border-border pb-1 mb-6 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2.5 rounded-t-md text-sm font-medium transition-all duration-200 border-b-2
              ${
                activeTab === tab.id
                  ? 'border-primary text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
            <Badge variant={activeTab === tab.id ? 'success' : 'default'} size="sm">
              {getCount(tab.id)}
            </Badge>
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-thin pr-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            {currentData.length > 0 ? (
              currentData.map((item) => <DataCard key={item.source_url + item.title} item={item} />)
            ) : (
              <div className="text-center py-16 text-muted-foreground">
                <p>No items found for this category.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};