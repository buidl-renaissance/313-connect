import type { NextApiRequest, NextApiResponse } from 'next';
import { eq, or, and } from 'drizzle-orm';
import { db } from '@/db/client';
import { connections, identities, profiles } from '@/db/schema';
import { verifyToken, extractBearerToken, generateId } from '@/utils/auth';

type ResponseData = {
  success: boolean;
  connections?: Array<{
    id: string;
    userId: string;
    identity?: {
      number: string;
      fullNumber: string;
    };
    profile?: {
      displayName: string | null;
      region: string | null;
    };
    connectionType: string;
    status: string;
    createdAt: Date;
  }>;
  error?: string;
};

/**
 * GET /api/connections - List user's connections
 * POST /api/connections - Request new connection
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
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

  if (req.method === 'GET') {
    return handleGet(req, res, payload.userId);
  } else if (req.method === 'POST') {
    return handlePost(req, res, payload.userId);
  } else {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }
}

async function handleGet(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
  userId: string
) {
  try {
    // Get all connections where user is either fromUser or toUser
    const userConnections = await db
      .select()
      .from(connections)
      .where(
        or(
          eq(connections.fromUserId, userId),
          eq(connections.toUserId, userId)
        )
      );

    // For each connection, get the other user's identity and profile
    const enrichedConnections = await Promise.all(
      userConnections.map(async (conn) => {
        const otherUserId = conn.fromUserId === userId ? conn.toUserId : conn.fromUserId;

        const [identity] = await db
          .select()
          .from(identities)
          .where(eq(identities.userId, otherUserId))
          .limit(1);

        const [profile] = await db
          .select()
          .from(profiles)
          .where(eq(profiles.userId, otherUserId))
          .limit(1);

        return {
          id: conn.id,
          userId: otherUserId,
          identity: identity ? {
            number: identity.number,
            fullNumber: `313${identity.number}`,
          } : undefined,
          profile: profile ? {
            displayName: profile.displayName,
            region: profile.region,
          } : undefined,
          connectionType: conn.connectionType,
          status: conn.status,
          createdAt: conn.createdAt,
        };
      })
    );

    return res.status(200).json({
      success: true,
      connections: enrichedConnections,
    });
  } catch (error) {
    console.error('Error fetching connections:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch connections',
    });
  }
}

async function handlePost(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
  userId: string
) {
  try {
    const { targetUserId } = req.body;

    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        error: 'Target user ID is required',
      });
    }

    if (targetUserId === userId) {
      return res.status(400).json({
        success: false,
        error: 'Cannot connect to yourself',
      });
    }

    // Check if connection already exists
    const [existingConnection] = await db
      .select()
      .from(connections)
      .where(
        or(
          and(
            eq(connections.fromUserId, userId),
            eq(connections.toUserId, targetUserId)
          ),
          and(
            eq(connections.fromUserId, targetUserId),
            eq(connections.toUserId, userId)
          )
        )
      )
      .limit(1);

    if (existingConnection) {
      return res.status(409).json({
        success: false,
        error: 'Connection already exists',
      });
    }

    // Create new connection
    const connectionId = generateId('conn');
    await db.insert(connections).values({
      id: connectionId,
      fromUserId: userId,
      toUserId: targetUserId,
      connectionType: 'peer',
      status: 'pending',
    });

    return res.status(201).json({
      success: true,
      connections: [],
    });
  } catch (error) {
    console.error('Error creating connection:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to create connection',
    });
  }
}

