// src/pages/ResearchPage.tsx
import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

import { Header } from '../components/layout/Header';
import { useJobStream } from '../hooks/api/useJobStream';
import { useResearchStore } from '../store/useResearchStore';
import { researchApi } from '../services/researchApi'; // <-- IMPORT THE API SERVICE

export const ResearchPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { isJobCompleted, setJobCompleted, resetJobStatus, setCurrentJob } = useResearchStore();
  const hasRedirectedRef = useRef(false);

  // Connect to SSE
  useJobStream(jobId);

  // Initialize job when component mounts
  useEffect(() => {
    if (jobId) {
      console.log('🚀 Starting job tracking for:', jobId);
      setCurrentJob(jobId);
    }
    
    // Reset on unmount
    return () => {
      resetJobStatus();
    };
  }, [jobId, setCurrentJob, resetJobStatus]);

  // Handle redirect when job completes
  useEffect(() => {
    if (isJobCompleted && jobId && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      console.log('✨ Job completed! Redirecting to dashboard...');
      
      toast.success('Research complete!');
      
      // Small delay for user feedback
      setTimeout(() => {
        navigate(`/dashboard/${jobId}`);
      }, 1000);
    }
  }, [isJobCompleted, jobId, navigate]);

  // Fallback polling (safety net) - NOW CORRECTED
  useEffect(() => {
    if (!jobId || isJobCompleted) return;

    const pollForCompletion = async () => {
      try {
        // Use the centralized, environment-aware API service
        const data = await researchApi.getJobStatus(jobId);
        
        if (data.status === 'completed' && !isJobCompleted) {
          console.log('🔧 Fallback polling detected completion');
          setJobCompleted(); // Set completion in the store, which triggers the redirect effect
        }
      } catch (error) {
        console.warn('Polling error:', error);
      }
    };

    // Start polling after 30 seconds as a backup
    const pollInterval = setInterval(pollForCompletion, 10000); // Poll every 10 seconds

    // Stop polling if the job completes or after 5 minutes
    const timeoutId = setTimeout(() => {
      console.log('Polling timeout reached. Stopping.');
      clearInterval(pollInterval);
    }, 300000); // 5 minutes

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeoutId);
    };
  }, [jobId, isJobCompleted, setJobCompleted]);

  if (!jobId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-destructive mb-4">Invalid Job ID</h1>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-lime-500 text-navy-900 font-semibold rounded-lg"
          >
            Start New Research
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Market Intelligence Agent" />
      
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="max-w-lg w-full text-center">
          
          {/* Simple Spinner */}
          <motion.div
            animate={{ 
              rotate: isJobCompleted ? 0 : 360,
              scale: isJobCompleted ? 1.2 : 1
            }}
            transition={{ 
              rotate: { duration: 2, repeat: isJobCompleted ? 0 : Infinity, ease: "linear" },
              scale: { duration: 0.5 }
            }}
            className={`w-24 h-24 mx-auto mb-8 rounded-2xl flex items-center justify-center ${
              isJobCompleted ? 'bg-lime-500' : 'bg-lime-500/20'
            }`}
          >
            {isJobCompleted ? (
              <CheckCircle className="w-12 h-12 text-navy-900" />
            ) : (
              <Loader className="w-12 h-12 text-lime-500 animate-spin" />
            )}
          </motion.div>

          {/* Simple Status */}
          <motion.h1 
            className="text-4xl font-bold text-foreground mb-4"
            animate={{ scale: isJobCompleted ? [1, 1.05, 1] : 1 }}
            transition={{ duration: 0.6 }}
          >
            {isJobCompleted ? 'Research Complete!' : 'Researching...'}
          </motion.h1>

          <motion.p 
            className="text-xl text-muted-foreground mb-12"
            animate={{ opacity: isJobCompleted ? [0.7, 1, 0.7] : 1 }}
            transition={{ duration: 1.5, repeat: isJobCompleted ? Infinity : 0 }}
          >
            {isJobCompleted ? 'Preparing your dashboard...' : 'Please wait while we gather intelligence'}
          </motion.p>

          {/* Job Info */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-lime-500/10 border border-lime-500/20 rounded-full">
              <div className="w-2 h-2 bg-lime-500 rounded-full animate-pulse" />
              <span className="text-xs text-lime-500 font-medium">
                Live Connection Active
              </span>
            </div>
            
            <div className="text-xs text-muted-foreground">
              <p>Job ID: <span className="font-mono text-lime-500">{jobId}</span></p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};