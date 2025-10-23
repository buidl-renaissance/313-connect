import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db/client';
import { offerings } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { verifyToken } from '@/utils/auth';
import { nanoid } from 'nanoid';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET - List user's offerings
  if (req.method === 'GET') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }

      const userOfferings = await db
        .select()
        .from(offerings)
        .where(eq(offerings.userId, decoded.userId))
        .orderBy(desc(offerings.createdAt));

      return res.status(200).json({
        success: true,
        offerings: userOfferings,
      });
    } catch (error) {
      console.error('Error fetching offerings:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch offerings' });
    }
  }

  // POST - Create new offering
  if (req.method === 'POST') {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ success: false, error: 'Unauthorized' });
      }

      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);
      
      if (!decoded || !decoded.userId) {
        return res.status(401).json({ success: false, error: 'Invalid token' });
      }

      const { title, description, category, price, contactEmail, contactPhone, imageUrl } = req.body;

      if (!title || !category) {
        return res.status(400).json({ 
          success: false, 
          error: 'Title and category are required' 
        });
      }

      const newOffering = {
        id: nanoid(),
        userId: decoded.userId,
        title,
        description: description || null,
        category,
        price: price || null,
        contactEmail: contactEmail || null,
        contactPhone: contactPhone || null,
        imageUrl: imageUrl || null,
        isActive: true,
      };

      await db.insert(offerings).values(newOffering);

      return res.status(201).json({
        success: true,
        offering: newOffering,
      });
    } catch (error) {
      console.error('Error creating offering:', error);
      return res.status(500).json({ success: false, error: 'Failed to create offering' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

