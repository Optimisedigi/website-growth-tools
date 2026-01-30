# Simple Keyword Ranking Tool - Google SERP Position Tracking

## Overview

Simple Keyword Ranking Tool is a full-stack web application for tracking Google search engine result position (SERP) rankings. The application allows users to monitor keyword positions, analyze ranking trends, and identify optimization opportunities. Built with a modern React frontend and Express backend, it uses PostgreSQL for data persistence and includes comprehensive analytics dashboards.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Management**: React Hook Form with Zod validation
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js with middleware for logging and error handling
- **API Design**: RESTful endpoints with JSON responses
- **Data Storage**: Currently using in-memory storage with interface for database migration
- **Validation**: Zod schemas for request/response validation
- **Session Management**: Ready for PostgreSQL session storage

### Database Design
- **Primary Database**: PostgreSQL (configured but not yet implemented)
- **ORM**: Drizzle ORM with type-safe queries
- **Migration Strategy**: Drizzle Kit for schema management
- **Tables**:
  - `projects`: Website tracking projects
  - `keywords`: Keyword tracking with position history

## Key Components

### Data Models
- **Projects**: Website containers for keyword organization
- **Keywords**: Individual search terms with position tracking, search volume, and opportunity scoring
- **Metrics**: Aggregated dashboard statistics and ranking distributions

### Core Features
- **Keyword Tracking**: Add and monitor multiple keywords per project
- **Position Analysis**: Track ranking changes over time
- **Opportunity Scoring**: Identify keywords with optimization potential
- **Dashboard Metrics**: Overview of total keywords, top rankings, and performance trends
- **Filtering System**: Filter keywords by ranking position (top 10, 20, 50, not found)

### UI Components
- **Dashboard**: Main analytics overview with metrics cards
- **Tracking Form**: Input form for adding new keywords and websites
- **Results Table**: Sortable, filterable table of keyword rankings
- **Ranking Visualization**: Charts and graphs for ranking distribution
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## Data Flow

1. **User Input**: Keywords and website URLs submitted through tracking form
2. **Validation**: Client-side validation with React Hook Form and Zod schemas
3. **API Processing**: Express routes handle CRUD operations
4. **Data Storage**: Currently in-memory, designed for PostgreSQL migration
5. **Real-time Updates**: TanStack Query manages cache invalidation and refetching
6. **UI Updates**: Components reactively update based on server state changes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL driver for Neon database
- **drizzle-orm**: Type-safe database queries and migrations
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **zod**: Runtime type validation and schema definition

