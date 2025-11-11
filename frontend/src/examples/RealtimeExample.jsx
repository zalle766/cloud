// Realtime Example Component - Shows how to use realtime subscriptions
// مكون مثال الوقت الفعلي - يوضح كيفية استخدام الاشتراكات في الوقت الفعلي
import { useEffect, useState } from 'react'
import { useRealtimeOrders, useRestaurantOrders } from '../hooks/useRealtimeOrders'
import { supabase } from '../lib/supabaseClient'

/**
 * Example: Restaurant Dashboard with Real-time Order Notifications
 * مثال: لوحة تحكم المطعم مع إشعارات الطلبات في الوقت الفعلي
 */
const RestaurantDashboard = ({ restaurantId }) => {
  const { orders, newOrders, loading } = useRestaurantOrders(restaurantId)

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">لوحة تحكم المطعم</h1>

      {loading ? (
        <div>جاري التحميل...</div>
      ) : (
        <>
          <div className="mb-4">
            <h2 className="text-xl font-semibold">
              طلبات جديدة: {newOrders.length}
            </h2>
          </div>

          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className={`p-4 border rounded-lg ${
                  order.status === 'pending' ? 'bg-yellow-50' : ''
                }`}
              >
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">طلب #{order.id.slice(0, 8)}</p>
                    <p className="text-sm text-gray-600">
                      الحالة: {order.status}
                    </p>
                    <p className="text-sm">
                      الإجمالي: {order.total_amount} ر.س
                    </p>
                  </div>
                  <button
                    onClick={() => updateOrderStatus(order.id, 'confirmed')}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                  >
                    تأكيد الطلب
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/**
 * Example: Customer Order Tracking
 * مثال: تتبع طلب العميل
 */
const CustomerOrderTracking = ({ userId }) => {
  const { orders, loading } = useRealtimeOrders({ userId })

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">تتبع طلباتي</h1>

      {loading ? (
        <div>جاري التحميل...</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">
                    {order.restaurants?.name || 'مطعم'}
                  </p>
                  <p className="text-sm text-gray-600">
                    الحالة: <span className="font-semibold">{order.status}</span>
                  </p>
                  <p className="text-sm">
                    {new Date(order.created_at).toLocaleString('ar-SA')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">
                    {order.total_amount} ر.س
                  </p>
                </div>
              </div>

              {/* Order Status Progress */}
              {/* تقدم حالة الطلب */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm">
                  <span
                    className={
                      ['pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered'].includes(
                        order.status
                      )
                        ? 'text-green-600'
                        : ''
                    }
                  >
                    {order.status === 'pending' && '⏳ في الانتظار'}
                    {order.status === 'confirmed' && '✅ مؤكد'}
                    {order.status === 'preparing' && '👨‍🍳 قيد التحضير'}
                    {order.status === 'ready' && '📦 جاهز'}
                    {order.status === 'out_for_delivery' && '🚗 في الطريق'}
                    {order.status === 'delivered' && '✓ تم التسليم'}
                    {order.status === 'cancelled' && '❌ ملغي'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/**
 * Example: Simple Realtime Subscription (Manual)
 * مثال: اشتراك بسيط في الوقت الفعلي (يدوي)
 */
const SimpleRealtimeExample = () => {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    // Subscribe to orders table changes
    // الاشتراك في تغييرات جدول الطلبات
    const channel = supabase
      .channel('orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        (payload) => {
          console.log('Change received!', payload)

          if (payload.eventType === 'INSERT') {
            setOrders((prev) => [payload.new, ...prev])
          } else if (payload.eventType === 'UPDATE') {
            setOrders((prev) =>
              prev.map((order) =>
                order.id === payload.new.id ? payload.new : order
              )
            )
          } else if (payload.eventType === 'DELETE') {
            setOrders((prev) =>
              prev.filter((order) => order.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    // Cleanup
    // التنظيف
    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  return (
    <div>
      <h2>الطلبات (تحديث فوري)</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>
            {order.id} - {order.status}
          </li>
        ))}
      </ul>
    </div>
  )
}

// Helper function to update order status
// دالة مساعدة لتحديث حالة الطلب
const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)

    if (error) throw error
  } catch (error) {
    console.error('Error updating order:', error)
  }
}

export { RestaurantDashboard, CustomerOrderTracking, SimpleRealtimeExample }

