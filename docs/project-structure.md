# Project Structure Documentation

## Overview

This document outlines the file and folder structure for PromptMint, built with Next.js 14+ (App Router), TypeScript, tRPC, Prisma, and Supabase.

## Root Directory Structure

```
promptmint/
├── .env                     # Environment variables
├── .env.example             # Example environment variables
├── .eslintrc.json           # ESLint configuration
├── .gitignore               # Git ignore file
├── .prettierrc              # Prettier configuration
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
├── postcss.config.js        # PostCSS configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── README.md                # Project documentation
├── prisma/                  # Prisma schema and migrations
├── public/                  # Static assets
├── src/                     # Source code
└── docs/                    # Development documentation
```

## Detailed Structure

### `/src` Directory

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/             # Auth group route
│   │   ├── sign-in/
│   │   │   └── page.tsx
│   │   ├── sign-up/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (main)/             # Main app group route
│   │   ├── cards/
│   │   │   ├── [id]/
│   │   │   │   └── page.tsx     # Individual card view
│   │   │   └── create/
│   │   │       └── page.tsx     # Mint new card
│   │   ├── profile/
│   │   │   ├── [username]/
│   │   │   │   └── page.tsx     # User profile
│   │   │   └── edit/
│   │   │       └── page.tsx     # Edit profile
│   │   ├── feed/
│   │   │   └── page.tsx         # Main feed
│   │   └── layout.tsx           # Main app layout
│   ├── api/
│   │   └── trpc/
│   │       └── [trpc]/
│   │           └── route.ts     # tRPC HTTP handler
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Landing page
│   ├── globals.css             # Global styles
│   ├── providers.tsx           # Client providers wrapper
│   └── error.tsx               # Error boundary
│
├── components/                 # React components
│   ├── cards/
│   │   ├── PromptCard.tsx     # Card component
│   │   ├── PromptCardGrid.tsx # Masonry grid layout
│   │   ├── PromptCardModal.tsx # Full card modal
│   │   ├── PromptCardSkeleton.tsx
│   │   └── RarityBadge.tsx
│   ├── feed/
│   │   ├── FeedFilters.tsx
│   │   ├── FeedHeader.tsx
│   │   └── InfiniteScrollFeed.tsx
│   ├── forms/
│   │   ├── PromptCardForm.tsx  # Mint/edit form
│   │   ├── CommentForm.tsx
│   │   └── ProfileEditForm.tsx
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── MobileMenu.tsx
│   ├── ui/                     # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── form.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   └── ... (other shadcn components)
│   └── shared/
│       ├── Avatar.tsx
│       ├── LikeButton.tsx
│       ├── ShareButton.tsx
│       ├── LoadingSpinner.tsx
│       └── ErrorMessage.tsx
│
├── server/                     # Server-side code
│   ├── api/
│   │   ├── routers/           # tRPC routers
│   │   │   ├── auth.ts
│   │   │   ├── user.ts
│   │   │   ├── promptCard.ts
│   │   │   ├── like.ts
│   │   │   ├── comment.ts
│   │   │   └── report.ts
│   │   ├── root.ts            # Root router
│   │   └── trpc.ts            # tRPC setup
│   ├── db/
│   │   └── client.ts          # Prisma client singleton
│   └── auth/
│       └── supabase.ts        # Supabase client setup
│
├── lib/                        # Utility functions
│   ├── utils/
│   │   ├── cn.ts              # Class name utility
│   │   ├── format.ts          # Formatting utilities
│   │   ├── validation.ts      # Zod schemas
│   │   └── constants.ts       # App constants
│   ├── hooks/                 # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useDebounce.ts
│   │   └── useLocalStorage.ts
│   └── supabase/
│       ├── client.ts          # Browser client
│       ├── server.ts          # Server client
│       └── middleware.ts      # Auth middleware
│
├── types/                      # TypeScript types
│   ├── database.ts            # Prisma generated types
│   ├── api.ts                 # API response types
│   ├── supabase.ts           # Supabase types
│   └── global.d.ts           # Global type declarations
│
└── styles/                     # Additional styles
    └── animations.css         # Custom animations
```

### `/prisma` Directory

```
prisma/
├── schema.prisma              # Database schema
├── seed.ts                    # Seed script
└── migrations/                # Database migrations
    └── [timestamp]_init/
        └── migration.sql
```

### `/public` Directory

```
public/
├── images/
│   ├── logo.svg
│   ├── card-bg-bronze.svg
│   ├── card-bg-silver.svg
│   ├── card-bg-gold.svg
│   └── card-bg-platinum.svg
├── fonts/
│   └── ... (custom fonts if any)
└── favicon.ico
```

### `/docs` Directory

```
docs/
├── requirements.md            # Project requirements
├── database-schema.md        # Database documentation
├── api-endpoints.md          # API documentation
├── project-structure.md      # This file
├── ui-components.md          # Component documentation
├── coding-standards.md       # Coding conventions
├── implementation-checklist.md
├── ui-text-copy.md          # UI text strings
├── deployment-guide.md       # Deployment instructions
└── testing-strategy.md       # Testing approach
```

## Key Files Explained

### `src/app/layout.tsx`

Root layout wrapping all pages with providers and global UI elements.

### `src/app/providers.tsx`

Client-side providers including tRPC, authentication context, and toast notifications.

### `src/server/api/trpc.ts`

tRPC context creation and middleware setup, including authentication.

### `src/lib/supabase/client.ts`

Supabase client for browser-side operations.

### `src/lib/supabase/server.ts`

Supabase client for server-side operations with proper cookie handling.

### `src/components/ui/`

shadcn/ui components copied and customized for the project.

## Environment Variables

```env
# .env.local
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Import Aliases

Configure in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/server/*": ["./src/server/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

## File Naming Conventions

- **Components**: PascalCase (e.g., `PromptCard.tsx`)
- **Utilities**: camelCase (e.g., `formatDate.ts`)
- **Types**: PascalCase for interfaces/types (e.g., `User`, `PromptCard`)
- **API Routes**: camelCase (e.g., `promptCard.ts`)
- **Pages**: kebab-case directories with `page.tsx`

## Component Organization

1. **Page Components** (`/app`): Route-specific pages
2. **Feature Components** (`/components/[feature]`): Feature-specific components
3. **UI Components** (`/components/ui`): Reusable UI primitives
4. **Shared Components** (`/components/shared`): Shared across features

## Development Workflow

1. **Database Changes**: Update `prisma/schema.prisma` → Run migrations
2. **API Changes**: Update tRPC routers in `/server/api/routers`
3. **UI Changes**: Create/update components in `/components`
4. **New Pages**: Add routes in `/app` directory
5. **Type Safety**: Types are auto-generated from Prisma and tRPC
