## ui-components.md

# UI Components Documentation

このプロジェクトで使用しているUIコンポーネントの一覧と基本的な使用方法をまとめています。

## 🎨 UIライブラリ

- **shadcn UI**: Radix UIとTailwind CSSベースのコンポーネントライブラリ
- **Sonner**: トースト通知用ライブラリ（shadcn UIのtoastの代替）
- **Lucide React**: アイコンライブラリ

## 📦 インストール済みコンポーネント

### Button

```tsx
import { Button } from "~/components/ui/button"

// 使用例
<Button variant="default">Click me</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Cancel</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Input

```tsx
import { Input } from "~/components/ui/input"

// 使用例
<Input type="email" placeholder="Email" />
<Input type="password" placeholder="Password" />
<Input disabled placeholder="Disabled input" />
```

### Form

```tsx
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"

// React Hook Formと組み合わせて使用
// zodスキーマと併用することで型安全なフォームを構築
```

### Card

```tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"

// 使用例
<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Card content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

### Dropdown Menu

```tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

// 使用例
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Open</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuItem>Logout</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Dialog

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"

// 使用例
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description here.
      </DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

### Alert

```tsx
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"

// 使用例
<Alert>
  <AlertTitle>Heads up!</AlertTitle>
  <AlertDescription>
    You can add components to your app using the cli.
  </AlertDescription>
</Alert>

// バリアント
<Alert variant="destructive">
  <AlertTitle>Error</AlertTitle>
  <AlertDescription>
    Your session has expired. Please log in again.
  </AlertDescription>
</Alert>
```

### Toast (Sonner)

```tsx
import { toast } from "sonner"

// 使用例
toast("Event has been created")
toast.success("Successfully saved!")
toast.error("Failed to save changes")
toast.loading("Saving...")

// プロミスベース
toast.promise(saveUser(), {
  loading: 'Saving...',
  success: 'Settings saved!',
  error: 'Could not save',
})

// カスタムコンポーネント
toast.custom((t) => (
  <div>
    Custom toast with id: {t}
  </div>
))
```

## 🔧 セットアップ

### Sonnerの初期設定

`app/layout.tsx`に以下を追加：

```tsx
import { Toaster } from "sonner"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
```

## 📝 スタイリング

すべてのコンポーネントはTailwind CSSクラスでカスタマイズ可能です。

```tsx
// classNameプロパティでスタイルを追加
<Button className="w-full mt-4">
  Full width button
</Button>

// cn()ユーティリティを使用した条件付きスタイリング
import { cn } from "~/lib/utils"

<div className={cn(
  "rounded-lg border",
  isActive && "border-primary"
)}>
  Content
</div>
```

## 🧩 カスタムコンポーネント

### Navigation

```tsx
import { Navigation } from "~/components/layout/Navigation"

// 永続的なナビゲーションヘッダー
// 自動的にlayout.tsxに組み込まれているため、個別にインポートする必要なし
```

### PromptCard

```tsx
import { PromptCard } from "~/components/cards/PromptCard"

// 使用例
<PromptCard
  card={cardData}
  onClick={() => router.push(`/cards/${cardData.id}`)}
  showFullPrompt={false} // オプション: プロンプトの全文表示
/>
```

### RarityBadge

```tsx
import { RarityBadge } from "~/components/cards/RarityBadge"

// 使用例
<RarityBadge rarity="GOLD" />
<RarityBadge rarity="PLATINUM" />
```

### CommentList & CommentForm

```tsx
import { CommentList } from "~/components/comments/CommentList"
import { CommentForm } from "~/components/comments/CommentForm"

// 使用例
<div className="space-y-6">
  <CommentForm promptCardId={cardId} />
  <CommentList promptCardId={cardId} />
</div>

// 編集モード
<CommentForm
  promptCardId={cardId}
  isEditing={true}
  editingCommentId={commentId}
  initialContent={existingContent}
  onSuccess={() => {}}
  onCancel={() => {}}
/>
```

### FeedGrid & FeedFilters

```tsx
import { FeedGrid } from "~/components/feed/FeedGrid"
import { FeedFilters } from "~/components/feed/FeedFilters"

// 使用例
<FeedFilters
  onFilterChange={setFilter}
  onOrderChange={setOrderBy}
  currentFilter={filter}
  currentOrder={orderBy}
/>

<FeedGrid
  filter={filter}
  orderBy={orderBy}
/>
```

### PromptCardForm

```tsx
import { PromptCardForm } from "~/components/forms/PromptCardForm"

