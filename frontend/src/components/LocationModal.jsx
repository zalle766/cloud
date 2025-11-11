import React, { useState, useEffect } from 'react'
import { useLocation } from '../contexts/LocationContext'
import { 
  XMarkIcon, 
  MapPinIcon, 
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

const LocationModal = () => {
  const { isLocationModalOpen, closeLocationModal, updateLocation } = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [locationError, setLocationError] = useState('')
  const [suggestions, setSuggestions] = useState([])

  // إغلاق المودال عند الضغط على Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeLocationModal()
      }
    }
    
    if (isLocationModalOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isLocationModalOpen, closeLocationModal])

  // استخدام الموقع الحالي
  const handleUseCurrentLocation = () => {
    setIsLoadingLocation(true)
    setLocationError('')
    
    if (!navigator.geolocation) {
      setLocationError('المتصفح لا يدعم تحديد الموقع')
      setIsLoadingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords
          
          // استخدام خدمة reverse geocoding للحصول على العنوان الدقيق
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=ar&localityLanguage=fr`
          )
          
          if (response.ok) {
            const data = await response.json()
            
            // بناء عنوان مفصل يشمل الشارع والحي والمدينة
            const addressParts = []
            
            // استخراج الشارع من localityInfo.locality.name
            const street = data.localityInfo?.locality?.name || null
            
            // استخراج الحي من localityInfo.informative أو administrativeArea
            let neighborhood = null
            if (data.localityInfo?.informative && Array.isArray(data.localityInfo.informative)) {
              const neighborhoodInfo = data.localityInfo.informative.find(
                info => info.description === 'Neighborhood' || info.description === 'Sublocality'
              )
              if (neighborhoodInfo) {
                neighborhood = neighborhoodInfo.name
              }
            }
            
            // استخراج المنطقة الإدارية
            const district = data.localityInfo?.administrativeArea?.name || null
            
            // إضافة الشارع إذا كان مختلف عن المدينة والحي
            if (street && street !== data.locality && street !== data.city && street !== neighborhood) {
              addressParts.push(street)
            }
            
            // إضافة الحي إذا كان مختلف عن المدينة والمنطقة
            if (neighborhood && neighborhood !== data.locality && neighborhood !== data.city && neighborhood !== district) {
              addressParts.push(neighborhood)
            }
            
            // إضافة المنطقة الإدارية إذا كانت مختلفة عن المدينة
            if (district && district !== data.locality && district !== data.city) {
              addressParts.push(district)
            }
            
            // إضافة المدينة
            if (data.locality || data.city) {
              addressParts.push(data.locality || data.city)
            }
            
            // إضافة الدولة
            if (data.countryName) {
              addressParts.push(data.countryName)
            }
            
            const detailedAddress = addressParts.length > 0 ? addressParts.join(', ') : 'الموقع الحالي'
            
            // طباعة معلومات الموقع للتشخيص
            console.log('Location API Response:', data)
            console.log('Extracted Street:', street)
            console.log('Extracted Neighborhood:', neighborhood)
            console.log('Extracted District:', district)
            console.log('Address Parts:', addressParts)
            console.log('Detailed Address:', detailedAddress)
            
            // استخدام البيانات الحقيقية فقط من API
            updateLocation({
              latitude,
              longitude,
              address: detailedAddress,
              city: data.locality || data.city || 'غير محدد',
              country: data.countryName || 'المغرب',
              district: district,
              street: street,
              neighborhood: neighborhood,
              fullAddress: data.localityInfo || null,
              accuracy: position.coords.accuracy,
              timestamp: new Date().toISOString()
            })
          } else {
            // في حالة فشل الـ API، نستخدم إحداثيات افتراضية
            updateLocation({
              latitude,
              longitude,
              address: 'الموقع الحالي',
              city: 'الموقع الحالي',
              country: 'المغرب'
            })
          }
        } catch (error) {
          console.error('Error getting address:', error)
          // حتى لو فشل الحصول على العنوان، نستخدم الإحداثيات
          updateLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: 'الموقع الحالي',
            city: 'الموقع الحالي',
            country: 'المغرب'
          })
        } finally {
          setIsLoadingLocation(false)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        let errorMessage = 'حدث خطأ في تحديد الموقع'
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'تم رفض إذن الوصول للموقع'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'الموقع غير متاح'
            break
          case error.TIMEOUT:
            errorMessage = 'انتهت مهلة تحديد الموقع'
            break
        }
        
        setLocationError(errorMessage)
        setIsLoadingLocation(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000
      }
    )
  }

  // البحث عن عنوان
  const handleSearch = async () => {
    if (!searchTerm.trim()) return
    
    setIsLoadingLocation(true)
    setLocationError('')
    
    try {
      // استخدام خدمة geocoding للبحث عن العنوان الدقيق
      const response = await fetch(
        `https://api.bigdatacloud.net/data/forward-geocode-client?query=${encodeURIComponent(searchTerm)}&localityLanguage=ar&localityLanguage=fr`
      )
      
      if (response.ok) {
        const data = await response.json()
        
        if (data.results && data.results.length > 0) {
          const result = data.results[0]
          
          // بناء عنوان مفصل من نتائج البحث
          const addressParts = []
          
          // استخراج الشارع من localityInfo.locality.name
          const street = result.localityInfo?.locality?.name || null
          
          // استخراج الحي من localityInfo.informative أو administrativeArea
          let neighborhood = null
          if (result.localityInfo?.informative && Array.isArray(result.localityInfo.informative)) {
            const neighborhoodInfo = result.localityInfo.informative.find(
              info => info.description === 'Neighborhood' || info.description === 'Sublocality'
            )
            if (neighborhoodInfo) {
              neighborhood = neighborhoodInfo.name
            }
          }
          
          // استخراج المنطقة الإدارية
          const district = result.localityInfo?.administrativeArea?.name || null
          
          // إضافة الشارع إذا كان مختلف عن المدينة والحي
          if (street && street !== result.locality && street !== result.city && street !== neighborhood) {
            addressParts.push(street)
          }
          
          // إضافة الحي إذا كان مختلف عن المدينة والمنطقة
          if (neighborhood && neighborhood !== result.locality && neighborhood !== result.city && neighborhood !== district) {
            addressParts.push(neighborhood)
          }
          
          // إضافة المنطقة الإدارية إذا كانت مختلفة عن المدينة
          if (district && district !== result.locality && district !== result.city) {
            addressParts.push(district)
          }
          
          // إضافة المدينة
          if (result.locality || result.city) {
            addressParts.push(result.locality || result.city)
          }
          
          // إضافة الدولة
          if (result.countryName) {
            addressParts.push(result.countryName)
          }
          
          const detailedAddress = addressParts.length > 0 ? addressParts.join(', ') : searchTerm
          
          // طباعة معلومات الموقع للتشخيص
          console.log('Search API Response:', result)
          console.log('Search Extracted Street:', street)
          console.log('Search Extracted Neighborhood:', neighborhood)
          console.log('Search Extracted District:', district)
          console.log('Search Address Parts:', addressParts)
          console.log('Search Detailed Address:', detailedAddress)
          
          // استخدام البيانات الحقيقية فقط من API
          updateLocation({
            latitude: result.latitude,
            longitude: result.longitude,
            address: detailedAddress,
            city: result.locality || result.city || searchTerm,
            country: result.countryName || 'المغرب',
            district: district,
            street: street,
            neighborhood: neighborhood,
            fullAddress: result.localityInfo || null,
            accuracy: 10, // تقدير دقة البحث
            timestamp: new Date().toISOString()
          })
        } else {
          setLocationError('لم يتم العثور على العنوان المطلوب')
        }
      } else {
        setLocationError('حدث خطأ في البحث عن العنوان')
      }
    } catch (error) {
      console.error('Search error:', error)
      setLocationError('حدث خطأ في البحث عن العنوان')
    } finally {
      setIsLoadingLocation(false)
    }
  }

  // اقتراحات المدن والأحياء الشائعة
  const popularLocations = [
    { name: 'الدار البيضاء', emoji: '🏙️' },
    { name: 'الرباط', emoji: '🏛️' },
    { name: 'مراكش', emoji: '🏜️' },
    { name: 'فاس', emoji: '🕌' },
    { name: 'أكادير', emoji: '🏖️' },
    { name: 'طنجة', emoji: '🌊' },
    { name: 'مكناس', emoji: '🏘️' },
    { name: 'وجدة', emoji: '🌅' }
  ]

  if (!isLocationModalOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div className="location-modal-backdrop fixed inset-0 bg-black bg-opacity-50 transition-opacity" onClick={closeLocationModal}></div>
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="location-modal-content relative bg-white rounded-xl shadow-xl w-full max-w-md transform transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">
              أين نُسلم لك؟
            </h2>
            <button
              onClick={closeLocationModal}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Search Input */}
            <div className="mb-6">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="ابحث عن العنوان..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="block w-full pr-10 pl-3 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              
              {/* Search Button */}
              <button
                onClick={handleSearch}
                disabled={!searchTerm.trim() || isLoadingLocation}
                className="w-full mt-3 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoadingLocation ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white ml-2"></div>
                    جاري البحث...
                  </div>
                ) : (
                  'البحث عن العنوان'
                )}
              </button>
            </div>

            {/* Use Current Location Button */}
            <div className="mb-6">
              <button
                onClick={handleUseCurrentLocation}
                disabled={isLoadingLocation}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                <MapPinIcon className="h-5 w-5 ml-2" />
                {isLoadingLocation ? 'جاري تحديد الموقع...' : 'استخدام موقعي الحالي'}
              </button>
            </div>

            {/* Error Message */}
            {locationError && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-red-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <span className="text-sm text-red-700">{locationError}</span>
                </div>
              </div>
            )}

            {/* Popular Locations */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-3">المواقع الشائعة</h3>
              <div className="grid grid-cols-1 gap-2">
                {popularLocations.map((location) => (
                  <button
                    key={location.name}
                    onClick={() => {
                      setSearchTerm(location.name)
                      setTimeout(() => handleSearch(), 100)
                    }}
                    disabled={isLoadingLocation}
                    className="flex items-center justify-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-primary-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-lg ml-2">{location.emoji}</span>
                    <span className="text-sm font-medium text-gray-700">{location.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 bg-gray-50 rounded-b-xl">
            <p className="text-xs text-gray-500 text-center">
              نحتاج لموقعك لعرض المطاعم القريبة منك وتقديم أفضل خدمة توصيل
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationModal
