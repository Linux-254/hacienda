import { getStkStatus } from '../../src/lib/mpesa-service';

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { checkoutRequestId } = req.query || {};
  if (!checkoutRequestId) {
    return res.status(400).json({ error: 'checkoutRequestId is required' });
  }

  const tx = getStkStatus(String(checkoutRequestId));
  if (!tx) {
    return res.status(404).json({ error: 'Transaction not found' });
  }

  return res.status(200).json(tx);
}
