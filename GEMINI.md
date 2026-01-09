# Project Context: iovi-ink

## Overview
This is a **Next.js 16** web application using **TypeScript** and **Tailwind CSS v4**. It is designed as a frontend for a Headless WordPress setup, fetching content via the WordPress REST API.

## Key Technologies
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, `tailwindcss-content-visibility`, `tw-animate-css`
- **CMS:** Headless WordPress (via `src/lib/wordpress.ts`)
- **UI Components:** Radix UI primitives, Framer Motion, Lucide React (Icons)
- **Forms:** React Hook Form + Zod
- **Linting/Formatting:** Biome
- **Email:** Nodemailer, Resend

## Architecture
- **`src/app`**: Contains the App Router pages and layouts.
  - `[slug]` folders indicate dynamic routes for blog posts, services, etc.
- **`src/components`**:
  - `ui/`: Reusable UI primitives (likely Shadcn UI inspired).
  - `blog/`, `contact/`, `gallery/`, `navbar/`: Feature-specific components.
- **`src/lib`**: Utilities and data fetching logic.
  - `wordpress.ts`: Core logic for fetching data from the WordPress API.
  - `wordpress.d.ts`: TypeScript definitions for WordPress data.
- **`src/hooks`**: Custom React hooks (e.g., `useRecaptcha`, `useGalleryModal`).

## Development Workflow

### Prerequisites
- Node.js (Latest LTS recommended)
- `WORDPRESS_URL` environment variable must be set for data fetching to work.

### Scripts
- **Development:** `bun run dev` - Starts the development server at http://localhost:3000.
- **Build:** `bun run build` - Builds the application for production.
- **Lint:** `bun run lint` - Runs Next.js linting.
- **Analyze:** `bun run analyze` - Runs the bundle analyzer.

### Coding Conventions
- **Formatting:** The project uses **Biome** for formatting.
  - **Indentation:** Tabs
  - **Quotes:** Double quotes
- **Styling:** Utility-first CSS with Tailwind.
- **Imports:** Organized automatically via Biome.

## Key Files
- `src/lib/wordpress.ts`: Handles all communication with the WordPress backend.
- `biome.json`: Configuration for the Biome linter/formatter.
- `tailwind.config.js` / `postcss.config.mjs`: Tailwind configuration (v4 setup might be in CSS or config, `tailwind.config.js` exists).
- `next.config.ts`: Next.js configuration.
