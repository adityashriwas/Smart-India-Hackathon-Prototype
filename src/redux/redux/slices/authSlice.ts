import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { users } from '../../lib/seedData.js'

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'department_head' | 'staff'
  department?: number
  manager?: number
  isActive: boolean
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  loading: false,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.user = action.payload
      state.isAuthenticated = true
      state.loading = false
    },
    loginFailure: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      state.loading = false
    },
    mockLogin: (state, action: PayloadAction<number>) => {
      const user = users.find(u => u.id === action.payload)
      if (user) {
        state.user = user
        state.isAuthenticated = true
        state.loading = false
      }
    }
  },
})

export const { loginStart, loginSuccess, loginFailure, logout, mockLogin } = authSlice.actions
export default authSlice.reducer
