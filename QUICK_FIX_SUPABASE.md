# إصلاح سريع - خطأ Supabase
# Quick Fix - Supabase Error

## 🔴 المشكلة:
## Problem:

```
Failed to resolve import "@supabase/supabase-js"
```

## ✅ الحل (3 خطوات):
## Solution (3 Steps):

### الخطوة 1: افتح Terminal في مجلد `frontend`
### Step 1: Open Terminal in `frontend` folder

### الخطوة 2: ثبت الحزمة
### Step 2: Install Package

```bash
npm install @supabase/supabase-js
```

### الخطوة 3: أعد تشغيل الخادم
### Step 3: Restart Server

اضغط `Ctrl+C` لإيقاف الخادم، ثم:

```bash
npm run dev
```

---

## 🚀 طريقة أسهل:
## Easier Way:

### في Windows:
1. اذهب إلى مجلد `frontend`
2. انقر نقراً مزدوجاً على `install_supabase.bat`
3. انتظر حتى يكتمل التثبيت
4. أعد تشغيل `npm run dev`

---

## ✅ بعد ذلك:
## After That:

- ✅ الخطأ سيختفي
- ✅ Error will disappear
- ✅ صفحة التسجيل ستعمل
- ✅ Registration page will work

---

**ملاحظة:** إذا استمر الخطأ، تأكد من:
- أنك في المجلد الصحيح (`frontend`)
- أن `node_modules` موجود
- أعد تشغيل Terminal والخادم

