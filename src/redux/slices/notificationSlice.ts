import { createSlice, PayloadAction } from '@reduxjs/toolkit'
// import { notifications as seedNotifications } from '@/lib/seedData'

interface Notification {
  id: number
  userId: number
  title: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  isRead: boolean
  createdAt: string
  relatedReportId?: number
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
  loading: boolean
}

// Safe fallback for notifications with mock data
const initialNotifications: Notification[] = [
  {
    id: 1,
    userId: 1,
    title: 'New Report Submitted',
    message: 'A new civic issue has been reported in your area',
    type: 'info',
    isRead: false,
    createdAt: new Date().toISOString(),
    relatedReportId: 1
  },
  {
    id: 2,
    userId: 1,
    title: 'Report Resolved',
    message: 'Your water supply issue has been resolved',
    type: 'success',
    isRead: true,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    relatedReportId: 2
  }
]

const initialState: NotificationState = {
  notifications: initialNotifications,
  unreadCount: initialNotifications.filter((n: Notification) => !n.isRead).length,
  loading: false,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt' | 'isRead'>>) => {
      const newNotification = {
        ...action.payload,
        id: Math.max(...state.notifications.map(n => n.id)) + 1,
        createdAt: new Date().toISOString(),
        isRead: false
      }
      state.notifications.unshift(newNotification)
      state.unreadCount += 1
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.isRead) {
        notification.isRead = true
        state.unreadCount -= 1
      }
    },
    markAllAsRead: (state, action: PayloadAction<number>) => {
      const userId = action.payload
      state.notifications.forEach(notification => {
        if (notification.userId === userId && !notification.isRead) {
          notification.isRead = true
        }
      })
      state.unreadCount = state.notifications.filter(n => !n.isRead).length
    },
    deleteNotification: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.isRead) {
        state.unreadCount -= 1
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    }
  },
})

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  setLoading
} = notificationSlice.actions

export default notificationSlice.reducer
