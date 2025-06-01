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

// 管理者ページインポート
import AdminLogin from '../pages/admin/AdminLogin';
import Dashboard from '../pages/admin/Dashboard';
import WorksAdmin from '../pages/admin/WorksAdmin';
import ActivityAdmin from '../pages/admin/ActivityAdmin';
import TagManagement from '../pages/admin/TagManagement';

function AppRouter() {
  // 環境に応じたbasename取得
  const getBasename = () => {
    const baseUrl = import.meta.env.BASE_URL || '/';
    // 開発環境では常に '/'、本番環境では設定されたベースURLを使用
    if (import.meta.env.DEV) {
      return '/';
    }
    return baseUrl === '/' ? '' : baseUrl.replace(/\/$/, '');
  };

  const basename = getBasename();

  // リロード時の状態復元処理
  useEffect(() => {
    // 開発環境では何もしない（末尾スラッシュ処理はGitHub Pages環境でのみ必要）
    if (import.meta.env.DEV) {
      return;
    }

    // GitHub Pages環境でのみ末尾スラッシュ処理を実行
    if (basename) {
      const handleTrailingSlash = () => {
        const currentPath = window.location.pathname;
        
        // 末尾スラッシュのないbasename URLへのアクセスを処理
        if (currentPath === basename) {
          window.history.replaceState(null, '', basename + '/');
          return true;
        }
        return false;
      };
      
      const handleInitialLoad = () => {
        if (handleTrailingSlash()) {
          return;
        }
        
        const savedPath = sessionStorage.getItem('reloadPath');
        if (savedPath) {
          sessionStorage.removeItem('reloadPath');
          
          // トップページの場合の特別処理
          if (savedPath === basename + '/' || savedPath === basename) {
            window.history.replaceState(null, '', basename + '/');
            return;
          }
          
          // basename部分を除外して相対パスに変換
          let relativePath = savedPath;
          if (savedPath.startsWith(basename)) {
            relativePath = savedPath.substring(basename.length) || '/';
          }
          
          if (window.location.pathname !== savedPath) {
            window.history.replaceState(null, '', relativePath);
          }
        }
      };
      
      handleInitialLoad();
      
      const handlePopState = () => {
        handleTrailingSlash();
      };
      
      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [basename]);

  return (
    <BrowserRouter basename={basename}>
      <ScrollToTop />
      <Routes>
        {/* 公開ページ */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="works" element={<WorksPage />} />
          <Route path="works/:workId" element={<WorkDetailPage />} />
          <Route path="activity" element={<ActivityPage />} />
          <Route path="contact" element={<ContactPage />} />
        </Route>
        
        {/* 管理者ページ */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/works" element={<WorksAdmin />} />
        <Route path="/admin/activities" element={<ActivityAdmin />} />
        <Route path="/admin/tags" element={<TagManagement />} />
        
        {/* 404ページ */}
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
