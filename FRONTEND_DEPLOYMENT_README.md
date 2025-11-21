# VistaForge Frontend - Production Deployment Guide

This guide covers deploying the VistaForge React frontend to Render.

## 🚀 Quick Deploy to Render

### Prerequisites
- Render account
- Backend already deployed (for API URLs)
- GitHub repository with this code

### Step 1: Deploy Frontend to Render

1. **Create Static Site on Render**
   - Go to Render Dashboard → New → Static Site
   - Connect your GitHub repository
   - Select branch to deploy
   - Configure service:
     - **Name**: `vistaforge-frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `./dist`

### Step 2: Configure Environment Variables

Set these environment variables in your Render static site:

```bash
# API Configuration
VITE_API_URL=https://your-backend-service.onrender.com/api
VITE_GRAPHQL_URL=https://your-backend-service.onrender.com/graphql

# App Configuration
VITE_APP_NAME=VistaForge
VITE_APP_ENV=production
VITE_APP_URL=https://your-frontend-service.onrender.com

# Optional: Analytics & Social Media
VITE_GA_TRACKING_ID=GA_MEASUREMENT_ID
VITE_LINKEDIN_URL=https://linkedin.com/company/vistaforge
VITE_INSTAGRAM_URL=https://instagram.com/vistaforge
VITE_TWITTER_URL=https://twitter.com/vistaforge
```

### Step 3: Deploy

1. Push your code to GitHub
2. Render will automatically build and deploy
3. Your site will be available at: `https://vistaforge-frontend.onrender.com`

## 🔧 Configuration Details

### Environment Variables

**Required:**
- `VITE_API_URL`: Backend API base URL
- `VITE_GRAPHQL_URL`: Backend GraphQL endpoint

**Optional:**
- `VITE_APP_NAME`: Application name (defaults to "VistaForge")
- `VITE_APP_ENV`: Environment (automatically set to "production" in Render)
- `VITE_APP_URL`: Frontend URL for canonical links

### Build Optimization

The frontend is optimized for production with:

- **Code Splitting**: Automatic chunk splitting for better caching
- **Minification**: Terser minification with console.log removal
- **Asset Optimization**: Compressed static assets
- **Tree Shaking**: Unused code elimination

## 📊 Performance Features

### Bundle Analysis
```bash
npm run build:analyze  # Analyze bundle size
```

### Caching Strategy
- Static assets cached for 1 year with immutable headers
- JavaScript chunks use content hashing for cache busting
- Service worker ready for offline functionality

### Error Handling
- Global error boundary with user-friendly error pages
- Development error details (hidden in production)
- Graceful error recovery

## 🔒 Security Features

- **Content Security Policy**: Configured headers in Render
- **XSS Protection**: Enabled via security headers
- **Frame Options**: Prevents clickjacking
- **Secure Cookies**: For authentication tokens

## 📱 SEO & Social Media

### Meta Tags Optimized
- Open Graph tags for Facebook sharing
- Twitter Card support
- Canonical URLs
- Structured data ready

### Performance Monitoring
- Lighthouse ready
- Core Web Vitals optimized
- Lazy loading for images
- Optimized fonts and assets

## 🚨 Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Verify `VITE_API_URL` points to correct backend
   - Check CORS configuration on backend
   - Ensure backend is deployed and running

2. **Build Failures**
   - Check Node.js version compatibility
   - Verify all dependencies are installed
   - Check for TypeScript/ESLint errors

3. **Routing Issues**
   - Ensure all routes are handled by React Router
   - Check `_redirects` file for SPA routing

4. **Asset Loading Issues**
   - Verify public assets are in correct directory
   - Check file paths in components

### Debug Commands

```bash
# Local production build test
npm run build
npm run preview

# Bundle analysis
npm run build:analyze

# Lint check
npm run lint
```

## 🔄 Updates and Maintenance

### Code Updates
1. Push changes to GitHub
2. Render automatically rebuilds and deploys
3. Monitor deployment in Render dashboard

### Environment Changes
1. Update environment variables in Render dashboard
2. Trigger new deployment
3. Verify changes work correctly

### Performance Monitoring
- Use Render analytics for performance metrics
- Monitor Core Web Vitals
- Check Lighthouse scores regularly

## 📞 Support

For deployment issues:
1. Check Render build logs
2. Verify environment variables
3. Test locally with production build
4. Check browser developer tools for errors

---

**Happy Deploying! 🎉**

Your VistaForge frontend is now production-ready with optimized performance, security, and monitoring features.