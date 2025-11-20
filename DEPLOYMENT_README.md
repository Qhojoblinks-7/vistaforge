# VistaForge Backend - Production Deployment Guide

This guide covers deploying the VistaForge Django backend to Render.

## 🚀 Quick Deploy to Render

### Prerequisites
- Render account
- GitHub repository with this code

### Step 1: Set up Render Services

1. **Create PostgreSQL Database**
   - Go to Render Dashboard → New → PostgreSQL
   - Name: `vistaforge-db`
   - Choose plan and region
   - Note the connection string

2. **Create Web Service**
   - Go to Render Dashboard → New → Web Service
   - Connect your GitHub repository
   - Select branch to deploy
   - Configure service:
     - **Name**: `vistaforge-backend`
     - **Runtime**: `Python`
     - **Build Command**: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
     - **Start Command**: `python manage.py migrate && gunicorn backend.wsgi:application --bind 0.0.0.0:$PORT`

### Step 2: Configure Environment Variables

Set these environment variables in your Render web service:

```bash
ENVIRONMENT=production
SECRET_KEY=your-generated-secret-key
EXCLUSIVE_ADMIN_USERNAME=admin
FRONTEND_URL=https://your-frontend-domain.com
ALLOWED_HOSTS=your-backend-domain.onrender.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=true
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@vistaforge.com
SYSTEM_NOTIFICATION_EMAIL=admin@vistaforge.com
```

### Step 3: Database Connection

Render automatically provides `DATABASE_URL` environment variable when you link a PostgreSQL database.

### Step 4: Deploy

1. Push your code to GitHub
2. Render will automatically deploy
3. Monitor deployment logs
4. Check health endpoint: `https://your-service.onrender.com/health/`

## 🔧 Manual Configuration

If you prefer manual setup:

### 1. Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in values:

```bash
cp backend/.env.example backend/.env
# Edit .env with your values
```

### 2. Local Testing

Test production settings locally:

```bash
cd backend
ENVIRONMENT=production python manage.py check
ENVIRONMENT=production python manage.py migrate
ENVIRONMENT=production python manage.py collectstatic
```

### 3. Production URLs

- **GraphQL API**: `https://your-service.onrender.com/graphql/`
- **Health Check**: `https://your-service.onrender.com/health/`
- **Admin Panel**: `https://your-service.onrender.com/admin/`

## 🔒 Security Features

- ✅ HTTPS enforced in production
- ✅ Secure cookies and headers
- ✅ CSRF protection
- ✅ CORS configured for frontend domain
- ✅ Exclusive admin authentication
- ✅ SQL injection protection via Django ORM

## 📊 Monitoring

### Health Checks
- `/health/` - Basic health check
- `/readiness/` - Readiness probe for deployments

### Logs
- Application logs available in Render dashboard
- Structured logging with proper levels
- Error tracking and notifications

## 🚨 Troubleshooting

### Common Issues

1. **Static Files Not Loading**
   - Ensure `collectstatic` ran during build
   - Check `STATIC_ROOT` configuration

2. **Database Connection Failed**
   - Verify `DATABASE_URL` is set correctly
   - Check PostgreSQL instance is running

3. **CORS Errors**
   - Update `FRONTEND_URL` environment variable
   - Ensure `ALLOWED_HOSTS` includes your domain

4. **Email Not Sending**
   - Verify SMTP credentials
   - Check Gmail app password if using Gmail

### Debug Commands

```bash
# Check Django configuration
python manage.py check --deploy

# Test database connection
python manage.py dbshell

# View logs
python manage.py showmigrations
```

## 🔄 Updates and Maintenance

### Database Migrations
When deploying schema changes:
1. Create migrations locally: `python manage.py makemigrations`
2. Test migrations: `python manage.py migrate --check`
3. Deploy - migrations run automatically

### Static Files
Static files are automatically collected during build. For manual updates:
```bash
python manage.py collectstatic --clear
```

### Environment Updates
Update environment variables in Render dashboard - service will restart automatically.

## 📞 Support

For deployment issues:
1. Check Render logs
2. Verify environment variables
3. Test locally with production settings
4. Check Django documentation for specific errors

---

**Happy Deploying! 🚀**