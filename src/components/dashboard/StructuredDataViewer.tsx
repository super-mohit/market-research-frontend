// src/components/dashboard/StructuredDataViewer.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Newspaper, FileText, Calendar, Building, Package, List, Grid3X3 } from 'lucide-react';
import { StructuredDataItem } from '../../types';
import { DataCard } from './DataCard';
import { Badge } from '../ui/Badge';
import { SkeletonDataCard } from '../ui/Skeleton';
import { CardTitle, BodyText } from '../ui/Typography';

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
  isLoading?: boolean;
}

export const StructuredDataViewer: React.FC<StructuredDataViewerProps> = ({ 
  data, 
  isLoading = false 
}) => {
  const [activeTab, setActiveTab] = useState('News');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const getCount = (id: string) => data[id as keyof typeof data]?.length || 0;
  const currentData = data[activeTab as keyof typeof data] || [];

  return (
    <div className="h-full flex flex-col">
      {/* Header with tabs and view toggle */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2 border-b border-border pb-1 overflow-x-auto flex-1">
          {TABS.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex items-center space-x-2 px-3 py-2.5 rounded-t-md text-sm font-medium transition-all duration-200 border-b-2 relative ${
                activeTab === tab.id
                  ? 'border-lime-500 text-foreground bg-lime-500/10'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-slate-100/50'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-lime-500/10 rounded-t-md"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <tab.icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{tab.label}</span>
              <Badge variant={activeTab === tab.id ? 'success' : 'default'} size="sm" className="relative z-10">
                {getCount(tab.id)}
              </Badge>
            </motion.button>
          ))}
        </div>

        {/* View Toggle */}
        <div className="flex items-center space-x-1 ml-4 border border-border rounded-lg p-1">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'list' 
                ? 'bg-lime-500/10 text-lime-600' 
                : 'text-muted-foreground hover:text-foreground hover:bg-slate-100'
            }`}
            title="List view"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-colors ${
              viewMode === 'grid' 
                ? 'bg-lime-500/10 text-lime-600' 
                : 'text-muted-foreground hover:text-foreground hover:bg-slate-100'
            }`}
            title="Grid view"
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin pr-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${activeTab}-${viewMode}`}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { 
                  staggerChildren: 0.05,
                  delayChildren: 0.1
                }
              }
            }}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
                : 'space-y-4'
            }
          >
            {isLoading ? (
              // Show skeleton loaders while loading
              Array.from({ length: 6 }).map((_, index) => (
                <motion.div
                  key={index}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                  layout
                >
                  <SkeletonDataCard />
                </motion.div>
              ))
            ) : currentData.length > 0 ? (
              currentData.map((item) => (
                <motion.div
                  key={item.source_url + item.title}
                  variants={{
                    hidden: { y: 20, opacity: 0 },
                    visible: { y: 0, opacity: 1 }
                  }}
                  layout
                >
                  <DataCard item={item} />
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="text-center py-16 text-muted-foreground col-span-full flex flex-col items-center"
                variants={{
                  hidden: { y: 20, opacity: 0 },
                  visible: { y: 0, opacity: 1 }
                }}
              >
                <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6 border">
                  <FileText className="w-10 h-10 text-slate-400" />
                </div>
                <CardTitle className="mb-2">No Data For This Category</CardTitle>
                <BodyText color="secondary" className="max-w-sm">
                  The research agent did not find any relevant items for "{activeTab}" based on your query.
                </BodyText>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};