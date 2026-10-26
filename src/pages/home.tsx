import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Flame, MapPin, Clock, Calendar, Tv, Music, HelpCircle, Utensils, GlassWater } from 'lucide-react';
import { motion, useScroll, useSpring } from 'motion/react';
import { formatKES, siteConfig } from '@/config/site.config';
import { SectionLabel } from '@/components/section-label';
import { DishVisual } from '@/components/dish-visual';
import { LiveGrill } from '@/components/live-grill';
import { Reveal } from '@/components/reveal';

export function HomePage() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Signature items to highlight in the editorial story
  const signatureDishes = siteConfig.menu.filter((item) =>
    ['nyama-choma-platter', 'mutton-full', 'whole-fish', 'old-fashion', 'wings'].includes(item.id)
  );

  return (
    <div className="relative pt-[74px]">
      {/* Scroll-Driven Golden Progress Bar */}
      <motion.div
        className="fixed top-[74px] left-0 right-0 z-50 h-[2px] bg-gradient-to-r from-[#C9A24B] via-[#E1BD65] to-[#D9822B] origin-left"
        style={{ scaleX }}
      />

      {/* 1. Full-Bleed Cinematic Hero */}
      <section className="relative flex min-h-[92vh] items-center justify-center overflow-hidden border-b border-[#C9A24B]/20 bg-[#0D0B09] px-6 py-20 text-center sm:min-h-[95vh] sm:py-28">
        {/* Background Image with Slow Subtle Ken Burns zoom */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.img
            initial={{ scale: 1.12, opacity: 0.2 }}
            animate={{ scale: 1.04, opacity: 0.42 }}
            transition={{ duration: 2.2, ease: 'easeOut' }}
            src={siteConfig.images.hero}
            alt="Atmospheric dark steakhouse interior with candle-lit tables"
            className="h-full w-full object-cover object-center brightness-[0.45] contrast-[1.15]"
          />
          {/* Deep Vignette Gradients */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#0D0B09]/60 to-[#0D0B09]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0B09] via-transparent to-[#0D0B09]/80" />
        </div>

        {/* Content Framed in Thin Gold Rule */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 mx-auto max-w-4xl border border-[#C9A24B]/35 bg-[#0D0B09]/80 p-8 backdrop-blur-md sm:p-14 md:p-16 shadow-2xl"
        >
          {/* Top Brand Monogram Seal */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mx-auto mb-6 flex h-12 w-12 items-center justify-center border border-[#C9A24B] bg-[#1A110D]"
          >
            <span className="font-cinzel text-base font-bold text-[#C9A24B]">H</span>
          </motion.div>

          <div className="flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#C9A24B]/60" />
            <span className="eyebrow tracking-[0.3em]">Nairobi · Ngara Road · Open 24 Hours</span>
            <span className="h-px w-8 bg-[#C9A24B]/60" />
          </div>

          <h1 className="font-cinzel mt-6 text-3xl font-extrabold uppercase tracking-[0.24em] text-[#F3E9D2] sm:text-5xl md:text-6xl">
            HACIENDA
          </h1>

          <p className="font-cormorant mt-4 text-2xl italic text-[#C9A24B] sm:text-3xl md:text-4xl">
            Grill. Sport. Good company.
          </p>

          <p className="mx-auto mt-6 max-w-xl text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/75">
            Nairobi’s late-night grill room for people who like their sport loud,
            their fire slow, and their table easy. Carved cuts over acacia charcoal,
            ice-cold craft pours, and open garden bandas.
          </p>

          {/* Two CTAs */}
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/menu" className="button-gold w-full sm:w-auto">
              View The Menu <ArrowRight size={14} className="ml-2" />
            </Link>
            <Link to="/order" className="button-quiet w-full sm:w-auto">
              Order Online / Table Service
            </Link>
          </div>

          {/* Micro Information Strip */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 border-t border-[#C9A24B]/20 pt-6 text-[10px] uppercase tracking-[0.2em] text-[#F3E9D2]/60">
            <span>Charcoal Hearth</span>
            <span>·</span>
            <span>Live Matches on Screen</span>
            <span>·</span>
            <span>Outdoor Bandas</span>
          </div>
        </motion.div>
      </section>

      {/* 2. Signature Dishes Editorial Chapter with Scroll Reveals */}
      <section className="section-pad border-b border-[#C9A24B]/20 bg-[#0E0B09]">
        <div className="container-hacienda">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 border-b border-[#C9A24B]/20 pb-8 sm:flex-row sm:items-end">
              <div>
                <SectionLabel number="01">The Centerpiece</SectionLabel>
                <h2 className="font-playfair mt-3 text-3xl sm:text-4xl md:text-5xl text-[#F3E9D2]">
                  Carved From The Charcoal
                </h2>
              </div>
              <p className="max-w-md text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/60">
                Each dish floats free from boxed cards, plated on dark timber with deep
                hearth aromas and balanced accompaniments.
              </p>
            </div>
          </Reveal>

          {/* Alternating Left-Right Editorial Story */}
          <div className="mt-14 space-y-16 sm:space-y-24">
            {signatureDishes.map((dish, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={dish.id}
                  className={`grid items-center gap-10 md:grid-cols-2 lg:gap-16 ${
                    isEven ? '' : 'md:grid-flow-dense'
                  }`}
                >
                  {/* Dish Visual with pop-out floating plate */}
                  <Reveal
                    direction={isEven ? 'left' : 'right'}
                    className={isEven ? '' : 'md:col-start-2'}
                  >
                    <div className="relative p-2 sm:p-4">
                      <DishVisual
                        src={dish.image}
                        alt={`${dish.name} plated at Hacienda`}
                        label={dish.name}
                        size="large"
                      />
                    </div>
                  </Reveal>

                  {/* Text Details */}
                  <Reveal
                    direction={isEven ? 'right' : 'left'}
                    className={`space-y-4 ${isEven ? '' : 'md:col-start-1'}`}
                  >
                    <span className="font-mono text-xs tracking-widest text-[#C9A24B]">
                      {String(index + 1).padStart(2, '0')} / SIGNATURE
                    </span>
                    <h3 className="font-playfair text-2xl sm:text-3xl md:text-4xl text-[#F3E9D2]">
                      {dish.name}
                    </h3>
                    <p className="text-sm leading-relaxed text-[#F3E9D2]/70">
                      {dish.description}
                    </p>

                    {dish.tags && (
                      <div className="flex flex-wrap gap-2 pt-2">
                        {dish.tags.map((tag) => (
                          <span
                            key={tag}
                            className="border border-[#C9A24B]/20 bg-[#1A110D] px-2.5 py-1 text-[10px] uppercase tracking-wider text-[#C9A24B]/80"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-6 pt-4">
                      <span className="font-mono text-lg font-bold text-[#C9A24B]">
                        {dish.price ? formatKES(dish.price) : dish.priceLabel}
                      </span>
                      <Link
                        to={`/menu?search=${encodeURIComponent(dish.name)}`}
                        className="button-quiet min-h-[42px] px-5 text-[10px]"
                      >
                        Explore & Customize
                      </Link>
                    </div>
                  </Reveal>
                </div>
              );
            })}
          </div>

          <div className="mt-16 text-center">
            <Reveal direction="up">
              <Link to="/menu" className="button-gold">
                Explore The Entire Menu ({siteConfig.menu.length} Plates & Pours)
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3. Live Grill & Sizzle Section */}
      <section className="section-pad border-b border-[#C9A24B]/20 bg-[#090706]">
        <div className="container-hacienda">
          <Reveal align-center="true">
            <div className="mx-auto max-w-2xl text-center">
              <SectionLabel align="center" number="02">
                Charcoal Mastery
              </SectionLabel>
              <h2 className="font-playfair mt-3 text-3xl sm:text-4xl md:text-5xl text-[#F3E9D2]">
                Live By The Fire
              </h2>
              <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/65">
                Acacia hardwood coals burning red-hot around the clock. Watch our pitmasters
                sear rib cuts, turn goat skewers, and baste with clarified spiced butter.
              </p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={0.2} className="mt-12">
            <LiveGrill />
          </Reveal>
        </div>
      </section>

      {/* 4. Cocktail Bar Teaser */}
      <section className="section-pad border-b border-[#C9A24B]/20 bg-[#0E0B09]">
        <div className="container-hacienda">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal direction="left">
              <div>
                <SectionLabel number="03">Behind The Brass</SectionLabel>
                <h2 className="font-playfair mt-3 text-3xl sm:text-4xl md:text-5xl text-[#F3E9D2]">
                  Craft Pours & Cold Ice
                </h2>
                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/70">
                  A cocktail should feel deliberate in the hand: condensation running down
                  heavy crystal, clear ice, and botanical depth. From smoky bourbon Old
                  Fashioneds to vibrant Electric Blue Lagoons, our bartenders pour with
                  unhurried precision.
                </p>

                <div className="mt-8 grid grid-cols-2 gap-4 border-y border-[#C9A24B]/20 py-6 text-xs text-[#F3E9D2]/80">
                  <div>
                    <span className="font-cinzel block text-sm font-bold text-[#C9A24B]">
                      OLD FASHIONED
                    </span>
                    <span className="mt-1 block text-[#F3E9D2]/60">
                      Bourbon, bitters, flaming peel · KES 650
                    </span>
                  </div>
                  <div>
                    <span className="font-cinzel block text-sm font-bold text-[#C9A24B]">
                      WHISKEY SOUR
                    </span>
                    <span className="mt-1 block text-[#F3E9D2]/60">
                      Citrus sour, silk egg foam · KES 600
                    </span>
                  </div>
                  <div>
                    <span className="font-cinzel block text-sm font-bold text-[#C9A24B]">
                      LONG ISLAND
                    </span>
                    <span className="mt-1 block text-[#F3E9D2]/60">
                      Five spirits, citrus tall glass · KES 800
                    </span>
                  </div>
                  <div>
                    <span className="font-cinzel block text-sm font-bold text-[#C9A24B]">
                      BLUE LAGOON
                    </span>
                    <span className="mt-1 block text-[#F3E9D2]/60">
                      Curaçao, lime, crushed ice · KES 600
                    </span>
                  </div>
                </div>

                <div className="mt-8">
                  <Link to="/menu" className="button-gold">
                    View Full Cocktail List
                  </Link>
                </div>
              </div>
            </Reveal>

            <Reveal direction="right" delay={0.15}>
              <div className="relative">
                <div className="overflow-hidden border border-[#C9A24B]/25">
                  <img
                    src={siteConfig.images.bar}
                    alt="Hacienda cocktail bar with amber glassware and brass taps"
                    loading="lazy"
                    className="h-[440px] w-full object-cover brightness-[0.8] contrast-[1.1] transition-transform duration-700 hover:scale-105"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 5. Sport & Events Strip */}
      <section className="section-pad border-b border-[#C9A24B]/20 bg-[#090706]">
        <div className="container-hacienda">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-6 border-b border-[#C9A24B]/20 pb-8 sm:flex-row sm:items-end">
              <div>
                <SectionLabel number="04">Match Days & Nights</SectionLabel>
                <h2 className="font-playfair mt-3 text-3xl sm:text-4xl md:text-5xl text-[#F3E9D2]">
                  Stay For The Match
                </h2>
              </div>
              <Link to="/events" className="button-quiet text-xs">
                View Fixture Calendar <ArrowRight size={13} className="ml-2" />
              </Link>
            </div>
          </Reveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {siteConfig.events.map((event, idx) => (
              <Reveal key={event.id} direction="up" delay={idx * 0.12}>
                <div className="border border-[#C9A24B]/20 bg-[#160E0A] p-6 transition hover:border-[#C9A24B]/50 hover:bg-[#1C120D] h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="eyebrow">{event.label}</span>
                      {idx === 0 && <Tv size={15} className="text-[#C9A24B]" />}
                      {idx === 1 && <Music size={15} className="text-[#C9A24B]" />}
                      {idx === 2 && <HelpCircle size={15} className="text-[#C9A24B]" />}
                    </div>

                    <h3 className="font-playfair mt-4 text-xl text-[#F3E9D2]">
                      {event.title}
                    </h3>
                    <p className="mt-1 font-mono text-[11px] text-[#C9A24B]/80">
                      {event.subtitle}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-[#F3E9D2]/65">
                      {event.detail}
                    </p>
                  </div>

                  <div className="mt-6 border-t border-[#C9A24B]/15 pt-4 text-[10px] uppercase tracking-wider text-[#F3E9D2]/45">
                    {event.time}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Outdoor Bandas & Dining Philosophy */}
      <section className="section-pad border-b border-[#C9A24B]/20 bg-[#0E0B09]">
        <div className="container-hacienda">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal direction="left" className="order-2 lg:order-1">
              <div className="overflow-hidden border border-[#C9A24B]/25">
                <img
                  src={siteConfig.images.patio}
                  alt="Outdoor seating and private thatched bandas at Hacienda"
                  loading="lazy"
                  className="h-[400px] w-full object-cover brightness-[0.75] contrast-[1.08]"
                />
              </div>
            </Reveal>

            <Reveal direction="right" className="order-1 lg:order-2">
              <div>
                <SectionLabel number="05">The Space</SectionLabel>
                <h2 className="font-playfair mt-3 text-3xl sm:text-4xl text-[#F3E9D2]">
                  Garden Bandas & Open Air
                </h2>
                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/70">
                  Whether you’re arriving for a lively Premier League derby or slipping into a
                  private outdoor banda for late-night ribs and whiskey, Hacienda offers
                  seating that fits your company.
                </p>

                <div className="mt-6 space-y-3 text-xs text-[#F3E9D2]/75">
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 bg-[#C9A24B]" />
                    <span>Private thatched garden bandas for groups of 6 to 20</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 bg-[#C9A24B]" />
                    <span>Main hall sports bar with multi-angle screens</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="h-1.5 w-1.5 bg-[#C9A24B]" />
                    <span>Open 24 hours daily with round-the-clock kitchen</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                  <Link to="/info" className="button-gold">
                    Reserve A Table / Banda
                  </Link>
                  <Link to="/qr" className="button-quiet">
                    Table QR Tent System
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 7. Location & Final Call */}
      <section className="py-20 bg-[#070504] text-center border-b border-[#C9A24B]/20">
        <div className="container-hacienda max-w-2xl">
          <Reveal direction="up">
            <span className="eyebrow">Find Your Seat</span>
            <h2 className="font-playfair mt-3 text-3xl sm:text-4xl text-[#F3E9D2]">
              Ngara Road, Nairobi
            </h2>
            <p className="mt-3 text-xs sm:text-sm text-[#F3E9D2]/65">
              Always open. Sizzling coals, cool breezes, and good tables.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <a
                href={siteConfig.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="button-gold"
              >
                Get Directions <MapPin size={14} className="ml-2" />
              </a>
              <Link to="/order" className="button-quiet">
                Order Online
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
