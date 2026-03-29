# Medistore Monorepo

Welcome to the Medistore command center. This project is organized as a monorepo using **Yarn Berry** workspaces.

## Structure

- `apps/web`: The React + Vite frontend application.
- `apps/api`: The Python FastAPI backend application.

## Prerequisites

- Node.js (v18+)
- Yarn Berry
- Python 3.11+

## Getting Started

1. Install Node dependencies from the root:
   ```bash
   yarn install
   ```

2. Setup Python Backend:
   ```bash
   yarn api:install
   ```

3. Run the development environment:

   **Recommended: Overmind**
   If you have [Overmind](https://overmindjs.org/) installed:
   ```bash
   overmind start
   ```

   **Fallback: Concurrently**
   If you don't have Overmind, you can use the built-in runner:
   ```bash
   yarn dev
   ```

## Development Scripts

| Command | Description |
| --- | --- |
| `yarn dev` | Run all apps using `concurrently` |
| `overmind start` | Run all apps using `overmind` (uses `Procfile`) |
| `yarn install` | Install Node dependencies |
| `yarn api:install` | Install Python dependencies |
| `yarn web:dev` | Run only the frontend |
| `yarn api:dev` | Run only the backend |


## Database Integration

The backend uses **FastAPI** with **SQLModel** and **PostgreSQL (Supabase)**.
To get started:
1. Create a project on [Supabase](https://supabase.com/).
2. Add your `DATABASE_URL` to a `.env` file in `apps/api`.
3. The tables will be automatically created on startup.

## Frontend Configuration

The frontend uses **Vite** and communicates with the backend via **Axios**.
1. The API URL is configured in `apps/web/.env` via `VITE_API_URL`.
2. A centralized API client is available at `apps/web/src/lib/api.ts`.
3. It includes automatic CSRF handling (expects a CSRF token from the backend).

