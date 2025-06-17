export interface QueryFormData {
  query: string;
  searchTags: string[];
  trustedSources: string[];
  uploadToRag: boolean;
}

export interface LoadingStage {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'error';
  progress?: number;
}

export interface NewsItem {
  type: 'News' | 'Legalnews';
  title: string;
  summary: string;
  date: string;
  source_url: string;
}

export interface PatentItem {
  type: 'Patents';
  title: string;
  summary: string;
  date: string;
  source_url: string;
}

export interface ConferenceItem {
  type: 'Conference';
  title: string;
  summary: string;
  date: string;
  source_url: string;
}

export type StructuredDataItem = NewsItem | PatentItem | ConferenceItem;

export interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  citations?: any[]; // Allow for citations from RAG
}

export interface ResearchResult {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  originalQuery: string;
  finalReportMarkdown: string; // Renamed from executive_report
  extractedData: { // This is the raw backend format
    News: any[];
    Patents: any[];
    Conference: any[];
    Legalnews: any[];
    Other: any[];
  };
  structuredData?: StructuredDataItem[]; // This is the flattened data for the UI
  metadata: {
    timestamp: string;
    urlsProcessed: number;
    totalItemsExtracted: number;
    extractionSummary: Record<string, number>;
    ragInfo?: {
      uploadRequested: boolean;
      ragStatus: string;
      collectionName: string;
      ragError?: string;
    };
  };
}

export interface JobSubmissionResponse {
    jobId: string;
    status: string;
    statusUrl: string;
    resultUrl: string;
}

export interface JobStatusResponse {
  jobId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  message: string;
  // --- NEW: Add these fields ---
  stage?: string;
  progress?: number;
}

export interface RAGQueryResponse {
  response: string;
  citations?: any[];
}

export interface RAGQueryRequest {
  job_id: string;
  query: string;
  collection_name?: string;
}

export interface RAGCollectionInfo {
  collection_name: string;
  can_query: boolean;
  document_count: number;
}

export interface BackendStructuredDataItem {
  type: 'News' | 'Patents' | 'Conference' | 'Legalnews' | 'Other';
  title: string;
  summary: string;
  date: string;
  source_url: string;
}

export interface BackendResearchResult {
  job_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  original_query: string;
  final_report_markdown: string;
  extracted_data: {
    News: BackendStructuredDataItem[];
    Patents: BackendStructuredDataItem[];
    Conference: BackendStructuredDataItem[];
    Legalnews: BackendStructuredDataItem[];
    Other: BackendStructuredDataItem[];
  };
  metadata: Record<string, any>;
}

export const transformBackendData = (backendData: BackendResearchResult): ResearchResult => {
  const allStructuredData: StructuredDataItem[] = [
    ...backendData.extracted_data.News,
    ...backendData.extracted_data.Patents,
    ...backendData.extracted_data.Conference,
    ...backendData.extracted_data.Legalnews,
    ...backendData.extracted_data.Other,
  ];

  return {
    jobId: backendData.job_id,
    status: backendData.status,
    originalQuery: backendData.original_query,
    finalReportMarkdown: backendData.final_report_markdown,
    extractedData: backendData.extracted_data,
    structuredData: allStructuredData,
    metadata: {
      timestamp: backendData.metadata?.timestamp || new Date().toISOString(),
      urlsProcessed: backendData.metadata?.urlsProcessed || 0,
      totalItemsExtracted: allStructuredData.length,
      extractionSummary: {
        News: backendData.extracted_data.News.length,
        Patents: backendData.extracted_data.Patents.length,
        Conference: backendData.extracted_data.Conference.length,
        Legalnews: backendData.extracted_data.Legalnews.length,
        Other: backendData.extracted_data.Other.length,
      },
      ragInfo: backendData.metadata?.ragInfo,
    },
  };
};