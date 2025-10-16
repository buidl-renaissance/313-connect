import type { NextApiRequest, NextApiResponse } from 'next';
import { eq, and, or } from 'drizzle-orm';
import { db } from '@/db/client';
import { connections } from '@/db/schema';
import { verifyToken, extractBearerToken } from '@/utils/auth';

type ResponseData = {
  success: boolean;
  connection?: {
    id: string;
    status: string;
    verifiedAt: Date;
  };
  error?: string;
};

/**
 * POST /api/connections/verify
 * Verify/accept a connection request
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

    const { connectionId, action } = req.body;

    if (!connectionId || !action) {
      return res.status(400).json({
        success: false,
        error: 'Connection ID and action are required',
      });
    }

    if (!['accept', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid action. Must be "accept" or "reject"',
      });
    }

    // Find the connection
    const [connection] = await db
      .select()
      .from(connections)
      .where(eq(connections.id, connectionId))
      .limit(1);

    if (!connection) {
      return res.status(404).json({
        success: false,
        error: 'Connection not found',
      });
    }

    // Verify that the user is the recipient of the connection request
    if (connection.toUserId !== payload.userId) {
      return res.status(403).json({
        success: false,
        error: 'You are not authorized to verify this connection',
      });
    }

    // Update connection status
    const now = new Date();
    const newStatus = action === 'accept' ? 'accepted' : 'rejected';
    
    await db
      .update(connections)
      .set({
        status: newStatus,
        verifiedAt: action === 'accept' ? now : null,
      })
      .where(eq(connections.id, connectionId));

    return res.status(200).json({
      success: true,
      connection: {
        id: connectionId,
        status: newStatus,
        verifiedAt: action === 'accept' ? now : new Date(0),
      },
    });
  } catch (error) {
    console.error('Error verifying connection:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to verify connection',
    });
  }
}

