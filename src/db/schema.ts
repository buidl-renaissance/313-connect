import { sql } from 'drizzle-orm';
import { sqliteTable, text, integer, uniqueIndex } from 'drizzle-orm/sqlite-core';

// Users table - primary user accounts tied to wallet addresses
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  walletAddress: text('wallet_address').notNull().unique(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Identities table - 313 numbers claimed by users
export const identities = sqliteTable('identities', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  number: text('number').notNull().unique(), // Just the digits after 313, e.g., "562"
  claimedAt: integer('claimed_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
}, (table) => ({
  numberIdx: uniqueIndex('number_idx').on(table.number),
}));

// Profiles table - user profile information
export const profiles = sqliteTable('profiles', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  displayName: text('display_name'),
  bio: text('bio'),
  tagline: text('tagline'), // Short description for cards
  region: text('region'), // Neighborhood: Midtown, Hamtramck, Corktown, etc.
  verificationStatus: text('verification_status').notNull().default('unverified'), // unverified, pending, verified
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  socialLinks: text('social_links'), // JSON: {twitter, linkedin, instagram, etc}
  privacySettings: text('privacy_settings'), // JSON: location sharing, contact visibility
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Connections table - peer-to-peer verified connections
export const connections = sqliteTable('connections', {
  id: text('id').primaryKey(),
  fromUserId: text('from_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  toUserId: text('to_user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  connectionType: text('connection_type').notNull().default('peer'), // peer, mutual, verified
  status: text('status').notNull().default('pending'), // pending, accepted, rejected
  verifiedAt: integer('verified_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Events table - local community events
export const events = sqliteTable('events', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  description: text('description'),
  location: text('location').notNull(),
  latitude: text('latitude'),
  longitude: text('longitude'),
  region: text('region'), // Neighborhood affiliation
  startTime: integer('start_time', { mode: 'timestamp' }).notNull(),
  endTime: integer('end_time', { mode: 'timestamp' }),
  creatorId: text('creator_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Check-ins table - event attendance verification
export const checkins = sqliteTable('checkins', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  eventId: text('event_id').notNull().references(() => events.id, { onDelete: 'cascade' }),
  timestamp: integer('timestamp', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  verified: integer('verified', { mode: 'boolean' }).notNull().default(false),
  latitude: text('latitude'),
  longitude: text('longitude'),
});

// Auth challenges table - for DPoP authentication flow
export const authChallenges = sqliteTable('auth_challenges', {
  id: text('id').primaryKey(),
  challenge: text('challenge').notNull().unique(),
  publicKey: text('public_key').notNull(), // Client's public key
  walletAddress: text('wallet_address'), // Set after signature verification
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  used: integer('used', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Nonces table - for replay attack prevention
export const nonces = sqliteTable('nonces', {
  id: text('id').primaryKey(),
  nonce: text('nonce').notNull().unique(),
  usedAt: integer('used_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

// Offerings table - services/products users want to promote
export const offerings = sqliteTable('offerings', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  category: text('category').notNull(), // e.g., "Stickers", "Tattoos", "Photography", "Music"
  price: text('price'), // Flexible text field for pricing info
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  imageUrl: text('image_url'),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Cards table - shareable contact/service cards with unique URLs
export const cards = sqliteTable('cards', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  offeringId: text('offering_id').references(() => offerings.id, { onDelete: 'set null' }), // nullable
  shareUrl: text('share_url').notNull().unique(), // Short unique code
  title: text('title'), // Custom title for the card
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
}, (table) => ({
  shareUrlIdx: uniqueIndex('share_url_idx').on(table.shareUrl),
}));

// Card views table - track views on shared cards
export const cardViews = sqliteTable('card_views', {
  id: text('id').primaryKey(),
  cardId: text('card_id').notNull().references(() => cards.id, { onDelete: 'cascade' }),
  viewerUserId: text('viewer_user_id').references(() => users.id, { onDelete: 'set null' }), // nullable
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  referrer: text('referrer'),
  location: text('location'), // JSON: {city, region, country}
  viewedAt: integer('viewed_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Card shares table - track when cards are shared
export const cardShares = sqliteTable('card_shares', {
  id: text('id').primaryKey(),
  cardId: text('card_id').notNull().references(() => cards.id, { onDelete: 'cascade' }),
  sharedBy: text('shared_by').notNull().references(() => users.id, { onDelete: 'cascade' }),
  sharedVia: text('shared_via').notNull(), // link, qr, twitter, linkedin, email, etc.
  sharedAt: integer('shared_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Conversions table - track when card views lead to connections
export const conversions = sqliteTable('conversions', {
  id: text('id').primaryKey(),
  cardId: text('card_id').notNull().references(() => cards.id, { onDelete: 'cascade' }),
  viewerId: text('viewer_id').references(() => users.id, { onDelete: 'set null' }), // nullable
  conversionType: text('conversion_type').notNull(), // connection, contact, booking
  convertedAt: integer('converted_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Referrals table - track referral chains and potential commissions
export const referrals = sqliteTable('referrals', {
  id: text('id').primaryKey(),
  referrerId: text('referrer_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  referredUserId: text('referred_user_id').references(() => users.id, { onDelete: 'set null' }), // nullable
  cardId: text('card_id').references(() => cards.id, { onDelete: 'set null' }), // nullable
  status: text('status').notNull().default('pending'), // pending, completed, failed
  commissionAmount: text('commission_amount'), // Flexible text for amount
  commissionPaid: integer('commission_paid', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
});

// Live locations table - users who are "live" and browsing marketplace
export const liveLocations = sqliteTable('live_locations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  latitude: text('latitude').notNull(),
  longitude: text('longitude').notNull(),
  currentOffering: text('current_offering'), // What they're currently promoting
  isVisible: integer('is_visible', { mode: 'boolean' }).notNull().default(true),
  visibilityMode: text('visibility_mode').notNull().default('all'), // all, connections, invisible
  lastUpdated: integer('last_updated', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
});

// Type exports for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Identity = typeof identities.$inferSelect;
export type NewIdentity = typeof identities.$inferInsert;
export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
export type Connection = typeof connections.$inferSelect;
export type NewConnection = typeof connections.$inferInsert;
export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
export type Checkin = typeof checkins.$inferSelect;
export type NewCheckin = typeof checkins.$inferInsert;
export type AuthChallenge = typeof authChallenges.$inferSelect;
export type NewAuthChallenge = typeof authChallenges.$inferInsert;
export type Nonce = typeof nonces.$inferSelect;
export type NewNonce = typeof nonces.$inferInsert;
export type Offering = typeof offerings.$inferSelect;
export type NewOffering = typeof offerings.$inferInsert;
export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type CardView = typeof cardViews.$inferSelect;
export type NewCardView = typeof cardViews.$inferInsert;
export type CardShare = typeof cardShares.$inferSelect;
export type NewCardShare = typeof cardShares.$inferInsert;
export type Conversion = typeof conversions.$inferSelect;
export type NewConversion = typeof conversions.$inferInsert;
export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;
export type LiveLocation = typeof liveLocations.$inferSelect;
export type NewLiveLocation = typeof liveLocations.$inferInsert;

