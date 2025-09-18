'use client'

import React from 'react'
import { useAppSelector } from '@/redux/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { reports, departments, users } from '@/lib/seedData.js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity, Download, Filter, Calendar, MapPin, Users, AlertTriangle } from 'lucide-react'
import { RBACService, mockUsers, type User } from '@/lib/rbac'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export default function AnalyticsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [currentUser] = React.useState<User>(mockUsers[1]) // Default to admin for demo
  const [selectedTimeRange, setSelectedTimeRange] = React.useState('30d')
  const [selectedDepartment, setSelectedDepartment] = React.useState('all')
  const [liveMetrics, setLiveMetrics] = React.useState({
    activeUsers: 156,
    avgResponseTime: 3.2,
    satisfactionScore: 87,
    systemLoad: 68
  })

  // Simulate live metrics updates
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLiveMetrics(prev => ({
        activeUsers: Math.max(100, prev.activeUsers + Math.floor((Math.random() - 0.5) * 10)),
        avgResponseTime: Math.max(1, prev.avgResponseTime + (Math.random() - 0.5) * 0.3),
        satisfactionScore: Math.min(100, Math.max(70, prev.satisfactionScore + (Math.random() - 0.5) * 3)),
        systemLoad: Math.min(100, Math.max(30, prev.systemLoad + (Math.random() - 0.5) * 8))
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Filter data based on user role
  const getFilteredReports = () => {
    if (user?.role === 'department_head') {
      return reports.filter(r => r.department === user.department)
    }
    return reports
  }

  const filteredReports = getFilteredReports()

  // Reports by status
  const statusData = [
    { name: 'Submitted', value: filteredReports.filter(r => r.status === 'submitted').length, color: '#3B82F6' },
    { name: 'Assigned', value: filteredReports.filter(r => r.status === 'assigned').length, color: '#8B5CF6' },
    { name: 'In Progress', value: filteredReports.filter(r => r.status === 'in_progress').length, color: '#F59E0B' },
    { name: 'Resolved', value: filteredReports.filter(r => r.status === 'resolved').length, color: '#10B981' },
  ]

  // Reports by priority
  const priorityData = [
    { name: 'Low', value: filteredReports.filter(r => r.priority === 'low').length, color: '#10B981' },
    { name: 'Medium', value: filteredReports.filter(r => r.priority === 'medium').length, color: '#F59E0B' },
    { name: 'High', value: filteredReports.filter(r => r.priority === 'high').length, color: '#EF4444' },
    { name: 'Critical', value: filteredReports.filter(r => r.priority === 'critical').length, color: '#DC2626' },
  ]

  // Reports by department (for admin view)
  const departmentData = user?.role === 'admin' ? departments.map(dept => ({
    name: dept.code,
    fullName: dept.name,
    reports: reports.filter(r => r.department === dept.id).length,
    resolved: reports.filter(r => r.department === dept.id && r.status === 'resolved').length,
    pending: reports.filter(r => r.department === dept.id && r.status !== 'resolved').length
  })) : []

  // Reports over time (mock monthly data)
  const timeData = [
    { month: 'Jan', submitted: 8, resolved: 6 },
    { month: 'Feb', submitted: 12, resolved: 10 },
    { month: 'Mar', submitted: 15, resolved: 12 },
    { month: 'Apr', submitted: 10, resolved: 14 },
    { month: 'May', submitted: 18, resolved: 16 },
    { month: 'Jun', submitted: 14, resolved: 15 },
  ]

  // Category breakdown
  const categoryData = [
    { name: 'Garbage', value: filteredReports.filter(r => r.category === 'garbage').length },
    { name: 'Pothole', value: filteredReports.filter(r => r.category === 'pothole').length },
    { name: 'Streetlight', value: filteredReports.filter(r => r.category === 'streetlight').length },
    { name: 'Leakage', value: filteredReports.filter(r => r.category === 'leakage').length },
    { name: 'Infrastructure', value: filteredReports.filter(r => r.category === 'infrastructure').length },
    { name: 'Others', value: filteredReports.filter(r => !['garbage', 'pothole', 'streetlight', 'leakage', 'infrastructure'].includes(r.category)).length },
  ].filter(item => item.value > 0)

  // Performance radar data
  const performanceData = [
    { subject: 'Response Time', A: 85, B: 78, fullMark: 100 },
    { subject: 'Resolution Rate', A: 92, B: 85, fullMark: 100 },
    { subject: 'Citizen Satisfaction', A: liveMetrics.satisfactionScore, B: 82, fullMark: 100 },
    { subject: 'Team Efficiency', A: 88, B: 80, fullMark: 100 },
    { subject: 'Resource Utilization', A: 75, B: 70, fullMark: 100 },
    { subject: 'Cost Effectiveness', A: 80, B: 75, fullMark: 100 },
  ]

  // Predictive analytics data
  const predictiveData = [
    { month: 'Jul', predicted: 22, actual: 18, trend: 'up' },
    { month: 'Aug', predicted: 25, actual: null, trend: 'up' },
    { month: 'Sep', predicted: 28, actual: null, trend: 'up' },
    { month: 'Oct', predicted: 24, actual: null, trend: 'down' },
  ]

  return (
    <div className="space-y-6">
      {/* Enhanced Header with Controls */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">Advanced Analytics Dashboard</h1>
            <p className="text-indigo-100">
              {currentUser?.role === 'admin' ? 'Comprehensive system-wide analytics and predictive insights' :
               currentUser?.role === 'department_head' ? 'Department analytics and performance metrics' :
               'Personal performance analytics'}
            </p>
          </div>
          <div className="flex space-x-4">
            <select 
              value={selectedTimeRange} 
              onChange={(e) => setSelectedTimeRange(e.target.value)}
              className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option value="7d" className="text-gray-800">Last 7 Days</option>
              <option value="30d" className="text-gray-800">Last 30 Days</option>
              <option value="90d" className="text-gray-800">Last 90 Days</option>
              <option value="1y" className="text-gray-800">Last Year</option>
            </select>
            
            {RBACService.hasPermission(currentUser, 'system:export_data') && (
              <button className="px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white hover:bg-white/30 transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Live System Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Active Users</p>
                <p className="text-2xl font-bold">{liveMetrics.activeUsers}</p>
              </div>
              <Users className="w-8 h-8 text-blue-200" />
            </div>
            <div className="mt-2 flex items-center">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></div>
              <span className="text-xs text-blue-100">Live</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Avg Response</p>
                <p className="text-2xl font-bold">{liveMetrics.avgResponseTime.toFixed(1)}h</p>
              </div>
              <Activity className="w-8 h-8 text-green-200" />
            </div>
            <div className="mt-2 flex items-center">
              <TrendingUp className="w-3 h-3 text-green-200 mr-1" />
              <span className="text-xs text-green-100">Improving</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Satisfaction</p>
                <p className="text-2xl font-bold">{Math.round(liveMetrics.satisfactionScore)}%</p>
              </div>
              <PieChartIcon className="w-8 h-8 text-purple-200" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-purple-400 rounded-full h-1">
                <div className="bg-white h-1 rounded-full" style={{width: `${liveMetrics.satisfactionScore}%`}}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">System Load</p>
                <p className="text-2xl font-bold">{Math.round(liveMetrics.systemLoad)}%</p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-200" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-orange-400 rounded-full h-1">
                <div className="bg-white h-1 rounded-full" style={{width: `${liveMetrics.systemLoad}%`}}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{filteredReports.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolution Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((filteredReports.filter(r => r.status === 'resolved').length / filteredReports.length) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2 days</div>
            <p className="text-xs text-muted-foreground">
              -0.5 days from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <PieChartIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {filteredReports.filter(r => r.priority === 'critical').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Report Status Distribution</CardTitle>
            <CardDescription>Current status breakdown of all reports</CardDescription>
          </CardHeader>
          <CardContent>
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
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Priority Distribution</CardTitle>
            <CardDescription>Reports categorized by priority level</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance (Admin Only) */}
      {user?.role === 'admin' && (
        <Card>
          <CardHeader>
            <CardTitle>Department Performance</CardTitle>
            <CardDescription>Reports and resolution rates by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  labelFormatter={(label) => {
                    const dept = departmentData.find(d => d.name === label)
                    return dept?.fullName || label
                  }}
                />
                <Bar dataKey="reports" fill="#3B82F6" name="Total Reports" />
                <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
                <Bar dataKey="pending" fill="#F59E0B" name="Pending" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Reports Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Reports Trend</CardTitle>
          <CardDescription>Monthly report submission and resolution trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="submitted" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="resolved" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Advanced Performance Radar Chart */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Performance Radar</CardTitle>
            <CardDescription>Multi-dimensional performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={performanceData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                <Radar name="Current Period" dataKey="A" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} strokeWidth={2} />
                <Radar name="Previous Period" dataKey="B" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Categories</CardTitle>
            <CardDescription>Distribution of reports by issue category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: { name: string; percent: number }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Predictive Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            Predictive Analytics
            <div className="ml-2 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">AI Powered</div>
          </CardTitle>
          <CardDescription>Machine learning predictions for upcoming trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={predictiveData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="actual" stroke="#3B82F6" strokeWidth={3} name="Actual Reports" />
              <Line type="monotone" dataKey="predicted" stroke="#EF4444" strokeWidth={3} strokeDasharray="5 5" name="Predicted Reports" />
            </LineChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-blue-800">Trend Analysis</p>
              <p className="text-xs text-blue-600">15% increase expected next quarter</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm font-medium text-purple-800">Resource Planning</p>
              <p className="text-xs text-purple-600">Recommend 2 additional teams</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
