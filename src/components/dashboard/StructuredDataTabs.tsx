import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, FileText, Calendar, MessageSquare, ChevronDown } from 'lucide-react';
import { StructuredDataItem, ChatMessage } from '../../types';
import { DataCard } from './DataCard';
import { ChatInterface } from './ChatInterface';
import { Badge } from '../ui/Badge';

interface StructuredDataTabsProps {
  data: StructuredDataItem[];
  jobId: string;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  isRagReady: boolean; // <-- NEW PROP
}

type TabType = 'news' | 'patents' | 'conferences' | 'chat';

const tabs = [
  { id: 'news' as TabType, label: 'News & Legal', icon: Newspaper },
  { id: 'patents' as TabType, label: 'Patents', icon: FileText },
  { id: 'conferences' as TabType, label: 'Conferences', icon: Calendar },
  { id: 'chat' as TabType, label: 'Chat', icon: MessageSquare },
];

export const StructuredDataTabs: React.FC<StructuredDataTabsProps> = ({
  data,
  jobId,
  messages,
  onSendMessage,
  isTyping,
  isRagReady, // <-- DESTRUCTURE NEW PROP
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('news');
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Switch away from chat tab if RAG becomes unavailable
  React.useEffect(() => {
    if (activeTab === 'chat' && !isRagReady) {
      setActiveTab('news');
    }
  }, [activeTab, isRagReady]);

  // Filter data by type
  const newsData = data.filter(item => item.type === 'News' || item.type === 'Legalnews');
  const patentData = data.filter(item => item.type === 'Patents');
  const conferenceData = data.filter(item => item.type === 'Conference');

  const getTabCount = (tabId: TabType) => {
    switch (tabId) {
      case 'news': return newsData.length;
      case 'patents': return patentData.length;
      case 'conferences': return conferenceData.length;
      case 'chat': return messages.length;
      default: return 0;
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'news':
        return (
          <div className="space-y-4">
            {newsData.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Newspaper className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No news items found</p>
              </div>
            ) : (
              newsData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DataCard item={item} />
                </motion.div>
              ))
            )}
          </div>
        );

      case 'patents':
        return (
          <div className="space-y-4">
            {patentData.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No patents found</p>
              </div>
            ) : (
              patentData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DataCard item={item} />
                </motion.div>
              ))
            )}
          </div>
        );

      case 'conferences':
        return (
          <div className="space-y-4">
            {conferenceData.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>No conferences found</p>
              </div>
            ) : (
              conferenceData.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <DataCard item={item} />
                </motion.div>
              ))
            )}
          </div>
        );

      case 'chat':
        return (
          <ChatInterface
            jobId={jobId}
            messages={messages}
            onSendMessage={onSendMessage}
            isTyping={isTyping}
            isRagReady={isRagReady}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Tab Headers */}
      <div className="border-b border-white/10 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Research Data</h2>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-white/10 rounded transition-colors"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </motion.div>
          </button>
        </div>

        {!isCollapsed && (
          <div className="flex space-x-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const count = getTabCount(tab.id);
              const isChatTab = tab.id === 'chat';
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  // --- MODIFIED: Add disabled state for chat tab ---
                  disabled={isChatTab && !isRagReady}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-lime-500/20 text-lime-400 border border-lime-500/30'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  } disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {count > 0 && (
                    <Badge variant={activeTab === tab.id ? 'success' : 'default'} size="sm">
                      {count}
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tab Content */}
      {!isCollapsed && (
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-hidden"
        >
          <div className="h-full overflow-y-auto scrollbar-thin pr-2">
            {renderTabContent()}
          </div>
        </motion.div>
      )}
    </div>
  );
};