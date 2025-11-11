# Troubleshooting Guide

## 🚨 Common Issues & Solutions

This guide helps you resolve common issues with Eat to Eat. If you can't find a solution here, please contact our support team.

## 🔧 Installation Issues

### Backend Installation Problems

#### Composer Issues
```bash
# Problem: Composer install fails
# Solution: Clear cache and reinstall
composer clear-cache
composer install --no-cache

# Problem: Memory limit exceeded
# Solution: Increase memory limit
php -d memory_limit=2G composer install
```

#### Permission Issues
```bash
# Problem: Permission denied errors
# Solution: Fix storage permissions
chmod -R 755 storage
chmod -R 755 bootstrap/cache

# Problem: File upload issues
# Solution: Fix upload directory permissions
chmod -R 755 storage/app/public
```

#### Database Connection Issues
```bash
# Problem: Database connection failed
# Solution: Check database configuration
# 1. Verify database is running
# 2. Check credentials in .env file
# 3. Test connection
php artisan tinker
DB::connection()->getPdo();
```

### Frontend Installation Problems

#### NPM Issues
```bash
# Problem: NPM install fails
# Solution: Clear cache and reinstall
npm cache clean --force
npm install

# Problem: Permission errors
# Solution: Fix npm permissions
sudo chown -R $(whoami) ~/.npm
```

#### Build Issues
```bash
# Problem: Build fails
# Solution: Check for errors and rebuild
npm run build

# Problem: Vite issues
# Solution: Clear Vite cache
rm -rf node_modules/.vite
npm install
```

## 🌐 Configuration Issues

### Environment Variables

#### Missing Environment Variables
```bash
# Problem: Application not working
# Solution: Check .env file exists and is configured
cp .env.example .env
php artisan key:generate
```

#### Database Configuration
```env
# Problem: Database connection errors
# Solution: Verify database settings
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eattoeat
DB_USERNAME=root
DB_PASSWORD=
```

#### API Configuration
```env
# Problem: API not working
# Solution: Check API settings
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=your_key_here
VITE_PUSHER_APP_KEY=your_key_here
```

### Service Configuration

#### Google Maps API
```bash
# Problem: Maps not loading
# Solution: Check API key and billing
# 1. Verify API key is correct
# 2. Check API is enabled
# 3. Verify billing is set up
# 4. Check domain restrictions
```

#### Pusher Configuration
```bash
# Problem: Real-time features not working
# Solution: Check Pusher settings
# 1. Verify app credentials
# 2. Check cluster setting
# 3. Test connection
# 4. Check firewall settings
```

## 🔐 Authentication Issues

### Login Problems

#### Invalid Credentials
```bash
# Problem: Login fails with correct credentials
# Solution: Check user account status
# 1. Verify account exists
# 2. Check account is active
# 3. Verify password is correct
# 4. Check for account locks
```

#### Token Issues
```bash
# Problem: API requests fail with 401
# Solution: Check authentication token
# 1. Verify token is included in headers
# 2. Check token expiration
# 3. Refresh token if needed
# 4. Check token format
```

### Registration Issues

#### Email Verification
```bash
# Problem: Email verification not working
# Solution: Check email configuration
# 1. Verify SMTP settings
# 2. Check email templates
# 3. Test email sending
# 4. Check spam folder
```

#### Role Assignment
```bash
# Problem: User role not assigned
# Solution: Check role assignment
# 1. Verify role exists
# 2. Check role assignment logic
# 3. Verify user permissions
# 4. Check middleware configuration
```

## 📱 Frontend Issues

### React Application Problems

#### Component Not Rendering
```bash
# Problem: Component not showing
# Solution: Check component code
# 1. Verify import statements
# 2. Check component export
# 3. Verify props passing
# 4. Check console for errors
```

#### State Management Issues
```bash
# Problem: State not updating
# Solution: Check state management
# 1. Verify state updates
# 2. Check context providers
# 3. Verify hook usage
# 4. Check for state mutations
```

### API Integration Issues

#### CORS Errors
```bash
# Problem: CORS errors in browser
# Solution: Check CORS configuration
# 1. Verify CORS middleware
# 2. Check allowed origins
# 3. Verify headers
# 4. Test with different browsers
```

#### API Endpoint Issues
```bash
# Problem: API calls failing
# Solution: Check API configuration
# 1. Verify endpoint URLs
# 2. Check request format
# 3. Verify authentication
# 4. Check server logs
```

## 🗄️ Database Issues

### Migration Problems

#### Migration Failures
```bash
# Problem: Migrations not running
# Solution: Check migration status
php artisan migrate:status
php artisan migrate:rollback
php artisan migrate

# Problem: Migration conflicts
# Solution: Resolve conflicts
php artisan migrate:fresh
php artisan db:seed
```

#### Data Issues
```bash
# Problem: Data not saving
# Solution: Check database constraints
# 1. Verify table structure
# 2. Check foreign key constraints
# 3. Verify data types
# 4. Check validation rules
```

### Performance Issues

#### Slow Queries
```bash
# Problem: Slow database queries
# Solution: Optimize queries
# 1. Add database indexes
# 2. Optimize query structure
# 3. Use eager loading
# 4. Check query execution plans
```

