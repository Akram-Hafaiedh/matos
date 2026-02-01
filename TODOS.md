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

## Design & Theme Excellence
- [x] Redesign Contact & Support pages (Premium Aesthetic)
- [x] Redesign Promos & Menu pages (Premium Aesthetic)
- [x] Refine Home Page Promo Slider
- [x] Redesign Footer (Premium aesthetic)
- [x] Redesign Cart and PromotionConfigModal (Glassmorphism)
- [x] Home Page Map: Full-width interactive Leaflet map (Carthage)
- [x] Premium Success Toast during checkout transitions

## Advanced User Experience
- [x] Dedicated Client Dashboard & Profile editing
- [x] **Unified Avatar System**: High-fidelity `UserAvatar` with Emoji support and **Global Rank Flairs** (King/Challenger)
- [x] **Registration Bonus**: 10-point welcome gift automatically awarded upon account creation
- [x] **Review Reward System**: Automated point awarding (25 pts for 3 first reviews, 10-25 for subsequent)
- [x] **Account Detail Refactor**: Unified Return links and navigation
- [x] **Account Lists**: Search, filtering, and pagination for Orders & Tickets
- [x] **Support Hub**: Moved tickets to `/account/tickets`, restored full conversation UI
- [x] **Real-time Engine**: Typing indicators, Live notifications, Polling optimization
- [x] **Storage & Media**: Paste-to-upload for ticket attachments
- [x] Fidelity Leaderboard & Hall of Fame system (Transparent launch state)
- [x] Dedicated `/cart` page (Mobile-first UX)

## Admin & Control Panel
- [x] Fix search & pagination in all Admin lists
- [x] Admin Notification Center (Order updates, Tickets)
- [x] Admin Account Management (Profile & Security)
- [x] **Client CRM**: Manage customers and loyalty points directly
- [x] **Review Curation**: Manage and feature customer reviews on home page
- [x] Integrate Public site links in Admin Sidebar
- [x] **Admin Global Settings**: Manage address, phone, and coordinates from dashboard

## Completed Recently
- [x] **Fidelity Tiers**: Standardized tiers (Bronze at 100 pts), "Newcomer" status, and avatar emoji restrictions.
- [x] **Global Rank Flairs**: Implementing **"The King"** (Rank 1 gold) and **"The Challenger"** (Rank 2 silver) globally.
- [x] **Fidelity Page Overhaul**: Added reward explanations, benefits comparison, and 10pt bonus mentions.
- [x] **Home UI Refresh**: Updated Fidelity section design (vertical pill) and enabled flairs in reviews.
- [x] **Retroactive Loyalty Script**: Fixed script to properly award points using `pointsAwarded` flag.
- [x] **Admin Layout**: Fixed scrolling issues.
- [x] **Menu Ordering**: Implemented `displayOrder` for manual menu item sorting.
- [x] **Bug Fixes & URL Sync**: Resolved menu filter infinite loop and improved back-button history.
- [x] **Promo Price Engine**: Fixed cart math for percentage-based discounts on promotions.
- [x] **Authentication Flow**: Optimized redirects for customers (Account vs Home).
- [x] **Notification Direct Links**: Ticket and Order updates now link to specific detail pages.
- [x] **Legacy Cleanup**: Excluded category 14 items from public menu display.
- [x] **Admin Aesthetic Upgrade**: Premium glassmorphism overhaul for Sidebar and Dashboard Stats.

## Phase 2: Active Refinement (User Feedback)
- [ ] **Admin Orders Page**: Redesign for high-intensity worker usage (Compact view, detailed order expander).
- [ ] **Admin Customers**: Enable real avatars and fix functional links.
- [ ] **Home Section Harmony**:
    - [ ] Tone down Fidelity section (Subtle premium styling).
    [ ] Fix Promotions section (Prevent emoji overflow and text hiding).
    - [ ] Optimize Localisation section (Reduce empty vertical space).
- [ ] **Notification Core**: Remove obsolete `tab=orders` query params from all triggers.
- [ ] **Project Meta**: Update README.md and TODOS.md for progress tracking.

## Pending & Future Roadmap
- [ ] **Improved Toast system**: Persistence & Animations for better feedback.
- [ ] **Tracking Page**: Visual feedback on automated status changes.
- [ ] **Admin Impersonation**: Feature to login as client for debugging.
- [ ] **SMS Engine**: Automated notifications for order status.
- [ ] **Live Tracking**: Real-time delivery driver location (Map integration).
- [ ] **Mobile App**: PWA/Native transition.
- [ ] **Online Payments**: Integration with Stripe/Local gateways.