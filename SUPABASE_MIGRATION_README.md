# دليل الانتقال من Laravel/MySQL إلى React/Supabase
# Laravel/MySQL to React/Supabase Migration Guide

## 📋 نظرة عامة
## Overview

هذا المشروع يحتوي على جميع الملفات والوثائق اللازمة للانتقال من Laravel/MySQL إلى React/Supabase.
This project contains all files and documentation needed to migrate from Laravel/MySQL to React/Supabase.

---

## 🚀 البدء السريع
## Quick Start

### 1. تثبيت التبعيات
### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. إعداد متغيرات البيئة
### 2. Setup Environment Variables

انسخ ملف `.env.example` إلى `.env`:

```bash
cp .env.example .env
```

ثم أضف قيم Supabase الخاصة بك:
Then add your Supabase values:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. تشغيل المشروع
### 3. Run Project

```bash
npm run dev
```

---

## 📁 هيكل المشروع
## Project Structure

```
frontend/
├── src/
│   ├── lib/
│   │   └── supabaseClient.js      # Supabase client configuration
│   ├── components/
│   │   ├── Auth.jsx                # Authentication component
│   │   ├── MenuList.jsx            # Menu display component
│   │   ├── Cart.jsx                # Shopping cart component
│   │   ├── Checkout.jsx            # Checkout component
│   │   └── Profile.jsx             # User profile component
│   ├── hooks/
│   │   └── useRealtimeOrders.js    # Realtime orders hook
│   └── services/
│       └── supabaseApi.js          # API service (replaces Laravel endpoints)
├── .env.example                     # Environment variables template
└── package.json                     # Dependencies

database/
└── supabase_schema.sql              # Postgres schema for Supabase

scripts/
└── migrate_mysql_to_postgres.md    # Data migration guide

templates/
└── password_reset_email_ar.txt      # Password reset email template

MIGRATION_CHECKLIST.md               # Step-by-step migration checklist
```

---

## 🔧 الإعداد
## Setup

### الخطوة 1: إنشاء مشروع Supabase
### Step 1: Create Supabase Project

