// src/pages/LoadingPage.tsx
import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQueryClient, useIsFetching } from '@tanstack/react-query';
import { LoadingStages } from '../components/dashboard/LoadingStages';
import { QUERY_KEYS } from '../hooks/api/useResearchQueries';
import { useResearchStore } from '../store/useResearchStore';
import { useJobStream } from '../hooks/api/useJobStream';

export const LoadingPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { loadingStages, logs, jobStatus } = useResearchStore();
  const hasNavigatedRef = useRef(false);

  // Start the SSE connection
  useJobStream(jobId);

  // Effect to handle navigation once data is ready
  useEffect(() => {
    if (jobStatus === 'completed' && !hasNavigatedRef.current) {
      // Check if the result is already in the cache from the SSE stream
      const resultData = queryClient.getQueryData(QUERY_KEYS.RESEARCH_RESULT(jobId!));
      
      if (resultData) {
        hasNavigatedRef.current = true;
        toast.success('Research complete! Preparing your dashboard...');
        // Small delay for user to see the "completed" state
        setTimeout(() => {
          navigate(`/dashboard/${jobId}`);
        }, 1500);
      }
    }
    
    if (jobStatus === 'failed') {
      toast.error('The research job failed.');
      navigate('/');
    }
  }, [jobStatus, jobId, queryClient, navigate]);

  return <LoadingStages stages={loadingStages} logs={logs} />;
};