'use client'

import { use, useState } from 'react'
import { useAppSelector } from '@/redux/hooks'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { reports, departments, users } from '@/lib/seedData.js'
import { priorityColors, statusColors, formatDate } from '@/lib/utils'
import StaticMap from '@/components/ui/StaticMap'
import { 
  ArrowLeft, 
  MapPin, 
  Calendar, 
  User, 
  Building, 
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
  ExternalLink
} from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ReportDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const [mapError, setMapError] = useState(false)
  
  const report = reports.find(r => r.id === parseInt(id))
  const department = departments.find(d => d.id === report?.department)
  const assignedUser = users.find(u => u.id === report?.assignedTo)
  const reporter = users.find(u => u.id === report?.reporterId)

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Report Not Found</h1>
          <Button onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <FileText className="h-5 w-5 text-blue-500 mr-2" />
      case 'assigned':
        return <User className="h-5 w-5 text-orange-500 mr-2" />
      case 'in_progress':
        return <Clock className="h-5 w-5 text-yellow-500 mr-2" />
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
      default:
        return <FileText className="h-5 w-5 text-gray-500 mr-2" />
    }
  }

  const getPriorityIcon = (priority: string) => {
    const color = priority === 'critical' ? 'text-red-500' : 
                 priority === 'high' ? 'text-orange-500' : 
                 priority === 'medium' ? 'text-yellow-500' : 'text-green-500'
    return <AlertTriangle className={`h-5 w-5 ${color} mr-2`} />
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="outline" 
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Reports
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Report Details</h1>
          <p className="text-gray-600">Report ID: #{report.id}</p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column - Report Details */}
          <div className="space-y-6">
            {/* Report Image */}
            <Card>
              <CardContent className="p-0">
                <div className="relative">
                  <img
                    src={report.image}
                    alt={report.title}
                    className="w-full h-64 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-4 right-4 flex space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[report.priority as keyof typeof priorityColors]}`}>
                      {report.priority.toUpperCase()}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[report.status as keyof typeof statusColors]}`}>
                      {report.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">{report.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{report.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Report Information */}
            <Card>
              <CardHeader>
                <CardTitle>Report Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Reported Date</p>
                    <p className="font-medium">{formatDate(report.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <Building className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Department</p>
                    <p className="font-medium">{department?.name}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Reported By</p>
                    <p className="font-medium">{reporter?.name || 'Anonymous'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm text-gray-500">Assigned To</p>
                    <p className="font-medium">{assignedUser?.name || 'Unassigned'}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  {getPriorityIcon(report.priority)}
                  <div>
                    <p className="text-sm text-gray-500">Priority</p>
                    <p className="font-medium capitalize">{report.priority}</p>
                  </div>
                </div>

                <div className="flex items-center">
                  {getStatusIcon(report.status)}
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium capitalize">{report.status.replace('_', ' ')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Location & Map */}
          <div className="space-y-6">
            {/* Location Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{report.location}</p>
                <div className="text-sm text-gray-500">
                  <p>Coordinates: {report.coordinates?.lat}, {report.coordinates?.lng}</p>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Map */}
            <Card>
              <CardHeader>
                <CardTitle>Location on Map</CardTitle>
                <CardDescription>Interactive map showing the exact location of the reported issue</CardDescription>
              </CardHeader>
              <CardContent className="p-4">
                {!mapError ? (
                  <div className="h-96 rounded-lg overflow-hidden bg-gray-100 relative">
                    <iframe
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${report.coordinates?.lng! - 0.01},${report.coordinates?.lat! - 0.01},${report.coordinates?.lng! + 0.01},${report.coordinates?.lat! + 0.01}&layer=mapnik&marker=${report.coordinates?.lat},${report.coordinates?.lng}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      title={`Location of ${report.title}`}
                      onError={() => setMapError(true)}
                    />
                    <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs text-gray-600">
                      <a 
                        href={`https://www.openstreetmap.org/?mlat=${report.coordinates?.lat}&mlon=${report.coordinates?.lng}&zoom=15`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-600 flex items-center"
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Full Map
                      </a>
                    </div>
                  </div>
                ) : (
                  <StaticMap
                    latitude={report.coordinates?.lat || 28.6139}
                    longitude={report.coordinates?.lng || 77.2090}
                    location={report.location || 'Location not specified'}
                    title={report.title}
                  />
                )}
              </CardContent>
            </Card>

            {/* Action Buttons */}
            {(user?.role === 'admin' || user?.role === 'department_head') && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    Edit Report
                  </Button>
                  <Button className="w-full" variant="outline">
                    Update Status
                  </Button>
                  <Button className="w-full" variant="outline">
                    Reassign
                  </Button>
                  {report.status !== 'resolved' && (
                    <Button className="w-full">
                      Mark as Resolved
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}