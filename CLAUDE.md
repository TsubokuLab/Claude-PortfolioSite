# CLAUDE.md - Claude-PortfolioSite

## プロジェクト概要

坪倉輝明（メディアアーティスト/クリエイティブテクノロジスト）のポートフォリオサイト。
React + Vite で構築された SPA で、インタラクティブな 3D アニメーション・ビジュアルエフェクトと CMS 機能を備える。

- **本番サイト**: https://teruaki-tsubokura.com
- **GitHub Pages デモ**: https://tsubokulab.github.io/Claude-PortfolioSite/

---

## 技術スタック

| カテゴリ | ライブラリ | バージョン |
|---|---|---|
| フレームワーク | React | 18.2.0 |
| ビルドツール | Vite | 5.1.0 |
| ルーティング | React Router | 6.22.1 |
| UI アニメーション | Framer Motion | 11.0.5 |
| タイムラインアニメーション | GSAP | 3.12.5 |
| 3D/WebGL | Three.js | 0.161.0 |
| デプロイ | gh-pages | 6.1.1 |

---

## ディレクトリ構成

```
/
├── src/
│   ├── main.jsx              # エントリポイント（プロバイダ設定）
│   ├── App.jsx               # ルートコンポーネント（ローディング制御）
│   ├── components/
│   │   ├── animations/       # ParallaxEffect, ScrollAnimation
│   │   ├── contact/          # ContactForm
│   │   ├── home/             # Hero, FeaturedWorks
│   │   ├── layout/           # Layout, Header, Footer
│   │   ├── ui/               # CustomCursor
│   │   └── webgl/            # Three.js Background
│   ├── context/
│   │   ├── AuthContext.jsx   # 管理者認証（SHA-256）
│   │   ├── CursorContext.jsx # カスタムカーソル状態
│   │   └── ThemeContext.jsx  # ライト/ダークテーマ
│   ├── hooks/
│   │   ├── useWindowSize.js
│   │   ├── useMousePosition.js
│   │   ├── useScrollPosition.js
│   │   └── useInView.js
│   ├── pages/
│   │   ├── HomePage.jsx
│   │   ├── ProfilePage.jsx
│   │   ├── WorksPage.jsx
│   │   ├── WorkDetailPage.jsx
│   │   ├── ActivityPage.jsx
│   │   ├── ContactPage.jsx
│   │   ├── AboutPage.jsx
│   │   └── admin/            # 管理パネル（6ページ）
│   ├── routes/
│   │   ├── Router.jsx        # React Router 設定
│   │   └── ScrollToTop.jsx
│   ├── styles/
│   │   ├── variables.css     # デザイントークン（テーマ変数）
│   │   ├── index.css
│   │   └── animations.css
│   └── utils/
│       ├── api.js            # JSON データ取得
│       ├── helpers.js        # WebGL 検出・ユーティリティ
│       ├── paths.js          # URL パス管理
│       ├── youtubeUtils.js
│       └── youtubeMapping.js
├── public/
│   ├── data/
│   │   ├── works.json        # ポートフォリオ作品データ
│   │   ├── timeline.json     # 活動履歴タイムライン
│   │   ├── skills.json       # スキルマトリクス
│   │   ├── tags.json         # タグ定義
│   │   └── heroImages.json   # ヒーロー画像設定
│   ├── .htaccess             # Apache SPA ルーティング設定
│   └── 404.html              # GitHub Pages SPA フォールバック
├── .env.development          # 開発環境変数
├── .env.production           # 本番環境変数
├── vite.config.js
└── package.json
```

---

## 開発コマンド

```bash
# 開発サーバー起動（ポート 3000）
npm run dev

# コード品質チェック
npm run lint

# ビルド（環境別）
npm run build           # デフォルト
npm run build:github    # GitHub Pages 用（base path 付き）
npm run build:custom    # カスタムドメイン用（ルートパス）

# プロダクションビルドのプレビュー
npm run preview

# GitHub Pages へデプロイ
npm run deploy:github
```

---

## 環境変数

| 変数名 | 開発 | 本番 | 説明 |
|---|---|---|---|
| `VITE_BASE_PATH` | `/` | `/Claude-PortfolioSite` | Vite のベースパス |
| `VITE_ADMIN_PASSWORD_HASH` | `240be518...` (admin123) | （要変更）| 管理者パスワードの SHA-256 ハッシュ |

**重要**: 本番環境では `VITE_ADMIN_PASSWORD_HASH` を必ず安全な値に変更すること。

---

## ルーティング

### 公開ルート

| パス | ページ |
|---|---|
| `/` | ホーム（Hero + Featured Works） |
| `/profile` | アーティストプロフィール・スキル |
| `/works` | ポートフォリオグリッド |
| `/works/:workId` | 作品詳細 |
| `/activity` | 活動タイムライン（展覧会・受賞歴等） |
| `/contact` | お問い合わせフォーム |

### 管理ルート（パスワード保護）

| パス | 機能 |
|---|---|
| `/admin/login` | ログイン |
| `/admin` | ダッシュボード |
| `/admin/works` | 作品 CRUD |
| `/admin/activities` | タイムライン管理 |
| `/admin/tags` | タグ管理 |

---

## データ形式

### works.json

```json
{
  "id": "string",
  "title": "string",
  "category": "VR|mediaart|performance|device|software|interactive|installation|conceptual",
  "year": 2024,
  "description": "string",
  "technology": ["Unity", "C#"],
  "thumbnail": "images/works/xxx.jpg",
  "images": ["images/works/xxx_1.jpg"],
  "exhibition": "string",
  "awards": ["string"]
}
```

### timeline.json

```json
{
  "year": 2024,
  "events": [
    {
      "date": "YYYY-MM-DD",
      "title": "string",
      "type": "exhibition|award|works|media|workshop",
      "description": "string",
      "venue": "string",
      "venue_url": "https://...",
      "url": "https://..."
    }
  ]
}
```

---

## 認証システム

- SHA-256 でパスワードハッシュを比較するクライアントサイド認証
- セッションは `sessionStorage` に 24 時間保持
- データはすべて公開 JSON ファイル（機密データなし）
- 静的サイトのため、管理パネルはコンテンツ管理用途に限定

---

## デプロイ構成

### GitHub Pages（デモ）

```bash
npm run deploy:github
```

`gh-pages` パッケージが `dist/` を `gh-pages` ブランチに push する。

### 本番サーバー（カスタムドメイン）

- Apache サーバー + `.htaccess` で SPA ルーティングを処理
- GitHub Actions + Webhook による自動デプロイ
- `main` ブランチへの push でトリガー

---

## スタイリング

- **テーマ**: `data-theme` 属性による CSS 変数切り替え（light/dark）
- **設計方針**: コンポーネントごとに CSS ファイルを分離
- **デザイントークン**: `src/styles/variables.css` で一元管理
- **アニメーション**: Framer Motion（UI）+ GSAP（タイムライン）+ Three.js（WebGL）

---

## 注意事項

- `public/data/*.json` が CMS のデータストア（バックエンド DB なし）
- WebGL が利用不可の環境では Three.js バックグラウンドは自動で無効化される
- GitHub Pages デプロイ時は `build:github` を使用（base path が異なる）
- SPA ルーティングのため `public/404.html` と `.htaccess` が必須
