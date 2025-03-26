import { useState, useEffect } from 'react';

// ウィンドウサイズを追跡するカスタムフック
const useWindowSize = () => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    // ウィンドウサイズ変更時のハンドラ
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // リスナーの登録
    window.addEventListener('resize', handleResize);
    
    // 初期値設定
    handleResize();
    
    // クリーンアップ
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
};

export default useWindowSize;
