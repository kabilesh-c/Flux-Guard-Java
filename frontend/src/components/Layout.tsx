import { Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { wsService } from '../utils/websocket'
import { useStore } from '../state/store'
import toast from 'react-hot-toast'

export default function Layout() {
  const { addAlert, setWsConnected } = useStore()

  useEffect(() => {
    // Connect to WebSocket
    wsService.connect(
      () => {
        setWsConnected(true)
        console.log('WebSocket connected successfully')

        // Subscribe to alerts
        wsService.subscribe('/topic/alerts', (alert) => {
          console.log('Received alert:', alert)
          addAlert(alert)
          
          // Show toast notification
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? 'animate-fade-in' : 'opacity-0'
                } max-w-md w-full glass-card shadow-card p-4`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    alert.level === 'CRITICAL' ? 'bg-danger' :
                    alert.level === 'HIGH' ? 'bg-warning' :
                    'bg-primary-500'
                  }`} />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{alert.title}</p>
                    <p className="text-xs text-gray-400 mt-1">{alert.message}</p>
                  </div>
                </div>
              </div>
            ),
            { duration: 5000 }
          )
        })
      },
      (error) => {
        setWsConnected(false)
        console.error('WebSocket connection error:', error)
      }
    )

    return () => {
      wsService.disconnect()
    }
  }, [addAlert, setWsConnected])

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 ml-64 mt-16">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
