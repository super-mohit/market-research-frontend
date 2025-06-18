import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Calendar, Building, ChevronDown, ChevronRight, Copy, Quote } from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import { StructuredDataItem } from '../../types';
import { Badge } from '../ui/Badge';
import { CardTitle, BodyText, CaptionText } from '../ui/Typography';

interface DataCardProps {
  item: StructuredDataItem;
}

export const DataCard: React.FC<DataCardProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'News': return 'info';
      case 'Legalnews': return 'warning';
      case 'Patents': return 'success';
      case 'Conference': return 'default';
      default: return 'default';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Conference':
        return <Calendar className="w-4 h-4" />;
      case 'Patents':
        return <Building className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(item.summary);
      toast.success('Summary copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy summary.');
      console.error('Failed to copy summary:', err);
    }
  };

  const handleCiteSource = async () => {
    const citation = `${item.title} (${formatDate(item.date)}). ${item.source_url}`;
    try {
      await navigator.clipboard.writeText(citation);
      toast.success('Citation copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy citation.');
      console.error('Failed to copy citation:', err);
    }
  };

  return (
    <motion.div
      whileHover={{ 
        y: -4, 
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" 
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="card p-4 transition-all duration-300 hover:border-lime-300/50 relative group"
    >
      {/* Hover Actions */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.95,
          x: isHovered ? 0 : 10
        }}
        transition={{ duration: 0.2 }}
        className="absolute top-2 right-2 flex items-center space-x-1 z-10"
      >
        <motion.button
          onClick={handleCopySummary}
          title="Copy Summary"
          className="p-1.5 rounded-md bg-white/90 text-muted-foreground hover:text-lime-600 hover:bg-lime-50 shadow-sm transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Copy className="w-3.5 h-3.5" />
        </motion.button>
        <motion.button
          onClick={handleCiteSource}
          title="Copy Citation"
          className="p-1.5 rounded-md bg-white/90 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 shadow-sm transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <Quote className="w-3.5 h-3.5" />
        </motion.button>
      </motion.div>

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Badge variant={getTypeColor(item.type)} size="sm" className="flex items-center space-x-1">
            {getTypeIcon(item.type)}
            <span>{item.type}</span>
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDate(item.date)}
          </span>
        </div>
        
        <motion.a
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors p-1 rounded-md hover:bg-slate-100 relative z-20"
          title="Visit source"
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
        >
          <ExternalLink className="w-4 h-4" />
        </motion.a>
      </div>

      <motion.h3 
        className="group-hover:text-lime-600 transition-colors mb-2"
        layout
      >
        <CardTitle>{item.title}</CardTitle>
      </motion.h3>

      <div className="text-muted-foreground text-sm">
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div 
              key="expanded"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-2"
            >
              <BodyText color="secondary">{item.summary}</BodyText>
              <motion.button
                onClick={() => setIsExpanded(false)}
                className="flex items-center text-lime-600 hover:text-lime-500 font-medium"
                whileHover={{ x: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <ChevronRight className="w-3 h-3 mr-1" />
                <CaptionText color="success">Show less</CaptionText>
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="collapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <BodyText color="secondary" className="line-clamp-3 mb-2">
                {item.summary}
              </BodyText>
              {item.summary.length > 150 && (
                <motion.button
                  onClick={() => setIsExpanded(true)}
                  className="flex items-center text-lime-600 hover:text-lime-500 font-medium"
                  whileHover={{ x: 2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ChevronDown className="w-3 h-3 mr-1" />
                  <CaptionText color="success">Read more</CaptionText>
                </motion.button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};