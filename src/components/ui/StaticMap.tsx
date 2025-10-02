'use client'

import { MapPin, ExternalLink } from 'lucide-react'
import { Button } from './button'

interface StaticMapProps {
  latitude: number
  longitude: number
  location: string
  title: string
}

export default function StaticMap({ latitude, longitude, location, title }: StaticMapProps) {
  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`, '_blank')
  }

  const openInOpenStreetMap = () => {
    window.open(`https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`, '_blank')
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 to-green-50 p-6 rounded-lg">
      <div className="text-center">
        <div className="bg-red-500 text-white rounded-full p-4 inline-block mb-4">
          <MapPin className="h-8 w-8" />
        </div>
        <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{location}</p>
        <p className="text-sm text-gray-500 mb-6">
          Coordinates: {latitude}, {longitude}
        </p>
        
        <div className="space-y-2">
          <Button onClick={openInGoogleMaps} className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in Google Maps
          </Button>
          <Button onClick={openInOpenStreetMap} variant="outline" className="w-full">
            <ExternalLink className="h-4 w-4 mr-2" />
            Open in OpenStreetMap
          </Button>
        </div>
      </div>
    </div>
  )
}