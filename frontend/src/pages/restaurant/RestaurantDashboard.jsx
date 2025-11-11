import React, { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { Link } from 'react-router-dom'
import { orderAPI, restaurantAPI, productAPI } from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
import { 
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  PlusIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

const RestaurantDashboard = () => {
  const { user, loading } = useAuth()
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState('all')

  console.log('RestaurantDashboard - user:', user)
  console.log('RestaurantDashboard - loading:', loading)
  console.log('RestaurantDashboard - user.restaurant:', user?.restaurant)

  // إضافة بيانات تجريبية إذا لم تكن موجودة
  const mockOrders = [
    {
      id: 1,
      order_number: 'ORD-001',
      status: 'pending',
      total_price: 150.00,
      user: { name: 'أحمد محمد' },
      order_items: [
        { id: 1, product: { name: 'برجر دجاج' }, quantity: 2, price: 75.00 }
      ],
      delivery_address: 'شارع الملك فهد، الرياض',
      notes: 'بدون بصل'
    },
    {
      id: 2,
      order_number: 'ORD-002',
      status: 'confirmed',
      total_price: 200.00,
      user: { name: 'فاطمة علي' },
      order_items: [
        { id: 2, product: { name: 'بيتزا مارجريتا' }, quantity: 1, price: 200.00 }
      ],
      delivery_address: 'حي النرجس، الرياض',
      notes: ''
    }
  ]

  const mockProducts = [
    { id: 1, name: 'برجر دجاج', price: 75.00, description: 'برجر دجاج طازج' },
    { id: 2, name: 'بيتزا مارجريتا', price: 200.00, description: 'بيتزا إيطالية أصيلة' },
    { id: 3, name: 'سلطة خضراء', price: 45.00, description: 'سلطة طازجة ومتنوعة' }
  ]

  const { data: ordersData, isLoading: ordersLoading } = useQuery(
    ['restaurant-orders'],
    () => orderAPI.getAll(),
    {
      enabled: !!user?.restaurant,
      retry: false,
      onError: (error) => {
        console.error('Error fetching orders:', error)
      }
    }
  )

  const { data: productsData, isLoading: productsLoading } = useQuery(
    ['restaurant-products'],
    () => productAPI.getAll({ restaurant_id: user?.restaurant?.id }),
    {
      enabled: !!user?.restaurant,
      retry: false,
      onError: (error) => {
        console.error('Error fetching products:', error)
      }
    }
  )

  const updateOrderStatusMutation = useMutation(
    ({ orderId, status }) => orderAPI.updateStatus(orderId, { status }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['restaurant-orders'])
        toast.success('تم تحديث حالة الطلب بنجاح')
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'حدث خطأ في تحديث حالة الطلب')
      }
    }
  )

  // التأكد من أن orders و products دائماً مصفوفات
  const orders = useMemo(() => {
    if (!ordersData) return mockOrders
    
    // محاولة استخراج المصفوفة من الاستجابة
    const data = ordersData?.data
    if (Array.isArray(data)) return data
    if (data?.data && Array.isArray(data.data)) return data.data
    if (data?.orders && Array.isArray(data.orders)) return data.orders
    
    return mockOrders
  }, [ordersData])

  const products = useMemo(() => {
    if (!productsData) return mockProducts
    
    // محاولة استخراج المصفوفة من الاستجابة
    const data = productsData?.data
    if (Array.isArray(data)) return data
    if (data?.data && Array.isArray(data.data)) return data.data
    if (data?.products && Array.isArray(data.products)) return data.products
    
    return mockProducts
  }, [productsData])

  const filteredOrders = useMemo(() => {
    if (!Array.isArray(orders)) return []
    
    return selectedStatus === 'all' 
      ? orders 
      : orders.filter(order => order.status === selectedStatus)
  }, [orders, selectedStatus])

  const stats = useMemo(() => {
    const ordersArray = Array.isArray(orders) ? orders : []
    const productsArray = Array.isArray(products) ? products : []
    
    return [
      {
        name: 'إجمالي الطلبات',
        value: ordersArray.length,
        icon: ShoppingBagIcon,
        color: 'text-blue-600 bg-blue-100'
      },
      {
        name: 'طلبات معلقة',
        value: ordersArray.filter(order => ['pending', 'confirmed'].includes(order.status)).length,
        icon: ClockIcon,
        color: 'text-yellow-600 bg-yellow-100'
      },
      {
        name: 'طلبات قيد التحضير',
        value: ordersArray.filter(order => order.status === 'preparing').length,
        icon: ClockIcon,
        color: 'text-orange-600 bg-orange-100'
      },
      {
        name: 'طلبات جاهزة',
        value: ordersArray.filter(order => order.status === 'ready').length,
        icon: CheckCircleIcon,
        color: 'text-green-600 bg-green-100'
      },
      {
        name: 'طلبات مكتملة',
        value: ordersArray.filter(order => order.status === 'delivered').length,
        icon: CheckCircleIcon,
        color: 'text-green-600 bg-green-100'
      },
      {
        name: 'إجمالي المنتجات',
        value: productsArray.length,
        icon: ShoppingBagIcon,
        color: 'text-purple-600 bg-purple-100'
      }
    ]
  }, [orders, products])

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

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'في الانتظار',
      confirmed: 'تم التأكيد',
      preparing: 'قيد التحضير',
      ready: 'جاهز للاستلام',
      picked_up: 'تم الاستلام',
      delivered: 'تم التسليم',
      cancelled: 'ملغي'
    }
    return labels[status] || status
  }

  const handleStatusUpdate = (orderId, newStatus) => {
    updateOrderStatusMutation.mutate({ orderId, status: newStatus })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">غير مصرح لك بالوصول</h2>
          <p className="text-gray-600">يرجى تسجيل الدخول أولاً</p>
        </div>
      </div>
    )
  }

  if (!user.restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">مرحباً بك!</h2>
          <p className="text-gray-600 mb-4">يبدو أنك لم تقم بإنشاء مطعم بعد</p>
          <Link 
            to="/restaurant/register"
            className="btn-primary"
          >
            إنشاء مطعم جديد
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            لوحة المطعم - {user?.restaurant?.name}
          </h1>
          <p className="text-gray-600 mt-2">
            إدارة طلباتك ومنتجاتك
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Orders */}
          <div className="lg:col-span-2">
            <div className="card">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">الطلبات</h3>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="input py-1 text-sm"
                  >
                    <option value="all">جميع الطلبات</option>
                    <option value="pending">في الانتظار</option>
                    <option value="confirmed">تم التأكيد</option>
                    <option value="preparing">قيد التحضير</option>
                    <option value="ready">جاهز للاستلام</option>
                    <option value="picked_up">تم الاستلام</option>
                    <option value="delivered">تم التسليم</option>
                    <option value="cancelled">ملغي</option>
                  </select>
                </div>
              </div>
              <div className="card-body">
                {ordersLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
                    <p className="text-gray-600 mt-4">جاري تحميل الطلبات...</p>
                  </div>
                ) : Array.isArray(filteredOrders) && filteredOrders.length > 0 ? (
                  <div className="space-y-4">
                    {filteredOrders.map((order) => (
                      <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              #{order.order_number}
                            </h4>
                            <p className="text-sm text-gray-600">
                              {order.user?.name} - {order.total_price} ج.م
                            </p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusLabel(order.status)}
                          </span>
                        </div>

                        <div className="mb-3">
                          <h5 className="text-sm font-medium text-gray-900 mb-2">المنتجات:</h5>
                          <div className="space-y-1">
                            {order.order_items?.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-gray-600">
                                  {item.product?.name} x {item.quantity}
                                </span>
                                <span className="text-gray-900">
                                  {item.price * item.quantity} ج.م
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-sm text-gray-600">
                            <p>العنوان: {order.delivery_address}</p>
                            {order.notes && <p>ملاحظات: {order.notes}</p>}
                          </div>
                          
                          <div className="flex space-x-2 space-x-reverse">
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'confirmed')}
                                className="btn-primary text-xs px-3 py-1"
                              >
                                تأكيد
                              </button>
                            )}
                            {order.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'preparing')}
                                className="btn-primary text-xs px-3 py-1"
                              >
                                بدء التحضير
                              </button>
                            )}
                            {order.status === 'preparing' && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'ready')}
                                className="btn-primary text-xs px-3 py-1"
                              >
                                جاهز
                              </button>
                            )}
                            {order.status === 'pending' && (
                              <button
                                onClick={() => handleStatusUpdate(order.id, 'cancelled')}
                                className="btn-danger text-xs px-3 py-1"
                              >
                                إلغاء
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
                    <p className="text-gray-600">لم يتم استلام أي طلبات بعد</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-gray-900">إجراءات سريعة</h3>
              </div>
              <div className="card-body">
                <div className="space-y-4">
                  <Link
                    to="/restaurant/products"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <PlusIcon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div className="mr-4">
                      <h4 className="text-sm font-medium text-gray-900">إضافة منتج</h4>
                      <p className="text-sm text-gray-600">إضافة منتج جديد للمطعم</p>
                    </div>
                  </Link>

                  <Link
                    to="/restaurant/products"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                      <PencilIcon className="h-5 w-5 text-secondary-600" />
                    </div>
                    <div className="mr-4">
                      <h4 className="text-sm font-medium text-gray-900">إدارة المنتجات</h4>
                      <p className="text-sm text-gray-600">تعديل وإدارة منتجاتك</p>
                    </div>
                  </Link>

                  <Link
                    to="/restaurant/profile"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <PencilIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="mr-4">
                      <h4 className="text-sm font-medium text-gray-900">تعديل المطعم</h4>
                      <p className="text-sm text-gray-600">تحديث معلومات المطعم</p>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RestaurantDashboard
