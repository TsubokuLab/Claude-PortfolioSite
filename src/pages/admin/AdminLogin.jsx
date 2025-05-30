import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Navigate } from 'react-router-dom';
import './AdminLogin.css';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  // 既に認証済みの場合は管理者ページにリダイレクト
  if (isAuthenticated) {
    return <Navigate to="/admin/works" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(password);
    
    if (result.success) {
      // ログイン成功時は自動的にリダイレクトされる
    } else {
      setError(result.error);
      setPassword('');
    }
    
    setLoading(false);
  };

  return (
    <div className="admin-login">
      <div className="login-container">
        <div className="login-header">
          <h1>管理者ログイン</h1>
          <p>コンテンツ管理システムにアクセスするにはパスワードを入力してください</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="password">パスワード</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="管理者パスワードを入力"
              disabled={loading}
              autoFocus
            />
          </div>

          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="login-button"
            disabled={loading || !password.trim()}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                認証中...
              </>
            ) : (
              'ログイン'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            <a href="/" className="back-link">← サイトトップに戻る</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;