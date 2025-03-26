# インストールと実行手順

このドキュメントでは、坪倉輝明ポートフォリオサイトのセットアップ方法と実行手順について説明します。

## 必要な環境

- Node.js (バージョン 16.x 以上)
- npm (バージョン 8.x 以上)

## インストール手順

1. リポジトリをクローンまたはダウンロードします。

```bash
git clone [リポジトリのURL]
cd tsubokura-portfolio
```

2. 必要な依存パッケージをインストールします。

```bash
npm install
```

## 開発サーバーの起動

ローカル開発サーバーを起動するには、以下のコマンドを実行します。

```bash
npm run dev
```

このコマンドにより、Vite開発サーバーが起動し、デフォルトでは http://localhost:5173 でアクセスできるようになります。

## ビルド手順

本番用にプロジェクトをビルドするには、以下のコマンドを実行します。

```bash
npm run build
```

ビルドされたファイルは `dist` ディレクトリに出力されます。

## GitHub Pagesへのデプロイ

このプロジェクトはGitHub Pagesにデプロイするように設定されています。デプロイするには以下の手順に従ってください。

1. `vite.config.js` ファイルの `base` パラメータが正しく設定されていることを確認します。リポジトリ名に合わせて変更が必要な場合があります。

```javascript
base: '/リポジトリ名/',  // 例: '/tsubokura-portfolio/'
```

2. 以下のコマンドを実行してデプロイします。

```bash
npm run deploy
```

または、直接GitHubにプッシュすると、GitHub Actionsによって自動的にビルドとデプロイが行われます。

## プロジェクト構造

```
tsubokura-portfolio/
├── public/                  # 静的ファイル
│   ├── data/                # JSON形式のデータファイル
│   ├── images/              # 画像ファイル
│   ├── videos/              # 動画ファイル
│   └── fonts/               # フォントファイル
├── src/
│   ├── components/          # Reactコンポーネント
│   ├── context/             # Reactコンテキスト
│   ├── hooks/               # カスタムフック
│   ├── pages/               # ページコンポーネント
│   ├── routes/              # ルーティング
│   ├── styles/              # スタイルシート
│   ├── utils/               # ユーティリティ関数
│   ├── App.jsx              # アプリケーションのメインコンポーネント
│   └── main.jsx             # エントリーポイント
├── .github/                 # GitHub Actions設定
├── vite.config.js           # Vite設定
└── package.json             # npm設定
```

## 注意事項

- 画像やビデオなどのメディアファイルは `public` ディレクトリに配置してください。
- 作品データの追加や編集は `public/data` ディレクトリ内のJSONファイルを更新してください。
- スタイル変数は `src/styles/variables.css` で管理されています。テーマカラーなどの変更はこのファイルを編集してください。
