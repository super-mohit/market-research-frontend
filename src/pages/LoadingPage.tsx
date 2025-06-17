// src/pages/LoadingPage.tsx
import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { LoadingStages } from '../components/dashboard/LoadingStages';
import { useJobStatus, QUERY_KEYS } from '../hooks/api/useResearchQueries';
import { useResearchStore } from '../store/useResearchStore';
import { useAnimatedLogs } from '../hooks/useAnimatedLogs';

export const LoadingPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { loadingStages, updateJobStatus, currentStage, lastQuery } = useResearchStore();
  const hasNavigatedRef = useRef(false);

  const animatedLogs = useAnimatedLogs(currentStage, lastQuery);
  const { data: statusData, error } = useJobStatus(jobId);

  useEffect(() => {
    if (!statusData) return;

    updateJobStatus(statusData);

    if (statusData.status === 'completed' && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;
      
      setTimeout(() => {
        toast.success('Research complete! Preparing your dashboard...');
        queryClient.prefetchQuery({
          queryKey: QUERY_KEYS.RESEARCH_RESULT(jobId!),
        }).then(() => {
          navigate(`/dashboard/${jobId}`);
        });
      }, 1500);
    }
    
    if (statusData.status === 'failed') {
        toast.error(statusData.message || 'The research job failed.');
        navigate('/');
    }
  }, [statusData?.status, statusData?.stage, jobId]);

  useEffect(() => {
    if (error) {
      toast.error("Error fetching job status. Please check your connection.");
    }
  }, [error]);

  return <LoadingStages stages={loadingStages} logs={animatedLogs} />;
};