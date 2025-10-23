import type { NextApiRequest, NextApiResponse } from 'next';
import { db } from '@/db/client';
import { offerings } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { verifyToken } from '@/utils/auth';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ success: false, error: 'Invalid offering ID' });
  }

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  
  if (!decoded || !decoded.userId) {
    return res.status(401).json({ success: false, error: 'Invalid token' });
  }

  // GET - Get single offering
  if (req.method === 'GET') {
    try {
      const offering = await db
        .select()
        .from(offerings)
        .where(and(
          eq(offerings.id, id),
          eq(offerings.userId, decoded.userId)
        ))
        .limit(1);

      if (offering.length === 0) {
        return res.status(404).json({ success: false, error: 'Offering not found' });
      }

      return res.status(200).json({
        success: true,
        offering: offering[0],
      });
    } catch (error) {
      console.error('Error fetching offering:', error);
      return res.status(500).json({ success: false, error: 'Failed to fetch offering' });
    }
  }

  // PATCH - Update offering
  if (req.method === 'PATCH') {
    try {
      const { title, description, category, price, contactEmail, contactPhone, imageUrl, isActive } = req.body;

      const updateData: any = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (category !== undefined) updateData.category = category;
      if (price !== undefined) updateData.price = price;
      if (contactEmail !== undefined) updateData.contactEmail = contactEmail;
      if (contactPhone !== undefined) updateData.contactPhone = contactPhone;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (isActive !== undefined) updateData.isActive = isActive;
      updateData.updatedAt = new Date();

      await db
        .update(offerings)
        .set(updateData)
        .where(and(
          eq(offerings.id, id),
          eq(offerings.userId, decoded.userId)
        ));

      const updated = await db
        .select()
        .from(offerings)
        .where(eq(offerings.id, id))
        .limit(1);

      return res.status(200).json({
        success: true,
        offering: updated[0],
      });
    } catch (error) {
      console.error('Error updating offering:', error);
      return res.status(500).json({ success: false, error: 'Failed to update offering' });
    }
  }

  // DELETE - Delete offering
  if (req.method === 'DELETE') {
    try {
      await db
        .delete(offerings)
        .where(and(
          eq(offerings.id, id),
          eq(offerings.userId, decoded.userId)
        ));

      return res.status(200).json({
        success: true,
        message: 'Offering deleted',
      });
    } catch (error) {
      console.error('Error deleting offering:', error);
      return res.status(500).json({ success: false, error: 'Failed to delete offering' });
    }
  }

  return res.status(405).json({ success: false, error: 'Method not allowed' });
}

