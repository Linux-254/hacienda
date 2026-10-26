import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Phone, ArrowUpRight, Shield, FileText } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { PrivacyTermsModal } from '@/components/privacy-terms-modal';

export function Footer() {
  const [modalType, setModalType] = useState<'privacy' | 'terms' | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <footer className="border-t border-[#C9A24B]/25 bg-[#0A0807] text-[#F3E9D2]">
        <div className="container-hacienda py-16 sm:py-20">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            {/* Col 1: Brand Seal & Essence */}
            <div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center border border-[#C9A24B] bg-[#160E0A]">
                  <span className="font-cinzel text-xs font-bold text-[#C9A24B]">H</span>
                </div>
                <span className="font-cinzel text-sm font-bold tracking-[0.22em] text-[#F3E9D2]">
                  HACIENDA
                </span>
              </div>
              <p className="font-cormorant mt-4 text-xl italic text-[#F3E9D2]/90">
                "{siteConfig.tagline}"
              </p>
              <p className="mt-3 text-xs leading-relaxed text-[#F3E9D2]/55">
                Nairobi’s late-night charcoal cuts and craft cocktail room.
                Built for match nights, unhurried conversation, and the warmth of the fire.
              </p>
              <div className="mt-5 text-[9px] uppercase tracking-[0.2em] text-[#C9A24B]/70">
                {siteConfig.imageryNote}
              </div>
            </div>

            {/* Col 2: Location & Hours */}
            <div>
              <p className="eyebrow">Location & Hours</p>
              <ul className="mt-4 space-y-3 text-xs text-[#F3E9D2]/75">
                <li className="flex items-start gap-2.5">
                  <MapPin size={15} className="mt-0.5 shrink-0 text-[#C9A24B]" />
                  <span>
                    {siteConfig.address}
                    <br />
                    <a
                      href={siteConfig.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-[#C9A24B] hover:underline"
                    >
                      Open Google Maps <ArrowUpRight size={11} />
                    </a>
                  </span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Clock size={15} className="shrink-0 text-[#C9A24B]" />
                  <span>{siteConfig.hours}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone size={15} className="shrink-0 text-[#C9A24B]" />
                  <span>{siteConfig.phone}</span>
                </li>
              </ul>
            </div>

            {/* Col 3: Gastronomy & Hospitality */}
            <div>
              <p className="eyebrow">The Experience</p>
              <ul className="mt-4 space-y-2 text-xs text-[#F3E9D2]/70">
                {siteConfig.features.slice(0, 5).map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="h-1 w-1 bg-[#C9A24B]" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Col 4: Quick Navigation & Legal */}
            <div>
              <p className="eyebrow">Navigation</p>
              <ul className="mt-4 space-y-2 text-xs text-[#F3E9D2]/70">
                <li>
                  <Link to="/menu" className="transition hover:text-[#C9A24B]">
                    Full Grill & Bar Menu
                  </Link>
                </li>
                <li>
                  <Link to="/order" className="transition hover:text-[#C9A24B]">
                    Table & Delivery Ordering
                  </Link>
                </li>
                <li>
                  <Link to="/events" className="transition hover:text-[#C9A24B]">
                    Match Day & Event Fixtures
                  </Link>
                </li>
                <li>
                  <Link to="/qr" className="transition hover:text-[#C9A24B]">
                    Printable Table QR Tents
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="transition hover:text-[#C9A24B]">
                    Our Philosophy & Roots
                  </Link>
                </li>
                <li>
                  <Link to="/info" className="transition hover:text-[#C9A24B]">
                    Directions & Banda Reservations
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="my-10 hairline-subtle" />

          {/* Bottom Bar with Disclosures and Back to Top */}
          <div className="flex flex-col gap-4 text-[10px] uppercase tracking-[0.18em] text-[#F3E9D2]/45 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <span>© {new Date().getFullYear()} Hacienda Sports Bar & Grill</span>
              <span>·</span>
              <button
                type="button"
                onClick={() => setModalType('privacy')}
                className="transition hover:text-[#C9A24B]"
              >
                Privacy Policy
              </button>
              <span>·</span>
              <button
                type="button"
                onClick={() => setModalType('terms')}
                className="transition hover:text-[#C9A24B]"
              >
                Terms of Service
              </button>
            </div>

            <button
              type="button"
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-[#C9A24B] transition hover:text-[#DFBA67]"
            >
              Back to Top <ArrowUpRight size={13} />
            </button>
          </div>
        </div>
      </footer>

      <PrivacyTermsModal
        type={modalType}
        onClose={() => setModalType(null)}
      />
    </>
  );
}
