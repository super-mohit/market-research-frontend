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
      ? "I have analyzed the research report and am ready to assist. How can I help you explore the findings?"
      : "I'm currently processing all research data and sources. I'll be ready to answer questions shortly.",
    timestamp: new Date(),
  };

  const displayMessages = messages.length > 0 ? messages : [initialBotMessage];

  return (
    <div className="h-full flex flex-col p-6">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin pr-2 mb-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center text-center py-8 min-h-full justify-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-20 h-20 bg-lime-500/10 rounded-2xl flex items-center justify-center mb-6"
            >
              <div className="w-16 h-16 bg-lime-500/20 rounded-xl flex items-center justify-center">
                <img src={supervityLogomark} alt="Supervity Analyst" className="w-10 h-10" />
              </div>
            </motion.div>
            <h3 className="text-xl font-semibold text-foreground mb-2">Chat with the Intelligence Agent</h3>
            <p className="text-muted-foreground text-sm mb-8 max-w-md leading-relaxed">
              {isRagReady 
                ? "I've analyzed the report. Ask me any follow-up questions about your market intelligence findings."
                : "Setting up your personalized Agent... This may take a moment."
              }
            </p>
            
            <div className="space-y-3 w-full max-w-lg">
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium">
                Try asking something like...
              </p>
              {suggestedQuestions.map((question, index) => (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => setInputValue(question)}
                  disabled={!isRagReady}
                  className="w-full text-left p-4 text-sm rounded-xl transition-all border bg-white hover:bg-lime-50 hover:border-lime-500/50 hover:shadow-sm disabled:text-muted-foreground disabled:bg-slate-50 disabled:border-slate-200 disabled:cursor-not-allowed"
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
          <div className="space-y-6">
            <AnimatePresence>
              {displayMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
                >
                  <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    message.type === 'user' ? 'bg-navy-900' : 'bg-lime-500'
                  }`}>
                    {message.type === 'user' ? (
                      <User className="w-5 h-5 text-white" />
                    ) : (
                      <img src={supervityLogomark} alt="Supervity Analyst" className="w-6 h-6" />
                    )}
                  </div>
                  
                  <div className={`flex-1 max-w-2xl ${message.type === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-2xl text-base text-left shadow-sm ${
                      message.type === 'user' ? 'bg-lime-500 text-white rounded-br-lg' : 'bg-white border border-slate-200 rounded-bl-lg'
                    }`}>
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          // Custom link rendering with citations
                          a: ({ href, children, ...props }) => {
                            if (href?.startsWith('#citation-')) {
                              const citationNumber = href.replace('#citation-', '');
                              return (
                                <sup className="text-xs bg-lime-100 text-lime-700 px-1 rounded cursor-help ml-1">
                                  {citationNumber}
                                </sup>
                              );
                            }
                            
                            const safeDomain = createSafeUrl(href || '');
                            return (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 underline inline-flex items-center"
                                {...props}
                              >
                                {children}
                                {safeDomain && (
                                  <>
                                    <ExternalLink className="w-3 h-3 ml-1" />
                                    <span className="text-xs ml-1 text-muted-foreground">
                                      ({safeDomain})
                                    </span>
                                  </>
                                )}
                              </a>
                            );
                          },
                          // Better formatting for other elements
                          p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                          ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                          ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                          em: ({ children }) => <em className="italic">{children}</em>,
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 px-1">
                      {message.type === 'user' ? 'You' : 'Supervity Analyst'} • {format(message.timestamp, 'HH:mm')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Typing Indicator */}
            <AnimatePresence>
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-start space-x-3"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-lime-500 flex items-center justify-center">
                    <img src={supervityLogomark} alt="Supervity Analyst" className="w-6 h-6" />
                  </div>
                  <div className="flex-1 max-w-2xl">
                    <div className="inline-block p-4 rounded-2xl bg-white border border-slate-200 rounded-bl-lg shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 pt-6 mt-auto">
        <div className="relative">
          <TextArea
            ref={inputRef}
            placeholder={isRagReady ? "Ask a follow-up question..." : "Analyst is preparing..."}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!isRagReady}
            rows={1}
            className="resize-none pr-14 py-3"
          />
          <Button
            onClick={handleSend}
            disabled={!inputValue.trim() || !isRagReady}
            size="sm"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 px-3 py-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {isRagReady && (
          <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
            <span>Shift+Enter for new line</span>
            {lastUserMessage && <span>↑ to edit last message</span>}
          </div>
        )}
      </div>
    </div>
  );
};