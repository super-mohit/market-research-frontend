import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader, Search, FileText, Building, CheckCircle } from 'lucide-react';
import { LoadingStage } from '../../types';

interface LiveResearchConsoleProps {
  stages: LoadingStage[];
  logs: string[];
  isCompleted?: boolean;
  completedMessage?: string;
}

const STAGE_ICONS: { [key: string]: React.ElementType } = {
  planning: Search,
  searching: FileText,
  synthesizing: () => <img src="/supervity-logomark.svg" alt="Supervity AI" className="w-5 h-5" />,
  extracting: Building,
  compiling: CheckCircle,
};

const LogLine: React.FC<{ text: string; index: number }> = ({ text, index }) => {
  // --- THIS IS THE IMMEDIATE CRASH-PREVENTION FIX ---
  if (typeof text !== 'string') {
    return null; // Don't render anything if the log isn't a string
  }

  let color = 'text-muted-foreground';
  if (text.startsWith('✅')) color = 'text-lime-600';
  if (text.startsWith('Extracting')) color = 'text-blue-soft';
  if (text.startsWith('[Agent')) color = 'text-cyan-bright';
  if (text.startsWith('---')) color = 'text-gray-400 font-bold';

  // Zebra striping for better readability
  const isEven = index % 2 === 0;
  const bgColor = isEven ? 'bg-slate-50' : 'bg-white';

  return (
    <div className={`px-2 py-1 ${bgColor} rounded`}>
      <p className={`whitespace-nowrap truncate ${color}`}>
        <span className="text-lime-500 mr-2 opacity-50">$</span>{text}
      </p>
    </div>
  );
};

export const LoadingStages: React.FC<LiveResearchConsoleProps> = ({ 
  stages, 
  logs, 
  isCompleted = false, 
  completedMessage = "Research Complete!" 
}) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-6">
      {/* Enhanced background pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-lime-50/20 to-slate-100">
        <div className="absolute inset-0 opacity-[0.02]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="research-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#84cc16" strokeWidth="1"/>
                <circle cx="30" cy="30" r="1" fill="#84cc16" opacity="0.3"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#research-grid)" />
          </svg>
        </div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-lime-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-lime-600/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lime-500/5 rounded-full blur-3xl"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div
            animate={{ 
              scale: isCompleted ? [1, 1.1, 1] : [1, 1.05, 1],
              rotate: isCompleted ? 0 : [0, 360]
            }}
            transition={{ 
              scale: { duration: isCompleted ? 0.6 : 2.5, repeat: isCompleted ? 0 : Infinity },
              rotate: { duration: 20, repeat: isCompleted ? 0 : Infinity, ease: "linear" }
            }}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
              isCompleted ? 'bg-lime-500 shadow-lg shadow-lime-500/50' : 'bg-lime-500/90 shadow-lg shadow-lime-500/30'
            }`}
          >
            <img src="/supervity-logomark.svg" alt="Supervity" className="w-10 h-10" />
          </motion.div>
          <motion.h1 
            className="text-3xl font-bold text-foreground mb-2"
            animate={{ scale: isCompleted ? [1, 1.02, 1] : 1 }}
            transition={{ duration: 0.6 }}
          >
            {isCompleted ? completedMessage : 'Generating Intelligence Report'}
          </motion.h1>
          <motion.p 
            className="text-muted-foreground"
            animate={{ opacity: isCompleted ? [0.7, 1, 0.7] : 1 }}
            transition={{ duration: 1.5, repeat: isCompleted ? Infinity : 0 }}
          >
            {isCompleted 
              ? 'Preparing your comprehensive dashboard...' 
              : 'Our AI agents are conducting in-depth market research. This may take several minutes.'
            }
          </motion.p>
        </div>

        <motion.div 
          className="card p-8 grid grid-cols-1 md:grid-cols-5 gap-8 backdrop-blur-sm bg-white/90 border border-white/20 shadow-xl"
          animate={{
            boxShadow: isCompleted 
              ? "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(132, 204, 22, 0.1)"
              : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)"
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Left: Pipeline Stages */}
          <div className="md:col-span-2 space-y-4">
            {stages.map((stage) => {
              const Icon = STAGE_ICONS[stage.id] || Loader;
              return (
                <motion.div 
                  key={stage.id} 
                  className="flex items-center space-x-4"
                  animate={{ 
                    x: stage.status === 'active' ? [0, 2, 0] : 0 
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: stage.status === 'active' ? Infinity : 0 
                  }}
                >
                  <motion.div 
                    animate={{ 
                      scale: stage.status === 'active' ? [1, 1.1, 1] : 1,
                      boxShadow: stage.status === 'active' 
                        ? ["0 0 0 0 rgba(132, 204, 22, 0.7)", "0 0 0 10px rgba(132, 204, 22, 0)", "0 0 0 0 rgba(132, 204, 22, 0)"]
                        : "0 0 0 0 rgba(132, 204, 22, 0)"
                    }}
                    transition={{ 
                      scale: { duration: 1.5, repeat: stage.status === 'active' ? Infinity : 0 },
                      boxShadow: { duration: 2, repeat: stage.status === 'active' ? Infinity : 0 }
                    }}
                    className={`w-10 h-10 rounded-lg flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                      stage.status === 'completed' ? 'bg-lime-500/20 text-lime-600' :
                      stage.status === 'active' ? 'bg-lime-500/30 text-lime-500' :
                      'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {stage.status === 'completed' ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-foreground">{stage.name}</h4>
                    <p className="text-xs text-muted-foreground">{stage.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Right: Live Log with enhanced styling */}
          <div className="md:col-span-3 bg-gradient-to-br from-slate-100 to-slate-50 rounded-lg p-4 flex flex-col h-80 border border-slate-200/50 shadow-inner">
            <div className="flex-shrink-0 flex items-center justify-between mb-2">
              <div className="text-xs font-medium text-lime-600">
                [LIVE RESEARCH FEED]
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-lime-600 font-medium">ACTIVE</span>
              </div>
            </div>
            
            <div 
              ref={logContainerRef} 
              className="flex-1 overflow-y-auto scrollbar-thin space-y-1 text-sm font-mono"
            >
              <AnimatePresence initial={false}>
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LogLine text={log} index={index} />
                  </motion.div>
                ))}
                
                {/* Blinking cursor for live feel */}
                {!isCompleted && (
                  <motion.div
                    animate={{ opacity: [1, 0, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="flex items-center"
                  >
                    <span className="text-lime-500 mr-2 opacity-50">$</span>
                    <div className="w-2 h-4 bg-lime-500"></div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Completion status indicator */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-lime-500/10 border border-lime-500/20 rounded-full">
              <CheckCircle className="w-4 h-4 text-lime-600" />
              <span className="text-sm text-lime-700 font-medium">
                Analysis Complete • Redirecting...
              </span>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};