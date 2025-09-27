'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, Layers, Filter, RefreshCw, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react'

// Mock location data for Jharkhand
const mockIssues = [
  {
    id: 1,
    title: 'Water Pipeline Burst',
    priority: 'critical',
    status: 'pending',
    location: { lat: 23.3441, lng: 85.3096, name: 'Main Street, Ranchi' },
    department: 'Water Department',
    assignedTo: 'Team A',
    reportedAt: '2024-01-15T10:30:00Z',
    description: 'Major water pipeline burst causing flooding'
  },
  {
    id: 2,
    title: 'Road Pothole',
    priority: 'high',
    status: 'in_progress',
    location: { lat: 23.3629, lng: 85.3346, name: 'Highway 23, Ranchi' },
    department: 'Public Works',
    assignedTo: 'Team B',
    reportedAt: '2024-01-14T14:20:00Z',
    description: 'Large pothole needs immediate repair'
  },
  {
    id: 3,
    title: 'Street Light Issue',
    priority: 'medium',
    status: 'resolved',
    location: { lat: 23.3569, lng: 85.3239, name: 'Green Valley, Ranchi' },
    department: 'Electrical',
    assignedTo: 'Team C',
    reportedAt: '2024-01-13T16:45:00Z',
    description: 'Multiple street lights not working'
  },
  {
    id: 4,
    title: 'Sewage Overflow',
    priority: 'critical',
    status: 'pending',
    location: { lat: 23.3733, lng: 85.3168, name: 'Sunrise Apartments, Ranchi' },
    department: 'Sanitation',
    assignedTo: 'Team D',
    reportedAt: '2024-01-15T08:00:00Z',
    description: 'Sewage overflow near residential area'
  },
  {
    id: 5,
    title: 'Park Maintenance',
    priority: 'low',
    status: 'pending',
    location: { lat: 23.3515, lng: 85.3203, name: 'Central Park, Ranchi' },
    department: 'Parks',
    assignedTo: 'Team E',
    reportedAt: '2024-01-12T11:00:00Z',
    description: 'Regular maintenance required'
  }
]

const priorityColors = {
  critical: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-green-500'
}

const statusColors = {
  pending: 'bg-gray-500',
  in_progress: 'bg-blue-500',
  resolved: 'bg-green-600',
  closed: 'bg-purple-500'
}

