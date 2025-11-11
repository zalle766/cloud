// Supabase API Service - Client-side API calls replacing Laravel endpoints
// خدمة Supabase API - استدعاءات API من جانب العميل بدلاً من نقاط نهاية Laravel
import { supabase } from '../lib/supabaseClient'
import toast from 'react-hot-toast'

/**
 * API Service Examples - Converting Laravel endpoints to Supabase calls
 * أمثلة خدمة API - تحويل نقاط نهاية Laravel إلى استدعاءات Supabase
 */

// ============================================
// MENU & CATEGORIES API
// API القائمة والفئات
// ============================================

/**
 * Get menu items for a restaurant (replaces: GET /api/restaurants/{id}/menu)
 * الحصول على عناصر القائمة لمطعم (يستبدل: GET /api/restaurants/{id}/menu)
 */
export const getMenuItems = async (restaurantId, categoryId = null) => {
  try {
    let query = supabase
      .from('menu_items')
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq('restaurant_id', restaurantId)
      .eq('is_available', true)

    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    const { data, error } = await query.order('name')

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching menu items:', error)
    toast.error('فشل تحميل القائمة')
    return { data: null, error }
  }
}

/**
 * Get categories for a restaurant (replaces: GET /api/restaurants/{id}/categories)
 * الحصول على الفئات لمطعم (يستبدل: GET /api/restaurants/{id}/categories)
 */
export const getCategories = async (restaurantId) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('restaurant_id', restaurantId)
      .order('display_order')
      .order('name')

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching categories:', error)
    return { data: null, error }
  }
}

// ============================================
// RESTAURANTS API
// API المطاعم
// ============================================

/**
 * Get all restaurants (replaces: GET /api/restaurants)
 * الحصول على جميع المطاعم (يستبدل: GET /api/restaurants)
 */
export const getRestaurants = async (filters = {}) => {
  try {
    // التحقق من أن Supabase client متاح
    if (!supabase) {
      const error = new Error('Supabase client is not initialized')
      console.error('❌ Error: Supabase client is not initialized')
      return { data: null, error }
    }

    console.log('🔍 Fetching restaurants with filters:', filters)

    let query = supabase
      .from('restaurants')
      .select('*')
      .eq('is_active', true)

    // Apply filters
    // تطبيق المرشحات
    if (filters.cuisine_type) {
      query = query.eq('cuisine_type', filters.cuisine_type)
    }
    if (filters.city) {
      query = query.eq('city', filters.city)
    }
    if (filters.min_rating) {
      query = query.gte('rating', filters.min_rating)
    }

    const { data, error } = await query.order('rating', { ascending: false })

    if (error) {
      console.error('❌ Supabase error fetching restaurants:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      throw error
    }

    console.log(`✅ Successfully fetched ${data?.length || 0} restaurants`)
    if (data && data.length > 0) {
      console.log('📋 Sample restaurant:', data[0])
    } else {
      console.warn('⚠️ No restaurants found in database. Make sure you have run the seed data SQL file.')
    }

    return { data: data || [], error: null }
  } catch (error) {
    console.error('❌ Error fetching restaurants:', error)
    return { data: null, error }
  }
}

/**
 * Get restaurant by ID (replaces: GET /api/restaurants/{id})
 * الحصول على مطعم بالمعرف (يستبدل: GET /api/restaurants/{id})
 */
export const getRestaurant = async (restaurantId) => {
  try {
    const { data, error } = await supabase
      .from('restaurants')
      .select('*')
      .eq('id', restaurantId)
      .eq('is_active', true)
      .single()

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching restaurant:', error)
    return { data: null, error }
  }
}

// ============================================
// ORDERS API
// API الطلبات
// ============================================

/**
 * Create order (replaces: POST /api/orders)
 * إنشاء طلب (يستبدل: POST /api/orders)
 */
export const createOrder = async (orderData) => {
  try {
    // Get current user
    // الحصول على المستخدم الحالي
    const response = await supabase.auth.getUser()
    if (!response || !response.data || !response.data.user) {
      throw new Error('يجب تسجيل الدخول أولاً')
    }
    const user = response.data.user

    // Create order
    // إنشاء الطلب
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        restaurant_id: orderData.restaurant_id,
        address_id: orderData.address_id,
        total_amount: orderData.total_amount,
        delivery_fee: orderData.delivery_fee || 0,
        payment_method: orderData.payment_method || 'cash',
        notes: orderData.notes || null,
        status: 'pending',
      })
      .select()
      .single()

    if (orderError) throw orderError

    // Create order items
    // إنشاء عناصر الطلب
    const orderItems = orderData.items.map((item) => ({
      order_id: order.id,
      menu_item_id: item.menu_item_id,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.price * item.quantity,
      special_instructions: item.special_instructions || null,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) throw itemsError

    toast.success('تم إنشاء الطلب بنجاح!')
    return { data: order, error: null }
  } catch (error) {
    console.error('Error creating order:', error)
    toast.error(error.message || 'فشل إنشاء الطلب')
    return { data: null, error }
  }
}

/**
 * Get user orders (replaces: GET /api/user/orders)
 * الحصول على طلبات المستخدم (يستبدل: GET /api/user/orders)
 */
export const getUserOrders = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized')
    }
    
    const getUserPromise = supabase.auth.getUser()
    const authResponse = await getUserPromise
    
    if (authResponse.error) {
      throw new Error('يجب تسجيل الدخول أولاً')
    }
    if (!authResponse.data || !authResponse.data.user) {
      throw new Error('يجب تسجيل الدخول أولاً')
    }
    const userId = authResponse.data.user.id

    const ordersQuery = supabase
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
          address
        ),
        order_items (
          *,
          menu_items (
            id,
            name,
            image_url
          )
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    const ordersResponse = await ordersQuery

    if (ordersResponse.error) throw ordersResponse.error
    return { data: ordersResponse.data, error: null }
  } catch (error) {
    console.error('Error fetching user orders:', error)
    return { data: null, error }
  }
}

