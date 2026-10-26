import type { MenuItem } from '@/config/site.config';

export type CartLine = {
  lineId: string;
  itemId: string;
  item: MenuItem;
  quantity: number;
  addOns: { name: string; price: number }[];
  cookingStyle?: string;
  note?: string;
};

export type OrderMode = 'table' | 'pickup' | 'delivery';

export type PaymentMethod = 'mpesa' | 'pay_at_table';
export type PaymentStatus = 'unpaid' | 'pending' | 'completed' | 'failed';

export type CustomerDetails = {
  name: string;
  phone: string;
  mode: OrderMode;
  table?: string;
  address?: string;
  notes?: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  mpesaReceipt?: string;
};

export type QuoteItem = {
  itemId: string;
  quantity: number;
  addOns?: { name: string; price: number }[];
  cookingStyle?: string;
};

export type Quote = {
  orderId: string;
  lines: Array<CartLine & { lineTotal: number }>;
  subtotal: number;
  total: number;
  calculatedAt: string;
  paymentMethod?: PaymentMethod;
  paymentStatus?: PaymentStatus;
  mpesaReceipt?: string;
};

export type MpesaSTKResponse = {
  success: boolean;
  checkoutRequestId?: string;
  merchantRequestId?: string;
  customerMessage?: string;
  responseCode?: string;
  responseDescription?: string;
  isSandbox?: boolean;
  error?: string;
};

