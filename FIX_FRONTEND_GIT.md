# إصلاح مشكلة frontend في Git

## المشكلة
Git يعرض: `modified:   frontend (modified content, untracked content)`

هذا يعني أن `frontend` موجود في Git لكن المحتوى غير متتبع.

## الحل السريع

قم بتنفيذ هذه الأوامر في Terminal (Git Bash):

```bash
# إزالة frontend من Git index (إن كان موجوداً كـ submodule)
git rm --cached frontend

# إضافة ملفات frontend بشكل صريح
git add -f frontend/package.json
git add -f frontend/package-lock.json
git add -f frontend/vite.config.js
git add -f frontend/tailwind.config.js
git add -f frontend/postcss.config.js
git add -f frontend/index.html
git add -f frontend/.gitignore
git add -f frontend/src/
git add -f frontend/public/
git add -f frontend/Dockerfile
git add -f frontend/nginx.conf
git add -f frontend/README.md

# عمل commit
git commit -m "Add frontend directory"

# رفع إلى GitHub
git push
```

## أو استخدم السكريبت

```bash
fix_frontend_git.bat
```

ثم:
```bash
git commit -m "Add frontend directory"
git push
```

## ملاحظة مهمة

`.gitignore` سيستبعد تلقائياً:
- ✅ `frontend/dist/` - ملفات البناء
- ✅ `frontend/node_modules/` - الحزم المثبتة
- ✅ `frontend/build/` - ملفات البناء البديلة

بينما سيتم رفع:
- ✅ `frontend/src/` - الكود المصدري
- ✅ `frontend/public/` - الملفات الثابتة
- ✅ جميع ملفات الإعداد

