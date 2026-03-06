import { Bell, Search, User, LogOut } from 'lucide-react'
import { useStore } from '../state/store'
import { authApi } from '../utils/api'
import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const { unreadAlertCount, wsConnected } = useStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    authApi.logout()
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-dark-card border-b border-dark-border z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">F</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Fraud Detection
          </h1>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search transactions, rules..."
              className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-5 border border-white border-opacity-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-4">
          {/* WebSocket status */}
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${wsConnected ? 'bg-success' : 'bg-danger'}`} />
            <span className="text-xs text-gray-400">
              {wsConnected ? 'Connected' : 'Disconnected'}
            </span>
          </div>

          {/* Notifications */}
          <button 
            onClick={() => navigate('/alerts')}
            className="relative p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadAlertCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full text-xs flex items-center justify-center">
                {unreadAlertCount > 9 ? '9+' : unreadAlertCount}
              </span>
            )}
          </button>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-white hover:bg-opacity-10 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-accent rounded-full flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 glass-card shadow-card py-2 z-50">
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    navigate('/settings')
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-white hover:bg-opacity-10 flex items-center gap-2"
                >
                  <User className="w-4 h-4" />
                  Settings
                </button>
                <div className="border-t border-white border-opacity-10 my-1"></div>
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-white hover:bg-opacity-10 flex items-center gap-2 text-danger"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
