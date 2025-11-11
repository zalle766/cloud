import React, { createContext, useContext, useState, useEffect } from 'react'

const LocationContext = createContext()

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

export const LocationProvider = ({ children }) => {
  const [userLocation, setUserLocation] = useState(null)
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [isFirstVisit, setIsFirstVisit] = useState(false)

  // تحميل الموقع المحفوظ عند بدء التطبيق
  useEffect(() => {
    const savedLocation = localStorage.getItem('userLocation')
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore')
    
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation)
        setUserLocation(parsedLocation)
      } catch (error) {
        console.error('Error parsing saved location:', error)
        localStorage.removeItem('userLocation')
      }
    }
    
    // إذا لم يزر الموقع من قبل أو لم يكن هناك موقع محفوظ، نفتح مودال الموقع
    if (!hasVisitedBefore || !savedLocation) {
      setIsFirstVisit(true)
      // تأخير بسيط لضمان تحميل الصفحة أولاً
      setTimeout(() => {
        setIsLocationModalOpen(true)
      }, 1000)
      if (!hasVisitedBefore) {
        localStorage.setItem('hasVisitedBefore', 'true')
      }
    }
  }, [])

  // حفظ الموقع في localStorage
  const saveLocation = (location) => {
    setUserLocation(location)
    localStorage.setItem('userLocation', JSON.stringify(location))
  }

  // تحديث الموقع
  const updateLocation = (location) => {
    saveLocation(location)
    setIsLocationModalOpen(false)
  }

  // فتح مودال الموقع
  const openLocationModal = () => {
    setIsLocationModalOpen(true)
  }

  // إغلاق مودال الموقع
  const closeLocationModal = () => {
    setIsLocationModalOpen(false)
  }

  // مسح الموقع المحفوظ
  const clearLocation = () => {
    setUserLocation(null)
    localStorage.removeItem('userLocation')
  }

  // حساب المسافة بين موقعين (بالكيلومتر)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // نصف قطر الأرض بالكيلومتر
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // تصفية المطاعم حسب المسافة الدقيقة
  const filterRestaurantsByDistance = (restaurants, maxDistanceKm = 5) => {
    if (!userLocation || !Array.isArray(restaurants)) {
      return restaurants
    }

    return restaurants.filter(restaurant => {
      if (!restaurant.latitude || !restaurant.longitude) {
        return true // إذا لم يكن للمطعم إحداثيات، نعرضه
      }
      
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        restaurant.latitude,
        restaurant.longitude
      )
      
      return distance <= maxDistanceKm
    }).map(restaurant => {
      if (restaurant.latitude && restaurant.longitude) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          restaurant.latitude,
          restaurant.longitude
        )
        return {
          ...restaurant,
          distance: Math.round(distance * 10) / 10 // تقريب لرقم عشري واحد
        }
      }
      return restaurant
    }).sort((a, b) => {
      // ترتيب حسب المسافة
      if (a.distance && b.distance) {
        return a.distance - b.distance
      }
      if (a.distance && !b.distance) {
        return -1
      }
      if (!a.distance && b.distance) {
        return 1
      }
      return 0
    })
  }

  const value = {
    userLocation,
    isLocationModalOpen,
    isFirstVisit,
    updateLocation,
    openLocationModal,
    closeLocationModal,
    clearLocation,
    calculateDistance,
    filterRestaurantsByDistance
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}
