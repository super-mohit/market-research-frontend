import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Calendar, Building, ChevronDown, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { StructuredDataItem } from '../../types';
import { Badge } from '../ui/Badge';

interface DataCardProps {
  item: StructuredDataItem;
}

export const DataCard: React.FC<DataCardProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-4 transition-all duration-200 hover:shadow-lg hover:border-slate-300"
    >
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
        
        <a
          href={item.source_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-primary transition-colors p-1"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      <h3 className="text-foreground font-medium mb-2 line-clamp-2 leading-snug">
        {item.title}
      </h3>

      <div className="text-muted-foreground text-sm">
        {isExpanded ? (
          <div className="space-y-2">
            <p>{item.summary}</p>
            <button
              onClick={() => setIsExpanded(false)}
              className="flex items-center text-lime-600 hover:text-lime-500 text-xs font-medium"
            >
              <ChevronRight className="w-3 h-3 mr-1" />
              Show less
            </button>
          </div>
        ) : (
          <div>
            <p className="line-clamp-3 mb-2">
              {item.summary}
            </p>
            {item.summary.length > 150 && (
              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center text-lime-600 hover:text-lime-500 text-xs font-medium"
              >
                <ChevronDown className="w-3 h-3 mr-1" />
                Read more
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};