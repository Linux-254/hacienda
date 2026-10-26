import { initiateStkPush } from '../../src/lib/mpesa-service';

export default async function handler(req: any, res: any) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    let body = req.body;
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch {
        body = {};
      }
    }

    const { phone, amount, accountReference, orderId } = body || {};

    if (!phone) {
      return res.status(400).json({ error: 'Phone number is required for M-Pesa' });
    }
    if (!amount || Number(amount) <= 0) {
      return res.status(400).json({ error: 'Valid amount is required' });
    }

    const result = await initiateStkPush({
      phone: String(phone),
      amount: Number(amount),
      accountReference: accountReference || 'Hacienda Bar',
      orderId: orderId || `HAC-${Date.now()}`,
    });

    return res.status(200).json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to initiate M-Pesa payment';
    console.error('STK Push API error:', err);
    return res.status(500).json({ error: message, success: false });
  }
}
