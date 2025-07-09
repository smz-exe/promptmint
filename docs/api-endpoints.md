# API Endpoints Documentation

## Overview

This document defines the tRPC API endpoints for the AI Prompt Trading Card Platform. All endpoints are type-safe and use tRPC's procedure system with Zod validation.

## Router Structure

```typescript
src/server/api/
├── root.ts          // Root router combining all sub-routers
├── trpc.ts          // tRPC context and middleware
└── routers/
    ├── auth.ts      // Authentication endpoints
    ├── user.ts      // User profile management
    ├── promptCard.ts // Prompt card CRUD operations
    ├── like.ts      // Like/unlike functionality
    ├── comment.ts   // Comment management
    └── report.ts    // Report functionality
```

## Authentication Context

```typescript
// Context includes authenticated user
type Context = {
  db: PrismaClient
  user: User | null
  supabase: SupabaseClient
}
```

## API Endpoints

### Authentication Router (`auth`)

#### `auth.signUp`

Create a new user account

```typescript
// Input
{
  email: string
  password: string
  username: string
  displayName?: string
}

// Output
{
  user: {
    id: string
    email: string
    username: string
    displayName: string
  }
  session: Session
}

// Example
await trpc.auth.signUp.mutate({
  email: "user@example.com",
  password: "securepassword",
  username: "cooluser123",
  displayName: "Cool User"
})
```

#### `auth.signIn`

Sign in existing user

```typescript
// Input
{
  email: string
  password: string
}

// Output
{
  user: User
  session: Session
}
```

#### `auth.signOut`

Sign out current user

```typescript
// Input: none (uses session)
// Output: { success: boolean }
```

#### `auth.getCurrentUser`

Get current authenticated user

```typescript
// Input: none (uses session)
// Output: User | null
```

### User Router (`user`)

#### `user.getProfile`

Get user profile by username

```typescript
// Input
{
  username: string
}

// Output
{
  id: string
  username: string
  displayName: string
  bio: string | null
  avatarUrl: string | null
  createdAt: Date
  stats: {
    totalCards: number
    totalLikes: number
    totalForks: number
  }
}
```

#### `user.updateProfile`

Update current user's profile (Protected)

```typescript
// Input
{
  displayName?: string
  bio?: string
  avatarUrl?: string
}

// Output
{
  user: User
}
```

#### `user.getFavoriteCards`

Get user's favorite (liked) cards

```typescript
// Input
{
  username: string
  limit?: number // default: 20
  cursor?: string // for pagination
}

// Output
{
  cards: PromptCard[]
  nextCursor: string | null
}
```

### Prompt Card Router (`promptCard`)

#### `promptCard.create`

Create a new prompt card (Protected)

```typescript
// Input
{
  title: string // max 200 chars
  description: string
  promptText: string // max 5000 chars
  categoryId: string
  aiModelId: string
  parentPromptId?: string // for forks
}

// Output
{
  card: {
    id: string
    title: string
    description: string
    promptText: string
    category: Category
    aiModel: AIModel
    author: User
    likesCount: number
    forkCount: number
    rarity: "BRONZE" | "SILVER" | "GOLD" | "PLATINUM"
    createdAt: Date
  }
}

// Rate limit: 5 per day per user
```

#### `promptCard.update`

Update existing card (Protected - owner only)

```typescript
// Input
{
  id: string
  title?: string
  description?: string
  promptText?: string
  categoryId?: string
  aiModelId?: string
}

// Output
{
  card: PromptCard
}
```

#### `promptCard.delete`

Soft delete a card (Protected - owner only)

```typescript
// Input
{
  id: string
}

// Output
{
  success: boolean
}
```

#### `promptCard.getById`

Get single card with full details

```typescript
// Input
{
  id: string
}

// Output
{
  card: PromptCard & {
    author: User
    category: Category
    aiModel: AIModel
    parentPrompt?: PromptCard
    isLikedByUser: boolean
  }
}
```

#### `promptCard.getFeed`

Get card feed with pagination

