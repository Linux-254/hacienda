import React, { useState } from 'react';
import { MapPin, Navigation, ExternalLink, Phone, ShieldCheck, Car, Clock, Compass } from 'lucide-react';
import { siteConfig } from '@/config/site.config';

type LocationMapCardProps = {
  className?: string;
  showDetails?: boolean;
};

export function LocationMapCard({ className = '', showDetails = true }: LocationMapCardProps) {
  const [mapLoaded, setMapLoaded] = useState(false);

  // Exact Google Maps location query for Hacienda Sports Bar & Grill on Ngara Rd Nairobi
  const mapQuery = 'Hacienda Sports Bar & Grill, Ngara Road, Nairobi';
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
  const mapsSearchUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;
  const wazeUrl = `https://waze.com/ul?q=${encodeURIComponent(mapQuery)}`;

  return (
    <div
      className={`border border-[#C9A24B]/30 bg-[#140E0A] text-[#F3E9D2] shadow-2xl overflow-hidden ${className}`}
    >
      {/* Card Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C9A24B]/20 bg-[#1A110D] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center border border-[#C9A24B] bg-[#0D0B09] text-[#C9A24B]">
            <MapPin size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="eyebrow text-[#C9A24B]">Venue Map & Navigation</span>
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-950/40 px-2 py-0.5 text-[9px] font-semibold uppercase text-emerald-400">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Open 24/7
              </span>
            </div>
            <h3 className="font-playfair text-xl sm:text-2xl text-[#F3E9D2]">
              Hacienda Sports Bar & Grill
            </h3>
            <p className="text-xs text-[#F3E9D2]/70">
              Ngara Road (near Musembi Rd & Fig Tree), Nairobi
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button-gold min-h-[38px] px-3.5 text-xs inline-flex items-center gap-1.5"
          >
            <Navigation size={13} />
            <span>Get Directions</span>
          </a>
          <a
            href={mapsSearchUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="button-quiet min-h-[38px] px-3 text-xs inline-flex items-center gap-1.5"
          >
            <ExternalLink size={13} />
            <span>Google Maps</span>
          </a>
        </div>
      </div>

      {/* Embedded Map Container */}
      <div className="relative w-full h-[320px] sm:h-[400px] bg-[#0D0B09]">
        {!mapLoaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#0D0B09] text-xs text-[#F3E9D2]/60 z-10">
            <Compass className="h-7 w-7 text-[#C9A24B] animate-spin" style={{ animationDuration: '3s' }} />
            <span>Loading satellite and street map...</span>
          </div>
        )}
        <iframe
          title="Hacienda Sports Bar & Grill Interactive Map"
          src={embedUrl}
          className="w-full h-full border-0 contrast-[1.08] brightness-[0.88] grayscale-[20%]"
          loading="lazy"
          allowFullScreen
          onLoad={() => setMapLoaded(true)}
        />
        {/* Subtle Map Corner Badge */}
        <div className="absolute bottom-3 left-3 z-20 pointer-events-none rounded border border-[#C9A24B]/30 bg-[#0D0B09]/90 px-2.5 py-1 backdrop-blur-sm">
          <span className="font-mono text-[10px] text-[#C9A24B]">
            📍 Coordinates: -1.2725° S, 36.8219° E
          </span>
        </div>
      </div>

      {/* Footer Navigation Details */}
      {showDetails && (
        <div className="grid gap-4 border-t border-[#C9A24B]/20 bg-[#160E0A] p-6 sm:grid-cols-3 text-xs">
          <div className="flex items-start gap-3">
            <Car className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A24B]" />
            <div>
              <h4 className="font-semibold text-[#F3E9D2]">On-Site Parking</h4>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#F3E9D2]/65">
                Dedicated parking apron with 24-hour perimeter security and valet assistance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A24B]" />
            <div>
              <h4 className="font-semibold text-[#F3E9D2]">24-Hour Kitchen & Bar</h4>
              <p className="mt-0.5 text-[11px] leading-relaxed text-[#F3E9D2]/65">
                Always open. Breakfast, late-night nyama choma, live sport screenings, and cocktails.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A24B]" />
            <div>
              <h4 className="font-semibold text-[#F3E9D2]">Direct Contact</h4>
              <p className="mt-0.5 font-mono text-[11px] text-[#C9A24B]">
                <a href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`} className="hover:underline">
                  {siteConfig.phone}
                </a>
              </p>
              <div className="mt-1 flex items-center gap-2 text-[10px]">
                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#C9A24B] hover:underline"
                >
                  WhatsApp Us ↗
                </a>
                <span>·</span>
                <a
                  href={wazeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#F3E9D2]/60 hover:underline"
                >
                  Waze ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
