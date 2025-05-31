# Claude Portfolio Site

メディアアーティスト/クリエイティブテクノロジスト 坪倉輝明氏のポートフォリオサイトです。React + Viteで構築されており、インタラクティブなアニメーションと3Dエフェクトを組み合わせたリッチなWebサイトです。

## 🌐 公開サイト

- **メインサイト**: [https://teruaki-tsubokura.com](https://teruaki-tsubokura.com)
- **デモサイト**: [https://tsubokulab.github.io/Claude-PortfolioSite/](https://tsubokulab.github.io/Claude-PortfolioSite/)

## ✨ 主な機能

- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **インタラクティブ3D**: Three.jsによるWebGLアニメーション
- **リッチアニメーション**: Framer Motion + GSAPによる滑らかなモーション
- **カスタムカーソル**: ユーザーインタラクションに応じた動的カーソル
- **SPA対応**: React Routerによるシングルページアプリケーション
- **管理者システム**: 作品・活動情報の管理インターフェース
- **SEO最適化**: メタタグ・構造化データ対応

## 🛠 技術スタック

### フロントエンド
- **React 18.2.0**: メインフレームワーク
- **Vite 5.1.0**: 高速ビルドツール
- **React Router 6.22.1**: SPA ルーティング
- **Framer Motion 11.0.5**: UI アニメーション
- **GSAP 3.12.5**: 高度なアニメーション
- **Three.js 0.161.0**: 3D グラフィックス

### デプロイメント
- **GitHub Pages**: デモサイト（GitHub Actions自動デプロイ）
- **カスタムドメイン**: 本番サイト（Webhook自動デプロイ）
- **Apache**: Webサーバー（.htaccess SPAサポート）

## 🚀 セットアップと開発

### 必要環境
- Node.js 18.x 以上
- npm 9.x 以上

### インストール
```bash
# リポジトリをクローン
git clone https://github.com/TsubokuLab/Claude-PortfolioSite.git
cd Claude-PortfolioSite

# 依存パッケージをインストール
npm install

# 開発サーバー起動
npm run dev
```

### 開発用コマンド
```bash
# 開発サーバー起動（ホットリロード）
npm run dev

# プロダクションビルド
npm run build

# ビルド結果のプレビュー
npm run preview

# コードの静的解析
npm run lint
```

### Windows用バッチファイル
開発効率化のためのバッチファイルが用意されています：

```batch
# 開発サーバー起動
start-dev.bat

# プロダクションビルドのテスト
build-test.bat

# 依存関係のクリーンアップ
cleanup.bat

# GitHub Pagesへのデプロイ
deployToGithubPages.bat
```

## 📦 デプロイメント

### GitHub Pages（デモサイト）
```bash
# デモサイトにデプロイ
npm run deploy:github
```
または
```batch
deployToGithubPages.bat
```

### カスタムドメイン（本番サイト）
メインブランチへのプッシュで自動デプロイされます：
1. `main` ブランチにpush
2. GitHub Actions実行
3. `gh-pages` ブランチに成果物をpush
4. Webhook発動
5. サーバー側で自動更新

## 🗂 プロジェクト構造

```
Claude-PortfolioSite/
├── public/                     # 静的アセット
│   ├── .htaccess              # Apache設定（SPA対応）
│   ├── 404.html               # カスタム404ページ
│   ├── data/                  # JSON データファイル
│   │   ├── works.json         # 作品データ
│   │   ├── timeline.json      # 活動履歴
│   │   ├── skills.json        # スキル情報
│   │   └── heroImages.json    # ヒーロー画像設定
│   └── images/                # 画像ファイル
├── src/
│   ├── components/            # React コンポーネント
│   │   ├── animations/        # アニメーション関連
│   │   ├── contact/           # お問い合わせフォーム
│   │   ├── home/              # ホームページ用
│   │   ├── layout/            # レイアウト
│   │   ├── ui/                # UI コンポーネント
│   │   └── webgl/             # WebGL/Three.js
│   ├── context/               # React Context
│   │   ├── AuthContext.jsx    # 認証管理
│   │   ├── CursorContext.jsx  # カーソル状態
│   │   └── ThemeContext.jsx   # テーマ切り替え
│   ├── hooks/                 # カスタムフック
│   ├── pages/                 # ページコンポーネント
│   │   ├── admin/             # 管理者ページ
│   │   ├── HomePage.jsx       # ホーム
│   │   ├── WorksPage.jsx      # 作品一覧
│   │   ├── ContactPage.jsx    # お問い合わせ
│   │   └── ...
│   ├── routes/                # ルーティング設定
│   ├── styles/                # グローバルスタイル
│   └── utils/                 # ユーティリティ
├── .github/workflows/         # GitHub Actions
├── .env.development           # 開発環境設定
├── vite.config.js             # Vite設定
└── package.json
```

## ⚙️ 環境設定

### 環境変数
```bash
# .env.local (ローカル開発用)
VITE_ADMIN_PASSWORD_HASH=240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9
```

### 管理者ログイン
- URL: `/admin/login`
- パスワード: `admin123`（開発環境）

## 🎨 カスタマイズ

### 作品データの追加
`public/data/works.json` に新しい作品情報を追加：
```json
{
  "id": "project-id",
  "title": "作品タイトル",
  "description": "作品説明",
  "technologies": ["React", "Three.js"],
  "images": ["/images/works/project-thumb.jpg"],
  "url": "https://project-url.com"
}
```

### スタイル変更
`src/styles/variables.css` でグローバル変数を管理：
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
}
```

### アニメーション設定
- Framer Motion: コンポーネントレベルのアニメーション
- GSAP: 複雑なタイムラインアニメーション
- Three.js: 3Dエフェクトとパーティクル

## 🔧 トラブルシューティング

### よくある問題

**Q: 開発サーバーでルーティングエラーが出る**
A: `npm run dev` で開発サーバーを再起動してください。

**Q: ビルドでパスエラーが発生する**
A: 環境に応じて適切なビルドコマンドを使用してください：
- GitHub Pages: `npm run build:github`
- カスタムドメイン: `npm run build:custom`

**Q: 管理者ページにアクセスできない**
A: .htaccess設定が正しく配置されているか確認してください。

### サポート
問題が発生した場合は、GitHubのIssuesページで報告してください。

## 📄 ライセンス

このプロジェクトはMITライセンスで公開されています。

## 👥 開発者

- **坪倉輝明** - メディアアーティスト/クリエイティブテクノロジスト
- **開発支援** - Claude (Anthropic AI)

---

## 📊 プロジェクト状況

- **現在のバージョン**: v0.1.0
- **最終更新**: 2025年5月31日
- **デプロイ状況**: ✅ 本番環境稼働中
- **管理システム**: ✅ 動作確認済み
- **レスポンシブ対応**: ✅ 完了
- **SEO対策**: ✅ 基本対応済み
