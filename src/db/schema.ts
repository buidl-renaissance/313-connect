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
  region: text('region'), // Neighborhood: Midtown, Hamtramck, Corktown, etc.
  verificationStatus: text('verification_status').notNull().default('unverified'), // unverified, pending, verified
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

