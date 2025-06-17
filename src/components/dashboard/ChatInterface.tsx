import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Loader, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../../types';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';
import supervityLogomark from '../../assets/supervity-logomark.svg';

interface ChatInterfaceProps {
  jobId: string;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isTyping: boolean;
  isRagReady?: boolean;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  jobId,
  messages,
  onSendMessage,
  isTyping,
  isRagReady = false,
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [lastUserMessage, setLastUserMessage] = useState('');

  const suggestedQuestions = [
    "What are the key findings about market size?",
    "Which competitors are mentioned most frequently?",
    "What are the emerging trends identified?",
    "Can you summarize the regulatory landscape?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Track last user message for editing
  useEffect(() => {
    const userMessages = messages.filter(m => m.type === 'user');
    if (userMessages.length > 0) {
      setLastUserMessage(userMessages[userMessages.length - 1].content);
    }
  }, [messages]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Up arrow to edit last message (only when input is empty and focused)
      if (e.key === 'ArrowUp' && inputValue === '' && document.activeElement === inputRef.current) {
        e.preventDefault();
        if (lastUserMessage) {
          setInputValue(lastUserMessage);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [inputValue, lastUserMessage]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    onSendMessage(inputValue.trim());
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Safe URL creation helper
  const createSafeUrl = (urlString: string): string | null => {
    try {
      // If it looks like a URL, try to create URL object
      if (urlString.startsWith('http://') || urlString.startsWith('https://')) {
        const url = new URL(urlString);
        return url.hostname;
      }
      // If it doesn't start with protocol, assume it's already a hostname or invalid
      return urlString.includes('.') ? urlString : null;
    } catch (error) {
      // If URL creation fails, return null
      return null;
    }
  };

  const initialBotMessage: ChatMessage = {
    id: 'initial-bot-message',
    type: 'assistant',
    content: isRagReady
      ? "Hello! I'm the **Supervity Analyst** 🤖\n\nI've analyzed your research report and ingested all the extracted data. I can help you explore insights, answer questions about the findings, and dive deeper into any aspect of your market intelligence research.\n\nWhat would you like to know?"
      : "Hello! I'm the **Supervity Analyst** 🤖\n\nI'm currently processing your research data and will be ready to answer questions shortly. Please wait while I analyze all the findings and sources.",
    timestamp: new Date(),
  };

  const displayMessages = [initialBotMessage, ...messages];

  return (
    <div className="h-full flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 mb-4">
        {displayMessages.length === 1 ? ( // Only the initial message is present
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-lime-500/20 rounded-2xl flex items-center justify-center mb-6 relative"
            >
              <div className="w-16 h-16 bg-lime-500 rounded-xl flex items-center justify-center">
                <img src={supervityLogomark} alt="Supervity Analyst" className="w-10 h-10" />
              </div>
              {!isRagReady && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 border-2 border-transparent border-t-lime-500 rounded-2xl"
                />
              )}
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Meet the Supervity Analyst</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md leading-relaxed">
              {isRagReady 
                ? "Your AI research assistant is ready! Ask me anything about your market intelligence findings, competitive landscape, or emerging trends."
                : "Setting up your personalized AI analyst... This process analyzes all your research data to provide contextual insights."
              }
            </p>
            {!isRagReady && (
              <div className="mb-6 px-4 py-2 bg-orange-50 border border-orange-200 rounded-lg text-orange-700 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                  <span>Processing research data...</span>
                </div>
              </div>
            )}
            
            <div className="space-y-3 w-full max-w-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Try asking me about
              </p>
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setInputValue(question)}
                  disabled={!isRagReady}
                  className={`w-full text-left p-4 text-sm rounded-xl transition-all border ${
                    isRagReady 
                      ? 'text-foreground bg-white hover:bg-lime-50 hover:border-lime-500/50 hover:shadow-sm' 
                      : 'text-muted-foreground bg-slate-50 border-slate-200 cursor-not-allowed'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-lime-500 rounded-full flex-shrink-0"></div>
                    <span>{question}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {displayMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-start space-x-3 ${
                    message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'user' 
                      ? 'bg-lime-500 text-navy-900' 
                      : 'bg-lime-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <img src={supervityLogomark} alt="Supervity Analyst" className="w-5 h-5" />
                    )}
                  </div>
                  
                  <div className={`flex-1 max-w-lg ${
                    message.type === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block p-4 rounded-xl text-sm text-left ${
                      message.type === 'user'
                        ? 'bg-lime-500 text-white'
                        : 'bg-white border border-slate-200'
                    }`}>
                      {message.type === 'assistant' ? (
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {message.content}
                          </ReactMarkdown>
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      )}
                      
                      {/* Enhanced Citation Rendering */}
                      {message.citations && Array.isArray(message.citations) && message.citations.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-slate-200">
                          <h4 className="text-xs font-semibold text-slate-600 mb-2 flex items-center">
                            <ExternalLink className="w-3 h-3 mr-1" />
                            Sources cited:
                          </h4>
                          <div className="space-y-2">
                            {message.citations.map((citation: any, index: number) => {
                              // Safety checks for citation object
                              if (!citation || typeof citation !== 'object') {
                                return null;
                              }

                              const source = citation.source || citation.url || `Source ${index + 1}`;
                              const documentName = citation.document_name || citation.title;
                              const displayName = documentName || createSafeUrl(source) || 'Document';

                              return (
                                <div key={index} className="flex items-start space-x-2 text-xs">
                                  <div className="flex-shrink-0 w-5 h-5 bg-lime-500/20 text-lime-700 rounded flex items-center justify-center text-[10px] font-medium mt-0.5">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    {source.startsWith('http') ? (
                                      <a 
                                        href={source} 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 hover:underline block truncate font-medium"
                                        title={source}
                                      >
                                        {displayName}
                                      </a>
                                    ) : (
                                      <span className="text-slate-600 block truncate" title={source}>
                                        {displayName}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 px-1">
                      {message.type === 'user' ? 'You' : 'Supervity Analyst'} • {format(message.timestamp, 'HH:mm')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3"
              >
                <div className="flex-shrink-0 w-8 h-8 bg-lime-500 rounded-full flex items-center justify-center">
                  <img src={supervityLogomark} alt="Supervity Analyst" className="w-5 h-5" />
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  </div>
                </div>
              </motion.div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-border pt-4">
        <div className="flex items-end space-x-3">
          <div className="flex-1">
            <TextArea
              ref={inputRef}
              placeholder={isRagReady ? "Ask the Supervity Analyst anything about your research..." : "Please wait for the analyst to be ready..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isRagReady}
              rows={2}
              className="resize-none"
            />
            {isRagReady && (
              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <span>Press Enter to send, Shift+Enter for new line</span>
                {lastUserMessage && (
                  <span>Press ↑ to edit last message</span>
                )}
              </div>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || !isRagReady}
            size="md"
            className="px-4"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};