# قائمة التحقق من الانتقال - Migration Checklist
# Laravel/MySQL to React/Supabase Migration Checklist

## ✅ المرحلة 1: إعداد Supabase
## Phase 1: Supabase Setup

- [ ] إنشاء مشروع جديد في Supabase
- [ ] Create new project in Supabase
- [ ] نسخ `VITE_SUPABASE_URL` و `VITE_SUPABASE_ANON_KEY`
- [ ] Copy `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- [ ] إنشاء ملف `.env` في `frontend/` وإضافة المتغيرات
- [ ] Create `.env` file in `frontend/` and add variables
- [ ] تفعيل Email Auth في Supabase Dashboard > Authentication > Providers
- [ ] Enable Email Auth in Supabase Dashboard > Authentication > Providers

---

## ✅ المرحلة 2: قاعدة البيانات
## Phase 2: Database

- [ ] فتح Supabase SQL Editor
- [ ] Open Supabase SQL Editor
- [ ] تشغيل ملف `database/supabase_schema.sql` لإنشاء الجداول
- [ ] Run `database/supabase_schema.sql` to create tables
- [ ] التحقق من إنشاء جميع الجداول بنجاح
- [ ] Verify all tables created successfully
- [ ] تفعيل Row Level Security (RLS) على جميع الجداول
- [ ] Enable Row Level Security (RLS) on all tables
- [ ] مراجعة سياسات RLS والتأكد من أنها مناسبة
- [ ] Review RLS policies and ensure they're appropriate

---

## ✅ المرحلة 3: التخزين (Storage)
## Phase 3: Storage

- [ ] إنشاء Storage Bucket باسم `avatars` للصور الشخصية
- [ ] Create Storage Bucket named `avatars` for profile pictures
- [ ] إنشاء Storage Bucket باسم `images` لصور المطاعم والمنتجات
- [ ] Create Storage Bucket named `images` for restaurant/product images
- [ ] تعيين سياسات الوصول للـ buckets (public read, authenticated write)
- [ ] Set access policies for buckets (public read, authenticated write)
- [ ] رفع الصور الموجودة إلى Supabase Storage (اختياري)
- [ ] Upload existing images to Supabase Storage (optional)

---

## ✅ المرحلة 4: نقل البيانات
## Phase 4: Data Migration

- [ ] عمل نسخة احتياطية كاملة من قاعدة بيانات MySQL
- [ ] Make full backup of MySQL database
- [ ] تصدير البيانات من MySQL إلى CSV (انظر `scripts/migrate_mysql_to_postgres.md`)
- [ ] Export data from MySQL to CSV (see `scripts/migrate_mysql_to_postgres.md`)
- [ ] تحويل أنواع البيانات من MySQL إلى Postgres
- [ ] Convert data types from MySQL to Postgres
- [ ] استيراد البيانات إلى Supabase (CSV أو SQL)
- [ ] Import data to Supabase (CSV or SQL)
- [ ] التحقق من عدد السجلات في كل جدول
- [ ] Verify record counts in each table
- [ ] التحقق من العلاقات بين الجداول (Foreign Keys)
- [ ] Verify relationships between tables (Foreign Keys)

---

## ✅ المرحلة 5: كلمات المرور
## Phase 5: Passwords

اختر أحد الخيارات:
Choose one option:

### الخيار أ: إعادة تعيين كلمات المرور (موصى به)
### Option A: Password Reset (Recommended)

- [ ] إعداد Supabase Auth Email Templates
- [ ] Set up Supabase Auth Email Templates
- [ ] إرسال بريد إلكتروني لجميع المستخدمين (انظر `templates/password_reset_email_ar.txt`)
- [ ] Send email to all users (see `templates/password_reset_email_ar.txt`)
- [ ] توفير رابط إعادة تعيين كلمة المرور
- [ ] Provide password reset link

### الخيار ب: نقل كلمات المرور (معقد)
### Option B: Migrate Passwords (Complex)

- [ ] تصدير كلمات المرور المشفرة من MySQL
- [ ] Export encrypted passwords from MySQL
- [ ] إنشاء دالة مخصصة في Supabase لتحويل bcrypt إلى scrypt
- [ ] Create custom Supabase function to convert bcrypt to scrypt
- [ ] اختبار التحويل على بيانات تجريبية
- [ ] Test conversion on sample data

---

## ✅ المرحلة 6: تثبيت التبعيات
## Phase 6: Install Dependencies

- [ ] الانتقال إلى مجلد `frontend/`
- [ ] Navigate to `frontend/` directory
- [ ] تثبيت Supabase client: `npm install @supabase/supabase-js`
- [ ] Install Supabase client: `npm install @supabase/supabase-js`
- [ ] التحقق من تثبيت جميع التبعيات: `npm install`
- [ ] Verify all dependencies installed: `npm install`
- [ ] التحقق من عدم وجود أخطاء
- [ ] Check for any errors

---

## ✅ المرحلة 7: اختبار المكونات
## Phase 7: Test Components

- [ ] اختبار مكون `Auth` (تسجيل الدخول والتسجيل)
- [ ] Test `Auth` component (login and signup)
- [ ] اختبار مكون `MenuList` (جلب القائمة)
- [ ] Test `MenuList` component (fetch menu)
- [ ] اختبار مكون `Cart` (إضافة/إزالة عناصر)
- [ ] Test `Cart` component (add/remove items)
- [ ] اختبار مكون `Checkout` (إنشاء طلب)
- [ ] Test `Checkout` component (create order)
- [ ] اختبار مكون `Profile` (رفع صورة وتحديث البيانات)
- [ ] Test `Profile` component (upload image and update data)

---

## ✅ المرحلة 8: اختبار الوقت الفعلي
## Phase 8: Test Realtime

- [ ] اختبار `useRealtimeOrders` hook
- [ ] Test `useRealtimeOrders` hook
- [ ] إنشاء طلب جديد والتحقق من ظهوره في الوقت الفعلي
- [ ] Create new order and verify it appears in real-time
- [ ] تحديث حالة الطلب والتحقق من التحديث الفوري
- [ ] Update order status and verify instant update

---

## ✅ المرحلة 9: الأمان
## Phase 9: Security

- [ ] مراجعة جميع سياسات RLS
- [ ] Review all RLS policies
- [ ] التأكد من أن المستخدمين يمكنهم فقط رؤية/تعديل بياناتهم
- [ ] Ensure users can only see/edit their own data
- [ ] التأكد من أن أصحاب المطاعم يمكنهم فقط إدارة مطاعمهم
- [ ] Ensure restaurant owners can only manage their restaurants
- [ ] اختبار الوصول غير المصرح به (يجب أن يفشل)
- [ ] Test unauthorized access (should fail)
- [ ] التأكد من عدم وجود `service_role` key في كود المتصفح
- [ ] Ensure no `service_role` key in browser code

---

## ✅ المرحلة 10: النشر
## Phase 10: Deployment

- [ ] بناء المشروع: `npm run build`
- [ ] Build project: `npm run build`
- [ ] اختبار البناء محلياً: `npm run preview`
- [ ] Test build locally: `npm run preview`
- [ ] نشر على Vercel/Netlify
- [ ] Deploy to Vercel/Netlify
- [ ] إضافة متغيرات البيئة في منصة النشر
- [ ] Add environment variables in deployment platform
- [ ] اختبار الموقع المنشور
- [ ] Test deployed site

---

## ✅ المرحلة 11: التنظيف
## Phase 11: Cleanup

- [ ] إزالة ملفات Laravel القديمة (إذا لم تعد مطلوبة)
- [ ] Remove old Laravel files (if no longer needed)
- [ ] إزالة اتصالات MySQL القديمة
- [ ] Remove old MySQL connections
- [ ] تحديث الوثائق
- [ ] Update documentation
- [ ] إعلام المستخدمين بالتحديثات
- [ ] Notify users of updates

---

## 📝 ملاحظات إضافية
## Additional Notes

### أفضل الممارسات
### Best Practices

1. **استخدم Environment Variables:** لا تكتب القيم الحساسة مباشرة في الكود
2. **Use Environment Variables:** Don't hardcode sensitive values

3. **اختبر على بيانات تجريبية أولاً:** لا تنتقل مباشرة على البيانات الحية
4. **Test on Sample Data First:** Don't migrate directly on live data

5. **احفظ نسخ احتياطية:** احفظ نسخة من كل شيء قبل البدء
6. **Keep Backups:** Save a copy of everything before starting

7. **راقب الأخطاء:** استخدم Supabase Dashboard لمراقبة الأخطاء
8. **Monitor Errors:** Use Supabase Dashboard to monitor errors

9. **استخدم Indexes:** تأكد من وجود فهارس على الأعمدة المستخدمة في الاستعلامات
10. **Use Indexes:** Ensure indexes on columns used in queries

### موارد مفيدة
### Useful Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Storage Guide](https://supabase.com/docs/guides/storage)

---

## 🆘 الدعم
## Support

إذا واجهت أي مشاكل أثناء الانتقال:
If you encounter any issues during migration:

1. راجع ملف `scripts/migrate_mysql_to_postgres.md`
2. Review `scripts/migrate_mysql_to_postgres.md` file
3. راجع وثائق Supabase
4. Review Supabase documentation
5. تحقق من سجلات الأخطاء في Supabase Dashboard
6. Check error logs in Supabase Dashboard

---

**تاريخ الإنشاء / Created:** [تاريخ اليوم]
**آخر تحديث / Last Updated:** [تاريخ اليوم]

