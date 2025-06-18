import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { researchApi } from '../services/researchApi';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { 
  Plus, 
  Clock, 
  CheckCircle, 
  Loader, 
  AlertTriangle, 
  Search, 
  Filter,
  FileText,
  TrendingUp,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { SkeletonJobCard } from '../components/ui/Skeleton';
import { PageTitle, SectionTitle, CardTitle, BodyText, CaptionText, Label } from '../components/ui/Typography';

// Helper to render status icons
const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'completed') return <CheckCircle className="w-5 h-5 text-lime-500" />;
  if (status === 'failed') return <AlertTriangle className="w-5 h-5 text-destructive" />;
  return <Loader className="w-5 h-5 text-blue-soft animate-spin" />;
};

// Helper to get status color
const getStatusColor = (status: string) => {
  if (status === 'completed') return 'bg-lime-500/10 text-lime-700 border-lime-500/20';
  if (status === 'failed') return 'bg-red-500/10 text-red-700 border-red-500/20';
  return 'bg-blue-500/10 text-blue-700 border-blue-500/20';
};

interface JobCardProps {
  job: any;
  index: number;
}

const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  // Mock some stats - in a real app, these would come from the API
  const mockStats = {
    sources: Math.floor(Math.random() * 50) + 10,
    insights: Math.floor(Math.random() * 20) + 5,
  };

  return (
    <motion.div
      layout
      whileHover={{ 
        y: -4, 
        boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" 
      }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Link 
        to={`/dashboard/${job.id}`}
        className="block group"
      >
        <div className="card p-6 h-full hover:border-lime-300/50 transition-all duration-300">
          {/* Header with status */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mb-3 ${getStatusColor(job.status)}`}>
                <StatusIcon status={job.status} />
                <span className="ml-1.5 capitalize">{job.status}</span>
              </div>
            </div>
          </div>

          {/* Query Content */}
          <CardTitle className="mb-3 line-clamp-3 group-hover:text-lime-600 transition-colors">
            {job.original_query}
          </CardTitle>

          {/* Stats */}
          {job.status === 'completed' && (
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <CaptionText>{mockStats.sources} sources</CaptionText>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
                <CaptionText>{mockStats.insights} insights</CaptionText>
              </div>
            </div>
          )}

          {/* Footer with date */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1.5 text-muted-foreground" />
              <CaptionText>
                {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
              </CaptionText>
            </div>
            {job.status === 'completed' && (
              <CaptionText color="success" className="font-medium">
                View Report →
              </CaptionText>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export const DashboardHubPage: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'status'>('date');
  const [filterStatus, setFilterStatus] = useState<'all' | 'completed' | 'running' | 'failed'>('all');
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['jobHistory'],
    queryFn: () => researchApi.getJobHistory(),
  });

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Focus search on "/" key
      if (e.key === '/' && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement instanceof HTMLInputElement || 
                              activeElement instanceof HTMLTextAreaElement ||
                              activeElement instanceof HTMLSelectElement;
        
        if (!isInputFocused) {
          e.preventDefault();
          searchInputRef.current?.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter and sort jobs
  const filteredAndSortedJobs = useMemo(() => {
    if (!data?.jobs) return [];

    let filtered = data.jobs;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(job => 
        job.original_query.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter(job => {
        if (filterStatus === 'running') return job.status !== 'completed' && job.status !== 'failed';
        return job.status === filterStatus;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        // Sort by status: completed first, then running, then failed
        const statusOrder = { completed: 0, running: 1, failed: 2 };
        const getStatusPriority = (status: string) => {
          if (status === 'completed') return 0;
          if (status === 'failed') return 2;
          return 1; // running
        };
        return getStatusPriority(a.status) - getStatusPriority(b.status);
      }
    });

    return filtered;
  }, [data?.jobs, searchQuery, sortBy, filterStatus]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="Dashboard">
        <Button onClick={handleLogout} variant="ghost">Logout</Button>
      </Header>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <PageTitle className="mb-2">
              Welcome back! 👋
            </PageTitle>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <BodyText color="secondary">
              Your market intelligence reports and research insights
            </BodyText>
          </motion.div>
        </div>

        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                ref={searchInputRef}
                placeholder="Search reports... (Press / to focus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'date' | 'status')}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="date">Sort by Date</option>
                <option value="status">Sort by Status</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-3 py-2 border border-border rounded-lg bg-background text-sm"
              >
                <option value="all">All Reports</option>
                <option value="completed">Completed</option>
                <option value="running">Running</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          <Link to="/new-research">
            <Button size="md" className="shrink-0">
              <Plus className="w-5 h-5 mr-2" />
              Generate New Report
            </Button>
          </Link>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {isLoading && (
            <>
              {/* Skeleton Stats Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="card p-4">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-slate-200 rounded mr-3 animate-pulse" />
                      <div className="space-y-2 flex-1">
                        <div className="h-3 bg-slate-200 rounded w-1/2 animate-pulse" />
                        <div className="h-5 bg-slate-200 rounded w-1/4 animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Skeleton Jobs Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { 
                      staggerChildren: 0.07 
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
              >
                {Array.from({ length: 6 }).map((_, index) => (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { y: 20, opacity: 0 },
                      visible: { y: 0, opacity: 1 }
                    }}
                  >
                    <SkeletonJobCard />
                  </motion.div>
                ))}
              </motion.div>
            </>
          )}

          {isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-destructive" />
              </div>
              <SectionTitle className="mb-2 text-destructive">Oops! Something went wrong</SectionTitle>
              <BodyText color="secondary" className="mb-6 max-w-md mx-auto">
                We couldn't load your reports right now. This might be a temporary issue.
              </BodyText>
              <Button
                onClick={() => refetch()}
                variant="outline"
                className="border-destructive text-destructive hover:bg-destructive hover:text-white"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {data && data.jobs.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="relative mb-8">
                <motion.div 
                  className="w-24 h-24 bg-gradient-to-br from-lime-500/20 to-blue-500/20 rounded-3xl flex items-center justify-center mx-auto mb-4 relative overflow-hidden"
                  animate={{ 
                    background: [
                      'linear-gradient(135deg, rgba(132, 204, 22, 0.2), rgba(59, 130, 246, 0.2))',
                      'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(132, 204, 22, 0.2))',
                      'linear-gradient(135deg, rgba(132, 204, 22, 0.2), rgba(59, 130, 246, 0.2))'
                    ]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="absolute inset-2 border-2 border-lime-500/30 rounded-2xl"
                  />
                  <BarChart3 className="w-12 h-12 text-lime-600 relative z-10" />
                </motion.div>
                <div className="flex items-center justify-center space-x-1">
                  <motion.div 
                    className="w-2 h-2 bg-lime-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-blue-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                  />
                  <motion.div 
                    className="w-2 h-2 bg-lime-500 rounded-full"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
                  />
                </div>
              </div>
              <SectionTitle className="mb-2">Ready to dive into market intelligence?</SectionTitle>
              <BodyText color="secondary" className="mb-8 max-w-md mx-auto">
                Generate your first comprehensive market research report powered by AI agents and unlock deep insights about your industry.
              </BodyText>
              <Link to="/new-research">
                <Button size="lg" className="px-8 animate-pulse-lime">
                  <Plus className="w-5 h-5 mr-2" />
                  Create Your First Report
                </Button>
              </Link>
            </motion.div>
          )}

          {filteredAndSortedJobs.length > 0 && (
            <>
              {/* Stats Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="card p-4">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-lime-500 mr-3" />
                    <div>
                      <Label color="secondary">Total Reports</Label>
                      <SectionTitle className="mt-1">{data?.jobs.length || 0}</SectionTitle>
                    </div>
                  </div>
                </div>
                <div className="card p-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-lime-500 mr-3" />
                    <div>
                      <Label color="secondary">Completed</Label>
                      <SectionTitle className="mt-1">
                        {data?.jobs.filter(job => job.status === 'completed').length || 0}
                      </SectionTitle>
                    </div>
                  </div>
                </div>
                <div className="card p-4">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 text-lime-500 mr-3" />
                    <div>
                      <Label color="secondary">This Month</Label>
                      <SectionTitle className="mt-1">
                        {data?.jobs.filter(job => {
                          const jobDate = new Date(job.created_at);
                          const now = new Date();
                          return jobDate.getMonth() === now.getMonth() && jobDate.getFullYear() === now.getFullYear();
                        }).length || 0}
                      </SectionTitle>
                    </div>
                  </div>
                </div>
              </div>

              {/* Jobs Grid */}
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: { 
                      staggerChildren: 0.07 
                    }
                  }
                }}
                initial="hidden"
                animate="visible"
                layout
              >
                <AnimatePresence>
                  {filteredAndSortedJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      layout // THE MAGIC PROP!
                      variants={{
                        hidden: { y: 20, opacity: 0 },
                        visible: { y: 0, opacity: 1 }
                      }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    >
                      <JobCard job={job} index={index} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* No results message */}
              {filteredAndSortedJobs.length === 0 && data?.jobs.length > 0 && (
                <div className="text-center py-12">
                  <Search className="w-8 h-8 mx-auto mb-4 text-muted-foreground" />
                  <CardTitle className="mb-2">No reports found</CardTitle>
                  <BodyText color="secondary">
                    Try adjusting your search or filter criteria.
                  </BodyText>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}; 