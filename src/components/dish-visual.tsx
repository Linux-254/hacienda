import React, { useState } from 'react';
import { siteConfig } from '@/config/site.config';

type DishVisualProps = {
  src?: string;
  alt: string;
  label?: string;
  size?: 'small' | 'medium' | 'large' | 'responsive';
  priority?: boolean;
  className?: string;
};

export function DishVisual({
  src,
  alt,
  label,
  size = 'responsive',
  priority = false,
  className = '',
}: DishVisualProps) {
  const [hasError, setHasError] = useState(false);

  const heightClasses = {
    small: 'h-32 sm:h-40',
    medium: 'h-44 sm:h-56',
    large: 'h-60 sm:h-76 md:h-88',
    responsive: 'h-32 xs:h-36 sm:h-48 md:h-56',
  }[size];

  return (
    <div
      className={`dish-float-stage ${heightClasses} ${className}`}
    >
      {/* Soft Ground Shadow that expands as the plate lifts */}
      <div className="dish-float-shadow" />

      {/* Warm Ambient Charcoal Hearth Glow */}
      <div className="dish-float-glow" />

      {/* Floating Transparent Cutout Plate / Glass with Drop Shadow & Lift */}
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          onError={() => setHasError(true)}
          className="dish-float-image h-full w-full max-h-full max-w-full"
        />
      ) : (
        <div className="relative z-10 flex h-full w-full flex-col items-center justify-center border border-dashed border-[#C9A24B]/25 bg-gradient-to-b from-[#2B1A12]/40 to-[#0D0B09]/80 p-3 text-center">
          <span className="font-cormorant text-base sm:text-xl italic text-[#F3E9D2]/70">
            {label ?? 'Hacienda Plate'}
          </span>
          <span className="mt-1 text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-[#C9A24B]/60">
            {siteConfig.imageryNote}
          </span>
        </div>
      )}
    </div>
  );
}
