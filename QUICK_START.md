# دليل البدء السريع - Quick Start Guide 🚀

## ابدأ في 5 خطوات فقط! (15 دقيقة)
## Start in Just 5 Steps! (15 minutes)

---

## الخطوة 1: أنشئ حساب Supabase (5 دقائق)
## Step 1: Create Supabase Account (5 minutes)

1. اذهب إلى: [https://supabase.com](https://supabase.com)
2. اضغط **"Start your project"**
3. سجل بحساب GitHub أو Gmail
4. اضغط **"New Project"**
5. املأ:
   - **Name:** `eattoeat`
   - **Password:** اختر كلمة مرور قوية (احفظها!)
   - **Region:** اختر الأقرب لك
6. اضغط **"Create new project"**
7. **انتظر 2-3 دقائق** ⏳

---

## الخطوة 2: انسخ المفاتيح (دقيقة واحدة)
## Step 2: Copy Keys (1 minute)

1. من القائمة الجانبية: **⚙️ Settings** → **API**
2. انسخ **Project URL** (مثل: `https://xxxxx.supabase.co`)
3. انسخ **anon public key** (سلسلة طويلة)

---

## الخطوة 3: أضف المفاتيح للمشروع (دقيقة واحدة)
## Step 3: Add Keys to Project (1 minute)

1. افتح ملف `frontend/.env`
2. الصق المفاتيح:

```env
VITE_SUPABASE_URL=الصق_Project_URL_هنا
VITE_SUPABASE_ANON_KEY=الصق_anon_key_هنا
```

3. احفظ الملف ✅

---

## الخطوة 4: أنشئ الجداول (3 دقائق)
## Step 4: Create Tables (3 minutes)

1. في Supabase Dashboard: اضغط **SQL Editor**
2. اضغط **"New query"**
3. افتح ملف `database/supabase_schema.sql` من مشروعك
4. انسخ كل المحتوى والصقه في SQL Editor
5. اضغط **"Run"** (أو F5)
6. انتظر حتى تظهر **"Success"** ✅

---

## الخطوة 5: شغّل المشروع (دقيقة واحدة)
## Step 5: Run Project (1 minute)

```bash
cd frontend
npm install
npm run dev
```

افتح: [http://localhost:3000](http://localhost:3000)

**🎉 تم! المشروع يعمل الآن!**

---

## كيفية الاستخدام في الكود 💻
## How to Use in Code

### استيراد الدوال المساعدة
### Import Helper Functions

```javascript
import {
  login,
  signup,
  getAll,
  add,
  update,
  remove,
  uploadFile
} from './utils/supabaseHelpers'
```

### مثال: تسجيل الدخول
### Example: Login

```javascript
const { user, error } = await login(email, password)
if (user) {
  console.log('تم تسجيل الدخول!')
}
```

### مثال: جلب المطاعم
### Example: Get Restaurants

```javascript
const { data, error } = await getAll('restaurants', {
  eq: { is_active: true }
})
console.log('المطاعم:', data)
```

### مثال: إضافة مطعم
### Example: Add Restaurant

```javascript
const { data, error } = await add('restaurants', {
  name: 'مطعم جديد',
  description: 'وصف المطعم',
  is_active: true
})
```

---

## الدوال المتاحة 📚
## Available Functions

### المصادقة (Authentication)
- `login(email, password)` - تسجيل الدخول
- `signup(email, password, name)` - إنشاء حساب
- `logout()` - تسجيل الخروج
- `getCurrentUser()` - الحصول على المستخدم الحالي
- `isLoggedIn()` - التحقق من تسجيل الدخول

### قاعدة البيانات (Database)
- `getAll(tableName, filters)` - جلب جميع السجلات
- `getById(tableName, id)` - جلب سجل واحد
- `add(tableName, record)` - إضافة سجل
- `update(tableName, id, updates)` - تحديث سجل
- `remove(tableName, id)` - حذف سجل

### التخزين (Storage)
- `uploadFile(file, bucket, folder)` - رفع ملف
- `deleteFile(bucket, filePath)` - حذف ملف

---

## أمثلة كاملة 📖
## Complete Examples

راجع الملفات التالية:
Check these files:

- `SUPABASE_SIMPLE_GUIDE_AR.md` - دليل شامل ومفصل
- `frontend/src/utils/supabaseHelpers.js` - جميع الدوال المساعدة
- `frontend/src/examples/SimpleExamples.jsx` - أمثلة جاهزة للاستخدام

---

## نصائح مهمة 💡
## Important Tips

1. **جميع الدوال جاهزة!** لا حاجة لكتابة كود معقد
2. **All functions are ready!** No need for complex code

3. **الأخطاء تظهر تلقائياً** في رسائل toast
4. **Errors show automatically** in toast messages

5. **النجاح يظهر تلقائياً** في رسائل toast
6. **Success shows automatically** in toast messages

---

## المساعدة 🆘
## Help

إذا واجهت مشكلة:

1. تأكد من وجود ملف `.env` مع المفاتيح الصحيحة
2. تأكد من تشغيل `supabase_schema.sql`
3. راجع `SUPABASE_SIMPLE_GUIDE_AR.md` للتفاصيل

---

**🎉 الآن أنت جاهز! ابدأ البرمجة!**

