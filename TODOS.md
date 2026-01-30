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

## Pending & Future Roadmap
- [x] **Refinement & Consolidation**:
    - [x] **Emoji Picker**: Create reusable component with tooltips and deduplication.
    - [x] **Profile Merge**: Consolidate View and Edit profile pages into one.
- [ ] **System Enhancements**:
    - [ ] Improved Toast system (Persistence & Animations)
    - [x] Admin Dashboard: Cancel reasons for orders
    - [x] Admin Dashboard: Detailed customer profiles (Address, Total Revenue)
    - [x] Tracking Page: Visual feedback on automated status changes
- [ ] **Admin Impersonation**: Feature to login as client for debugging
- [ ] **SMS Engine**: Automated notifications for order status
- [ ] **Live Tracking**: Real-time delivery driver location (Map integration)
- [ ] **Mobile App**: PWA/Native transition
- [ ] **Online Payments**: Integration with Stripe/Local gateways