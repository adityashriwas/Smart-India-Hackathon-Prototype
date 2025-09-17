import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { notifications as initialNotifications } from '../../lib/seedData.js'

interface Notification {
  id: number
  userId: number
  type: 'assigned' | 'in_progress' | 'resolved' | 'submitted' | 'info'
  message: string
  read?: boolean
  createdAt?: string
}

interface NotificationState {
  notifications: Notification[]
  unreadCount: number
}

const initialState: NotificationState = {
  notifications: initialNotifications.map(n => ({ ...n, read: false, createdAt: new Date().toISOString() })),
  unreadCount: initialNotifications.length
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'createdAt'>>) => {
      const newNotification = {
        ...action.payload,
        id: Math.max(...state.notifications.map(n => n.id), 0) + 1,
        read: false,
        createdAt: new Date().toISOString()
      }
      state.notifications.unshift(newNotification)
      state.unreadCount += 1
    },
    markAsRead: (state, action: PayloadAction<number>) => {
      const notification = state.notifications.find(n => n.id === action.payload)
      if (notification && !notification.read) {
        notification.read = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllAsRead: (state, action: PayloadAction<number>) => {
      const userId = action.payload
      state.notifications
        .filter(n => n.userId === userId && !n.read)
        .forEach(n => {
          n.read = true
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        })
    },
    deleteNotification: (state, action: PayloadAction<number>) => {
      const notificationIndex = state.notifications.findIndex(n => n.id === action.payload)
      if (notificationIndex !== -1) {
        const notification = state.notifications[notificationIndex]
        if (!notification.read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1)
        }
        state.notifications.splice(notificationIndex, 1)
      }
    }
  },
})

export const { addNotification, markAsRead, markAllAsRead, deleteNotification } = notificationSlice.actions
export default notificationSlice.reducer
