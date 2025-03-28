import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import Layout from '../components/layout/Layout';

// ページインポート
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import WorksPage from '../pages/WorksPage';
import WorkDetailPage from '../pages/WorkDetailPage';
import ActivityPage from '../pages/ActivityPage';
import ContactPage from '../pages/ContactPage';

// BrowserRouterに変更し、basename属性を追加
function AppRouter() {
  // リロード時の状態復元処理
  useEffect(() => {
    // リロード後の初期化処理
    const handleInitialLoad = () => {
      const savedPath = sessionStorage.getItem('reloadPath');
      if (savedPath) {
        // 保存されたパスがある場合、復元を試みる
        sessionStorage.removeItem('reloadPath');
        // basename部分を除外して相対パスに変換
        const basePath = '/Claude-PortfolioSite';
        let relativePath = savedPath;
        if (savedPath.startsWith(basePath)) {
          relativePath = savedPath.substring(basePath.length) || '/';
        }
        // 現在のパスと異なる場合のみ復元
        if (window.location.pathname !== savedPath) {
          window.history.replaceState(null, '', relativePath);
        }
      }
    };
    
    handleInitialLoad();
  }, []);

  return (
    <BrowserRouter basename="/Claude-PortfolioSite">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="works" element={<WorksPage />} />
          <Route path="works/:workId" element={<WorkDetailPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="*" element={<div>Page Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;