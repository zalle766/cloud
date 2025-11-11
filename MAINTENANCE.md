# Maintenance Guide

This guide covers maintenance tasks and procedures for Eat to Eat.

## 📅 Maintenance Schedule

### Daily Tasks
- [ ] Check application logs for errors
- [ ] Monitor server resources (CPU, memory, disk)
- [ ] Verify database backups
- [ ] Check security updates
- [ ] Monitor application performance

### Weekly Tasks
- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Check security scans
- [ ] Review user feedback
- [ ] Update documentation

### Monthly Tasks
- [ ] Security audit
- [ ] Performance optimization
- [ ] Backup verification
- [ ] Dependency updates
- [ ] Capacity planning

### Quarterly Tasks
- [ ] Infrastructure review
- [ ] Security penetration testing
- [ ] Disaster recovery testing
- [ ] Performance benchmarking
- [ ] Cost optimization

## 🔍 Monitoring & Alerting

### Application Monitoring

#### Health Checks
```bash
# Application health endpoint
curl -f http://localhost/api/health || exit 1

# Database connection check
php artisan tinker --execute="DB::connection()->getPdo();"

# Redis connection check
redis-cli ping
```

#### Log Monitoring
```bash
# Check application logs
tail -f storage/logs/laravel.log

# Check error logs
tail -f storage/logs/error.log

# Check access logs
tail -f /var/log/nginx/access.log
```

### Server Monitoring

#### Resource Monitoring
```bash
# Check disk space
df -h

# Check memory usage
free -h

# Check CPU usage
top

# Check network connections
netstat -tuln
```

#### Service Monitoring
```bash
# Check service status
systemctl status nginx
systemctl status php8.2-fpm
systemctl status mysql
systemctl status redis
```

### Performance Monitoring

#### Application Performance
```bash
# Check response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost/api/restaurants

# Check database performance
mysql -e "SHOW PROCESSLIST;"

# Check slow queries
tail -f /var/log/mysql/slow.log
```

#### Frontend Performance
```bash
# Check bundle size
npm run build -- --analyze

# Check performance metrics
lighthouse http://localhost:3000 --output html --output-path ./lighthouse-report.html
```

## 🔄 Backup & Recovery

### Database Backups

#### Automated Backup Script
```bash
#!/bin/bash
# backup-database.sh

BACKUP_DIR="/var/backups/eattoeat"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="eattoeat"
DB_USER="root"
DB_PASS="password"

# Create backup directory
mkdir -p $BACKUP_DIR

# Create database backup
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > $BACKUP_DIR/database_$DATE.sql

# Compress backup
gzip $BACKUP_DIR/database_$DATE.sql

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/database_$DATE.sql.gz s3://your-backup-bucket/database/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Database backup completed: $DATE"
```

#### Backup Verification
```bash
#!/bin/bash
# verify-backup.sh

BACKUP_FILE="/var/backups/eattoeat/database_$(date +%Y%m%d)_*.sql.gz"
TEST_DB="eattoeat_test"

# Create test database
mysql -e "CREATE DATABASE IF NOT EXISTS $TEST_DB;"

# Restore backup to test database
gunzip -c $BACKUP_FILE | mysql $TEST_DB

# Verify data integrity
mysql -e "USE $TEST_DB; SELECT COUNT(*) FROM users;"
mysql -e "USE $TEST_DB; SELECT COUNT(*) FROM restaurants;"
mysql -e "USE $TEST_DB; SELECT COUNT(*) FROM orders;"

# Drop test database
mysql -e "DROP DATABASE $TEST_DB;"

echo "Backup verification completed"
```

### File Backups

#### Application Files Backup
```bash
#!/bin/bash
# backup-files.sh

BACKUP_DIR="/var/backups/eattoeat"
DATE=$(date +%Y%m%d_%H%M%S)
APP_DIR="/var/www/eattoeat"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/files_$DATE.tar.gz $APP_DIR

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/files_$DATE.tar.gz s3://your-backup-bucket/files/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "File backup completed: $DATE"
```

#### Upload Directory Backup
```bash
#!/bin/bash
# backup-uploads.sh

BACKUP_DIR="/var/backups/eattoeat"
DATE=$(date +%Y%m%d_%H%M%S)
UPLOADS_DIR="/var/www/eattoeat/backend/storage/app/public"

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz $UPLOADS_DIR

# Upload to S3 (optional)
aws s3 cp $BACKUP_DIR/uploads_$DATE.tar.gz s3://your-backup-bucket/uploads/

# Clean old backups (keep 30 days)
find $BACKUP_DIR -name "uploads_*.tar.gz" -mtime +30 -delete

echo "Uploads backup completed: $DATE"
```

