import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, ArrowLeft, ArrowRight } from 'lucide-react';
import { SectionLabel } from '@/components/section-label';

export function NotFoundPage() {
  return (
    <div className="pt-[74px]">
      <section className="section-pad flex min-h-[75vh] items-center justify-center bg-[#0D0B09] text-center">
        <div className="container-hacienda max-w-xl border border-[#C9A24B]/30 bg-[#160E0A] p-8 sm:p-14">
          <span className="font-mono text-xs tracking-widest text-[#C9A24B]">
            404 · PAGE NOT FOUND
          </span>
          <h1 className="font-playfair mt-3 text-3xl sm:text-4xl text-[#F3E9D2]">
            Lost In The Smoke
          </h1>
          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/65">
            The plate or section you were looking for doesn't exist or has moved to
            another table. Let's get you back to the warmth of the hearth.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <Link to="/" className="button-gold">
              Return to Homepage <ArrowRight size={14} className="ml-2" />
            </Link>
            <Link to="/menu" className="button-quiet">
              Browse Menu Plates
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
