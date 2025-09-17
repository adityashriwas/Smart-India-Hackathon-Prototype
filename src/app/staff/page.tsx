'use client'

import { useAppSelector } from '@/redux/hooks'
import { users, departments } from '@/lib/seedData'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Phone, MapPin, Calendar, Award, Users as UsersIcon } from 'lucide-react'

export default function StaffPage() {
  const { user } = useAppSelector((state) => state.auth)
  const { reports } = useAppSelector((state) => state.reports)

  // Get department staff (for department heads)
  const departmentStaff = users.filter(u => 
    u.role === 'staff' && u.department === user?.department
  )

  // Get department info
  const department = departments.find(d => d.id === user?.department)

  // Calculate staff performance metrics
  const getStaffMetrics = (staffId: number) => {
    const staffReports = reports.filter(r => r.assignedTo === staffId)
    const completedReports = staffReports.filter(r => r.status === 'resolved')
    const inProgressReports = staffReports.filter(r => r.status === 'in_progress')
    
    return {
      total: staffReports.length,
      completed: completedReports.length,
      inProgress: inProgressReports.length,
      completionRate: staffReports.length > 0 ? Math.round((completedReports.length / staffReports.length) * 100) : 0
    }
  }

  if (user?.role !== 'department_head') {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600">This page is only accessible to Department Heads.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">
            Manage and monitor staff in {department?.name} Department
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <UsersIcon className="h-4 w-4 mr-2" />
          Add Staff Member
        </Button>
      </div>

      {/* Department Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Award className="h-5 w-5 mr-2 text-blue-600" />
            {department?.name} Department Overview
          </CardTitle>
          <CardDescription>{department?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{departmentStaff.length}</div>
              <div className="text-sm text-gray-600">Total Staff</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {departmentStaff.filter(s => s.isActive).length}
              </div>
              <div className="text-sm text-gray-600">Active Staff</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-lg">
              <div className="text-2xl font-bold text-amber-600">
                {reports.filter(r => r.department === user?.department && r.status === 'in_progress').length}
              </div>
              <div className="text-sm text-gray-600">Active Tasks</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {Math.round(
                  departmentStaff.reduce((acc, staff) => {
                    const metrics = getStaffMetrics(staff.id)
                    return acc + metrics.completionRate
                  }, 0) / departmentStaff.length || 0
                )}%
              </div>
              <div className="text-sm text-gray-600">Avg Completion Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Staff List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {departmentStaff.map((staff) => {
          const metrics = getStaffMetrics(staff.id)
          
          return (
            <Card key={staff.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{staff.name}</CardTitle>
                      <CardDescription className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        {staff.email}
                      </CardDescription>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    staff.isActive 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {staff.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Contact Info */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-4 w-4 mr-2" />
                      +91 98765 43210
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-4 w-4 mr-2" />
                      Field Officer
                    </div>
                  </div>

                  {/* Performance Metrics */}
                  <div className="border-t pt-4">
                    <h4 className="font-medium text-gray-900 mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-semibold text-blue-600">{metrics.total}</div>
                        <div className="text-xs text-gray-600">Total Tasks</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-green-600">{metrics.completed}</div>
                        <div className="text-xs text-gray-600">Completed</div>
                      </div>
                      <div>
                        <div className="text-lg font-semibold text-amber-600">{metrics.inProgress}</div>
                        <div className="text-xs text-gray-600">In Progress</div>
                      </div>
                    </div>
                    
                    {/* Completion Rate Bar */}
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600">Completion Rate</span>
                        <span className="font-medium">{metrics.completionRate}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${metrics.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Assign Task
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {departmentStaff.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Staff Members</h3>
            <p className="text-gray-600 mb-4">
              There are no staff members assigned to your department yet.
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Add First Staff Member
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
