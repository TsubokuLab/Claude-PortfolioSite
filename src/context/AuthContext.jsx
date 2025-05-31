import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // セッションチェック
  useEffect(() => {
    const checkAuth = () => {
      const authSession = sessionStorage.getItem('admin_authenticated');
      const authTimestamp = sessionStorage.getItem('admin_auth_timestamp');
      
      if (authSession && authTimestamp) {
        const now = Date.now();
        const authTime = parseInt(authTimestamp);
        // 24時間でセッション期限切れ
        const sessionDuration = 24 * 60 * 60 * 1000;
        
        if (now - authTime < sessionDuration) {
          setIsAuthenticated(true);
        } else {
          // セッション期限切れ
          logout();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  // SHA-256ハッシュを生成する関数
  const generateHash = async (password) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  };

  // ログイン関数
  const login = async (password) => {
    try {
      const inputHash = await generateHash(password);
      const expectedHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;
      
      // デバッグ用ログ（本番では削除）
      console.log('Input password:', password);
      console.log('Input hash:', inputHash);
      console.log('Expected hash:', expectedHash);
      console.log('Environment check:', import.meta.env);
      
      if (inputHash === expectedHash) {
        setIsAuthenticated(true);
        sessionStorage.setItem('admin_authenticated', 'true');
        sessionStorage.setItem('admin_auth_timestamp', Date.now().toString());
        return { success: true };
      } else {
        return { success: false, error: 'パスワードが正しくありません' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: '認証中にエラーが発生しました' };
    }
  };

  // ログアウト関数
  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_auth_timestamp');
  };

  const value = {
    isAuthenticated,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
