import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db/client';
import { liveLocations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyToken } from '@/utils/auth';
import { nanoid } from 'nanoid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded || !decoded.userId) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }

  // POST - Go live with location
  if (req.method === 'POST') {
    try {
      const { latitude, longitude, currentOffering, visibilityMode = 'all' } = req.body;

      if (!latitude || !longitude) {
        return res.status(400).json({ 
          success: false, 
          error: 'Latitude and longitude are required' 
        });
      }

      // Check if user is already live
      const existing = await db
        .select()
        .from(liveLocations)
        .where(eq(liveLocations.userId, decoded.userId))
        .limit(1);

      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + 4); // Live for 4 hours by default

      if (existing.length > 0) {
        // Update existing location
        await db
          .update(liveLocations)
          .set({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            currentOffering: currentOffering || null,
            visibilityMode,
            lastUpdated: new Date(),
            expiresAt,
          })
          .where(eq(liveLocations.userId, decoded.userId));
      } else {
        // Create new location
        await db.insert(liveLocations).values({
          id: nanoid(),
          userId: decoded.userId,
          latitude: latitude.toString(),
          longitude: longitude.toString(),
          currentOffering: currentOffering || null,
          isVisible: true,
          visibilityMode,
          expiresAt,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Location updated',
        expiresAt,
      });
    } catch (error) {
      console.error('Error going live:', error);
      return res.status(500).json({ success: false, error: 'Failed to update location' });
    }
  }

  // DELETE - Stop being live
  if (req.method === 'DELETE') {
    try {
      await db
        .delete(liveLocations)
        .where(eq(liveLocations.userId, decoded.userId));

      return res.status(200).json({
        success: true,
        message: 'Stopped being live',
      });
    } catch (error) {
      console.error('Error stopping live:', error);
      return res.status(500).json({ success: false, error: 'Failed to stop being live' });
    }
  }

  // GET - Check if user is currently live
  if (req.method === 'GET') {
    try {
      const liveStatus = await db
        .select()
        .from(liveLocations)
        .where(eq(liveLocations.userId, decoded.userId))
        .limit(1);

      if (liveStatus.length === 0) {
        return res.status(200).json({
          success: true,
          isLive: false,
        });
      }

      const location = liveStatus[0];
      const now = new Date();
      const expired = new Date(location.expiresAt) < now;

      if (expired) {
        // Clean up expired location
        await db
          .delete(liveLocations)
          .where(eq(liveLocations.userId, decoded.userId));

        return res.status(200).json({
          success: true,
          isLive: false,
        });
      }

      return res.status(200).json({
        success: true,
        isLive: true,
        location,
      });
    } catch (error) {
      console.error('Error checking live status:', error);
      return res.status(500).json({ success: false, error: 'Failed to check status' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

