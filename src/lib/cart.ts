import type { CartLine } from '@/lib/types';
import { siteConfig } from '@/config/site.config';

export type CartAction =
  | { type: 'add'; line: CartLine }
  | { type: 'decrement'; lineId: string }
  | { type: 'remove'; lineId: string }
  | { type: 'clear' }
  | { type: 'hydrate'; lines: CartLine[] };

export const cartReducer = (state: CartLine[], action: CartAction): CartLine[] => {
  switch (action.type) {
    case 'hydrate':
      return action.lines;
    case 'clear':
      return [];
    case 'remove':
      return state.filter((line) => line.lineId !== action.lineId);
    case 'decrement':
      return state.flatMap((line) =>
        line.lineId === action.lineId
          ? line.quantity > 1
            ? [{ ...line, quantity: line.quantity - 1 }]
            : []
          : [line]
      );
    case 'add': {
      const match = state.find((line) => line.lineId === action.line.lineId);
      if (match) {
        return state.map((line) =>
          line.lineId === match.lineId
            ? { ...line, quantity: line.quantity + action.line.quantity }
            : line
        );
      }
      return [...state, action.line];
    }
    default:
      return state;
  }
};

export const getLineTotal = (line: CartLine) => {
  const itemPrice = line.item.price ?? 0;
  const addOnsTotal = (line.addOns || []).reduce((sum, addOn) => sum + addOn.price, 0);
  return (itemPrice + addOnsTotal) * line.quantity;
};

export const cartTotal = (lines: CartLine[]) =>
  lines.reduce((sum, line) => sum + getLineTotal(line), 0);

export const makeLineId = (
  itemId: string,
  addOns: { name: string; price: number }[] = [],
  cookingStyle = '',
  note = ''
) => {
  const sortedAddOns = addOns.map((a) => a.name).sort().join(',');
  return [itemId, cookingStyle, sortedAddOns, note.trim()].filter(Boolean).join('::');
};

/**
 * Server-side / Authoritative price calculation function.
 * Ensures the client NEVER dictates price totals.
 */
export const calculateServerQuote = (
  items: Array<{ itemId: string; quantity: number; addOns?: { name: string; price: number }[]; cookingStyle?: string }>
) => {
  const orderId = `HAC-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;

  const lines = items.map((input) => {
    const catalogItem = siteConfig.menu.find((m) => m.id === input.itemId);
    if (!catalogItem) {
      throw new Error(`Item ${input.itemId} not found in authoritative menu catalog`);
    }

    const verifiedAddOns = (input.addOns || []).map((addon) => {
      const allAllowedAddOns = [
        ...siteConfig.addOns.accompaniments,
        ...siteConfig.addOns.vegetables,
      ];
      const match = allAllowedAddOns.find((a) => a.name === addon.name);
      return {
        name: addon.name,
        price: match ? match.price : 0,
      };
    });

    const itemPrice = catalogItem.price ?? 0;
    const addOnsTotal = verifiedAddOns.reduce((sum, a) => sum + a.price, 0);
    const lineTotal = (itemPrice + addOnsTotal) * Math.max(1, input.quantity);

    const lineId = makeLineId(catalogItem.id, verifiedAddOns, input.cookingStyle || '');

    return {
      lineId,
      itemId: catalogItem.id,
      item: catalogItem,
      quantity: Math.max(1, input.quantity),
      addOns: verifiedAddOns,
      cookingStyle: input.cookingStyle,
      lineTotal,
    };
  });

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const total = subtotal;

  return {
    orderId,
    lines,
    subtotal,
    total,
    calculatedAt: new Date().toISOString(),
  };
};
