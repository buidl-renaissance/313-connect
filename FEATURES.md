# 313 Connect - Lead Generation Features

**"I Got a Guy for That"** - Your local network for connections, services, and opportunities.

## Overview

313 Connect has evolved from a peer verification network into a comprehensive lead generation platform. Users can now share what they offer, create trackable cards, discover nearby services, and build their referral network.

## Core Features

### 1. Offerings Management

**Create and manage your services, products, and skills:**

- **Create Offerings** (`/offerings/create`)
  - Add title, description, category, and pricing
  - Include contact methods (email, phone)
  - Upload images to showcase your work
  - Toggle active/inactive status

- **View All Offerings** (`/offerings`)
  - See all your offerings in one place
  - Quick edit, delete, and status toggle
  - Create shareable cards directly from offerings

- **Categories Include:**
  - Art & Design
  - Photography
  - Music
  - Tattoos
  - Stickers & Prints
  - Fashion
  - Food & Beverage
  - Technology
  - Consulting
  - Event Planning
  - And more...

### 2. Shareable Cards System

**Generate trackable cards for your offerings:**

- **Card Generator**
  - Create unique shareable URLs for each offering
  - Generate QR codes for in-person sharing
  - Share via Twitter, email, or direct link
  - Track every view automatically

- **Public Card View** (`/cards/[shareUrl]`)
  - Beautiful public-facing card display
  - Shows your 313 number, name, and offering details
  - Contact information with one-click actions
  - Conversion tracking on every interaction
  - No authentication required to view

- **Tracking Features:**
  - View counts
  - Share tracking
  - Referrer information
  - Conversion events (contacts, connections)

### 3. Analytics Dashboard

**Track your performance** (`/analytics`):

- **Overview Stats:**
  - Total cards created
  - Total views across all cards
  - Share count
  - Conversion count
  - Referral totals
  - Conversion rate percentage

- **Performance Insights:**
  - Top performing cards
  - Recent views timeline
  - Source tracking (where views come from)
  - Per-offering analytics

- **Exportable Data:**
  - View history
  - Conversion funnel
  - Geographic data (coming soon)

### 4. Location-Based Marketplace

**Discover and be discovered** (`/marketplace`):

- **Go Live Feature:**
  - Toggle location sharing on/off
  - Automatically expire after 4 hours
  - Select which offering to promote
  - Privacy controls (all, connections only, invisible)

- **Discovery:**
  - See users within 25 miles
  - Real-time location updates every 30 seconds
  - Filter by distance
  - View what people are offering right now
  - Perfect for events like Art Night, markets, festivals

- **Use Cases:**
  - Promote your services at local events
  - Find vendors and artists nearby
  - Network at conferences and meetups
  - Discover pop-up shops and temporary offerings

### 5. Referral Network

**Build your reputation as a connector** (`/referrals`):

- **Automatic Tracking:**
  - Every card share creates a referral link
  - Track when people connect through your cards
  - See conversion status (pending/completed)

- **Referral Dashboard:**
  - Total referrals made
  - Completion rates
  - Referral history
  - User information for each referral

- **Benefits:**
  - Build social capital as "the person who knows a guy"
  - Track your network growth
  - Future commission system ready

### 6. Enhanced Profile System

**Your 313 identity, enhanced:**

- **Profile Fields:**
  - 313 number (your unique identity)
  - Display name
  - Tagline (short pitch)
  - Bio
  - Region/neighborhood
  - Contact email
  - Contact phone
  - Social links (coming soon)

- **Privacy Controls:**
  - Control who sees your contact info
  - Location sharing preferences
  - Card visibility settings

## User Flows

### Creating and Sharing an Offering

1. Navigate to `/offerings/create`
2. Fill in offering details (title, category, description, price, contacts)
3. Click "Create Offering"
4. From offerings list, click "Create Card"
5. Card Generator modal opens with unique URL and QR code
6. Share via link, QR code, Twitter, or email
7. Track views and conversions in `/analytics`

