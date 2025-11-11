# Deployment Guide

This guide covers deploying Eat to Eat to production environments.

## 🚀 Deployment Options

### 1. Docker Deployment (Recommended)
- **Pros:** Consistent environment, easy scaling, isolated services
- **Cons:** Requires Docker knowledge, resource overhead
- **Best for:** Production environments, team deployments

### 2. Traditional Server Deployment
- **Pros:** Full control, no container overhead
- **Cons:** Environment differences, manual configuration
- **Best for:** Simple deployments, legacy systems

### 3. Cloud Platform Deployment
- **Pros:** Managed services, auto-scaling, high availability
- **Cons:** Vendor lock-in, higher costs
- **Best for:** High-traffic applications, global reach

## 🐳 Docker Deployment

### Prerequisites
- Docker 20.10+
- Docker Compose 2.0+
- 4GB+ RAM
- 20GB+ disk space

### Quick Start
```bash
# Clone repository
git clone https://github.com/your-repo/eattoeat.git
cd eattoeat

# Start services
docker-compose up -d

# Check status
docker-compose ps
```

### Production Configuration

#### Environment Variables
```env
# Backend (.env)
APP_ENV=production
APP_DEBUG=false
APP_URL=https://yourdomain.com

DB_CONNECTION=mysql
DB_HOST=mysql
DB_DATABASE=eattoeat
DB_USERNAME=eattoeat
DB_PASSWORD=secure_password

REDIS_HOST=redis
REDIS_PORT=6379

PUSHER_APP_ID=your_pusher_app_id
PUSHER_APP_KEY=your_pusher_app_key
PUSHER_APP_SECRET=your_pusher_app_secret
PUSHER_APP_CLUSTER=your_pusher_cluster

AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_DEFAULT_REGION=your_aws_region
AWS_BUCKET=your_s3_bucket

GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```

#### Frontend Environment
```env
# Frontend (.env)
VITE_API_URL=https://yourdomain.com/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_PUSHER_APP_KEY=your_pusher_app_key
VITE_PUSHER_CLUSTER=your_pusher_cluster
VITE_PUSHER_HOST=yourdomain.com
VITE_PUSHER_PORT=443
VITE_PUSHER_SCHEME=https
```

### Docker Compose Production
```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: eattoeat_mysql
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: eattoeat
      MYSQL_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
      MYSQL_USER: eattoeat
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
    networks:
      - eattoeat_network

  redis:
    image: redis:7-alpine
    container_name: eattoeat_redis
    restart: unless-stopped
    volumes:
      - redis_data:/data
    networks:
      - eattoeat_network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: eattoeat_backend
    restart: unless-stopped
    environment:
      - APP_ENV=production
      - APP_DEBUG=false
    depends_on:
      - mysql
      - redis
    volumes:
      - ./backend:/var/www
      - backend_storage:/var/www/storage
    networks:
      - eattoeat_network

  nginx:
    image: nginx:alpine
    container_name: eattoeat_nginx
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./backend:/var/www
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/ssl:/etc/nginx/ssl
    depends_on:
      - backend
    networks:
      - eattoeat_network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: eattoeat_frontend
    restart: unless-stopped
    ports:
      - "3000:80"
    networks:
      - eattoeat_network

volumes:
  mysql_data:
  redis_data:
  backend_storage:

networks:
  eattoeat_network:
    driver: bridge
```

### SSL Configuration

