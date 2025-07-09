## ui-components.md

# UI Components Documentation

このプロジェクトで使用しているUIコンポーネントの一覧と基本的な使用方法をまとめています。

## 🎨 UIライブラリ

- **shadcn UI**: Radix UIとTailwind CSSベースのコンポーネントライブラリ
- **Sonner**: トースト通知用ライブラリ（shadcn UIのtoastの代替）

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

## 🔗 参考リンク

- [shadcn UI Documentation](https://ui.shadcn.com/)
- [Sonner Documentation](https://sonner.emilkowal.ski/)
- [Radix UI Documentation](https://www.radix-ui.com/)
