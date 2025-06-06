import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// ページ遷移時に画面を一番上にスクロールする
// ただし、ブラウザバック時はスクロール位置を復元する
// また、Google Analyticsにページビューを送信する
function ScrollToTop() {
  const { pathname } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    // POPはブラウザの戻る/進むボタンによる遷移
    // PUSHはリンクなどによる通常の遷移
    if (navigationType !== 'POP') {
      // ブラウザバック/フォワード以外の場合のみスクロールトップ
      window.scrollTo(0, 0);
    }

    // Google Analyticsにページビューを送信
    if (typeof gtag === 'function') {
      // 現在のページタイトルを取得
      const pageTitle = document.title;
      // 現在のフルパスを取得
      const pagePath = window.location.pathname + window.location.search + window.location.hash;
      
      // Google Analyticsにページビューを送信
      gtag('event', 'page_view', {
        page_title: pageTitle,
        page_path: pagePath,
        send_to: 'G-TFTH0DVE14'
      });
    }
  }, [pathname, navigationType]);

  return null;
}

export default ScrollToTop;
