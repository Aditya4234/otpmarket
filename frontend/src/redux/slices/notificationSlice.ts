import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { INotification } from '@/types'

interface NotificationState {
  notifications: INotification[]
  unreadCount: number
  isLoading: boolean
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
}

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    setNotifications: (state, action: PayloadAction<INotification[]>) => {
      state.notifications = action.payload
      state.unreadCount = action.payload.filter((n) => !n.isRead).length
    },
    addNotification: (state, action: PayloadAction<INotification>) => {
      state.notifications.unshift(action.payload)
      if (!action.payload.isRead) state.unreadCount++
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find((n) => n._id === action.payload)
      if (notification && !notification.isRead) {
        notification.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => { n.isRead = true })
      state.unreadCount = 0
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
  },
})

export const { setNotifications, addNotification, markAsRead, markAllAsRead, setLoading } = notificationSlice.actions
export default notificationSlice.reducer
