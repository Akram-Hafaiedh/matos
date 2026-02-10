# Mato's - Premium Food Ordering System

Mato's is a high-end, modern food ordering web application built with a focus on **Premium Aesthetics** and **Seamless User Experience**. It features a glassmorphism design system, real-time notifications, and a robust loyalty reward system.

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React, Tailwind CSS
- **Design Core**: Glassmorphism, HSL-curated color palettes, Lucide Icons, Framer Motion
- **Backend & Database**: Next.js API Routes, Prisma ORM, PostgreSQL
- **Authentication**: NextAuth.js with Credentials & Prisma Adapter
- **Maps**: Leaflet (React-Leaflet) for interactive location tracking

## 💎 Key Features

- **Premium Menu**: Dynamic category filtering, search, and pagination with smooth URL synchronization.
- **Transparent Cart**: Advanced promotion engine with real-time price breakdowns, strike-through original prices, and "badge-ified" bundle details.
- **Fidelity Program**: Automated point awarding, global rank flairs (King/Challenger), and exclusive tiers.
- **Real-time Engine**: Live typing indicators in support, instant notifications, and order status polling.
- **Legal Protocols**: Premium, glassmorphism redesign of Terms and Policy pages with kinetic typography and animated brand cards.
- **Admin Command Center**: Visual stats dashboard, live order management with 'SideDrawer' tactical controls, and global settings control.

## 🛠️ Getting Started

First, install dependencies:
```bash
npm install
```

Configure your `.env` file with database and auth secrets, then run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📅 Recent Progress

### 🛡️ Sprint 1: Security & Foundation [COMPLETED]
- [x] **Price Integrity**: Server-side validation of cart totals to prevent malicious tampering.
- [x] **Authentic Presence**: Removal of spoofed review/like counts to protect brand credibility.
- [x] **Booking Engine**: Core implementation of the missing table reservation system.
- [x] **Logic Consolidation**: Unified pricing engine for consistency between context and UI.
- [x] **Tactical Dashboard**: Multi-view (Grid, List, Timeline) admin command center for reservations.

### 📡 Sprint 2: Logistics & User Feedback (Active)
- [ ] **Configurable Integrations**: Unified "Mission Control" for SMS (Ooredoo, TT, Twilio) and Email SMTP.
- [ ] **Visual Tracking**: High-fidelity `/track` page with real-time status animation.
- [ ] **Settings Overhaul**: Complete redesign of the Admin ConfigHub for centralized system control.
- [ ] **Tunisian Tax Engine**: Localized fiscal module (VAT/Stamp duty) following Tunisian standards.

### 🏆 Phase 3: Identity & Loyalty (Active)
- [x] **Quest System Engine**: Transitioned to a fully database-driven system with advanced validation (streaks, cumulative spend, temporal constraints).
- [x] **Dynamic Loyalty Identity**: Real-time sync for user stats, tier-based acts, and verified histories on the Identity page.
- [x] **Workshop Personalization**: Profile integration for custom frames, icons, and backgrounds with tier-gating and grandfathered access.
- [x] **Database-Oriented Boosters**: Migrated legacy hardcoded multipliers to a dynamic schema-driven system supporting stacked XP and Token rewards.
- [x] **SideDrawer UI Engine**: Implementation of a premium, animated reusable drawer component for complex administrative and user workflows.
- [x] **Synced Header Ecosystem**: Native `UserProfileHeader` for instant visual feedback on personalization across the entire app.

### 🛒 Commerce & UX Optimization
- [x] **Pricing Transparency**: Implemented full savings breakdowns and correction of promotion database configurations.
- [x] **Cart Page Parity**: Fully synchronized sidebar and main cart pages with identical UI/UX and pricing logic.
- [x] **Automatic Bundle Details**: Fixed deals (e.g., Double Box) now show their full contents as badges in the cart.
- [x] **Premium Confirmation**: Replaced all native browser alerts with custom glassmorphism modals and a global `useConfirm()` hook.
- [x] **Menu & Category Perfection**: Automated category shifting, order normalization, and dynamic database navigation.

### 🛠️ Infrastructure & Standardization (Active)
- [x] **Next.js ISR Implementation**: Deployed Incremental Static Regeneration (revalidate: 60) across all content-heavy public pages (FAQ, Menu, Promos, Legal) for lightning-fast delivery.
- [x] **Prisma Client Self-Healing**: Automated detection and re-instantiation of stale Prisma instances in development, ensuring zero-downtime during HMR.
- [x] **Database Schema Standardization**: Comprehensive migration to `snake_case` and pluralized model names (e.g., `orders`, `reviews`) to ensure strict PostgreSQL compatibility.
- [x] **API Route Harmonization**: Refactored the entire API layer to utilize theized schema, resolving naming inconsistencies and lint errors.
- [x] **Security-First Seeder**: Updated the `prisma/seed.ts` engine with automated password hashing and strict field validation.

### 🏛️ Admin UI & Systems (Active)
- [x] **Global Admin Pagination**: Integrated server-side pagination across high-traffic management pages (Customers, Reviews, Support) with dynamic metadata syncing.
- [x] **Navigation Architecture**: Grouped communication channels (Inbox, Email Hub) under a unified "COMMUNICATIONS" sidebar section for better mental modeling.
- [x] **Data Mapping Standardization**: Harmonized inconsistent user relations (user vs users) across administrative APIs to ensure stable `UserAvatar` rendering.
- [x] **Inbox Experience Refinement**: Synchronized the layout and spacing of the localized Boîte de Réception (/inbox) with the premium Station Email.
- [x] **Command Center Dashboard**: Visual stats matrix and order management overhaul (Initial Phase Complete).
- [ ] **Tunisian Tax Engine**: Specialized module for localized tax calculations (VAT/Stamp duty) following Tunisian fiscal standards.
- [ ] **Security Protocol Implementation**: Advanced logging, session auditing, and role-based access control (RBAC) reinforcement.

## 🛠️ Developer Utilities & Scripts

The repository includes several utility scripts and data snapshots for development and testing:

### Database & Data
- `temp_promo_dump.json`: Snapshot of the promotion engine's database state, used for logic verification.
- `test_empty.json` / `test_output.json`: Mock review data used for testing the "Social Proof" simulation engine and review curation features.

### Command Line Tools
- `scripts/check-db.ts`: Utility to verify database connectivity and Prisma client state.
- `scripts/list-categories.js`: Fast lookup tool for category IDs and display orders.
- `inspect_rules.js`: Logic inspector for the advanced promotion selection engine.

---
Mato's - *Le Goût Privilégié*
