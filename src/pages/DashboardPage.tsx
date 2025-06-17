// src/pages/DashboardPage.tsx
import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Database, Brain, Loader, AlertTriangle, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { ReportViewer } from '../components/dashboard/ReportViewer';
import { StructuredDataViewer } from '../components/dashboard/StructuredDataViewer';
import { ChatInterface } from '../components/dashboard/ChatInterface';
import { useJobResult, QUERY_KEYS } from '../hooks/api/useResearchQueries';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import { researchApi, ResearchResultResponse } from '../services/researchApi'; // Import API service and type
import { Skeleton, SkeletonReportViewer } from '../components/ui/Skeleton';
import { PageTitle, SectionTitle, CardTitle, BodyText, CaptionText } from '../components/ui/Typography';

const TABS = [
  { id: 'report', label: 'Executive Report', icon: FileText },
  { id: 'data', label: 'Data Explorer', icon: Database },
  { id: 'chat', label: 'Ask The Agent', icon: Brain },
];

export const DashboardPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  
  if (!jobId) {
      return <div className="text-center p-8">Invalid Job ID.</div>;
  }

  const [activeTab, setActiveTab] = React.useState('report');
  const queryClient = useQueryClient();
  
  const { 
    data: jobResult, 
    isLoading, 
    isError, 
  } = useJobResult(jobId, true); // Always enable the query
  
  const { messagesByJob, setCurrentJobId, sendMessage, isTyping } = useChatStore();
  
  // --- DERIVED STATE ---
  // No more local useState for ragStatus/canQuery. Derive directly from the query data.
  const ragInfo = jobResult?.metadata?.ragInfo;
  const ragStatus = ragInfo?.rag_status || 'checking';
  const canQuery = ragInfo?.can_query === true;
  const isChatDisabled = !ragInfo?.upload_requested || !canQuery;

  useEffect(() => {
    setCurrentJobId(jobId);
  }, [jobId, setCurrentJobId]);

  // Add logout handler
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // --- CORRECTED POLLING LOGIC ---
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;

    // The function that performs a single poll
    const pollForRagUpdate = async () => {
      if (!jobId) return;
      
      try {
        // Use the dedicated, correct API service call
        const ragInfoUpdate = await researchApi.getRAGInfo(jobId);
        
        // Update the main React Query cache. This will cause the component to re-render with new data.
        queryClient.setQueryData(
          QUERY_KEYS.RESEARCH_RESULT(jobId),
          (oldData: ResearchResultResponse | undefined) => {
            if (!oldData || oldData.metadata?.ragInfo?.rag_status === ragInfoUpdate.rag_status) {
              return oldData; // No change, prevent unnecessary re-renders
            }
            console.log(`✅ RAG status updated to: ${ragInfoUpdate.rag_status}. Updating cache.`);
            return {
              ...oldData,
              metadata: {
                ...oldData.metadata,
                ragInfo: { // Merge new RAG info into the existing metadata
                  ...oldData.metadata.ragInfo,
                  rag_status: ragInfoUpdate.rag_status,
                  collection_name: ragInfoUpdate.collection_name,
                  can_query: ragInfoUpdate.can_query,
                  rag_error: ragInfoUpdate.rag_error,
                },
              },
            };
          }
        );

        // If the RAG process is finished, stop polling
        if (ragInfoUpdate.rag_status === 'uploaded' || ragInfoUpdate.rag_status === 'failed') {
          if (intervalId) clearInterval(intervalId);
          if (ragInfoUpdate.rag_status === 'uploaded') {
            toast.success('AI Analyst is now ready!');
          } else {
            toast.error(`AI Analyst setup failed: ${ragInfoUpdate.rag_error || 'Unknown error'}`);
          }
        }
      } catch (error) {
        console.error('Error polling for RAG updates:', error);
        if (intervalId) clearInterval(intervalId); // Stop polling on error
      }
    };

    // Start polling only if the RAG status is pending
    if (jobId && ragStatus === 'pending_upload') {
      console.log('RAG upload is pending, initiating polling...');
      intervalId = setInterval(pollForRagUpdate, 5000);
    }

    // Cleanup function to clear the interval when the component unmounts or dependencies change
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [jobId, ragStatus, queryClient]); // Dependencies ensure this effect runs when needed


  const handleSendMessage = (message: string) => {
    const collectionName = jobResult?.metadata?.ragInfo?.collection_name;
    if (!collectionName || !canQuery) {
      toast.error("AI Analyst is not ready yet. Please wait for the knowledge base to finish uploading.");
      return;
    }
    sendMessage(jobId, collectionName, message);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header title="Research Dashboard">
          <div className="flex items-center space-x-2">
            <Skeleton variant="button" className="w-24 h-8" />
            <Skeleton variant="button" className="w-16 h-8" />
          </div>
        </Header>

        <main className="flex-1 max-w-7xl mx-auto px-6 py-8 w-full">
          {/* Header skeleton */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton variant="title" className="w-80 h-8" />
              <Skeleton variant="text" className="w-96" />
            </div>
            <Skeleton variant="circle" className="w-12 h-12" />
          </div>

          {/* Tab navigation skeleton */}
          <div className="border-b border-border mb-8">
            <nav className="flex space-x-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center space-x-2 pb-4">
                  <Skeleton variant="circle" className="w-5 h-5" />
                  <Skeleton variant="text" className="w-24" />
                </div>
              ))}
            </nav>
          </div>

          {/* Content skeleton */}
          <SkeletonReportViewer />
        </main>
      </div>
    );
  }

  if (isError || !jobResult) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <SectionTitle className="mb-2">Failed to Load Report</SectionTitle>
        <BodyText color="secondary" className="mb-6 max-w-md">
          We couldn't retrieve data for this job. It may have failed or the ID is incorrect.
        </BodyText>
        <Link to="/" className="px-6 py-3 bg-lime-500 text-navy-900 font-semibold rounded-lg hover:bg-lime-400 transition-colors">
          Start a New Research
        </Link>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'report':
        return <ReportViewer markdown={jobResult.final_report_markdown || ''} />;
      case 'data':
        return <StructuredDataViewer data={jobResult.extracted_data} />;
      case 'chat':
        return (
          <div className="flex justify-center h-full">
            <div className="w-full max-w-4xl h-[calc(100vh-15rem)]">
              <ChatInterface
                jobId={jobId}
                messages={messagesByJob[jobId] || []}
                onSendMessage={handleSendMessage}
                isTyping={isTyping}
                isRagReady={canQuery}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header title="Research Dashboard">
        <div className="flex items-center space-x-2">
          <Link to="/new-research">
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              New Report
            </Button>
          </Link>
          <Button onClick={handleLogout} variant="ghost" size="sm">
            Logout
          </Button>
        </div>
      </Header>
      
      <main className="flex-1 max-w-screen-xl w-full mx-auto px-6 py-8 flex flex-col">
        {/* Page Header */}
        <div className="mb-8">
          <PageTitle className="mb-2">
            Market Intelligence Report
          </PageTitle>
          <BodyText color="secondary">
            Research findings for: "{jobResult.original_query}"
          </BodyText>
        </div>

        <div className="flex justify-center border-b border-border mb-8">
          <div className="flex items-center space-x-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={tab.id === 'chat' && isChatDisabled}
                className={`flex items-center space-x-2 px-4 py-3 text-base font-medium border-b-2 transition-all duration-200 rounded-t-lg ${
                  activeTab === tab.id 
                    ? 'border-lime-500 text-foreground bg-lime-500/10' 
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-slate-100/50'
                } ${tab.id === 'chat' && isChatDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.id === 'chat' && isChatDisabled && (
                  <CaptionText color="secondary" className="ml-2">(Disabled)</CaptionText>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {activeTab === 'chat' && ragInfo?.upload_requested && !canQuery && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-center">
            <BodyText color="warning">
              {ragStatus === 'pending_upload' 
                ? 'Setting up AI Analyst (this may take a few minutes)...'
                : 'AI Analyst is not available for this report.'}
            </BodyText>
          </div>
        )}
        
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};