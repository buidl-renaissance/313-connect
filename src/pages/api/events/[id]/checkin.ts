import type { NextApiRequest, NextApiResponse } from 'next';
import { eq, and } from 'drizzle-orm';
import { db } from '@/db/client';
import { checkins, events } from '@/db/schema';
import { verifyToken, extractBearerToken, generateId } from '@/utils/auth';

type ResponseData = {
  success: boolean;
  checkin?: {
    id: string;
    eventId: string;
    timestamp: Date;
    verified: boolean;
  };
  error?: string;
};

/**
 * POST /api/events/[id]/checkin - Check in to an event
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    // Verify authentication
    const token = extractBearerToken(req.headers.authorization);
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
      });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const { id } = req.query;
    const { latitude, longitude } = req.body;

    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Invalid event ID',
      });
    }

    // Verify event exists
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

    // Check if user already checked in
    const [existingCheckin] = await db
      .select()
      .from(checkins)
      .where(
        and(
          eq(checkins.userId, payload.userId),
          eq(checkins.eventId, id)
        )
      )
      .limit(1);

    if (existingCheckin) {
      return res.status(409).json({
        success: false,
        error: 'Already checked in to this event',
      });
    }

    // Create check-in
    const checkinId = generateId('chk');
    const verified = false; // Location verification would happen here in production

    await db.insert(checkins).values({
      id: checkinId,
      userId: payload.userId,
      eventId: id,
      latitude: latitude || null,
      longitude: longitude || null,
      verified,
    });

    return res.status(201).json({
      success: true,
      checkin: {
        id: checkinId,
        eventId: id,
        timestamp: new Date(),
        verified,
      },
    });
  } catch (error) {
    console.error('Error checking in:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to check in',
    });
  }
}

