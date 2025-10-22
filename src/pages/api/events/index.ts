import type { NextApiRequest, NextApiResponse } from 'next';
import { eq, and, gte } from 'drizzle-orm';
import { db } from '@/db/client';
import { events, identities, profiles } from '@/db/schema';
import { verifyToken, extractBearerToken, generateId } from '@/utils/auth';

type Event = {
  id: string;
  title: string;
  description: string | null;
  location: string;
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
    };
  };
  createdAt: Date;
};

type ResponseData = {
  success: boolean;
  events?: Event[];
  event?: Event;
  error?: string;
};

/**
 * GET /api/events - List events
 * POST /api/events - Create event (requires auth)
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === 'GET') {
    return handleGet(req, res);
  } else if (req.method === 'POST') {
    return handlePost(req, res);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    const { region, upcoming } = req.query;

    // Build conditions
    const conditions = [eq(events.isActive, true)];

    // Filter by region if provided
    if (region && typeof region === 'string') {
      conditions.push(eq(events.region, region));
    }

    // Filter by upcoming if provided
    if (upcoming === 'true') {
      const now = new Date();
      conditions.push(gte(events.startTime, now));
    }

    // Execute query with all conditions
    const eventsList = await db
      .select()
      .from(events)
      .where(and(...conditions));

    // Enrich with creator info
    const enrichedEvents = await Promise.all(
      eventsList.map(async (event) => {
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

        return {
          id: event.id,
          title: event.title,
          description: event.description,
          location: event.location,
          region: event.region,
          startTime: event.startTime,
          endTime: event.endTime,
          creator: {
            identity: identity ? {
              number: identity.number,
              fullNumber: `313#${identity.number}`,
            } : undefined,
            profile: profile ? {
              displayName: profile.displayName,
            } : undefined,
          },
          createdAt: event.createdAt,
        };
      })
    );

    return res.status(200).json({
      success: true,
      events: enrichedEvents,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch events',
    });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
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

    const {
      title,
      description,
      location,
      latitude,
      longitude,
      region,
      startTime,
      endTime,
    } = req.body;

    // Validate required fields
    if (!title || !location || !startTime) {
      return res.status(400).json({
        success: false,
        error: 'Title, location, and start time are required',
      });
    }

    // Create event
    const eventId = generateId('evt');
    await db.insert(events).values({
      id: eventId,
      title,
      description: description || null,
      location,
      latitude: latitude || null,
      longitude: longitude || null,
      region: region || null,
      startTime: new Date(startTime),
      endTime: endTime ? new Date(endTime) : null,
      creatorId: payload.userId,
      isActive: true,
    });

    // Fetch created event with creator info
    const [createdEvent] = await db
      .select()
      .from(events)
      .where(eq(events.id, eventId))
      .limit(1);

    const [identity] = await db
      .select()
      .from(identities)
      .where(eq(identities.userId, payload.userId))
      .limit(1);

    const [profile] = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, payload.userId))
      .limit(1);

    return res.status(201).json({
      success: true,
      event: {
        id: createdEvent.id,
        title: createdEvent.title,
        description: createdEvent.description,
        location: createdEvent.location,
        region: createdEvent.region,
        startTime: createdEvent.startTime,
        endTime: createdEvent.endTime,
        creator: {
          identity: identity ? {
            number: identity.number,
            fullNumber: `313#${identity.number}`,
          } : undefined,
          profile: profile ? {
            displayName: profile.displayName,
          } : undefined,
        },
        createdAt: createdEvent.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating event:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create event',
    });
  }
}

