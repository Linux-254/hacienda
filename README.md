# Hacienda Sports Bar & Grill — Nairobi

A luxury, old-money steakhouse and sports bar web platform with digital QR table ordering, WhatsApp kitchen dispatch, and authoritative server quote verification.

---

## 1. Quick Start & Architecture

- **Framework:** React 19 + TypeScript + Vite + Express (full-stack server) + Tailwind CSS
- **Design Language:** Modern old-money steakhouse: dark walnut, acacia charcoal heat, brass accents, Cormorant Garamond / Playfair Display editorial typography.
- **Single Source of Truth:** `src/config/site.config.ts` controls all client information, menu items, prices, add-on pricing, event schedules, and photography.

```bash
# Install dependencies
npm install

# Run full-stack dev server (port 3000)
npm run dev

# Build production assets
npm run build
```

---

## 2. How to Edit Configuration & Prices

All prices, client contact details, and menu items live in **`src/config/site.config.ts`**:

1. **Changing Prices:**
   - Locate the item under `siteConfig.menu`.
   - Update `price: 1200` to the new figure in KES.
   - For items with fluctuating market rates, use `priceLabel: 'Ask staff'`.
2. **Editing Accompaniments & Vegetables:**
   - Under `siteConfig.addOns.accompaniments` and `siteConfig.addOns.vegetables`, update the item names and prices.
3. **Updating Phone & WhatsApp Number:**
   - Change `phone: '07XX XXX XXX'` to the official front-of-house phone.
   - Change `whatsapp: '2547XXXXXXXX'` to the official 12-digit international format WhatsApp line (e.g. `254712345678`).
4. **Updating Match Day Fixtures & Events:**
   - Edit `siteConfig.events` array with upcoming game details, times, and acoustic set schedules.
5. **Today's Specials:**
   - Populate `siteConfig.specials` array to showcase featured cuts.

---

## 3. QR Table Ordering System

- Visit **`/qr`** to generate printable table tent cards for tables 1 through 30.
- Each QR encodes the URL: `https://<domain>/order?table=N`.
- When a diner scans the tent with their smartphone, their table number is automatically locked into the ordering station.
- Staff can download high-resolution PNGs or click **"Print / Save PDF"** formatted for standard A5 acrylic tent stands.

---

## 4. WhatsApp Order Dispatch & Server Quotes

- When a guest reviews their cart and clicks **"Send Order via WhatsApp"**, the client sends the line items to `/api/order/quote`.
- The server recalculates subtotals and grand totals strictly from the authoritative server catalog (preventing client-side price tampering).
- The formatted order summary (Order ID, Table/Pickup, Itemized lines, Cooking styles, Sides, Verified Total, Guest Name & Phone) is formatted into WhatsApp URL syntax and opens directly on the guest's device.

---

## 5. Phase 5 M-Pesa STK Push Integration (Deferred)

As specified in the implementation brief, direct Safaricom Daraja Lipa Na M-Pesa Online STK Push is deferred to Phase 5. In this phase:
- Payments are settled upon service at the table or upon delivery (Cash, M-Pesa Till/Paybill, or Credit Card).
- When Phase 5 is triggered, the server endpoint `/api/mpesa/stkpush` and callback handler `/api/mpesa/callback` can be activated using official Daraja credentials.

---

## 6. Placeholders & Honest Disclosures

In accordance with our production checklist (no invented history, awards, or fake testimonials):
- **Phone:** `07XX XXX XXX` (configured in `site.config.ts`)
- **WhatsApp:** `2547XXXXXXXX` (configured in `site.config.ts`)
- **TBC Items:** Soups, certain cocktails, and mocktails with seasonal market pricing are marked **"Ask staff"**.
- **Imagery Note:** All food and cocktail visuals are illustrative, curated to represent East African steakhouse hospitality.
