import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import { researchApi } from '../services/researchApi';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Plus, Clock, CheckCircle, Loader, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';

// Helper to render status icons
const StatusIcon = ({ status }: { status: string }) => {
  if (status === 'completed') return <CheckCircle className="w-5 h-5 text-lime-500" />;
  if (status === 'failed') return <AlertTriangle className="w-5 h-5 text-destructive" />;
  return <Loader className="w-5 h-5 text-blue-soft animate-spin" />;
};

export const DashboardHubPage: React.FC = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['jobHistory'],
    queryFn: () => researchApi.getJobHistory(),
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="My Dashboard">
        <Button onClick={handleLogout} variant="ghost">Logout</Button>
      </Header>
      
      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Research Reports</h1>
          <Link to="/new-research">
            <Button size="md">
              <Plus className="w-5 h-5 mr-2" />
              Generate New Report
            </Button>
          </Link>
        </div>

        <div className="card p-6">
          {isLoading && <div className="text-center p-8">Loading your history...</div>}
          {isError && <div className="text-center p-8 text-destructive">Failed to load history.</div>}
          {data && data.jobs.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium text-foreground">No reports yet!</h3>
              <p className="text-muted-foreground mt-2 mb-6">
                Click the button to generate your first market intelligence report.
              </p>
              <Link to="/new-research">
                <Button variant="outline">Start Research</Button>
              </Link>
            </div>
          )}
          {data && data.jobs.length > 0 && (
            <ul className="space-y-4">
              {data.jobs.map((job) => (
                <li key={job.id}>
                  <Link 
                    to={`/dashboard/${job.id}`}
                    className="block p-4 border rounded-lg hover:bg-slate-100/50 hover:border-lime-400 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <p className="font-medium text-foreground pr-4 line-clamp-2">
                        {job.original_query}
                      </p>
                      <div className="flex-shrink-0 flex items-center space-x-2 text-sm text-muted-foreground capitalize">
                        <StatusIcon status={job.status} />
                        <span>{job.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-3">
                      <Clock className="w-3 h-3 mr-1.5" />
                      <span>
                        Created {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}; 