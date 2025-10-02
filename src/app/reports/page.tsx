'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '@/redux/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { reports, departments, users } from '@/lib/seedData.js'
import { priorityColors, statusColors, formatDate } from '@/lib/utils'
import { Filter, Search, Plus } from 'lucide-react'

export default function ReportsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const router = useRouter()

  // Filter reports based on user role
  const getFilteredReports = () => {
    let filteredReports = reports

    // Role-based filtering
    if (user?.role === 'department_head') {
      filteredReports = reports.filter(r => r.department === user.department)
    } else if (user?.role === 'staff') {
      filteredReports = reports.filter(r => r.assignedTo === user.id)
    }

    // Search filter
    if (searchTerm) {
      filteredReports = filteredReports.filter(r => 
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Status filter
    if (statusFilter !== 'all') {
      filteredReports = filteredReports.filter(r => r.status === statusFilter)
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filteredReports = filteredReports.filter(r => r.priority === priorityFilter)
    }

    return filteredReports
  }

  const filteredReports = getFilteredReports()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600">
            {user?.role === 'admin' ? 'All system reports' :
             user?.role === 'department_head' ? 'Department reports' :
             'My assigned reports'}
          </p>
        </div>
        {user?.role === 'admin' && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Report
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="submitted">Submitted</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
            </select>

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            {/* Clear Filters */}
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('')
                setStatusFilter('all')
                setPriorityFilter('all')
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Reports ({filteredReports.length})</CardTitle>
          <CardDescription>
            {filteredReports.length === reports.length ? 'All reports' : `Filtered from ${reports.length} total reports`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredReports.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No reports found matching your criteria.</p>
              <p className="text-gray-400 text-sm mt-2">Try adjusting your filters or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReports.map((report) => {
                const department = departments.find(d => d.id === report.department)
                const assignedUser = users.find(u => u.id === report.assignedTo)
                
                return (
                  <Card key={report.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    {/* Report Image */}
                    <div className="relative">
                      <img
                        src={report.image}
                        alt={report.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[report.priority as keyof typeof priorityColors]}`}>
                          {report.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[report.status as keyof typeof statusColors]}`}>
                          {report.status.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Report Content */}
                    <CardContent className="p-4">
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-gray-900">#{report.id}</h3>
                          <span className="text-xs text-gray-500">{formatDate(report.createdAt)}</span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{report.title}</h4>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {report.description || `${report.category} issue reported`}
                        </p>
                      </div>

                      {/* Department and Assignment Info */}
                      <div className="space-y-1 mb-4 text-xs text-gray-500">
                        <div className="flex items-center justify-between">
                          <span>Department:</span>
                          <span className="font-medium">{department?.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Assigned to:</span>
                          <span className="font-medium">{assignedUser?.name || 'Unassigned'}</span>
                        </div>
                        {report.location && (
                          <div className="flex items-center justify-between">
                            <span>Location:</span>
                            <span className="font-medium truncate ml-2" title={report.location}>
                              {report.location.length > 20 ? `${report.location.substring(0, 20)}...` : report.location}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => router.push(`/reports/${report.id}`)}
                        >
                          View Details
                        </Button>
                        {(user?.role === 'admin' || user?.role === 'department_head') && (
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
