import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { courierAPI, orderAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { 
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const CourierDashboard = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [isUpdatingLocation, setIsUpdatingLocation] = useState(false)

  const { data: availableOrdersData, isLoading: availableOrdersLoading } = useQuery(
    ['available-orders'],
    () => courierAPI.getAvailableOrders(),
    {
      enabled: !!user?.courier?.is_available,
      refetchInterval: 10000, // Refetch every 10 seconds
    }
  )

  const { data: myOrdersData, isLoading: myOrdersLoading } = useQuery(
    ['courier-orders'],
    () => orderAPI.getAll(),
    {
      enabled: !!user?.courier,
    }
  )

  const acceptOrderMutation = useMutation(
    (orderId) => courierAPI.acceptOrder(orderId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['available-orders'])
        queryClient.invalidateQueries(['courier-orders'])
        toast.success('تم قبول الطلب بنجاح')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'حدث خطأ في قبول الطلب')
      }
    }
  )

  const updateLocationMutation = useMutation(
    courierAPI.updateLocation,
    {
      onSuccess: () => {
        toast.success('تم تحديث الموقع بنجاح')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'حدث خطأ في تحديث الموقع')
      }
    }
  )

  const toggleAvailabilityMutation = useMutation(
    courierAPI.toggleAvailability,
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['available-orders'])
        toast.success('تم تحديث حالة التوفر')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'حدث خطأ في تحديث حالة التوفر')
      }
    }
  )

  const updateOrderStatusMutation = useMutation(
    ({ orderId, status }) => orderAPI.updateStatus(orderId, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['courier-orders'])
        toast.success('تم تحديث حالة الطلب بنجاح')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'حدث خطأ في تحديث حالة الطلب')
      }
    }
  )

  const availableOrders = availableOrdersData?.data?.data || []
  const myOrders = myOrdersData?.data?.data || []

  const stats = [
    {
      name: 'طلبات متاحة',
      value: availableOrders.length,
      icon: ClockIcon,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'طلباتي النشطة',
      value: myOrders.filter(order => ['picked_up'].includes(order.status)).length,
      icon: TruckIcon,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      name: 'طلبات مكتملة',
      value: myOrders.filter(order => order.status === 'delivered').length,
      icon: CheckCircleIcon,
      color: 'text-green-600 bg-green-100'
    },
    {
      name: 'إجمالي الأرباح',
      value: user?.courier?.total_earnings || 0,
      icon: CurrencyDollarIcon,
      color: 'text-yellow-600 bg-yellow-100'
    }
  ]

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      setIsUpdatingLocation(true)
      navigator.geolocation.getCurrentPosition(
        (position) => {
          updateLocationMutation.mutate({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
          setIsUpdatingLocation(false)
        },
        (error) => {
          console.error('Error getting location:', error)
          toast.error('حدث خطأ في الحصول على الموقع')
          setIsUpdatingLocation(false)
        }
      )
    } else {
      toast.error('المتصفح لا يدعم تحديد الموقع')
    }
  }

  const handleAcceptOrder = (orderId) => {
    acceptOrderMutation.mutate(orderId)
  }

  const handleToggleAvailability = () => {
    toggleAvailabilityMutation.mutate()
  }

  const handleOrderStatusUpdate = (orderId, status) => {
    updateOrderStatusMutation.mutate({ orderId, status })
  }

  if (availableOrdersLoading || myOrdersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                لوحة السائق - {user?.name}
              </h1>
              <p className="text-gray-600 mt-2">
                إدارة طلبات التوصيل وحالة التوفر
              </p>
            </div>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <button
                onClick={getCurrentLocation}
                disabled={isUpdatingLocation}
                className="btn-outline"
              >
                {isUpdatingLocation ? 'جاري التحديث...' : 'تحديث الموقع'}
              </button>
              
              <button
                onClick={handleToggleAvailability}
                disabled={toggleAvailabilityMutation.isLoading}
                className={`${
                  user?.courier?.is_available 
                    ? 'btn-danger' 
                    : 'btn-primary'
                }`}
              >
                {user?.courier?.is_available ? (
                  <>
                    <PauseIcon className="h-4 w-4 ml-1" />
                    إيقاف التوفر
                  </>
                ) : (
                  <>
                    <PlayIcon className="h-4 w-4 ml-1" />
                    تفعيل التوفر
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.name.includes('الأرباح') ? `${stat.value} ج.م` : stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Available Orders */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">الطلبات المتاحة</h3>
            </div>
            <div className="card-body">
              {availableOrders.length > 0 ? (
                <div className="space-y-4">
                  {availableOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            #{order.order_number}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {order.restaurant?.name} - {order.total_price} ج.م
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          جاهز للاستلام
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPinIcon className="h-4 w-4 ml-1" />
                          <span>من: {order.restaurant?.address}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPinIcon className="h-4 w-4 ml-1" />
                          <span>إلى: {order.delivery_address}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <p>المسافة: {order.calculateDistance?.()?.toFixed(1)} كم</p>
                        </div>
                        
                        <button
                          onClick={() => handleAcceptOrder(order.id)}
                          disabled={acceptOrderMutation.isLoading}
                          className="btn-primary text-xs px-3 py-1"
                        >
                          قبول الطلب
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات متاحة</h3>
                  <p className="text-gray-600">
                    {user?.courier?.is_available 
                      ? 'لا توجد طلبات متاحة حالياً' 
                      : 'قم بتفعيل التوفر لرؤية الطلبات المتاحة'
                    }
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* My Orders */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">طلباتي</h3>
            </div>
            <div className="card-body">
              {myOrders.length > 0 ? (
                <div className="space-y-4">
                  {myOrders.map((order) => (
                    <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            #{order.order_number}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {order.restaurant?.name} - {order.total_price} ج.م
                          </p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'picked_up' ? 'bg-orange-100 text-orange-800' :
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status === 'picked_up' ? 'قيد التوصيل' :
                           order.status === 'delivered' ? 'تم التسليم' :
                           order.status}
                        </span>
                      </div>

                      <div className="mb-3">
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPinIcon className="h-4 w-4 ml-1" />
                          <span>إلى: {order.delivery_address}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <p>المسافة: {order.calculateDistance?.()?.toFixed(1)} كم</p>
                        </div>
                        
                        {order.status === 'picked_up' && (
                          <button
                            onClick={() => handleOrderStatusUpdate(order.id, 'delivered')}
                            disabled={updateOrderStatusMutation.isLoading}
                            className="btn-primary text-xs px-3 py-1"
                          >
                            تم التسليم
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <TruckIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
                  <p className="text-gray-600">لم تقم بقبول أي طلبات بعد</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CourierDashboard
