import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

import { useJobStream } from '../hooks/api/useJobStream';
import { useResearchStore } from '../store/useResearchStore';
import supervityLogo from '../assets/supervity-logo.svg';

export const SimplifiedResearchPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { 
    isJobCompleted, 
    setCurrentJob,
    resetJobStatus, 
    loadingStages,
  } = useResearchStore();
  const hasRedirectedRef = useRef(false);

  useJobStream(jobId);

  useEffect(() => {
    if (jobId) setCurrentJob(jobId);
    return () => resetJobStatus();
  }, [jobId, setCurrentJob, resetJobStatus]);

  useEffect(() => {
    if (isJobCompleted && jobId && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      toast.success('Your intelligence report is ready!');
      setTimeout(() => navigate(`/dashboard/${jobId}`), 1500);
    }
  }, [isJobCompleted, jobId, navigate]);

  const completedStages = loadingStages.filter(s => s.status === 'completed').length;
  const totalStages = loadingStages.length;
  const activeStage = loadingStages.find(s => s.status === 'active');
  const overallProgress = isJobCompleted 
    ? 100 
    : (completedStages / totalStages * 100) + (activeStage?.progress || 0) / totalStages;

  const currentStageInfo = activeStage || loadingStages[completedStages] || loadingStages[0];

  return (
    <div className="flex items-center justify-center min-h-screen p-6 bg-slate-50">
      <div className="w-full max-w-2xl text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src={supervityLogo} alt="Supervity Logo" className="h-10 mx-auto mb-3" />
          <h1 className="text-lg font-medium text-muted-foreground">Market Intelligence Agent is processing your request</h1>
        </motion.div>

        <motion.div 
          className="bg-white rounded-2xl shadow-xl border p-8 mt-12"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-4">
            <div className="flex justify-between items-baseline mb-2">
              <p className="font-semibold text-navy-900">Overall Progress</p>
              <span className="text-sm font-bold text-lime-600">{Math.round(overallProgress)}%</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-200">
              <motion.div 
                className="h-2.5 rounded-full bg-lime-500"
                initial={{ width: '0%' }}
                animate={{ width: `${overallProgress}%` }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
          </div>

          <div className="mt-8 mb-6 h-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStageInfo.id}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="text-xl font-bold text-foreground">{currentStageInfo.name}</h2>
                <p className="text-muted-foreground text-sm mt-1">{currentStageInfo.description}</p>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex justify-between items-center">
            {loadingStages.map((stage) => (
              <React.Fragment key={stage.id}>
                <motion.div
                  className="flex flex-col items-center gap-2"
                  animate={{ scale: stage.status === 'active' ? 1.1 : 1, opacity: stage.status !== 'pending' ? 1 : 0.4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                    stage.status === 'completed' ? 'bg-lime-500 border-lime-600 text-white' :
                    stage.status === 'active' ? 'bg-lime-500/20 border-lime-500 text-lime-600 animate-pulse' :
                    'bg-slate-100 border-slate-200 text-slate-400'
                  }`}>
                    {stage.status === 'completed' ? <Check size={20} /> :
                     stage.status === 'active' ? <Zap size={20} /> :
                     <Clock size={20} />}
                  </div>
                </motion.div>
                {stage.id !== 'compiling' && <div className="flex-1 h-0.5 bg-slate-200 mx-2"></div>}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        <motion.p
          className="text-sm text-muted-foreground mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {isJobCompleted ? "Finalizing report..." : "This process is fully automated. You can safely leave this page."}
        </motion.p>
      </div>
    </div>
  );
}; 