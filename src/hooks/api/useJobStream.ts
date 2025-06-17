// src/hooks/api/useJobStream.ts - SIMPLIFIED FIX
import { useEffect, useRef, useCallback } from 'react';
import { useResearchStore } from '../../store/useResearchStore';
import { API_CONFIG } from '../../config/api';

export const useJobStream = (jobId: string | undefined) => {
  const { setJobCompleted } = useResearchStore();
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!jobId || eventSourceRef.current) return;

    console.log(`🔌 Connecting to SSE for job ${jobId}`);
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESEARCH_STREAM(jobId)}`;
    const eventSource = new EventSource(url);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log(`✅ SSE connected for job ${jobId}`);
    };

    // Listen for status updates
    eventSource.addEventListener('status', (e) => {
      const data = JSON.parse(e.data);
      console.log('📊 Status update:', data);
      
      // Mark as completed when status is completed
      if (data.status === 'completed') {
        console.log('🎉 Job completed via SSE!');
        setJobCompleted();
      }
    });

    // Listen for result (backup completion trigger)
    eventSource.addEventListener('result', (e) => {
      console.log('📋 Result received via SSE!');
      setJobCompleted();
    });

    eventSource.addEventListener('close', () => {
      console.log('🔒 SSE connection closed');
      eventSource.close();
      eventSourceRef.current = null;
    });

    eventSource.onerror = (error) => {
      console.error('❌ SSE Error:', error);
      eventSource.close();
      eventSourceRef.current = null;
    };

  }, [jobId, setJobCompleted]);

  const cleanup = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
  }, []);

  useEffect(() => {
    connect();
    return cleanup;
  }, [connect, cleanup]);
};