# حل مشكلة عدم وجود جدول users

## المشكلة
الخطأ: `Table 'eattoeat.users' doesn't exist`

هذا يعني أن قاعدة البيانات موجودة لكن الجداول غير موجودة.

## الحل السريع

### الطريقة 1: استخدام Laravel Migrations (الأفضل)

1. **تأكد من تشغيل MySQL في XAMPP**

2. **شغّل الملف التالي:**
   ```
   fix_database_arabic.bat
   ```
   
   أو يدوياً:
   ```bash
   cd backend
   php artisan migrate --force
   ```

### الطريقة 2: استخدام SQL مباشرة (إذا فشلت الطريقة الأولى)

1. افتح phpMyAdmin: http://localhost/phpmyadmin
2. اختر قاعدة البيانات `eattoeat`
3. اضغط على تبويب **"SQL"**
4. انسخ محتوى ملف `create_users_table_only.sql`
5. الصق في مربع SQL واضغط **"Go"**

### الطريقة 3: إنشاء قاعدة البيانات والجداول يدوياً

1. افتح phpMyAdmin: http://localhost/phpmyadmin
2. اضغط **"New"** لإنشاء قاعدة بيانات جديدة
3. اسم القاعدة: `eattoeat`
4. Collation: `utf8mb4_unicode_ci`
5. اضغط **"Create"**
6. بعد إنشاء القاعدة، اضغط على تبويب **"SQL"**
7. انسخ والصق محتوى `create_users_table_only.sql`
8. اضغط **"Go"**

## التحقق من الحل

بعد إنشاء الجداول:
1. افتح http://localhost:3000/customer/register
2. املأ النموذج وأنشئ حساباً
3. يجب أن يعمل بدون أخطاء
4. تحقق من phpMyAdmin أن البيانات تم حفظها في جدول `users`

## الملفات المتوفرة

- `fix_database_arabic.bat` - تشغيل migrations تلقائياً
- `fix_database_tables.bat` - نسخة إنجليزية
- `create_users_table_only.sql` - SQL مباشر لإنشاء الجداول الأساسية
- `setup_laravel_backend.bat` - إعداد كامل للـ backend

## نصائح

- تأكد دائماً من تشغيل MySQL قبل تشغيل migrations
- إذا ظهرت أخطاء، تحقق من ملف `.env` في مجلد `backend`
- تأكد من أن قاعدة البيانات `eattoeat` موجودة

