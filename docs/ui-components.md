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

## 🎨 アイコン使用例

```tsx
import { Heart, MessageCircle, Copy, GitBranch, Share2, User, Settings } from "lucide-react"

// 使用例
<Button>
  <Heart className="h-4 w-4 mr-2" />
  Like
</Button>

<Button>
  <MessageCircle className="h-4 w-4 mr-2" />
  Comment
</Button>
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

## 🔗 参考リンク

- [shadcn UI Documentation](https://ui.shadcn.com/)
- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Lucide React Icons](https://lucide.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
