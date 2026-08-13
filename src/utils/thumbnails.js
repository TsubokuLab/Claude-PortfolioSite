/**
 * works.json の youtube を配列に正規化する。
 * 1本のときは文字列、複数本のときは配列で持てるようにしている。
 */
export const getYouTubeIds = (work) => {
  const v = work?.youtube;
  if (!v) return [];
  return (Array.isArray(v) ? v : [v]).filter(Boolean);
};

/**
 * 作品サムネイルのURL解決。WorksPage / FeaturedWorks / WorkDetailPage で共有する。
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
  const [firstVideo] = getYouTubeIds(work);
  if (firstVideo) {
    return youTubeThumbUrl(firstVideo);
  }

  return null;
};

/** YouTube動画IDからサムネイル画像のURLを作る */
export const youTubeThumbUrl = (id) => `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
