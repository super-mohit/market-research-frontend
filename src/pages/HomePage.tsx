import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { QueryForm } from '../components/forms/QueryForm';
import { useSubmitResearch } from '../hooks/api/useResearchQueries';
import { useResearchStore } from '../store/useResearchStore';
import { QueryFormData } from '../types';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { mutateAsync: submitResearch, isPending } = useSubmitResearch();
  const { saveQuery, setCurrentJob } = useResearchStore();

  const handleSubmit = async (data: QueryFormData) => {
    try {
      // Save the query for potential reuse
      saveQuery(data);

      // Show loading toast
      const loadingToast = toast.loading('Submitting your research request...');

      // Submit to backend
      const response = await submitResearch(data);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Set the current job to start tracking
      setCurrentJob(response.job_id);
      
      // Show success toast
      toast.success('Research started successfully!');
      
      // Navigate to loading page
      navigate(`/research/${response.job_id}`);
      
    } catch (error: any) {
      console.error('Failed to submit research:', error);
      
      // Show error toast with specific message
      const errorMessage = error?.response?.data?.detail || 
                          error?.message || 
                          'Failed to submit research request';
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