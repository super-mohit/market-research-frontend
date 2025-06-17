import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
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
    <QueryForm
      onSubmit={handleSubmit}
      isLoading={isPending}
    />
  );
}; 