'use client'

import { useAppSelector } from '@/redux/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { reports, departments, users } from '@/lib/seedData.js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { FileText, Users, Clock, CheckCircle } from 'lucide-react'

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444']

export default function DepartmentHeadDashboard() {
  const { user } = useAppSelector((state) => state.auth)
  
  // Filter data for current department
  const departmentReports = reports.filter(r => r.department === user?.department)
  const departmentStaff = users.filter(u => u.role === 'staff' && u.department === user?.department)
  const department = departments.find(d => d.id === user?.department)

  // Calculate statistics
  const totalReports = departmentReports.length
  const pendingReports = departmentReports.filter(r => r.status !== 'resolved').length
  const resolvedReports = departmentReports.filter(r => r.status === 'resolved').length
  const totalStaff = departmentStaff.length

  // Reports by status
  const statusData = [
    { name: 'Submitted', value: departmentReports.filter(r => r.status === 'submitted').length },
    { name: 'Assigned', value: departmentReports.filter(r => r.status === 'assigned').length },
    { name: 'In Progress', value: departmentReports.filter(r => r.status === 'in_progress').length },
    { name: 'Resolved', value: departmentReports.filter(r => r.status === 'resolved').length },
  ]

  // Staff performance
  const staffPerformance = departmentStaff.map(staff => ({
    name: staff.name,
    assigned: departmentReports.filter(r => r.assignedTo === staff.id).length,
    resolved: departmentReports.filter(r => r.assignedTo === staff.id && r.status === 'resolved').length
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Department Dashboard</h1>
        <p className="text-gray-600">{department?.name} Department Overview</p>
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
            <p className="text-xs text-muted-foreground">Department reports</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{pendingReports}</div>
            <p className="text-xs text-muted-foreground">Awaiting resolution</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{resolvedReports}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStaff}</div>
            <p className="text-xs text-muted-foreground">Active team members</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reports by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Report Status Distribution</CardTitle>
            <CardDescription>Current status of department reports</CardDescription>
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

        {/* Staff Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Staff Performance</CardTitle>
            <CardDescription>Reports assigned vs resolved by staff</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={staffPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="assigned" fill="#3B82F6" name="Assigned" />
                <Bar dataKey="resolved" fill="#10B981" name="Resolved" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Department Reports</CardTitle>
          <CardDescription>Recent reports in your department</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">ID</th>
                  <th className="text-left p-2">Title</th>
                  <th className="text-left p-2">Priority</th>
                  <th className="text-left p-2">Status</th>
                  <th className="text-left p-2">Assigned To</th>
                  <th className="text-left p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {departmentReports.slice(0, 8).map((report) => {
                  const assignedStaff = users.find(u => u.id === report.assignedTo)
                  return (
                    <tr key={report.id} className="border-b">
                      <td className="p-2">#{report.id}</td>
                      <td className="p-2">{report.title}</td>
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
                      <td className="p-2">{assignedStaff?.name || 'Unassigned'}</td>
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
