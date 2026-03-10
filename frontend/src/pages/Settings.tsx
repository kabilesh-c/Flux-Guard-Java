import { useState } from 'react'
import { Save, User, Shield, Bell, Database } from 'lucide-react'
import toast from 'react-hot-toast'

export default function Settings() {
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'system', label: 'System', icon: Database },
  ]

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate save
    setTimeout(() => {
      toast.success('Settings saved successfully!')
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-gray-400">Manage your account and system preferences</p>
      </div>

      {/* Tabs */}
      <div className="glass-card shadow-card">
        <div className="border-b border-white border-opacity-10">
          <nav className="flex gap-2 p-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-primary text-white shadow-lg'
                    : 'text-gray-400 hover:bg-white hover:bg-opacity-5 hover:text-white'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  defaultValue="Admin User"
                  className="input-field"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  defaultValue="admin@fraud-detection.com"
                  className="input-field"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Role</label>
                <input
                  type="text"
                  defaultValue="Administrator"
                  className="input-field"
                  disabled
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {activeTab === 'security' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Enter new password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="input-field"
                  placeholder="Confirm new password"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

          {activeTab === 'notifications' && (
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 glass-card">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-400">Receive alerts via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 glass-card">
                  <div>
                    <p className="font-medium">Critical Alerts</p>
                    <p className="text-sm text-gray-400">Get notified of critical fraud alerts</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 glass-card">
                  <div>
                    <p className="font-medium">Transaction Reports</p>
                    <p className="text-sm text-gray-400">Daily transaction summaries</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                  </label>
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                {loading ? 'Saving...' : 'Save Preferences'}
              </button>
            </form>
          )}

          {activeTab === 'system' && (
            <div className="space-y-6 max-w-2xl">
              <div className="glass-card p-4">
                <h3 className="font-semibold mb-3">System Information</h3>
                <dl className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Version</dt>
                    <dd className="font-mono">v1.0.0</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Backend API</dt>
                    <dd className="font-mono">http://localhost:8080</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">WebSocket Status</dt>
                    <dd className="text-success">Connected</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-400">Database</dt>
                    <dd className="text-success">Connected</dd>
                  </div>
                </dl>
              </div>

              <div className="glass-card p-4">
                <h3 className="font-semibold mb-3">Cache Management</h3>
                <div className="space-y-3">
                  <button className="btn-secondary w-full">Clear Browser Cache</button>
                  <button className="btn-secondary w-full">Clear Local Storage</button>
                  <button className="btn-secondary w-full text-danger border-danger hover:bg-danger hover:bg-opacity-10">
                    Reset All Settings
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
