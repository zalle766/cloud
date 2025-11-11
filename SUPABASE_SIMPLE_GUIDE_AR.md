# دليل Supabase السهل جداً للمبتدئين 🚀
# Very Easy Supabase Guide for Beginners

## ما هو Supabase؟ 🤔
## What is Supabase?

Supabase هو مثل Firebase لكن مجاني وسهل الاستخدام. يوفر لك:
Supabase is like Firebase but free and easy to use. It provides:

- ✅ **قاعدة بيانات** (Database) - لحفظ البيانات
- ✅ **Database** - to store data
- ✅ **المصادقة** (Authentication) - لتسجيل الدخول
- ✅ **Authentication** - for login
- ✅ **التخزين** (Storage) - لرفع الصور
- ✅ **Storage** - to upload images
- ✅ **الوقت الفعلي** (Realtime) - للتحديثات الفورية
- ✅ **Realtime** - for instant updates

**الخلاصة:** Supabase = قاعدة بيانات + مصادقة + تخزين + وقت فعلي = كل ما تحتاجه!
**Summary:** Supabase = Database + Auth + Storage + Realtime = Everything you need!

---

## الخطوة 1: إنشاء حساب Supabase (5 دقائق) ⏱️
## Step 1: Create Supabase Account (5 minutes)

### 1.1 اذهب إلى الموقع
### 1.1 Go to Website

