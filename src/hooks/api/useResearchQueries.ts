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

// Job Status Query with Smart Polling
export const useJobStatus = (jobId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.RESEARCH_STATUS(jobId || ''),
    queryFn: () => researchApi.getJobStatus(jobId!),
    enabled: enabled && !!jobId,
    refetchInterval: (data) => {
      // Poll every 3 seconds if job is still running
      if (data?.status === 'running' || data?.status === 'pending') {
        return 3000;
      }
      // Stop polling when completed or failed
      return false;
    },
    refetchIntervalInBackground: true,
    staleTime: 1000, // Consider data stale after 1 second
    retry: (failureCount, error: any) => {
      // Don't retry on 404 (job not found)
      if (error?.response?.status === 404) return false;
      // Retry up to 3 times for other errors
      return failureCount < 3;
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

// RAG Info Query
export const useRAGInfo = (jobId: string | undefined, enabled = true) => {
  return useQuery({
    queryKey: QUERY_KEYS.RAG_INFO(jobId || ''),
    queryFn: () => researchApi.getRAGInfo(jobId!),
    enabled: enabled && !!jobId,
    // --- NEW: Add smart polling for RAG status ---
    refetchInterval: (data) => {
      // If RAG is not yet uploaded, poll every 5 seconds.
      if (data?.rag_status !== 'uploaded') {
        return 5000;
      }
      // Otherwise, stop polling.
      return false;
    },
    refetchIntervalInBackground: true,
    staleTime: 0, // Always get the latest status during polling
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