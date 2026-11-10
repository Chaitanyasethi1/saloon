# QueueWise — Haute Coiffure & Live Token Booking Platform

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres%20%2B%20RLS-3ECF8E?style=flat-square&logo=supabase)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **"Book your turn. Skip the wait."**  
> QueueWise is a cinematic, dark luxury salon discovery and real-time token orchestration platform built for high-end salons and discerning clients across India.

---

## 🌟 Key Product Innovations & Highlights

1. **Cinematic Dark Luxury Aesthetic**:
   - Deep charcoal canvas (`#0A0A0B`, `#111114`, `#17171B`) accented with **Champagne Gold** (`#E6C887` → `#B8893B`) and a soft **Rose/Copper glow** (`#D98B73`).
   - High-contrast typography: *Cormorant Garamond* (headings), *Plus Jakarta Sans* (interface), and *Space Grotesk* (token counters).
   - Glassmorphic panels with subtle gold-frosted borders, noise overlay, and custom gold scrollbars.

2. **Sequential Token Generation & Dynamic Wait Algorithm**:
   - Atomic token sequencing per salon per date.
   - Dynamic estimated wait time calculation based on services duration divided across active styling chairs:
     $$\text{Est. Wait} = \left\lceil \frac{\text{Tokens Ahead} \times \text{Avg Service Duration}}{\text{Active Chairs}} \right\rceil$$

3. **Digital Boarding-Pass Token Ticket (`/token/[id]`)**:
   - Luxury ticket card with ticket notches, gold foil borders, and dynamic wait ticker.
   - High-density SVG QR code for touchless salon concierge scanning.
   - Live status transitions: `booked` → `checked_in` → `in_service` → `completed` (plus `cancelled`, `no_show`, `skipped`).

4. **TV Waiting Room Kiosk (`/display/[salonSlug]`)**:
   - Full-screen cinema mode for in-salon TVs and reception tablets.
   - Automated Voice Announcements via Web Speech API (*"Token number 14, please proceed to Chair 1"*).
   - Audio chime synthesizer, now serving spotlight, and next-in-line ticker.

5. **1-Tap Owner Live Queue Console (`/dashboard/owner`)**:
   - 1-tap **"Call Next"** button that automatically advances the queue and alerts the TV display.
   - Fast **Walk-in & VIP Priority Token** generation for reception desks.
   - **Broadcast Delay** modal to notify all queued guests in 1 click (e.g. *"Running 15 mins late"*).
   - QR Scanner / Manual Check-In modal.
   - Recharts visual analytics (Turnover, Peak-hour heatmaps, CSV exports).

---

## 👥 Seed Demo Credentials

QueueWise is pre-seeded with 4 roles and 8+ premier salons across Mumbai, Delhi, Bangalore, and Goa. You can also switch roles with a single click using the **Floating Demo Role Switcher** at the bottom-right of the screen!

| Role | Email / Identifier | Password | Default Dashboard |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@queuewise.app` | `Admin@123` | [`/dashboard/admin`](http://localhost:3000/dashboard/admin) |
| **Salon Owner** | `owner@demo.com` | `Owner@123` | [`/dashboard/owner`](http://localhost:3000/dashboard/owner) |
| **Staff / Stylist** | `staff@demo.com` | `Staff@123` | [`/dashboard/staff`](http://localhost:3000/dashboard/staff) |
| **Customer** | `customer@demo.com` | `Customer@123` | [`/dashboard/customer`](http://localhost:3000/dashboard/customer) |

*(Note: You can also log in using username or phone number on the split-screen auth page!)*

---

## 🚀 Quickstart Guide

### 1. Prerequisites
- Node.js 18.17+ or 20+
- npm, yarn, or pnpm

### 2. Installation
```bash
# Clone or navigate to the repository
cd salon

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗄️ Database & Supabase Configuration

QueueWise features a dual-mode storage layer:
- **Default Standalone Mode**: Works immediately out of the box with persistent local state, realistic seed data for 8+ salons, live queues, and demo accounts.
- **Supabase Cloud Mode**: Connect your Supabase project in `.env.local` to enable remote PostgreSQL storage and Realtime websocket broadcasts.

### Step-by-Step Supabase Setup:

