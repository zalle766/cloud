import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useQuery } from 'react-query'
import { getUserOrders } from '../services/supabaseApi'
import { 
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  TruckIcon,
  StarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const { user, hasRole } = useAuth()

  const { data: ordersData, isLoading } = useQuery(
    ['user-orders'],
    async () => {
      const result = await getUserOrders()
      if (result.error) throw result.error
      return result.data || []
    },
    {
      enabled: !!user,
    }
  )

  const orders = ordersData || []

  const stats = [
    {
      name: 'إجمالي الطلبات',
      value: orders.length,
      icon: ShoppingBagIcon,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'طلبات معلقة',
      value: orders.filter(order => ['pending', 'confirmed', 'preparing'].includes(order.status)).length,
      icon: ClockIcon,
      color: 'text-yellow-600 bg-yellow-100'
    },
    {
      name: 'طلبات مكتملة',
      value: orders.filter(order => order.status === 'delivered').length,
      icon: CheckCircleIcon,
      color: 'text-green-600 bg-green-100'
    },
    {
      name: 'طلبات قيد التوصيل',
      value: orders.filter(order => ['ready', 'picked_up'].includes(order.status)).length,
      icon: TruckIcon,
      color: 'text-purple-600 bg-purple-100'
    }
  ]

  const recentOrders = orders.slice(0, 5)

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

  if (isLoading) {
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
          <h1 className="text-3xl font-bold text-gray-900">
            مرحباً، {user?.name}
          </h1>
          <p className="text-gray-600 mt-2">
            إليك نظرة عامة على نشاطك في Eat to Eat
          </p>
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
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">الطلبات الأخيرة</h3>
            </div>
            <div className="card-body">
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                          <ShoppingBagIcon className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="mr-4">
                          <h4 className="text-sm font-medium text-gray-900">
                            #{order.id?.substring(0, 8) || 'غير معروف'}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {order.restaurants?.name || 'مطعم غير معروف'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {(order.total_amount || 0).toFixed(2)} ج.م
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingBagIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">لا توجد طلبات</h3>
                  <p className="text-gray-600">لم تقم بأي طلبات بعد</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">إجراءات سريعة</h3>
            </div>
            <div className="card-body">
              <div className="space-y-4">
                <a
                  href="/restaurants"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                    <ShoppingBagIcon className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="mr-4">
                    <h4 className="text-sm font-medium text-gray-900">تصفح المطاعم</h4>
                    <p className="text-sm text-gray-600">اكتشف المطاعم القريبة</p>
                  </div>
                </a>

                <a
                  href="/profile"
                  className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-shrink-0 h-10 w-10 bg-secondary-100 rounded-lg flex items-center justify-center">
                    <StarIcon className="h-5 w-5 text-secondary-600" />
                  </div>
                  <div className="mr-4">
                    <h4 className="text-sm font-medium text-gray-900">الملف الشخصي</h4>
                    <p className="text-sm text-gray-600">إدارة معلوماتك الشخصية</p>
                  </div>
                </a>

                {hasRole('restaurant') && (
                  <a
                    href="/restaurant"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <CurrencyDollarIcon className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="mr-4">
                      <h4 className="text-sm font-medium text-gray-900">لوحة المطعم</h4>
                      <p className="text-sm text-gray-600">إدارة مطعمك وطلباتك</p>
                    </div>
                  </a>
                )}

                {hasRole('courier') && (
                  <a
                    href="/courier"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <TruckIcon className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="mr-4">
                      <h4 className="text-sm font-medium text-gray-900">لوحة السائق</h4>
                      <p className="text-sm text-gray-600">إدارة طلبات التوصيل</p>
                    </div>
                  </a>
                )}

                {hasRole('admin') && (
                  <a
                    href="/admin"
                    className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex-shrink-0 h-10 w-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <StarIcon className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="mr-4">
                      <h4 className="text-sm font-medium text-gray-900">لوحة الإدارة</h4>
                      <p className="text-sm text-gray-600">إدارة النظام بالكامل</p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
