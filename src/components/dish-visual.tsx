import React, { useState } from 'react';
import { siteConfig } from '@/config/site.config';

type DishVisualProps = {
  src?: string;
  alt: string;
  label?: string;
  size?: 'small' | 'medium' | 'large';
  priority?: boolean;
  className?: string;
};

export function DishVisual({
  src,
  alt,
  label,
  size = 'large',
  priority = false,
  className = '',
}: DishVisualProps) {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    small: 'h-48 w-48 max-w-full',
    medium: 'h-64 w-full max-w-[380px]',
    large: 'h-72 w-full max-w-[500px] sm:h-88',
  }[size];

  return (
    <div
      className={`group relative mx-auto flex items-center justify-center ${sizeClasses} ${className}`}
    >
      {/* Warm Ambient Back-glow & Ground Shadow */}
      <div className="absolute inset-x-8 bottom-3 h-10 rounded-[50%] bg-[#000000]/70 blur-xl transition-all duration-500 group-hover:inset-x-5 group-hover:h-12 group-hover:bg-[#000000]/85" />
      <div className="absolute inset-10 rounded-full bg-[#C9A24B]/[0.04] blur-2xl transition-all duration-500 group-hover:bg-[#C9A24B]/[0.09]" />

      {/* Floating Plate / Glass with Soft Rim Light */}
      {src && !hasError ? (
        <div className="relative h-full w-full overflow-hidden rounded-lg p-2">
          <img
            src={src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            onError={() => setHasError(true)}
            className="h-full w-full rounded-md object-cover object-center drop-shadow-[0_20px_25px_rgba(0,0,0,0.6)] transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03]"
          />
          {/* Subtle warm rim overlay on image */}
          <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-[#C9A24B]/15 group-hover:ring-[#C9A24B]/30" />
        </div>
      ) : (
        <div className="relative flex h-full w-full flex-col items-center justify-center border border-dashed border-[#C9A24B]/25 bg-gradient-to-b from-[#2B1A12]/40 to-[#0D0B09]/80 p-6 text-center">
          <span className="font-cormorant text-2xl italic text-[#F3E9D2]/70">
            {label ?? 'Hacienda Specialty'}
          </span>
          <span className="mt-2 text-[9px] uppercase tracking-[0.2em] text-[#C9A24B]/60">
            {siteConfig.imageryNote}
          </span>
        </div>
      )}
    </div>
  );
}
