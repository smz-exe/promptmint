# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a T3 Stack application for an AI Prompt Trading Card Platform - a web app where users can share AI prompts in a visual trading card format. The project is built with Next.js (App Router), TypeScript, tRPC, Prisma, Tailwind CSS, and uses Supabase for authentication and database.

## Essential Development Commands

### Development

- `npm run dev` - Start development server with Turbo (Next.js)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run preview` - Build and start production server

### Code Quality

- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run typecheck` - Run TypeScript type checking
- `npm run check` - Run both linting and type checking
- `npm run format:check` - Check code formatting with Prettier
- `npm run format:write` - Format code with Prettier

### Database

- `npm run db:generate` - Generate Prisma client and run migrations
- `npm run db:migrate` - Deploy database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Prisma Studio GUI
- `./start-database.sh` - Start local PostgreSQL database in Docker

## Architecture Overview

### Core Stack (T3 Stack)

- **Next.js 15** with App Router (`src/app/` directory)
- **TypeScript** for type safety
- **tRPC** for type-safe API (`src/server/api/`)
- **Prisma** as ORM with PostgreSQL
- **Tailwind CSS** for styling
- **Supabase** for authentication and database hosting

### Key Directories

- `src/app/` - Next.js App Router pages and API routes
- `src/components/` - Reusable UI components (uses shadcn/ui)
- `src/server/` - tRPC server setup and API routers
- `src/lib/` - Utility functions and Supabase clients
- `src/trpc/` - tRPC client configuration
- `prisma/` - Database schema and migrations
- `docs/` - Project documentation including requirements

### tRPC Setup

- API routes are defined in `src/server/api/routers/`
- Main router is in `src/server/api/root.ts`
- Context includes database connection and headers
- Uses superjson for serialization
- Includes timing middleware for development

### Database

- Uses PostgreSQL via Supabase
- ORM: Prisma with schema in `prisma/schema.prisma`
- Current model: User (id, email, name, timestamps)
- Environment variables: `DATABASE_URL`, `DIRECT_URL`

### Authentication

- Supabase Auth integration
- Client and server utilities in `src/lib/supabase/`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### UI Components

- Built with shadcn/ui (Radix UI + Tailwind CSS)
- Components in `src/components/ui/`
- Includes: Button, Card, Dialog, Form, Input, etc.
- Uses `next-themes` for dark mode support

## Environment Setup

Required environment variables (see `.env.example`):

- `DATABASE_URL` - PostgreSQL connection string
- `DIRECT_URL` - Direct database connection (for migrations)
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

## Development Workflow

1. **Database Setup**: Run `./start-database.sh` to start local PostgreSQL
2. **Install Dependencies**: `npm install`
3. **Database Migration**: `npm run db:generate`
4. **Start Development**: `npm run dev`
5. **Code Quality**: Run `npm run check` before committing

## Key Features (from requirements)

The application implements an AI prompt sharing platform with:

- Trading card-style prompt visualization
- User authentication and profiles
- Prompt posting, editing, and deletion
- Feed display with latest prompts
- Like/favorite functionality
- Rarity system based on likes (Bronze/Silver/Gold/Platinum)
- Masonry grid layout for card display
- Categories: Programming, Writing, Analysis, Learning, Creative, Others
- AI model recommendations: Claude, GPT, Gemini, Others

## Testing and Linting

Always run these commands before committing:

- `npm run check` - Comprehensive linting and type checking
- `npm run format:check` - Verify code formatting
- `npm run typecheck` - TypeScript validation
