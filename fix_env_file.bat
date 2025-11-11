@echo off
echo ========================================
echo إصلاح ملف .env للاتصال مع MySQL
echo ========================================

echo إنشاء ملف .env صحيح لـ Laravel...

(
echo APP_NAME="Eat to Eat"
echo APP_ENV=local
echo APP_KEY=
echo APP_DEBUG=true
echo APP_TIMEZONE=UTC
echo APP_URL=http://localhost:8000
echo.
echo APP_LOCALE=ar
echo APP_FALLBACK_LOCALE=en
echo APP_FAKER_LOCALE=ar_SA
echo.
echo APP_MAINTENANCE_DRIVER=file
echo APP_MAINTENANCE_STORE=database
echo.
echo BCRYPT_ROUNDS=12
echo.
echo LOG_CHANNEL=stack
echo LOG_STACK=single
echo LOG_DEPRECATIONS_CHANNEL=null
echo LOG_LEVEL=debug
echo.
echo DB_CONNECTION=mysql
echo DB_HOST=127.0.0.1
echo DB_PORT=3306
echo DB_DATABASE=eat_to_eat
echo DB_USERNAME=root
echo DB_PASSWORD=
echo.
echo SESSION_DRIVER=database
echo SESSION_LIFETIME=120
echo SESSION_ENCRYPT=false
echo SESSION_PATH=/
echo SESSION_DOMAIN=null
echo.
echo BROADCAST_CONNECTION=log
echo FILESYSTEM_DISK=local
echo QUEUE_CONNECTION=database
echo.
echo CACHE_STORE=database
echo CACHE_PREFIX=
echo.
echo MEMCACHED_HOST=127.0.0.1
echo.
echo REDIS_CLIENT=phpredis
echo REDIS_HOST=127.0.0.1
echo REDIS_PASSWORD=null
echo REDIS_PORT=6379
echo.
echo MAIL_MAILER=log
echo MAIL_HOST=127.0.0.1
echo MAIL_PORT=2525
echo MAIL_USERNAME=null
echo MAIL_PASSWORD=null
echo MAIL_ENCRYPTION=null
echo MAIL_FROM_ADDRESS="hello@example.com"
echo MAIL_FROM_NAME="${APP_NAME}"
echo.
echo AWS_ACCESS_KEY_ID=
echo AWS_SECRET_ACCESS_KEY=
echo AWS_DEFAULT_REGION=us-east-1
echo AWS_BUCKET=
echo AWS_USE_PATH_STYLE_ENDPOINT=false
echo.
echo VITE_APP_NAME="${APP_NAME}"
echo.
echo # Sanctum Configuration
echo SANCTUM_STATEFUL_DOMAINS=localhost,localhost:3000,127.0.0.1,127.0.0.1:8000,::1
) > backend\.env

echo تم إنشاء ملف .env بنجاح!
echo.
echo الآن يمكنك تشغيل:
echo 1. php artisan key:generate
echo 2. php artisan migrate
echo 3. php artisan serve
echo.
pause
