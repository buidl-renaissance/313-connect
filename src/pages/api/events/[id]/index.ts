import type { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { events, identities, profiles } from '@/db/schema';

type ResponseData = {
  success: boolean;
  event?: {
    id: string;
    title: string;
    description: string | null;
    location: string;
    latitude: string | null;
    longitude: string | null;
    region: string | null;
    startTime: Date;
    endTime: Date | null;
    creator: {
      identity?: {
        number: string;
        fullNumber: string;
      };
      profile?: {
        displayName: string | null;
        region: string | null;
      };
    };
    createdAt: Date;
  };
  error?: string;
};

/**
 * GET /api/events/[id] - Get event details
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { id } = req.query;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID',
      });
    }

    const [event] = await db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: 'Event not found',
      });
    }

    // Get creator info
    const [identity] = await db
      .select()
      .from(identities)
      .where(eq(identities.userId, event.creatorId))
      .limit(1);

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, event.creatorId))
      .limit(1);

    return res.status(200).json({
      success: true,
      event: {
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location,
        latitude: event.latitude,
        longitude: event.longitude,
        region: event.region,
        startTime: event.startTime,
        endTime: event.endTime,
        creator: {
          identity: identity ? {
            number: identity.number,
            fullNumber: `313${identity.number}`,
          } : undefined,
          profile: profile ? {
            displayName: profile.displayName,
            region: profile.region,
          } : undefined,
        },
        createdAt: event.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch event',
    });
  }
}

