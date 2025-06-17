import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import toast from 'react-hot-toast';

import { useJobStream } from '../hooks/api/useJobStream';
import { useResearchStore } from '../store/useResearchStore';
import supervityLogo from '../assets/supervity-logo.svg';
import supervityLogomark from '../assets/supervity-logomark.svg';

// User-friendly messages that cycle to show progress
const progressMessages = [
  'The Intelligence Agent is analyzing your request...',
  'Scanning thousands of data sources...',
  'Identifying key market signals...',
  'Synthesizing insights and trends...',
  'Cross-referencing patents and legal news...',
  'Structuring the data for your dashboard...',
  'Your Agent is building the executive report...',
];

export const SimplifiedResearchPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { isJobCompleted, setJobCompleted, resetJobStatus, setCurrentJob } = useResearchStore();
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
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

  // Effect for cycling through the progress messages
  useEffect(() => {
    if (!isJobCompleted) {
      const intervalId = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % progressMessages.length);
      }, 3500); // Change message every 3.5 seconds

      return () => clearInterval(intervalId);
    }
  }, [isJobCompleted]);

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
      {/* Company Logo Header */}
      <img src={supervityLogo} alt="Supervity Logo" className="h-10 w-auto mb-4" />
      <h1 className="text-xl font-medium text-foreground mb-12">Market Intelligence Agent</h1>

      {/* Main Animated Visual */}
      <motion.div
        className="relative w-24 h-24 mb-10"
        animate={{ rotate: isJobCompleted ? 0 : 360 }}
        transition={{ duration: 2, ease: 'linear', repeat: isJobCompleted ? 0 : Infinity }}
      >
        {/* Supervity logomark with rotating animation */}
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
              <Check className="w-12 h-12 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Animated Progress Text */}
      <div className="relative h-12 w-full max-w-lg">
        <AnimatePresence mode="wait">
          <motion.h1
            key={isJobCompleted ? 'complete' : currentMessageIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 text-2xl md:text-3xl font-medium text-foreground"
          >
            {isJobCompleted ? 'Report Generated!' : progressMessages[currentMessageIndex]}
          </motion.h1>
        </AnimatePresence>
      </div>

      <p className="text-muted-foreground mt-4">This may take a few minutes. You can safely leave this page and come back later.</p>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-sm text-gray-400">
        Supervity Intelligence Engine • Secure & Confidential
      </div>
    </div>
  );
}; 