import { create } from 'zustand';

interface User {
  uid: string;
  name: string;
  email: string;
  role: 'student' | 'volunteer' | 'admin';
  status?: string;
  [key: string]: any;
}

interface AppState {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  isLoadingMetadata: boolean;
  setIsLoadingMetadata: (loading: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  isLoadingMetadata: true,
  setIsLoadingMetadata: (loading) => set({ isLoadingMetadata: loading }),
}));
