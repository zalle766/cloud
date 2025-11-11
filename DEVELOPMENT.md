# Eat to Eat - Development Setup Guide

## 🚀 Quick Start

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 18+
- MySQL 8.0+
- XAMPP (for local development)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
composer install
```

3. **Environment setup:**
```bash
cp .env.example .env
php artisan key:generate
```

4. **Database configuration:**
Update `.env` file with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=eattoeat
DB_USERNAME=root
DB_PASSWORD=
```

5. **Run migrations and seeders:**
```bash
php artisan migrate
php artisan db:seed
```

6. **Start Laravel server:**
```bash
php artisan serve
```

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Environment setup:**
```bash
cp .env.example .env
```

4. **Update environment variables:**
```env
VITE_API_URL=http://localhost:8000/api
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_PUSHER_APP_KEY=your_pusher_app_key
VITE_PUSHER_CLUSTER=your_pusher_cluster
VITE_PUSHER_HOST=your_pusher_host
```

5. **Start development server:**
```bash
npm run dev
```

## 🔧 External Services Setup

### Google Maps API
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Maps JavaScript API
4. Create API Key
5. Add the key to your `.env` file

### Pusher
1. Go to [Pusher](https://pusher.com/)
2. Create a new app
3. Get your App Key, Cluster, and Host
4. Add credentials to your `.env` file

### AWS S3 (Optional)
1. Create AWS account
2. Create S3 bucket
3. Get Access Key and Secret Key
4. Add credentials to backend `.env` file

## 📱 Test Accounts

After running `php artisan db:seed`, you can use these test accounts:

- **Admin:** admin@eattoeat.com / password
- **Restaurant:** restaurant@eattoeat.com / password
- **Courier:** courier@eattoeat.com / password
- **Customer:** customer@eattoeat.com / password

## 🐛 Troubleshooting

### Common Issues

1. **Composer issues:**
```bash
composer clear-cache
composer install --no-cache
```

2. **NPM issues:**
```bash
npm cache clean --force
npm install
```

3. **Database connection issues:**
- Check MySQL is running
- Verify database credentials in `.env`
- Ensure database exists

4. **Permission issues:**
```bash
chmod -R 755 storage
chmod -R 755 bootstrap/cache
```

## 📊 Development Commands

### Backend Commands
```bash
# Clear cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Run tests
php artisan test

# Generate API documentation
php artisan api:docs

# Queue jobs
php artisan queue:work
```

### Frontend Commands
```bash
# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Preview production build
npm run preview
```

## 🔄 Development Workflow

1. **Backend changes:**
   - Make changes to Laravel files
   - Test API endpoints
   - Run migrations if needed

2. **Frontend changes:**
   - Make changes to React components
   - Test in browser
   - Build for production when ready

3. **Database changes:**
   - Create migration: `php artisan make:migration create_table_name`
   - Run migration: `php artisan migrate`
   - Rollback if needed: `php artisan migrate:rollback`

## 📝 Code Style

### Backend (Laravel)
- Follow PSR-12 coding standards
- Use Laravel conventions
- Write tests for new features

### Frontend (React)
- Use functional components with hooks
- Follow React best practices
- Use TailwindCSS for styling
- Write clean, readable code

## 🚀 Production Deployment

### Backend Deployment
1. Set up production server
2. Install PHP 8.2+ and extensions
3. Install Composer
4. Clone repository
5. Run `composer install --optimize-autoloader --no-dev`
6. Set up environment variables
7. Run migrations: `php artisan migrate --force`
8. Optimize: `php artisan config:cache && php artisan route:cache`

### Frontend Deployment
1. Build project: `npm run build`
2. Upload `dist` folder to web server
3. Configure server for SPA routing
4. Set up HTTPS

## 📞 Support

For issues and questions:
- Check the documentation
- Review error logs
- Contact development team

---

**Happy Coding! 🎉**
