import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { reports as initialReports } from '@/lib/seedData'

interface Report {
  id: number
  reporterId: number
  title: string
  category: string
  department: number
  priority: 'low' | 'medium' | 'high' | 'critical'
  status: 'submitted' | 'assigned' | 'in_progress' | 'resolved'
  assignedTo: number
  createdAt: string
  updatedAt?: string
  description?: string
  location?: string
  media?: string[]
}

interface ReportState {
  reports: Report[]
  loading: boolean
  error: string | null
  filters: {
    status?: string
    priority?: string
    department?: number
    assignedTo?: number
  }
}

const initialState: ReportState = {
  reports: initialReports.map(r => ({
    ...r,
    priority: r.priority as Report['priority'],
    status: r.status as Report['status']
  })),
  loading: false,
  error: null,
  filters: {}
}

const reportSlice = createSlice({
  name: 'reports',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    addReport: (state, action: PayloadAction<Omit<Report, 'id'>>) => {
      const newReport = {
        ...action.payload,
        id: Math.max(...state.reports.map(r => r.id)) + 1,
        createdAt: new Date().toISOString().split('T')[0]
      }
      state.reports.push(newReport)
    },
    updateReport: (state, action: PayloadAction<{ id: number; updates: Partial<Report> }>) => {
      const { id, updates } = action.payload
      const reportIndex = state.reports.findIndex(r => r.id === id)
      if (reportIndex !== -1) {
        state.reports[reportIndex] = {
          ...state.reports[reportIndex],
          ...updates,
          updatedAt: new Date().toISOString().split('T')[0]
        }
      }
    },
    deleteReport: (state, action: PayloadAction<number>) => {
      state.reports = state.reports.filter(r => r.id !== action.payload)
    },
    setFilters: (state, action: PayloadAction<ReportState['filters']>) => {
      state.filters = action.payload
    },
    clearFilters: (state) => {
      state.filters = {}
    },
    assignReport: (state, action: PayloadAction<{ reportId: number; staffId: number }>) => {
      const { reportId, staffId } = action.payload
      const reportIndex = state.reports.findIndex(r => r.id === reportId)
      if (reportIndex !== -1) {
        state.reports[reportIndex].assignedTo = staffId
        state.reports[reportIndex].status = 'assigned'
        state.reports[reportIndex].updatedAt = new Date().toISOString().split('T')[0]
      }
    }
  },
})

export const {
  setLoading,
  setError,
  addReport,
  updateReport,
  deleteReport,
  setFilters,
  clearFilters,
  assignReport
} = reportSlice.actions

export default reportSlice.reducer
