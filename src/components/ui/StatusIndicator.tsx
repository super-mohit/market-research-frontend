import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader, CheckCircle, AlertTriangle } from 'lucide-react';

type Status = 'pending' | 'ready' | 'failed' | 'idle';

interface StatusIndicatorProps {
  status: Status;
  size?: number;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({ status, size = 16 }) => {
  const iconSize = size * 0.75;

  const getStatusContent = () => {
    switch (status) {
      case 'pending':
        return {
          key: 'pending',
          node: <Loader className="animate-spin-slow text-yellow-500" style={{ width: iconSize, height: iconSize }} />,
          tooltip: 'Preparing AI Analyst...',
          bgColor: 'bg-yellow-500/10',
          ringColor: 'ring-yellow-500/30'
        };
      case 'ready':
        return {
          key: 'ready',
          node: <CheckCircle className="text-lime-500" style={{ width: iconSize, height: iconSize }} />,
          tooltip: 'AI Analyst is ready',
          bgColor: 'bg-lime-500/10',
          ringColor: 'ring-lime-500/30'
        };
      case 'failed':
        return {
          key: 'failed',
          node: <AlertTriangle className="text-destructive" style={{ width: iconSize, height: iconSize }} />,
          tooltip: 'AI Analyst setup failed',
          bgColor: 'bg-destructive/10',
          ringColor: 'ring-destructive/30'
        };
      default:
        return { key: 'idle', node: null, tooltip: '', bgColor: '', ringColor: '' };
    }
  };

  const currentStatus = getStatusContent();
  if (currentStatus.key === 'idle') return null;

  return (
    <div className="relative group" title={currentStatus.tooltip}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStatus.key}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.2 }}
          className={`relative flex items-center justify-center rounded-full ring-2 ${currentStatus.bgColor} ${currentStatus.ringColor}`}
          style={{ width: size, height: size }}
        >
          {currentStatus.node}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}; 