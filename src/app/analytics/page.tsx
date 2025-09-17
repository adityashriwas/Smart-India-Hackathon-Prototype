'use client'

import { useAppSelector } from '@/redux/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { reports, departments, users } from '@/lib/seedData.js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { TrendingUp, BarChart3, PieChart as PieChartIcon, Activity } from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4']

export default function AnalyticsPage() {
  const { user } = useAppSelector((state) => state.auth)

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">
          {user?.role === 'admin' ? 'System-wide analytics and insights' :
           user?.role === 'department_head' ? 'Department analytics and performance metrics' :
           'Personal performance analytics'}
        </p>
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
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
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
  )
}
