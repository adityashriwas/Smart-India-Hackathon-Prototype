'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MapPin, Navigation, Layers, Filter, RefreshCw, AlertTriangle, CheckCircle, Clock, Users, ExternalLink, Globe } from 'lucide-react'

// Mock location data for Jharkhand with real coordinates
const realLocationData = [
  {
    id: 1,
    title: 'Water Pipeline Burst',
    priority: 'critical',
    status: 'pending',
    coordinates: { lat: 23.3441, lng: 85.3096 },
    address: 'Main Street, Ranchi, Jharkhand 834001',
    department: 'Water Department',
    assignedTo: 'Team Alpha',
    reportedAt: '2024-01-15T10:30:00Z',
    description: 'Major water pipeline burst causing flooding in residential area',
    estimatedResolutionTime: '4 hours',
    affectedPopulation: 2500
  },
  {
    id: 2,
    title: 'Road Pothole Repair',
    priority: 'high',
    status: 'in_progress',
    coordinates: { lat: 23.3629, lng: 85.3346 },
    address: 'NH-33, Ranchi-Jamshedpur Highway, Jharkhand',
    department: 'Public Works',
    assignedTo: 'Team Beta',
    reportedAt: '2024-01-14T14:20:00Z',
    description: 'Large pothole on main highway causing traffic disruption',
    estimatedResolutionTime: '2 hours',
    affectedPopulation: 5000
  },
  {
    id: 3,
    title: 'Street Light Malfunction',
    priority: 'medium',
    status: 'resolved',
    coordinates: { lat: 23.3569, lng: 85.3239 },
    address: 'Green Valley Colony, Ranchi, Jharkhand 834002',
    department: 'Electrical',
    assignedTo: 'Team Gamma',
    reportedAt: '2024-01-13T16:45:00Z',
    description: 'Multiple street lights not working in residential colony',
    estimatedResolutionTime: 'Completed',
    affectedPopulation: 800
  },
  {
    id: 4,
    title: 'Sewage Overflow',
    priority: 'critical',
    status: 'pending',
    coordinates: { lat: 23.3733, lng: 85.3168 },
    address: 'Sunrise Apartments, Bariatu, Ranchi, Jharkhand',
    department: 'Sanitation',
    assignedTo: 'Team Delta',
    reportedAt: '2024-01-15T08:00:00Z',
    description: 'Sewage overflow near residential complex causing health hazard',
    estimatedResolutionTime: '6 hours',
    affectedPopulation: 1200
  },
  {
    id: 5,
    title: 'Park Maintenance',
    priority: 'low',
    status: 'pending',
    coordinates: { lat: 23.3515, lng: 85.3203 },
    address: 'Jagannath Temple Park, Ranchi, Jharkhand',
    department: 'Parks & Recreation',
    assignedTo: 'Team Echo',
    reportedAt: '2024-01-12T11:00:00Z',
    description: 'Regular maintenance required for park facilities',
    estimatedResolutionTime: '1 day',
    affectedPopulation: 300
  }
]

const priorityColors = {
  critical: 'bg-red-500 text-white',
  high: 'bg-orange-500 text-white',
  medium: 'bg-yellow-500 text-white',
  low: 'bg-green-500 text-white'
}

const statusColors = {
  pending: 'bg-gray-500 text-white',
  in_progress: 'bg-blue-500 text-white',
  resolved: 'bg-green-600 text-white',
  closed: 'bg-purple-500 text-white'
}

