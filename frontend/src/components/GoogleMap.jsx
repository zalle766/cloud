import React, { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

const GoogleMap = ({ 
  center = { lat: 30.0444, lng: 31.2357 }, 
  zoom = 13, 
  markers = [], 
  onLocationSelect = null,
  height = '400px',
  className = '',
  showCurrentLocation = true,
  draggable = true,
  clickable = true
}) => {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState(null)
  const [currentLocation, setCurrentLocation] = useState(null)

  useEffect(() => {
    const initMap = async () => {
      // التحقق من وجود مفتاح Google Maps قبل التحميل
      // Check if Google Maps API key exists before loading
      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      
      if (!apiKey || apiKey === '' || apiKey === 'YOUR_API_KEY_HERE' || apiKey === 'YOUR_API_KEY_HERE') {
        console.warn('⚠️ Google Maps API key not found. Map will not be loaded.')
        console.warn('💡 To enable Google Maps, add VITE_GOOGLE_MAPS_API_KEY to your .env file')
        setError('مفتاح Google Maps API غير موجود. يرجى إضافته في ملف .env')
        return
      }

      // إعدادات Google Maps
      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['places', 'geometry']
      })

      try {
        await loader.load()
        
        if (mapRef.current) {
          // إنشاء الخريطة
          const map = new google.maps.Map(mapRef.current, {
            center: center,
            zoom: zoom,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            styles: [
              {
                featureType: 'poi',
                elementType: 'labels',
                stylers: [{ visibility: 'off' }]
              }
            ],
            mapTypeControl: true,
            streetViewControl: true,
            fullscreenControl: true,
            zoomControl: true
          })

          mapInstanceRef.current = map

          // إضافة حدث النقر على الخريطة
          if (clickable && onLocationSelect) {
            map.addListener('click', (event) => {
              const location = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng()
              }
              onLocationSelect(location)
            })
          }

          // الحصول على الموقع الحالي
          if (showCurrentLocation && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const userLocation = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude
                }
                setCurrentLocation(userLocation)
                
                // إضافة علامة للموقع الحالي
                const currentLocationMarker = new google.maps.Marker({
                  position: userLocation,
                  map: map,
                  title: 'موقعك الحالي',
                  icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="8" fill="#4285F4" stroke="white" stroke-width="2"/>
                        <circle cx="12" cy="12" r="3" fill="white"/>
                      </svg>
                    `),
                    scaledSize: new google.maps.Size(24, 24)
                  }
                })
                markersRef.current.push(currentLocationMarker)
              },
              (error) => {
                console.warn('خطأ في الحصول على الموقع الحالي:', error)
              }
            )
          }

          setIsLoaded(true)
        }
      } catch (err) {
        setError('خطأ في تحميل Google Maps: ' + err.message)
        console.error('Google Maps error:', err)
      }
    }

    initMap()
  }, [])

  // تحديث العلامات عند تغيير البيانات
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      // إزالة العلامات السابقة
      markersRef.current.forEach(marker => marker.setMap(null))
      markersRef.current = []

      // إضافة العلامات الجديدة
      markers.forEach((marker, index) => {
        const googleMarker = new google.maps.Marker({
          position: marker.position,
          map: mapInstanceRef.current,
          title: marker.title || `علامة ${index + 1}`,
          icon: marker.icon || undefined
        })

        // إضافة معلومات عند النقر على العلامة
        if (marker.infoWindow) {
          const infoWindow = new google.maps.InfoWindow({
            content: marker.infoWindow
          })

          googleMarker.addListener('click', () => {
            infoWindow.open(mapInstanceRef.current, googleMarker)
          })
        }

        markersRef.current.push(googleMarker)
      })
    }
  }, [markers, isLoaded])

  // تحديث مركز الخريطة
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      mapInstanceRef.current.setCenter(center)
      mapInstanceRef.current.setZoom(zoom)
    }
  }, [center, zoom, isLoaded])

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <p className="text-red-600">{error}</p>
          <p className="text-sm text-gray-500 mt-2">
            تأكد من إضافة Google Maps API key في ملف .env
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">جاري تحميل الخريطة...</p>
          </div>
        </div>
      )}
      
      <div
        ref={mapRef}
        style={{ height: height }}
        className="w-full rounded-lg shadow-lg"
      />
      
      {isLoaded && (
        <div className="absolute top-2 right-2 bg-white rounded-lg shadow-lg p-2">
          <div className="text-xs text-gray-600">
            {showCurrentLocation && currentLocation && (
              <div className="flex items-center mb-1">
                <div className="w-3 h-3 bg-blue-500 rounded-full ml-1"></div>
                موقعك الحالي
              </div>
            )}
            {clickable && onLocationSelect && (
              <div className="text-gray-500">
                انقر على الخريطة لاختيار موقع
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default GoogleMap