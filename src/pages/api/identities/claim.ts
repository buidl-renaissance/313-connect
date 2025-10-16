import type { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { identities, users } from '@/db/schema';
import { verifyToken, extractBearerToken, generateId } from '@/utils/auth';

type ResponseData = {
  success: boolean;
  identity?: {
    id: string;
    number: string;
    fullNumber: string;
  };
  error?: string;
};

/**
 * POST /api/identities/claim
 * Claim a 313 number (requires authentication)
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

    const { number } = req.body;

    if (!number) {
      return res.status(400).json({
        success: false,
        error: 'Number is required',
      });
    }

    // Validate number format (only digits, 1-6 characters)
    const numberStr = String(number);
    if (!/^\d{1,6}$/.test(numberStr)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid number format. Use 1-6 digits only.',
      });
    }

    // Check if user already has an active identity
    const [existingIdentity] = await db
      .select()
      .from(identities)
      .where(eq(identities.userId, payload.userId))
      .limit(1);

    if (existingIdentity && existingIdentity.isActive) {
      return res.status(400).json({
        success: false,
        error: 'You already have an active identity',
      });
    }

    // Check if number is available
    const [takenIdentity] = await db
      .select()
      .from(identities)
      .where(eq(identities.number, numberStr))
      .limit(1);

    if (takenIdentity) {
      return res.status(409).json({
        success: false,
        error: `313${numberStr} is already claimed`,
      });
    }

    // Verify user exists
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // Claim the number
    const identityId = generateId('id');
    await db.insert(identities).values({
      id: identityId,
      userId: payload.userId,
      number: numberStr,
      isActive: true,
    });

    return res.status(201).json({
      success: true,
      identity: {
        id: identityId,
        number: numberStr,
        fullNumber: `313${numberStr}`,
      },
    });
  } catch (error) {
    console.error('Error claiming identity:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to claim identity',
    });
  }
}

