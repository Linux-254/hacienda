import React from 'react';
import { Link } from 'react-router-dom';
import { Tv, Music, HelpCircle, Calendar, Clock, MapPin, ArrowRight, Trophy } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { SectionLabel } from '@/components/section-label';

export function EventsPage() {
  return (
    <div className="pt-[74px]">
      <section className="border-b border-[#C9A24B]/20 bg-[#120B08] py-14 sm:py-20">
        <div className="container-hacienda">
          <SectionLabel number="Calendar">Match Fixtures & Live Sets</SectionLabel>
          <h1 className="font-playfair mt-3 text-4xl sm:text-5xl md:text-6xl text-[#F3E9D2]">
            Sport, Sound & Evenings
          </h1>
          <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/65">
            The screen is always on, the drinks are always cold, and the bands play late.
            Reserve a banda or join the main hall crowd for the big fixtures.
          </p>
        </div>
      </section>

      <section className="section-pad bg-[#0E0B09]">
        <div className="container-hacienda">
          {/* Main Three Event Pillars */}
          <div className="grid gap-8 md:grid-cols-3">
            {siteConfig.events.map((evt, idx) => (
              <div
                key={evt.id}
                className="flex flex-col justify-between border border-[#C9A24B]/25 bg-[#140E0A] p-7 transition hover:border-[#C9A24B]/60 hover:bg-[#1A120D]"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="eyebrow">{evt.label}</span>
                    {idx === 0 ? (
                      <Tv size={18} className="text-[#C9A24B]" />
                    ) : idx === 1 ? (
                      <Music size={18} className="text-[#C9A24B]" />
                    ) : (
                      <HelpCircle size={18} className="text-[#C9A24B]" />
                    )}
                  </div>

                  <h2 className="font-playfair mt-5 text-2xl text-[#F3E9D2]">
                    {evt.title}
                  </h2>
                  <p className="mt-1 font-mono text-xs text-[#C9A24B]">
                    {evt.subtitle}
                  </p>

                  <p className="mt-4 text-xs leading-relaxed text-[#F3E9D2]/70">
                    {evt.detail}
                  </p>
                </div>

                <div className="mt-8 border-t border-[#C9A24B]/15 pt-5">
                  <div className="flex items-center gap-2 text-[11px] text-[#F3E9D2]/60">
                    <Clock size={13} className="text-[#C9A24B]" />
                    <span>{evt.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Upcoming Match Schedule / Fixture Preview */}
          <div className="mt-16 border border-[#C9A24B]/20 bg-[#160E0A] p-8 sm:p-12">
            <div className="flex flex-col justify-between gap-4 border-b border-[#C9A24B]/20 pb-6 sm:flex-row sm:items-center">
              <div>
                <span className="eyebrow">Match Day Schedule</span>
                <h3 className="font-playfair mt-1 text-2xl sm:text-3xl text-[#F3E9D2]">
                  Upcoming Featured Screenings
                </h3>
              </div>
              <span className="text-[10px] uppercase tracking-wider text-[#C9A24B]">
                Multi-Screen Audio in Bandas
              </span>
            </div>

            <div className="mt-8 space-y-4">
              {[
                {
                  league: 'Premier League Matchday',
                  match: 'Arsenal vs Manchester City',
                  time: 'Saturday · 7:30 PM EAT',
                  screens: 'Main Hall & Garden Bandas 1 - 4',
                },
                {
                  league: 'UEFA Champions League',
                  match: 'Real Madrid vs Bayern Munich',
                  time: 'Tuesday · 10:00 PM EAT',
                  screens: 'Full Audio in Banda 1 & Lounge Screens',
                },
                {
                  league: 'World Rugby 7s Series',
                  match: 'Shujaa Kenya 7s Pool Stage Matches',
                  time: 'Sunday · All Day',
                  screens: 'All Outdoor Patio Screens',
                },
              ].map((m, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between gap-4 border border-[#C9A24B]/15 bg-[#0D0B09] p-5 sm:flex-row sm:items-center"
                >
                  <div className="flex items-start gap-4">
                    <Trophy className="mt-1 h-5 w-5 shrink-0 text-[#C9A24B]" />
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                        {m.league}
                      </span>
                      <h4 className="font-playfair text-lg text-[#F3E9D2]">
                        {m.match}
                      </h4>
                      <p className="text-xs text-[#F3E9D2]/50">{m.screens}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                    <span className="font-mono text-xs font-semibold text-[#F3E9D2]/90">
                      {m.time}
                    </span>
                    <Link
                      to="/info"
                      className="text-[10px] uppercase tracking-wider text-[#C9A24B] hover:underline"
                    >
                      Reserve Banda →
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center sm:text-left text-xs text-[#F3E9D2]/50">
              * Fixture schedule is updated weekly. Sound prioritizes major matches with Kenyan fanbases.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
