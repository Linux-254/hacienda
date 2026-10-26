import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';
import { siteConfig } from '@/config/site.config';

type PolicyType = 'privacy' | 'terms' | null;

export function PrivacyTermsModal({
  type,
  onClose,
}: {
  type: PolicyType;
  onClose: () => void;
}) {
  if (!type) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0D0B09]/85 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={type === 'privacy' ? 'Privacy Policy' : 'Terms & Conditions'}
      onClick={onClose}
    >
      <div
        className="relative max-h-[85vh] w-full max-w-2xl overflow-y-auto border border-[#C9A24B]/35 bg-[#1A110D] p-6 text-[#F3E9D2] sm:p-10 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between border-b border-[#C9A24B]/20 pb-5">
          <div className="flex items-center gap-3">
            {type === 'privacy' ? (
              <ShieldCheck className="h-6 w-6 text-[#C9A24B]" />
            ) : (
              <FileText className="h-6 w-6 text-[#C9A24B]" />
            )}
            <div>
              <p className="eyebrow">{siteConfig.name}</p>
              <h2 className="font-playfair text-2xl text-[#F3E9D2]">
                {type === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex h-10 w-10 items-center justify-center border border-[#C9A24B]/20 text-[#C9A24B] transition hover:border-[#C9A24B] hover:bg-[#C9A24B]/10"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 space-y-5 text-xs leading-relaxed text-[#F3E9D2]/75">
          {type === 'privacy' ? (
            <>
              <p>
                <strong>Last Updated:</strong> October 2026
              </p>
              <p>
                At <strong>{siteConfig.name}</strong>, we respect your privacy. This policy outlines how information is gathered and used when using our digital menu, QR table tents, and order routing system.
              </p>
              <h3 className="font-playfair text-sm text-[#C9A24B] uppercase tracking-wider">
                1. Information We Collect
              </h3>
              <p>
                When submitting an order through our digital menu, we process:
              </p>
              <ul className="list-inside list-disc space-y-1 pl-2 text-[#F3E9D2]/70">
                <li>Your name (for identifying your table or takeaway order)</li>
                <li>Your phone number (for verification and staff communication)</li>
                <li>Your table number or delivery address</li>
                <li>Selected dishes, cooking preferences, and accompaniments</li>
              </ul>
              <h3 className="font-playfair text-sm text-[#C9A24B] uppercase tracking-wider">
                2. How Information Is Processed
              </h3>
              <p>
                Orders are composed in your local browser session and forwarded directly to Hacienda’s staff WhatsApp line or verified on our order quote endpoint. We do not sell, rent, or trade your personal data to any third-party marketing companies.
              </p>
              <h3 className="font-playfair text-sm text-[#C9A24B] uppercase tracking-wider">
                3. Local Storage
              </h3>
              <p>
                We use browser localStorage solely to preserve your active cart and table number between page refreshes during your dining visit. No tracking pixels or advertising cookies are deployed.
              </p>
              <h3 className="font-playfair text-sm text-[#C9A24B] uppercase tracking-wider">
                4. Contact & Inquiries
              </h3>
              <p>
                For any data questions, visit us in person at {siteConfig.address} or reach our front-of-house staff.
              </p>
            </>
          ) : (
            <>
              <p>
                <strong>Last Updated:</strong> October 2026
              </p>
              <p>
                Welcome to <strong>{siteConfig.name}</strong>. By accessing our venue, digital QR menu, or takeaway ordering service, you agree to the following terms.
              </p>
              <h3 className="font-playfair text-sm text-[#C9A24B] uppercase tracking-wider">
                1. Table Ordering & Fulfillment
              </h3>
              <p>
                Digital menu submissions made via QR code notify kitchen and service staff. Preparation times for charcoal cuts (Nyama Choma, roast poultry, whole fish) take between 25 and 45 minutes to ensure authentic slow-roast flavor.
              </p>
              <h3 className="font-playfair text-sm text-[#C9A24B] uppercase tracking-wider">
                2. Pricing & Currency
              </h3>
              <p>
                All prices are stated in Kenya Shillings (KES). Items marked "Ask staff" are subject to market availability or variable seasonal cuts and will be confirmed by your server before preparation.
              </p>
              <h3 className="font-playfair text-sm text-[#C9A24B] uppercase tracking-wider">
                3. Payment Methods
              </h3>
              <p>
                Payment is settled upon service at your table or upon pickup/delivery. We accept M-Pesa, Cash, and major debit/credit cards. Never send payments to unverified third-party numbers.
              </p>
              <h3 className="font-playfair text-sm text-[#C9A24B] uppercase tracking-wider">
                4. Responsible Service of Alcohol
              </h3>
              <p>
                Cocktails and alcoholic beverages are served strictly to guests aged 18 and older in compliance with Kenyan law. Valid identification may be requested.
              </p>
            </>
          )}
        </div>

        <div className="mt-8 border-t border-[#C9A24B]/20 pt-5 text-right">
          <button
            type="button"
            onClick={onClose}
            className="button-gold min-h-[40px] px-6 text-[10px]"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
