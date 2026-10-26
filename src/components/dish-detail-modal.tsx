import React, { useState } from 'react';
import { X, Plus, Minus, Check, Utensils, ShoppingBag, Truck } from 'lucide-react';
import { formatKES, siteConfig, type MenuItem } from '@/config/site.config';
import { useCart } from '@/components/cart-provider';
import type { OrderMode } from '@/lib/types';

type DishDetailModalProps = {
  item: MenuItem | null;
  onClose: () => void;
};

export function DishDetailModal({ item, onClose }: DishDetailModalProps) {
  if (!item) return null;
  return <DishDetailDialog key={item.id} item={item} onClose={onClose} />;
}

function DishDetailDialog({
  item,
  onClose,
}: {
  item: MenuItem;
  onClose: () => void;
}) {
  const { addItem, diningMode, setDiningMode, table } = useCart();

  const [quantity, setQuantity] = useState(1);
  const [cookingStyle, setCookingStyle] = useState<string>(
    item.cookingStyles?.[0] || ''
  );
  const [selectedAddOns, setSelectedAddOns] = useState<
    Array<{ name: string; price: number }>
  >([]);
  const [note, setNote] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);

  const toggleAddOn = (addon: { name: string; price: number }) => {
    setSelectedAddOns((prev) => {
      const exists = prev.some((a) => a.name === addon.name);
      if (exists) {
        return prev.filter((a) => a.name !== addon.name);
      } else {
        return [...prev, addon];
      }
    });
  };

  const isAddOnSelected = (name: string) =>
    selectedAddOns.some((a) => a.name === name);

  const currentUnitTotal =
    (item.price ?? 0) + selectedAddOns.reduce((sum, a) => sum + a.price, 0);
  const totalPrice = currentUnitTotal * quantity;

  const handleAdd = () => {
    if (item.price === undefined) {
      onClose();
      return;
    }
    addItem(item, selectedAddOns, cookingStyle, note, quantity);
    setAddedNotice(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#0D0B09]/85 p-0 sm:p-4 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} customization`}
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-xl max-h-[88vh] sm:max-h-[85vh] rounded-t-xl sm:rounded-none border border-[#C9A24B]/35 bg-[#160E0A] text-[#F3E9D2] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header: Sticky Top with Close Button */}
        <div className="flex items-center justify-between border-b border-[#C9A24B]/20 bg-[#1A110D] px-5 py-3.5 sm:px-6">
          <div className="flex items-center gap-2">
            <span className="eyebrow">{item.category}</span>
            <span className="text-[#C9A24B]/40">·</span>
            <span className="font-mono text-xs font-semibold text-[#C9A24B]">
              {item.price ? formatKES(item.price) : item.priceLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-9 w-9 items-center justify-center border border-[#C9A24B]/25 text-[#C9A24B] transition hover:border-[#C9A24B] hover:bg-[#C9A24B]/10"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 sm:px-6 space-y-4">
          {/* Compact Top Dish Summary */}
          <div className="flex items-start gap-4 pb-3 border-b border-[#C9A24B]/15">
            <div className="relative h-20 w-20 sm:h-24 sm:w-24 shrink-0 overflow-hidden rounded border border-[#C9A24B]/25 bg-[#0D0B09]">
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-playfair text-lg sm:text-2xl font-medium text-[#F3E9D2] leading-snug">
                {item.name}
              </h2>
              <p className="mt-1 text-xs text-[#F3E9D2]/65 line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>

          {/* Dining Mode Quick Bar */}
          <div className="rounded border border-[#C9A24B]/20 bg-[#0D0B09]/70 p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                Dining Preference
              </span>
              {diningMode === 'table' && table && (
                <span className="text-[10px] font-mono text-[#C9A24B]">Table #{table}</span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: 'table', label: 'Dine-In', icon: Utensils },
                { id: 'pickup', label: 'Takeaway', icon: ShoppingBag },
                { id: 'delivery', label: 'Delivery', icon: Truck },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = diningMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setDiningMode(m.id as OrderMode)}
                    className={`flex items-center justify-center gap-1.5 py-1.5 px-2 text-[10px] font-semibold uppercase tracking-wider transition ${
                      isSelected
                        ? 'bg-[#C9A24B] text-[#0D0B09] font-bold'
                        : 'border border-[#C9A24B]/20 text-[#F3E9D2]/70 hover:border-[#C9A24B]/40'
                    }`}
                  >
                    <Icon size={12} />
                    <span>{m.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {item.price !== undefined ? (
            <>
              {/* Cooking Style Options */}
              {item.cookingStyles && item.cookingStyles.length > 0 && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B] mb-1.5">
                    1. Preparation Style
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {item.cookingStyles.map((style) => (
                      <button
                        key={style}
                        type="button"
                        onClick={() => setCookingStyle(style)}
                        className={`min-h-[38px] px-2.5 text-[11px] font-medium transition ${
                          cookingStyle === style
                            ? 'border border-[#C9A24B] bg-[#C9A24B] text-[#0D0B09] font-bold'
                            : 'border border-[#C9A24B]/20 bg-[#0D0B09]/40 text-[#F3E9D2]/70 hover:border-[#C9A24B]/40'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Accompaniments Chips */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                    2. Accompaniments (Optional)
                  </label>
                  <span className="text-[10px] text-[#F3E9D2]/45">Multi-select</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {siteConfig.addOns.accompaniments.map((acc) => {
                    const selected = isAddOnSelected(acc.name);
                    return (
                      <button
                        key={acc.name}
                        type="button"
                        onClick={() => toggleAddOn(acc)}
                        className={`flex items-center justify-between py-2 px-2.5 border text-left text-xs transition ${
                          selected
                            ? 'border-[#C9A24B] bg-[#C9A24B]/20 text-[#F3E9D2] font-medium'
                            : 'border-[#C9A24B]/15 bg-[#0D0B09]/30 text-[#F3E9D2]/65 hover:border-[#C9A24B]/35'
                        }`}
                      >
                        <span className="truncate pr-1">{acc.name}</span>
                        <span className="font-mono text-[10px] text-[#C9A24B] shrink-0">
                          +{acc.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Vegetables Chips */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                    3. Garden Greens & Veges
                  </label>
                  <span className="text-[10px] text-[#F3E9D2]/45">Optional</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5">
                  {siteConfig.addOns.vegetables.map((veg) => {
                    const selected = isAddOnSelected(veg.name);
                    return (
                      <button
                        key={veg.name}
                        type="button"
                        onClick={() => toggleAddOn(veg)}
                        className={`flex items-center justify-between py-2 px-2.5 border text-left text-xs transition ${
                          selected
                            ? 'border-[#C9A24B] bg-[#C9A24B]/20 text-[#F3E9D2] font-medium'
                            : 'border-[#C9A24B]/15 bg-[#0D0B09]/30 text-[#F3E9D2]/65 hover:border-[#C9A24B]/35'
                        }`}
                      >
                        <span className="truncate pr-1">{veg.name}</span>
                        <span className="font-mono text-[10px] text-[#C9A24B] shrink-0">
                          +{veg.price}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Kitchen Note */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B] mb-1">
                  Kitchen Note
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. Mild chili, lime on side"
                  className="input-hacienda text-xs min-h-[40px] py-1"
                />
              </div>
            </>
          ) : (
            <div className="border border-[#C9A24B]/25 bg-[#2B1A12]/30 p-4 text-xs text-[#F3E9D2]/80">
              <p className="font-semibold text-[#C9A24B]">
                Price Status: {item.priceLabel || 'Ask staff'}
              </p>
              <p className="mt-1 text-[#F3E9D2]/65">
                Prepared on order. Inquire with your server or dispatch via WhatsApp for today's market rates.
              </p>
            </div>
          )}
        </div>

        {/* Sticky Action Footer (Always Visible Without Scrolling!) */}
        <div className="border-t border-[#C9A24B]/25 bg-[#1A110D] px-5 py-3.5 sm:px-6">
          <div className="flex items-center justify-between gap-3">
            {/* Quantity Stepper */}
            {item.price !== undefined ? (
              <div className="flex items-center border border-[#C9A24B]/30 bg-[#0D0B09]">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                  className="flex h-10 w-9 items-center justify-center text-[#C9A24B] hover:bg-[#C9A24B]/10"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center font-mono text-sm font-semibold text-[#F3E9D2]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="flex h-10 w-9 items-center justify-center text-[#C9A24B] hover:bg-[#C9A24B]/10"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <span className="text-xs text-[#F3E9D2]/50">Seasonal Cut</span>
            )}

            {/* Main Action Button */}
            {item.price !== undefined ? (
              <button
                type="button"
                onClick={handleAdd}
                disabled={addedNotice}
                className="button-gold flex-1 min-h-[44px] text-xs font-bold"
              >
                {addedNotice ? (
                  <span className="inline-flex items-center gap-2">
                    <Check size={15} /> Added to Order
                  </span>
                ) : (
                  <span>Add · {formatKES(totalPrice)}</span>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="button-quiet flex-1 min-h-[44px] text-xs"
              >
                Close
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
