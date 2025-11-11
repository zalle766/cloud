# كيفية التحقق من ملف .env
# How to Verify .env File

## 🔍 خطوات التحقق:
## Verification Steps:

### 1. تأكد من وجود الملف:
### 1. Check File Exists:

- اذهب إلى: `C:\xampp\htdocs\eattoeat\frontend`
- ابحث عن ملف `.env` (قد لا يظهر إذا كانت إعدادات Windows مخفية للملفات)
- Go to: `C:\xampp\htdocs\eattoeat\frontend`
- Look for `.env` file (may not show if Windows hides system files)

### 2. إذا لم تجد الملف:
### 2. If File Not Found:

في File Explorer:
1. اضغط `Alt` لظهور القائمة
2. اختر **View** → **Show** → **Hidden items**
3. أو اضغط `Ctrl+Shift+.` لإظهار الملفات المخفية

### 3. افتح الملف وتحقق من المحتوى:
### 3. Open File and Check Content:

يجب أن يحتوي على (بالضبط):

```
VITE_SUPABASE_URL=https://rzwprzrwhcaaqcbponiw.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ6d3ByenJ3aGNhYXFjYnBvbml3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MjEyNjQsImV4cCI6MjA3ODA5NzI2NH0.GtcTByA3v7DTcbtIcUzOLJPSwFnlb2loq4Rr6XvSmfc
```

### 4. تحقق من Console:
### 4. Check Console:

1. افتح المتصفح (F12)
2. اذهب إلى Console
3. ابحث عن:
   - إذا رأيت: `⚠️ Missing Supabase environment variables` = الملف غير موجود أو المفاتيح خاطئة
   - إذا لم تر أي تحذير = الملف موجود وصحيح ✅

---

## 🚀 بعد التحقق:
## After Verification:

إذا كان الملف موجود وصحيح:
1. **أوقف الخادم** (Ctrl+C)
2. **أعد تشغيله:** `npm run dev`
3. **افتح:** [http://localhost:3000/test](http://localhost:3000/test)

---

**إذا استمرت المشكلة، أخبرني بما تراه في Console!**

