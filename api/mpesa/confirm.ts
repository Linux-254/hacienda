import { confirmStkTransaction } from '../../src/lib/mpesa-service';

export default async function handler(req: any, res: any) {
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

    const { checkoutRequestId, receipt } = body || {};
    const confirmed = confirmStkTransaction(
      checkoutRequestId || `ws_CO_${Date.now()}`,
      receipt
    );

    return res.status(200).json({ success: true, transaction: confirmed });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Confirmation error';
    return res.status(500).json({ error: message, success: false });
  }
}