### Going Live at an Event

1. Navigate to `/marketplace`
2. Allow location access
3. Click "Go Live" button
4. You appear on the map for nearby users
5. Others can see your offerings and contact you
6. Click "Stop Live" when done

### Discovering Nearby Services

1. Go to `/marketplace`
2. Allow location access
3. Browse users within 25 miles
4. See their offerings and distance
5. Click "View Profile" to learn more
6. Contact directly via their card

## Technical Implementation

### New Database Tables

- `offerings` - Services/products users offer
- `cards` - Shareable trackable cards
- `card_views` - View tracking
- `card_shares` - Share tracking
- `conversions` - Conversion events
- `referrals` - Referral chains
- `live_locations` - Real-time marketplace locations

### API Endpoints

**Offerings:**
- `POST /api/offerings` - Create offering
- `GET /api/offerings` - List user's offerings
- `PATCH /api/offerings/[id]` - Update offering
- `DELETE /api/offerings/[id]` - Delete offering

**Cards:**
- `POST /api/cards` - Create card
- `GET /api/cards/[shareUrl]` - Get card details (public)
- `POST /api/cards/[shareUrl]/view` - Track view
- `POST /api/cards/[shareUrl]/convert` - Track conversion

**Analytics:**
- `GET /api/analytics/overview` - Get all stats

**Marketplace:**
- `POST /api/marketplace/go-live` - Go live
- `DELETE /api/marketplace/go-live` - Stop live
- `GET /api/marketplace/go-live` - Check live status
- `GET /api/marketplace/nearby` - Get nearby users

**Referrals:**
- `GET /api/referrals` - Get user's referrals

## Quick Start

### Setup Database

```bash
# Push schema changes
yarn db:push

# Seed with sample data
yarn db:seed
```

### Start Development

```bash
yarn dev
```

Navigate to:
- Homepage: `http://localhost:3000`
- Dashboard: `http://localhost:3000/dashboard`
- Create Offering: `http://localhost:3000/offerings/create`
- Marketplace: `http://localhost:3000/marketplace`
- Analytics: `http://localhost:3000/analytics`

## Usage Examples

### Example: Sticker Artist at Art Night

1. Create offering for "Custom Stickers - $5 each"
2. Before event, create and print QR code card
3. At Art Night, "Go Live" in marketplace
4. Place QR code on your table
5. People scan, view your card, save contact
6. Track views and conversions in real-time
7. Follow up with interested people after event

### Example: Tattoo Artist Building Network

1. Create offering for "Custom Tattoo Work"
2. Share card on Instagram and Twitter
3. Give card link to satisfied clients for referrals
4. Track which channels drive most views
5. See who's referring you the most business
6. Build your referral network

### Example: Tech Consultant

1. Create multiple offerings (Web Dev, Consulting, Workshops)
2. Create separate cards for each service
3. Share specific cards based on context
4. Track which services get most interest
5. Use analytics to refine pricing and description
6. Go live at tech meetups to network

## Success Metrics

The platform tracks:
- **Card Shares** - How often you share
- **View Rate** - How many people see your cards
- **Conversion Rate** - Views that turn into contacts
- **Referral Growth** - Network effect of your shares
- **Active Engagement** - Marketplace usage

## Future Enhancements

Coming soon:
- Commission tracking and payments
- Direct messaging between users
- Calendar integration for bookings
- Portfolio/gallery uploads
- Review and rating system
- Advanced analytics (geographic heatmaps, time-of-day insights)
- Mobile app with Web3 identity
- Event-specific marketplace filters
- Community leaderboards

## Philosophy

313 Connect is built on the principle that the best connections come through trusted referrals. Instead of cold advertising, we enable warm introductions. You're not just selling a service—you're being the helpful person who connects people with what they need.

**"I got a guy for that"** isn't just a tagline. It's how local communities have always worked. We're just making it easier to scale that trust.

