import { create } from 'zustand'

// Define the shape of our global state
interface User {
  id: string | null
  email: string | null
  name: string | null
  isAuthenticated: boolean
}

interface AppState {
  user: User
  theme: "light" | "dark"
  loading: boolean
  error: string | null
}

interface AppActions {
  setUser: (user: { id: string; email: string; name: string }) => void
  logout: () => void
  setTheme: (theme: "light" | "dark") => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
}

type AppStore = AppState & AppActions

const initialState: AppState = {
  user: {
    id: null,
    email: null,
    name: null,
    isAuthenticated: false,
  },
  theme: "light",
  loading: false,
  error: null,
}

export const useAppStore = create<AppStore>((set) => ({
  ...initialState,
  
  setUser: (userData) => set((state) => ({
    user: {
      ...userData,
      isAuthenticated: true,
    }
  })),
  
  logout: () => set((state) => ({
    user: {
      id: null,
      email: null,
      name: null,
      isAuthenticated: false,
    }
  })),
  
  setTheme: (theme) => set({ theme }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  clearError: () => set({ error: null }),
}))