// 使用例
<PromptCardForm
  onSuccess={(card) => {
    router.push(`/cards/${card.id}`)
  }}
/>
```

### Fork Components

```tsx
import { ForkButton } from "~/components/cards/ForkButton"
import { ForkDialog } from "~/components/cards/ForkDialog"
import { ForkHistory } from "~/components/cards/ForkHistory"

// 使用例
<ForkButton card={card} />

<ForkHistory
  cardId={cardId}
  parentPrompt={card.parentPrompt}
  forkCount={card.forkCount}
/>
```

### Settings Components

```tsx
import { ProfileSettings } from "~/components/settings/ProfileSettings"
import { AccountSettings } from "~/components/settings/AccountSettings"

// 使用例
<ProfileSettings user={currentUser} />
<AccountSettings user={currentUser} />
```

### Error Boundary

```tsx
import { ErrorBoundary } from "~/components/error/ErrorBoundary"

// ページレベルのエラーハンドリング
<ErrorBoundary level="page">
  {children}
</ErrorBoundary>

// コンポーネントレベルのエラーハンドリング
<ErrorBoundary level="component">
  <SomeComponent />
</ErrorBoundary>

// カスタムフォールバックUI
<ErrorBoundary
  fallback={<div>カスタムエラー表示</div>}
  onError={(error, errorInfo) => {
    // カスタムエラーロギング
    console.error("Custom error handler:", error, errorInfo)
  }}
>
  <SomeComponent />
</ErrorBoundary>
```

### Homepage Components

```tsx
import { HeroSection } from "~/components/homepage/HeroSection"
import { InteractiveDemo } from "~/components/homepage/InteractiveDemo"
import { FeatureGrid } from "~/components/homepage/FeatureGrid"
import { SocialProof } from "~/components/homepage/SocialProof"
import { CtaSection } from "~/components/homepage/CtaSection"

// Modern landing page components for AI-Powered Creative Playground
<HeroSection />        // 3D card animations with floating elements
<InteractiveDemo />    // Live category switching with real-time previews
<FeatureGrid />        // Bento-style grid with glassmorphism effects
<SocialProof />        // Community stats, testimonials, creator showcase
<CtaSection />         // Step-by-step onboarding with animated progress
```

#### Homepage Component Details

**HeroSection**:

- 3D rotating prompt cards with realistic shadows
- Floating particle animation system (hydration-safe)
- Hero text with gradient effects and call-to-action
- Mobile-responsive design with touch-friendly interactions

**InteractiveDemo**:

- Live category switching (Programming, Creative, Analysis, etc.)
- Real-time card preview updates
- Animated transitions between different prompt examples
- Professional card design showcase

**FeatureGrid**:

- Bento-style grid layout with varying card sizes
- Glassmorphism effects with backdrop blur
- Hover animations and micro-interactions
- Feature highlights: Visual Cards, Community, Search, Export

**SocialProof**:

- Community statistics (47K+ prompts, 12K+ creators)
- User testimonials with ratings and avatars
- Featured creator showcase with gradient backgrounds
- Call-to-action for community joining

**CtaSection**:

- 3-step onboarding process visualization
- Animated progress indicators with icons
- Primary and secondary call-to-action buttons
- Trust indicators and social proof elements

### Loading Components

```tsx
import { PromptCardSkeleton } from "~/components/loading/PromptCardSkeleton"
import { FeedGridSkeleton } from "~/components/loading/FeedGridSkeleton"
import { CardDetailSkeleton } from "~/components/loading/CardDetailSkeleton"

// Loading states
{isLoading ? <FeedGridSkeleton /> : <FeedGrid />}
{isLoading ? <CardDetailSkeleton /> : <CardDetail />}
```

### Navigation Components

```tsx
import { SmartBreadcrumb } from "~/components/navigation/SmartBreadcrumb"

// Intelligent breadcrumb navigation
<SmartBreadcrumb />

// Custom breadcrumb items
<SmartBreadcrumb 
  customItems={[
    {
      label: "Custom Page",
      href: "/custom",
      icon: CustomIcon,
    },
  ]}
/>
```

### Moderation Components

```tsx
import { ReportDialog } from "~/components/moderation/ReportDialog"

// Content reporting
<ReportDialog 
  promptCardId={cardId}
  open={isOpen}
  onClose={() => setIsOpen(false)}
/>
```

### Advanced Components

```tsx
import { AdvancedFilters } from "~/components/feed/AdvancedFilters"

// Advanced search and filtering
<AdvancedFilters 
  onFiltersChange={(filters) => {
    // Handle date range, rarity, likes filters
  }}
