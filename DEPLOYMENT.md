# Deployment Guide - 313 Connect

This guide covers deploying your 313 Connect application to Vercel with Turso database.

## Pre-Deployment Checklist

- [ ] Turso database created
- [ ] Database schema pushed (`yarn db:push`)
- [ ] Database seeded with initial data (`yarn db:seed`)
- [ ] All environment variables documented
- [ ] Code pushed to GitHub repository
- [ ] Local development tested

## Environment Variables

You'll need the following environment variables in production:

### Required Variables

```env
# Turso Database
TURSO_DATABASE_URL=libsql://[your-database].turso.io
TURSO_AUTH_TOKEN=[your-turso-token]

# Authentication
JWT_SECRET=[generate-secure-random-string]

# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

### Generating JWT_SECRET

Generate a secure random string for JWT_SECRET:

```bash
# Using OpenSSL
openssl rand -base64 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## Deploying to Vercel

### Method 1: Vercel Dashboard (Recommended)

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Next.js`
   - Build Command: `yarn build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `yarn install` (default)

3. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add each variable from the list above
   - Make sure to add them for all environments (Production, Preview, Development)

4. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete
   - Visit your deployed site!

### Method 2: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables
vercel env add TURSO_DATABASE_URL
vercel env add TURSO_AUTH_TOKEN
vercel env add JWT_SECRET
vercel env add NEXT_PUBLIC_APP_URL

# Deploy to production
vercel --prod
```

## Post-Deployment Tasks

### 1. Verify Database Connection

Check that your API routes can connect to Turso:
- Visit `https://your-domain.vercel.app/api/events`
- Should return a JSON response (even if empty)

### 2. Test Authentication Flow

1. Visit your site
2. Click "Connect Wallet"
3. Verify QR code displays
4. Test manual signature input (for development)

### 3. Check Number Availability

1. Go to homepage
2. Enter a number (e.g., "1234")
3. Click "Check Availability"
4. Verify it queries the database correctly

### 4. Update CORS Settings (If Needed)

If you plan to integrate with a mobile app, you may need to configure CORS.

Create or update `src/middleware.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  return response;
}

export const config = {
  matcher: '/api/:path*',
};
```

## Production Database Considerations

### Scaling

Turso automatically handles scaling, but consider:
- Monitor your database usage in Turso dashboard
- Set up alerts for connection limits
- Consider upgrading Turso plan if needed

### Backups

Turso provides automatic backups, but you should:
- Regularly export important data
- Test restoration procedures
- Document your backup strategy

### Security

1. **Rotate Secrets Regularly**
   ```bash
   # Generate new JWT secret
   openssl rand -base64 32
   
   # Update in Vercel
   vercel env rm JWT_SECRET
   vercel env add JWT_SECRET
   ```

2. **Monitor Auth Token Usage**
   - Check Turso dashboard for unusual activity
   - Rotate tokens if compromised
   ```bash
   turso db tokens create 313connect
   ```

3. **Rate Limiting**
   - Consider adding rate limiting to auth endpoints
   - Use Vercel's Edge Config for rate limit tracking

## Monitoring and Observability

### Vercel Analytics

Enable Vercel Analytics in your project settings:
- Real-time performance metrics
- User analytics
- Error tracking

### Database Monitoring

Monitor through Turso dashboard:
- Query performance
- Connection count
- Storage usage

### Error Tracking

Consider adding error tracking:

```bash
yarn add @vercel/analytics @vercel/speed-insights
```

Update `_app.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
      <Analytics />
      <SpeedInsights />
    </AuthProvider>
  );
}
```

## Troubleshooting

### Build Fails

**Issue:** Build fails with module not found
```bash
# Clear cache and reinstall
rm -rf node_modules .next
yarn install
yarn build
```

**Issue:** TypeScript errors during build
- Check `tsconfig.json` configuration
- Run `yarn lint` locally
- Fix all type errors before deploying

### Database Connection Errors

**Issue:** "Failed to connect to Turso"
- Verify `TURSO_DATABASE_URL` is correct
- Check `TURSO_AUTH_TOKEN` is valid
- Test connection locally first

**Issue:** "Database not found"
- Ensure database exists: `turso db list`
- Verify URL matches database name
- Check for typos in environment variables

### Authentication Issues

**Issue:** JWT token invalid
- Ensure `JWT_SECRET` is set and consistent
- Check token expiration (default 7 days)
- Verify Authorization header format

**Issue:** Challenge expired
- Challenges expire after 5 minutes
- Request new challenge if expired
- Check server/client time sync

## Performance Optimization

### Database Queries

- Use indexes on frequently queried fields
- Limit result sets with `.limit()`
- Avoid N+1 queries (use joins)

### Edge Functions

Consider moving some API routes to Edge Functions:
- Faster response times
- Lower latency globally
- Update `next.config.ts`:

```typescript
export const config = {
  runtime: 'edge',
};
```

### Caching

Implement caching strategies:
- Cache static event data
- Use SWR for client-side caching
- Implement Redis for session storage

## Scaling Considerations

### When to Scale

Monitor these metrics:
- API response times > 1s
- Database connections > 80% limit
- Error rates > 1%
- User complaints about slowness

### Horizontal Scaling

Vercel handles this automatically, but ensure:
- Stateless API design
- Database connection pooling
- No server-side session storage

### Database Scaling

1. **Optimize Queries**
   - Add indexes
   - Reduce payload sizes
   - Use database views

2. **Upgrade Turso Plan**
   - More connections
   - Larger storage
   - Better performance

3. **Consider Sharding**
   - Separate databases by region
   - User-based sharding
   - Feature-based separation

## Continuous Deployment

### Automatic Deployments

Vercel automatically deploys:
- Every push to `main` branch → Production
- Every push to other branches → Preview
- Every pull request → Preview

### Preview Deployments

- Each PR gets a unique URL
- Test changes before merging
- Share with team for review

### Deployment Protection

Enable in Vercel project settings:
- Password protection for previews
- Vercel Authentication
- Custom authentication

## Rollback Procedures

### Quick Rollback

If something goes wrong:

1. Go to Vercel Dashboard
2. Select your project
3. Go to "Deployments"
4. Find last working deployment
5. Click "..." → "Promote to Production"

### Database Rollback

If you need to rollback database changes:

1. Export current state:
   ```bash
   turso db shell 313connect ".dump" > backup.sql
   ```

2. Restore from backup:
   ```bash
   turso db shell 313connect < previous_backup.sql
   ```

## Support and Resources

- **Vercel Documentation**: https://vercel.com/docs
- **Turso Documentation**: https://docs.turso.tech
- **Next.js Documentation**: https://nextjs.org/docs
- **Drizzle ORM Documentation**: https://orm.drizzle.team

## Success Checklist

After deployment, verify:

- [ ] Homepage loads correctly
- [ ] Connect Wallet button works
- [ ] Number availability check works
- [ ] Database queries return data
- [ ] Events page displays
- [ ] Dashboard requires authentication
- [ ] Protected routes redirect correctly
- [ ] QR code displays in auth modal
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SSL certificate active
- [ ] Custom domain configured (if applicable)

---

**Deployment Complete!** 🚀

Your 313 Connect application is now live and ready for users.