```typescript
// Input
{
  limit?: number // default: 20, max: 50
  cursor?: string // for pagination
  filter?: {
    categoryId?: string
    aiModelId?: string
    authorId?: string
    search?: string // searches title and description
  }
  orderBy?: "latest" | "popular" // default: "latest"
}

// Output
{
  cards: Array<{
    id: string
    title: string
    description: string
    promptText: string // truncated to 500 chars
    category: Category
    aiModel: AIModel
    author: {
      id: string
      username: string
      displayName: string
      avatarUrl: string | null
    }
    likesCount: number
    commentCount: number
    rarity: Rarity
    createdAt: Date
    isLikedByUser: boolean
  }>
  nextCursor: string | null
  hasMore: boolean
}
```

#### `promptCard.getUserCards`

Get cards created by a specific user

```typescript
// Input
{
  username: string
  limit?: number // default: 20
  cursor?: string
}

// Output
{
  cards: PromptCard[]
  nextCursor: string | null
}
```

### Like Router (`like`)

#### `like.toggle`

Toggle like on a card (Protected)

```typescript
// Input
{
  promptCardId: string
}

// Output
{
  isLiked: boolean
  likesCount: number
}
```

#### `like.getLikedCards`

Get cards liked by current user (Protected)

```typescript
// Input
{
  limit?: number // default: 20
  cursor?: string
}

// Output
{
  cards: PromptCard[]
  nextCursor: string | null
}
```

### Comment Router (`comment`)

#### `comment.create`

Add comment to a card (Protected)

```typescript
// Input
{
  promptCardId: string
  content: string // max 1000 chars
}

// Output
{
  comment: {
    id: string
    content: string
    user: User
    createdAt: Date
  }
}
```

#### `comment.update`

Update own comment (Protected - owner only)

```typescript
// Input
{
  id: string
  content: string
}

// Output
{
  comment: Comment
}
```

#### `comment.getByCard`

Get comments for a card

```typescript
// Input
{
  promptCardId: string
  limit?: number // default: 20
  cursor?: string
}

// Output
{
  comments: Array<{
    id: string
    content: string
    user: {
      id: string
      username: string
      displayName: string
      avatarUrl: string | null
    }
    createdAt: Date
    updatedAt: Date
  }>
  nextCursor: string | null
}
```

### Report Router (`report`)

#### `report.create`

Report inappropriate content (Protected)

```typescript
// Input
{
  promptCardId: string
  reason: "INAPPROPRIATE_CONTENT" | "SPAM" | "COPYRIGHT_VIOLATION" | "MALICIOUS_PROMPT" | "OTHER"
  description?: string
}

// Output
{
  success: boolean
}
```

### Metadata Endpoints

#### `metadata.getCategories`

Get all available categories

```typescript
// Input: none
// Output
{
  categories: Array<{
    id: string
    name: string
    slug: string
    description: string | null
  }>
}
```

#### `metadata.getAIModels`

Get all available AI models

```typescript
// Input: none
// Output
{
  aiModels: Array<{
    id: string
    name: string
    slug: string
    displayName: string
  }>
}
```

## Error Handling

All endpoints return standardized error responses:

```typescript
// Error Response
{
  error: {
    message: string
    code: "UNAUTHORIZED" | "FORBIDDEN" | "NOT_FOUND" | "BAD_REQUEST" | "RATE_LIMITED" | "INTERNAL_ERROR"
    details?: any
  }
}
```

Common error scenarios:

- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User lacks permission
- `NOT_FOUND`: Resource doesn't exist
- `BAD_REQUEST`: Invalid input data
- `RATE_LIMITED`: Too many requests
- `INTERNAL_ERROR`: Server error

## Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `promptCard.create` | 5 per day |
| `comment.create` | 50 per hour |
| `like.toggle` | 100 per hour |
| `report.create` | 10 per day |

## Example tRPC Client Usage

```typescript
// Initialize tRPC client
import { createTRPCProxyClient } from '@trpc/client'

const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: '/api/trpc',
      headers() {
        return {
          authorization: getAuthToken(),
        }
      },
    }),
  ],
})

// Use in component
const FeedComponent = () => {
  const { data, fetchNextPage, hasNextPage } = trpc.promptCard.getFeed.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  )
  
  // Render cards...
}
```

## WebSocket Subscriptions (Future)

For future real-time features:

```typescript
// Subscribe to card updates
promptCard.onUpdate({ cardId: string }): Observable<PromptCard>

// Subscribe to new comments
comment.onNew({ cardId: string }): Observable<Comment>
```
