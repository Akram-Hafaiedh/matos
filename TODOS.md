# Mato's Project Roadmap

## Core Features & Foundation
- [x] Add real product images
- [x] Add user authentication (NextAuth)
- [x] Promotion Management (CRUD)
- [x] Category Management (CRUD)
- [x] Menu Item Management (CRUD)
- [x] Promotion Selection Choices (Customizable offers)
- [x] Order Management (Listing & Status updates)
- [x] Basic Checkout flow (Delivery & Payment)

## Infrastructure & System Stability
- [x] Fix SessionProvider in Root Layout for optimal auth
- [x] **Prisma Configuration**: Optimized client generation and PostgreSQL adapter
- [x] **Checkout Reliability**: Fixed UID collisions, scheduled time parsing
- [x] **Prisma Sync**: Database push and Client generation established
- [x] **API Robustness**: Improved error handling and descriptive feedback
- [x] **Database Standardization**: Global migration to `snake_case` and pluralized model names (`orders`, `reviews`, `menu_items`) for Postgres compliance
- [x] **Schema-Safe APIs**: Refactored 30+ routes to align with the standardized Prisma naming conventions
- [x] **Seeder Security**: Implemented password hashing and strict schema seeding for dev environments

## Design & Theme Excellence
- [x] Redesign Contact & Support pages (Premium Aesthetic)
- [x] Redesign Promos & Menu pages (Premium Aesthetic)
- [x] Refine Home Page Promo Slider
- [x] Redesign Footer (Premium aesthetic)
- [x] Redesign Cart and PromotionConfigModal (Glassmorphism)
- [x] Home Page Map: Full-width interactive Leaflet map (Carthage)
- [x] Premium Success Toast during checkout transitions

## Advanced User Experience & Checkout Flow
- [x] Dedicated Client Dashboard & Profile editing
- [x] **Unified Avatar System**: High-fidelity `UserAvatar` with Global Rank Flairs.
- [x] **Selection Wizard Restoration**: Rebuilt the multi-step `SelectionModal` for complex promotions (2-pizza deals, student menus).
- [x] **Cart Image Parity**: Synchronized visual styles and promotion badges between Sidebar and Main Cart page.
- [x] **Registration Bonus**: 10-point welcome gift automatically awarded.
- [x] **Review Reward System**: Automated point awarding for customer reviews.
- [x] **Support Hub**: Moved tickets to `/account/tickets`, restored full conversation UI.
- [x] **Storage & Media**: Paste-to-upload for ticket attachments.
- [x] **Leaderboard System**: Fidelity Leaderboard and Hall of Fame (Transparent state).
- [x] Dedicated `/cart` page (Mobile-optimized UX).

## Admin & Control Panel
- [x] Fix search & pagination in all Admin lists
- [x] Admin Notification Center (Order updates, Tickets)
- [x] Admin Account Management (Profile & Security)
- [x] **Client CRM**: Manage customers and loyalty points directly
- [x] **Review Curation**: Manage and feature customer reviews on home page
- [x] Integrate Public site links in Admin Sidebar
- [x] **Admin Global Settings**: Manage address, phone, and coordinates from dashboard

## Phase 3: Identity & Loyalty Overhaul
- [x] **Public Header Sync**: Propagated "Scanner Pill" style to all public heroes.
- [x] **Fidelity Overhaul**: Complete redesign with 10-tier Act system, Quests, and Token Shop.
- [x] **Avatar Personalization**: High-end showcase for custom borders, kinetic backgrounds, and exclusive emojis.
- [x] **Database-Driven Quest System**: Automated validation logic for streaks, spending thresholds, and temporal bonuses.
- [x] **Real-time Identity Profile**: Dynamic sync for user status, medals of service, and verified operation history.
- [x] **Header Dropdown Sync**: Native `UserProfileHeader` for seamless visual persistence of customization across routes.

## UI/UX Technical Challenges

### Slanted Sections (Geometric Slopes)
- **Status**: Exploration phase
- **Context**: Used in `fidelity` and CTA sections.
- **Challenge**: Absolute positioning and complex `clip-path` geometry make responsive layout tricky.
- **Todo**: Research reliable responsive clip-path strategies or CSS skew transformations.

## Pending & Future Roadmap
- [ ] **Admin Orders Page**: Redesign for high-intensity worker usage (Compact view, detailed order expander).
- [ ] **Admin Dashboard Polish**: Further refine UI consistency and ergonomics.
- [ ] **Quest Celebration FX**: Particle effects and cinematic overlays for quest completion.
- [ ] **SMS Engine**: Automated notifications for order status.
- [ ] **Tracking Page**: High-fidelity visual feedback for real-time status transitions.
- [ ] **Online Payments**: Integration with Stripe/Local gateways.