export default function GoogleMapIntegration() {
  const [selectedIssue, setSelectedIssue] = useState<any>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [mapType, setMapType] = useState('roadmap')
  const [isLoading, setIsLoading] = useState(false)

  const filteredIssues = realLocationData.filter(issue => {
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

  const openInGoogleMaps = (coordinates: { lat: number, lng: number }, title: string) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${coordinates.lat},${coordinates.lng}&query_place_id=${encodeURIComponent(title)}`
    window.open(url, '_blank')
  }

  const refreshData = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Map Header */}
      <Card className="border-2 border-blue-200 shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                Real-Time Google Maps Integration
              </CardTitle>
              <CardDescription className="text-gray-600 mt-2">
                Live civic issues mapped across Jharkhand with Google Maps integration and GPS coordinates
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={refreshData}
                disabled={isLoading}
                className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2 border-green-300 text-green-600 hover:bg-green-50"
                onClick={() => window.open('https://maps.google.com', '_blank')}
              >
                <ExternalLink className="w-4 h-4" />
                Open Maps
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Advanced Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
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
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="all">All Priority</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Map Type */}
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-gray-500" />
              <select
                value={mapType}
                onChange={(e) => setMapType(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="roadmap">Road Map</option>
                <option value="satellite">Satellite</option>
                <option value="terrain">Terrain</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Live Stats */}
            <div className="ml-auto flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium">Critical: {filteredIssues.filter(i => i.priority === 'critical').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="font-medium">Active: {filteredIssues.filter(i => i.status === 'in_progress').length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-green-600 font-medium">Live Data</span>
              </div>
            </div>
          </div>

          {/* Enhanced Google Maps Interface */}
          <div className="relative">
            <div className="w-full h-[500px] bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border-2 border-gray-200 relative overflow-hidden shadow-inner">
              {/* Google Maps Embed Placeholder */}
              <div className="absolute inset-0">
                <iframe
                  src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58861.89494842842!2d85.28493!3d23.3441!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f4e104aa5db7dd%3A0xdc09d49d6899f43e!2sRanchi%2C%20Jharkhand!5e0!3m2!1sen!2sin!4v1642678901234!5m2!1sen!2sin`}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="rounded-xl"
                />
              </div>

              {/* Overlay Controls */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border z-10">
                <h3 className="font-semibold text-gray-800 mb-1">Ranchi Municipal Area</h3>
                <p className="text-xs text-gray-600">Jharkhand, India</p>
                <p className="text-xs text-blue-600 mt-1">Real-time GPS tracking enabled</p>
              </div>

              {/* Map Controls */}
              <div className="absolute top-4 right-4 flex flex-col bg-white rounded-lg shadow-lg overflow-hidden z-10">
                <button className="p-3 hover:bg-gray-50 border-b border-gray-200 transition-colors">
                  <span className="text-lg font-bold text-gray-700">+</span>
                </button>
                <button className="p-3 hover:bg-gray-50 transition-colors">
                  <span className="text-lg font-bold text-gray-700">−</span>
                </button>
              </div>

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="flex items-center gap-3 bg-white px-6 py-4 rounded-lg shadow-lg border">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="text-gray-700 font-medium">Updating real-time data...</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Issue Details Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredIssues.map((issue) => (
          <Card key={issue.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-800 mb-2">{issue.title}</CardTitle>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={priorityColors[issue.priority as keyof typeof priorityColors]}>
                      {issue.priority}
                    </Badge>
                    <Badge className={`${statusColors[issue.status as keyof typeof statusColors]} flex items-center gap-1`}>
                      {getStatusIcon(issue.status)}
                      {issue.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-sm text-gray-600 mb-4">{issue.description}</p>
              
              <div className="space-y-2 text-xs text-gray-500 mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3 h-3" />
                  <span className="flex-1">{issue.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-3 h-3" />
                  <span>{issue.department} • {issue.assignedTo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  <span>ETA: {issue.estimatedResolutionTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Affected: {issue.affectedPopulation.toLocaleString()} people</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => openInGoogleMaps(issue.coordinates, issue.title)}
                >
                  <Navigation className="w-3 h-3 mr-1" />
                  Navigate
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  <Users className="w-3 h-3 mr-1" />
                  Assign
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-time Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-red-50 to-red-100 border-red-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-red-700 font-medium">Critical Issues</p>
                <p className="text-2xl font-bold text-red-800">
                  {filteredIssues.filter(i => i.priority === 'critical').length}
                </p>
                <p className="text-xs text-red-600">Requires immediate attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <RefreshCw className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">In Progress</p>
                <p className="text-2xl font-bold text-blue-800">
                  {filteredIssues.filter(i => i.status === 'in_progress').length}
                </p>
                <p className="text-xs text-blue-600">Teams actively working</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-500 rounded-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-gray-700 font-medium">Pending</p>
                <p className="text-2xl font-bold text-gray-800">
                  {filteredIssues.filter(i => i.status === 'pending').length}
                </p>
                <p className="text-xs text-gray-600">Awaiting assignment</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Resolved</p>
                <p className="text-2xl font-bold text-green-800">
                  {filteredIssues.filter(i => i.status === 'resolved').length}
                </p>
                <p className="text-xs text-green-600">Completed successfully</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
