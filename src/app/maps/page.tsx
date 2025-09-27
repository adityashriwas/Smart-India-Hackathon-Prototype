'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import InteractiveMap from '@/components/maps/InteractiveMap'
import GoogleMapIntegration from '@/components/maps/GoogleMapIntegration'
import { MapPin, Globe, Layers, Navigation } from 'lucide-react'

export default function MapsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Interactive Maps</h1>
          <p className="text-gray-600 mt-2">
            Real-time civic issue tracking and management with advanced mapping capabilities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="flex items-center gap-2">
            <Navigation className="w-4 h-4" />
            Export Data
          </Button>
          <Button className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Add Issue
          </Button>
        </div>
      </div>

      {/* Map Tabs */}
      <Tabs defaultValue="interactive" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="interactive" className="flex items-center gap-2">
            <Layers className="w-4 h-4" />
            Interactive Map
          </TabsTrigger>
          <TabsTrigger value="google" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Google Maps
          </TabsTrigger>
        </TabsList>

        <TabsContent value="interactive" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-600" />
                Enhanced Interactive Map
              </CardTitle>
              <CardDescription>
                Custom-built interactive map with advanced filtering, real-time updates, and intelligent issue allocation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveMap />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="google" className="space-y-6">
          <GoogleMapIntegration />
        </TabsContent>
      </Tabs>

      {/* Map Features Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-blue-200 bg-blue-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-500 rounded-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Real-time Tracking</h3>
            </div>
            <p className="text-sm text-gray-600">
              Live GPS coordinates and real-time updates for all civic issues across Jharkhand municipalities
            </p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-green-500 rounded-lg">
                <Layers className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Smart Filtering</h3>
            </div>
            <p className="text-sm text-gray-600">
              Advanced filtering by priority, status, department, and location with intelligent categorization
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Navigation className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-semibold text-gray-800">Team Navigation</h3>
            </div>
            <p className="text-sm text-gray-600">
              Direct navigation to issue locations with Google Maps integration and route optimization
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