### Recovery Procedures

#### Database Recovery
```bash
#!/bin/bash
# restore-database.sh

BACKUP_FILE=$1
DB_NAME="eattoeat"
DB_USER="root"
DB_PASS="password"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Stop application
systemctl stop nginx
systemctl stop php8.2-fpm

# Create database backup before restore
mysqldump -u $DB_USER -p$DB_PASS $DB_NAME > /tmp/pre_restore_backup.sql

# Restore database
gunzip -c $BACKUP_FILE | mysql -u $DB_USER -p$DB_PASS $DB_NAME

# Start application
systemctl start php8.2-fpm
systemctl start nginx

echo "Database recovery completed"
```

#### File Recovery
```bash
#!/bin/bash
# restore-files.sh

BACKUP_FILE=$1
APP_DIR="/var/www/eattoeat"

if [ -z "$BACKUP_FILE" ]; then
    echo "Usage: $0 <backup_file>"
    exit 1
fi

# Stop application
systemctl stop nginx
systemctl stop php8.2-fpm

# Create current files backup
tar -czf /tmp/pre_restore_files.tar.gz $APP_DIR

# Restore files
tar -xzf $BACKUP_FILE -C /

# Fix permissions
chown -R www-data:www-data $APP_DIR
chmod -R 755 $APP_DIR/storage
chmod -R 755 $APP_DIR/bootstrap/cache

# Start application
systemctl start php8.2-fpm
systemctl start nginx

echo "File recovery completed"
```

## 🔧 System Maintenance

### Dependency Updates

#### Backend Dependencies
```bash
# Check for updates
composer outdated

# Update dependencies
composer update

# Update with security patches only
composer update --with-dependencies

# Check for security vulnerabilities
composer audit
```

#### Frontend Dependencies
```bash
# Check for updates
npm outdated

# Update dependencies
npm update

# Update with security patches
npm audit fix

# Check for security vulnerabilities
npm audit
```

#### System Packages
```bash
# Update system packages
sudo apt update
sudo apt upgrade

# Check for security updates
sudo apt list --upgradable

# Install security updates only
sudo apt upgrade -s | grep -i security
```

### Performance Optimization

#### Database Optimization
```sql
-- Analyze tables
ANALYZE TABLE users, restaurants, products, orders;

-- Optimize tables
OPTIMIZE TABLE users, restaurants, products, orders;

-- Check table sizes
SELECT 
    table_name,
    ROUND(((data_length + index_length) / 1024 / 1024), 2) AS 'Size (MB)'
FROM information_schema.tables
WHERE table_schema = 'eattoeat'
ORDER BY (data_length + index_length) DESC;
```

#### Application Optimization
```bash
# Clear application cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Rebuild cache
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Optimize autoloader
composer install --optimize-autoloader --no-dev
```

#### Frontend Optimization
```bash
# Build for production
npm run build

# Analyze bundle size
npm run build -- --analyze

# Check for unused dependencies
npx depcheck
```

### Security Maintenance

#### Security Updates
```bash
# Check for security updates
sudo apt list --upgradable | grep -i security

# Install security updates
sudo apt upgrade -s | grep -i security | xargs sudo apt install

# Check for known vulnerabilities
composer audit
npm audit
```

#### Security Scanning
```bash
# Run security scan
php artisan security:scan

# Check file permissions
find /var/www/eattoeat -type f -perm /o+w

# Check for suspicious files
find /var/www/eattoeat -name "*.php" -exec grep -l "eval\|base64_decode\|system\|exec" {} \;
```

#### Log Analysis
```bash
# Check for suspicious activity
grep -i "failed\|error\|warning" /var/log/nginx/access.log | tail -100

# Check for brute force attempts
grep -i "login" /var/log/nginx/access.log | awk '{print $1}' | sort | uniq -c | sort -nr

# Check for SQL injection attempts
grep -i "union\|select\|insert\|update\|delete" /var/log/nginx/access.log
```

## 📊 Performance Monitoring

### Application Metrics

#### Response Time Monitoring
```bash
# Check API response times
curl -w "@curl-format.txt" -o /dev/null -s http://localhost/api/restaurants

# Check database query times
mysql -e "SHOW PROCESSLIST;"

# Check slow queries
tail -f /var/log/mysql/slow.log
```

#### Memory Usage Monitoring
```bash
# Check PHP memory usage
ps aux | grep php-fpm

# Check MySQL memory usage
mysql -e "SHOW STATUS LIKE 'Innodb_buffer_pool%';"

# Check Redis memory usage
redis-cli info memory
```

