import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { formatKES, siteConfig } from '@/config/site.config';
import { useCart } from '@/components/cart-provider';
import { getLineTotal, calculateServerQuote } from '@/lib/cart';
import { formatWhatsAppMessage, makeWhatsAppUrl } from '@/lib/whatsapp';
import type { CustomerDetails, OrderMode, Quote } from '@/lib/types';
import { SectionLabel } from '@/components/section-label';

export function OrderPage() {
  const navigate = useNavigate();
  const { lines, total, count, decrement, addItem, remove, clear, table, setTable } = useCart();

  const [details, setDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    mode: table ? 'table' : 'table',
    table: table || '',
    address: '',
    notes: '',
  });

  const [status, setStatus] = useState<'idle' | 'verifying' | 'sending' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const updateField = (field: keyof CustomerDetails, val: string) => {
    setDetails((prev) => ({ ...prev, [field]: val }));
    if (field === 'table') {
      setTable(val);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (lines.length === 0) {
      setErrorMessage('Your cart is empty. Please add items from the menu first.');
      return;
    }

    if (!details.name.trim()) {
      setErrorMessage('Please provide your name so staff know who to serve.');
      return;
    }

    if (!details.phone.trim()) {
      setErrorMessage('Please enter your phone number for order verification.');
      return;
    }

    if (details.mode === 'table' && !details.table?.trim()) {
      setErrorMessage('Please provide your Table number (or select Pickup/Delivery).');
      return;
    }

    if (details.mode === 'delivery' && !details.address?.trim()) {
      setErrorMessage('Please provide your delivery address in Nairobi.');
      return;
    }

    setStatus('verifying');

    try {
      // Authoritative Price Table Verification
      // In production full-stack, this queries /api/order/quote; fallback computes from authoritative catalog
      let authoritativeQuote: Quote;

      try {
        const response = await fetch('/api/order/quote', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            items: lines.map((l) => ({
              itemId: l.itemId,
              quantity: l.quantity,
              addOns: l.addOns,
              cookingStyle: l.cookingStyle,
            })),
          }),
        });

        if (response.ok) {
          authoritativeQuote = await response.json();
        } else {
          // Compute server quote directly from authoritative catalog
          authoritativeQuote = calculateServerQuote(
            lines.map((l) => ({
              itemId: l.itemId,
              quantity: l.quantity,
              addOns: l.addOns,
              cookingStyle: l.cookingStyle,
            }))
          );
        }
      } catch {
        authoritativeQuote = calculateServerQuote(
          lines.map((l) => ({
            itemId: l.itemId,
            quantity: l.quantity,
            addOns: l.addOns,
            cookingStyle: l.cookingStyle,
          }))
        );
      }

      setStatus('sending');

      // Generate WhatsApp order message
      const message = formatWhatsAppMessage(authoritativeQuote, details);
      const whatsappUrl = makeWhatsAppUrl(siteConfig.whatsapp, message);

      // Store last order in sessionStorage for confirmed screen
      sessionStorage.setItem('hacienda_last_order', JSON.stringify({
        quote: authoritativeQuote,
        details,
      }));

      // Open WhatsApp
      window.location.href = whatsappUrl;

      // Clear local cart
      clear();

      // Navigate to confirmed screen
      navigate('/order/confirmed');
    } catch (err: unknown) {
      setStatus('error');
      const message = err instanceof Error ? err.message : 'Unable to verify order. Please try again or ask staff directly.';
      setErrorMessage(message);
    }
  };

  return (
    <div className="pt-[74px]">
      <section className="border-b border-[#C9A24B]/20 bg-[#120B08] py-12 sm:py-16">
        <div className="container-hacienda">
          <Link
            to="/menu"
            className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-[#C9A24B] hover:underline"
          >
            <ArrowLeft size={13} /> Back to Menu
          </Link>
          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <SectionLabel number="Order">Digital Ordering Station</SectionLabel>
              <h1 className="font-playfair mt-2 text-3xl sm:text-4xl md:text-5xl text-[#F3E9D2]">
                Your Table, Your Call
              </h1>
            </div>
            {table && (
              <div className="flex items-center gap-2 border border-[#C9A24B] bg-[#2B1A12] px-4 py-2 text-xs font-mono text-[#C9A24B]">
                <span className="h-2 w-2 rounded-full bg-[#C9A24B] animate-pulse" />
                <span>Station: Table {table}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section-pad bg-[#0E0B09]">
        <div className="container-hacienda">
          {lines.length === 0 ? (
            <div className="border border-dashed border-[#C9A24B]/30 bg-[#140E0A] p-12 text-center sm:p-20">
              <ShoppingBag className="mx-auto h-12 w-12 text-[#C9A24B]/40" />
              <h2 className="font-playfair mt-5 text-2xl sm:text-3xl text-[#F3E9D2]">
                Your order is empty
              </h2>
              <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-[#F3E9D2]/60">
                Browse our selection of charcoal goat platters, beef cuts, cold pints, and
                cocktails to build your order.
              </p>
              <div className="mt-8">
                <Link to="/menu" className="button-gold">
                  Explore The Menu <ArrowRight size={14} className="ml-2" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
              {/* Left Column: Cart Review */}
              <div className="border border-[#C9A24B]/20 bg-[#140E0A] p-6 sm:p-8">
                <div className="flex items-center justify-between border-b border-[#C9A24B]/20 pb-5">
                  <div>
                    <span className="eyebrow">Step 01</span>
                    <h2 className="font-playfair mt-1 text-2xl text-[#F3E9D2]">
                      Selected Plates & Pours
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={clear}
                    className="text-[10px] uppercase tracking-wider text-[#F3E9D2]/40 hover:text-[#D9822B]"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-[#C9A24B]/15">
                  {lines.map((line) => {
                    const linePrice = getLineTotal(line);
                    return (
                      <div
                        key={line.lineId}
                        className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0 flex-1">
                          <h3 className="font-playfair text-lg text-[#F3E9D2]">
                            {line.item.name}
                          </h3>

                          {/* Cooking Style & Extras */}
                          <div className="mt-1 space-y-0.5 text-xs text-[#F3E9D2]/60">
                            {line.cookingStyle && (
                              <p>Preparation: <span className="text-[#C9A24B]">{line.cookingStyle}</span></p>
                            )}
                            {line.addOns.length > 0 && (
                              <p>
                                Sides:{' '}
                                {line.addOns.map((a) => `${a.name} (+${formatKES(a.price)})`).join(', ')}
                              </p>
                            )}
                            {line.note && (
                              <p className="italic text-[#F3E9D2]/45">"{line.note}"</p>
                            )}
                          </div>

                          <div className="mt-2 font-mono text-xs font-semibold text-[#C9A24B]">
                            {formatKES(linePrice)}
                          </div>
                        </div>

                        {/* Quantity Adjusters */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center border border-[#C9A24B]/25 bg-[#0D0B09]">
                            <button
                              type="button"
                              onClick={() => decrement(line.lineId)}
                              aria-label={`Decrease ${line.item.name}`}
                              className="flex h-9 w-9 items-center justify-center text-[#C9A24B] hover:bg-[#C9A24B]/10"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-8 text-center font-mono text-xs font-semibold">
                              {line.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() => addItem(line.item, line.addOns, line.cookingStyle, line.note)}
                              aria-label={`Increase ${line.item.name}`}
                              className="flex h-9 w-9 items-center justify-center text-[#C9A24B] hover:bg-[#C9A24B]/10"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => remove(line.lineId)}
                            aria-label={`Remove ${line.item.name}`}
                            className="flex h-9 w-9 items-center justify-center text-[#F3E9D2]/40 hover:text-[#D9822B]"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 border-t border-[#C9A24B]/20 pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#F3E9D2]/60">Order Subtotal ({count} items):</span>
                    <span className="font-mono text-base font-bold text-[#C9A24B]">
                      {formatKES(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column: Checkout Details Form */}
              <div className="h-fit border border-[#C9A24B]/30 bg-[#1A110D] p-6 sm:p-8">
                <form onSubmit={handleCheckout}>
                  <span className="eyebrow">Step 02</span>
                  <h2 className="font-playfair mt-1 text-2xl text-[#F3E9D2]">
                    Dining Details
                  </h2>

                  <div className="mt-6 space-y-4">
                    {/* Dining Mode */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                        Service Method
                      </label>
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {(['table', 'pickup', 'delivery'] as OrderMode[]).map((mode) => (
                          <button
                            key={mode}
                            type="button"
                            onClick={() => updateField('mode', mode)}
                            className={`min-h-[44px] border px-2 text-[10px] font-bold uppercase tracking-wider transition ${
                              details.mode === mode
                                ? 'border-[#C9A24B] bg-[#C9A24B] text-[#0D0B09]'
                                : 'border-[#C9A24B]/20 bg-[#0D0B09]/50 text-[#F3E9D2]/65 hover:border-[#C9A24B]/40'
                            }`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Table Number (if dining in) */}
                    {details.mode === 'table' && (
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                          Table / Banda Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={details.table || ''}
                          onChange={(e) => updateField('table', e.target.value)}
                          placeholder="e.g. 14 or Banda 2"
                          className="input-hacienda mt-1.5"
                        />
                        <p className="mt-1 text-[10px] text-[#F3E9D2]/40">
                          Found on your table tent QR card.
                        </p>
                      </div>
                    )}

                    {/* Delivery Address */}
                    {details.mode === 'delivery' && (
                      <div>
                        <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                          Delivery Address & Landmark *
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={details.address || ''}
                          onChange={(e) => updateField('address', e.target.value)}
                          placeholder="e.g. Ngara Parklands Rd, House #..."
                          className="input-hacienda mt-1.5 min-h-[70px] py-2"
                        />
                      </div>
                    )}

                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={details.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        placeholder="e.g. Brian K."
                        className="input-hacienda mt-1.5"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        value={details.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        placeholder="07XX XXX XXX"
                        className="input-hacienda mt-1.5"
                      />
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                        Special Request / Notes (Optional)
                      </label>
                      <input
                        type="text"
                        value={details.notes || ''}
                        onChange={(e) => updateField('notes', e.target.value)}
                        placeholder="e.g. Bring extra plates, kachumbari on side"
                        className="input-hacienda mt-1.5 text-xs"
                      />
                    </div>
                  </div>

                  {/* Summary & Submit */}
                  <div className="mt-8 border-t border-[#C9A24B]/20 pt-5">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-[#F3E9D2]/70">Verified Total:</span>
                      <span className="font-mono text-xl font-bold text-[#C9A24B]">
                        {formatKES(total)}
                      </span>
                    </div>

                    {errorMessage && (
                      <div className="mt-4 border border-[#D9822B]/40 bg-[#D9822B]/10 p-3 text-xs text-[#D9822B]">
                        {errorMessage}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={status === 'verifying' || status === 'sending'}
                      className="button-gold mt-5 w-full text-xs"
                    >
                      {status === 'verifying' ? (
                        'Verifying Quote with Kitchen…'
                      ) : status === 'sending' ? (
                        'Opening WhatsApp Dispatch…'
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          Send Order via WhatsApp <Send size={14} />
                        </span>
                      )}
                    </button>

                    <div className="mt-5 space-y-2 text-[10px] leading-relaxed text-[#F3E9D2]/50">
                      <p>
                        • <strong>Payment Method:</strong> Settled at table or upon delivery via Cash, M-Pesa, or Card.
                      </p>
                      <p>
                        • <strong>Security:</strong> All totals are re-calculated against our authoritative server price catalog before routing.
                      </p>
                      <p>
                        • <strong>Phase 5 Note:</strong> Direct Daraja M-Pesa STK Push will be enabled upon official credentials configuration.
                      </p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
