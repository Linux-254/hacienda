import { calculateServerQuote } from '../../src/lib/cart';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }
    const quote = calculateServerQuote(items);
    return res.status(200).json(quote);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid order data';
    return res.status(400).json({ error: message });
  }
}