/**
 * Get order by ID (replaces: GET /api/orders/{id})
 * الحصول على طلب بالمعرف (يستبدل: GET /api/orders/{id})
 */
export const getOrder = async (orderId) => {
  try {
    if (!supabase) {
      throw new Error('Supabase client is not initialized')
    }
    
    const getUserPromise = supabase.auth.getUser()
    const authResponse = await getUserPromise
    
    if (authResponse.error) {
      throw new Error('يجب تسجيل الدخول أولاً')
    }
    if (!authResponse.data || !authResponse.data.user) {
      throw new Error('يجب تسجيل الدخول أولاً')
    }
    const userId = authResponse.data.user.id

    const orderQuery = supabase
      .from('orders')
      .select(`
        *,
        restaurants (
          id,
          name,
          image_url,
          address,
          latitude,
          longitude
        ),
        addresses (
          id,
          label,
          address,
          latitude,
          longitude
        ),
        order_items (
          *,
          menu_items (
            id,
            name,
            image_url,
            price
          )
        )
      `)
      .eq('id', orderId)
      .eq('user_id', userId)
      .single()

    const orderResponse = await orderQuery

    if (orderResponse.error) throw orderResponse.error
    return { data: orderResponse.data, error: null }
  } catch (error) {
    console.error('Error fetching order:', error)
    return { data: null, error }
  }
}

/**
 * Update order status (replaces: PATCH /api/orders/{id}/status)
 * تحديث حالة الطلب (يستبدل: PATCH /api/orders/{id}/status)
 */
export const updateOrderStatus = async (orderId, newStatus) => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error

    toast.success('تم تحديث حالة الطلب')
    return { data, error: null }
  } catch (error) {
    console.error('Error updating order status:', error)
    toast.error('فشل تحديث حالة الطلب')
    return { data: null, error }
  }
}

// ============================================
// ADDRESSES API
// API العناوين
// ============================================

/**
 * Get user addresses (replaces: GET /api/user/addresses)
 * الحصول على عناوين المستخدم (يستبدل: GET /api/user/addresses)
 */
export const getUserAddresses = async () => {
  try {
    const response = await supabase.auth.getUser()
    if (!response || !response.data || !response.data.user) {
      throw new Error('يجب تسجيل الدخول أولاً')
    }
    const user = response.data.user

    const { data, error } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error('Error fetching addresses:', error)
    return { data: null, error }
  }
}

/**
 * Create address (replaces: POST /api/user/addresses)
 * إنشاء عنوان (يستبدل: POST /api/user/addresses)
 */
export const createAddress = async (addressData) => {
  try {
    const response = await supabase.auth.getUser()
    if (!response || !response.data || !response.data.user) {
      throw new Error('يجب تسجيل الدخول أولاً')
    }
    const user = response.data.user

    // If this is set as default, unset other defaults
    // إذا تم تعيينه كافتراضي، إلغاء تعيين الافتراضيات الأخرى
    if (addressData.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    const { data, error } = await supabase
      .from('addresses')
      .insert({
        user_id: user.id,
        ...addressData,
      })
      .select()
      .single()

    if (error) throw error

    toast.success('تم إضافة العنوان بنجاح')
    return { data, error: null }
  } catch (error) {
    console.error('Error creating address:', error)
    toast.error('فشل إضافة العنوان')
    return { data: null, error }
  }
}

// ============================================
// STORAGE API (File Uploads)
// API التخزين (رفع الملفات)
// ============================================

/**
 * Upload image to Supabase Storage (replaces: POST /api/upload)
 * رفع صورة إلى Supabase Storage (يستبدل: POST /api/upload)
 */
export const uploadImage = async (file, bucket = 'images', folder = '') => {
  try {
    const response = await supabase.auth.getUser()
    if (!response || !response.data || !response.data.user) {
      throw new Error('يجب تسجيل الدخول أولاً')
    }
    const user = response.data.user

    // Generate unique filename
    // إنشاء اسم ملف فريد
    const fileExt = file.name.split('.').pop()
    const fileName = `${folder ? folder + '/' : ''}${user.id}-${Date.now()}.${fileExt}`

    // Upload file
    // رفع الملف
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (uploadError) throw uploadError

    // Get public URL
    // الحصول على الرابط العام
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(fileName)

    return { data: { url: publicUrl, path: fileName }, error: null }
  } catch (error) {
    console.error('Error uploading image:', error)
    toast.error('فشل رفع الصورة')
    return { data: null, error }
  }
}

/**
 * Delete image from Supabase Storage
 * حذف صورة من Supabase Storage
 */
export const deleteImage = async (filePath, bucket = 'images') => {
  try {
    const { error } = await supabase.storage.from(bucket).remove([filePath])

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error('Error deleting image:', error)
    return { error }
  }
}
