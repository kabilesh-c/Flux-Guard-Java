import axios from 'axios'
import type { Transaction, Rule, Alert, PaginatedResponse, TransactionRequest, RuleRequest, DashboardSummary, TimeSeriesData } from '../types'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Transaction APIs
export const transactionApi = {
  create: (data: TransactionRequest) =>
    api.post<Transaction>('/api/transactions', data),

  getById: (id: string) =>
    api.get<Transaction>(`/api/transactions/${id}`),

  getAll: (page = 0, size = 20, status?: string) =>
    api.get<PaginatedResponse<Transaction>>('/api/transactions', {
      params: { page, size, status },
    }),

  retry: (id: string) =>
    api.post<Transaction>(`/api/transactions/${id}/retry`),

  reset: (id: string) =>
    api.post<Transaction>(`/api/transactions/${id}/reset`),
}

// Rule APIs
export const ruleApi = {
  getAll: () =>
    api.get<Rule[]>('/api/rules'),

  getById: (id: string) =>
    api.get<Rule>(`/api/rules/${id}`),

  create: (data: RuleRequest) =>
    api.post<Rule>('/api/rules', data),

  update: (id: string, data: Partial<RuleRequest>) =>
    api.put<Rule>(`/api/rules/${id}`, data),

  delete: (id: string) =>
    api.delete(`/api/rules/${id}`),

  test: (id: string, testData: any) =>
    api.post(`/api/rules/${id}/test`, testData),
}

// Alert APIs
export const alertApi = {
  getAll: (page = 0, size = 20, status?: string) =>
    api.get<PaginatedResponse<Alert>>('/api/alerts', {
      params: { page, size, status },
    }),

  getById: (id: string) =>
    api.get<Alert>(`/api/alerts/${id}`),

  updateStatus: (id: string, status: string) =>
    api.put<Alert>(`/api/alerts/${id}/status`, { status }),

  bulkAction: (ids: string[], action: string) =>
    api.post('/api/alerts/bulk-action', { ids, action }),
}

// Dashboard APIs
export const dashboardApi = {
  getSummary: () =>
    api.get<DashboardSummary>('/api/dashboard/summary'),

  getTimeSeries: (from?: string, to?: string, interval = 'hour') =>
    api.get<TimeSeriesData[]>('/api/dashboard/time-series', {
      params: { from, to, interval },
    }),

  getRiskDistribution: () =>
    api.get<Array<{ range: string; count: number }>>('/api/dashboard/risk-distribution'),
}

// Auth APIs
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: any }>('/api/auth/login', { email, password }),

  register: (data: { email: string; password: string; firstName: string; lastName: string }) =>
    api.post('/api/auth/register', data),

  logout: () => {
    localStorage.removeItem('auth_token')
    window.location.href = '/login'
  },
}

export default api
