// useRealtimeOrders Hook - Subscribe to order updates in real-time
// Hook للطلبات في الوقت الفعلي - الاشتراك في تحديثات الطلبات
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

/**
 * Hook to subscribe to real-time order updates
 * Hook للاشتراك في تحديثات الطلبات في الوقت الفعلي
 * 
 * @param {string} restaurantId - Restaurant ID to filter orders (optional)
 * @param {string} userId - User ID to filter orders (optional)
 * @returns {object} { orders, loading, error }
 */
export const useRealtimeOrders = ({ restaurantId = null, userId = null } = {}) => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Initial fetch
    // جلب أولي
    fetchOrders()

    // Set up real-time subscription
    // إعداد الاشتراك في الوقت الفعلي
    const channel = supabase
      .channel('orders_changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'orders',
          filter: restaurantId
            ? `restaurant_id=eq.${restaurantId}`
            : userId
            ? `user_id=eq.${userId}`
            : undefined,
        },
        (payload) => {
          console.log('Order change received:', payload)

          // Handle different event types
          // التعامل مع أنواع الأحداث المختلفة
          if (payload.eventType === 'INSERT') {
            // New order created
            // طلب جديد تم إنشاؤه
            setOrders((prev) => [payload.new, ...prev])
            toast.success('طلب جديد!')
          } else if (payload.eventType === 'UPDATE') {
            // Order updated
            // تم تحديث الطلب
            setOrders((prev) =>
              prev.map((order) =>
                order.id === payload.new.id ? payload.new : order
              )
            )
            
            // Show notification for status changes
            // إظهار إشعار لتغييرات الحالة
            if (payload.old.status !== payload.new.status) {
              toast.success(`تم تحديث حالة الطلب: ${payload.new.status}`)
            }
          } else if (payload.eventType === 'DELETE') {
            // Order deleted
            // تم حذف الطلب
            setOrders((prev) =>
              prev.filter((order) => order.id !== payload.old.id)
            )
          }
        }
      )
      .subscribe()

    // Cleanup subscription on unmount
    // تنظيف الاشتراك عند إلغاء التحميل
    return () => {
      supabase.removeChannel(channel)
    }
  }, [restaurantId, userId])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('orders')
        .select(`
          *,
          restaurants (
            id,
            name,
            image_url
          ),
          addresses (
            id,
            label,
            address,
            city
          ),
          order_items (
            id,
            quantity,
            price,
            subtotal,
            menu_items (
              id,
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false })

      // Apply filters
      // تطبيق المرشحات
      if (restaurantId) {
        query = query.eq('restaurant_id', restaurantId)
      }
      if (userId) {
        query = query.eq('user_id', userId)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      setOrders(data || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err.message)
      toast.error('فشل تحميل الطلبات')
    } finally {
      setLoading(false)
    }
  }

  return { orders, loading, error, refetch: fetchOrders }
}

/**
 * Hook for restaurant owners to get new order notifications
 * Hook لأصحاب المطاعم للحصول على إشعارات الطلبات الجديدة
 */
export const useRestaurantOrders = (restaurantId) => {
  const { orders, loading, error } = useRealtimeOrders({ restaurantId })

  // Filter only pending/confirmed orders for notifications
  // تصفية الطلبات المعلقة/المؤكدة فقط للإشعارات
  const newOrders = orders.filter(
    (order) => order.status === 'pending' || order.status === 'confirmed'
  )

  return {
    orders,
    newOrders,
    loading,
    error,
  }
}

/**
 * Hook for customers to track their orders
 * Hook للعملاء لتتبع طلباتهم
 */
export const useCustomerOrders = (userId) => {
  return useRealtimeOrders({ userId })
}

