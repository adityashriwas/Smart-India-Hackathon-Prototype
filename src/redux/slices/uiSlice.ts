import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Toast {
  id: string
  title: string
  description?: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface Modal {
  id: string
  type: string
  data?: unknown
  isOpen: boolean
}

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  loading: boolean
  toasts: Toast[]
  modals: Modal[]
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  loading: false,
  toasts: [],
  modals: []
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const toast: Toast = {
        ...action.payload,
        id: Date.now().toString()
      }
      state.toasts.push(toast)
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
    },
    openModal: (state, action: PayloadAction<Omit<Modal, 'isOpen'>>) => {
      const modal: Modal = {
        ...action.payload,
        isOpen: true
      }
      state.modals.push(modal)
    },
    closeModal: (state, action: PayloadAction<string>) => {
      const modalIndex = state.modals.findIndex(modal => modal.id === action.payload)
      if (modalIndex !== -1) {
        state.modals[modalIndex].isOpen = false
      }
    },
    removeModal: (state, action: PayloadAction<string>) => {
      state.modals = state.modals.filter(modal => modal.id !== action.payload)
    }
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLoading,
  addToast,
  removeToast,
  openModal,
  closeModal,
  removeModal
} = uiSlice.actions

export default uiSlice.reducer
