# Vercel Deployment Guide

## 環境変数設定

Vercelでのデプロイ時に必要な環境変数を正しく設定する必要があります。

### 必要な環境変数

1. **DATABASE_URL**
   - Supabaseのプーリング接続URL（アプリケーション用）
   - 形式: `postgresql://[user]:[password]@[host]:[port]/[database]?pgbouncer=true`
   - 例: `postgresql://postgres.xxxxx:password@aws-0-region.pooler.supabase.com:5432/postgres?pgbouncer=true`

2. **DIRECT_URL**
   - Supabaseの直接接続URL（マイグレーション用）
   - 形式: `postgresql://[user]:[password]@[host]:[port]/[database]`
   - 例: `postgresql://postgres.xxxxx:password@db.xxxxx.supabase.co:5432/postgres`

3. **NEXT_PUBLIC_SUPABASE_URL**
   - SupabaseプロジェクトのURL
   - 形式: `https://[project-id].supabase.co`

4. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Supabaseの匿名キー（公開可能）

### Vercelでの設定手順

1. Vercelダッシュボードでプロジェクトを選択
2. Settings → Environment Variables に移動
3. 各環境変数を追加：
   - Key: 環境変数名
   - Value: 環境変数の値（引用符なし）

### 注意事項

- 環境変数の値に引用符を含めないでください
- URLは完全な形式である必要があります（プロトコルを含む）
- Supabaseダッシュボードから正しい接続文字列をコピーしてください：
  - Settings → Database → Connection String でプーリング用と直接接続用の両方を取得
- パスワードに特殊文字が含まれる場合は、URLエンコードが必要な場合があります

### トラブルシューティング

#### "Invalid url" エラーが発生する場合

1. 環境変数が空でないことを確認
2. URLの形式が正しいことを確認（`postgresql://` で始まる）
3. 特殊文字がURLエンコードされていることを確認
4. Vercelの環境変数設定で値が正しく保存されていることを確認

#### ビルドをスキップして環境変数を確認

開発時のみ、環境変数のバリデーションをスキップできます：

```bash
SKIP_ENV_VALIDATION=1 npm run build
```

**注意**: 本番環境では環境変数のバリデーションをスキップしないでください。
