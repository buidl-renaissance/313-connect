# 313 Connect

**Your local network — verified by connection, rooted in Detroit.**

313 Connect is a peer-to-peer local network for Detroit that turns phone numbers into decentralized identifiers (DIDs). It allows residents to claim a 313 identity, verify it through mutual connections, and communicate directly through a community-based network.

## 📋 Documentation

- [**Product Requirements Document (PRD)**](./docs/PRD.md) - Full product vision, roadmap, and specifications
- [**Setup Guide**](./SETUP.md) - Complete setup instructions for development
- [**Deployment Guide**](./DEPLOYMENT.md) - Production deployment to Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Yarn package manager
- Turso account (free tier available)

### Installation Steps

1. **Clone and install dependencies:**
   ```bash
   yarn install
   ```

2. **Set up Turso database** (see [SETUP.md](./SETUP.md) for details):
   ```bash
   # Install Turso CLI
   curl -sSfL https://get.tur.so/install.sh | bash
   
   # Create database and get credentials
   turso db create 313connect
   turso db show 313connect --url
   turso db tokens create 313connect
   ```

3. **Create `.env.local`** with your Turso credentials

4. **Initialize database:**
   ```bash
   yarn db:push
   yarn db:seed
   ```

5. **Start development server:**
   ```bash
   yarn dev
   ```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🚀 Next.js Default Instructions

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `src/pages/api/hello.ts`.

The `src/pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

## 🎯 Project Vision

**Mission:** To establish a human-centered network that connects Detroiters through verified peer relationships, fostering trust, communication, and belonging in the digital and physical commons.

**Core Features:**
- 🔢 Claim unique 313 identities
- 🤝 Peer-verified onboarding
- 📍 Hyperlocal community networks
- 🔒 Privacy-first decentralized identity
- 📱 P2P messaging and calls

## 🛠 Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript, Styled Components
- **Backend:** Turso (SQLite), Drizzle ORM
- **Authentication:** DPoP (Demonstration of Proof-of-Possession)
- **Identity:** Wallet-based signatures, JWT tokens
- **Mobile:** React Native (Expo) - Coming soon

## ✨ Features Implemented

### v0.2 - Lead Generation Platform (Current)

**"I Got a Guy for That"** - Transform your network into a lead generation machine.

**Offerings Management:**
- ✅ Create and manage services/products
- ✅ 11+ categories (Art, Tech, Music, Tattoos, etc.)
- ✅ Pricing and contact information
- ✅ Active/inactive status toggle

**Shareable Cards:**
- ✅ Generate unique trackable URLs
- ✅ QR code generation
- ✅ Share via Twitter, email, direct link
- ✅ Public card view (no auth required)
- ✅ Automatic view and conversion tracking

**Analytics Dashboard:**
- ✅ Total views, shares, conversions
- ✅ Conversion rate calculation
- ✅ Top performing cards
- ✅ Recent views timeline
- ✅ Source tracking

**Location Marketplace:**
- ✅ Go live at events and locations
- ✅ Discover nearby users (25-mile radius)
- ✅ Real-time location updates
- ✅ 4-hour auto-expiration
- ✅ Privacy controls

**Referral System:**
- ✅ Automatic referral tracking
- ✅ Referral status dashboard
- ✅ Network effect metrics
- ✅ Completion tracking

### v0.1 - Foundation

**Authentication System:**
- ✅ DPoP-based wallet authentication
- ✅ QR code challenge generation
- ✅ JWT token issuance and refresh
- ✅ Protected routes

**Identity Management:**
- ✅ 313 number claiming system
- ✅ Real-time availability checking
- ✅ User profiles with enhanced fields

**Social Features:**
- ✅ Peer-to-peer connections
- ✅ Connection verification

**Events:**
- ✅ Event creation and browsing
- ✅ Regional filtering
- ✅ Event check-ins

## 📦 Database Schema

The application uses Turso (SQLite) with the following tables:

**Core Tables:**
- `users` - User accounts with wallet addresses
- `identities` - Claimed 313 numbers
- `profiles` - User profile information (enhanced with contact fields)
- `connections` - Peer-to-peer connections
- `events` - Community events
- `checkins` - Event attendance

**Lead Generation Tables (New):**
- `offerings` - Services/products users offer
- `cards` - Shareable trackable cards
- `card_views` - View tracking with analytics
- `card_shares` - Share event tracking
- `conversions` - Conversion event tracking
- `referrals` - Referral chain tracking
- `live_locations` - Real-time marketplace positions

**Auth Tables:**
- `auth_challenges` - Authentication challenges
- `nonces` - Replay attack prevention

See `src/db/schema.ts` for complete schema definition.

## 🚀 Quick Start Guide

### Explore New Features

After setting up the database, explore these new pages:

1. **Create an Offering** → `http://localhost:3000/offerings/create`
   - Add a service or product you want to promote
   
2. **View Your Offerings** → `http://localhost:3000/offerings`
   - Manage all your offerings in one place
   
3. **Generate a Card** → Click "Create Card" on any offering
   - Get a shareable URL and QR code
   
4. **Check Analytics** → `http://localhost:3000/analytics`
   - See views, shares, and conversions
   
5. **Go to Marketplace** → `http://localhost:3000/marketplace`
   - Go live and discover nearby users
   
6. **Track Referrals** → `http://localhost:3000/referrals`
   - See who you've connected

### Example User Flow

```bash
# 1. Start the app
yarn dev

# 2. Claim a 313 number on homepage
# 3. Login to dashboard
# 4. Create your first offering (e.g., "Custom Stickers")
# 5. Generate a shareable card
# 6. Share the card link
# 7. View analytics to track performance
# 8. Go live in marketplace when at an event
```

## 📖 Documentation

- [**FEATURES.md**](./FEATURES.md) - Comprehensive feature guide
- [**IMPLEMENTATION_STATUS.md**](./IMPLEMENTATION_STATUS.md) - Development status
- [**PRD.md**](./docs/PRD.md) - Product requirements
- [**PAD.md**](./docs/PAD.md) - Platform architecture

## 📚 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🌐 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.

---

**Current Version:** v0.1 (Prototype)  
**Maintainer:** John Gulbronson  
**Repository:** github.com/detroitcommons/313connect