### UI Dependencies
- **@radix-ui/***: Comprehensive set of accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Type-safe CSS class variants

### Development Tools
- **vite**: Fast build tool with HMR
- **typescript**: Static type checking
- **esbuild**: Fast JavaScript bundler for production

## Deployment Strategy

### Development Environment
- **Local Development**: Vite dev server with Express backend
- **Hot Reloading**: Both frontend and backend support hot module replacement
- **Error Handling**: Runtime error overlay for development debugging

### Production Build
- **Frontend**: Vite builds optimized static assets to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Deployment**: Single application serving both API and static files

### Database Strategy
- **Current**: In-memory storage for development and testing
- **Production**: PostgreSQL with Drizzle ORM migrations
- **Connection**: Environment variable-based database URL configuration

## Changelog

```
Changelog:
- July 05, 2025. Complete SEO ranking tracker application built and deployed
- July 04, 2025. Initial setup
```

## Recent Changes

- **Audit Tool Schema Addition** (July 28, 2025): Added comprehensive schema and types for website conversion rate audit tool including AuditRequest, AuditFinding, AuditRecommendation, and AuditResults interfaces with URL normalization helper
- **Multi-Tool Architecture Setup** (July 28, 2025): Implemented path-based routing for multiple tools under tool.optimisedigital.online, created tools landing page, moved keyword tracker to /free-simple-keyword-tracker path, prepared foundation for /website-conversion-rate-audit
- **Cross-Platform Header Template** (July 28, 2025): Created reusable header component for separate audit app with identical branding, navigation, and GTM integration
- **Navigation Structure Enhancement** (July 28, 2025): Created new "Growth Tools" menu section, moved keyword tracker under it, updated URL to tool.optimisedigital.online/free-simple-keyword-tracker, added Google Tag Manager (GTM-5J7745W) for analytics tracking
- **URL Input Enhancement** (July 28, 2025): Updated website input to accept flexible formats (example.com, www.example.com) without requiring https:// protocol, added automatic URL normalization
- **Final Brand Update** (July 8, 2025): Changed application name to "Simple Keyword Ranking Tool" and made logo mobile-responsive
- **Quick Actions Mobile** (July 8, 2025): Moved quick actions box to bottom on mobile, hidden on desktop tracking form
- **Keywords Tab Redesign** (July 8, 2025): Restructured Keywords tab with tracking form and results table side-by-side on desktop
- **Snapshot Integration** (July 8, 2025): Integrated snapshot labeling directly into Keywords results table, removed separate keyword actions box
- **Mobile Table Optimization** (July 8, 2025): Hidden website column on mobile to prevent horizontal scrolling, responsive column visibility
- **CSV Export Enhancement** (July 8, 2025): Updated CSV export to include snapshot labels when keywords are added to snapshots
- **Comparison Data Removal** (July 8, 2025): Removed comparison data from metric boxes (e.g., "+12.5% vs last month") for cleaner dashboard layout
- **Color System Update** (July 8, 2025): Changed ranking colors to green (1-5), blue (6-20), gray (21+), red (not found)
- **Desktop Layout Enhancement** (July 8, 2025): Added Keyword Opportunities box next to Ranking Distribution, moved Export Data under Create Snapshot
- **Complete Quick Actions Removal** (July 8, 2025): Removed all Quick Actions boxes from desktop and mobile layouts, cleaned up tracking form
- **Interface Cleanup** (July 8, 2025): Removed Dashboard navigation tab, removed Quick Actions box, updated tagline to emphasize simplicity
- **Mobile Layout Restructure** (July 8, 2025): Track New Keywords first, followed by Performance Summary (simple metrics), Ranking Results, Snapshot, then Quick Actions
- **Dashboard Consolidation** (July 8, 2025): Removed Keywords tab completely and consolidated all functionality into dashboard with responsive snapshot controls
- **Snapshot Fix** (July 8, 2025): Fixed snapshot functionality error in Keywords tab and updated button text to use "Google searches" instead of "SERP"
- **Mobile UX Improvements** (July 8, 2025): Fixed mobile layout with disclaimer text on separate line, removed quick actions box
- **Desktop Layout Cleanup** (July 8, 2025): Removed Quick Stats box on desktop, streamlined interface
- **Brand Update** (July 8, 2025): Changed application name from "RankTracker Pro" to "Simple Keyword Ranks"
- **Location Tracking** (July 8, 2025): Added location column to keywords table showing search location with emoji indicators
- **Dashboard Auto-Refresh**: Fixed dashboard metrics to automatically update when new keywords are added
- **Table Improvements**: Removed "Change" column, added sortable "Opportunity" column, and implemented working filters by position and opportunity
- **Ranking Disclaimer**: Added info text stating rankings show text search results only (excludes shopping ads, AI overviews, and popular products)
- **Export Enhancement**: Updated CSV export to include location data and removed change column to match table structure
- **Button Reorganization**: Moved "Upload CSV" button above "Track Keywords with Live SERP" button in tracking form
- **Mobile-First Layout**: Completely redesigned dashboard for mobile with tracking form first, followed by rankings table, then performance summary
- **Desktop Quick Actions Removal**: Removed quick actions box on desktop, keeping only "Refresh with Live SERP Data" button above rankings table
- **Quick Stats Repositioning**: Moved Quick Stats section under the 4 metrics cards on desktop layout
- **Mobile Export Positioning**: Moved export data section to bottom on mobile devices for better UX flow
- **Navigation Cleanup** (July 6, 2025): Removed Reports tab and consolidated its content into Dashboard
- **Keyword Selection & Management**: Added checkbox selection for individual keywords with "Select All" functionality
- **Keyword Deletion**: Implemented delete functionality for removing selected keywords
- **Ranking Snapshots**: Created snapshot feature to capture keyword rankings at specific dates for month-to-month comparison
- **Live Badge Removal**: Removed "Live SERP Data" badge from header for cleaner design
- **Enhanced Keywords Page**: Complete redesign with selection controls, bulk actions, and snapshot creation
- **Backend API Extensions**: Added DELETE /api/keywords/delete, POST /api/keywords/refresh, and snapshot endpoints
- **Data Schema Updates**: Added snapshots table for storing historical ranking data with labels
- **City-Level SERP Targeting**: Added comprehensive location selector with 40+ cities across 15+ countries for hyper-local ranking data
- **Improved Domain Matching**: Enhanced domain matching to include any page under the target domain (subdomains/paths)
- **Visual Location Interface**: Added emoji-enhanced location dropdown with major cities (NYC, LA, London, Sydney, Tokyo, etc.)

## User Preferences

```
Preferred communication style: Simple, everyday language.
```