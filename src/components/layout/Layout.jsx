import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import './Layout.css';

const Layout = () => {
  const location = useLocation();
  const [transitionStage, setTransitionStage] = useState('fadeIn');
  
  // ロケーション変更を処理
  useEffect(() => {
    // 新しいページ遷移時は常にフェードインから始める
    setTransitionStage('fadeOut');
    
    // スクロールをトップに戻す
    window.scrollTo(0, 0);
    
    // ページ表示直後にフェードイン
    setTimeout(() => {
      setTransitionStage('fadeIn');
    }, 50);
  }, [location.pathname]);

  return (
    <div className="layout">
      <Header />
      <main className="main-content">
        <div className={`page-transition-wrapper ${transitionStage}`}>
          <div className="page-content">
            <Outlet />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;