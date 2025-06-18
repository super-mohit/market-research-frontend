import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { DownloadCloud, Copy, ExternalLink, Mail, FileDown } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SkeletonReportViewer } from '../ui/Skeleton';
import { SectionTitle, Label } from '../ui/Typography';
import { Modal } from '../ui/Modal';
import { researchApi } from '../../services/researchApi';

interface ReportViewerProps {
  markdown: string;
  isLoading?: boolean;
  onCiteClick?: (url: string) => void;
  jobId: string;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  markdown,
  isLoading = false,
  onCiteClick,
  jobId,
}) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);

  // Extract headings for table of contents
  const headings = useMemo(() => {
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
      toast.success('Report copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy report.');
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadClick = () => {
    setIsModalOpen(true);
  };

  const handleActualDownload = async () => {
    // Show an initial "preparing" toast
    const toastId = toast.loading('Preparing your PDF for download...');
    setIsDownloading(true);
    try {
      const response = await researchApi.downloadPdf(jobId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `Supervity_Report_${jobId.substring(0, 8)}.pdf`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      
      // Update the toast to success
      toast.success('Download starting!', { id: toastId });
    } catch (err) {
      // Update the toast to an error
      toast.error('Failed to download PDF.', { id: toastId });
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
      setIsModalOpen(false);
    }
  };

  const handleEmailReport = async () => {
    // Show an initial "sending" toast
    const toastId = toast.loading('Sending report to your email...');
    setIsEmailing(true);
    try {
      await researchApi.emailReport(jobId);
      // Update the toast to a success message
      toast.success('Your report is on its way! Please check your inbox shortly.', { id: toastId });
    } catch (err) {
      // Update the toast to an error
      toast.error('Failed to send email. Please try again.', { id: toastId });
      console.error('Email error:', err);
    } finally {
      setIsEmailing(false);
      setIsModalOpen(false);
    }
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
    return <SkeletonReportViewer />;
  }

  return (
    <>
      <div className="space-y-6">
        {/* Action Bar */}
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <SectionTitle>Executive Report</SectionTitle>
              <div className="h-2 w-32 bg-slate-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-lime-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${readingProgress}%` }}
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={handleCopy}
                title="Copy to clipboard"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={handleDownloadClick}
                title="Download or Email Report"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors"
              >
                <DownloadCloud className="w-4 h-4" />
              </button>
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
                  <Label className="mb-3 pl-3">ON THIS PAGE</Label>
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

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Export Report">
        <div className="space-y-4">
          <p className="text-muted-foreground">Choose your preferred method to receive the report.</p>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left" 
            onClick={handleActualDownload}
            isLoading={isDownloading}
            disabled={isEmailing}
          >
            <FileDown className="w-5 h-5 mr-3" />
            <div>
              <p className="font-semibold">Download as PDF</p>
              <p className="text-xs text-muted-foreground">Save the formatted report directly to your device.</p>
            </div>
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start text-left" 
            onClick={handleEmailReport}
            isLoading={isEmailing}
            disabled={isDownloading}
          >
            <Mail className="w-5 h-5 mr-3" />
            <div>
              <p className="font-semibold">Get via Email</p>
              <p className="text-xs text-muted-foreground">Send a link to the PDF to your registered email.</p>
            </div>
          </Button>
        </div>
      </Modal>
    </>
  );
};