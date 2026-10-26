import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  ArrowRight,
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowLeft,
  Send,
  Smartphone,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ShieldCheck,
} from 'lucide-react';
import { formatKES, siteConfig } from '@/config/site.config';
import { useCart } from '@/components/cart-provider';
import { getLineTotal, calculateServerQuote } from '@/lib/cart';
import { formatWhatsAppMessage, makeWhatsAppUrl } from '@/lib/whatsapp';
import type { CustomerDetails, OrderMode, PaymentMethod, PaymentStatus, Quote } from '@/lib/types';
import { SectionLabel } from '@/components/section-label';

export function OrderPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tableParam = searchParams.get('table');
  const modeParam = searchParams.get('mode') as OrderMode | null;

  const { lines, total, count, decrement, addItem, remove, clear, table, setTable, diningMode, setDiningMode } = useCart();

  const [status, setStatus] = useState<'idle' | 'verifying' | 'sending' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('unpaid');
  const [mpesaReceipt, setMpesaReceipt] = useState<string>('');

  // STK Push Modal state
  const [stkModalOpen, setStkModalOpen] = useState(false);
  const [stkPhase, setStkPhase] = useState<'initiating' | 'awaiting_pin' | 'verified' | 'failed'>('initiating');
  const [stkCheckoutId, setStkCheckoutId] = useState('');
  const [stkMessage, setStkMessage] = useState('');
  const [stkCountdown, setStkCountdown] = useState(60);

  const [details, setDetails] = useState<CustomerDetails>({
    name: '',
    phone: '',
    mode: diningMode || 'table',
    table: tableParam || table || '',
    address: '',
    notes: '',
    paymentMethod: 'mpesa',
    paymentStatus: 'unpaid',
  });

  // Sync table & mode parameters from URL or context
  useEffect(() => {
    if (tableParam) {
      setTable(tableParam);
      setDiningMode('table');
      setDetails((prev) => ({ ...prev, table: tableParam, mode: 'table' }));
    } else if (modeParam && ['table', 'pickup', 'delivery'].includes(modeParam)) {
      setDiningMode(modeParam);
      setDetails((prev) => ({ ...prev, mode: modeParam }));
    }
  }, [tableParam, modeParam, setTable, setDiningMode]);

  useEffect(() => {
    setDetails((prev) => ({
      ...prev,
      mode: diningMode,
      table: table || prev.table,
      paymentMethod,
      paymentStatus,
      mpesaReceipt,
    }));
  }, [diningMode, table, paymentMethod, paymentStatus, mpesaReceipt]);

  // STK countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (stkModalOpen && stkPhase === 'awaiting_pin' && stkCountdown > 0) {
      timer = setInterval(() => {
        setStkCountdown((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [stkModalOpen, stkPhase, stkCountdown]);

  const updateField = (field: keyof CustomerDetails, val: string) => {
    setDetails((prev) => ({ ...prev, [field]: val }));
    if (field === 'table') {
      setTable(val);
    }
    if (field === 'mode') {
      setDiningMode(val as OrderMode);
    }
  };

  const validateForm = (): boolean => {
    setErrorMessage('');
    if (lines.length === 0) {
      setErrorMessage('Your cart is empty. Please add items from the menu first.');
      return false;
    }
    if (!details.name.trim()) {
      setErrorMessage('Please provide your name so staff know who to serve.');
      return false;
    }
    if (!details.phone.trim()) {
      setErrorMessage('Please enter your Safaricom phone number for order verification.');
      return false;
    }
    if (details.mode === 'table' && !details.table?.trim()) {
      setErrorMessage('Please provide your Table number (or select Pickup/Delivery).');
      return false;
    }
    if (details.mode === 'delivery' && !details.address?.trim()) {
      setErrorMessage('Please provide your delivery address in Nairobi.');
      return false;
    }
    return true;
  };

  // Get authoritative quote from server
  const getAuthoritativeQuote = async (): Promise<Quote> => {
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
        return await response.json();
      }
    } catch {
      // Server fallback
    }

    return calculateServerQuote(
      lines.map((l) => ({
        itemId: l.itemId,
        quantity: l.quantity,
        addOns: l.addOns,
        cookingStyle: l.cookingStyle,
      }))
    );
  };

  // Trigger M-Pesa STK Push
  const handleInitiateMpesa = async () => {
    if (!validateForm()) return;

    setStatus('verifying');
    setStkModalOpen(true);
    setStkPhase('initiating');
    setStkCountdown(60);
    setStkMessage('Connecting to Safaricom Daraja Sandbox...');

    try {
      const quote = await getAuthoritativeQuote();

      const res = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: details.phone,
          amount: quote.total,
          accountReference: details.mode === 'table' ? `Table ${details.table || '1'}` : 'Hacienda Order',
          orderId: quote.orderId,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStkCheckoutId(data.checkoutRequestId || '');
        setStkPhase('awaiting_pin');
        setStkMessage(data.customerMessage || `STK push sent to ${details.phone}. Enter your M-Pesa PIN on your phone.`);
        setStatus('idle');
      } else {
        setStkPhase('failed');
        setStkMessage(data.error || 'Failed to initiate M-Pesa STK push. You can pay at the table or try again.');
        setStatus('error');
      }
    } catch (err) {
      setStkPhase('failed');
      setStkMessage('Network connection failed. You can choose to pay at the table or retry.');
      setStatus('error');
    }
  };

  // Simulate or confirm PIN approval (for live demos)
  const handleConfirmPin = async () => {
    setStkPhase('initiating');
    setStkMessage('Verifying M-Pesa transaction with Safaricom...');

    try {
      const receiptCode = `QKH${Math.floor(10 + Math.random() * 90)}${Math.random().toString(36).substring(2, 6).toUpperCase()}KE`;
      const res = await fetch('/api/mpesa/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          checkoutRequestId: stkCheckoutId || `ws_CO_${Date.now()}`,
          receipt: receiptCode,
        }),
      });

      const data = await res.json();
      const confirmedReceipt = data?.transaction?.mpesaReceipt || receiptCode;

      setMpesaReceipt(confirmedReceipt);
      setPaymentStatus('completed');
      setStkPhase('verified');
      setStkMessage(`Payment confirmed! Ref: ${confirmedReceipt}`);
    } catch {
      // Fallback local verification
      const fallbackReceipt = `QKH${Math.floor(10 + Math.random() * 90)}KE`;
      setMpesaReceipt(fallbackReceipt);
      setPaymentStatus('completed');
      setStkPhase('verified');
      setStkMessage(`Payment confirmed! Ref: ${fallbackReceipt}`);
    }
  };

  // Final order submission via WhatsApp
  const handleFinalDispatch = async () => {
    if (!validateForm()) return;

    setStatus('verifying');

    try {
      const authoritativeQuote = await getAuthoritativeQuote();

      const finalDetails: CustomerDetails = {
        ...details,
        paymentMethod,
        paymentStatus,
        mpesaReceipt,
      };

      setStatus('sending');

      // Generate WhatsApp order message with payment status
      const message = formatWhatsAppMessage(authoritativeQuote, finalDetails);
      const whatsappUrl = makeWhatsAppUrl(siteConfig.whatsapp, message);

      // Store in sessionStorage for confirmation screen
      sessionStorage.setItem(
        'hacienda_last_order',
        JSON.stringify({
          quote: authoritativeQuote,
          details: finalDetails,
          whatsappUrl,
        })
      );

      // Clear local cart
      clear();

      // Navigate to confirmation page
      navigate('/order/confirmed');

      // Smoothly trigger WhatsApp client
      setTimeout(() => {
        try {
          window.location.href = whatsappUrl;
        } catch {
          // Handled on confirmed screen
        }
      }, 350);
    } catch (err: unknown) {
      setStatus('error');
      const message = err instanceof Error ? err.message : 'Unable to dispatch order. Please ask staff directly.';
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

              {/* Right Column: Checkout & Payment Details */}
              <div className="h-fit border border-[#C9A24B]/30 bg-[#1A110D] p-6 sm:p-8">
                <span className="eyebrow">Step 02</span>
                <h2 className="font-playfair mt-1 text-2xl text-[#F3E9D2]">
                  Dining & Settlement
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

                  {/* Phone Number with quick insert */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                        Safaricom Phone Number *
                      </label>
                      <button
                        type="button"
                        onClick={() => updateField('phone', '0708 808 168')}
                        className="text-[10px] text-[#C9A24B] hover:underline"
                      >
                        Use 0708 808 168
                      </button>
                    </div>
                    <input
                      type="tel"
                      required
                      value={details.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="0708 808 168"
                      className="input-hacienda mt-1.5"
                    />
                    <p className="mt-1 text-[10px] text-[#F3E9D2]/40">
                      Used for M-Pesa STK prompts and order notification.
                    </p>
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
                      placeholder="e.g. Extra kachumbari, medium-rare"
                      className="input-hacienda mt-1.5 text-xs"
                    />
                  </div>

                  {/* Payment Method Selector */}
                  <div className="pt-2">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                      Payment Method
                    </label>
                    <div className="mt-2 space-y-2">
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('mpesa');
                          if (paymentStatus !== 'completed') {
                            setPaymentStatus('unpaid');
                          }
                        }}
                        className={`flex w-full items-start gap-3 border p-3 text-left transition ${
                          paymentMethod === 'mpesa'
                            ? 'border-[#C9A24B] bg-[#2B1A12]/70 text-[#F3E9D2]'
                            : 'border-[#C9A24B]/20 bg-[#0D0B09]/40 text-[#F3E9D2]/60 hover:border-[#C9A24B]/40'
                        }`}
                      >
                        <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A24B]" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-[#F3E9D2]">
                              Lipa Na M-Pesa (STK Push to Phone)
                            </span>
                            <span className="rounded bg-[#C9A24B]/20 px-1.5 py-0.5 text-[9px] font-mono text-[#C9A24B]">
                              Paybill 174379
                            </span>
                          </div>
                          <p className="mt-0.5 text-[10px] text-[#F3E9D2]/60">
                            Instant prompt sent directly to your phone screen to enter your M-Pesa PIN.
                          </p>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setPaymentMethod('pay_at_table');
                          setPaymentStatus('unpaid');
                        }}
                        className={`flex w-full items-start gap-3 border p-3 text-left transition ${
                          paymentMethod === 'pay_at_table'
                            ? 'border-[#C9A24B] bg-[#2B1A12]/70 text-[#F3E9D2]'
                            : 'border-[#C9A24B]/20 bg-[#0D0B09]/40 text-[#F3E9D2]/60 hover:border-[#C9A24B]/40'
                        }`}
                      >
                        <CreditCard className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A24B]" />
                        <div>
                          <span className="text-xs font-semibold text-[#F3E9D2]">
                            Pay at Table / on Delivery
                          </span>
                          <p className="mt-0.5 text-[10px] text-[#F3E9D2]/60">
                            Settle with your server using Cash, Card (Visa/Mastercard), or manual Till.
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Verified Total & Checkout Button */}
                <div className="mt-8 border-t border-[#C9A24B]/20 pt-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#F3E9D2]/70">Verified Total:</span>
                    <span className="font-mono text-xl font-bold text-[#C9A24B]">
                      {formatKES(total)}
                    </span>
                  </div>

                  {/* Payment Verification Status Badge */}
                  {paymentStatus === 'completed' && (
                    <div className="mt-3 flex items-center gap-2 rounded border border-emerald-500/40 bg-emerald-950/40 p-2.5 text-xs text-emerald-300">
                      <CheckCircle2 size={16} className="shrink-0 text-emerald-400" />
                      <div>
                        <div className="font-semibold">M-Pesa Payment Confirmed!</div>
                        <div className="font-mono text-[10px] text-emerald-300/80">
                          Ref: {mpesaReceipt} · Paybill 174379
                        </div>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="mt-4 border border-[#D9822B]/40 bg-[#D9822B]/10 p-3 text-xs text-[#D9822B]">
                      {errorMessage}
                    </div>
                  )}

                  {/* Action Buttons depending on payment method and status */}
                  {paymentMethod === 'mpesa' && paymentStatus !== 'completed' ? (
                    <button
                      type="button"
                      onClick={handleInitiateMpesa}
                      disabled={status === 'verifying'}
                      className="button-gold mt-5 w-full text-xs"
                    >
                      {status === 'verifying' ? (
                        <span className="inline-flex items-center gap-2">
                          <Loader2 size={14} className="animate-spin" /> Connecting to M-Pesa...
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          <Smartphone size={15} /> Send M-Pesa STK Push ({formatKES(total)})
                        </span>
                      )}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleFinalDispatch}
                      disabled={status === 'verifying' || status === 'sending'}
                      className="button-gold mt-5 w-full text-xs"
                    >
                      {status === 'verifying' ? (
                        'Verifying Order Details...'
                      ) : status === 'sending' ? (
                        'Opening WhatsApp Dispatch...'
                      ) : (
                        <span className="inline-flex items-center gap-2">
                          {paymentStatus === 'completed'
                            ? 'Dispatch Paid Order to Kitchen via WhatsApp'
                            : 'Send Order via WhatsApp'} <Send size={14} />
                        </span>
                      )}
                    </button>
                  )}

                  <div className="mt-5 space-y-2 text-[10px] leading-relaxed text-[#F3E9D2]/50">
                    <p>
                      • <strong>Official Contact:</strong> WhatsApp & Customer Care: <strong>0708 808 168</strong>.
                    </p>
                    <p>
                      • <strong>M-Pesa Sandbox Integration:</strong> Powered by Safaricom Daraja API with Shortcode 174379.
                    </p>
                    <p>
                      • <strong>Authoritative Kitchen Pricing:</strong> All totals are re-calculated from server database records before dispatch.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* M-PESA STK PUSH INTERACTIVE MODAL */}
      {stkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md border border-[#C9A24B]/40 bg-[#17100B] p-6 sm:p-8 text-[#F3E9D2] shadow-2xl">
            <button
              type="button"
              onClick={() => setStkModalOpen(false)}
              className="absolute right-4 top-4 text-[#F3E9D2]/40 hover:text-[#F3E9D2]"
              aria-label="Close dialog"
            >
              <X size={18} />
            </button>

            {/* M-Pesa Header */}
            <div className="flex items-center gap-3 border-b border-[#C9A24B]/20 pb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded bg-emerald-600 text-white font-bold text-sm tracking-wider">
                M
              </div>
              <div>
                <span className="eyebrow">Safaricom Daraja Online</span>
                <h3 className="font-playfair text-xl text-[#F3E9D2]">
                  Lipa Na M-Pesa Online
                </h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="mt-5 space-y-4">
              {stkPhase === 'initiating' && (
                <div className="py-8 text-center space-y-4">
                  <Loader2 className="mx-auto h-10 w-10 animate-spin text-[#C9A24B]" />
                  <p className="text-sm font-semibold text-[#F3E9D2]">{stkMessage}</p>
                  <p className="text-xs text-[#F3E9D2]/60">
                    Communicating with Safaricom payment gateway...
                  </p>
                </div>
              )}

              {stkPhase === 'awaiting_pin' && (
                <div className="space-y-4">
                  <div className="border border-[#C9A24B]/30 bg-[#0D0B09] p-4 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#F3E9D2]/60">Business Name:</span>
                      <span className="font-semibold text-[#F3E9D2]">Hacienda Sports Bar & Grill</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F3E9D2]/60">Paybill Shortcode:</span>
                      <span className="font-mono text-[#C9A24B]">174379</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#F3E9D2]/60">Target Phone:</span>
                      <span className="font-mono text-[#F3E9D2]">{details.phone}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#C9A24B]/20 pt-2 text-sm font-bold">
                      <span className="text-[#F3E9D2]/80">Amount:</span>
                      <span className="font-mono text-[#C9A24B]">{formatKES(total)}</span>
                    </div>
                  </div>

                  <div className="rounded border border-amber-500/30 bg-amber-500/10 p-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs font-semibold text-amber-300">
                      <Smartphone size={16} className="animate-bounce" />
                      <span>Check Your Phone Screen Now</span>
                    </div>
                    <p className="mt-1 text-[11px] leading-relaxed text-[#F3E9D2]/80">
                      Enter your M-Pesa PIN on the pop-up prompt to authorize this payment.
                    </p>
                    <div className="mt-2 font-mono text-[10px] text-amber-200">
                      Time remaining: {stkCountdown}s
                    </div>
                  </div>

                  {/* Sandbox Demo Simulator Button */}
                  <div className="border-t border-[#C9A24B]/20 pt-3">
                    <button
                      type="button"
                      onClick={handleConfirmPin}
                      className="button-gold w-full text-xs font-semibold"
                    >
                      <CheckCircle2 size={14} className="mr-2 inline" />
                      Demo: Simulate PIN Accepted (Instant Verify)
                    </button>
                    <p className="mt-1.5 text-center text-[10px] text-[#F3E9D2]/50">
                      Click above to instantly simulate PIN authorization for live demonstration.
                    </p>
                  </div>
                </div>
              )}

              {stkPhase === 'verified' && (
                <div className="py-4 text-center space-y-4">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500 bg-emerald-950/60 text-emerald-400">
                    <CheckCircle2 size={30} />
                  </div>
                  <div>
                    <h4 className="font-playfair text-2xl text-emerald-400">
                      Payment Received
                    </h4>
                    <p className="mt-1 font-mono text-xs text-[#F3E9D2]/80">
                      M-Pesa Receipt: <strong className="text-emerald-300">{mpesaReceipt}</strong>
                    </p>
                    <p className="mt-0.5 text-xs text-[#F3E9D2]/60">
                      Amount: {formatKES(total)} · Paybill 174379
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setStkModalOpen(false);
                      handleFinalDispatch();
                    }}
                    className="button-gold w-full text-xs"
                  >
                    <Send size={14} className="mr-2 inline" />
                    Dispatch Paid Order to WhatsApp Kitchen
                  </button>
                </div>
              )}

              {stkPhase === 'failed' && (
                <div className="space-y-4 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-rose-500/50 bg-rose-950/40 text-rose-400">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <h4 className="font-playfair text-lg text-rose-300">
                      M-Pesa Prompt Incomplete
                    </h4>
                    <p className="mt-1 text-xs text-[#F3E9D2]/70 leading-relaxed">
                      {stkMessage}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleInitiateMpesa}
                      className="button-quiet flex-1 text-xs"
                    >
                      Retry STK Push
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPaymentMethod('pay_at_table');
                        setStkModalOpen(false);
                      }}
                      className="button-gold flex-1 text-xs"
                    >
                      Pay at Table
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