export default function InteractiveMap() {
  const [selectedIssue, setSelectedIssue] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [mapView, setMapView] = useState('satellite') // satellite, terrain, roadmap
  const [isLoading, setIsLoading] = useState(false)

  const filteredIssues = mockIssues.filter(issue => {
    const statusMatch = filterStatus === 'all' || issue.status === filterStatus
    const priorityMatch = filterPriority === 'all' || issue.priority === filterPriority
    return statusMatch && priorityMatch
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'in_progress': return <RefreshCw className="w-4 h-4 animate-spin" />
      case 'resolved': return <CheckCircle className="w-4 h-4" />
      default: return <AlertTriangle className="w-4 h-4" />
    }
  }

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }

  return (
    <div className="space-y-6">
      {/* Map Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Real-Time Issue Allocation Map
              </CardTitle>
              <CardDescription>
                Interactive map showing live civic issues across Jharkhand with intelligent team assignment
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Navigation className="w-4 h-4" />
                Center Map
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 mb-4">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="flex items-center gap-2">
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Map View Toggle */}
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-500" />
              <select
                value={mapView}
                onChange={(e) => setMapView(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="roadmap">Road Map</option>
                <option value="satellite">Satellite</option>
                <option value="terrain">Terrain</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Stats */}
            <div className="ml-auto flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Critical: {filteredIssues.filter(i => i.priority === 'critical').length}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                In Progress: {filteredIssues.filter(i => i.status === 'in_progress').length}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                Pending: {filteredIssues.filter(i => i.status === 'pending').length}
              </span>
            </div>
          </div>

          {/* Interactive Map Container */}
          <div className="relative">
            {/* Map Placeholder with Google Maps-like interface */}
            <div className="w-full h-96 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg border-2 border-gray-200 relative overflow-hidden">
              {/* Map Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" viewBox="0 0 400 300">
                  <defs>
                    <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#666" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Map Title Overlay */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg">
                <h3 className="font-semibold text-gray-800">Ranchi Municipal Area</h3>
                <p className="text-xs text-gray-600">Jharkhand, India</p>
              </div>

              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden">
                <button className="p-2 hover:bg-gray-50 border-b border-gray-200">
                  <span className="text-lg font-bold">+</span>
                </button>
                <button className="p-2 hover:bg-gray-50">
                  <span className="text-lg font-bold">−</span>
                </button>
              </div>

              {/* Issue Markers */}
              {filteredIssues.map((issue, index) => (
                <div
                  key={issue.id}
                  className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110 ${
                    selectedIssue?.id === issue.id ? 'scale-125 z-20' : 'z-10'
                  }`}
                  style={{
                    left: `${20 + (index * 15) % 60}%`,
                    top: `${30 + (index * 12) % 40}%`
                  }}
                  onClick={() => setSelectedIssue(issue)}
                >
                  {/* Marker Pin */}
                  <div className={`w-8 h-8 rounded-full ${priorityColors[issue.priority as keyof typeof priorityColors]} shadow-lg flex items-center justify-center relative`}>
                    <MapPin className="w-4 h-4 text-white" />
                    {/* Pulse animation for critical issues */}
                    {issue.priority === 'critical' && (
                      <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
                    )}
                  </div>
                  
                  {/* Issue Info Popup */}
                  {selectedIssue?.id === issue.id && (
                    <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-xl border p-4 min-w-64 z-30">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">{issue.title}</h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedIssue(null)
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          ×
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{issue.description}</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`${priorityColors[issue.priority as keyof typeof priorityColors]} text-white border-0`}>
                            {issue.priority}
                          </Badge>
                          <Badge variant="outline" className={`${statusColors[issue.status as keyof typeof statusColors]} text-white border-0 flex items-center gap-1`}>
                            {getStatusIcon(issue.status)}
                            {issue.status.replace('_', ' ')}
                          </Badge>
                        </div>
                        <div className="text-xs text-gray-500">
                          <p><strong>Location:</strong> {issue.location.name}</p>
                          <p><strong>Department:</strong> {issue.department}</p>
                          <p><strong>Assigned to:</strong> {issue.assignedTo}</p>
                          <p><strong>Reported:</strong> {new Date(issue.reportedAt).toLocaleDateString()}</p>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button size="sm" className="flex-1">
                            <Users className="w-3 h-3 mr-1" />
                            Assign Team
                          </Button>
                          <Button size="sm" variant="outline" className="flex-1">
                            <Navigation className="w-3 h-3 mr-1" />
                            Navigate
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {/* Map Legend */}
              <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg">
                <h4 className="text-sm font-semibold mb-2">Priority Levels</h4>
                <div className="space-y-1">
                  {Object.entries(priorityColors).map(([priority, color]) => (
                    <div key={priority} className="flex items-center gap-2 text-xs">
                      <div className={`w-3 h-3 rounded-full ${color}`}></div>
                      <span className="capitalize">{priority}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-lg">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-sm text-gray-600">Updating map data...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issue Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical Issues</p>
                <p className="text-2xl font-bold text-red-600">
                  {filteredIssues.filter(i => i.priority === 'critical').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <RefreshCw className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-blue-600">
                  {filteredIssues.filter(i => i.status === 'in_progress').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-600">
                  {filteredIssues.filter(i => i.status === 'pending').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Resolved Today</p>
                <p className="text-2xl font-bold text-green-600">
                  {filteredIssues.filter(i => i.status === 'resolved').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
