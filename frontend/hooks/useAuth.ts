import { useAppStore } from '@/stores/appStore'

export function useAuth() {
  const { user, setUser, logout } = useAppStore()
  
  return {
    user,
    isAuthenticated: user.isAuthenticated,
    login: setUser,
    logout,
  }
}