import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UIState {
  sidebarOpen: boolean
  theme: 'light' | 'dark'
  loading: boolean
  toast: {
    show: boolean
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
  }
  modal: {
    isOpen: boolean
    type: string | null
    data: any
  }
}

const initialState: UIState = {
  sidebarOpen: true,
  theme: 'light',
  loading: false,
  toast: {
    show: false,
    message: '',
    type: 'info'
  },
  modal: {
    isOpen: false,
    type: null,
    data: null
  }
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
    showToast: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'warning' | 'info' }>) => {
      state.toast = {
        show: true,
        message: action.payload.message,
        type: action.payload.type
      }
    },
    hideToast: (state) => {
      state.toast.show = false
    },
    openModal: (state, action: PayloadAction<{ type: string; data?: any }>) => {
      state.modal = {
        isOpen: true,
        type: action.payload.type,
        data: action.payload.data || null
      }
    },
    closeModal: (state) => {
      state.modal = {
        isOpen: false,
        type: null,
        data: null
      }
    }
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setTheme,
  setLoading,
  showToast,
  hideToast,
  openModal,
  closeModal
} = uiSlice.actions

export default uiSlice.reducer
