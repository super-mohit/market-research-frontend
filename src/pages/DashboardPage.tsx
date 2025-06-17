// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Database, MessageSquare, Loader, AlertTriangle, Brain } from 'lucide-react';
import toast from 'react-hot-toast';

import { Header } from '../components/layout/Header';
import { ReportViewer } from '../components/dashboard/ReportViewer';
import { StructuredDataViewer } from '../components/dashboard/StructuredDataViewer';
import { ChatInterface } from '../components/dashboard/ChatInterface';
import { useJobResult, useRAGInfo } from '../hooks/api/useResearchQueries';
import { useChatStore } from '../store/useChatStore';

const TABS = [
  { id: 'report', label: 'Executive Report', icon: FileText },
  { id: 'data', label: 'Data Explorer', icon: Database },
  { id: 'chat', label: 'AI Analyst Chat', icon: Brain },
];

export const DashboardPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const [activeTab, setActiveTab] = useState('report');
  
  const { data: jobResult, isLoading, isError, error } = useJobResult(jobId);
  const { data: ragInfo, isLoading: isRagLoading } = useRAGInfo(jobId, !isLoading); // Fetch RAG info as soon as job ID is known

  // --- MODIFIED: Removed setRAGCollection from destructuring ---
  const { messagesByJob, setCurrentJobId, sendMessage, isTyping } = useChatStore();

  // This useEffect is now only for setting the current job ID
  useEffect(() => {
    if (jobId) {
      setCurrentJobId(jobId);
    }
  }, [jobId, setCurrentJobId]);

  // --- MODIFIED: This function is now responsible for the logic ---
  const handleSendMessage = (message: string) => {
    if (!jobId) return;

    // Check for RAG info directly before sending
    if (!ragInfo?.can_query || !ragInfo.collection_name) {
      toast.error("AI Analyst is not ready. Please wait a moment and try again.");
      return;
    }
    
    // Call the updated action with all necessary info
    sendMessage(jobId, ragInfo.collection_name, message);
  };

  // --- THIS IS THE BULLETPROOF LOADING/ERROR HANDLING ---
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <Loader className="w-12 h-12 text-lime-400 animate-spin mb-4" />
        <h1 className="text-xl text-foreground">Loading your intelligence report...</h1>
        <p className="text-muted-foreground">This should only take a moment.</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold text-foreground mb-2">Failed to Load Report</h1>
        <p className="text-muted-foreground mb-6 max-w-md">We couldn't retrieve the data for this research job. It may have failed or the ID is incorrect.</p>
        <p className="text-sm text-muted-foreground mb-6">Error: {error?.message || 'Unknown error'}</p>
        <Link to="/" className="px-6 py-3 bg-lime-500 text-navy-900 font-semibold rounded-lg hover:bg-lime-400 transition-colors">
          Start a New Research
        </Link>
      </div>
    );
  }
  // --- END OF BULLETPROOFING ---

  const renderTabContent = () => {
    if (!jobResult) return null;
    
    switch (activeTab) {
      case 'report':
        return <ReportViewer markdown={jobResult.final_report_markdown || ''} />;
      case 'data':
        return <StructuredDataViewer data={jobResult.extracted_data} />;
      case 'chat':
        return (
          // --- MODIFIED: Improved layout for chat interface ---
          <div className="flex justify-center h-full">
            <div className="w-full max-w-4xl h-[calc(100vh-15rem)]">
              <ChatInterface
                jobId={jobId!}
                messages={messagesByJob[jobId!] || []}
                // --- MODIFIED: Pass the updated handler ---
                onSendMessage={handleSendMessage}
                isTyping={isTyping}
                isRagReady={ragInfo?.can_query}
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
      <Header title="Research Dashboard" />
      
      <main className="flex-1 max-w-screen-xl w-full mx-auto px-6 py-8 flex flex-col">
        {/* --- MODIFIED: Center the tab navigation --- */}
        <div className="flex justify-center border-b border-border mb-8">
          <div className="flex items-center space-x-2">
            {TABS.map(tab => {
            const isChatDisabled = tab.id === 'chat' && !ragInfo?.can_query;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                disabled={isChatDisabled}
                className={`flex items-center space-x-2 px-4 py-3 text-base font-medium border-b-2 transition-all duration-200
                  ${activeTab === tab.id ? 'border-primary text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'}
                  ${isChatDisabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
                {tab.id === 'chat' && isRagLoading && !ragInfo && <Loader className="w-4 h-4 ml-2 animate-spin" />}
              </button>
                          )
            })}
          </div>
        </div>
        
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