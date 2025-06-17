// src/pages/ResearchPage.tsx
import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { LoadingStages } from '../components/dashboard/LoadingStages';
import { useJobStream } from '../hooks/api/useJobStream';
import { useResearchStore } from '../store/useResearchStore';
import { researchApi } from '../services/researchApi';

export const ResearchPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { loadingStages, logs, jobStatus, setCurrentJob, resetJobStatus } = useResearchStore();
  const hasRedirectedRef = useRef(false);

  // Connect to SSE for live updates
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
    if (jobStatus === 'completed' && jobId && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      console.log('✨ Job completed! Redirecting to dashboard...');
      
      toast.success('Research complete! Preparing your dashboard...');
      
      // Delay to show completion state
      setTimeout(() => {
        navigate(`/dashboard/${jobId}`);
      }, 2000);
    }
    
    if (jobStatus === 'failed') {
      toast.error('The research job failed.');
      navigate('/');
    }
  }, [jobStatus, jobId, navigate]);

  // Fallback polling (safety net)
  useEffect(() => {
    if (!jobId || jobStatus === 'completed' || jobStatus === 'failed') return;

    const pollForCompletion = async () => {
      try {
        const data = await researchApi.getJobStatus(jobId);
        
        if (data.status === 'completed' && jobStatus !== 'completed') {
          console.log('🔧 Fallback polling detected completion');
          // The store will be updated via SSE or this will trigger the redirect effect
        }
      } catch (error) {
        console.warn('Polling error:', error);
      }
    };

    // Start polling after 30 seconds as a backup
    const pollInterval = setInterval(pollForCompletion, 10000); // Poll every 10 seconds

    // Stop polling after 5 minutes
    const timeoutId = setTimeout(() => {
      console.log('Polling timeout reached. Stopping.');
      clearInterval(pollInterval);
    }, 300000); // 5 minutes

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeoutId);
    };
  }, [jobId, jobStatus]);

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
    <LoadingStages 
      stages={loadingStages} 
      logs={logs} 
      isCompleted={jobStatus === 'completed'}
      completedMessage="Research Complete!"
    />
  );
};