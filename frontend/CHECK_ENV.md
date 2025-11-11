# ⚠️ تحقق من ملف .env
# Check .env File

## المشكلة:
## Problem:

رسالة الخطأ: "Supabase غير مهيأ. يرجى التحقق من ملف env."

هذا يعني أن ملف `.env` غير موجود أو المفاتيح غير صحيحة.

---

## ✅ الحل:
## Solution:

### الخطوة 1: تأكد من وجود ملف `.env`
### Step 1: Make sure `.env` file exists

1. اذهب إلى مجلد `frontend`
2. تحقق من وجود ملف `.env` (بدون امتداد)

### الخطوة 2: إذا لم يكن موجوداً، أنشئه:
### Step 2: If not exists, create it:

1. افتح ملف `env_content.txt` في مجلد `frontend`
2. انسخ كل المحتوى
3. أنشئ ملف جديد باسم `.env` (بدون `.txt`)
4. الصق المحتوى واحفظه

### الخطوة 3: تأكد من المفاتيح الصحيحة:
### Step 3: Make sure keys are correct:

يجب أن يحتوي الملف على:

```env
VITE_SUPABASE_URL=https://rzwprzrwhcaaqcbponiw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d3ByenJ3aGNhYXFjYnBvbml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjEyNjQsImV4cCI6MjA3ODA5NzI2NH0.GtcTByA3v7DTcbtIcUzOLJPSwFnlb2loq4Rr6XvSmfc
```

### الخطوة 4: أعد تشغيل الخادم
### Step 4: Restart Server

**مهم جداً:** بعد إنشاء/تعديل ملف `.env`، يجب إعادة تشغيل الخادم!

1. اضغط `Ctrl+C` في Terminal لإيقاف الخادم
2. ثم:
   ```bash
   npm run dev
   ```

---

## 🔍 التحقق:
## Verify:

بعد إعادة التشغيل:
1. افتح: [http://localhost:3000/test](http://localhost:3000/test)
2. يجب أن ترى "✅ Supabase URL موجود" و "✅ Supabase Key موجود"

---

## 📝 ملاحظات:
## Notes:

- ⚠️ ملف `.env` يجب أن يكون في مجلد `frontend` وليس في الجذر
- ⚠️ `.env` file must be in `frontend` folder, not in root

- ⚠️ لا تضع مسافات حول `=` في ملف `.env`
- ⚠️ Don't put spaces around `=` in `.env` file

- ✅ بعد تعديل `.env`، **يجب** إعادة تشغيل الخادم
- ✅ After editing `.env`, **must** restart server

---

**جرب الآن!**

