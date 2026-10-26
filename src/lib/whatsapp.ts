import { formatKES, siteConfig } from '@/config/site.config';
import type { CustomerDetails, Quote } from '@/lib/types';

export const makeOrderId = () =>
  `HAC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

export const formatWhatsAppMessage = (quote: Quote, details: CustomerDetails) => {
  const destination =
    details.mode === 'table'
      ? `TABLE: ${details.table ? `Table ${details.table}` : 'At table (specify to server)'}`
      : details.mode === 'pickup'
      ? 'ORDER TYPE: Pickup / Takeaway'
      : `ORDER TYPE: Delivery — Address: ${details.address || 'Address to be confirmed'}`;

  const itemLines = quote.lines
    .map((line) => {
      const extras = [
        line.cookingStyle ? `Style: ${line.cookingStyle}` : '',
        ...line.addOns.map((addon) => addon.name),
      ]
        .filter(Boolean)
        .join(', ');

      const extrasLabel = extras ? ` (${extras})` : '';
      const noteLabel = line.note ? `\n   Note: "${line.note}"` : '';

      return `• ${line.quantity}× ${line.item.name}${extrasLabel} — ${formatKES(line.lineTotal)}${noteLabel}`;
    })
    .join('\n');

  const lines = [
    `*${siteConfig.name.toUpperCase()}*`,
    `*ORDER #${quote.orderId}*`,
    '────────────────────',
    destination,
    '',
    '*ITEMS ORDERED:*',
    itemLines,
    '',
    '────────────────────',
    `*TOTAL: ${formatKES(quote.total)}*`,
    '────────────────────',
    `*Guest Name:* ${details.name}`,
    `*Phone:* ${details.phone}`,
    details.notes ? `*Special Request:* ${details.notes}` : '',
    '',
    '• Payment: Pay at table / on delivery (Cash, M-Pesa, Card)',
    '• Time placed: ' + new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' }),
    '────────────────────',
    'Thank you for dining with Hacienda Sports Bar & Grill.',
  ];

  return lines.filter(Boolean).join('\n');
};

export const makeWhatsAppUrl = (number: string, message: string) =>
  `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