#### Connection Issues
```bash
# Problem: Database connection timeouts
# Solution: Check connection settings
# 1. Increase timeout values
# 2. Check connection pool
# 3. Verify database server
# 4. Check network connectivity
```

## 🚀 Performance Issues

### Application Performance

#### Slow Loading
```bash
# Problem: Application loads slowly
# Solution: Optimize performance
# 1. Enable caching
# 2. Optimize images
# 3. Minify assets
# 4. Use CDN
```

#### Memory Issues
```bash
# Problem: High memory usage
# Solution: Optimize memory usage
# 1. Check for memory leaks
# 2. Optimize queries
# 3. Use pagination
# 4. Monitor memory usage
```

### Server Performance

#### High CPU Usage
```bash
# Problem: High CPU usage
# Solution: Optimize server
# 1. Check for infinite loops
# 2. Optimize algorithms
# 3. Use caching
# 4. Monitor processes
```

#### Disk Space Issues
```bash
# Problem: Disk space full
# Solution: Clean up space
# 1. Clear log files
# 2. Remove temporary files
# 3. Clean up uploads
# 4. Monitor disk usage
```

## 🔒 Security Issues

### Authentication Security

#### Password Security
```bash
# Problem: Weak passwords
# Solution: Enforce password policies
# 1. Set minimum length
# 2. Require complexity
# 3. Check against common passwords
# 4. Implement rate limiting
```

#### Session Security
```bash
# Problem: Session hijacking
# Solution: Secure sessions
# 1. Use secure cookies
# 2. Implement CSRF protection
# 3. Use HTTPS
# 4. Set proper session timeouts
```

### Data Security

#### SQL Injection
```bash
# Problem: SQL injection vulnerabilities
# Solution: Use parameterized queries
# 1. Use Eloquent ORM
# 2. Validate input
# 3. Use prepared statements
# 4. Sanitize data
```

#### XSS Protection
```bash
# Problem: Cross-site scripting
# Solution: Sanitize output
# 1. Escape HTML output
# 2. Use CSP headers
# 3. Validate input
# 4. Use secure libraries
```

## 📊 Monitoring & Debugging

### Log Analysis

#### Application Logs
```bash
# Problem: Application errors
# Solution: Check logs
tail -f storage/logs/laravel.log
tail -f storage/logs/error.log
```

#### Server Logs
```bash
# Problem: Server issues
# Solution: Check server logs
tail -f /var/log/nginx/error.log
tail -f /var/log/apache2/error.log
```

### Debugging Tools

#### Laravel Debugging
```bash
# Problem: Debugging issues
# Solution: Use debugging tools
# 1. Enable debug mode
# 2. Use dd() and dump()
# 3. Check error pages
# 4. Use logging
```

#### React Debugging
```bash
# Problem: React issues
# Solution: Use debugging tools
# 1. Use React DevTools
# 2. Check console errors
# 3. Use debugger statements
# 4. Check network requests
```

## 🆘 Getting Help

### Self-Help Resources

#### Documentation
- [README.md](README.md) - Project overview
- [DEVELOPMENT.md](DEVELOPMENT.md) - Development guide
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md) - API reference
- [FAQ.md](FAQ.md) - Frequently asked questions

#### Community Resources
- [GitHub Issues](https://github.com/your-repo/issues) - Bug reports
- [GitHub Discussions](https://github.com/your-repo/discussions) - Community help
- [Stack Overflow](https://stackoverflow.com) - Technical questions

### Contact Support

#### Technical Support
- **Email:** support@eattoeat.com
- **Phone:** +20 123 456 7890
- **Hours:** 24/7 support

#### Emergency Support
- **Email:** emergency@eattoeat.com
- **Phone:** +20 123 456 7891
- **Hours:** 24/7 emergency support

### Reporting Issues

#### Bug Reports
When reporting bugs, please include:
1. **Environment:** OS, PHP version, Node.js version
2. **Steps to reproduce:** Clear, numbered steps
3. **Expected behavior:** What should happen
4. **Actual behavior:** What actually happens
5. **Error logs:** Relevant error messages
6. **Screenshots:** If applicable

#### Feature Requests
When suggesting features:
1. **Use case:** Why is this feature needed?
2. **Proposed solution:** How should it work?
3. **Alternatives:** Other ways to solve the problem
4. **Additional context:** Any other relevant information

## 🔄 Maintenance

### Regular Maintenance

#### Daily Tasks
- Check application logs
- Monitor server resources
- Verify backups
- Check security updates

#### Weekly Tasks
- Update dependencies
- Review performance metrics
- Check security scans
- Update documentation

#### Monthly Tasks
- Security audit
- Performance optimization
- Backup verification
- Dependency updates

### Backup & Recovery

#### Database Backups
```bash
# Create backup
mysqldump -u root -p eattoeat > backup.sql

# Restore backup
mysql -u root -p eattoeat < backup.sql
```

#### File Backups
```bash
# Backup files
tar -czf backup.tar.gz /path/to/eattoeat

# Restore files
tar -xzf backup.tar.gz
```

---

**Still having issues?** Contact our support team at support@eattoeat.com

**Last Updated:** 2024-01-01
