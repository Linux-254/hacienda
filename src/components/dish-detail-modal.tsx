import React, { useState } from 'react';
import { X, Plus, Minus, Check } from 'lucide-react';
import { formatKES, siteConfig, type MenuItem } from '@/config/site.config';
import { DishVisual } from '@/components/dish-visual';
import { useCart } from '@/components/cart-provider';

type DishDetailModalProps = {
  item: MenuItem | null;
  onClose: () => void;
};

export function DishDetailModal({ item, onClose }: DishDetailModalProps) {
  const { addItem } = useCart();

  if (!item) return null;

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
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0B09]/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${item.name} details`}
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-xl overflow-y-auto border border-[#C9A24B]/35 bg-[#17100B] p-6 text-[#F3E9D2] shadow-2xl sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#C9A24B]/20 pb-4">
          <div>
            <span className="eyebrow">{item.category}</span>
            <h2 className="font-playfair mt-1 text-2xl sm:text-3xl font-medium text-[#F3E9D2]">
              {item.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="flex h-10 w-10 items-center justify-center border border-[#C9A24B]/25 text-[#C9A24B] transition hover:border-[#C9A24B] hover:bg-[#C9A24B]/10"
          >
            <X size={18} />
          </button>
        </div>

        {/* Dish Visual */}
        <div className="my-5">
          <DishVisual
            src={item.image}
            alt={`${item.name} illustrative food visual`}
            label={item.name}
            size="medium"
          />
        </div>

        {/* Description */}
        <p className="text-sm leading-relaxed text-[#F3E9D2]/75">
          {item.description}
        </p>

        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="border border-[#C9A24B]/25 bg-[#2B1A12]/40 px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#C9A24B]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Customization Options (if priced item) */}
        {item.price !== undefined ? (
          <div className="mt-6 space-y-6 border-t border-[#C9A24B]/20 pt-6">
            {/* Cooking Style Selection */}
            {item.cookingStyles && item.cookingStyles.length > 0 && (
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                  Select Preparation Style:
                </label>
                <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {item.cookingStyles.map((style) => (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setCookingStyle(style)}
                      className={`min-h-[42px] border px-3 text-xs font-medium uppercase tracking-wider transition ${
                        cookingStyle === style
                          ? 'border-[#C9A24B] bg-[#C9A24B] text-[#0D0B09] font-bold'
                          : 'border-[#C9A24B]/20 bg-[#0D0B09]/50 text-[#F3E9D2]/70 hover:border-[#C9A24B]/50'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Accompaniments (Optional) */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                  Add Accompaniments (Optional):
                </label>
                <span className="text-[10px] text-[#F3E9D2]/45">Multi-select</span>
              </div>
              <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {siteConfig.addOns.accompaniments.map((acc) => {
                  const selected = isAddOnSelected(acc.name);
                  return (
                    <button
                      key={acc.name}
                      type="button"
                      onClick={() => toggleAddOn(acc)}
                      className={`flex min-h-[42px] items-center justify-between border px-3 text-left transition ${
                        selected
                          ? 'border-[#C9A24B] bg-[#C9A24B]/15 text-[#F3E9D2]'
                          : 'border-[#C9A24B]/20 bg-[#0D0B09]/40 text-[#F3E9D2]/70 hover:border-[#C9A24B]/40'
                      }`}
                    >
                      <span className="text-xs font-medium">{acc.name}</span>
                      <span className="font-mono text-[11px] text-[#C9A24B]">
                        +{formatKES(acc.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Vegetables */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                  Garden Greens & Vegetables:
                </label>
                <span className="text-[10px] text-[#F3E9D2]/45">Multi-select</span>
              </div>
              <div className="mt-2.5 grid grid-cols-2 gap-2">
                {siteConfig.addOns.vegetables.map((veg) => {
                  const selected = isAddOnSelected(veg.name);
                  return (
                    <button
                      key={veg.name}
                      type="button"
                      onClick={() => toggleAddOn(veg)}
                      className={`flex min-h-[42px] items-center justify-between border px-3 text-left transition ${
                        selected
                          ? 'border-[#C9A24B] bg-[#C9A24B]/15 text-[#F3E9D2]'
                          : 'border-[#C9A24B]/20 bg-[#0D0B09]/40 text-[#F3E9D2]/70 hover:border-[#C9A24B]/40'
                      }`}
                    >
                      <span className="text-xs font-medium">{veg.name}</span>
                      <span className="font-mono text-[11px] text-[#C9A24B]">
                        +{formatKES(veg.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Preparation Notes */}
            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                Kitchen Notes & Preferences:
              </label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Mild chili, extra lemon, well-done"
                className="input-hacienda mt-2 text-xs"
              />
            </div>

            {/* Quantity & Add Action */}
            <div className="border-t border-[#C9A24B]/20 pt-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                  <span className="mr-2 text-xs uppercase tracking-wider text-[#F3E9D2]/60">
                    Quantity:
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-10 w-10 items-center justify-center border border-[#C9A24B]/30 text-[#C9A24B] hover:border-[#C9A24B]"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="w-10 text-center font-mono text-base font-semibold">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase quantity"
                    className="flex h-10 w-10 items-center justify-center border border-[#C9A24B]/30 text-[#C9A24B] hover:border-[#C9A24B]"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                {/* Submit button */}
                <button
                  type="button"
                  onClick={handleAdd}
                  disabled={addedNotice}
                  className="button-gold min-h-[48px] flex-1 sm:flex-initial"
                >
                  {addedNotice ? (
                    <span className="inline-flex items-center gap-2">
                      <Check size={16} /> Added to Order
                    </span>
                  ) : (
                    <span>Add to Order · {formatKES(totalPrice)}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 border-t border-[#C9A24B]/20 pt-6">
            <div className="rounded border border-[#C9A24B]/25 bg-[#2B1A12]/40 p-4 text-xs text-[#F3E9D2]/80">
              <p className="font-semibold text-[#C9A24B]">
                Price Status: {item.priceLabel || 'Ask Staff'}
              </p>
              <p className="mt-1 text-[#F3E9D2]/60">
                This item is prepared daily to order. Please consult your server or include in your WhatsApp inquiry for today's market price and availability.
              </p>
            </div>
            <div className="mt-5 text-right">
              <button
                type="button"
                onClick={onClose}
                className="button-quiet text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
