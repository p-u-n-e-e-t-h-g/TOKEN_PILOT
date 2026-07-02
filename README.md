# TokenPilot

TokenPilot is an AI routing service and dashboard scaffold. The backend is set up to route chat requests across providers, track usage, and expose analytics.

## Structure

- `server/` - Express + TypeScript backend
- `client/` - Dashboard placeholder for a future Next.js app
- `docs/` - Architecture, API, routing, and roadmap notes
- `examples/` - Example requests and integration snippets

## Getting Started

```powershell
cd server
npm install
npm run dev
```

Copy `.env.example` to `server/.env` and fill in provider keys before using live model providers.

