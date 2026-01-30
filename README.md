# Website Growth Tools

A comprehensive suite of SEO and website growth tools built with modern web technologies. Track keyword rankings, analyze SERP positions, identify optimization opportunities, and run conversion rate optimization (CRO) audits.

## Features

- **Keyword Ranking Tracker** - Monitor your website's Google search positions for multiple keywords
- **Position Analytics** - Track ranking changes and trends over time with visual charts
- **Opportunity Finder** - Identify keywords with high optimization potential
- **CRO Audit Tool** - Analyze pages for conversion optimization opportunities
- **Dashboard Metrics** - Overview of total keywords, top rankings, and performance trends
- **Filtering System** - Filter keywords by ranking position (Top 10, Top 20, Top 50, Not Found)

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library (Radix UI primitives)
- TanStack Query for server state management
- Wouter for client-side routing
- React Hook Form with Zod validation
- Recharts for data visualization

### Backend
- Node.js with Express.js
- TypeScript
- RESTful API design
- Drizzle ORM (PostgreSQL ready)
- Zod schema validation

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Optimisedigi/website-growth-tools.git
cd website-growth-tools
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── pages/          # Page components
│       ├── hooks/          # Custom React hooks
│       └── lib/            # Utility functions
├── server/                 # Backend Express application
│   ├── routes.ts           # API route definitions
│   ├── storage.ts          # Data storage interface
│   └── index.ts            # Server entry point
├── shared/                 # Shared types and schemas
│   └── schema.ts           # Drizzle ORM schemas and Zod types
└── attached_assets/        # Static assets
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/keywords` | Get all tracked keywords |
| POST | `/api/keywords` | Add a new keyword to track |
| GET | `/api/metrics` | Get dashboard metrics |
| GET | `/api/opportunities` | Get optimization opportunities |
| GET | `/api/ranking-distribution` | Get ranking distribution data |

## APIs and Integrations

### Serper API (Required for Live SERP Data)

The keyword ranking tracker uses the [Serper API](https://serper.dev/) to fetch real Google search results and determine your website's ranking positions.

**Setup:**
1. Sign up for a Serper API account at [serper.dev](https://serper.dev/)
2. Get your API key from the dashboard
3. Add the API key to your environment variables

Without the API key, the app will use mock data for demonstration purposes.

**Features powered by Serper API:**
- Real-time Google SERP position tracking
- Support for 100+ search results per query
- Geo-location targeting (country and city level)
- Multiple language support

### GitHub Integration (Optional)

For Replit deployments, the GitHub connector is pre-configured for repository management. This enables:
- Automatic code pushing to GitHub
- Repository creation and management

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SERPER_API_KEY` | Serper.dev API key for live SERP data | Yes (for live data) |
| `DATABASE_URL` | PostgreSQL connection string | No (uses in-memory storage) |
| `NODE_ENV` | Environment mode (development/production) | No |

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### v1.0.0 (2026-01-30)
- Initial release
- Keyword ranking tracker
- Dashboard with metrics and charts
- CRO audit tool
- Opportunity finder
