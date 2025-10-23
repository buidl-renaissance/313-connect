/**
 * Database Seed Script
 * Run this to populate your database with initial data
 * 
 * Usage: tsx src/db/seed.ts
 */

import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

import { db } from './client';
import { users, identities, profiles, events, offerings } from './schema';
import { generateId } from '@/utils/auth';

async function seed() {
  console.log('🌱 Seeding database...');

  try {
    // Create reserved/example users
    console.log('Creating reserved identities...');
    
    const reservedNumbers = ['313', '3131', '31313', '1', '2', '3'];
    const sampleUser = {
      id: generateId('user'),
      walletAddress: '0x0000000000000000000000000000000000000000',
    };

    await db.insert(users).values(sampleUser);
    
    await db.insert(profiles).values({
      id: generateId('prof'),
      userId: sampleUser.id,
      displayName: 'Reserved',
      bio: 'Reserved numbers for system use',
      region: 'Detroit',
      verificationStatus: 'verified',
    });

    for (const number of reservedNumbers) {
      await db.insert(identities).values({
        id: generateId('id'),
        userId: sampleUser.id,
        number,
        isActive: true,
      });
      console.log(`  ✓ Reserved: 313#${number}`);
    }

    // Create sample community events
    console.log('\nCreating sample events...');
    
    const sampleEvents = [
      {
        id: generateId('evt'),
        title: 'Detroit Tech Meetup',
        description: 'Monthly gathering for Detroit tech enthusiasts. Come network, share ideas, and build connections in the local tech scene.',
        location: 'Bamboo Detroit',
        latitude: '42.3375',
        longitude: '-83.0498',
        region: 'Midtown',
        startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000), // +2 hours
        creatorId: sampleUser.id,
        isActive: true,
      },
      {
        id: generateId('evt'),
        title: 'Corktown Coffee & Code',
        description: 'Casual coding session at a local coffee shop. Bring your laptop and work on your projects alongside other developers.',
        location: 'Astro Coffee',
        latitude: '42.3298',
        longitude: '-83.0785',
        region: 'Corktown',
        startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        creatorId: sampleUser.id,
        isActive: true,
      },
      {
        id: generateId('evt'),
        title: 'Eastern Market Saturday',
        description: 'Join the community at Detroit\'s historic Eastern Market. Shop local, support small businesses, and meet your neighbors.',
        location: 'Eastern Market',
        latitude: '42.3467',
        longitude: '-83.0395',
        region: 'Downtown',
        startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
        creatorId: sampleUser.id,
        isActive: true,
      },
      {
        id: generateId('evt'),
        title: 'Hamtramck Art Walk',
        description: 'Explore local art galleries and studios in Hamtramck. Meet artists, see new works, and support the creative community.',
        location: 'Hamtramck Art District',
        latitude: '42.3928',
        longitude: '-83.0497',
        region: 'Hamtramck',
        startTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000),
        creatorId: sampleUser.id,
        isActive: true,
      },
    ];

    for (const event of sampleEvents) {
      await db.insert(events).values(event);
      console.log(`  ✓ Created event: ${event.title}`);
    }

    // Create sample offerings
    console.log('\nCreating sample offerings...');
    
    const sampleOfferings = [
      {
        id: generateId('off'),
        userId: sampleUser.id,
        title: 'Custom Sticker Design',
        description: 'High-quality vinyl stickers for your brand, event, or personal use. Fast turnaround and competitive pricing.',
        category: 'Stickers & Prints',
        price: '$50-200 depending on quantity',
        contactEmail: 'stickers@example.com',
        contactPhone: null,
        imageUrl: null,
        isActive: true,
      },
      {
        id: generateId('off'),
        userId: sampleUser.id,
        title: 'Professional Photography',
        description: 'Event photography, portraits, and product shots. Detroit-based photographer with 10+ years experience.',
        category: 'Photography',
        price: 'Starting at $150/hour',
        contactEmail: 'photos@example.com',
        contactPhone: '(313) 555-0100',
        imageUrl: null,
        isActive: true,
      },
      {
        id: generateId('off'),
        userId: sampleUser.id,
        title: 'Web Development Services',
        description: 'Custom websites and web applications. Specializing in React, Next.js, and modern web technologies.',
        category: 'Technology',
        price: 'Contact for quote',
        contactEmail: 'dev@example.com',
        contactPhone: null,
        imageUrl: null,
        isActive: true,
      },
    ];

    for (const offering of sampleOfferings) {
      await db.insert(offerings).values(offering);
      console.log(`  ✓ Created offering: ${offering.title}`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('\nSeeded data:');
    console.log(`  - ${reservedNumbers.length} reserved identities`);
    console.log(`  - ${sampleEvents.length} sample events`);
    console.log(`  - ${sampleOfferings.length} sample offerings`);
    console.log('\nYou can now start the development server with: yarn dev');
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
}

// Run the seed function
seed()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

