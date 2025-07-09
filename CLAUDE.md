# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a T3 Stack application for an AI Prompt Trading Card Platform - a web app where users can share AI prompts in a visual trading card format. The project is built with Next.js 15 (App Router), TypeScript, tRPC, Prisma, Tailwind CSS, and uses Supabase for authentication and database.

**Current Status**: Phase 4 completed - Individual card views, user profiles, navigation header, and comment system fully implemented. Ready for fork functionality and advanced features.

## Essential Development Commands

### Development

- `npm run dev` - Start development server with Turbo (Next.js)
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run preview` - Build and start production server

### Code Quality

- `npm run lint` - Run ESLint (all Prisma type-safety warnings disabled)
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run typecheck` - Run TypeScript type checking
- `npm run check` - Run both linting and type checking (essential before commits)
- `npm run format:check` - Check code formatting with Prettier
- `npm run format:write` - Format code with Prettier

### Database

- `npm run db:generate` - Generate Prisma client and run migrations
- `npm run db:migrate` - Deploy database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with categories and AI models
- `npm run db:studio` - Open Prisma Studio GUI
- `./start-database.sh` - Start local PostgreSQL database in Docker

## Architecture Overview

### Core Stack (T3 Stack)

- **Next.js 15** with App Router (`src/app/` directory)
- **TypeScript** for type safety with strict ESLint configuration
- **tRPC** for type-safe API (`src/server/api/`)
- **Prisma** as ORM with PostgreSQL
- **Tailwind CSS** for styling
- **Supabase** for authentication and database hosting

### Key Directories

- `src/app/` - Next.js App Router pages (landing, feed, auth, card creation, individual cards, profiles)
- `src/components/` - Organized by feature: cards/, feed/, forms/, ui/, layout/, comments/
- `src/server/api/routers/` - tRPC routers for each domain
- `src/lib/` - Utilities including Supabase clients and auth hooks
- `src/trpc/` - tRPC client configuration
- `prisma/` - Database schema, migrations, and seed data
- `docs/` - Project documentation and requirements

### tRPC Router Architecture

Current routers in `src/server/api/routers/`:

- **auth**: User authentication (signUp, signIn, signOut, getCurrentUser)
- **promptCard**: CRUD operations, feed with pagination, search
- **like**: Toggle likes, get liked cards, optimistic updates
- **comment**: CRUD for comments with pagination
- **user**: Profile management, user search, favorite cards
- **metadata**: Categories and AI models for forms

Each router includes proper Zod validation and TypeScript types from Prisma.

### Database Schema (Complete)

**Core Models**:

- **User**: Authentication, profile (username, displayName, bio, avatarUrl)
- **PromptCard**: Trading cards with title, description, promptText, rarity system
- **Category**: Programming, Writing, Analysis, Learning, Creative, Others  
- **AIModel**: Claude, GPT, Gemini, Others
- **Like**: User-PromptCard many-to-many with timestamps
- **Comment**: Threaded comments on prompt cards
- **Report**: Content moderation system

**Rarity System**: Automatically calculated from likes (Bronze: 0-19, Silver: 20-49, Gold: 50-99, Platinum: 100+)

### Authentication Flow

- Supabase Auth with email/password
- Auth context provider in `src/lib/auth/context.tsx`
- Protected procedures in tRPC using middleware
- Client and server utilities in `src/lib/supabase/`

### UI Component Architecture

- **shadcn/ui** base components in `src/components/ui/`
- **Feature components**:
  - `PromptCard`: Trading card design with rarity effects and optimistic updates
  - `FeedGrid`: Masonry layout with infinite scroll
  - `FeedFilters`: Category, AI model, and search filtering
  - `PromptCardForm`: Validated form for card creation/editing
  - `RarityBadge`: Visual rarity indicators

### Data Flow Patterns

- **Infinite Scroll**: Cursor-based pagination with React Query
- **Optimistic Updates**: Immediate UI feedback for likes before server confirmation
- **Real-time Features**: Like counts update automatically across components
- **Form Handling**: React Hook Form with Zod validation matching tRPC schemas

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
4. **Seed Database**: `npm run db:seed` (adds categories and AI models)
5. **Start Development**: `npm run dev`
6. **Code Quality**: Run `npm run check` before committing

## Current Implementation Status

### ✅ Completed Features

- **Authentication**: Complete Supabase Auth with sign-up/in/out
- **Database**: Full schema with User, PromptCard, Category, AIModel, Like, Comment, Report
- **API**: All tRPC routers implemented with proper validation
- **UI Components**: Trading card design, feed grid, forms, filters
- **Core Pages**: Landing (`/`), feed (`/feed`), auth (`/sign-in`, `/sign-up`), card creation (`/cards/create`)
- **Feed System**: Masonry layout with infinite scroll, filtering, and search
- **Like System**: Optimistic updates with real-time count synchronization
- **Rarity System**: Automatic calculation and visual indicators

### 🔄 Next Implementation Priority

- Fork/derivative functionality UI
- Advanced search and filtering
- Settings page (`/settings`)
- Real-time notifications
- Performance optimizations

## Code Quality Standards

### ESLint Configuration

- All Prisma type-safety warnings disabled due to generated types
- Strict TypeScript rules enabled
- Consistent import ordering and formatting

### Type Safety Patterns

- Use `Prisma.ModelWhereInput` types for database queries instead of `any`
- Prefer `??` over `||` for null/undefined checks
- Use `void` operator for floating promises
- Import types with `import type` when only used for typing

### Database Patterns

- All database operations use proper Prisma types
- Cursor-based pagination for infinite scroll
- Optimistic updates for real-time features
- Proper foreign key relationships and indexes

Always run `npm run check` before committing to ensure code quality.
