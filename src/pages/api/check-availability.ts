import type { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  available: boolean;
  message: string;
  number?: string;
};

// In a production app, this would check against a database
// For now, we'll simulate with a simple in-memory set of claimed numbers
const claimedNumbers = new Set([
  '3131',
  '313',
  '31313',
  '1234',
  '5678',
]);

export default function handler(
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

  // Check if number is already claimed
  const isAvailable = !claimedNumbers.has(numberStr);
  const fullNumber = `313${numberStr}`;

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
}
