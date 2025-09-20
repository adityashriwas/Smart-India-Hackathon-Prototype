'use client'

import React, { Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
// import { reports, users, departments } from '@/lib/seedData'

// Mock data fallbacks
const reports = [
  { id: 1, priority: 'critical', status: 'pending', title: 'Water Pipeline Burst', department: 4 },
  { id: 2, priority: 'high', status: 'in_progress', title: 'Road Pothole', department: 2 },
  { id: 3, priority: 'medium', status: 'resolved', title: 'Street Light Issue', department: 3 },
  { id: 4, priority: 'low', status: 'pending', title: 'Park Maintenance', department: 5 },
  { id: 5, priority: 'critical', status: 'pending', title: 'Sewage Overflow', department: 1 }
]

const users = [
  { id: 1, name: 'Admin User', role: 'admin' },
  { id: 2, name: 'Ravi Kumar', role: 'department_head' },
  { id: 3, name: 'Meena Sharma', role: 'department_head' },
  { id: 4, name: 'Staff A', role: 'staff' },
  { id: 5, name: 'Staff B', role: 'staff' }
]

const departments = [
  { id: 1, name: 'Sanitation Department' },
  { id: 2, name: 'Public Works Department' },
  { id: 3, name: 'Electrical Department' },
  { id: 4, name: 'Water Department' },
  { id: 5, name: 'Parks Department' }
]

import { FileText, Users, Building2, AlertTriangle, Shield, Settings, UserCheck } from 'lucide-react'
import { RBACService, mockUsers, type User } from '@/lib/rbac'
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

export default function AdminDashboard() {
  const [liveData, setLiveData] = React.useState({
    totalReports: reports.length,
    totalUsers: users.length,
    totalDepartments: departments.length,
    criticalReports: reports.filter(r => r.priority === 'critical').length,
    resolvedToday: 12,
    avgResponseTime: 2.4,
    citizenSatisfaction: 87
  })

  const [selectedTimeRange, setSelectedTimeRange] = React.useState('24h')
  const [mapView, setMapView] = React.useState('heatmap')
  const [currentUserIndex, setCurrentUserIndex] = React.useState(1) // Default to admin user
  const currentUser = mockUsers[currentUserIndex]

  // Simulate live data updates with more realistic patterns
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        ...prev,
        totalReports: prev.totalReports + Math.floor(Math.random() * 2),
        criticalReports: Math.max(0, prev.criticalReports + (Math.random() > 0.7 ? 1 : -1)),
        resolvedToday: prev.resolvedToday + Math.floor(Math.random() * 2),
        avgResponseTime: Math.max(1, prev.avgResponseTime + (Math.random() - 0.5) * 0.2),
        citizenSatisfaction: Math.min(100, Math.max(70, prev.citizenSatisfaction + (Math.random() - 0.5) * 2))
      }))
    }, 3000) // Update every 3 seconds

    return () => clearInterval(interval)
  }, [])

  // Calculate statistics with live data
  const totalReports = liveData.totalReports
  const totalUsers = liveData.totalUsers
  const totalDepartments = liveData.totalDepartments
  const criticalReports = liveData.criticalReports

  // Real-time chart data with live updates
  const [chartData, setChartData] = React.useState({
    statusData: [
      { name: 'Open', value: reports.filter(r => r.status === 'open').length },
      { name: 'In Progress', value: reports.filter(r => r.status === 'in_progress').length },
      { name: 'Assigned', value: reports.filter(r => r.status === 'assigned').length },
      { name: 'Resolved', value: reports.filter(r => r.status === 'resolved').length },
    ],
    departmentData: departments.map(dept => ({
      name: dept.name.split(' ')[0],
      reports: reports.filter(r => r.department === dept.id).length,
      resolved: reports.filter(r => r.department === dept.id && r.status === 'resolved').length,
      pending: reports.filter(r => r.department === dept.id && r.status !== 'resolved').length
    })),
    timeData: Array.from({ length: 7 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (6 - i))
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        reports: Math.floor(Math.random() * 15) + 5,
        resolved: Math.floor(Math.random() * 10) + 2,
        critical: Math.floor(Math.random() * 3) + 1
      }
    }),
    realTimeData: Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      reports: Math.floor(Math.random() * 8) + 1,
      response: Math.random() * 3 + 1
    }))
  })

  // Real-time data updates
  React.useEffect(() => {
    const chartInterval = setInterval(() => {
      setChartData(prev => ({
        ...prev,
        statusData: [
          { name: 'Open', value: Math.max(0, prev.statusData[0].value + (Math.random() > 0.6 ? 1 : -1)) },
          { name: 'In Progress', value: Math.max(0, prev.statusData[1].value + (Math.random() > 0.7 ? 1 : 0)) },
          { name: 'Assigned', value: Math.max(0, prev.statusData[2].value + (Math.random() > 0.8 ? 1 : 0)) },
          { name: 'Resolved', value: prev.statusData[3].value + (Math.random() > 0.5 ? 1 : 0) },
        ],
        realTimeData: prev.realTimeData.map(item => ({
          ...item,
          reports: Math.max(0, item.reports + (Math.random() - 0.5) * 2),
          response: Math.max(0.5, item.response + (Math.random() - 0.5) * 0.5)
        }))
      }))
    }, 5000)

    return () => clearInterval(chartInterval)
  }, [])

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Municipal Command Center</h1>
            <p className="text-blue-100">Real-time civic management dashboard</p>
          </div>
          <div className="flex space-x-4">
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="1h" className="text-gray-800">Last Hour</option>
              <option value="24h" className="text-gray-800">Last 24 Hours</option>
              <option value="7d" className="text-gray-800">Last 7 Days</option>
              <option value="30d" className="text-gray-800">Last 30 Days</option>
            </select>
            
            {/* Role Switcher for Demo */}
            <select 
              value={currentUserIndex} 
              onChange={(e) => setCurrentUserIndex(Number(e.target.value))}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              {mockUsers.map((user, index) => (
                <option key={user.id} value={index} className="text-gray-800">
                  {user.name} ({user.role.replace('_', ' ')})
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-sm">Live Updates</span>
          </div>
        </div>
      </div>

      {/* Enhanced Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <FileText className="h-6 w-6 text-blue-200" />
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold">{totalReports}</p>
              <p className="text-blue-100 text-xs">Total Reports</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Users className="h-6 w-6 text-green-200" />
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold">{totalUsers}</p>
              <p className="text-green-100 text-xs">Active Users</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <AlertTriangle className="h-6 w-6 text-red-200" />
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold">{criticalReports}</p>
              <p className="text-red-100 text-xs">Critical Issues</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <svg className="h-6 w-6 text-orange-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold">{liveData.resolvedToday}</p>
              <p className="text-orange-100 text-xs">Resolved Today</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <svg className="h-6 w-6 text-purple-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold">{liveData.avgResponseTime.toFixed(1)}h</p>
              <p className="text-purple-100 text-xs">Avg Response</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-teal-500 to-teal-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <svg className="h-6 w-6 text-teal-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold">{Math.round(liveData.citizenSatisfaction)}%</p>
              <p className="text-teal-100 text-xs">Satisfaction</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
          <CardContent className="p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <Building2 className="h-6 w-6 text-indigo-200" />
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              </div>
              <p className="text-2xl font-bold">{totalDepartments}</p>
              <p className="text-indigo-100 text-xs">Departments</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Map and Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Interactive Problem Allocation Map */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 rounded-t-lg">
            <CardTitle className="text-lg font-bold text-gray-800 flex items-center">
              Problem Allocation Map
              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </CardTitle>
            <CardDescription className="text-gray-600">Real-time issue tracking and intelligent team assignment</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="relative h-80 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg overflow-hidden border">
              {/* Map View Toggle */}
              <div className="absolute top-4 right-4 z-20 flex bg-white rounded-lg shadow-md overflow-hidden">
                <button 
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    mapView === 'heatmap' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMapView('heatmap')}
                >
                  Heatmap
                </button>
                <button 
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    mapView === 'markers' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMapView('markers')}
                >
                  Markers
                </button>
                <button 
                  className={`px-3 py-2 text-xs font-medium transition-colors ${
                    mapView === 'clusters' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setMapView('clusters')}
                >
                  Clusters
                </button>
              </div>
              
              {/* Enhanced Mock Map Interface */}
              <div className="absolute inset-0">
                {/* Simulated city districts */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50">
                  {/* District boundaries */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
                    <defs>
                      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                    
                    {/* District areas */}
                    <polygon points="50,50 150,40 140,120 60,130" fill="rgba(239, 68, 68, 0.3)" stroke="#ef4444" strokeWidth="2" className="hover:fill-red-200 cursor-pointer transition-all" />
                    <polygon points="160,45 280,50 270,110 150,105" fill="rgba(245, 158, 11, 0.3)" stroke="#f59e0b" strokeWidth="2" className="hover:fill-yellow-200 cursor-pointer transition-all" />
                    <polygon points="290,55 350,60 340,140 285,135" fill="rgba(16, 185, 129, 0.3)" stroke="#10b981" strokeWidth="2" className="hover:fill-green-200 cursor-pointer transition-all" />
                    <polygon points="55,140 145,135 140,220 65,225" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="2" className="hover:fill-blue-200 cursor-pointer transition-all" />
                    <polygon points="155,115 275,120 265,200 160,195" fill="rgba(168, 85, 247, 0.3)" stroke="#a855f7" strokeWidth="2" className="hover:fill-purple-200 cursor-pointer transition-all" />
                    <polygon points="285,145 345,150 335,230 290,225" fill="rgba(236, 72, 153, 0.3)" stroke="#ec4899" strokeWidth="2" className="hover:fill-pink-200 cursor-pointer transition-all" />
                  </svg>
                </div>
                
                {/* Interactive Issue Markers */}
                <div className="absolute top-16 left-16">
                  <div className="relative group cursor-pointer">
                    <div className="w-4 h-4 bg-red-500 rounded-full animate-ping absolute"></div>
                    <div className="w-4 h-4 bg-red-600 rounded-full relative flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Water Pipeline Burst - Critical
                    </div>
                  </div>
                </div>
                
                <div className="absolute top-20 right-20">
                  <div className="relative group cursor-pointer">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Road Maintenance - Medium
                    </div>
                  </div>
                </div>
                
                {/* Enhanced Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg border">
                  <h4 className="text-xs font-bold text-gray-700 mb-3">Live Issue Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full animate-ping"></div>
                      <span className="text-xs text-gray-600">Critical (3)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-gray-600">Medium (7)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Low (12)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-600">Resolved (45)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Map Controls */}
            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  {RBACService.hasPermission(currentUser, 'tasks:assign') && (
                    <button className="px-3 py-2 bg-blue-500 text-white rounded-md text-xs font-medium hover:bg-blue-600 transition-colors flex items-center space-x-1">
                      <Users className="w-3 h-3" />
                      <span>Assign Team</span>
                    </button>
                  )}
                  {RBACService.hasPermission(currentUser, 'reports:resolve') && (
                    <button className="px-3 py-2 bg-green-500 text-white rounded-md text-xs font-medium hover:bg-green-600 transition-colors flex items-center space-x-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Mark Resolved</span>
                    </button>
                  )}
                  <button className="px-3 py-2 bg-purple-500 text-white rounded-md text-xs font-medium hover:bg-purple-600 transition-colors flex items-center space-x-1">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Refresh</span>
                  </button>
                </div>
                <div className="text-xs text-gray-500 flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span>Live: {new Date().toLocaleTimeString()}</span>
                </div>
              </div>
              
              {/* Quick Filters */}
              <div className="flex space-x-2 text-xs">
                <button className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">All Issues</button>
                <button className="px-2 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors">Critical Only</button>
                <button className="px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-md transition-colors">Unassigned</button>
                <button className="px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 rounded-md transition-colors">My Department</button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Authority Access Panel */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="text-lg font-bold text-gray-800">Authority Panel</CardTitle>
            <CardDescription className="text-gray-600">Role-based access controls</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Current User Info */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{currentUser.name.split(' ').map(n => n[0]).join('')}</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{currentUser.name}</p>
                      <p className="text-sm text-gray-600 capitalize">{currentUser.role.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-green-500" />
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {currentUser.permissions.slice(0, 3).map((permission) => (
                    <span key={permission} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                      {permission.split(':')[1]}
                    </span>
                  ))}
                  {currentUser.permissions.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                      +{currentUser.permissions.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Role-based Access Notice */}
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-3 border border-yellow-200">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
                    Showing {currentUser.permissions.length} permissions for {currentUser.role.replace('_', ' ')} role
                  </span>
                </div>
              </div>

              {/* Authority Actions */}
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-700">Available Actions</h4>
                
                {RBACService.hasPermission(currentUser, 'tasks:assign') && (
                  <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <Users className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium text-gray-800">Assign Teams</p>
                        <p className="text-xs text-gray-500">Allocate resources to issues</p>
                      </div>
                    </div>
                  </button>
                )}

                {RBACService.hasPermission(currentUser, 'users:create') && (
                  <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <UserCheck className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium text-gray-800">Manage Users</p>
                        <p className="text-xs text-gray-500">User administration</p>
                      </div>
                    </div>
                  </button>
                )}

                {RBACService.hasPermission(currentUser, 'system:manage') && (
                  <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
                    <div className="flex items-center space-x-3">
                      <Settings className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium text-gray-800">System Settings</p>
                        <p className="text-xs text-gray-500">Configure system parameters</p>
                      </div>
                    </div>
                  </button>
                )}

                <button className="w-full text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-orange-300 hover:bg-orange-50 transition-all duration-200">
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <div>
                      <p className="font-medium text-gray-800">Generate Reports</p>
                      <p className="text-xs text-gray-500">Export analytics data</p>
                    </div>
                  </div>
                </button>
              </div>

              {/* Live Activity Feed */}
              <div className="mt-6">
                <h4 className="font-semibold text-gray-700 mb-3">Live Activity</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-600">Report #1234 resolved</span>
                    <span className="text-gray-400">2m ago</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-600">New team assigned</span>
                    <span className="text-gray-400">5m ago</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span className="text-gray-600">Critical alert raised</span>
                    <span className="text-gray-400">8m ago</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Status - Real-time */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              Reports by Status
              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </CardTitle>
            <CardDescription className="text-gray-600">Live distribution of report statuses</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Suspense fallback={<div className="h-[300px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {chartData.statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Reports']} />
                </PieChart>
              </ResponsiveContainer>
            </Suspense>
          </CardContent>
        </Card>

        {/* Reports by Department - Enhanced */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              Department Performance
              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </CardTitle>
            <CardDescription className="text-gray-600">Live report distribution and resolution rates</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Suspense fallback={<div className="h-[300px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.departmentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    formatter={(value, name) => [value, name === 'reports' ? 'Total Reports' : name === 'resolved' ? 'Resolved' : 'Pending']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                  />
                  <Bar dataKey="reports" fill="#3B82F6" radius={[4, 4, 0, 0]} name="Total" />
                  <Bar dataKey="resolved" fill="#10B981" radius={[4, 4, 0, 0]} name="Resolved" />
                  <Bar dataKey="pending" fill="#F59E0B" radius={[4, 4, 0, 0]} name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Time Series Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Reports Over Time - Enhanced */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              Weekly Trends
              <div className="ml-2 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </CardTitle>
            <CardDescription className="text-gray-600">Report submission and resolution trends</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Suspense fallback={<div className="h-[300px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData.timeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value, name) => [value, name === 'reports' ? 'New Reports' : name === 'resolved' ? 'Resolved' : 'Critical']}
                  />
                  <Line type="monotone" dataKey="reports" stroke="#3B82F6" strokeWidth={3} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }} name="New Reports" />
                  <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={3} dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }} name="Resolved" />
                  <Line type="monotone" dataKey="critical" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} name="Critical" />
                </LineChart>
              </ResponsiveContainer>
            </Suspense>
          </CardContent>
        </Card>

        {/* Real-time Activity Chart */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-indigo-50 to-cyan-50 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-800 flex items-center">
              24-Hour Activity
              <div className="ml-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </CardTitle>
            <CardDescription className="text-gray-600">Real-time hourly report activity and response times</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Suspense fallback={<div className="h-[300px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={chartData.realTimeData}>
                  <defs>
                    <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorResponse" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={2} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                    formatter={(value, name) => [name === 'reports' ? Math.round(Number(value)) : `${Number(value).toFixed(1)}h`, name === 'reports' ? 'Reports' : 'Avg Response']}
                  />
                  <Area type="monotone" dataKey="reports" stroke="#3B82F6" fillOpacity={1} fill="url(#colorReports)" strokeWidth={2} />
                  <Area type="monotone" dataKey="response" stroke="#10B981" fillOpacity={1} fill="url(#colorResponse)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports Table */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-t-lg">
          <CardTitle className="text-xl font-bold text-gray-800">Recent Reports</CardTitle>
          <CardDescription className="text-gray-600">Latest submitted reports</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left p-3 font-semibold text-gray-700">ID</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Title</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Department</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Priority</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Status</th>
                  <th className="text-left p-3 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 5).map((report) => {
                  const dept = departments.find(d => d.id === report.department)
                  return (
                    <tr key={report.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                      <td className="p-3 font-medium text-blue-600">#{report.id}</td>
                      <td className="p-3 font-medium text-gray-800 max-w-xs truncate">{report.title}</td>
                      <td className="p-3 text-gray-600">{dept?.name}</td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          report.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'assigned' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <button 
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-md transition-colors duration-200 font-medium"
                            onClick={() => window.location.href = `/reports?id=${report.id}`}
                          >
                            View
                          </button>
                          <button 
                            className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-xs rounded-md transition-colors duration-200 font-medium"
                            onClick={() => {
                              // Quick status update functionality
                              alert(`Report #${report.id} status updated!`)
                            }}
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {/* Quick Actions */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button 
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => window.location.href = '/reports'}
            >
              View All Reports
            </button>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => window.location.href = '/reports/new'}
            >
              Create New Report
            </button>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => {
                // Export functionality
                const csvContent = reports.map(r => `${r.id},${r.title},${r.status},${r.priority}`).join('\n')
                const blob = new Blob([csvContent], { type: 'text/csv' })
                const url = window.URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = 'reports.csv'
                a.click()
              }}
            >
              Export Data
            </button>
            <button 
              className="px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-lg transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
              onClick={() => {
                // Refresh data
                window.location.reload()
              }}
            >
              Refresh Data
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
