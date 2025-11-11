# تعليمات إعداد Eat to Eat

## إعداد البيئة

### 1. إعداد Laravel Backend

1. انتقل إلى مجلد `backend`:
```bash
cd backend
```

2. انسخ ملف البيئة:
```bash
cp .env.example .env
```

3. قم بتثبيت التبعيات:
```bash
composer install
```

4. أنشئ مفتاح التطبيق:
```bash
php artisan key:generate
```

5. قم بتشغيل migrations:
```bash
php artisan migrate
```

6. قم بتشغيل seeders:
```bash
php artisan db:seed
```

7. ابدأ الخادم:
```bash
php artisan serve
```

### 2. إعداد React Frontend

1. انتقل إلى مجلد `frontend`:
```bash
cd frontend
```

2. انسخ ملف البيئة:
```bash
cp .env.example .env
```

3. قم بتثبيت التبعيات:
```bash
npm install
```

4. ابدأ خادم التطوير:
```bash
npm run dev
```

### 3. إعداد الخدمات الخارجية

#### Google Maps API
1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google Maps JavaScript API
4. أنشئ API key
5. أضف المفتاح إلى ملف `.env` في كلا من backend و frontend

#### Pusher (للـ Real-time)
1. اذهب إلى [Pusher](https://pusher.com/)
2. أنشئ حساب جديد
3. أنشئ تطبيق جديد
4. احصل على App ID, Key, Secret, Cluster
5. أضف هذه المعلومات إلى ملف `.env` في backend

#### AWS S3 (لرفع الملفات)
1. اذهب إلى [AWS Console](https://aws.amazon.com/)
2. أنشئ حساب جديد أو استخدم حساب موجود
3. أنشئ S3 bucket
4. أنشئ IAM user مع صلاحيات S3
5. احصل على Access Key ID و Secret Access Key
6. أضف هذه المعلومات إلى ملف `.env` في backend

### 4. إعداد قاعدة البيانات

1. تأكد من أن MySQL يعمل
2. أنشئ قاعدة بيانات جديدة باسم `eattoeat`
3. حدث إعدادات قاعدة البيانات في ملف `.env`

### 5. حسابات الاختبار

بعد تشغيل seeders، ستجد الحسابات التالية:

#### مدير النظام
- البريد الإلكتروني: admin@eattoeat.com
- كلمة المرور: password

#### صاحب مطعم
- البريد الإلكتروني: restaurant@eattoeat.com
- كلمة المرور: password

#### سائق توصيل
- البريد الإلكتروني: courier@eattoeat.com
- كلمة المرور: password

#### عميل
- البريد الإلكتروني: customer@eattoeat.com
- كلمة المرور: password

### 6. تشغيل التطبيق

1. تأكد من أن جميع الخدمات تعمل:
   - Laravel Backend على المنفذ 8000
   - React Frontend على المنفذ 3000
   - MySQL على المنفذ 3306

2. افتح المتصفح واذهب إلى `http://localhost:3000`

### 7. استكشاف الأخطاء

#### مشاكل شائعة:

1. **خطأ في مسارات الاستيراد**: تأكد من أن جميع مسارات الاستيراد صحيحة
2. **خطأ في قاعدة البيانات**: تأكد من أن MySQL يعمل وأن إعدادات قاعدة البيانات صحيحة
3. **خطأ في API**: تأكد من أن Laravel Backend يعمل على المنفذ 8000
4. **خطأ في Google Maps**: تأكد من أن API key صحيح ومفعل

#### ملفات السجلات:
- Laravel: `backend/storage/logs/laravel.log`
- React: تحقق من console المتصفح

### 8. النشر

لنشر التطبيق على خادم إنتاج:

1. استخدم Docker Compose:
```bash
docker-compose up -d
```

2. أو انشر يدوياً:
   - انشر Laravel Backend على خادم PHP
   - انشر React Frontend على خادم Nginx
   - أعد إعداد قاعدة البيانات
   - حدث ملفات البيئة

### 9. الدعم

إذا واجهت أي مشاكل، راجع:
- ملف `README.md`
- ملف `DEVELOPMENT.md`
- ملف `TROUBLESHOOTING.md`
- ملف `API_DOCUMENTATION.md`
