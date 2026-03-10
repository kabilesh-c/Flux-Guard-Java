import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { dashboardApi, transactionApi } from '../utils/api'
import type { DashboardSummary, Transaction } from '../types'
import { getMockTransactions, getMockDashboardSummary, getMockTimeSeriesData } from '../utils/mockData'

export default function Dashboard() {
  const navigate = useNavigate()
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      // Don't show loading on refresh, only on initial load
      if (!summary) setLoading(true)
      
      // Use mock data instead of API calls
      const mockSummary = getMockDashboardSummary();
      const mockTransactions = getMockTransactions(0, 5);
      
      setSummary(mockSummary);
      setTransactions(mockTransactions.content);
      
    } catch (error: any) {
      console.error('Error loading dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  // Use mock time series data for the chart
  const timeSeriesData = getMockTimeSeriesData();
  const chartData = timeSeriesData.map(item => ({
    time: new Date(item.timestamp).getHours() + ':00',
    value: item.total_count,
    flagged: item.flagged_count,
    rejected: item.rejected_count
  }));

  // Calculate fraud rate
  const fraudRate = summary && summary.totalTransactions > 0
    ? ((summary.rejectedTransactions / summary.totalTransactions) * 100).toFixed(2)
    : '0.00'

  // Calculate total and fraudulent amounts
  const totalAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0)
  const fraudulentAmount = transactions
    .filter(tx => tx.status === 'REJECTED')
    .reduce((sum, tx) => sum + tx.amount, 0)

  const getStatusBadge = (status: string) => {
    const badges = {
      APPROVED: 'bg-green-500 bg-opacity-20 text-green-400',
      FLAGGED: 'bg-yellow-500 bg-opacity-20 text-yellow-400',
      REJECTED: 'bg-red-500 bg-opacity-20 text-red-400',
      PENDING: 'bg-blue-500 bg-opacity-20 text-blue-400'
    }
    return badges[status as keyof typeof badges] || 'bg-gray-500 bg-opacity-20 text-gray-400'
  }

  // Show skeleton on initial load only
  if (loading && !summary) {
    return (
      <div className="space-y-6 p-6 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-48"></div>
        <div className="grid grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-700 rounded"></div>
          ))}
        </div>
        <div className="h-64 bg-gray-700 rounded"></div>
        <div className="h-96 bg-gray-700 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Live Dashboard</h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-500 bg-opacity-20 text-green-400 rounded text-sm flex items-center gap-2">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            Live
          </button>
          <button className="px-4 py-2 bg-white bg-opacity-10 rounded text-sm hover:bg-opacity-20" onClick={loadDashboardData}>
            Refresh
          </button>
          <button className="px-4 py-2 bg-red-500 rounded text-sm hover:bg-red-600">
            Reset
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 transition-all hover:border-gray-600">
          <p className="text-gray-400 text-xs mb-1">Total Transactions</p>
          <p className="text-2xl font-bold">{summary?.totalTransactions || 0}</p>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 transition-all hover:border-gray-600">
          <p className="text-gray-400 text-xs mb-1">Transactions for Review</p>
          <p className="text-2xl font-bold">{summary?.flaggedTransactions || 0}</p>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 transition-all hover:border-gray-600">
          <p className="text-gray-400 text-xs mb-1">Fraudulent Transactions</p>
          <p className="text-2xl font-bold">{summary?.rejectedTransactions || 0}</p>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 transition-all hover:border-gray-600">
          <p className="text-gray-400 text-xs mb-1">Fraud Rate</p>
          <p className="text-2xl font-bold">{fraudRate}%</p>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 transition-all hover:border-gray-600">
          <p className="text-gray-400 text-xs mb-1">Total Amount</p>
          <p className="text-2xl font-bold">${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
        <div className="bg-gray-800 bg-opacity-50 p-4 rounded-lg border border-gray-700 transition-all hover:border-gray-600">
          <p className="text-gray-400 text-xs mb-1">Fraudulent Amount</p>
          <p className="text-2xl font-bold">${fraudulentAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Transaction Volume Chart */}
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Transaction Volume</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="time" 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1e293b', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '8px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#0ea5e9" 
              strokeWidth={2}
              dot={{ fill: '#0ea5e9', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Transactions Table */}
      <div className="bg-gray-800 bg-opacity-50 p-6 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-6 text-gray-500 font-normal text-xs">Time</th>
                <th className="text-left py-3 px-6 text-gray-500 font-normal text-xs">Transaction ID</th>
                <th className="text-left py-3 px-6 text-gray-500 font-normal text-xs">User ID</th>
                <th className="text-left py-3 px-6 text-gray-500 font-normal text-xs">Amount</th>
                <th className="text-left py-3 px-6 text-gray-500 font-normal text-xs">Location</th>
                <th className="text-left py-3 px-6 text-gray-500 font-normal text-xs">Status</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, index) => (
                <tr 
                  key={tx.id} 
                  onClick={() => navigate(`/transactions/${tx.id}`)}
                  className={`border-b border-gray-700 cursor-pointer hover:bg-white hover:bg-opacity-5 transition-colors ${index % 2 === 0 ? 'bg-gray-800 bg-opacity-30' : ''}`}
                >
                  <td className="py-4 px-6 text-sm text-gray-300">{new Date(tx.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{tx.transaction_id}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{tx.user_id}</td>
                  <td className="py-4 px-6 text-sm text-white font-medium">${tx.amount.toFixed(2)}</td>
                  <td className="py-4 px-6 text-sm text-gray-300">{tx.location?.country || 'USA'}</td>
                  <td className="py-4 px-6">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${getStatusBadge(tx.status)}`}>
                      {tx.status.toLowerCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
