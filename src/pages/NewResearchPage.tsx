import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Header } from '../components/layout/Header';
import { QueryForm } from '../components/forms/QueryForm';
import { useSubmitResearch } from '../hooks/api/useResearchQueries';
import { useResearchStore } from '../store/useResearchStore';
import { QueryFormData } from '../types';

export const NewResearchPage: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: submitResearch, isPending } = useSubmitResearch();
  const { saveQuery, setCurrentJob } = useResearchStore();

  const handleSubmit = async (data: QueryFormData) => {
    try {
      saveQuery(data);
      const loadingToast = toast.loading('Submitting your research request...');
      const response = await submitResearch(data);
      toast.dismiss(loadingToast);
      setCurrentJob(response.job_id);
      toast.success('Research started successfully!');
      // Navigate to the loading/tracking page
      navigate(`/research/${response.job_id}`);
    } catch (error: any) {
      const errorMessage = error?.response?.data?.detail || 'Failed to submit research request';
      toast.error(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header title="New Research" />
      
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Page Title */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl font-bold text-foreground mb-2">
              What market intelligence do you need today?
            </h1>
            <p className="text-muted-foreground text-lg">
              Describe your research objectives and let our AI agents do the work
            </p>
          </motion.div>

          <QueryForm
            onSubmit={handleSubmit}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  );
}; 