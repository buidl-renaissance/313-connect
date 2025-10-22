import type { NextApiRequest, NextApiResponse } from 'next';
import { eq } from 'drizzle-orm';
import { db } from '@/db/client';
import { identities } from '@/db/schema';

type ResponseData = {
  available: boolean;
  message: string;
  number?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      available: false,
      message: 'Method not allowed',
    });
  }

  const { number } = req.body;

  if (!number) {
    return res.status(400).json({
      available: false,
      message: 'Number is required',
    });
  }

  // Validate number format (only digits, 1-6 characters)
  const numberStr = String(number);
  if (!/^\d{1,6}$/.test(numberStr)) {
    return res.status(400).json({
      available: false,
      message: 'Invalid number format. Use 1-6 digits only.',
    });
  }

  try {
    // Check if number exists in database
    const [existingIdentity] = await db
      .select()
      .from(identities)
      .where(eq(identities.number, numberStr))
      .limit(1);

    const fullNumber = `313#${numberStr}`;
    const isAvailable = !existingIdentity;

    if (isAvailable) {
      return res.status(200).json({
        available: true,
        message: `✨ ${fullNumber} is available!`,
        number: fullNumber,
      });
    } else {
      return res.status(200).json({
        available: false,
        message: `❌ ${fullNumber} is already claimed. Try another number.`,
        number: fullNumber,
      });
    }
  } catch (error) {
    console.error('Error checking availability:', error);
    return res.status(500).json({
      available: false,
      message: 'Error checking availability',
    });
  }
}