1. اذهب إلى [supabase.com](https://supabase.com)
2. Go to [supabase.com](https://supabase.com)
3. أنشئ حساب جديد أو سجل الدخول
4. Create new account or sign in
5. أنشئ مشروع جديد
6. Create new project
7. انتظر حتى يكتمل الإعداد (قد يستغرق دقيقة)
8. Wait for setup to complete (may take a minute)

### الخطوة 2: إعداد قاعدة البيانات
### Step 2: Setup Database

1. افتح Supabase Dashboard
2. Open Supabase Dashboard
3. اذهب إلى SQL Editor
4. Go to SQL Editor
5. افتح ملف `database/supabase_schema.sql`
6. Open `database/supabase_schema.sql` file
7. انسخ المحتوى والصقه في SQL Editor
8. Copy content and paste in SQL Editor
9. اضغط Run لتنفيذ المخطط
10. Press Run to execute schema

### الخطوة 3: إعداد التخزين (Storage)
### Step 3: Setup Storage

1. اذهب إلى Storage في Supabase Dashboard
2. Go to Storage in Supabase Dashboard
3. أنشئ bucket جديد باسم `avatars`
4. Create new bucket named `avatars`
5. عيّن السياسات:
6. Set policies:
   - **Public Access:** Read only
   - **Authenticated Access:** Read/Write
7. كرر الخطوات لإنشاء bucket `images`
8. Repeat steps to create `images` bucket

### الخطوة 4: إعداد المصادقة
### Step 4: Setup Authentication

1. اذهب إلى Authentication > Providers
2. Go to Authentication > Providers
3. فعّل Email provider
4. Enable Email provider
5. (اختياري) عدّل قوالب البريد الإلكتروني
6. (Optional) Customize email templates

---

## 📊 نقل البيانات
## Data Migration

راجع الملف التفصيلي:
See detailed file:

**`scripts/migrate_mysql_to_postgres.md`**

هذا الملف يحتوي على:
This file contains:

- تعليمات تصدير البيانات من MySQL
- Instructions for exporting data from MySQL
- تحويل أنواع البيانات
- Data type conversions
- تعليمات الاستيراد إلى Supabase
- Import instructions to Supabase
- معالجة كلمات المرور
- Password handling

---

## 🔐 الأمان
## Security

### Row Level Security (RLS)

جميع الجداول محمية بـ RLS. السياسات المضمنة:
All tables are protected with RLS. Included policies:

- **profiles:** المستخدمون يمكنهم فقط رؤية/تعديل ملفاتهم الشخصية
- **profiles:** Users can only see/edit their own profiles
- **restaurants:** الجميع يمكنهم قراءة المطاعم النشطة، المالكون فقط يمكنهم التعديل
- **restaurants:** Everyone can read active restaurants, only owners can edit
- **orders:** المستخدمون يمكنهم رؤية طلباتهم فقط
- **orders:** Users can only see their own orders
- **menu_items:** الجميع يمكنهم قراءة العناصر المتاحة
- **menu_items:** Everyone can read available items

### المفاتيح
### Keys

- **ANON KEY:** آمن للاستخدام في المتصفح (محدود بـ RLS)
- **ANON KEY:** Safe for browser use (limited by RLS)
- **SERVICE ROLE KEY:** لا تستخدمه أبداً في كود المتصفح! فقط في serverless functions
- **SERVICE ROLE KEY:** Never use in browser code! Only in serverless functions

---

## 🎨 المكونات
## Components

### Auth.jsx
مكون المصادقة - تسجيل الدخول والتسجيل
Authentication component - login and signup

```jsx
import Auth from './components/Auth'

<Auth mode="login" />  // أو "signup"
```

### MenuList.jsx
عرض قائمة الطعام مع الفئات
Display menu items with categories

```jsx
import MenuList from './components/MenuList'

<MenuList 
  restaurantId={restaurantId}
  onAddToCart={(item) => addToCart(item)}
/>
```

### Cart.jsx
سلة التسوق مع localStorage
Shopping cart with localStorage

```jsx
import Cart, { useCart } from './components/Cart'

const { cartItems, addToCart } = useCart()
```

### Checkout.jsx
صفحة إتمام الطلب
Checkout page

```jsx
import Checkout from './components/Checkout'

<Checkout />
```

### Profile.jsx
الملف الشخصي مع رفع الصورة
User profile with image upload

```jsx
import Profile from './components/Profile'

<Profile />
```

---

## ⚡ الوقت الفعلي
## Realtime

### استخدام useRealtimeOrders
### Using useRealtimeOrders

```jsx
import { useRealtimeOrders } from './hooks/useRealtimeOrders'

// للعملاء - طلبات المستخدم
// For customers - user orders
const { orders, loading } = useRealtimeOrders({ userId: user.id })

// لأصحاب المطاعم - طلبات المطعم
// For restaurant owners - restaurant orders
const { orders, loading } = useRealtimeOrders({ restaurantId: restaurant.id })
```

الطلبات ستُحدّث تلقائياً عند تغيير الحالة!
Orders will update automatically when status changes!

---

## 🔄 تحويل API من Laravel
## Laravel API Conversion

### قبل (Laravel)
### Before (Laravel)

```javascript
// GET /api/restaurants/{id}/menu
const response = await axios.get(`/api/restaurants/${id}/menu`)
```

### بعد (Supabase)
### After (Supabase)

```javascript
import { getMenuItems } from './services/supabaseApi'

const { data, error } = await getMenuItems(restaurantId)
```

راجع ملف `frontend/src/services/supabaseApi.js` لجميع الأمثلة.
See `frontend/src/services/supabaseApi.js` for all examples.

---

## 📝 قائمة التحقق
## Checklist

راجع `MIGRATION_CHECKLIST.md` للحصول على قائمة تحقق مفصلة خطوة بخطوة.
See `MIGRATION_CHECKLIST.md` for detailed step-by-step checklist.

---

## 🐛 استكشاف الأخطاء
## Troubleshooting

### خطأ: "Missing Supabase environment variables"
### Error: "Missing Supabase environment variables"

**الحل:** تأكد من وجود ملف `.env` مع القيم الصحيحة
**Solution:** Ensure `.env` file exists with correct values

### خطأ: "Row Level Security policy violation"
### Error: "Row Level Security policy violation"

**الحل:** تأكد من تسجيل الدخول وأن سياسات RLS صحيحة
**Solution:** Ensure you're logged in and RLS policies are correct

### خطأ: "Storage bucket not found"
### Error: "Storage bucket not found"

**الحل:** أنشئ buckets في Supabase Dashboard > Storage
**Solution:** Create buckets in Supabase Dashboard > Storage

### خطأ: "Failed to fetch"
### Error: "Failed to fetch"

**الحل:** تحقق من `VITE_SUPABASE_URL` وأن المشروع نشط
**Solution:** Check `VITE_SUPABASE_URL` and that project is active

---

## 📚 الموارد
## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage](https://supabase.com/docs/guides/storage)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

## 🚀 النشر
## Deployment

### Vercel

1. اربط مستودع GitHub
2. Connect GitHub repository
3. أضف متغيرات البيئة في Vercel Settings
4. Add environment variables in Vercel Settings
5. Vercel سيكتشف `vercel.json` تلقائياً
6. Vercel will auto-detect `vercel.json`

### Netlify

1. اربط مستودع GitHub
2. Connect GitHub repository
3. Build command: `cd frontend && npm run build`
4. Publish directory: `frontend/dist`
5. أضف متغيرات البيئة
6. Add environment variables

---

## 📧 الدعم
## Support

إذا واجهت مشاكل:
If you encounter issues:

1. راجع `MIGRATION_CHECKLIST.md`
2. Review `MIGRATION_CHECKLIST.md`
3. راجع `scripts/migrate_mysql_to_postgres.md`
4. Review `scripts/migrate_mysql_to_postgres.md`
5. تحقق من سجلات Supabase Dashboard
6. Check Supabase Dashboard logs

---

## ✅ ما تم إنجازه
## What's Included

✅ Supabase client setup
✅ Database schema (Postgres)
✅ React components (Auth, Menu, Cart, Checkout, Profile)
✅ Realtime hooks
✅ API service (replaces Laravel endpoints)
✅ Migration documentation
✅ Step-by-step checklist
✅ Password reset email template
✅ RLS policies
✅ Storage setup guide

---

**آخر تحديث / Last Updated:** [تاريخ اليوم]
**الإصدار / Version:** 1.0.0

