import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Filter, RefreshCw } from 'lucide-react'
import { transactionApi } from '../utils/api'
import type { Transaction, PaginatedResponse } from '../types'
import { format } from 'date-fns'
import { getMockTransactions } from '../utils/mockData'

export default function Transactions() {
  const [transactions, setTransactions] = useState<PaginatedResponse<Transaction> | null>(null)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [statusFilter, setStatusFilter] = useState<string>('')

  useEffect(() => {
    loadTransactions()
  }, [page, statusFilter])

  const loadTransactions = async () => {
    try {
      setLoading(true)
      // Instead of calling the API, use our mock data
      const mockTransactions = getMockTransactions(page, 20, statusFilter || undefined)
      setTransactions(mockTransactions)
    } catch (error) {
      console.error('Error loading transactions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskBadgeClass = (score: number) => {
    if (score >= 80) return 'badge-danger'
    if (score >= 50) return 'badge-warning'
    return 'badge-success'
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'badge-success'
      case 'FLAGGED':
        return 'badge-warning'
      case 'REJECTED':
        return 'badge-danger'
      default:
        return 'badge-info'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Transactions</h1>
          <p className="text-gray-400">Monitor and manage all transactions</p>
        </div>
        <Link to="/transactions/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          New Transaction
        </Link>
      </div>

      {/* Filters */}
      <div className="glass-card shadow-card p-4">
        <div className="flex items-center gap-4">
          <Filter className="w-5 h-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value)
              setPage(0)
            }}
            className="input-field max-w-xs"
          >
            <option value="">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="FLAGGED">Flagged</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <button
            onClick={loadTransactions}
            className="btn-secondary flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white bg-opacity-5">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Transaction ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">User ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Risk Score</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Created</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white divide-opacity-5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions?.content.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    No transactions found
                  </td>
                </tr>
              ) : (
                transactions?.content.map((txn) => (
                  <tr key={txn.id} className="hover:bg-white hover:bg-opacity-5 transition-colors">
                    <td className="px-6 py-4">
                      <Link
                        to={`/transactions/${txn.id}`}
                        className="text-primary-500 hover:text-primary-400 font-mono text-sm"
                      >
                        {txn.transaction_id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm">{txn.user_id}</td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      {txn.amount.toLocaleString()} {txn.currency}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getStatusBadgeClass(txn.status)}`}>
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${getRiskBadgeClass(txn.risk_score)}`}>
                        {txn.risk_score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {format(new Date(txn.created_at), 'MMM dd, yyyy HH:mm')}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/transactions/${txn.id}`}
                        className="text-primary-500 hover:text-primary-400 text-sm"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {transactions && transactions.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-white border-opacity-5 flex items-center justify-between">
            <p className="text-sm text-gray-400">
              Showing {transactions.number * transactions.size + 1} to{' '}
              {Math.min((transactions.number + 1) * transactions.size, transactions.totalElements)} of{' '}
              {transactions.totalElements} transactions
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
                disabled={page >= transactions.totalPages - 1}
                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
