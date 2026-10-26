# Hacienda Sports Bar & Grill — Nairobi

A luxury, old-money steakhouse and sports bar web platform with digital QR table ordering, Safaricom Daraja M-Pesa STK Push integration, WhatsApp kitchen dispatch, and authoritative server quote verification.

---

## 1. Quick Start & Architecture

- **Framework:** React 19 + TypeScript + Vite + Express (full-stack server) + Tailwind CSS
- **Design Language:** Modern old-money steakhouse: dark walnut, acacia charcoal heat, brass accents, Cormorant Garamond / Playfair Display editorial typography.
- **Single Source of Truth:** `src/config/site.config.ts` controls all client information, menu items, prices, add-on pricing, M-Pesa credentials, event schedules, and photography.
- **Official Client Phone:** `0708 808 168` (local) / `254708808168` (international WhatsApp API)

```bash
# Install dependencies
npm install

# Run full-stack dev server (port 3000)
npm run dev

# Build production assets
npm run build
```

---

## 2. Vercel Configuration & Routing Mapping

The platform is designed to run seamlessly on Vercel with dedicated routes:

| Route Path | Experience | Purpose |
| :--- | :--- | :--- |
| **`/`** | **Main Brand Website** | Cinematic hero, grill story, sports screening fixtures, guest reviews, banda reservation inquiry, location & 24/7 hours. |
| **`/menu`** | **Digital Menu Station** | Categorized food & drink catalog with 2-column mobile layout, live search, dietary/spice filters, and dish customization modal. |
| **`/order`** | **Cart & Checkout Station** | Step-by-step cart review, dining method selection (`table`, `pickup`, `delivery`), M-Pesa STK Push payment, and WhatsApp dispatch. |
| **`/order?table=N`** | **Direct Table QR Landing** | Automatically pre-locks Table `N` into the diner's cart with Dine-In mode selected. |
| **`/menu?table=N`** | **Menu Browse QR Landing** | Opens the menu with Table `N` pinned for easy ordering. |
| **`/qr`** | **QR Table Tent Generator** | Printable high-res A5 table tent sheets with scannable QR codes for Tables 1–30 and Bandas 1–5. Includes host domain switchers. |
| **`/events`** | **Match Day & Music** | Premier League, Champions League, Rugby schedules, and weekend live acoustic sets. |
| **`/about`** | **Heritage & Philosophy** | Charcoal grill techniques, local Kenyan meat sourcing, mixology standards. |
| **`/info`** | **Location & Practicalities** | Google Maps directions, 24/7 hours, parking, accessibility, payment methods. |
| **`/order/confirmed`**| **Order Confirmation** | Dispatched order receipt with verified totals and M-Pesa transaction reference. |

### Vercel Serverless Endpoints (`api/`)
- **`/api/order/quote`**: Computes authoritative prices from the server catalog, ensuring clients cannot tamper with subtotals.
- **`/api/mpesa/stkpush`**: Initiates Lipa Na M-Pesa Online STK Push via Safaricom Daraja Sandbox.
- **`/api/mpesa/query/:id`**: Checks transaction status.

---

## 3. QR Code Scanning & Access Resolution

### Why phone scans reported "Didn't have access":
- In Google Cloud Run / AI Studio dev mode, internal browser URLs start with `https://ais-dev-...`. These dev containers require an authorized Google login session, so phone cameras scanning that URL were prompted to log in.
- The publicly accessible shareable domain for this applet is `https://ais-pre-3fnonwn7je3erecw633mdg-620457192074.europe-west2.run.app`. This URL requires **zero authentication** and works on any phone camera.
- In `src/pages/qr.tsx`, the generator automatically resolves to `ais-pre-...` by default, and provides one-click switches for **Vercel Production Domain** and **Custom Domain (`hacienda.ke`)**.

---

## 4. Safaricom Daraja M-Pesa STK Push Integration

The application integrates Lipa Na M-Pesa Online with credentials:
- **App Name:** `hacienda`
- **Short Code:** `174379`
- **Consumer Key:** `whD7EzibRbuNkYLKuAfR1H8Yzug18AG0bm5yhqnA5CpcxzWO`
- **Consumer Secret:** `2jtz8HVJAAQ0GGPEBvPIRkgweKOuuYgllhYVCFvxOq8LS8KgU6CmRnhm3pJakLNr`
- **Passkey:** `bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`
- **Environment:** `Sandbox` (`https://sandbox.safaricom.co.ke`)

### How the Demo Workflow Operates:
1. Diner adds dishes to cart and proceeds to **`/order`**.
2. Selects **"Lipa Na M-Pesa (STK Push to Phone)"**.
3. Confirms Safaricom phone number (`0708 808 168` by default or custom).
4. Clicks **"Send M-Pesa STK Push"**.
5. Server calls Daraja `oauth/v1/generate` and `mpesa/stkpush/v1/processrequest`.
6. Interactive pop-up dialog displays prompt status, paybill number (`174379`), and a 60s countdown.
7. Includes an instant **"Demo: Simulate PIN Accepted"** button for pitch presentations.
8. Once verified, generates official M-Pesa receipt format (`QKH97XR2B1`), marks order as `PAID`, and dispatches to WhatsApp with verified receipt attached.

---

## 5. Contact & Venue

- **Venue:** Hacienda Sports Bar & Grill
- **Location:** Ngara Rd, Nairobi, Kenya
- **Phone:** `0708 808 168`
- **WhatsApp:** `254708808168`
- **Hours:** Open 24 Hours, 7 Days a week
