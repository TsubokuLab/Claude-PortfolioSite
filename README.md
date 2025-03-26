# Teruaki Tsubokura Portfolio Website

このプロジェクトは、メディアアーティスト/クリエイティブテクノロジストである坪倉輝明氏のポートフォリオサイトです。React + Viteで構築されており、インタラクティブな要素とアニメーションを多用したリッチなWebサイトを実現しています。

## 機能

- レスポンシブデザイン（モバイル対応）
- インタラクティブなWebGLバックグラウンドアニメーション
- GSAPとFramer Motionを使用したアニメーション
- カスタムカーソル
- Three.jsによるパーティクルエフェクト
- ダークモード/ライトモード切り替え
- パララックスエフェクト
- 作品ギャラリー
- コンタクトフォーム

## 技術スタック

- **フロントエンド**: React.js, Vite
- **ルーティング**: React Router
- **アニメーション**: Framer Motion, GSAP
- **3Dグラフィックス**: Three.js
- **デプロイ**: GitHub Pages

## ローカル開発環境のセットアップ

### 前提条件
- Node.js 16.x以上
- npm 8.x以上

### インストール手順

1. リポジトリをクローンする
   ```bash
   git clone https://github.com/yourusername/tsubokura-portfolio.git
   cd tsubokura-portfolio
   ```

2. 依存パッケージをインストールする
   ```bash
   npm install
   ```

3. 開発サーバーを起動する
   ```bash
   npm run dev
   ```

4. ブラウザで http://localhost:5173 にアクセスする

## ビルドと本番環境へのデプロイ

### ローカルでビルドする

```bash
npm run build
```

ビルド結果は `dist` ディレクトリに生成されます。

### GitHub Pagesへのデプロイ

```bash
npm run deploy
```

このコマンドは、プロジェクトをビルドしてから `gh-pages` ブランチにプッシュします。

または、リポジトリにプッシュすると、GitHub Actionsによって自動的にデプロイされます。

## プロジェクト構造

```
tsubokura-portfolio/
├── public/                  # 静的ファイル
│   ├── images/              # 画像ファイル
│   ├── videos/              # 動画ファイル
│   ├── fonts/               # フォントファイル
│   └── data/                # JSON形式のデータファイル
├── src/
│   ├── components/          # Reactコンポーネント
│   │   ├── animations/      # アニメーション関連コンポーネント
│   │   ├── contact/         # コンタクトフォーム関連
│   │   ├── home/            # ホームページ用コンポーネント
│   │   ├── layout/          # レイアウト関連コンポーネント
│   │   ├── ui/              # UI要素
│   │   ├── webgl/           # WebGL関連コンポーネント
│   │   └── works/           # 作品関連コンポーネント
│   ├── context/             # Reactコンテキスト
│   ├── hooks/               # カスタムフック
│   ├── pages/               # ページコンポーネント
│   ├── routes/              # ルーティング
│   ├── styles/              # スタイルシート
│   ├── utils/               # ユーティリティ関数
│   ├── App.jsx              # アプリケーションのメインコンポーネント
│   └── main.jsx             # エントリーポイント
├── .github/                 # GitHub関連設定
├── vite.config.js           # Vite設定
└── package.json             # npmパッケージ設定
```

## カスタマイズ方法

### 作品データの追加

`public/data/works.json` ファイルに新しい作品データを追加するだけで、自動的に作品一覧や詳細ページに反映されます。

### スタイルのカスタマイズ

スタイル変数は `src/styles/variables.css` で定義されています。色やフォントなどの基本設定をここで変更できます。

### コンポーネントの追加

コンポーネントは `src/components` ディレクトリに機能ごとに整理されています。新しいコンポーネントを追加する際は、該当するディレクトリに追加してください。

## 著者

- 坪倉輝明 - メディアアーティスト/クリエイティブテクノロジスト
