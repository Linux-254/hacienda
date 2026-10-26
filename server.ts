import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { calculateServerQuote } from './src/lib/cart.ts';
import { initiateStkPush, getStkStatus, confirmStkTransaction } from './src/lib/mpesa-service.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Authoritative server-side price calculation endpoint
  app.post('/api/order/quote', (req, res) => {
    try {
      const { items } = req.body;
      if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'Order must contain at least one item' });
      }
      const quote = calculateServerQuote(items);
      return res.json(quote);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid order data';
      return res.status(400).json({ error: message });
    }
  });

  // M-Pesa Daraja STK Push Initiation Endpoint
  app.post('/api/mpesa/stkpush', async (req, res) => {
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

      return res.json(result);
    } catch (err: unknown) {
      console.error('STK Push Error:', err);
      const message = err instanceof Error ? err.message : 'Failed to initiate M-Pesa payment';
      return res.status(500).json({ error: message });
    }
  });

  // Query M-Pesa STK Push status
  app.get('/api/mpesa/query/:checkoutRequestId', (req, res) => {
    const { checkoutRequestId } = req.params;
    const tx = getStkStatus(checkoutRequestId);
    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    return res.json(tx);
  });

  // Confirm/simulate M-Pesa PIN approval (for testing and demo purposes)
  app.post('/api/mpesa/confirm', (req, res) => {
    const { checkoutRequestId, receipt } = req.body;
    if (!checkoutRequestId) {
      return res.status(400).json({ error: 'checkoutRequestId is required' });
    }
    const confirmed = confirmStkTransaction(checkoutRequestId, receipt);
    return res.json({ success: true, transaction: confirmed });
  });

  // M-Pesa Webhook Callback
  app.post('/api/mpesa/callback', (req, res) => {
    try {
      const body = req.body;
      console.log('M-Pesa Webhook Callback received:', JSON.stringify(body));
      const stkCallback = body?.Body?.stkCallback;
      if (stkCallback) {
        const checkoutRequestId = stkCallback.CheckoutRequestID;
        const resultCode = stkCallback.ResultCode;
        if (resultCode === 0) {
          // Extract receipt from items
          const items = stkCallback.CallbackMetadata?.Item || [];
          const receiptItem = items.find((i: { Name: string }) => i.Name === 'MpesaReceiptNumber');
          const receipt = receiptItem?.Value || `QKH${Date.now()}`;
          confirmStkTransaction(checkoutRequestId, receipt);
        }
      }
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted' });
    } catch (e) {
      console.error('Error handling callback:', e);
      return res.json({ ResultCode: 0, ResultDesc: 'Accepted with warning' });
    }
  });

  // Health endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      venue: 'Hacienda Sports Bar & Grill',
      time: new Date().toISOString(),
      mpesaShortCode: '174379',
    });
  });

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Hacienda server listening on port ${PORT}`);
  });
}

startServer();
