import Pusher from 'pusher-js'

class PusherService {
  constructor() {
    this.pusher = null
    this.channels = new Map()
  }

  initialize() {
    if (this.pusher) return this.pusher

    // التحقق من وجود مفتاح Pusher قبل التهيئة
    // Check if Pusher key exists before initializing
    const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY
    const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER
    
    // التحقق من وجود المفتاح
    if (!pusherKey || pusherKey === '' || pusherKey === 'YOUR_PUSHER_KEY_HERE' || pusherKey.trim() === '') {
      console.warn('Pusher key missing — realtime disabled.')
      return null
    }

    try {
      this.pusher = new Pusher(pusherKey, {
        cluster: pusherCluster || 'mt1',
        host: import.meta.env.VITE_PUSHER_HOST,
        port: import.meta.env.VITE_PUSHER_PORT,
        scheme: import.meta.env.VITE_PUSHER_SCHEME || 'https',
        encrypted: true,
      })

      return this.pusher
    } catch (error) {
      console.warn('Pusher initialization failed:', error.message)
      return null
    }
  }

  subscribe(channelName, eventName, callback) {
    if (!this.pusher) {
      const initialized = this.initialize()
      if (!initialized) {
        // لا نطبع خطأ - Pusher اختياري
        return null
      }
    }

    try {
      if (!this.pusher) {
        return null
      }
      
      const channel = this.pusher.subscribe(channelName)
      channel.bind(eventName, callback)
      
      this.channels.set(`${channelName}-${eventName}`, channel)
      
      return channel
    } catch (error) {
      console.warn(`Pusher subscription error for ${channelName}:`, error.message)
      return null
    }
  }

  unsubscribe(channelName, eventName) {
    const key = `${channelName}-${eventName}`
    const channel = this.channels.get(key)
    
    if (channel) {
      channel.unbind(eventName)
      this.channels.delete(key)
    }
  }

  unsubscribeChannel(channelName) {
    if (this.pusher) {
      this.pusher.unsubscribe(channelName)
    }
  }

  disconnect() {
    if (this.pusher) {
      this.pusher.disconnect()
      this.pusher = null
      this.channels.clear()
    }
  }

  // Order tracking events
  subscribeToOrderUpdates(orderId, callback) {
    return this.subscribe(`order.${orderId}`, 'status-updated', callback)
  }

  // Restaurant events
  subscribeToRestaurantOrders(restaurantId, callback) {
    return this.subscribe(`restaurant.${restaurantId}`, 'new-order', callback)
  }

  // Courier events
  subscribeToCourierOrders(courierId, callback) {
    return this.subscribe(`courier.${courierId}`, 'order-assigned', callback)
  }

  // User notifications
  subscribeToUserNotifications(userId, callback) {
    return this.subscribe(`user.${userId}`, 'notification', callback)
  }
}

export default new PusherService()
