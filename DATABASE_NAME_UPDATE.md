# تحديث اسم قاعدة البيانات

تم تحديث اسم قاعدة البيانات من `eattoeat` إلى `eat_to_eat` في جميع الملفات المهمة.

## الملفات المحدثة:

1. ✅ `recreate_database_complete.sql` - ملف SQL الرئيسي
2. ✅ `setup_laravel_backend.bat` - ملف إعداد Laravel
3. ✅ `backend_env.txt` - ملف الإعدادات
4. ✅ `recreate_database.bat` - ملف إعادة إنشاء قاعدة البيانات
5. ✅ `fix_database_arabic.bat` - ملف إصلاح قاعدة البيانات
6. ✅ `fix_database_tables.bat` - ملف إنشاء الجداول
7. ✅ `start_complete_system_fixed.bat` - ملف تشغيل النظام

## الخطوات التالية:

### 1. تحديث ملف .env في الـ backend

إذا كان ملف `.env` موجوداً في مجلد `backend`، قم بتحديثه:

```env
DB_DATABASE=eat_to_eat
```

أو شغّل:
```
setup_laravel_backend.bat
```

### 2. إنشاء قاعدة البيانات الجديدة

**الطريقة 1: استخدام SQL**
1. افتح phpMyAdmin: http://localhost/phpmyadmin
2. اضغط على تبويب "SQL"
3. انسخ محتوى ملف `recreate_database_complete.sql`
4. الصق في مربع SQL واضغط "Go"

**الطريقة 2: استخدام Laravel**
```bash
cd backend
php artisan migrate:fresh --force
```

أو شغّل:
```
recreate_database.bat
```

### 3. التحقق

بعد إنشاء قاعدة البيانات، تأكد من:
- قاعدة البيانات `eat_to_eat` موجودة في phpMyAdmin
- ملف `.env` يحتوي على `DB_DATABASE=eat_to_eat`
- جميع الجداول تم إنشاؤها بنجاح

## ملاحظة

إذا كانت لديك قاعدة بيانات قديمة باسم `eattoeat` وتريد نقل البيانات:
1. قم بعمل نسخة احتياطية من قاعدة البيانات القديمة
2. أنشئ قاعدة البيانات الجديدة `eat_to_eat`
3. انقل البيانات يدوياً إذا لزم الأمر

