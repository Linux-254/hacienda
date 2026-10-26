import { initiateStkPush } from '../../src/lib/mpesa-service';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { phone, amount, accountReference, orderId } = req.body;

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
    return res.status(500).json({ error: message });
  }
}
