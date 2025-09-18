'use client'

import React from 'react'
import { useAppSelector } from '@/redux/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { reports, departments, users } from '@/lib/seedData.js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts'
import { FileText, Users, Building2, AlertTriangle } from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

export default function AdminDashboard() {

  // Calculate statistics
  const totalReports = reports.length
  const totalUsers = users.length
  const totalDepartments = departments.length
  const criticalReports = reports.filter(r => r.priority === 'critical').length

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
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">System overview and management</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalReports}</div>
            <p className="text-xs text-muted-foreground">All time reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Active system users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDepartments}</div>
            <p className="text-xs text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{criticalReports}</div>
            <p className="text-xs text-muted-foreground">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Reports by Status</CardTitle>
            <CardDescription>Distribution of report statuses</CardDescription>
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
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Reports by Department */}
        <Card>
          <CardHeader>
            <CardTitle>Reports by Department</CardTitle>
            <CardDescription>Report distribution across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={departmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="reports" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Reports Over Time */}
      <Card>
        <CardHeader>
          <CardTitle>Reports Over Time</CardTitle>
          <CardDescription>Daily report submission trends</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="reports" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
          <CardDescription>Latest submitted reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Department</th>
                  <th className="text-left p-2">Priority</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {reports.slice(0, 5).map((report) => {
                  const dept = departments.find(d => d.id === report.department)
                  return (
                    <tr key={report.id} className="border-b">
                      <td className="p-2">#{report.id}</td>
                      <td className="p-2">{report.title}</td>
                      <td className="p-2">{dept?.name}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          report.priority === 'critical' ? 'bg-red-100 text-red-800' :
                          report.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {report.priority}
                        </span>
                      </td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                          report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          report.status === 'assigned' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {report.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-2">{report.createdAt}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
