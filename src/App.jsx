import React, { useEffect, useState, useCallback } from 'react';
import AppRouter from './routes/Router';
import CustomCursor from './components/ui/CustomCursor';
import { useCursor } from './context/CursorContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  const { cursorType } = useCursor();
  const [isLoaded, setIsLoaded] = useState(false);
  
  // 初期ロード完了の処理
  const handleInitialLoad = useCallback(() => {
    document.body.classList.add('loaded');
    setIsLoaded(true);
  }, []);

  // 初期ロード時のアニメーション処理
  useEffect(() => {
    // ページロード完了時のクラス追加
    const timer = setTimeout(() => {
      handleInitialLoad();
    }, 100);
    
    // アプリがアンロードされる時に特別なクラスを追加
    const unloadHandler = () => {
      document.body.classList.add('unloading');
    };
    
    // 内部遷移時のイベント
    // 特に処理が必要な場合のみイベントを追加する
    const handleRouteChange = (event) => {
      // 不要な処理を削除
      // スクロール処理はRouter.jsxにScrollに移管
    };
    
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('beforeunload', unloadHandler);
    
    return () => {
      clearTimeout(timer);
      document.body.classList.remove('loaded');
      window.removeEventListener('beforeunload', unloadHandler);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [handleInitialLoad]);

  return (
    <AuthProvider>
      <div className={`app ${isLoaded ? 'app-loaded' : ''}`}>
        <CustomCursor type={cursorType} />
        {isLoaded && <AppRouter />}
        
        {/* ページ全体の初期ローディングアニメーション用オーバーレイ */}
        <div className={`app-loading-overlay ${isLoaded ? 'hidden' : ''}`}>
          <div className="loading-spinner"></div>
        </div>
      </div>
    </AuthProvider>
  );
}

export default App;