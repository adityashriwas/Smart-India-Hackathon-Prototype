'use client'

import { useState } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { users, departments, reports } from '@/lib/seedData.js'
import { User, UserCheck, UserX, Shield, Crown, Briefcase } from 'lucide-react'

export default function UsersPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedDepartment, setSelectedDepartment] = useState('all')

  // Only admin can access this page
  if (user?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Access denied. Admin privileges required.</p>
      </div>
    )
  }

  const filteredUsers = users.filter(u => {
    if (selectedRole !== 'all' && u.role !== selectedRole) return false
    if (selectedDepartment !== 'all' && u.department !== parseInt(selectedDepartment)) return false
    return true
  })

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Shield className="h-4 w-4 text-blue-600" />
      case 'department_head': return <Crown className="h-4 w-4 text-green-600" />
      case 'staff': return <Briefcase className="h-4 w-4 text-purple-600" />
      default: return <User className="h-4 w-4 text-gray-600" />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'department_head': return 'bg-green-100 text-green-800 border-green-200'
      case 'staff': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getUserStats = (userId: number) => {
    const userReports = reports.filter(r => r.assignedTo === userId)
    return {
      totalAssigned: userReports.length,
      resolved: userReports.filter(r => r.status === 'resolved').length,
      inProgress: userReports.filter(r => r.status === 'in_progress').length,
      pending: userReports.filter(r => r.status === 'assigned').length
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage system users and their roles</p>
        </div>
        <Button>
          <User className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">All system users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</div>
            <p className="text-xs text-muted-foreground">System administrators</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Department Heads</CardTitle>
            <Crown className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'department_head').length}</div>
            <p className="text-xs text-muted-foreground">Department managers</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Staff</CardTitle>
            <Briefcase className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter(u => u.role === 'staff').length}</div>
            <p className="text-xs text-muted-foreground">Staff members</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="admin">Admin</option>
                <option value="department_head">Department Head</option>
                <option value="staff">Staff</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Departments</option>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedRole('all')
                  setSelectedDepartment('all')
                }}
                className="w-full"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            {filteredUsers.length === users.length ? 'All users' : `Filtered from ${users.length} total users`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((userData) => {
              const department = departments.find(d => d.id === userData.department)
              const stats = userData.role === 'staff' ? getUserStats(userData.id) : null
              const manager = userData.manager ? users.find(u => u.id === userData.manager) : null

              return (
                <div key={userData.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {getRoleIcon(userData.role)}
                        <h3 className="font-semibold text-lg">{userData.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getRoleColor(userData.role)}`}>
                          {userData.role.replace('_', ' ')}
                        </span>
                        {userData.isActive ? (
                          <UserCheck className="h-4 w-4 text-green-500" />
                        ) : (
                          <UserX className="h-4 w-4 text-red-500" />
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Email:</span>
                          <div>{userData.email}</div>
                        </div>
                        
                        {department && (
                          <div>
                            <span className="font-medium">Department:</span>
                            <div>{department.name}</div>
                          </div>
                        )}

                        {manager && (
                          <div>
                            <span className="font-medium">Manager:</span>
                            <div>{manager.name}</div>
                          </div>
                        )}

                        <div>
                          <span className="font-medium">Status:</span>
                          <div className={userData.isActive ? 'text-green-600' : 'text-red-600'}>
                            {userData.isActive ? 'Active' : 'Inactive'}
                          </div>
                        </div>
                      </div>

                      {/* Staff Performance Stats */}
                      {stats && (
                        <div className="mt-3 pt-3 border-t">
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                              <div className="font-semibold text-blue-600">{stats.totalAssigned}</div>
                              <div className="text-gray-500">Assigned</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-yellow-600">{stats.pending}</div>
                              <div className="text-gray-500">Pending</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-orange-600">{stats.inProgress}</div>
                              <div className="text-gray-500">In Progress</div>
                            </div>
                            <div className="text-center">
                              <div className="font-semibold text-green-600">{stats.resolved}</div>
                              <div className="text-gray-500">Resolved</div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className={userData.isActive ? 'text-white hover:text-red-500' : 'text-green-600 hover:text-green-700'}
                      >
                        {userData.isActive ? 'Deactivate' : 'Activate'}
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
