# دليل تحويل API من Laravel إلى Supabase
# Laravel to Supabase API Conversion Guide

## 📋 نظرة عامة
## Overview

هذا الدليل يوضح كيفية تحويل نقاط نهاية Laravel API إلى استدعاءات Supabase من جانب العميل.
This guide shows how to convert Laravel API endpoints to Supabase client-side calls.

---

## 🔄 التحويلات الشائعة
## Common Conversions

### 1. الحصول على القائمة
### 1. Get Menu

#### Laravel (قبل)
#### Laravel (Before)

```javascript
// GET /api/restaurants/{id}/menu
const response = await axios.get(`/api/restaurants/${restaurantId}/menu`)
const menuItems = response.data
```

#### Supabase (بعد)
#### Supabase (After)

```javascript
import { getMenuItems } from './services/supabaseApi'

const { data: menuItems, error } = await getMenuItems(restaurantId)
```

**الكود الكامل:**
**Full Code:**

```javascript
// في supabaseApi.js
export const getMenuItems = async (restaurantId, categoryId = null) => {
  let query = supabase
    .from('menu_items')
    .select(`
      *,
      categories (id, name)
    `)
    .eq('restaurant_id', restaurantId)
    .eq('is_available', true)

  if (categoryId) {
    query = query.eq('category_id', categoryId)
  }

  const { data, error } = await query.order('name')
  return { data, error }
}
```

---

### 2. إنشاء طلب
### 2. Create Order

#### Laravel (قبل)
#### Laravel (Before)

```javascript
// POST /api/orders
const response = await axios.post('/api/orders', {
  restaurant_id: restaurantId,
  items: cartItems,
  address_id: addressId,
  payment_method: 'cash'
})
```

#### Supabase (بعد)
#### Supabase (After)

```javascript
import { createOrder } from './services/supabaseApi'

const { data: order, error } = await createOrder({
  restaurant_id: restaurantId,
  items: cartItems,
  address_id: addressId,
  payment_method: 'cash',
  total_amount: total,
  delivery_fee: deliveryFee
})
```

**الكود الكامل:**
**Full Code:**

```javascript
export const createOrder = async (orderData) => {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  // Create order
  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      restaurant_id: orderData.restaurant_id,
      address_id: orderData.address_id,
      total_amount: orderData.total_amount,
      status: 'pending'
    })
    .select()
    .single()

  if (orderError) throw orderError

  // Create order items
  const orderItems = orderData.items.map(item => ({
    order_id: order.id,
    menu_item_id: item.id,
    quantity: item.quantity,
    price: item.price
  }))

  await supabase.from('order_items').insert(orderItems)
  
  return { data: order, error: null }
}
```

---

### 3. الحصول على طلبات المستخدم
### 3. Get User Orders

#### Laravel (قبل)
#### Laravel (Before)

```javascript
// GET /api/user/orders
const response = await axios.get('/api/user/orders', {
  headers: { Authorization: `Bearer ${token}` }
})
```

#### Supabase (بعد)
#### Supabase (After)

```javascript
import { getUserOrders } from './services/supabaseApi'

const { data: orders, error } = await getUserOrders()
// Supabase يتعامل مع المصادقة تلقائياً
// Supabase handles authentication automatically
```

---

### 4. تحديث حالة الطلب
### 4. Update Order Status

#### Laravel (قبل)
#### Laravel (Before)

```javascript
// PATCH /api/orders/{id}/status
const response = await axios.patch(`/api/orders/${orderId}/status`, {
  status: 'confirmed'
})
```

#### Supabase (بعد)
#### Supabase (After)

```javascript
import { updateOrderStatus } from './services/supabaseApi'

const { data, error } = await updateOrderStatus(orderId, 'confirmed')
```

**ملاحظة:** RLS policies تحدد من يمكنه تحديث الطلبات
**Note:** RLS policies determine who can update orders

---

### 5. رفع صورة
### 5. Upload Image

#### Laravel (قبل)
#### Laravel (Before)

