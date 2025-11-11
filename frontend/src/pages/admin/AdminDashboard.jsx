import React from 'react'
import { useQuery } from 'react-query'
import { adminAPI } from '../../services/api'
import { 
  UsersIcon,
  BuildingStorefrontIcon,
  TruckIcon,
  ShoppingBagIcon,
  CurrencyDollarIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

const AdminDashboard = () => {
  const { data: dashboardData, isLoading } = useQuery(
    ['admin-dashboard'],
    () => adminAPI.getDashboard()
  )

  const stats = dashboardData?.data?.data || {}

  const statCards = [
    {
      name: 'إجمالي المستخدمين',
      value: stats.total_users || 0,
      icon: UsersIcon,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      name: 'إجمالي المطاعم',
      value: stats.total_restaurants || 0,
      icon: BuildingStorefrontIcon,
      color: 'text-green-600 bg-green-100'
    },
    {
      name: 'إجمالي السائقين',
      value: stats.total_couriers || 0,
      icon: TruckIcon,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      name: 'إجمالي الطلبات',
      value: stats.total_orders || 0,
      icon: ShoppingBagIcon,
      color: 'text-orange-600 bg-orange-100'
    },
    {
      name: 'طلبات اليوم',
      value: stats.today_orders || 0,
      icon: ChartBarIcon,
      color: 'text-indigo-600 bg-indigo-100'
    },
    {
      name: 'إجمالي الإيرادات',
      value: stats.total_revenue || 0,
      icon: CurrencyDollarIcon,
      color: 'text-yellow-600 bg-yellow-100'
    }
  ]

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
          <h1 className="text-3xl font-bold text-gray-900">لوحة الإدارة</h1>
          <p className="text-gray-600 mt-2">
            نظرة عامة على النظام وإحصائيات مفصلة
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((stat) => (
            <div key={stat.name} className="card">
              <div className="card-body">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="mr-4">
                    <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.name.includes('الإيرادات') ? `${stat.value} ج.م` : stat.value}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">إدارة المستخدمين</h3>
            </div>
            <div className="card-body">
              <p className="text-gray-600 mb-4">
                إدارة حسابات المستخدمين وتفعيل أو إلغاء تفعيل الحسابات
              </p>
              <a href="/admin/users" className="btn-primary">
                عرض المستخدمين
              </a>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">إدارة المطاعم</h3>
            </div>
            <div className="card-body">
              <p className="text-gray-600 mb-4">
                مراجعة وموافقة على طلبات المطاعم الجديدة
              </p>
              <a href="/admin/restaurants" className="btn-primary">
                عرض المطاعم
              </a>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">إدارة السائقين</h3>
            </div>
            <div className="card-body">
              <p className="text-gray-600 mb-4">
                مراجعة وموافقة على طلبات السائقين الجدد
              </p>
              <a href="/admin/couriers" className="btn-primary">
                عرض السائقين
              </a>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">إدارة الطلبات</h3>
            </div>
            <div className="card-body">
              <p className="text-gray-600 mb-4">
                مراقبة جميع الطلبات وحل المشاكل
              </p>
              <a href="/admin/orders" className="btn-primary">
                عرض الطلبات
              </a>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">التقارير والإحصائيات</h3>
            </div>
            <div className="card-body">
              <p className="text-gray-600 mb-4">
                عرض التقارير المفصلة والإحصائيات
              </p>
              <a href="/admin/reports" className="btn-primary">
                عرض التقارير
              </a>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-gray-900">إعدادات النظام</h3>
            </div>
            <div className="card-body">
              <p className="text-gray-600 mb-4">
                إدارة إعدادات النظام العامة
              </p>
              <a href="/admin/settings" className="btn-primary">
                الإعدادات
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
