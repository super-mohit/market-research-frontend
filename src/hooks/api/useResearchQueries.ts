import { useQuery, useMutation } from '@tanstack/react-query';
import { researchApi } from '../../services/researchApi';
import { QueryFormData } from '../../types';

// Query Keys
export const QUERY_KEYS = {
  RESEARCH_STATUS: (jobId: string) => ['research', 'status', jobId],
  RESEARCH_RESULT: (jobId: string) => ['research', 'result', jobId],
  RAG_INFO: (jobId: string) => ['research', 'rag', jobId],
} as const;

// Submit Research Mutation
export const useSubmitResearch = () => {
  return useMutation({
    mutationFn: (data: QueryFormData) => researchApi.submitResearch(data),
    onSuccess: (data) => {
      console.log('Research submitted successfully:', data.job_id);
    },
    onError: (error) => {
      console.error('Failed to submit research:', error);
    },
  });
};



// Job Result Query
export const useJobResult = (jobId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.RESEARCH_RESULT(jobId || ''),
    queryFn: () => researchApi.getJobResult(jobId!),
    enabled: enabled && !!jobId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404 or 202 (not ready yet)
      if (error?.response?.status === 404 || error?.response?.status === 202) {
        return false;
      }
      return failureCount < 2;
    },
  });
};



// RAG Query Mutation
export const useRAGQuery = () => {
  return useMutation({
    mutationFn: researchApi.queryRAG,
    onError: (error) => {
      console.error('RAG query failed:', error);
    },
  });
}; 