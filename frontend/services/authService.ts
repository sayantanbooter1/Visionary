const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"

export interface User {
  id: string
  google_id?: string
  email?: string
  name?: string
  picture?: string
  created_at: string
}

export interface AuthResponse {
  token: string
  user: User
}

/**
 * Initiates Google OAuth flow by redirecting to backend
 */
export const initiateGoogleLogin = () => {
  window.location.href = `${API_BASE_URL}/api/auth/google`
}

/**
 * Store authentication token and user data
 */
export const storeAuthData = (token: string, user: User) => {
  sessionStorage.setItem("auth_token", token)
  sessionStorage.setItem("user", JSON.stringify(user))
}

/**
 * Get stored authentication token
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null
  return sessionStorage.getItem("auth_token")
}

/**
 * Get stored user data
 */
export const getUser = (): User | null => {
  if (typeof window === "undefined") return null
  const userStr = sessionStorage.getItem("user")
  if (!userStr) return null
  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

/**
 * Clear authentication data (logout)
 */
export const clearAuthData = () => {
  sessionStorage.removeItem("auth_token")
  sessionStorage.removeItem("user")
}

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

/**
 * Make authenticated API request
 */
export const authenticatedFetch = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken()
  
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }
  
  return fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })
}
