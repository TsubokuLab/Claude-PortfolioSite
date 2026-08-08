/**
 * 作品サムネイルのURL解決。WorksPage と FeaturedWorks で共有する。
 *
 * 優先順位:
 *   1. works.json の thumbnail
 *   2. image-manifest.json（public/images/works/{work id}/ をビルド時にスキャンしたもの）
 *   3. works.json の youtube（動画IDからYouTubeのサムネイルを使う）
 */
export const resolveThumbUrl = (work, manifest = {}) => {
  const raw =
    work.thumbnail ||
    (() => {
      const files = manifest[work.id] || [];
      return files.find(f => /thumbnail\.(jpe?g|png|webp|gif)$/i.test(f)) || files[0] || null;
    })();

  if (raw) {
    return `${import.meta.env.BASE_URL}${raw.replace(/^\.\//, '')}`;
  }

  // ローカル画像が無い場合はYouTubeのサムネイルで代替する
  // （VRChatワールドなど、静止画は無いが動画はある作品向け）
  if (work.youtube) {
    return `https://i.ytimg.com/vi/${work.youtube}/hqdefault.jpg`;
  }

  return null;
};
