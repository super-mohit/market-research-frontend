export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  WS_URL: import.meta.env.VITE_WS_URL || 'ws://localhost:8000',
  POLLING_INTERVAL: parseInt(import.meta.env.VITE_POLLING_INTERVAL || '3000'),
  TIMEOUT: parseInt(import.meta.env.VITE_TIMEOUT || '300000'),
  ENDPOINTS: {
    RESEARCH: '/api/research',
    RESEARCH_STATUS: (jobId: string) => `/api/research/status/${jobId}`,
    RESEARCH_RESULT: (jobId: string) => `/api/research/result/${jobId}`,
    RAG_QUERY: '/api/rag/query',
    RAG_INFO: (jobId: string) => `/api/research/${jobId}/rag`,
  },
} as const; 