/>
```

## 🎨 アイコン使用例

```tsx
import { 
  Heart, MessageCircle, Copy, GitBranch, Share2, User, Settings,
  Sparkles, Zap, Brain, Code, Palette, Trophy, Shield, Globe,
  ArrowRight, Quote, Star, Plus, Search, Menu, X
} from "lucide-react"

// 使用例
<Button>
  <Heart className="h-4 w-4 mr-2" />
  Like
</Button>

<Button>
  <MessageCircle className="h-4 w-4 mr-2" />
  Comment
</Button>

// Homepage icons
<Sparkles className="h-6 w-6 text-purple-600" />
<Zap className="h-5 w-5 transition-transform group-hover:rotate-12" />
<Brain className="h-8 w-8 text-white" />
```

## 🎬 アニメーション

### Framer Motion Integration

```tsx
import { motion } from "framer-motion"

// Fade in animation
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>

// Scroll-triggered animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6 }}
>
  Content
</motion.div>

// Hover animations
<motion.div
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
  Interactive element
</motion.div>

// Stagger animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
    },
  },
}
```

## 🔧 最新の追加コンポーネント

### Skeleton

```tsx
import { Skeleton } from "~/components/ui/skeleton"

// Loading placeholders
<Skeleton className="h-4 w-[250px]" />
<Skeleton className="h-4 w-[200px]" />
<Skeleton className="h-4 w-[150px]" />
```

### Breadcrumb

```tsx
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb"

// Navigation breadcrumbs
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current Page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
```

### Calendar

```tsx
import { Calendar } from "~/components/ui/calendar"

// Date picker
<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-md border"
/>
```

### Additional Form Components

```tsx
import { Checkbox } from "~/components/ui/checkbox"
import { Slider } from "~/components/ui/slider"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Textarea } from "~/components/ui/textarea"

// Form inputs
<Checkbox id="terms" />
<Slider defaultValue={[50]} max={100} step={1} />
<RadioGroup defaultValue="option1">
  <RadioGroupItem value="option1" />
  <RadioGroupItem value="option2" />
</RadioGroup>
<Textarea placeholder="Enter your message" />
```

## 📱 レスポンシブデザイン

すべてのコンポーネントはモバイルファーストのレスポンシブデザインを採用しています：

```tsx
// 例: グリッドレイアウト
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* カード一覧 */}
</div>

// 例: ナビゲーション
<div className="hidden md:flex">
  {/* デスクトップ用ナビゲーション */}
</div>
<div className="md:hidden">
  {/* モバイル用ナビゲーション */}
</div>
```

## 🔄 データ取得パターン

```tsx
// 無限スクロールパターン
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isLoading,
} = api.promptCard.getFeed.useInfiniteQuery({
  limit: 20,
  filter,
  orderBy,
}, {
  getNextPageParam: (lastPage) => lastPage.nextCursor,
})

// 楽観的更新パターン
const likeMutation = api.like.toggle.useMutation({
  onMutate: () => {
    // 即座にUIを更新
    setIsLiked(!isLiked)
    setLikesCount(isLiked ? likesCount - 1 : likesCount + 1)
  },
  onSuccess: (data) => {
    // サーバーレスポンスで正確な値に更新
    setIsLiked(data.isLiked)
    setLikesCount(data.likesCount)
  },
  onError: () => {
    // エラー時は元の値に戻す
    setIsLiked(originalIsLiked)
    setLikesCount(originalLikesCount)
  }
})
```

## 🎯 アクセシビリティ

- **キーボードナビゲーション**: すべてのインタラクティブ要素はキーボードでアクセス可能
- **aria-labels**: スクリーンリーダー対応のラベル付け
- **フォーカス管理**: 適切なフォーカスの順序と表示

```tsx
// 例: アクセシブルなボタン
<Button
  aria-label="Like this card"
  onClick={handleLike}
  disabled={isLoading}
>
  <Heart className="h-4 w-4" />
  {likesCount}
</Button>
```

## 🚀 パフォーマンス最適化

### Hydration Safety

```tsx
// ❌ 避けるべき: Math.random()の使用
const particles = Array.from({ length: 20 }, () => ({
  x: Math.random() * 100,
  y: Math.random() * 100,
}));

// ✅ 推奨: 事前定義された値
const particles = [
  { id: 0, x: 12.5, y: 15.3, delay: 0.2 },
  { id: 1, x: 87.2, y: 22.8, delay: 0.8 },
  // ...
];

