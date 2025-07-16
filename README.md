# PromptMint

A modern web application for creating, collecting, and trading AI prompts as beautiful digital trading cards. Built with the T3 Stack for type safety and developer experience.

## 🚀 Features

- **🎨 Digital Trading Cards**: Create stunning prompt cards with automatic rarity systems
- **🔍 Advanced Search**: Filter by category, AI model, date range, and popularity
- **❤️ Social Interactions**: Like, comment, and fork interesting prompts
- **👤 User Profiles**: Showcase your created and favorited prompt cards
- **📱 Responsive Design**: Beautiful UI that works on all devices
- **🔐 Secure Authentication**: Powered by Supabase Auth
- **♾️ Infinite Scroll**: Smooth browsing experience with optimized loading

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org) with App Router
- **Language**: [TypeScript](https://typescriptlang.org) for type safety
- **API**: [tRPC](https://trpc.io) for end-to-end type safety
- **Database**: [Prisma](https://prisma.io) with PostgreSQL
- **Authentication**: [Supabase Auth](https://supabase.com/auth)
- **Styling**: [Tailwind CSS](https://tailwindcss.com) + [shadcn/ui](https://ui.shadcn.com)
- **Deployment**: [Vercel](https://vercel.com)

## 🏗️ Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # React components organized by feature
├── server/api/       # tRPC API routes and procedures
├── lib/             # Utilities and configurations
└── trpc/            # tRPC client setup

prisma/
├── schema.prisma    # Database schema
├── migrations/      # Database migrations
└── seed.ts         # Database seeding
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Supabase account (for auth and hosting)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd promptmint
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env
   ```

   Fill in your database and Supabase credentials.

4. **Start the database** (if using local PostgreSQL)

   ```bash
   ./start-database.sh
   ```

5. **Set up the database**

   ```bash
   npm run db:generate
   npm run db:seed
   ```

6. **Start the development server**

   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📜 Available Scripts

### Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run preview` - Build and start production server

### Code Quality

- `npm run check` - Run linting and type checking
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run format:check` - Check code formatting
- `npm run format:write` - Format code with Prettier

### Database

- `npm run db:generate` - Generate Prisma client and run migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with initial data
- `npm run db:studio` - Open Prisma Studio

## 🌟 Key Features

### Rarity System

Cards automatically gain rarity based on community engagement:

- **Bronze**: 0-19 likes
- **Silver**: 20-49 likes  
- **Gold**: 50-99 likes
- **Platinum**: 100+ likes

### Fork System

Create derivative prompts while maintaining lineage tracking, encouraging iteration and improvement of existing prompts.

### Advanced Search

Filter prompts by multiple criteria including category, AI model, date range, and popularity metrics.

## 🚀 Deployment

The application is optimized for deployment on Vercel:

1. **Connect your repository** to Vercel
2. **Set environment variables** in the Vercel dashboard
3. **Deploy** - Vercel will automatically build and deploy your application

For other deployment options, see the [T3 Stack deployment guide](https://create.t3.gg/en/deployment).

## 📚 Learn More

- [T3 Stack Documentation](https://create.t3.gg/)
- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Prisma Documentation](https://prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
