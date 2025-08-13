# SellySock Marketplace - Production Deployment Guide

## Prerequisites

1. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
2. **Stripe Account** - Set up at [stripe.com](https://stripe.com)
3. **Supabase Project** - Create at [supabase.com](https://supabase.com)
4. **Domain** (optional) - For custom domain setup

## Environment Variables

### Required Production Variables

\`\`\`bash
# Stripe (Production)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CONNECT_WEBHOOK_SECRET=whsec_...

# Supabase (Production)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production

# Optional: Analytics & Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
SENTRY_DSN=your-sentry-dsn
\`\`\`

## Deployment Steps

### 1. Database Setup

1. Run the database migration:
   \`\`\`bash
   npm run db:migrate
   \`\`\`

2. Seed initial data (optional):
   \`\`\`bash
   npm run db:seed
   \`\`\`

### 2. Vercel Deployment

1. **Connect Repository**
   - Push code to GitHub
   - Connect repository in Vercel dashboard

2. **Configure Environment Variables**
   - Add all production environment variables in Vercel dashboard
   - Go to Project Settings > Environment Variables

3. **Deploy**
   - Vercel will automatically deploy on push to main branch
   - Or manually trigger deployment from dashboard

### 3. Domain Setup (Optional)

1. **Add Custom Domain**
   - Go to Project Settings > Domains
   - Add your custom domain
   - Configure DNS records as instructed

2. **SSL Certificate**
   - Vercel automatically provides SSL certificates
   - Verify HTTPS is working

### 4. Stripe Configuration

1. **Webhook Endpoints**
   - Add webhook endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`

2. **Connect Platform**
   - Configure Stripe Connect for marketplace functionality
   - Set platform fee percentage (currently 10%)

### 5. Post-Deployment Checklist

- [ ] Test user registration and login
- [ ] Test item listing and purchasing
- [ ] Test messaging system
- [ ] Test payment processing
- [ ] Test mobile responsiveness
- [ ] Verify PWA installation works
- [ ] Check performance with Lighthouse
- [ ] Test error handling and monitoring

## Performance Optimization

### Image Optimization
- Images are automatically optimized by Next.js
- Use WebP and AVIF formats when possible
- Implement lazy loading for better performance

### Caching Strategy
- API responses cached for 5 minutes
- Static assets cached for 1 year
- Database queries optimized with indexes

### Monitoring
- Error tracking configured
- Performance metrics logged
- User analytics tracked

## Security Features

- HTTPS enforced
- Security headers configured
- Row Level Security enabled in database
- Input validation and sanitization
- CSRF protection enabled

## Scaling Considerations

### Database
- Supabase handles scaling automatically
- Consider read replicas for high traffic
- Monitor query performance

### CDN
- Vercel provides global CDN
- Static assets served from edge locations
- API routes cached at edge when possible

### Monitoring
- Set up alerts for errors and performance
- Monitor database performance
- Track user metrics and conversion rates

## Maintenance

### Regular Updates
- Keep dependencies updated
- Monitor security advisories
- Update Stripe API versions as needed

### Backup Strategy
- Supabase provides automatic backups
- Consider additional backup strategy for critical data
- Test restore procedures regularly

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test database connectivity
4. Contact support@sellysocks.com
