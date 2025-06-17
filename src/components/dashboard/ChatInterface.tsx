import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader } from 'lucide-react';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../../types';
import { Button } from '../ui/Button';
import { TextArea } from '../ui/TextArea';

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

  const suggestedQuestions = [
    "What are the key findings about market size?",
    "Which competitors are mentioned most frequently?",
    "What are the emerging trends identified?",
    "Can you summarize the regulatory landscape?",
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      ? "I have analyzed the research report and all extracted data. How can I help you?"
      : "I am currently being initialized with the research data. I'll be ready to answer your questions shortly.",
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
              className="w-16 h-16 bg-lime-500/20 rounded-full flex items-center justify-center mb-4"
            >
              <Bot className="w-8 h-8 text-lime-400" />
            </motion.div>
            <h3 className="text-foreground font-medium mb-2">Chat with your Research</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              {isRagReady 
                ? "Ask questions about your research findings and get instant insights."
                : "Setting up chat capabilities... This will be ready shortly."
              }
            </p>
            {!isRagReady && (
              <div className="mb-4 text-orange-400 text-xs">
                RAG system is initializing. Chat will be available once ready.
              </div>
            )}
            
            <div className="space-y-2 w-full">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Suggested Questions
              </p>
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setInputValue(question)}
                  className="w-full text-left p-3 text-sm text-muted-foreground bg-muted hover:bg-slate-200 rounded-lg transition-colors border hover:border-lime-500/30"
                >
                  {question}
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
                      : 'bg-blue-soft/20 text-blue-soft'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  
                  <div className={`flex-1 max-w-lg ${
                    message.type === 'user' ? 'text-right' : ''
                  }`}>
                    <div className={`inline-block p-3 rounded-lg text-sm text-left ${
                      message.type === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground'
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
                      
                      {/* Safe Citation Rendering */}
                      {message.citations && Array.isArray(message.citations) && message.citations.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-white/20">
                          <h4 className="text-xs font-bold mb-1">Sources:</h4>
                          <ul className="space-y-1 text-xs">
                            {message.citations.map((citation: any, index: number) => {
                              // Safety checks for citation object
                              if (!citation || typeof citation !== 'object') {
                                return null;
                              }

                              const source = citation.source || citation.url || `Source ${index + 1}`;
                              const documentName = citation.document_name || citation.title;
                              const displayName = documentName || createSafeUrl(source) || 'Document';

                              return (
                                <li key={index} className="flex items-center space-x-2">
                                  <span className="flex-shrink-0 w-4 h-4 bg-lime-500/20 text-lime-400 rounded-full flex items-center justify-center text-[10px]">
                                    {index + 1}
                                  </span>
                                  {source.startsWith('http') ? (
                                    <a 
                                      href={source} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="truncate hover:underline"
                                      title={source}
                                    >
                                      {displayName}
                                    </a>
                                  ) : (
                                    <span className="truncate" title={source}>
                                      {displayName}
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {format(message.timestamp, 'HH:mm')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start space-x-3"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-blue-soft/20 text-blue-soft">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="inline-block p-3 rounded-lg bg-muted">
                    <div className="flex space-x-1">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                        className="w-2 h-2 bg-gray-400 rounded-full"
                      />
                    </div>
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
        <div className="flex space-x-3">
          <div className="flex-1">
            <TextArea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isRagReady ? "Ask a question about your research..." : "Chat will be available once RAG is ready..."}
              rows={2}
              className="resize-none"
              disabled={!isRagReady}
            />
          </div>
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || isTyping || !isRagReady}
            variant="primary"
            size="md"
            className="self-end"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};