#### Let's Encrypt SSL
```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d yourdomain.com

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

#### Nginx SSL Configuration
```nginx
server {
    listen 443 ssl http2;
    server_name yourdomain.com;

    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    ssl_prefer_server_ciphers off;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass backend:9000;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## 🖥️ Traditional Server Deployment

### Prerequisites
- Ubuntu 20.04+ or CentOS 8+
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- Nginx or Apache
- Redis (optional)

### Server Setup

#### Install Dependencies
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install PHP
sudo apt install php8.2-fpm php8.2-mysql php8.2-xml php8.2-mbstring php8.2-curl php8.2-zip php8.2-bcmath

# Install Composer
curl -sS https://getcomposer.org/installer | php
sudo mv composer.phar /usr/local/bin/composer

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs

# Install MySQL
sudo apt install mysql-server
sudo mysql_secure_installation

# Install Nginx
sudo apt install nginx
```

#### Application Deployment
```bash
# Clone repository
git clone https://github.com/your-repo/eattoeat.git
cd eattoeat

# Backend setup
cd backend
composer install --optimize-autoloader --no-dev
cp .env.example .env
php artisan key:generate
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend setup
cd ../frontend
npm install
npm run build
```

#### Nginx Configuration
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/eattoeat/backend/public;
    index index.php;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location /api {
        try_files $uri $uri/ /index.php?$query_string;
    }
}

server {
    listen 80;
    server_name app.yourdomain.com;
    root /var/www/eattoeat/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## ☁️ Cloud Platform Deployment

### AWS Deployment

#### EC2 Instance
```bash
# Launch EC2 instance
# Instance type: t3.medium or larger
# AMI: Ubuntu 20.04 LTS
# Security groups: HTTP, HTTPS, SSH, MySQL

# Connect to instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Follow traditional server setup
```

#### RDS Database
```bash
# Create RDS MySQL instance
# Engine: MySQL 8.0
# Instance class: db.t3.micro or larger
# Storage: 20GB or larger
# Security group: Allow MySQL access
```

#### S3 Storage
```bash
# Create S3 bucket
# Bucket name: your-app-name-storage
# Region: Same as EC2 instance
# Permissions: Private with proper IAM roles
```

#### CloudFront CDN
```bash
# Create CloudFront distribution
# Origin: S3 bucket
# Caching: Optimize for web delivery
# SSL: Use AWS Certificate Manager
```

### DigitalOcean Deployment

#### Droplet Setup
```bash
# Create droplet
# Image: Ubuntu 20.04
# Size: 2GB RAM or larger
# Region: Choose closest to users
# Add SSH key

# Connect to droplet
ssh root@your-droplet-ip

# Follow traditional server setup
```

#### Managed Database
```bash
# Create managed MySQL database
# Plan: Basic or larger
# Region: Same as droplet
# Configure connection string
```

#### Spaces Storage
```bash
# Create Spaces bucket
# Region: Same as droplet
# CDN: Enable for better performance
# Access keys: Generate for application
```

### Heroku Deployment

#### Backend Deployment
```bash
# Install Heroku CLI
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add add-ons
heroku addons:create heroku-postgresql:hobby-dev
heroku addons:create heroku-redis:hobby-dev

# Deploy
git push heroku main
```

#### Frontend Deployment
```bash
# Build frontend
npm run build

# Deploy to Netlify or Vercel
# Connect GitHub repository
# Set build command: npm run build
# Set publish directory: dist
```

## 🔧 Production Configuration

### Performance Optimization

#### Laravel Optimization
```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

#### Frontend Optimization
```bash
# Build for production
npm run build

# Enable gzip compression
# Add to Nginx configuration
gzip on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
```

#### Database Optimization
```sql
-- Add indexes for better performance
ALTER TABLE orders ADD INDEX idx_status (status);
ALTER TABLE orders ADD INDEX idx_created_at (created_at);
ALTER TABLE users ADD INDEX idx_email (email);
```

### Security Configuration

#### Laravel Security
```bash
# Set secure session configuration
SESSION_SECURE_COOKIE=true
SESSION_HTTP_ONLY=true
SESSION_SAME_SITE=strict

# Enable HTTPS
FORCE_HTTPS=true

# Set secure headers
SECURE_HEADERS=true
```

#### Nginx Security
```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

# Hide Nginx version
server_tokens off;
```

### Monitoring & Logging

#### Application Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop nethogs

# Set up log rotation
sudo nano /etc/logrotate.d/eattoeat
```

#### Log Configuration
```bash
# Laravel logging
LOG_CHANNEL=daily
LOG_LEVEL=error

# Nginx logging
access_log /var/log/nginx/eattoeat.access.log;
error_log /var/log/nginx/eattoeat.error.log;
```

## 🚀 Deployment Scripts

### Automated Deployment
```bash
#!/bin/bash
# deploy.sh

set -e

echo "Starting deployment..."

# Pull latest code
git pull origin main

# Backend deployment
cd backend
composer install --optimize-autoloader --no-dev
php artisan migrate --force
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend deployment
cd ../frontend
npm install
npm run build

# Restart services
sudo systemctl reload nginx
sudo systemctl reload php8.2-fpm

echo "Deployment completed successfully!"
```

### Backup Script
```bash
#!/bin/bash
# backup.sh

set -e

BACKUP_DIR="/var/backups/eattoeat"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Database backup
mysqldump -u root -p eattoeat > $BACKUP_DIR/database_$DATE.sql

# File backup
tar -czf $BACKUP_DIR/files_$DATE.tar.gz /var/www/eattoeat

# Clean old backups (keep 7 days)
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "Backup completed: $DATE"
```

## 🔄 CI/CD Pipeline

### GitHub Actions
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to server
      uses: appleboy/ssh-action@v0.1.5
      with:
        host: ${{ secrets.HOST }}
        username: ${{ secrets.USERNAME }}
        key: ${{ secrets.SSH_KEY }}
        script: |
          cd /var/www/eattoeat
          git pull origin main
          cd backend && composer install --optimize-autoloader --no-dev
          php artisan migrate --force
          php artisan config:cache
          cd ../frontend && npm install && npm run build
          sudo systemctl reload nginx
```

## 📊 Health Checks

### Application Health
```bash
# Check application status
curl -f http://localhost/api/health || exit 1

# Check database connection
php artisan tinker --execute="DB::connection()->getPdo();"

# Check Redis connection
redis-cli ping
```

### Server Health
```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check service status
systemctl status nginx
systemctl status php8.2-fpm
systemctl status mysql
```

## 🆘 Troubleshooting

### Common Issues

#### Application Not Loading
```bash
# Check Nginx configuration
sudo nginx -t

# Check PHP-FPM status
sudo systemctl status php8.2-fpm

# Check application logs
tail -f storage/logs/laravel.log
```

#### Database Connection Issues
```bash
# Check MySQL status
sudo systemctl status mysql

# Test database connection
mysql -u root -p -e "SHOW DATABASES;"

# Check Laravel database config
php artisan tinker --execute="config('database.connections.mysql');"
```

#### Performance Issues
```bash
# Check server resources
htop

# Check Nginx access logs
tail -f /var/log/nginx/access.log

# Check slow query log
tail -f /var/log/mysql/slow.log
```

---

**Need help with deployment?** Contact our DevOps team at devops@eattoeat.com

**Last Updated:** 2024-01-01
