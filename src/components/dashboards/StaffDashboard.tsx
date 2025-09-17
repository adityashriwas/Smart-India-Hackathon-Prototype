'use client'

import { useAppSelector, useAppDispatch } from '@/redux/hooks'
import { updateReport } from '@/redux/slices/reportSlice'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { reports, users, departments } from '@/lib/seedData.js'
import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function StaffDashboard() {
  const { user } = useAppSelector((state) => state.auth)
  const dispatch = useAppDispatch()
  
  // Filter reports assigned to current staff member
  const myReports = reports.filter(r => r.assignedTo === user?.id)
  const department = departments.find(d => d.id === user?.department)

  // Calculate statistics
  const totalAssigned = myReports.length
  const inProgress = myReports.filter(r => r.status === 'in_progress').length
  const completed = myReports.filter(r => r.status === 'resolved').length
  const pending = myReports.filter(r => r.status === 'assigned').length

  const handleStatusUpdate = (reportId: number, newStatus: string) => {
    dispatch(updateReport({ id: reportId, updates: { status: newStatus } }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-gray-600">{department?.name} Department - {user?.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assigned</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAssigned}</div>
            <p className="text-xs text-muted-foreground">All time assignments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting action</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{inProgress}</div>
            <p className="text-xs text-muted-foreground">Currently working</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{completed}</div>
            <p className="text-xs text-muted-foreground">Successfully resolved</p>
          </CardContent>
        </Card>
      </div>

      {/* My Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>My Assigned Tasks</CardTitle>
          <CardDescription>Reports assigned to you for resolution</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {myReports.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No reports assigned to you yet.</p>
            ) : (
              myReports.map((report) => (
                <div key={report.id} className="border rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">#{report.id} - {report.title}</h3>
                      <p className="text-gray-600 text-sm">Category: {report.category}</p>
                      <p className="text-gray-500 text-sm">Created: {report.createdAt}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.priority === 'critical' ? 'bg-red-100 text-red-800' :
                        report.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                        report.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {report.priority} priority
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        report.status === 'resolved' ? 'bg-green-100 text-green-800' :
                        report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                        report.status === 'assigned' ? 'bg-purple-100 text-purple-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    {report.status === 'assigned' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(report.id, 'in_progress')}
                        className="bg-yellow-600 hover:bg-yellow-700"
                      >
                        Start Working
                      </Button>
                    )}
                    {report.status === 'in_progress' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(report.id, 'resolved')}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark Resolved
                      </Button>
                    )}
                    {report.status === 'resolved' && (
                      <span className="text-green-600 text-sm font-medium flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <FileText className="h-6 w-6" />
              <span>View All Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <Clock className="h-6 w-6" />
              <span>Update Status</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col space-y-2">
              <CheckCircle className="h-6 w-6" />
              <span>Mark Complete</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
