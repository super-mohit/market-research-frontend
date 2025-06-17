import { create } from 'zustand';
import { ChatMessage } from '../types';
import { researchApi } from '../services/researchApi';

interface ChatState {
  messagesByJob: Record<string, ChatMessage[]>;
  currentJobId?: string;
  isTyping: boolean;
  addMessage: (jobId: string, message: Omit<ChatMessage, 'id'>) => void;
  sendMessage: (jobId: string, collectionName: string, message: string) => Promise<void>;
  setTyping: (isTyping: boolean) => void;
  setCurrentJobId: (jobId: string) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messagesByJob: {},
  isTyping: false,
  
  // Actions
  addMessage: (jobId, messageData) => {
    const message: ChatMessage = {
      ...messageData,
      id: `${Date.now()}-${Math.random()}`,
    };
    
    set((state) => ({
      messagesByJob: {
        ...state.messagesByJob,
        [jobId]: [...(state.messagesByJob[jobId] || []), message],
      },
    }));
  },

  sendMessage: async (jobId, collectionName, messageContent) => {
    get().addMessage(jobId, {
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
    });

    set({ isTyping: true });

    try {
      console.log('Sending RAG query:', { collection_name: collectionName, question: messageContent });
      
      const response = await researchApi.queryRAG({
        collection_name: collectionName,
        question: messageContent,
      });

      console.log('RAG response received:', response);

      // Handle both wrapped (backend) and unwrapped (direct RAG API) response formats
      let answerText: string;
      let citations: any[] = [];

      if (response.answer) {
        // Backend wrapped format: { collection_name, question, answer: { response, citations, ... } }
        answerText = response.answer.response || response.answer;
        citations = response.answer.citations || [];
      } else if (response.response) {
        // Direct RAG API format: { response, skill_recommended, chat_context, ... }
        answerText = response.response;
        citations = response.citations || [];
      } else {
        // Fallback for unexpected formats
        answerText = typeof response === 'string' ? response : JSON.stringify(response);
        citations = [];
      }

      if (!answerText || answerText.trim() === '') {
        answerText = "I could not find a specific answer in the provided documents.";
      }

      // Safely process citations
      const safeCitations = citations.map((citation, index) => {
        try {
          // Ensure citation has required properties
          if (typeof citation === 'object' && citation !== null) {
            return {
              source: citation.source || citation.url || `#${index + 1}`,
              document_name: citation.document_name || citation.title || 'Document',
              ...citation
            };
          }
          return {
            source: `#${index + 1}`,
            document_name: 'Document',
          };
        } catch (error) {
          console.warn('Error processing citation:', citation, error);
          return {
            source: `#${index + 1}`,
            document_name: 'Document',
          };
        }
      });

      get().addMessage(jobId, {
        type: 'assistant',
        content: answerText,
        timestamp: new Date(),
        citations: safeCitations,
      });

    } catch (error) {
      console.error('RAG query failed:', error);
      
      // Log more detailed error information
      if (error?.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      }
      
      const errorMessage = error?.response?.data?.detail || 
                          error?.message || 
                          'Unknown error occurred';
      
      get().addMessage(jobId, {
        type: 'assistant',
        content: `Sorry, I encountered an error while processing your request: ${errorMessage}. Please try again.`,
        timestamp: new Date(),
      });
    } finally {
      set({ isTyping: false });
    }
  },
  
  setTyping: (isTyping) => set({ isTyping }),
  
  setCurrentJobId: (jobId) => set({ currentJobId: jobId }),
}));