# Trust-as-a-Service

EcoVerify is a front-end prototype for verifying sustainability claims on e-commerce products. Merchants move through a guided flow to submit business details, upload proof, receive a trust badge outcome, and review that result inside a lightweight dashboard.

This repository contains a single-page React app built with Vite, TypeScript, and Tailwind CSS v4. It is currently a demo product, not a production verification platform.

## What the prototype does

- Presents a marketing landing page for EcoVerify.
- Simulates merchant login and onboarding.
- Walks a merchant through a 3-step verification submission flow.
- Accepts uploaded proof metadata in the browser and generates a mock verification report.
- Produces one of three outcomes: `Verified`, `In Review`, or `Flagged`.
- Shows a generated badge state (`Gold`, `Silver`, or `Bronze`) plus audit details, evidence items, and a storefront embed snippet.
- Maintains an in-memory dashboard with products, history, and settings views.

## Demo flow

The app uses hash-based navigation inside a single React application.

Routes:

- `#/` or no hash: landing page
- `#/login`: merchant login
- `#/onboarding`: merchant setup
- `#/verification`: product verification submission
- `#/badge`: animated verification progress state
- `#/confirmation`: successful or in-review badge outcome
- `#/failure`: flagged/manual review outcome
- `#/dashboard`: merchant overview
- `#/products`: submitted products
- `#/history`: audit and activity history
- `#/settings`: merchant settings

Typical user journey:

1. Start from the landing page.
2. Sign in from the login screen.
3. Complete merchant onboarding details.
4. Submit a product and upload supporting files.
5. View the simulated verification progress screen.
6. Land on either a confirmation page or a failure/manual-review page.
7. Continue into the dashboard to inspect status, activity, and badge details.

## Verification logic

All verification behavior is mocked locally in [src/App.tsx](/home/sir-sang/Documents/Eve/Trust-as-a-Service/src/App.tsx:1). There is no backend, database, OCR service, or AI model connected.

Current heuristics:

- If uploaded filenames contain keywords like `draft`, `sample`, `blur`, `edited`, or `mock`, the submission is marked `Flagged`.
- If no files or no sustainability category are provided, the submission is marked `In Review`.
- Otherwise, the submission is marked `Verified`.

Badge tiers are also derived locally:

- `Gold`: verified with 3 or more uploaded files
- `Silver`: verified with fewer than 3 uploaded files, or partial review states
- `Bronze`: flagged or low-confidence states

Generated report data includes:

- audit hash
- freshness window
- confidence score
- evidence list
- OCR summary text
- audit trail entries
- storefront embed code snippet

## Tech stack

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- ESLint

## Project structure

```text
src/
  components/
    pages/      Route-level screens
    ui/         Shared UI building blocks
  data/
    mockData.ts Demo defaults and seed state
  types/
    app.ts      Shared application types
  App.tsx       App state, routing, and verification logic
```

Static assets used by the prototype live in `public/` and `src/assets/`.

## Getting started

### Prerequisites

- Node.js 20+ recommended
- npm

### Install

```bash
npm install
```

### Run locally

```bash
npm run dev
```

Then open the local Vite URL shown in the terminal.

### Build for production

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Available scripts

- `npm run dev` starts the Vite development server.
- `npm run build` runs TypeScript project builds and creates the production bundle.
- `npm run lint` runs ESLint.
- `npm run preview` serves the built app locally.

## Design notes

The UI is intentionally positioned as a merchant-facing trust product:

- warm green palette with sustainability branding
- editorial serif headlines paired with dashboard-style layouts
- evidence and badge visuals for consumer trust signaling
- empty states for first-time merchants

The dashboard and verification pages are optimized for demo storytelling rather than production data workflows.

## Current limitations

- No authentication or session persistence
- No backend API or database
- No real OCR, CV, or verification engine
- No file upload storage; only browser-side file metadata is used
- No automated tests
- No server-side routing
- State resets on refresh

## Repository materials

The `materials/` directory contains supporting coursework and presentation assets used to shape the prototype narrative, including business-case and walkthrough documents.

## Next steps

If this prototype is extended into a fuller product, the next logical additions are:

- real authentication and merchant accounts
- persistent product and audit storage
- actual document-processing and verification services
- role-based review queues for flagged submissions
- storefront widget hosting and installation flows
- automated tests for routing and verification state transitions
