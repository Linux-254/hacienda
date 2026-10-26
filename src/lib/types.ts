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

export type CustomerDetails = {
  name: string;
  phone: string;
  mode: OrderMode;
  table?: string;
  address?: string;
  notes?: string;
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
};
