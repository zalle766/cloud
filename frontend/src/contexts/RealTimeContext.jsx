import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import pusherService from '../services/pusherService'
import toast from 'react-hot-toast'

const RealTimeContext = createContext()

export const useRealTime = () => {
  const context = useContext(RealTimeContext)
  if (!context) {
    throw new Error('useRealTime must be used within a RealTimeProvider')
  }
  return context
}

export const RealTimeProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth()
  const [isConnected, setIsConnected] = useState(false)
  const [notifications, setNotifications] = useState([])

  useEffect(() => {
    if (isAuthenticated() && user) {
      initializeRealTime()
    } else {
      pusherService.disconnect()
      setIsConnected(false)
    }

    return () => {
      pusherService.disconnect()
    }
  }, [user, isAuthenticated])

  const initializeRealTime = () => {
    // التحقق من وجود مفتاح Pusher قبل محاولة التهيئة
    // Check if Pusher key exists before attempting initialization
    const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY
    
    if (!pusherKey || pusherKey === '' || pusherKey === 'YOUR_PUSHER_KEY_HERE' || pusherKey.trim() === '') {
      // لا نطبع خطأ - Pusher اختياري
      setIsConnected(false)
      return
    }

    try {
      const pusher = pusherService.initialize()
      
      if (!pusher) {
        // Pusher غير متاح - لا بأس، الميزات الأخرى ستعمل
        // Pusher not available - that's okay, other features will work
        setIsConnected(false)
        return
      }

      setIsConnected(true)

      // Subscribe to user notifications
      if (user) {
        pusherService.subscribeToUserNotifications(user.id, (data) => {
          handleNotification(data)
        })
      }

      // Subscribe to role-specific events
      if (user?.role === 'restaurant' && user.restaurant) {
        pusherService.subscribeToRestaurantOrders(user.restaurant.id, (data) => {
          handleNewOrder(data)
        })
      }

      if (user?.role === 'courier' && user.courier) {
        pusherService.subscribeToCourierOrders(user.courier.id, (data) => {
          handleOrderAssigned(data)
        })
      }

    } catch (error) {
      // لا نطبع خطأ في Console - Pusher اختياري
      setIsConnected(false)
    }
  }

  const handleNotification = (data) => {
    const notification = {
      id: Date.now(),
      type: data.type,
      title: data.title,
      message: data.message,
      timestamp: new Date(),
      data: data.data
    }

    setNotifications(prev => [notification, ...prev])
    
    // Show toast notification
    toast.success(data.message, {
      duration: 5000,
    })
  }

  const handleNewOrder = (data) => {
    toast.success(`طلب جديد #${data.order_number}`, {
      duration: 5000,
    })
  }

  const handleOrderAssigned = (data) => {
    toast.success(`تم تعيين طلب جديد لك`, {
      duration: 5000,
    })
  }

  const subscribeToOrderUpdates = (orderId, callback) => {
    return pusherService.subscribeToOrderUpdates(orderId, callback)
  }

  const unsubscribeFromOrderUpdates = (orderId) => {
    pusherService.unsubscribe(`order.${orderId}`, 'status-updated')
  }

  const clearNotifications = () => {
    setNotifications([])
  }

  const value = {
    isConnected,
    notifications,
    subscribeToOrderUpdates,
    unsubscribeFromOrderUpdates,
    clearNotifications
  }

  return (
    <RealTimeContext.Provider value={value}>
      {children}
    </RealTimeContext.Provider>
  )
}
