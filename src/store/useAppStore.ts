import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppState {
  // UI State
  sidebarCollapsed: boolean;
  chatCollapsed: boolean;
  
  // Navigation
  currentPage: string;
  
  // User preferences
  preferences: {
    autoSave: boolean;
    showTutorial: boolean;
    defaultSources: string[];
  };
  
  // Actions
  toggleSidebar: () => void;
  toggleChat: () => void;
  setCurrentPage: (page: string) => void;
  updatePreferences: (prefs: Partial<AppState['preferences']>) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      sidebarCollapsed: false,
      chatCollapsed: true,
      currentPage: 'home',
      preferences: {
        autoSave: true,
        showTutorial: true,
        defaultSources: [],
      },
      
      // Actions
      toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      toggleChat: () => set((state) => ({ chatCollapsed: !state.chatCollapsed })),
      setCurrentPage: (page) => set({ currentPage: page }),
      updatePreferences: (prefs) => 
        set((state) => ({ 
          preferences: { ...state.preferences, ...prefs } 
        })),
    }),
    {
      name: 'supervity-app-storage',
      partialize: (state) => ({
        preferences: state.preferences,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);