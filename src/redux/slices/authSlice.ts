import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { users } from '@/lib/seedData'

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

// Mock users data
const users: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@gov.in', role: 'admin', isActive: true },
  { id: 2, name: 'Ravi Kumar', email: 'ravi.sanitation@gov.in', role: 'department_head', department: 1, isActive: true },
  { id: 3, name: 'Meena Sharma', email: 'meena.publicworks@gov.in', role: 'department_head', department: 2, isActive: true },
  { id: 4, name: 'Arjun Patel', email: 'arjun.electricity@gov.in', role: 'department_head', department: 3, isActive: true },
  { id: 5, name: 'Neha Singh', email: 'neha.water@gov.in', role: 'department_head', department: 4, isActive: true },
  { id: 6, name: 'Amit Gupta', email: 'amit.parks@gov.in', role: 'department_head', department: 5, isActive: true },
  { id: 7, name: 'Staff A', email: 'staffa.san@gov.in', role: 'staff', department: 1, manager: 2, isActive: true },
  { id: 8, name: 'Staff B', email: 'staffb.san@gov.in', role: 'staff', department: 1, manager: 2, isActive: true },
  { id: 9, name: 'Staff C', email: 'staffc.pwc@gov.in', role: 'staff', department: 2, manager: 3, isActive: true },
  { id: 10, name: 'Staff D', email: 'staffd.pwc@gov.in', role: 'staff', department: 2, manager: 3, isActive: true },
  { id: 11, name: 'Staff E', email: 'staffe.elc@gov.in', role: 'staff', department: 3, manager: 4, isActive: true },
  { id: 12, name: 'Staff F', email: 'stafff.elc@gov.in', role: 'staff', department: 3, manager: 4, isActive: true },
  { id: 13, name: 'Staff G', email: 'staffg.wat@gov.in', role: 'staff', department: 4, manager: 5, isActive: true },
  { id: 14, name: 'Staff H', email: 'staffh.wat@gov.in', role: 'staff', department: 4, manager: 5, isActive: true },
  { id: 15, name: 'Staff I', email: 'staffi.prk@gov.in', role: 'staff', department: 5, manager: 6, isActive: true },
  { id: 16, name: 'Staff J', email: 'staffj.prk@gov.in', role: 'staff', department: 5, manager: 6, isActive: true },
]

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
      const user = users.find((u: User) => u.id === action.payload)
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
        const user = users.find((u: User) => u.id === credentials.userId)
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
    },
    restoreAuth: (state) => {
      // Restore auth state from localStorage after hydration
      if (typeof window !== 'undefined') {
        const savedAuth = localStorage.getItem('auth')
        if (savedAuth) {
          try {
            const parsedAuth = JSON.parse(savedAuth)
            if (parsedAuth.user && parsedAuth.isAuthenticated) {
              state.user = parsedAuth.user
              state.isAuthenticated = true
            }
          } catch {
            // Invalid saved state, ignore
            localStorage.removeItem('auth')
          }
        }
      }
    }
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, mockLogin, formLogin, restoreAuth } = authSlice.actions
export default authSlice.reducer
