import { useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useResearchStore } from '../store/useResearchStore';
import { useChatStore } from '../store/useChatStore';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useSyncAuth = () => {
  const logout = useAuthStore((state) => state.logout);
  const queryClient = useQueryClient();

  useEffect(() => {
    const syncLogout = (event: StorageEvent) => {
      // The key for our auth storage is 'auth-storage'
      if (event.key === 'auth-storage') {
        // When the 'token' in localStorage becomes null, it means a logout happened in another tab.
        // `event.newValue` will be a stringified object, so we check if the token property is null.
        const newValue = event.newValue ? JSON.parse(event.newValue) : {};
        
        if (!newValue.state?.token) {
          console.log('Auth state changed in another tab. Forcing logout.');
          toast('You have been logged out from another tab.', { icon: '🔄' });
          
          // Perform a full local logout and cleanup
          logout();
          
          // Clear all related data to prevent state leakage
          useResearchStore.getState().clearJob();
          useChatStore.setState({ messagesByJob: {}, currentJobId: undefined, isTyping: false });
          queryClient.clear(); // Clear all react-query cache
        }
      }
    };

    window.addEventListener('storage', syncLogout);

    return () => {
      window.removeEventListener('storage', syncLogout);
    };
  }, [logout, queryClient]);
}; 