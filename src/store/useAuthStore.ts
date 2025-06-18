import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { apiClient } from '../services/api';
// Import other stores for cleanup during logout
import { useResearchStore } from './useResearchStore';
import { useChatStore } from './useChatStore';

// This is where you'll define the auth-related API calls
const authApi = {
  login: async (email: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);
    const response = await apiClient.post('/api/auth/token', params, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },
  // You'd add a signup function here too
  signup: async (email: string, password: string, name: string) => {
    const response = await apiClient.post('/api/auth/signup', {
      email,
      password,
      name,
    });
    return response.data;
  },
};

interface AuthState {
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  // you can add user profile info here as well
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLoading: false,
      error: null,
      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { access_token } = await authApi.login(email, password);
          set({ token: access_token, isLoading: false, error: null });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Login failed',
          });
          throw error;
        }
      },
      signup: async (email: string, password: string, name: string) => {
        set({ isLoading: true, error: null });
        try {
          const { access_token } = await authApi.signup(email, password, name);
          set({ token: access_token, isLoading: false, error: null });
        } catch (error) {
          set({
            isLoading: false,
            error: error instanceof Error ? error.message : 'Signup failed',
          });
          throw error;
        }
      },
      logout: () => {
        console.log('Clearing authentication and application state.');
        
        // Clear all relevant application state
        useResearchStore.getState().clearJob();
        // Clear chat state manually since Zustand doesn't have a simple "reset"
        useChatStore.setState({ messagesByJob: {}, currentJobId: undefined, isTyping: false });

        // Finally, clear the auth token
        set({ token: null, error: null });
        
        // Note: React Query cache will be cleared by the useSyncAuth hook or on page reload
      },
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
    }
  )
); 