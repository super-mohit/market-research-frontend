import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Clock, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

import { useJobStream } from '../hooks/api/useJobStream';
import { useResearchStore } from '../store/useResearchStore';
import supervityLogo from '../assets/supervity-logo.svg';
import supervityLogomark from '../assets/supervity-logomark.svg';

export const SimplifiedResearchPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { 
    isJobCompleted, 
    setJobCompleted, 
    resetJobStatus, 
    setCurrentJob,
    loadingStages,
    currentStage,
    jobStatus
  } = useResearchStore();
  const hasRedirectedRef = useRef(false);

  // Connect to the job stream
  useJobStream(jobId);

  // Initialize job tracking
  useEffect(() => {
    if (jobId) {
      setCurrentJob(jobId);
    }
    return () => resetJobStatus();
  }, [jobId, setCurrentJob, resetJobStatus]);

  // Effect to handle the redirect once the job is complete
  useEffect(() => {
    if (isJobCompleted && jobId && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      toast.success('Your intelligence report is ready!');
      
      // The "Complete" animation will play for 1.5s before redirect
      setTimeout(() => {
        navigate(`/dashboard/${jobId}`);
      }, 1500);
    }
  }, [isJobCompleted, jobId, navigate]);

  // Calculate overall progress
  const completedStages = loadingStages.filter(stage => stage.status === 'completed').length;
  const totalStages = loadingStages.length;
  const currentActiveStage = loadingStages.find(stage => stage.status === 'active');
  const overallProgress = isJobCompleted ? 100 : (completedStages / totalStages * 100) + (currentActiveStage?.progress || 0) / totalStages;

  // Get current stage info
  const getCurrentStageInfo = () => {
    if (isJobCompleted) return { name: 'Complete!', description: 'Your intelligence report is ready' };
    const activeStage = loadingStages.find(stage => stage.status === 'active');
    if (activeStage) return activeStage;
    const lastCompleted = loadingStages.filter(stage => stage.status === 'completed').slice(-1)[0];
    if (lastCompleted) return lastCompleted;
    return loadingStages[0];
  };

  const currentStageInfo = getCurrentStageInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-32 h-32 bg-lime-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-blue-soft/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-lime-500 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 left-1/4 w-1 h-1 bg-cyan-bright rounded-full animate-ping"></div>
      </div>

      {/* Header */}
      <motion.div 
        className="mb-12 relative z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img src={supervityLogo} alt="Supervity Logo" className="h-10 w-auto mx-auto mb-3" />
        <h1 className="text-lg font-medium text-muted-foreground">Market Intelligence Agent</h1>
      </motion.div>

      {/* Main Content Card */}
      <motion.div 
        className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-8 w-full max-w-2xl relative z-10"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Animated Logo */}
        <motion.div
          className="relative w-20 h-20 mx-auto mb-8"
          animate={{ rotate: isJobCompleted ? 0 : 360 }}
          transition={{ duration: 3, ease: 'linear', repeat: isJobCompleted ? 0 : Infinity }}
        >
          <img src={supervityLogomark} alt="Analyzing" className="w-full h-full" />
          
          {/* Completion check mark overlay */}
          <AnimatePresence>
            {isJobCompleted && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="absolute inset-0 bg-lime-500 rounded-full flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-dark">Progress</span>
            <span className="text-sm font-medium text-lime-600">{Math.round(overallProgress)}%</span>
          </div>
          <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-lime-500 to-cyan-bright rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Animated progress glow */}
            <motion.div
              className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-transparent via-white/40 to-transparent"
              animate={{ x: `${overallProgress * 4}%` }}
              transition={{ duration: 2, ease: "easeInOut", repeat: isJobCompleted ? 0 : Infinity }}
            />
          </div>
        </div>

        {/* Current Stage Info */}
        <div className="mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStageInfo.id || 'complete'}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-navy-900 mb-2">
                {currentStageInfo.name}
              </h2>
              <p className="text-muted-foreground">
                {currentStageInfo.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Stage Progress Indicators */}
        <div className="grid grid-cols-5 gap-2 mb-6">
          {loadingStages.map((stage, index) => (
            <motion.div
              key={stage.id}
              className="flex flex-col items-center"
              initial={{ opacity: 0.3 }}
              animate={{ 
                opacity: stage.status === 'completed' || stage.status === 'active' ? 1 : 0.3,
                scale: stage.status === 'active' ? 1.1 : 1
              }}
              transition={{ duration: 0.3 }}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                stage.status === 'completed' 
                  ? 'bg-lime-500 text-white' 
                  : stage.status === 'active'
                  ? 'bg-cyan-bright text-white animate-pulse'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {stage.status === 'completed' ? (
                  <Check className="w-4 h-4" />
                ) : stage.status === 'active' ? (
                  <Zap className="w-4 h-4" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
              </div>
              <span className="text-xs text-center text-muted-foreground leading-tight">
                {stage.name.split(' ').slice(0, 2).join(' ')}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Status Message */}
        <motion.p 
          className="text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {isJobCompleted 
            ? "Redirecting to your dashboard..." 
            : "This may take a few minutes. We're analyzing thousands of data points to build your custom report."
          }
        </motion.p>
      </motion.div>

      {/* Footer Branding */}
      <motion.div 
        className="absolute bottom-8 text-sm text-gray-400 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Supervity Intelligence Engine • Secure & Confidential
      </motion.div>
    </div>
  );
}; 