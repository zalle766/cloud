# دليل إصلاح الاتصال بقاعدة البيانات

## المشكلة
كان هناك مشكلة في الاتصال بين الواجهة الأمامية والخادم الخلفي، مما يمنع حفظ بيانات المستخدمين في قاعدة البيانات.

## الحلول المطبقة

### 1. إصلاح مسارات API
- تم تغيير مسارات API في الـ backend من `/register` إلى `/auth/register`
- تم تغيير مسارات API من `/login` إلى `/auth/login`
- تم إضافة مسار `/user/profile` للتوافق مع الواجهة الأمامية

### 2. إصلاح عنوان API
- تم تغيير عنوان API الافتراضي من `http://localhost:5000/api` إلى `http://localhost:8000/api`
- هذا يطابق منفذ Laravel الافتراضي

### 3. إصلاح تنسيق البيانات
- تم تعديل `CustomerRegister.jsx` لإرسال البيانات بالتنسيق الصحيح:
  - `name` بدلاً من `firstName` و `lastName`
  - `phone` بدلاً من `phoneNumber`
  - `address` بدلاً من `street` و `fullAddress`
  - إضافة `role: 'customer'` تلقائياً
  - إضافة `password_confirmation`

### 4. إعدادات قاعدة البيانات
- تم إنشاء ملف `.env` للـ backend مع إعدادات MySQL الصحيحة
- قاعدة البيانات: `eattoeat`
- المستخدم: `root`
- كلمة المرور: (فارغة - كما في XAMPP الافتراضي)

## خطوات الإعداد

### الخطوة 1: إعداد قاعدة البيانات
1. افتح XAMPP Control Panel
2. تأكد من تشغيل MySQL
3. افتح phpMyAdmin (http://localhost/phpmyadmin)
4. أنشئ قاعدة بيانات جديدة باسم `eattoeat` إذا لم تكن موجودة

### الخطوة 2: إعداد الـ Backend
1. افتح Terminal في مجلد المشروع
2. شغّل الملف التالي:
   ```bash
   setup_laravel_backend.bat
   ```
   أو يدوياً:
   ```bash
   cd backend
   composer install
   php artisan key:generate
   php artisan migrate
   php artisan storage:link
   ```

### الخطوة 3: تشغيل النظام
1. شغّل الملف التالي لتشغيل النظام بالكامل:
   ```bash
   start_complete_system_fixed.bat
   ```
   
   أو يدوياً:
   
   **في Terminal الأول (Backend):**
   ```bash
   cd backend
   php artisan serve
   ```
   
   **في Terminal الثاني (Frontend):**
   ```bash
   cd frontend
   npm run dev
   ```

### الخطوة 4: التحقق من الاتصال
1. افتح المتصفح على: http://localhost:3000
2. اذهب إلى صفحة التسجيل: http://localhost:3000/customer/register
3. املأ النموذج وجرب إنشاء حساب
4. تحقق من قاعدة البيانات في phpMyAdmin أن البيانات تم حفظها في جدول `users`

## الملفات المعدلة

1. `backend/routes/api.php` - إصلاح مسارات API
2. `frontend/src/services/api.js` - إصلاح عنوان API
3. `frontend/src/pages/auth/CustomerRegister.jsx` - إصلاح تنسيق البيانات
4. `backend/.env` - إنشاء ملف الإعدادات (سيتم إنشاؤه تلقائياً)

## ملاحظات مهمة

1. **تأكد من تشغيل MySQL** في XAMPP قبل تشغيل Laravel
2. **تأكد من وجود قاعدة البيانات** `eattoeat` في MySQL
3. **المنفذ 8000** يجب أن يكون متاحاً للـ backend
4. **المنفذ 3000** يجب أن يكون متاحاً للـ frontend
5. إذا ظهرت أخطاء، تحقق من:
   - أن MySQL يعمل
   - أن قاعدة البيانات موجودة
   - أن ملف `.env` موجود في مجلد `backend`
   - أن `APP_KEY` تم توليده (شغّل `php artisan key:generate`)

## اختبار التسجيل

بعد تشغيل النظام:
1. افتح http://localhost:3000/customer/register
2. املأ النموذج:
   - الاسم الكامل
   - البريد الإلكتروني
   - رقم الهاتف (اختياري)
   - العنوان (اختياري)
   - كلمة المرور
   - تأكيد كلمة المرور
3. اضغط "إنشاء حساب عميل"
4. إذا نجح التسجيل، ستظهر رسالة نجاح وسيتم حفظ البيانات في قاعدة البيانات

## التحقق من قاعدة البيانات

1. افتح phpMyAdmin: http://localhost/phpmyadmin
2. اختر قاعدة البيانات `eattoeat`
3. افتح جدول `users`
4. يجب أن ترى المستخدم الجديد مع جميع البيانات المدخلة

