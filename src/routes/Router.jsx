import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';
import Layout from '../components/layout/Layout';

// ページインポート
import HomePage from '../pages/HomePage';
import ProfilePage from '../pages/ProfilePage';
import WorksPage from '../pages/WorksPage';
import WorkDetailPage from '../pages/WorkDetailPage';
import ActivityPage from '../pages/ActivityPage';
import ContactPage from '../pages/ContactPage';

// GitHub Pages対応のためHashRouterを使用
function AppRouter() {
  return (
    <HashRouter>
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
    </HashRouter>
  );
}

export default AppRouter;