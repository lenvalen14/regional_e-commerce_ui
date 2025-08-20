import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface User {
  userId: string
  email: string
  userName: string
  role: string
}

interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  error: string | null
}

const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const currentTime = Date.now() / 1000
    return payload.exp > currentTime
  } catch {
    return false
  }
}

const getInitialToken = (): string | null => {
  if (typeof window !== "undefined") {
    try {
      const token = localStorage.getItem("token")
      if (token && isTokenValid(token)) {
        return token
      }
      localStorage.removeItem("token")
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }
  return null
}

const getInitialRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("refreshToken")
    } catch (error) {
      console.error("Error accessing localStorage:", error)
    }
  }
  return null
}

const token = getInitialToken()

const initialState: AuthState = {
  user: null,
  token: token,
  refreshToken: getInitialRefreshToken(),
  isAuthenticated: !!token,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        user: User
        token: string
        refreshToken?: string
      }>,
    ) => {
      const { user, token, refreshToken } = action.payload
      state.user = user
      state.token = token
      state.refreshToken = refreshToken || state.refreshToken
      state.isAuthenticated = true
      state.error = null

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("token", token)
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken)
          }
        } catch (error) {
          console.error("Error saving to localStorage:", error)
          state.error = "Failed to save authentication data"
        }
      }
    },

    refreshTokenSuccess: (state, action: PayloadAction<{ token: string; refreshToken?: string }>) => {
      const { token, refreshToken } = action.payload
      state.token = token
      if (refreshToken) {
        state.refreshToken = refreshToken
      }
      state.error = null

      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("token", token)
          if (refreshToken) {
            localStorage.setItem("refreshToken", refreshToken)
          }
        } catch (error) {
          console.error("Error saving refreshed token:", error)
        }
      }
    },

    logout: (state) => {
      state.user = null
      state.token = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.error = null

      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("token")
          localStorage.removeItem("refreshToken")
        } catch (error) {
          console.error("Error clearing localStorage:", error)
        }
      }
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload }
      }
    },

    setAuthError: (state, action: PayloadAction<string>) => {
      state.error = action.payload
    },

    clearAuthError: (state) => {
      state.error = null
    },
  },
})

export const { setCredentials, refreshTokenSuccess, logout, updateUser, setAuthError, clearAuthError } =
  authSlice.actions

export default authSlice.reducer

export const selectCurrentUser = (state: { auth: AuthState }) => state.auth.user
export const selectCurrentToken = (state: { auth: AuthState }) => state.auth.token
export const selectRefreshToken = (state: { auth: AuthState }) => state.auth.refreshToken
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated
export const selectAuthError = (state: { auth: AuthState }) => state.auth.error

export const selectTokenNeedsRefresh = (state: { auth: AuthState }): boolean => {
  const token = state.auth.token
  if (!token) return false

  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    const currentTime = Date.now() / 1000
    const timeUntilExpiry = payload.exp - currentTime
    return timeUntilExpiry < 300
  } catch {
    return true
  }
}
