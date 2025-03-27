import React from 'react';
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