### Server Metrics

#### Resource Usage
```bash
# Check CPU usage
top -bn1 | grep "Cpu(s)"

# Check memory usage
free -h

# Check disk usage
df -h

# Check network usage
iftop
```

#### Service Status
```bash
# Check service status
systemctl status nginx php8.2-fpm mysql redis

# Check service logs
journalctl -u nginx -f
journalctl -u php8.2-fpm -f
journalctl -u mysql -f
```

## 🔄 Disaster Recovery

### Disaster Recovery Plan

#### 1. Assessment
- Identify the scope of the disaster
- Determine the impact on services
- Assess data loss
- Estimate recovery time

#### 2. Communication
- Notify stakeholders
- Update status page
- Communicate with users
- Coordinate with team

#### 3. Recovery
- Restore from backups
- Verify data integrity
- Test functionality
- Monitor performance

#### 4. Post-Recovery
- Document lessons learned
- Update procedures
- Improve monitoring
- Test recovery procedures

### Recovery Procedures

#### Complete System Recovery
```bash
#!/bin/bash
# disaster-recovery.sh

echo "Starting disaster recovery..."

# 1. Stop all services
systemctl stop nginx
systemctl stop php8.2-fpm
systemctl stop mysql
systemctl stop redis

# 2. Restore database
gunzip -c /var/backups/eattoeat/database_latest.sql.gz | mysql -u root -p eattoeat

# 3. Restore files
tar -xzf /var/backups/eattoeat/files_latest.tar.gz -C /

# 4. Fix permissions
chown -R www-data:www-data /var/www/eattoeat
chmod -R 755 /var/www/eattoeat/storage
chmod -R 755 /var/www/eattoeat/bootstrap/cache

# 5. Start services
systemctl start mysql
systemctl start redis
systemctl start php8.2-fpm
systemctl start nginx

# 6. Verify recovery
curl -f http://localhost/api/health || exit 1

echo "Disaster recovery completed"
```

#### Partial Recovery
```bash
#!/bin/bash
# partial-recovery.sh

COMPONENT=$1

case $COMPONENT in
    "database")
        echo "Recovering database..."
        gunzip -c /var/backups/eattoeat/database_latest.sql.gz | mysql -u root -p eattoeat
        ;;
    "files")
        echo "Recovering files..."
        tar -xzf /var/backups/eattoeat/files_latest.tar.gz -C /
        ;;
    "uploads")
        echo "Recovering uploads..."
        tar -xzf /var/backups/eattoeat/uploads_latest.tar.gz -C /
        ;;
    *)
        echo "Usage: $0 {database|files|uploads}"
        exit 1
        ;;
esac

echo "Partial recovery completed"
```

## 📋 Maintenance Checklist

### Daily Checklist
- [ ] Check application logs
- [ ] Monitor server resources
- [ ] Verify backups
- [ ] Check security updates
- [ ] Monitor performance

### Weekly Checklist
- [ ] Review performance metrics
- [ ] Update dependencies
- [ ] Check security scans
- [ ] Review user feedback
- [ ] Update documentation

### Monthly Checklist
- [ ] Security audit
- [ ] Performance optimization
- [ ] Backup verification
- [ ] Dependency updates
- [ ] Capacity planning

### Quarterly Checklist
- [ ] Infrastructure review
- [ ] Security penetration testing
- [ ] Disaster recovery testing
- [ ] Performance benchmarking
- [ ] Cost optimization

## 🆘 Emergency Procedures

### Emergency Contacts
- **Technical Lead:** +20 123 456 7890
- **DevOps Team:** +20 123 456 7891
- **Security Team:** +20 123 456 7892
- **Management:** +20 123 456 7893

### Emergency Response
1. **Assess the situation**
2. **Notify the team**
3. **Implement fixes**
4. **Monitor results**
5. **Document incident**

### Emergency Scripts
```bash
#!/bin/bash
# emergency-restart.sh

echo "Emergency restart initiated..."

# Stop all services
systemctl stop nginx
systemctl stop php8.2-fpm
systemctl stop mysql
systemctl stop redis

# Wait 5 seconds
sleep 5

# Start services in order
systemctl start mysql
sleep 10
systemctl start redis
sleep 5
systemctl start php8.2-fpm
sleep 5
systemctl start nginx

# Verify services
systemctl status nginx php8.2-fpm mysql redis

echo "Emergency restart completed"
```

---

**Need help with maintenance?** Contact our DevOps team at devops@eattoeat.com

**Last Updated:** 2024-01-01