```javascript
// POST /api/upload
const formData = new FormData()
formData.append('image', file)
const response = await axios.post('/api/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
})
```

#### Supabase (بعد)
#### Supabase (After)

```javascript
import { uploadImage } from './services/supabaseApi'

const { data, error } = await uploadImage(file, 'avatars', 'profile')
// data.url يحتوي على رابط الصورة
// data.url contains image URL
```

**الكود الكامل:**
**Full Code:**

```javascript
export const uploadImage = async (file, bucket = 'images', folder = '') => {
  const { data: { user } } = await supabase.auth.getUser()
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${folder}/${user.id}-${Date.now()}.${fileExt}`

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)

  if (uploadError) throw uploadError

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)

  return { data: { url: publicUrl }, error: null }
}
```

---

### 6. المصادقة
### 6. Authentication

#### Laravel (قبل)
#### Laravel (Before)

```javascript
// POST /api/login
const response = await axios.post('/api/login', {
  email: email,
  password: password
})
localStorage.setItem('token', response.data.token)
```

#### Supabase (بعد)
#### Supabase (After)

```javascript
import { supabase } from './lib/supabaseClient'

const { data, error } = await supabase.auth.signInWithPassword({
  email: email,
  password: password
})
// Supabase يحفظ الجلسة تلقائياً
// Supabase saves session automatically
```

---

## 🔐 الأمان والصلاحيات
## Security & Permissions

### Row Level Security (RLS)

في Supabase، الأمان يتم عبر RLS policies بدلاً من middleware في Laravel:

**Laravel:**
```php
// middleware
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user/orders', [OrderController::class, 'index']);
});
```

**Supabase:**
```sql
-- RLS Policy
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);
```

---

## 📊 الاستعلامات المتقدمة
## Advanced Queries

### Join Tables
### ربط الجداول

**Laravel:**
```php
$orders = Order::with('restaurant', 'items.menuItem')->get();
```

**Supabase:**
```javascript
const { data } = await supabase
  .from('orders')
  .select(`
    *,
    restaurants (*),
    order_items (
      *,
      menu_items (*)
    )
  `)
```

### Filtering
### التصفية

**Laravel:**
```php
$items = MenuItem::where('restaurant_id', $id)
  ->where('is_available', true)
  ->where('price', '>', 10)
  ->get();
```

**Supabase:**
```javascript
const { data } = await supabase
  .from('menu_items')
  .select('*')
  .eq('restaurant_id', id)
  .eq('is_available', true)
  .gt('price', 10)
```

### Pagination
### التصفح

**Laravel:**
```php
$items = MenuItem::paginate(20);
```

**Supabase:**
```javascript
const { data } = await supabase
  .from('menu_items')
  .select('*')
  .range(0, 19) // first 20 items
```

---

## ⚡ الوقت الفعلي
## Realtime

**Laravel:** يحتاج Pusher/Broadcasting
**Laravel:** Requires Pusher/Broadcasting

**Supabase:** مدمج تلقائياً!
**Supabase:** Built-in automatically!

```javascript
// Subscribe to order changes
supabase
  .channel('orders')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders'
  }, (payload) => {
    console.log('Order updated!', payload.new)
  })
  .subscribe()
```

---

## 📝 ملاحظات
## Notes

1. **لا حاجة لـ API Routes:** كل شيء من جانب العميل
2. **No API Routes Needed:** Everything is client-side

3. **RLS يحل محل Middleware:** الأمان في قاعدة البيانات
4. **RLS Replaces Middleware:** Security in database

5. **Storage بدلاً من File Upload:** Supabase Storage للصور
6. **Storage Instead of File Upload:** Supabase Storage for images

7. **Realtime مجاني:** لا حاجة لـ Pusher
8. **Realtime is Free:** No need for Pusher

---

## 🔗 مراجع
## References

- راجع `frontend/src/services/supabaseApi.js` لجميع الأمثلة
- See `frontend/src/services/supabaseApi.js` for all examples
- [Supabase JavaScript Docs](https://supabase.com/docs/reference/javascript/introduction)

