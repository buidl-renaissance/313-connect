# 313 Connect Setup Guide

This guide will help you set up and deploy your 313 Connect application.

## Prerequisites

- Node.js 18+ installed
- Yarn package manager
- A Turso account (free tier available at [turso.tech](https://turso.tech))

## Step 1: Create Turso Database

1. Install the Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```

2. Sign up or log in:
   ```bash
   turso auth signup
   # or
   turso auth login
   ```

3. Create your database:
   ```bash
   turso db create 313connect
   ```

4. Get your database URL:
   ```bash
   turso db show 313connect --url
   ```

5. Create an auth token:
   ```bash
   turso db tokens create 313connect
   ```

## Step 2: Configure Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Database Configuration
TURSO_DATABASE_URL=libsql://[your-database-name]-[your-org].turso.io
TURSO_AUTH_TOKEN=your-auth-token-here

# Authentication
JWT_SECRET=your-secret-key-here-change-in-production

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** 
- Replace `TURSO_DATABASE_URL` with the URL from step 1.4
- Replace `TURSO_AUTH_TOKEN` with the token from step 1.5
- Generate a secure `JWT_SECRET` (you can use `openssl rand -base64 32`)

## Step 3: Set Up Database Schema

Push the schema to your Turso database:

```bash
yarn db:push
```

This will create all the necessary tables in your database.

## Step 4: Run Development Server

Start the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## Step 5: Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add the environment variables in Vercel's project settings:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (set to your production URL)

4. Deploy!

## Database Management

### View Database Studio

Open Drizzle Studio to inspect your database:

```bash
yarn db:studio
```

### Generate Migrations

If you make changes to the schema:

```bash
yarn db:generate
```

Then push the changes:

```bash
yarn db:push
```

## Authentication Flow

The application uses a DPoP (Demonstration of Proof-of-Possession) authentication system:

1. **Web App**: User clicks "Connect Wallet"
2. **Web App**: Generates a client keypair and requests a challenge
3. **Web App**: Displays QR code with challenge
4. **Mobile App**: Scans QR code, signs challenge with wallet
5. **Web App**: Receives signature, sends to `/api/auth/verify`
6. **Server**: Validates signature, creates/finds user, issues JWT
7. **Web App**: Stores JWT and user info, redirects to dashboard

For development, you can manually enter a wallet address and signature in the QR modal.

## Key Features Implemented

### Database Layer
- ✅ Turso database with Drizzle ORM
- ✅ Complete schema (users, identities, profiles, connections, events, checkins)
- ✅ Auth challenges and nonce tracking for security

### Authentication
- ✅ DPoP-based authentication system
- ✅ Client-side keypair generation
- ✅ Challenge-response flow
- ✅ JWT token issuance and validation
- ✅ Token refresh endpoint

### API Endpoints
- ✅ `/api/auth/challenge` - Generate auth challenge
- ✅ `/api/auth/verify` - Verify signature and issue token
- ✅ `/api/auth/refresh` - Refresh JWT token
- ✅ `/api/identities/claim` - Claim a 313 number
- ✅ `/api/identities/check` - Check number availability
- ✅ `/api/identities/[number]` - Get identity details
- ✅ `/api/profile` - Get/update user profile
- ✅ `/api/connections` - Manage peer connections
- ✅ `/api/connections/verify` - Accept/reject connections
- ✅ `/api/events` - List/create events
- ✅ `/api/events/[id]` - Get event details
- ✅ `/api/events/[id]/checkin` - Check in to event

### Web Application
- ✅ Landing page with number checker
- ✅ Authentication modal with QR code
- ✅ Dashboard with profile and stats
- ✅ Events page with filtering
- ✅ Responsive design
- ✅ Protected routes

## Next Steps

### Mobile App Integration
The web app is ready to integrate with a mobile app. The mobile app should:
1. Scan the QR code from `/api/auth/challenge`
2. Sign the challenge with the user's wallet
3. Send the signature back to the web app (or directly to `/api/auth/verify`)

### Additional Features to Build
- Event creation form
- Profile editing page
- Connection request flow
- Location verification for check-ins
- Notification system
- Search functionality

## Troubleshooting

### Database Connection Issues
- Verify your Turso credentials are correct
- Check that your database exists: `turso db list`
- Ensure you're using the correct auth token

### Authentication Issues
- Make sure JWT_SECRET is set and consistent
- Check browser console for client-side errors
- Verify localStorage is not disabled

### Build Errors
- Clear `.next` directory: `rm -rf .next`
- Reinstall dependencies: `yarn install`
- Check for TypeScript errors: `yarn build`

## Support

For questions or issues:
- Check the [PRD document](./docs/PRD.md)
- Review the [Turso documentation](https://docs.turso.tech)
- Open an issue on GitHub

---

**Built with:** Next.js, React, TypeScript, Styled Components, Drizzle ORM, Turso, DPoP Auth

