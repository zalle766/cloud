import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useQuery } from 'react-query'
import { getOrder } from '../services/supabaseApi'
import GoogleMap from '../components/GoogleMap'
import { 
  MapPinIcon,
  ClockIcon,
  TruckIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline'

const OrderTracking = () => {
  const { orderId } = useParams()
  const [courierLocation, setCourierLocation] = useState(null)

  const { data: orderData, isLoading } = useQuery(
    ['order', orderId],
    async () => {
      const result = await getOrder(orderId)
      if (result.error) throw result.error
      return result.data
    },
    {
      refetchInterval: 5000, // Refetch every 5 seconds
    }
  )

  const order = orderData

  const statusSteps = [
    { key: 'pending', label: 'في الانتظار', icon: ClockIcon },
    { key: 'confirmed', label: 'تم التأكيد', icon: CheckCircleIcon },
    { key: 'preparing', label: 'قيد التحضير', icon: ClockIcon },
    { key: 'ready', label: 'جاهز للاستلام', icon: CheckCircleIcon },
    { key: 'picked_up', label: 'تم الاستلام', icon: TruckIcon },
    { key: 'delivered', label: 'تم التسليم', icon: CheckCircleIcon },
    { key: 'cancelled', label: 'ملغي', icon: XCircleIcon }
  ]

  const getStatusIndex = (status) => {
    return statusSteps.findIndex(step => step.key === status)
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'text-yellow-600 bg-yellow-100',
      confirmed: 'text-blue-600 bg-blue-100',
      preparing: 'text-orange-600 bg-orange-100',
      ready: 'text-purple-600 bg-purple-100',
      picked_up: 'text-indigo-600 bg-indigo-100',
      delivered: 'text-green-600 bg-green-100',
      cancelled: 'text-red-600 bg-red-100'
    }
    return colors[status] || 'text-gray-600 bg-gray-100'
  }

  const markers = []

  // Add restaurant marker
  if (order?.restaurant) {
    markers.push({
      position: {
        lat: parseFloat(order.restaurant.latitude),
        lng: parseFloat(order.restaurant.longitude)
      },
      title: order.restaurant.name,
      infoWindow: `
        <div class="p-2">
          <h3 class="font-semibold">${order.restaurant.name}</h3>
          <p class="text-sm text-gray-600">${order.restaurant.address}</p>
        </div>
      `,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png'
      }
    })
  }

  // Add delivery address marker
  if (order?.addresses?.latitude && order?.addresses?.longitude) {
    markers.push({
      position: {
        lat: parseFloat(order.addresses.latitude),
        lng: parseFloat(order.addresses.longitude)
      },
      title: 'عنوان التسليم',
      infoWindow: `
        <div class="p-2">
          <h3 class="font-semibold">عنوان التسليم</h3>
          <p class="text-sm text-gray-600">${order.addresses.address || 'لا يوجد عنوان'}</p>
        </div>
      `,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png'
      }
    })
  }

  // Add courier marker if available
  if (order?.courier?.latitude && order?.courier?.longitude) {
    markers.push({
      position: {
        lat: parseFloat(order.courier.latitude),
        lng: parseFloat(order.courier.longitude)
      },
      title: `السائق: ${order.courier.user?.name}`,
      infoWindow: `
        <div class="p-2">
          <h3 class="font-semibold">السائق: ${order.courier.user?.name}</h3>
          <p class="text-sm text-gray-600">${order.courier.vehicle_type}</p>
        </div>
      `,
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png'
      }
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">الطلب غير موجود</h2>
          <p className="text-gray-600">يرجى التحقق من رقم الطلب</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            تتبع الطلب #{order.id?.substring(0, 8) || 'غير معروف'}
          </h1>
          <p className="text-gray-600">
            حالة الطلب: <span className={`px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {statusSteps.find(step => step.key === order.status)?.label}
            </span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Status Timeline */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">حالة الطلب</h3>
              </div>
              <div className="card-body">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {statusSteps.map((step, stepIdx) => {
                      const isCompleted = getStatusIndex(order.status) >= getStatusIndex(step.key)
                      const isCurrent = step.key === order.status
                      
                      return (
                        <li key={step.key}>
                          <div className="relative pb-8">
                            {stepIdx !== statusSteps.length - 1 ? (
                              <span
                                className={`absolute top-4 right-4 -ml-px h-full w-0.5 ${
                                  isCompleted ? 'bg-primary-200' : 'bg-gray-200'
                                }`}
                                aria-hidden="true"
                              />
                            ) : null}
                            <div className="relative flex space-x-3 space-x-reverse">
                              <div>
                                <span
                                  className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white ${
                                    isCompleted
                                      ? 'bg-primary-500'
                                      : isCurrent
                                      ? 'bg-primary-500'
                                      : 'bg-gray-300'
                                  }`}
                                >
                                  <step.icon
                                    className={`h-5 w-5 ${
                                      isCompleted || isCurrent ? 'text-white' : 'text-gray-500'
                                    }`}
                                    aria-hidden="true"
                                  />
                                </span>
                              </div>
                              <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4 space-x-reverse">
                                <div>
                                  <p
                                    className={`text-sm font-medium ${
                                      isCompleted || isCurrent ? 'text-primary-500' : 'text-gray-500'
                                    }`}
                                  >
                                    {step.label}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">تفاصيل الطلب</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  {order.order_items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12">
                          {item.menu_items?.image_url ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={item.menu_items.image_url}
                              alt={item.menu_items.name}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-sm">صورة</span>
                            </div>
                          )}
                        </div>
                        <div className="mr-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            {item.menu_items?.name}
                          </h4>
                          <p className="text-sm text-gray-500">
                            الكمية: {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {item.subtotal || (item.price * item.quantity)} ج.م
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t border-gray-200 mt-4 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">المجموع الفرعي:</span>
                    <span className="text-gray-900">{(order.total_amount - (order.delivery_fee || 0)).toFixed(2)} ج.م</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">رسوم التوصيل:</span>
                    <span className="text-gray-900">{(order.delivery_fee || 0).toFixed(2)} ج.م</span>
                  </div>
                  <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2 mt-2">
                    <span className="text-gray-900">المجموع الكلي:</span>
                    <span className="text-gray-900">{(order.total_amount || 0).toFixed(2)} ج.م</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">معلومات التسليم</h3>
              </div>
              <div className="card-body">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 ml-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">عنوان التسليم</p>
                      <p className="text-sm text-gray-600">{order.addresses?.address || 'لا يوجد عنوان'}</p>
                    </div>
                  </div>
                  
                  {order.courier && (
                    <div className="flex items-start">
                      <TruckIcon className="h-5 w-5 text-gray-400 mt-0.5 ml-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">السائق</p>
                        <p className="text-sm text-gray-600">{order.courier.user?.name}</p>
                        <p className="text-sm text-gray-500">{order.courier.vehicle_type}</p>
                      </div>
                    </div>
                  )}
                  
                  {order.estimated_delivery_time && (
                    <div className="flex items-start">
                      <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 ml-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">الوقت المتوقع للتسليم</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.estimated_delivery_time).toLocaleString('ar-EG')}
                        </p>
                      </div>
                    </div>
                  )}
                  {order.created_at && (
                    <div className="flex items-start">
                      <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 ml-2" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">تاريخ الطلب</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.created_at).toLocaleString('ar-EG')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">موقع التسليم</h3>
            </div>
            <div className="card-body p-0">
              <GoogleMap
                center={{
                  lat: order.addresses?.latitude ? parseFloat(order.addresses.latitude) : 30.0444,
                  lng: order.addresses?.longitude ? parseFloat(order.addresses.longitude) : 31.2357
                }}
                zoom={15}
                markers={markers}
                className="h-96 w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderTracking
