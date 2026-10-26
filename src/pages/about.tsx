import React from 'react';
import { Link } from 'react-router-dom';
import { Flame, Users, HeartHandshake, ArrowRight } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { SectionLabel } from '@/components/section-label';

export function AboutPage() {
  return (
    <div className="pt-[74px]">
      <section className="border-b border-[#C9A24B]/20 bg-[#120B08] py-14 sm:py-20">
        <div className="container-hacienda">
          <SectionLabel number="Roots">Our Craft & Story</SectionLabel>
          <h1 className="font-playfair mt-3 text-4xl sm:text-5xl md:text-6xl text-[#F3E9D2]">
            The Fire, The Cuts, The Company
          </h1>
          <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/65">
            Hacienda was built on a simple premise: great sport and proper charcoal meat
            are meant to be shared across a big table without rush.
          </p>
        </div>
      </section>

      <section className="section-pad bg-[#0E0B09]">
        <div className="container-hacienda max-w-4xl space-y-16 sm:space-y-24">
          {/* Chapter 1: The Fire */}
          <div className="grid gap-8 md:grid-cols-[140px_1fr]">
            <div className="text-left">
              <span className="font-mono text-xs tracking-widest text-[#C9A24B]">
                CHAPTER 01
              </span>
              <h2 className="font-playfair mt-1 text-2xl text-[#F3E9D2]">
                The Fire
              </h2>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/75">
              <p>
                In a city full of hurried fast-casual fryers, we keep our hearth burning
                slowly. Our open pit utilizes aged acacia charcoal, yielding steady,
                smokeless heat that seals in juices while forming a delicate, caramelized crust.
              </p>
              <p>
                We do not reheat pre-cooked meat in a microwave. Every rack of ribs, quarter
                of chicken, and mutton cut goes onto the grill when your order is placed.
                It requires patience, but when the platter arrives steaming at the table,
                the wait explains itself.
              </p>
            </div>
          </div>

          <div className="hairline-subtle" />

          {/* Chapter 2: The Cuts */}
          <div className="grid gap-8 md:grid-cols-[140px_1fr]">
            <div className="text-left">
              <span className="font-mono text-xs tracking-widest text-[#C9A24B]">
                CHAPTER 02
              </span>
              <h2 className="font-playfair mt-1 text-2xl text-[#F3E9D2]">
                The Cuts
              </h2>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/75">
              <p>
                We partner with dedicated suppliers across Central Kenya and Lake Victoria
                to bring quality cuts to Ngara Road:
              </p>
              <ul className="list-disc list-inside space-y-2 pl-2 text-[#F3E9D2]/80">
                <li>
                  <strong>Pasture-Grazed Goat & Beef:</strong> Selected for intramuscular
                  marbling that melts smoothly over embers.
                </li>
                <li>
                  <strong>Traditional Kienyeji Chicken:</strong> Free-range birds with firm,
                  earthy poultry depth, prepared wet or boiled.
                </li>
                <li>
                  <strong>Whole Tilapia:</strong> Sourced fresh, deep-fried whole until crisp
                  or simmered in our rich tomato-dhania reduction.
                </li>
                <li>
                  <strong>Accompaniments from Local Soil:</strong> Freshly mashed mukimo,
                  hand-rolled chapati, and crisp managu sautéed with onions.
                </li>
              </ul>
            </div>
          </div>

          <div className="hairline-subtle" />

          {/* Chapter 3: The Company */}
          <div className="grid gap-8 md:grid-cols-[140px_1fr]">
            <div className="text-left">
              <span className="font-mono text-xs tracking-widest text-[#C9A24B]">
                CHAPTER 03
              </span>
              <h2 className="font-playfair mt-1 text-2xl text-[#F3E9D2]">
                The Company
              </h2>
            </div>
            <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/75">
              <p>
                "Hacienda" is Spanish for an estate, a gathering homestead where doors
                remain open and the table is perpetually laid. In Nairobi, that means a place
                where you can arrive with two friends or twenty colleagues and immediately
                feel at ease.
              </p>
              <p>
                Whether you prefer the roar of the crowd in the main sports lounge or the
                breeze beneath the thatched roof of a private banda, you are welcome here
                day and night.
              </p>
            </div>
          </div>

          {/* Call to action */}
          <div className="border border-[#C9A24B]/30 bg-[#160E0A] p-8 sm:p-12 text-center">
            <h3 className="font-playfair text-2xl sm:text-3xl text-[#F3E9D2]">
              Join Us At The Table
            </h3>
            <p className="mx-auto mt-2 max-w-md text-xs sm:text-sm text-[#F3E9D2]/65">
              Open 24 hours daily on Ngara Road, Nairobi.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link to="/menu" className="button-gold">
                View The Menu
              </Link>
              <Link to="/info" className="button-quiet">
                Hours & Directions
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
