'use client'

import { useEffect, useRef } from 'react'

interface MapComponentProps {
  latitude: number
  longitude: number
  title: string
  className?: string
}

export default function MapComponent({ latitude, longitude, title, className = "w-full h-96" }: MapComponentProps) {
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Simple fallback map using iframe
    if (mapRef.current) {
      const iframe = document.createElement('iframe')
      iframe.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dOWTgHz8HlCdOo&q=${latitude},${longitude}&zoom=15`
      iframe.width = '100%'
      iframe.height = '100%'
      iframe.style.border = '0'
      iframe.allowFullscreen = true
      iframe.loading = 'lazy'
      iframe.referrerPolicy = 'no-referrer-when-downgrade'
      iframe.title = `Location of ${title}`
      
      mapRef.current.appendChild(iframe)
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = ''
      }
    }
  }, [latitude, longitude, title])

  return (
    <div className={className} ref={mapRef}>
      {/* Map will be loaded here */}
    </div>
  )
}