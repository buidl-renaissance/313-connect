import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db/client';
import { liveLocations, users, profiles, identities, offerings } from '@/db/schema';
import { sql, eq, and, gt } from 'drizzle-orm';

// Simple haversine distance calculation
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 3959; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { latitude, longitude, radius = 25 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({ 
        success: false, 
        error: 'Latitude and longitude are required' 
      });
    }

    const userLat = parseFloat(latitude as string);
    const userLon = parseFloat(longitude as string);
    const searchRadius = parseFloat(radius as string);

    // Get all active live locations (not expired)
    const now = new Date();
    const activeLiveLocations = await db
      .select()
      .from(liveLocations)
      .where(and(
        eq(liveLocations.isVisible, true),
        gt(liveLocations.expiresAt, now)
      ));

    // Filter by distance and enrich with user data
    const nearbyUsers = await Promise.all(
      activeLiveLocations
        .filter(loc => {
          const distance = calculateDistance(
            userLat,
            userLon,
            parseFloat(loc.latitude),
            parseFloat(loc.longitude)
          );
          return distance <= searchRadius;
        })
        .map(async (loc) => {
          // Get user profile
          const profile = await db
            .select()
            .from(profiles)
            .where(eq(profiles.userId, loc.userId))
            .limit(1);

          // Get identity
          const identity = await db
            .select()
            .from(identities)
            .where(eq(identities.userId, loc.userId))
            .limit(1);

          // Get current offering if specified
          let offering = null;
          if (loc.currentOffering) {
            const offeringResult = await db
              .select()
              .from(offerings)
              .where(eq(offerings.id, loc.currentOffering))
              .limit(1);
            
            if (offeringResult.length > 0) {
              offering = offeringResult[0];
            }
          }

          const distance = calculateDistance(
            userLat,
            userLon,
            parseFloat(loc.latitude),
            parseFloat(loc.longitude)
          );

          return {
            userId: loc.userId,
            distance: distance.toFixed(1),
            lastUpdated: loc.lastUpdated,
            profile: profile[0] || null,
            identity: identity[0] ? {
              number: identity[0].number,
              fullNumber: `313#${identity[0].number}`,
            } : null,
            offering,
          };
        })
    );

    // Sort by distance
    nearbyUsers.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));

    return res.status(200).json({
      success: true,
      count: nearbyUsers.length,
      users: nearbyUsers,
    });
  } catch (error) {
    console.error('Error fetching nearby users:', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch nearby users' });
  }
}

