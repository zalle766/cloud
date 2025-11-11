# إصلاح مشكلة SQLite وتحويل إلى MySQL

## المشكلة:
الموقع يستخدم SQLite بدلاً من MySQL كما هو مطلوب.

## الحل:

### الخطوة 1: إنشاء قاعدة البيانات
```sql
-- تشغيل هذا في MySQL
CREATE DATABASE IF NOT EXISTS `eattoeat` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### الخطوة 2: إصلاح ملف .env
```bash
# تشغيل هذا الأمر
quick_fix.bat
```

### الخطوة 3: إعداد Laravel
```bash
# تشغيل هذا الأمر
fix_mysql_connection.bat
```

## الملفات المطلوبة:

1. **env_mysql.txt** - ملف .env الصحيح مع إعدادات MySQL
2. **quick_fix.bat** - نسخ ملف .env الصحيح
3. **fix_mysql_connection.bat** - إعداد Laravel كاملاً
4. **create_eattoeat_database.sql** - إنشاء قاعدة البيانات

## إعدادات MySQL الصحيحة:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eattoeat
DB_USERNAME=root
DB_PASSWORD=
```

## التحقق من الإصلاح:

بعد تشغيل `fix_mysql_connection.bat`، يجب أن ترى:
- Laravel يعمل على http://localhost:8000
- قاعدة البيانات تستخدم MySQL
- جميع الجداول منشأة
- البيانات التجريبية محملة

## استكشاف الأخطاء:

1. **خطأ الاتصال بقاعدة البيانات:**
   - تأكد من تشغيل MySQL
   - تأكد من إنشاء قاعدة البيانات `eattoeat`

2. **خطأ في Migration:**
   - استخدم `php artisan migrate:fresh` لإعادة إنشاء الجداول

3. **خطأ في الصلاحيات:**
   - تأكد من أن MySQL يعمل على المنفذ 3306
   - تأكد من صحة اسم المستخدم وكلمة المرور