1. Create a new project in [Supabase](https://supabase.com/).
2. In your Supabase SQL Editor, run the full schema script located at:
   ```
   supabase/migrations/20261110_init_queuewise.sql
   ```
3. Copy your project URL and anon public key into `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
   ```
4. Restart Next.js server (`npm run build && npm start`).

---

## 📁 Project Directory Structure

```
salon/
├── app/
│   ├── layout.tsx                     # Fonts, Theme provider, Toaster, Demo switcher
│   ├── page.tsx                       # Landing page (Hero, Stats, Services, Salons, FAQ)
│   ├── globals.css                    # Luxury dark palette, glassmorphism, gold scrollbars
│   ├── (auth)/
│   │   ├── login/page.tsx             # Split-screen auth with 1-click demo fillers
│   │   ├── register/page.tsx          # Customer & Salon Owner onboarding
│   │   └── forgot-password/page.tsx   # Password recovery flow
│   ├── salon/
│   │   ├── [slug]/page.tsx            # Salon detail (Gallery, Services, Stylists, Reviews)
│   │   └── [slug]/book/page.tsx       # 4-step token booking flow
│   ├── token/
│   │   └── [id]/page.tsx              # Boarding-pass live token tracking & QR code
│   ├── display/
│   │   └── [salonSlug]/page.tsx       # Full-screen TV Kiosk with Speech Synthesis chime
│   ├── dashboard/
│   │   ├── customer/page.tsx          # Active token, booking history, loyalty points
│   │   ├── owner/page.tsx             # Live queue, Call Next, Walk-ins, CSV exports
│   │   ├── staff/page.tsx             # Chair allocation, current customer, service timer
│   │   └── admin/page.tsx             # Salon approvals, user directory, audit logs
│   ├── api/
│   │   ├── salons/route.ts            # Salon search & filter API
│   │   └── tokens/route.ts            # Token creation endpoint
│   ├── not-found.tsx                  # Luxury 404 error page
│   └── error.tsx                      # Application error boundary
├── components/
│   ├── navigation/
│   │   ├── Navbar.tsx                 # Sticky glass navbar with role indicators
│   │   └── MobileBottomBar.tsx        # Mobile tab bar for bottom navigation
│   ├── landing/
│   │   ├── HeroSection.tsx            # Headline + live animated token card
│   │   ├── StatsStrip.tsx             # 30s booking, 0MB download stats
│   │   ├── PopularServices.tsx        # Hair, Color, Spa, Shave, Bridal cards
│   │   ├── HowItWorks.tsx             # 4-step interactive timeline
│   │   ├── SalonDirectory.tsx         # Multi-filter search + Map view toggle
│   │   ├── ForOwnersSection.tsx       # Live queue console showcase
│   │   ├── TestimonialsSection.tsx    # Curated client praise
│   │   ├── FaqSection.tsx             # Accordion FAQs
│   │   └── Footer.tsx                 # Brand footer
│   └── shared/
│       └── DemoAccountSwitcher.tsx    # 1-tap role switcher pill
├── lib/
│   ├── db/
│   │   ├── store.ts                   # Zustand state & persistent queue management
│   │   └── supabase.ts                # Supabase client wrapper
│   ├── seed/
│   │   └── data.ts                    # 8+ luxury salons (Mumbai, Delhi, Bangalore, Goa)
│   ├── types.ts                       # Complete TypeScript domain interfaces
│   └── utils.ts                       # Currency, duration, wait-time calculators
├── supabase/
│   └── migrations/
│       └── 20261110_init_queuewise.sql # PostgreSQL schema, RLS policies, atomic RPC
└── tailwind.config.ts                 # Luxury color extensions & animations
```

---

## 📋 Deliverable & Verification Checklist

- [x] **Tech Stack**: Next.js 14 App Router, TypeScript, Tailwind CSS, Framer Motion animations, Recharts, `qrcode.react`, Sonner toasts, Canvas Confetti.
- [x] **Design System**: Dark luxury theme (`#0A0A0B`), Champagne gold gradients, copper glow, glassmorphism, Google Fonts (*Cormorant Garamond*, *Plus Jakarta Sans*, *Space Grotesk*), custom gold scrollbar, mobile bottom navigation.
- [x] **Roles & Authentication**: Support for Customer, Salon Owner, Staff, Super Admin; split-screen login with 1-click demo fillers, lockout protection, strength meter.
- [x] **Landing Page (`/`)**: Hero with live ticking token card, stats strip, popular services, 4-step how it works, filterable salon directory with metro and gender filters + map toggle, owner pitch, testimonials, FAQ, footer.
- [x] **Salon Detail (`/salon/[slug]`)**: Gallery, services menu with pricing, stylist bios with ratings, opening schedule, customer reviews, sticky booking CTA.
- [x] **Token Booking Stepper (`/salon/[slug]/book`)**: 4-step wizard with auto-calculated duration & price, slot availability, stylist selection, atomic token generator.
- [x] **Live Boarding Pass Ticket (`/token/[id]`)**: Boarding pass layout with ticket notches, live ETA, QR code, check-in button, cancellation action.
- [x] **TV Display Kiosk (`/display/[salonSlug]`)**: Full-screen cinema mode with Web Speech API voice announcements, chime synthesizer, now serving spotlight, next 5 tokens.
- [x] **Salon Owner Panel (`/dashboard/owner`)**: Live Queue console, 1-tap "Call Next", Add Walk-In modal, Broadcast Delay modal, QR scan check-in, Recharts analytics, CSV export.
- [x] **Staff Panel (`/dashboard/staff`)**: Dedicated chair view, current customer, service countdown timer, upcoming customer list.
- [x] **Super Admin Panel (`/dashboard/admin`)**: Salon approval pipeline (Pending/Approved/Suspended), user accounts manager, immutable audit trail.
- [x] **Database & Migrations**: Complete PostgreSQL migration script (`20261110_init_queuewise.sql`) with RLS policies, unique constraints, and atomic token generator RPC.
- [x] **Verification**: Zero TypeScript build errors, static generation verified across all 13 routes, and 6 high-resolution desktop & mobile screenshots captured.

---

© 2026 QueueWise Haute Technologies. Crafted for bespoke salon elegance.

