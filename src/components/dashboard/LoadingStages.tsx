import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader, Search, FileText, Brain, Building, CheckCircle } from 'lucide-react';
import { LoadingStage } from '../../types';

interface LiveResearchConsoleProps {
  stages: LoadingStage[];
  logs: string[];
}

const STAGE_ICONS: { [key: string]: React.ElementType } = {
  planning: Search,
  searching: FileText,
  synthesizing: Brain,
  extracting: Building,
  compiling: CheckCircle,
};

const LogLine: React.FC<{ text: string }> = ({ text }) => {
  // --- THIS IS THE IMMEDIATE CRASH-PREVENTION FIX ---
  if (typeof text !== 'string') {
    return null; // Don't render anything if the log isn't a string
  }

  let color = 'text-muted-foreground';
  if (text.startsWith('✅')) color = 'text-lime-600';
  if (text.startsWith('Extracting')) color = 'text-blue-soft';
  if (text.startsWith('[Agent')) color = 'text-cyan-bright';
  if (text.startsWith('---')) color = 'text-gray-400 font-bold';

  return (
    <p className={`whitespace-nowrap truncate ${color}`}>
      <span className="text-lime-500 mr-2 opacity-50">$</span>{text}
    </p>
  );
};

export const LoadingStages: React.FC<LiveResearchConsoleProps> = ({ stages, logs }) => {
  const logContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-5xl"
      >
        <div className="text-center mb-10">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <Brain className="w-8 h-8 text-navy-900" />
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Generating Intelligence Report
          </h1>
          <p className="text-muted-foreground">
            Our AI agents are conducting in-depth market research. This may take several minutes.
          </p>
        </div>

        <div className="card p-8 grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Left: Pipeline Stages */}
          <div className="md:col-span-2 space-y-4">
            {stages.map((stage) => {
              const Icon = STAGE_ICONS[stage.id] || Loader;
              return (
                <div key={stage.id} className="flex items-center space-x-4">
                  <motion.div 
                    animate={{ scale: stage.status === 'active' ? 1.1 : 1 }}
                    transition={{ duration: 0.5, yoyo: Infinity }}
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
                </div>
              );
            })}
          </div>

          {/* Right: Live Log */}
          <div className="md:col-span-3 bg-slate-100 rounded-lg p-4 flex flex-col h-80 border">
            <div className="flex-shrink-0 text-xs font-medium text-lime-600 mb-2">
              [LIVE RESEARCH FEED]
            </div>
            <div ref={logContainerRef} className="flex-1 overflow-y-auto scrollbar-thin space-y-1 text-sm font-mono">
              <AnimatePresence initial={false}>
                {logs.map((log, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <LogLine text={log} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};