افتح المتصفح واذهب إلى: [https://supabase.com](https://supabase.com)

### 1.2 أنشئ حساب
### 1.2 Create Account

1. اضغط على **"Start your project"** أو **"Sign Up"**
2. سجل بحساب GitHub أو Gmail (أسهل طريقة)
3. أكمل التسجيل

### 1.3 أنشئ مشروع جديد
### 1.3 Create New Project

1. اضغط على **"New Project"**
2. املأ البيانات:
   - **Name:** `eattoeat` (أو أي اسم تريده)
   - **Database Password:** اختر كلمة مرور قوية (احفظها!)
   - **Region:** اختر الأقرب لك (مثلاً: `West US`)
3. اضغط **"Create new project"**
4. **انتظر 2-3 دقائق** حتى يكتمل الإعداد (ستظهر رسالة "Setting up your project")

---

## الخطوة 2: الحصول على المفاتيح (2 دقيقة) 🔑
## Step 2: Get Your Keys (2 minutes)

بعد اكتمال الإعداد:

### 2.1 اذهب إلى Settings
### 2.1 Go to Settings

1. من القائمة الجانبية، اضغط على **⚙️ Settings**
2. اضغط على **API** من القائمة

### 2.2 انسخ المفاتيح
### 2.2 Copy Keys

ستجد قسمين مهمين:

#### أ) Project URL
انسخ هذا الرابط (سيشبه):
```
https://xxxxxxxxxxxxx.supabase.co
```

#### ب) anon public key
انسخ هذا المفتاح (سيشبه):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh4eHh4eHh4eHh4eHh4eHgiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTk4NzIwMCwiZXhwIjoxOTYxNTYzMjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ مهم:** لا تشارك هذه المفاتيح مع أحد!
**⚠️ Important:** Don't share these keys with anyone!

---

## الخطوة 3: إعداد المشروع (3 دقائق) ⚙️
## Step 3: Setup Project (3 minutes)

### 3.1 افتح ملف .env
### 3.1 Open .env File

اذهب إلى مجلد `frontend` وافتح ملف `.env` (أو أنشئه إذا لم يكن موجوداً)

### 3.2 أضف المفاتيح
### 3.2 Add Keys

الصق المفاتيح التي نسختها:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**مثال:**
```env
VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0NTk4NzIwMCwiZXhwIjoxOTYxNTYzMjAwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### 3.3 احفظ الملف
### 3.3 Save File

احفظ الملف وأغلق المحرر.

---

## الخطوة 4: إنشاء الجداول (5 دقائق) 📊
## Step 4: Create Tables (5 minutes)

### 4.1 افتح SQL Editor
### 4.1 Open SQL Editor

1. في Supabase Dashboard، اضغط على **SQL Editor** من القائمة الجانبية
2. اضغط على **"New query"**

### 4.2 انسخ الكود
### 4.2 Copy Code

افتح ملف `database/supabase_schema.sql` من مشروعك، انسخ كل المحتوى.

### 4.3 الصق وشغّل
### 4.3 Paste and Run

1. الصق الكود في SQL Editor
2. اضغط على **"Run"** (أو F5)
3. انتظر حتى تظهر رسالة **"Success"**

**✅ تم!** الآن لديك جميع الجداول جاهزة!

---

## الخطوة 5: تشغيل المشروع (دقيقة واحدة) 🚀
## Step 5: Run Project (1 minute)

### 5.1 افتح Terminal
### 5.1 Open Terminal

في مجلد المشروع الرئيسي:

```bash
cd frontend
npm install
npm run dev
```

### 5.2 افتح المتصفح
### 5.2 Open Browser

افتح: [http://localhost:3000](http://localhost:3000)

**🎉 تم! المشروع يعمل الآن!**

---

## كيفية استخدام Supabase في الكود (أمثلة بسيطة) 💻
## How to Use Supabase in Code (Simple Examples)

### مثال 1: تسجيل الدخول 🔐
### Example 1: Login

```javascript
import { supabase } from './lib/supabaseClient'

// تسجيل الدخول
// Login
const login = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password
  })
  
  if (error) {
    console.log('خطأ:', error.message)
  } else {
    console.log('تم تسجيل الدخول!', data.user)
  }
}
```

### مثال 2: التسجيل (إنشاء حساب) 📝
### Example 2: Sign Up

```javascript
const signup = async (email, password, name) => {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
    options: {
      data: {
        name: name
      }
    }
  })
  
  if (error) {
    console.log('خطأ:', error.message)
  } else {
    console.log('تم إنشاء الحساب!', data.user)
  }
}
```

### مثال 3: جلب البيانات (قراءة) 📖
### Example 3: Get Data (Read)

```javascript
// جلب جميع المطاعم
// Get all restaurants
const getRestaurants = async () => {
  const { data, error } = await supabase
    .from('restaurants')
    .select('*')
    .eq('is_active', true)
  
  if (error) {
    console.log('خطأ:', error.message)
  } else {
    console.log('المطاعم:', data)
    return data
  }
}
```

### مثال 4: إضافة بيانات (كتابة) ✍️
### Example 4: Add Data (Write)

```javascript
// إضافة مطعم جديد
// Add new restaurant
const addRestaurant = async (name, description) => {
  const { data, error } = await supabase
    .from('restaurants')
    .insert([
      {
        name: name,
        description: description,
        is_active: true
      }
    ])
  
  if (error) {
    console.log('خطأ:', error.message)
  } else {
    console.log('تم الإضافة!', data)
  }
}
```

### مثال 5: تحديث البيانات 🔄
### Example 5: Update Data

```javascript
// تحديث مطعم
// Update restaurant
const updateRestaurant = async (id, newName) => {
  const { data, error } = await supabase
    .from('restaurants')
    .update({ name: newName })
    .eq('id', id)
  
  if (error) {
    console.log('خطأ:', error.message)
  } else {
    console.log('تم التحديث!', data)
  }
}
```

### مثال 6: حذف البيانات 🗑️
### Example 6: Delete Data

```javascript
// حذف مطعم
// Delete restaurant
const deleteRestaurant = async (id) => {
  const { data, error } = await supabase
    .from('restaurants')
    .delete()
    .eq('id', id)
  
  if (error) {
    console.log('خطأ:', error.message)
  } else {
    console.log('تم الحذف!')
  }
}
```

### مثال 7: رفع صورة 📸
### Example 7: Upload Image

```javascript
// رفع صورة
// Upload image
const uploadImage = async (file) => {
  // إنشاء اسم فريد للملف
  // Create unique file name
  const fileName = `${Date.now()}-${file.name}`
  
  // رفع الملف
  // Upload file
  const { data, error } = await supabase.storage
    .from('images')
    .upload(fileName, file)
  
  if (error) {
    console.log('خطأ:', error.message)
  } else {
    // الحصول على رابط الصورة
    // Get image URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(fileName)
    
    console.log('رابط الصورة:', publicUrl)
    return publicUrl
  }
}
```

---

## نصائح مهمة 💡
## Important Tips

### 1. الأخطاء الشائعة
### 1. Common Errors

**❌ خطأ: "Missing Supabase environment variables"**
- **الحل:** تأكد من وجود ملف `.env` مع المفاتيح الصحيحة

**❌ خطأ: "relation does not exist"**
- **الحل:** تأكد من تشغيل `supabase_schema.sql` في SQL Editor

**❌ خطأ: "new row violates row-level security policy"**
- **الحل:** تأكد من تسجيل الدخول أولاً

### 2. كيفية التحقق من البيانات
### 2. How to Check Data

1. اذهب إلى Supabase Dashboard
2. اضغط على **Table Editor**
3. اختر الجدول الذي تريده
4. ستشاهد جميع البيانات

### 3. كيفية اختبار API
### 3. How to Test API

استخدم **Table Editor** في Supabase:
- يمكنك إضافة/تعديل/حذف البيانات مباشرة
- التغييرات ستظهر فوراً في التطبيق!

---

## روابط مفيدة 🔗
## Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Docs](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

## الخلاصة 📝
## Summary

1. ✅ أنشئ حساب Supabase
2. ✅ أنشئ مشروع جديد
3. ✅ انسخ المفاتيح إلى `.env`
4. ✅ شغّل `supabase_schema.sql`
5. ✅ استخدم الكود في الأمثلة أعلاه

**🎉 الآن أنت جاهز لاستخدام Supabase!**

---

**هل تحتاج مساعدة؟** راجع الملفات الأخرى:
- `SUPABASE_MIGRATION_README.md` - دليل شامل
- `MIGRATION_CHECKLIST.md` - قائمة التحقق
- `API_CONVERSION_GUIDE.md` - أمثلة متقدمة

