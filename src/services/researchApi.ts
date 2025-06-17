import apiClient from './api';
import { API_CONFIG } from '../config/api';
import { QueryFormData } from '../types';

// API Types matching your backend
export interface ResearchRequest {
  query: string;
  upload_to_rag?: boolean;
}

export interface JobSubmissionResponse {
  job_id: string;
  status: string;
  status_url: string;
  result_url: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message: string;
  stage?: string;
  progress?: number;
  logs?: string[]; // <-- ADD THIS
}

export interface ResearchResultResponse {
  job_id: string;
  status: string;
  original_query: string;
  final_report_markdown: string;
  extracted_data: {
    News: Array<{
      type: string;
      title: string;
      summary: string;
      date: string;
      source_url: string;
    }>;
    Patents: Array<{
      type: string;
      title: string;
      summary: string;
      date: string;
      source_url: string;
    }>;
    Conference: Array<{
      type: string;
      title: string;
      summary: string;
      date: string;
      source_url: string;
    }>;
    Legalnews: Array<{
      type: string;
      title: string;
      summary: string;
      date: string;
      source_url: string;
    }>;
    Other: Array<{
      type: string;
      title: string;
      summary: string;
      date: string;
      source_url: string;
    }>;
  };
  metadata: Record<string, any>;
}

export interface RAGQueryRequest {
  collection_name: string;
  question: string;
}

export interface RAGQueryResponse {
  collection_name: string;
  question: string;
  answer: any;
}

export interface RAGCollectionInfo {
  job_id: string;
  rag_status: string;
  collection_name?: string;
  rag_error?: string;
  can_query: boolean;
}

// API Functions
export const researchApi = {
  // Submit research job
  async submitResearch(data: QueryFormData): Promise<JobSubmissionResponse> {
    const requestData: ResearchRequest = {
      query: [
        data.query,
        data.searchTags.length > 0 ? `\n\nSearch tags/topics: ${data.searchTags.join(', ')}` : '',
        data.trustedSources.length > 0 ? `\nDatasources/URLs: ${data.trustedSources.join(', ')}` : '',
      ].filter(Boolean).join(''),
      upload_to_rag: data.uploadToRag,
    };

    const response = await apiClient.post<JobSubmissionResponse>(
      API_CONFIG.ENDPOINTS.RESEARCH,
      requestData
    );
    return response.data;
  },

  // Get job status
  async getJobStatus(jobId: string): Promise<JobStatusResponse> {
    const response = await apiClient.get<JobStatusResponse>(
      API_CONFIG.ENDPOINTS.RESEARCH_STATUS(jobId)
    );
    return response.data;
  },

  // Get job results
  async getJobResult(jobId: string): Promise<ResearchResultResponse> {
    const response = await apiClient.get<ResearchResultResponse>(
      API_CONFIG.ENDPOINTS.RESEARCH_RESULT(jobId)
    );
    return response.data;
  },

  // Query RAG
  async queryRAG(request: RAGQueryRequest): Promise<RAGQueryResponse> {
    const response = await apiClient.post<RAGQueryResponse>(
      API_CONFIG.ENDPOINTS.RAG_QUERY,
      request
    );
    return response.data;
  },

  // Get RAG info
  async getRAGInfo(jobId: string): Promise<RAGCollectionInfo> {
    const response = await apiClient.get<RAGCollectionInfo>(
      API_CONFIG.ENDPOINTS.RAG_INFO(jobId)
    );
    return response.data;
  },

  // +++ NEW: Get Job History +++
  async getJobHistory(): Promise<{ jobs: Array<{ id: string; original_query: string; status: string; created_at: string }> }> {
    const response = await apiClient.get(
      '/api/research/history' // No params needed, user is identified by token
    );
    return response.data;
  },
}; 