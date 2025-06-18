// src/hooks/api/useJobStream.ts - SIMPLIFIED FIX
import { useEffect, useRef, useCallback } from 'react';
import { useResearchStore } from '../../store/useResearchStore';
import { API_CONFIG } from '../../config/api';
import { useAuthStore } from '../../store/useAuthStore';

export const useJobStream = (jobId: string | undefined) => {
  const { setJobCompleted, addLog, updateJobStatus } = useResearchStore();
  const token = useAuthStore((state) => state.token);
  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (!jobId || !token || eventSourceRef.current) return;

    console.log(`🔌 Connecting to SSE for job ${jobId}`);
    const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.RESEARCH_STREAM(jobId)}?token=${token}`;
    
    const es = new EventSource(url);
    eventSourceRef.current = es;

    es.onopen = () => {
      console.log(`✅ SSE connection established for job ${jobId}`);
      addLog('Live connection to research agent established.');
    };

    // Listen for structured status updates
    es.addEventListener('status', (event) => {
      try {
        const statusData = JSON.parse(event.data);
        console.log('📊 SSE Status update:', statusData);
        // Update the loading stages in the store
        updateJobStatus(statusData);
      } catch (e) {
        console.error('Failed to parse status event data', e);
      }
    });

    // Listen for the final result
    es.addEventListener('result', (event) => {
      console.log('🎉 SSE Result received! Job is complete.');
      addLog('Research complete! Preparing dashboard...');
      setJobCompleted();
      es.close(); // Close the connection, we are done
    });

    // Listen for the generic "close" signal from the backend
    es.addEventListener('close', (event) => {
      console.log('🔒 SSE connection closed by server:', event.data);
      addLog('Live connection closed.');
      setJobCompleted(); // Also mark as complete on close
      es.close();
    });

    es.onerror = (error) => {
      console.error('❌ SSE Error:', error);
      addLog('Error: Lost connection to the research agent.');
      // Don't mark as complete on error, let polling handle it
      es.close();
    };

  }, [jobId, token, setJobCompleted, addLog, updateJobStatus]);

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