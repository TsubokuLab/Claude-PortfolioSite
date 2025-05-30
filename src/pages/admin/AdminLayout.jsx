import React from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = ({ children }) => {
  const { isAuthenticated, logout, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>認証情報を確認中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  const handleLogout = () => {
    if (window.confirm('ログアウトしますか？')) {
      logout();
    }
  };

  return (
    <div className="admin-layout">
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-header-left">
            <h1 className="admin-title">
              <Link to="/admin">管理者パネル</Link>
            </h1>
            <nav className="admin-nav">
              <Link 
                to="/admin" 
                className={`nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
              >
                🏠 ダッシュボード
              </Link>
              <Link 
                to="/admin/works" 
                className={`nav-item ${location.pathname === '/admin/works' ? 'active' : ''}`}
              >
                🎨 Works管理
              </Link>
              <Link 
                to="/admin/activities" 
                className={`nav-item ${location.pathname === '/admin/activities' ? 'active' : ''}`}
              >
                📅 Activity管理
              </Link>
            </nav>
          </div>
          <div className="admin-header-right">
            <Link to="/" className="view-site-link">
              サイトを見る
            </Link>
            <button onClick={handleLogout} className="logout-button">
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;