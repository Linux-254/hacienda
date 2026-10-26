import React, { useState } from 'react';
import { MapPin, Clock, Phone, Car, CreditCard, Accessibility, Users, Send, CheckCircle2 } from 'lucide-react';
import { siteConfig } from '@/config/site.config';
import { SectionLabel } from '@/components/section-label';

export function InfoPage() {
  const [reservation, setReservation] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: '4',
    bandaPreference: 'Private Banda',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleReservation = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = [
      `*HACIENDA TABLE / BANDA RESERVATION*`,
      `Name: ${reservation.name}`,
      `Phone: ${reservation.phone}`,
      `Date & Time: ${reservation.date} at ${reservation.time}`,
      `Party Size: ${reservation.guests} guests`,
      `Area Preference: ${reservation.bandaPreference}`,
      reservation.notes ? `Special Request: ${reservation.notes}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    const url = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(msg)}`;
    window.location.href = url;
    setSubmitted(true);
  };

  return (
    <div className="pt-[74px]">
      <section className="border-b border-[#C9A24B]/20 bg-[#120B08] py-14 sm:py-20">
        <div className="container-hacienda">
          <SectionLabel number="Location">Venue & Practical Details</SectionLabel>
          <h1 className="font-playfair mt-3 text-4xl sm:text-5xl md:text-6xl text-[#F3E9D2]">
            Location & Reservations
          </h1>
          <p className="mt-3 max-w-xl text-xs sm:text-sm leading-relaxed text-[#F3E9D2]/65">
            Everything you need for your visit: 24/7 hours, parking, private banda booking,
            payment methods, and accessibility.
          </p>
        </div>
      </section>

      <section className="section-pad bg-[#0E0B09]">
        <div className="container-hacienda">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Key Venue Details */}
            <div className="space-y-8">
              <div className="border border-[#C9A24B]/25 bg-[#140E0A] p-6 sm:p-8">
                <span className="eyebrow">Operating Hours</span>
                <div className="mt-3 flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-[#C9A24B]" />
                  <div>
                    <h3 className="font-playfair text-xl text-[#F3E9D2]">
                      Open 24 Hours, 7 Days a Week
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#F3E9D2]/65">
                      Our kitchen fires burn around the clock. Whether you are craving
                      fresh dawn bone soup or 2:00 AM nyama choma after the final whistle,
                      the grill is hot.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-[#C9A24B]/25 bg-[#140E0A] p-6 sm:p-8">
                <span className="eyebrow">Address & Parking</span>
                <div className="mt-3 flex items-start gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#C9A24B]" />
                  <div>
                    <h3 className="font-playfair text-xl text-[#F3E9D2]">
                      {siteConfig.address}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#F3E9D2]/65">
                      Conveniently located along Ngara Road, Nairobi with dedicated on-site
                      parking and 24-hour security personnel.
                    </p>
                    <a
                      href={siteConfig.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block font-mono text-xs text-[#C9A24B] hover:underline"
                    >
                      Open in Google Maps ↗
                    </a>
                  </div>
                </div>
              </div>

              <div className="border border-[#C9A24B]/25 bg-[#140E0A] p-6 sm:p-8">
                <span className="eyebrow">Settlement & Payments</span>
                <div className="mt-3 flex items-start gap-3">
                  <CreditCard className="mt-1 h-5 w-5 shrink-0 text-[#C9A24B]" />
                  <div>
                    <h3 className="font-playfair text-xl text-[#F3E9D2]">
                      M-Pesa, Cash & Cards Accepted
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#F3E9D2]/65">
                      We support Lipa Na M-Pesa Buy Goods & Services, physical cash, and
                      all major debit and credit cards (Visa & Mastercard).
                    </p>
                  </div>
                </div>
              </div>

              <div className="border border-[#C9A24B]/25 bg-[#140E0A] p-6 sm:p-8">
                <span className="eyebrow">Accessibility</span>
                <div className="mt-3 flex items-start gap-3">
                  <Accessibility className="mt-1 h-5 w-5 shrink-0 text-[#C9A24B]" />
                  <div>
                    <h3 className="font-playfair text-xl text-[#F3E9D2]">
                      Step-Free Entry & Restrooms
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-[#F3E9D2]/65">
                      The garden patio and main lounge feature level access pathways, and
                      our staff are pleased to assist guests with specific mobility
                      requirements.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Banda / Table Reservation Form */}
            <div className="h-fit border border-[#C9A24B]/35 bg-[#17100B] p-6 sm:p-10">
              <span className="eyebrow">Table & Banda Inquiries</span>
              <h2 className="font-playfair mt-1 text-2xl sm:text-3xl text-[#F3E9D2]">
                Reserve Your Gathering
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#F3E9D2]/65">
                Planning for a big match, birthday celebration, or corporate team dinner?
                Book your private thatched banda in advance.
              </p>

              <form onSubmit={handleReservation} className="mt-6 space-y-4">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={reservation.name}
                    onChange={(e) => setReservation({ ...reservation, name: e.target.value })}
                    placeholder="e.g. David Mwangi"
                    className="input-hacienda mt-1.5"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={reservation.phone}
                    onChange={(e) => setReservation({ ...reservation, phone: e.target.value })}
                    placeholder="07XX XXX XXX"
                    className="input-hacienda mt-1.5"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={reservation.date}
                      onChange={(e) => setReservation({ ...reservation, date: e.target.value })}
                      className="input-hacienda mt-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={reservation.time}
                      onChange={(e) => setReservation({ ...reservation, time: e.target.value })}
                      className="input-hacienda mt-1.5 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                      Party Size
                    </label>
                    <select
                      value={reservation.guests}
                      onChange={(e) => setReservation({ ...reservation, guests: e.target.value })}
                      className="input-hacienda mt-1.5 text-xs"
                    >
                      <option value="2">2 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="6">6 Guests</option>
                      <option value="8">8 Guests</option>
                      <option value="12">12 Guests</option>
                      <option value="16">16+ Guests (Full Banda)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                      Seating Area
                    </label>
                    <select
                      value={reservation.bandaPreference}
                      onChange={(e) => setReservation({ ...reservation, bandaPreference: e.target.value })}
                      className="input-hacienda mt-1.5 text-xs"
                    >
                      <option value="Private Banda">Private Garden Banda</option>
                      <option value="Sports Bar Hall">Main Sports Lounge</option>
                      <option value="Open Air Patio">Open Air Patio</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-[#C9A24B]">
                    Special Requests or Occasion
                  </label>
                  <textarea
                    rows={2}
                    value={reservation.notes}
                    onChange={(e) => setReservation({ ...reservation, notes: e.target.value })}
                    placeholder="e.g. Watching the Manchester derby, require screen view"
                    className="input-hacienda mt-1.5 min-h-[64px] py-2 text-xs"
                  />
                </div>

                <button type="submit" className="button-gold mt-6 w-full text-xs">
                  <Send size={14} className="mr-2" /> Send Reservation Request via WhatsApp
                </button>

                <p className="mt-3 text-[10px] text-center text-[#F3E9D2]/50">
                  Reservations are confirmed promptly by our front-of-house team.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
