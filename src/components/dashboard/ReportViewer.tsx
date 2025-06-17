import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, ExternalLink } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface ReportViewerProps {
  markdown: string;
  isLoading?: boolean;
  onCiteClick?: (url: string) => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  markdown,
  isLoading = false,
  onCiteClick,
}) => {
  const [readingProgress, setReadingProgress] = useState(0);

  // Extract headings for table of contents
  const headings = React.useMemo(() => {
    const headingRegex = /^(#{1,3})\s+(.+)$/gm;
    const matches = [];
    let match;
    
    while ((match = headingRegex.exec(markdown)) !== null) {
      matches.push({
        level: match[1].length,
        text: match[2],
        id: match[2].toLowerCase().replace(/[^a-z0-9]/g, '-'),
      });
    }
    
    return matches;
  }, [markdown]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(markdown);
      // Could add toast notification here
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `research-report-${new Date().toISOString().split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Function to handle Table of Contents navigation
  const handleTocClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className={`h-4 bg-gray-700 rounded ${
              i === 0 ? 'w-3/4' : i === 1 ? 'w-full' : i === 2 ? 'w-5/6' : 'w-4/5'
            }`} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h2 className="text-lg font-semibold text-foreground">Executive Report</h2>
            <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-lime-500"
                initial={{ width: 0 }}
                animate={{ width: `${readingProgress}%` }}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Report Content - Now on the left for primary focus */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={headings.length > 0 ? "lg:col-span-8" : "lg:col-span-12"}
        >
          <div className="card p-8">
            <div className="markdown-content">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children, ...props }) => (
                    <h1 id={String(children).toLowerCase().replace(/[^a-z0-9]/g, '-')} {...props}>
                      {children}
                    </h1>
                  ),
                  h2: ({ children, ...props }) => (
                    <h2 id={String(children).toLowerCase().replace(/[^a-z0-9]/g, '-')} {...props}>
                      {children}
                    </h2>
                  ),
                  h3: ({ children, ...props }) => (
                    <h3 id={String(children).toLowerCase().replace(/[^a-z0-9]/g, '-')} {...props}>
                      {children}
                    </h3>
                  ),
                  a: ({ href, children, ...props }) => (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lime-600 hover:text-lime-500 hover:underline inline-flex items-center"
                      onClick={(e) => {
                        if (onCiteClick && href) {
                          e.preventDefault();
                          onCiteClick(href);
                        }
                      }}
                      {...props}
                    >
                      {children}
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  ),
                }}
              >
                {markdown}
              </ReactMarkdown>
            </div>
          </div>
        </motion.div>

        {/* Table of Contents - On the right */}
        {headings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <div className="sticky top-24">
                <h3 className="font-semibold text-foreground text-base mb-3 pl-3">ON THIS PAGE</h3>
                <nav className="border-l-2 border-slate-200">
                  {headings.map((heading) => (
                    <a
                      key={heading.id}
                      href={`#${heading.id}`}
                      onClick={(e) => handleTocClick(e, heading.id)}
                      className={`block py-1.5 text-sm hover:text-primary hover:border-primary transition-colors duration-200 border-l-2 -ml-px
                        ${
                          heading.level === 1 
                            ? 'font-medium text-muted-foreground pl-4 border-transparent' 
                            : 'text-slate-500 pl-8 border-transparent'
                        }
                      `}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};