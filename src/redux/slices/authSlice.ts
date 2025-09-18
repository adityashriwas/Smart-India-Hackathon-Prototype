import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { users } from '@/lib/seedData'

interface User {
  id: number
  name: string
  email: string
  role: string
  department?: number
  manager?: number
  isActive: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// Demo credentials mapping
const demoCredentials: Record<string, { password: string; userId: number }> = {
  'admin@gov.in': { password: 'admin123', userId: 1 },
  'ravi.sanitation@gov.in': { password: 'dept123', userId: 2 },
  'meena.publicworks@gov.in': { password: 'dept123', userId: 3 },
  'arjun.electricity@gov.in': { password: 'dept123', userId: 4 },
  'neha.water@gov.in': { password: 'dept123', userId: 5 },
  'amit.parks@gov.in': { password: 'dept123', userId: 6 },
  'staffa.san@gov.in': { password: 'staff123', userId: 7 },
  'staffb.san@gov.in': { password: 'staff123', userId: 8 },
  'staffc.pwc@gov.in': { password: 'staff123', userId: 9 },
  'staffd.pwc@gov.in': { password: 'staff123', userId: 10 },
  'staffe.elc@gov.in': { password: 'staff123', userId: 11 },
  'stafff.elc@gov.in': { password: 'staff123', userId: 12 },
  'staffg.wat@gov.in': { password: 'staff123', userId: 13 },
  'staffh.wat@gov.in': { password: 'staff123', userId: 14 },
  'staffi.prk@gov.in': { password: 'staff123', userId: 15 },
  'staffj.prk@gov.in': { password: 'staff123', userId: 16 },
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
}

// Check for persisted auth state
if (typeof window !== 'undefined') {
  const savedAuth = localStorage.getItem('auth')
  if (savedAuth) {
    try {
      const parsedAuth = JSON.parse(savedAuth)
      if (parsedAuth.user && parsedAuth.isAuthenticated) {
        initialState.user = parsedAuth.user
        initialState.isAuthenticated = true
      }
    } catch (e) {
      // Invalid saved state, ignore
    }
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
      state.error = null
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
      state.error = null
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = action.payload
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
      state.error = null
      // Clear persisted auth state
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth')
      }
    },
    mockLogin: (state, action: PayloadAction<number>) => {
      const user = users.find(u => u.id === action.payload)
      if (user) {
        state.user = user
        state.isAuthenticated = true
        state.loading = false
        state.error = null
      }
    },
    formLogin: (state, action: PayloadAction<{ email: string; password: string }>) => {
      const { email, password } = action.payload
      const credentials = demoCredentials[email]
      
      if (credentials && credentials.password === password) {
        const user = users.find(u => u.id === credentials.userId)
        if (user) {
          state.user = user
          state.isAuthenticated = true
          state.loading = false
          state.error = null
          // Persist auth state
          if (typeof window !== 'undefined') {
            localStorage.setItem('auth', JSON.stringify({ user, isAuthenticated: true }))
          }
        } else {
          state.user = null
          state.isAuthenticated = false
          state.loading = false
          state.error = 'User not found'
        }
      } else {
        state.user = null
        state.isAuthenticated = false
        state.loading = false
        state.error = 'Invalid email or password'
      }
    }
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, mockLogin, formLogin } = authSlice.actions
export default authSlice.reducer
