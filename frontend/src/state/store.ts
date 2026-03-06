import { create } from 'zustand'
import type { Alert, Transaction } from '../types'

interface AppState {
  // Alerts
  alerts: Alert[]
  unreadAlertCount: number
  addAlert: (alert: Alert) => void
  markAlertRead: (id: string) => void
  clearAlerts: () => void

  // Recent transactions
  recentTransactions: Transaction[]
  addRecentTransaction: (transaction: Transaction) => void

  // WebSocket connection status
  wsConnected: boolean
  setWsConnected: (connected: boolean) => void

  // User
  user: any | null
  setUser: (user: any) => void
  logout: () => void
}

export const useStore = create<AppState>((set) => ({
  // Alerts
  alerts: [],
  unreadAlertCount: 0,
  addAlert: (alert) =>
    set((state) => ({
      alerts: [alert, ...state.alerts].slice(0, 50), // Keep last 50 alerts
      unreadAlertCount: state.unreadAlertCount + 1,
    })),
  markAlertRead: (id) =>
    set((state) => ({
      alerts: state.alerts.map((a) =>
        a.id === id ? { ...a, status: 'READ' as const } : a
      ),
      unreadAlertCount: Math.max(0, state.unreadAlertCount - 1),
    })),
  clearAlerts: () =>
    set({
      alerts: [],
      unreadAlertCount: 0,
    }),

  // Recent transactions
  recentTransactions: [],
  addRecentTransaction: (transaction) =>
    set((state) => ({
      recentTransactions: [transaction, ...state.recentTransactions].slice(0, 10),
    })),

  // WebSocket
  wsConnected: false,
  setWsConnected: (connected) => set({ wsConnected: connected }),

  // User
  user: null,
  setUser: (user) => set({ user }),
  logout: () =>
    set({
      user: null,
      alerts: [],
      unreadAlertCount: 0,
      recentTransactions: [],
    }),
}))
