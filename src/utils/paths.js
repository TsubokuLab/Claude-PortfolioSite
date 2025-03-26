/**
 * 環境に応じたベースパスを提供するユーティリティ関数
 */

/**
 * アセットのパスを環境に応じて調整する
 * @param {string} path - 相対パス（例: /images/hero/example.jpg）
 * @returns {string} - 環境に応じて調整されたパス
 */
export const getAssetPath = (path) => {
  const basePath = import.meta.env.VITE_BASE_PATH || '';
  // パスが既にスラッシュで始まっている場合は調整
  if (path.startsWith('/')) {
    return `${basePath}${path}`;
  }
  return `${basePath}/${path}`;
};

/**
 * データファイルのURLを環境に応じて調整する
 * @param {string} fileName - ファイル名（例: heroImages.json）
 * @returns {string} - 環境に応じて調整されたデータファイルのパス
 */
export const getDataUrl = (fileName) => {
  return getAssetPath(`/data/${fileName}`);
};
