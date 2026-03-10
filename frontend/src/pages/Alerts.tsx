import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertTriangle, CheckCircle, Eye } from 'lucide-react'
import { alertApi } from '../utils/api'
import type { Alert, PaginatedResponse } from '../types'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { getMockAlerts } from '../utils/mockData'

export default function Alerts() {
  const navigate = useNavigate()
  const [alerts, setAlerts] = useState<PaginatedResponse<Alert> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    loadAlerts()
  }, [page, statusFilter])

  const loadAlerts = async () => {
    try {
      setLoading(true)
      // Use mock data instead of API call
      const mockAlerts = getMockAlerts(page, 20, statusFilter || undefined)
      setAlerts(mockAlerts)
    } catch (error) {
      console.error('Error loading alerts:', error)
      toast.error('Failed to load alerts')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      // Update mock alert status in our alerts state
      if (alerts) {
        const updatedAlerts = {
          ...alerts,
          content: alerts.content.map(alert => 
            alert.id === id 
              ? { ...alert, status: 'READ' as 'READ', read_at: new Date().toISOString() } 
              : alert
          )
        };
        setAlerts(updatedAlerts);
      }
      
      toast.success('Alert marked as read')
    } catch (error) {
      toast.error('Failed to update alert')
    }
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'CRITICAL':
        return 'border-danger bg-danger bg-opacity-10'
      case 'HIGH':
        return 'border-warning bg-warning bg-opacity-10'
      case 'MEDIUM':
        return 'border-primary-500 bg-primary-500 bg-opacity-10'
      default:
        return 'border-success bg-success bg-opacity-10'
    }
  }

  const getLevelIcon = (level: string) => {
    if (level === 'CRITICAL' || level === 'HIGH') {
      return <AlertTriangle className="w-5 h-5" />
    }
    return <CheckCircle className="w-5 h-5" />
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Alerts</h1>
          <p className="text-gray-400">Monitor and manage fraud alerts</p>
        </div>
      </div>

      {/* Filters */}
      <div className="glass-card shadow-card p-4">
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(0)
            }}
            className="input-field max-w-xs"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="READ">Read</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading alerts...</div>
        ) : alerts?.content.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No alerts found</div>
        ) : (
          alerts?.content.map((alert) => (
            <div
              key={alert.id}
              className={`glass-card shadow-card p-6 border-l-4 ${getLevelColor(alert.level)} ${
                alert.status === 'NEW' ? 'shadow-card-hover' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${getLevelColor(alert.level)}`}>
                  {getLevelIcon(alert.level)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">{alert.title}</h3>
                      <p className="text-gray-400 text-sm">{alert.message}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`badge ${
                        alert.level === 'CRITICAL' ? 'badge-danger' :
                        alert.level === 'HIGH' ? 'badge-warning' :
                        'badge-info'
                      }`}>
                        {alert.level}
                      </span>
                      <span className={`badge ${
                        alert.status === 'NEW' ? 'badge-info' :
                        alert.status === 'RESOLVED' ? 'badge-success' :
                        'badge text-gray-400'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-400 mt-3">
                    <span>{format(new Date(alert.created_at), 'PPpp')}</span>
                    <button
                      onClick={() => navigate(`/transactions/${alert.transaction_id}`)}
                      className="text-primary-500 hover:text-primary-400 flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      View Transaction
                    </button>
                    {alert.status === 'NEW' && (
                      <button
                        onClick={() => markAsRead(alert.id)}
                        className="text-primary-500 hover:text-primary-400"
                      >
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {alerts && alerts.totalPages > 1 && (
        <div className="glass-card shadow-card px-6 py-4 flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {alerts.number * alerts.size + 1} to{' '}
            {Math.min((alerts.number + 1) * alerts.size, alerts.totalElements)} of{' '}
            {alerts.totalElements} alerts
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= alerts.totalPages - 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