// ✅ ハイドレーション安全なランダム値
const useIsomorphicRandom = () => {
  const [random, setRandom] = useState(0);
  
  useEffect(() => {
    setRandom(Math.random());
  }, []);
  
  return random;
};
```

### Image Optimization

```tsx
import Image from "next/image"

// Next.js Image component with optimization
<Image
  src="https://images.unsplash.com/photo-example"
  alt="Description"
  width={64}
  height={64}
  className="rounded-full"
/>

// next.config.js image domains
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};
```

### Animation Performance

```tsx
// GPU-accelerated animations
<motion.div
  animate={{
    transform: "translateY(0px)", // ✅ GPU accelerated
    // top: "0px", // ❌ Avoid layout thrashing
  }}
  transition={{
    duration: 0.3,
    ease: "easeOut",
  }}
>
  Content
</motion.div>

// 3D card animations (homepage)
<motion.div
  animate={{
    rotateY: [0, 5, 0],
    rotateX: [0, 2, 0],
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  style={{
    transformStyle: "preserve-3d",
    transform: "perspective(1000px)",
  }}
>
  Card content
</motion.div>

// Particle animations (hydration-safe)
const particles = [
  { id: 0, x: 12.5, y: 15.3, delay: 0.2, duration: 3.5 },
  { id: 1, x: 87.2, y: 22.8, delay: 0.8, duration: 4.2 },
  // Pre-defined positions prevent hydration errors
];

<motion.div
  animate={{
    y: [0, -20, 0],
    opacity: [0, 1, 0],
    scale: [1, 1.5, 1],
  }}
  transition={{
    duration: particle.duration,
    repeat: Infinity,
    delay: particle.delay,
  }}
/>

// 3D card animations (homepage)
<motion.div
  animate={{
    rotateY: [0, 5, 0],
    rotateX: [0, 2, 0],
  }}
  transition={{
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut",
  }}
  style={{
    transformStyle: "preserve-3d",
    transform: "perspective(1000px)",
  }}
>
  Card content
</motion.div>

// Particle animations (hydration-safe)
const particles = [
  { id: 0, x: 12.5, y: 15.3, delay: 0.2, duration: 3.5 },
  { id: 1, x: 87.2, y: 22.8, delay: 0.8, duration: 4.2 },
  // Pre-defined positions prevent hydration errors
];

<motion.div
  animate={{
    y: [0, -20, 0],
    opacity: [0, 1, 0],
    scale: [1, 1.5, 1],
  }}
  transition={{
    duration: particle.duration,
    repeat: Infinity,
    delay: particle.delay,
  }}
/>
```

### Middleware Implementation

```tsx
// middleware.ts - Authentication-based routing
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const supabase = createMiddlewareClient({ req: request, res: response });
  const { data: { user } } = await supabase.auth.getUser();
  
  // Redirect authenticated users from root to feed
  if (pathname === "/" && user) {
    const feedUrl = new URL("/feed", request.url);
    return NextResponse.redirect(feedUrl);
  }
  
  return response;
}
```

## 🎨 Visual Design Guidelines

### Glassmorphism Effects

```tsx
// Glassmorphism card styling
<div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-xl">
  Content with glass effect
</div>

// Gradient backgrounds
<div className="bg-gradient-to-br from-purple-600 via-pink-600 to-cyan-600">
  Gradient container
</div>

// Hover effects with smooth transitions
<div className="transition-all duration-300 hover:scale-105 hover:shadow-2xl">
  Interactive element
</div>
```

### Color Palette

```tsx
// Primary gradients
const gradients = {
  primary: "from-purple-600 to-pink-600",
  secondary: "from-blue-500 to-cyan-500",
  accent: "from-emerald-500 to-teal-500",
  warm: "from-orange-500 to-red-500",
};

// Text gradients
<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
  Gradient text
</span>
```

### Modern Layout Patterns

```tsx
// Bento grid layout
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div className="md:col-span-2 md:row-span-2">Large card</div>
  <div className="md:col-span-1">Small card</div>
  <div className="md:col-span-1">Small card</div>
</div>

// Masonry layout with CSS columns
<div className="columns-1 md:columns-2 lg:columns-3 gap-6">
  <div className="break-inside-avoid mb-6">Card content</div>
</div>
```

## 🔗 参考リンク

- [shadcn UI Documentation](https://ui.shadcn.com/)
- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Lucide React Icons](https://lucide.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Next.js Image Optimization](https://nextjs.org/docs/app/building-your-application/optimizing/images)
- [Unsplash Source API](https://unsplash.com/developers)
- [CSS Glassmorphism Generator](https://css.glass/)
- [Gradient Generator](https://uigradients.com/)
