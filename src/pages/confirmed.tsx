import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, MapPin, Phone, ArrowRight, Utensils } from 'lucide-react';
import { formatKES, siteConfig } from '@/config/site.config';
import type { CustomerDetails, Quote } from '@/lib/types';
import { SectionLabel } from '@/components/section-label';

export function ConfirmedPage() {
  const [orderData, setOrderData] = useState<{
    quote: Quote;
    details: CustomerDetails;
  } | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('hacienda_last_order');
      if (stored) {
        setOrderData(JSON.parse(stored));
      }
    } catch {
      // Storage unavailable
    }
  }, []);

  return (
    <div className="pt-[74px]">
      <section className="section-pad bg-[#0E0B09]">
        <div className="container-hacienda max-w-3xl">
          <div className="border border-[#C9A24B]/35 bg-[#140E0A] p-8 text-center sm:p-12">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A24B] bg-[#2B1A12] text-[#C9A24B]">
              <CheckCircle2 size={32} />
            </div>

            <span className="eyebrow mt-6 block">Order Successfully Dispatched</span>
            <h1 className="font-playfair mt-2 text-3xl sm:text-4xl text-[#F3E9D2]">
              The Kitchen Has Your Table
            </h1>

            {orderData?.quote && (
              <div className="mt-4 inline-block border border-[#C9A24B]/30 bg-[#0D0B09] px-4 py-1.5 font-mono text-xs text-[#C9A24B]">
                Order Reference: #{orderData.quote.orderId}
              </div>
            )}

            <p className="mx-auto mt-4 max-w-lg text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/70">
              Your order details have been routed directly to the grill master and service
              staff. Charcoal cuts (Nyama Choma, ribs, whole fish) take between 25 and 35
              minutes to roast to tenderness.
            </p>

            {/* Order Summary Card */}
            {orderData && (
              <div className="mt-8 border-t border-[#C9A24B]/20 pt-6 text-left">
                <div className="grid gap-6 sm:grid-cols-2 text-xs">
                  <div>
                    <span className="font-semibold uppercase tracking-wider text-[#C9A24B]">
                      Service Details
                    </span>
                    <p className="mt-2 text-[#F3E9D2]">
                      Guest: <strong>{orderData.details.name}</strong>
                    </p>
                    <p className="mt-1 text-[#F3E9D2]/75">
                      Phone: {orderData.details.phone}
                    </p>
                    <p className="mt-1 text-[#F3E9D2]/75">
                      Type:{' '}
                      {orderData.details.mode === 'table'
                        ? `Table ${orderData.details.table || 'Dine-In'}`
                        : orderData.details.mode === 'pickup'
                        ? 'Takeaway / Pickup'
                        : `Delivery to ${orderData.details.address}`}
                    </p>
                  </div>

                  <div>
                    <span className="font-semibold uppercase tracking-wider text-[#C9A24B]">
                      Payment & Settlement
                    </span>
                    <p className="mt-2 text-[#F3E9D2]">
                      Total: <strong className="font-mono text-[#C9A24B]">{formatKES(orderData.quote.total)}</strong>
                    </p>
                    <p className="mt-1 text-[#F3E9D2]/65">
                      Settlement: Pay server at table or on delivery (M-Pesa, Cash, Card)
                    </p>
                  </div>
                </div>

                {/* Items Breakdown */}
                <div className="mt-6 border-t border-[#C9A24B]/15 pt-4">
                  <span className="font-semibold uppercase tracking-wider text-[#C9A24B] text-[11px]">
                    Items Included
                  </span>
                  <div className="mt-2 divide-y divide-[#C9A24B]/10">
                    {orderData.quote.lines.map((line, idx) => (
                      <div key={idx} className="flex justify-between py-2 text-xs">
                        <span className="text-[#F3E9D2]">
                          {line.quantity}× {line.item.name}
                          {line.cookingStyle ? ` (${line.cookingStyle})` : ''}
                        </span>
                        <span className="font-mono text-[#C9A24B]">
                          {formatKES(line.lineTotal)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row border-t border-[#C9A24B]/20 pt-8">
              <Link to="/menu" className="button-gold">
                Browse More Menu Plates
              </Link>
              <Link to="/" className="button-quiet">
                Return to Homepage
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
