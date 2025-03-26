// 日付をフォーマットする関数
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

// 日本語と英語の混在テキストを適切に折り返す
export const wrapTextWithWordBreak = (text) => {
  if (!text) return '';
  
  // 英数字の前後に単語区切りのチャンスを設ける
  return text.replace(/([^\x01-\x7E])([\x01-\x7E])/g, '$1<wbr>$2')
             .replace(/([\x01-\x7E])([^\x01-\x7E])/g, '$1<wbr>$2');
};

// スラッグ（URL用の文字列）を生成する関数
export const generateSlug = (str) => {
  if (!str) return '';
  
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // 英数字、アンダースコア、ハイフン、スペース以外を削除
    .replace(/[\s_]+/g, '-')  // スペースとアンダースコアをハイフンに変換
    .replace(/^-+|-+$/g, ''); // 先頭と末尾のハイフンを削除
};

// テキストを指定した長さで切り詰める関数
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  
  return text.slice(0, maxLength) + '...';
};

// 画像のプリロード
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
};

// ブラウザがWebGLをサポートしているか確認
export const isWebGLSupported = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

// モバイルデバイスかどうかを判定
export const isMobileDevice = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
    (window.matchMedia && window.matchMedia('(max-width: 768px)').matches);
};

// 画面が特定のブレイクポイントより小さいかどうかを判定
export const isScreenSmallerThan = (breakpoint) => {
  return window.matchMedia && window.matchMedia(`(max-width: ${breakpoint}px)`).matches;
};
