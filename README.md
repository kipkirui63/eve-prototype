# EcoVerify Frontend

React/Vite frontend for EcoVerify, a merchant-facing sustainability verification workflow.

## Live URLs

```text
Frontend: https://eco-verify.vercel.app
Backend:  https://ecoverify-backend.onrender.com
```

## What The App Does

- Registers and signs in merchant users through the Django backend.
- Saves onboarding profile data immediately.
- Lets merchants submit products for sustainability verification.
- Sends product, evidence metadata, generated report data, and activity data to the backend.
- Retrieves saved submissions for dashboard, products, and history screens.

## Environment

For Vercel, set:

```env
VITE_API_BASE_URL=https://ecoverify-backend.onrender.com
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Do not put Supabase credentials or database connection strings in the frontend.

## Routes

The app uses clean browser routes:

```text
/
/login
/register
/onboarding
/verification
/badge
/confirmation
/failure
/dashboard
/products
/history
/settings
```

`vercel.json` rewrites routes to `index.html` so direct page refreshes work on Vercel.

## Project Structure

```text
src/
  api/         Backend API clients
  components/
    pages/    Route-level screens
    ui/       Shared UI components
  data/       Demo defaults
  types/      Shared TypeScript types
  App.tsx     App state, routing, and workflow logic
public/       Public images and static assets
```

## Scripts

```bash
npm install
npm run dev
npm run build
npm run preview
```
