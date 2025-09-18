'use client'

import { useState } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
// Mock data for reports
const reports = [
  {
    id: 1,
    title: 'Water Pipeline Burst',
    description: 'Major water pipeline burst on Main Street causing flooding',
    priority: 'critical',
    status: 'pending',
    department: 4,
    assignedTo: 13,
    location: 'Main Street, Sector 5',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 2,
    title: 'Road Pothole Repair',
    description: 'Large pothole on Highway 23 needs immediate attention',
    priority: 'high',
    status: 'in_progress',
    department: 2,
    assignedTo: 9,
    location: 'Highway 23, Km 15',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  },
  {
    id: 3,
    title: 'Street Light Malfunction',
    description: 'Multiple street lights not working in residential area',
    priority: 'medium',
    status: 'resolved',
    department: 3,
    assignedTo: 11,
    location: 'Green Valley Colony',
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-14T12:30:00Z'
  },
  {
    id: 4,
    title: 'Park Maintenance Required',
    description: 'Central park needs cleaning and maintenance',
    priority: 'low',
    status: 'pending',
    department: 5,
    assignedTo: 15,
    location: 'Central Park',
    createdAt: '2024-01-12T11:00:00Z',
    updatedAt: '2024-01-12T11:00:00Z'
  },
  {
    id: 5,
    title: 'Sewage Overflow',
    description: 'Sewage overflow near residential complex',
    priority: 'critical',
    status: 'in_progress',
    department: 1,
    assignedTo: 7,
    location: 'Sunrise Apartments',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z'
  }
]

const departments = [
  { id: 1, name: 'Sanitation Department' },
  { id: 2, name: 'Public Works Department' },
  { id: 3, name: 'Electrical Department' },
  { id: 4, name: 'Water Department' },
  { id: 5, name: 'Parks Department' }
]

const users = [
  { id: 7, name: 'Staff A' },
  { id: 9, name: 'Staff C' },
  { id: 11, name: 'Staff E' },
  { id: 13, name: 'Staff G' },
  { id: 15, name: 'Staff I' }
]
import { priorityColors, statusColors, formatDate } from '@/lib/utils'
import { Filter, Search, Plus } from 'lucide-react'

export default function ReportsPage() {
  const { user } = useAppSelector((state) => state.auth)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')

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
            <div className="space-y-4">
              {filteredReports.map((report) => {
                const department = departments.find(d => d.id === report.department)
                const assignedUser = users.find(u => u.id === report.assignedTo)
                
                return (
                  <div key={report.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-lg">#{report.id}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs border ${priorityColors[report.priority as keyof typeof priorityColors]}`}>
                            {report.priority}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs border ${statusColors[report.status as keyof typeof statusColors]}`}>
                            {report.status.replace('_', ' ')}
                          </span>
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1">{report.title}</h4>
                        <p className="text-sm text-gray-600 mb-2">Category: {report.category}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>Department: {department?.name}</span>
                          <span>Assigned to: {assignedUser?.name || 'Unassigned'}</span>
                          <span>Created: {formatDate(report.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {(user?.role === 'admin' || user?.role === 'department_head') && (
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
