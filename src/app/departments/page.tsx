'use client'

import { useState } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { departments, users, reports } from '@/lib/seedData.js'
import { Building2, Users, FileText, Settings } from 'lucide-react'

export default function DepartmentsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [selectedDepartment, setSelectedDepartment] = useState<number | null>(null)

  // Only admin can access this page
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  const getDepartmentStats = (deptId: number) => {
    const deptReports = reports.filter(r => r.department === deptId)
    const deptUsers = users.filter(u => u.department === deptId)
    const deptHead = users.find(u => u.role === 'department_head' && u.department === deptId)
    const deptStaff = users.filter(u => u.role === 'staff' && u.department === deptId)

    return {
      totalReports: deptReports.length,
      pendingReports: deptReports.filter(r => r.status !== 'resolved').length,
      resolvedReports: deptReports.filter(r => r.status === 'resolved').length,
      totalUsers: deptUsers.length,
      departmentHead: deptHead,
      staff: deptStaff,
      resolutionRate: deptReports.length > 0 ? Math.round((deptReports.filter(r => r.status === 'resolved').length / deptReports.length) * 100) : 0
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Department Management</h1>
          <p className="text-gray-600">Manage departments, staff, and performance</p>
        </div>
        <Button>
          <Building2 className="h-4 w-4 mr-2" />
          Add Department
        </Button>
      </div>

      {/* Department Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {departments.map((department) => {
          const stats = getDepartmentStats(department.id)
          
          return (
            <Card key={department.id} className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedDepartment(department.id)}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2 text-blue-600" />
                    {department.name}
                  </CardTitle>
                  <span className="text-sm text-gray-500">#{department.code}</span>
                </div>
                <CardDescription>{department.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{stats.totalReports}</div>
                      <div className="text-xs text-gray-500">Total Reports</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{stats.resolutionRate}%</div>
                      <div className="text-xs text-gray-500">Resolution Rate</div>
                    </div>
                  </div>

                  {/* Department Head */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Department Head:</span>
                      <span className="font-medium">{stats.departmentHead?.name || 'Not assigned'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm mt-1">
                      <span className="text-gray-600">Staff Members:</span>
                      <span className="font-medium">{stats.staff.length}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      <Users className="h-4 w-4 mr-1" />
                      Manage Staff
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Department Details Modal/Panel */}
      {selectedDepartment && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                {departments.find(d => d.id === selectedDepartment)?.name} Department Details
              </CardTitle>
              <Button variant="outline" onClick={() => setSelectedDepartment(null)}>
                Close
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {(() => {
              const dept = departments.find(d => d.id === selectedDepartment)!
              const stats = getDepartmentStats(selectedDepartment)
              
              return (
                <div className="space-y-6">
                  {/* Department Info */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Department Information</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-600">Code:</span> {dept.code}</div>
                        <div><span className="text-gray-600">Description:</span> {dept.description}</div>
                        <div><span className="text-gray-600">Default Priority:</span> 
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                            dept.defaultPriority === 'high' ? 'bg-red-100 text-red-800' :
                            dept.defaultPriority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {dept.defaultPriority}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Performance Metrics</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-600">Total Reports:</span> {stats.totalReports}</div>
                        <div><span className="text-gray-600">Resolved:</span> {stats.resolvedReports}</div>
                        <div><span className="text-gray-600">Pending:</span> {stats.pendingReports}</div>
                        <div><span className="text-gray-600">Resolution Rate:</span> {stats.resolutionRate}%</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Team</h3>
                      <div className="space-y-2 text-sm">
                        <div><span className="text-gray-600">Department Head:</span> {stats.departmentHead?.name || 'Not assigned'}</div>
                        <div><span className="text-gray-600">Staff Count:</span> {stats.staff.length}</div>
                      </div>
                    </div>
                  </div>

                  {/* Staff List */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Staff Members</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stats.departmentHead && (
                        <div className="border rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium">{stats.departmentHead.name}</div>
                              <div className="text-sm text-gray-600">{stats.departmentHead.email}</div>
                              <div className="text-xs text-blue-600 font-medium">Department Head</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">Active</div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {stats.staff.map((staff) => {
                        const staffReports = reports.filter(r => r.assignedTo === staff.id)
                        const staffResolved = staffReports.filter(r => r.status === 'resolved').length
                        
                        return (
                          <div key={staff.id} className="border rounded-lg p-3">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{staff.name}</div>
                                <div className="text-sm text-gray-600">{staff.email}</div>
                                <div className="text-xs text-purple-600 font-medium">Staff</div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm font-medium">{staffReports.length} assigned</div>
                                <div className="text-xs text-gray-500">{staffResolved} resolved</div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Recent Reports */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3">Recent Reports</h3>
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
                          {reports.filter(r => r.department === selectedDepartment).slice(0, 5).map((report) => {
                            const assignedUser = users.find(u => u.id === report.assignedTo)
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
                                <td className="p-2">{assignedUser?.name || 'Unassigned'}</td>
                                <td className="p-2">{report.createdAt}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
