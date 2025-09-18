'use client'

import React, { lazy, Suspense } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { reports, departments, users } from '@/lib/seedData.js'
import { FileText, Users, Building2, AlertTriangle } from 'lucide-react'

// Lazy load chart components
const PieChart = lazy(() => import('recharts').then(module => ({ default: module.PieChart })))
const BarChart = lazy(() => import('recharts').then(module => ({ default: module.BarChart })))
const LineChart = lazy(() => import('recharts').then(module => ({ default: module.LineChart })))
const ResponsiveContainer = lazy(() => import('recharts').then(module => ({ default: module.ResponsiveContainer })))
const Pie = lazy(() => import('recharts').then(module => ({ default: module.Pie })))
const Bar = lazy(() => import('recharts').then(module => ({ default: module.Bar })))
const Line = lazy(() => import('recharts').then(module => ({ default: module.Line })))
const XAxis = lazy(() => import('recharts').then(module => ({ default: module.XAxis })))
const YAxis = lazy(() => import('recharts').then(module => ({ default: module.YAxis })))
const CartesianGrid = lazy(() => import('recharts').then(module => ({ default: module.CartesianGrid })))
const Tooltip = lazy(() => import('recharts').then(module => ({ default: module.Tooltip })))
const Cell = lazy(() => import('recharts').then(module => ({ default: module.Cell })))

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

export default function AdminDashboard() {
  const [liveData, setLiveData] = React.useState({
    totalReports: reports.length,
    totalUsers: users.length,
    totalDepartments: departments.length,
    criticalReports: reports.filter(r => r.priority === 'critical').length
  })

  // Simulate live data updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveData(prev => ({
        totalReports: prev.totalReports + Math.floor(Math.random() * 3),
        totalUsers: prev.totalUsers + Math.floor(Math.random() * 2),
        totalDepartments: prev.totalDepartments,
        criticalReports: prev.criticalReports + Math.floor(Math.random() * 2)
      }))
    }, 5000) // Update every 5 seconds

    return () => clearInterval(interval)
  }, [])

  // Calculate statistics with live data
  const totalReports = liveData.totalReports
  const totalUsers = liveData.totalUsers
  const totalDepartments = liveData.totalDepartments
  const criticalReports = liveData.criticalReports

  // Reports by status
  const statusData = [
    { name: 'Submitted', value: reports.filter(r => r.status === 'submitted').length },
    { name: 'Assigned', value: reports.filter(r => r.status === 'assigned').length },
    { name: 'In Progress', value: reports.filter(r => r.status === 'in_progress').length },
    { name: 'Resolved', value: reports.filter(r => r.status === 'resolved').length },
  ]

  // Reports by department
  const departmentData = departments.map(dept => ({
    name: dept.code,
    reports: reports.filter(r => r.department === dept.id).length
  }))

  // Reports over time (mock data)
  const timeData = [
    { date: '2025-09-01', reports: 2 },
    { date: '2025-09-05', reports: 3 },
    { date: '2025-09-10', reports: 5 },
    { date: '2025-09-15', reports: 4 },
  ]

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-blue-100 text-lg">System overview and management</p>
      </div>

      {/* Statistics Cards with Live Updates */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-in-up">
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total Reports</p>
                <p className="text-3xl font-bold animate-count-up">{totalReports}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-blue-200">Live</span>
                </div>
              </div>
              <FileText className="h-8 w-8 text-blue-200 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-in-up" style={{animationDelay: '0.1s'}}>
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-green-100 text-sm font-medium">Total Users</p>
                <p className="text-3xl font-bold animate-count-up">{totalUsers}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-green-200">Live</span>
                </div>
              </div>
              <Users className="h-8 w-8 text-green-200 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-in-up" style={{animationDelay: '0.2s'}}>
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-purple-100 text-sm font-medium">Departments</p>
                <p className="text-3xl font-bold animate-count-up">{totalDepartments}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-purple-200">Active</span>
                </div>
              </div>
              <Building2 className="h-8 w-8 text-purple-200 animate-pulse" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 animate-slide-in-up" style={{animationDelay: '0.3s'}}>
          <CardContent className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
            <div className="flex items-center justify-between relative z-10">
              <div>
                <p className="text-red-100 text-sm font-medium">Critical Issues</p>
                <p className="text-3xl font-bold animate-count-up">{criticalReports}</p>
                <div className="flex items-center mt-2">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse mr-2"></div>
                  <span className="text-xs text-red-200">Alert</span>
                </div>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-200 animate-pulse" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Status */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-800">Reports by Status</CardTitle>
            <CardDescription className="text-gray-600">Distribution of report statuses</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Suspense fallback={<div className="h-[300px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Suspense>
          </CardContent>
        </Card>

        {/* Reports by Department */}
        <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-800">Reports by Department</CardTitle>
            <CardDescription className="text-gray-600">Report distribution across departments</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Suspense fallback={<div className="h-[300px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="reports" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Reports Over Time */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-lg">
          <CardTitle className="text-xl font-bold text-gray-800">Reports Over Time</CardTitle>
          <CardDescription className="text-gray-600">Daily report submission trends</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Suspense fallback={<div className="h-[300px] flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="reports" stroke="#3B82F6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </Suspense>
        </CardContent>
      </Card>

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
