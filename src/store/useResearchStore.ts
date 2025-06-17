import { create } from 'zustand';
import { QueryFormData, ResearchResult, LoadingStage, transformBackendData } from '../types';
import { ResearchResultResponse, JobStatusResponse } from '../services/researchApi';

interface ResearchState {
  // Current job data
  currentJobId?: string;
  jobData?: ResearchResult;
  jobStatus: 'idle' | 'pending' | 'running' | 'completed' | 'failed';
  
  // Processing state
  loadingStages: LoadingStage[];
  currentStage?: string;
  
  // Form data persistence
  lastQuery?: QueryFormData;
  
  // Actions
  setCurrentJob: (jobId: string) => void;
  updateJobData: (data: ResearchResultResponse) => void;
  updateJobStatus: (statusData: JobStatusResponse) => void;
  updateLoadingStage: (stageId: string, status: LoadingStage['status'], progress?: number) => void;
  resetLoadingStages: () => void;
  clearJob: () => void;
  saveQuery: (query: QueryFormData) => void;
}

const defaultLoadingStages: LoadingStage[] = [
  {
    id: 'planning',
    name: 'Planning Search Queries',
    description: 'Analyzing your request and planning optimal search strategies...',
    status: 'pending',
  },
  {
    id: 'searching',
    name: 'Searching the Web',
    description: 'Scouring relevant sources for the most current information...',
    status: 'pending',
  },
  {
    id: 'synthesizing',
    name: 'Synthesizing Findings',
    description: 'Processing and analyzing collected data for insights...',
    status: 'pending',
  },
  {
    id: 'extracting',
    name: 'Extracting Structured Data',
    description: 'Organizing findings into actionable intelligence formats...',
    status: 'pending',
  },
  {
    id: 'compiling',
    name: 'Compiling Final Report',
    description: 'Generating your comprehensive executive intelligence report...',
    status: 'pending',
  },
];

export const useResearchStore = create<ResearchState>((set, get) => ({
  // Initial state
  jobStatus: 'idle',
  loadingStages: defaultLoadingStages,
  
  // Actions
  setCurrentJob: (jobId) => {
    set({ 
      currentJobId: jobId, 
      jobStatus: 'pending',
      loadingStages: defaultLoadingStages.map(stage => ({ ...stage, status: 'pending' }))
    });
  },
  
  updateJobData: (data) => {
    const transformedData = transformBackendData(data);
    set({ 
      jobData: transformedData, 
      jobStatus: data.status as any,
    });
  },

  updateJobStatus: (statusData: JobStatusResponse) => {
    set({ jobStatus: statusData.status });

    if (statusData.status === 'running' && statusData.stage) {
      const currentStages = get().loadingStages;
      const activeStageIndex = currentStages.findIndex(s => s.id === statusData.stage);

      if (activeStageIndex !== -1) {
        set({
          loadingStages: currentStages.map((stage, index) => {
            if (index < activeStageIndex) {
              return { ...stage, status: 'completed' };
            }
            if (index === activeStageIndex) {
              return { ...stage, status: 'active', progress: statusData.progress };
            }
            return { ...stage, status: 'pending' };
          }),
          currentStage: statusData.stage,
        });
      }
    } else if (statusData.status === 'completed') {
       // Mark all as complete
       set(state => ({
         loadingStages: state.loadingStages.map(s => ({...s, status: 'completed', progress: 100}))
       }));
    }
  },
  
  updateLoadingStage: (stageId, status, progress) => {
    set((state) => ({
      loadingStages: state.loadingStages.map(stage =>
        stage.id === stageId ? { ...stage, status, progress } : stage
      ),
      currentStage: status === 'active' ? stageId : state.currentStage,
    }));
  },

  resetLoadingStages: () => {
    set({ loadingStages: defaultLoadingStages.map(stage => ({ ...stage, status: 'pending' })) });
  },
  
  clearJob: () => {
    set({
      currentJobId: undefined,
      jobData: undefined,
      jobStatus: 'idle',
      loadingStages: defaultLoadingStages,
      currentStage: undefined,
    });
  },
  
  saveQuery: (query) => set({ lastQuery: query }),
}));