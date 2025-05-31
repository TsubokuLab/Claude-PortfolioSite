/**
 * 環境に応じたベースパスを提供するユーティリティ関数
 */

/**
 * アセットのパスを環境に応じて調整する
 * @param {string} path - 相対パス（例: /images/hero/example.jpg）
 * @returns {string} - 環境に応じて調整されたパス
 */
export const getAssetPath = (path) => {
  // Viteのimport.meta.env.BASE_URLを使用（ビルド時に自動設定される）
  const basePath = import.meta.env.BASE_URL || '/';
  
  // パスが既にスラッシュで始まっている場合は調整
  if (path.startsWith('/')) {
    // basePath が '/' の場合はそのまま、それ以外の場合は結合
    return basePath === '/' ? path : `${basePath.replace(/\/$/, '')}${path}`;
  }
  return basePath === '/' ? `/${path}` : `${basePath.replace(/\/$/, '')}/${path}`;
};

/**
 * データファイルのURLを環境に応じて調整する
 * @param {string} fileName - ファイル名（例: heroImages.json）
 * @returns {string} - 環境に応じて調整されたデータファイルのパス
 */
export const getDataUrl = (fileName) => {
  return getAssetPath(`/data/${fileName}`);
};
