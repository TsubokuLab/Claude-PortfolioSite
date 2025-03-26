import React, { useEffect } from 'react';
import useMousePosition from '../../hooks/useMousePosition';
import './CustomCursor.css';

const CustomCursor = ({ type = 'default', text = '' }) => {
  const { x, y } = useMousePosition();

  // マウス位置が取得できているか確認
  const hasMousePosition = typeof x === 'number' && typeof y === 'number';

  // カーソルのスタイル
  const cursorStyle = hasMousePosition ? {
    left: `${x}px`,
    top: `${y}px`,
  } : {};

  // タッチデバイスの場合は何も表示しない
  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
      document.body.classList.add('custom-cursor-active');
    }
    
    return () => {
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  // タッチデバイスの場合は何も表示しない
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
    return null;
  }

  return (
    <>
      <div 
        className={`cursor-dot ${type}`}
        style={cursorStyle}
      />
      <div 
        className={`cursor-ring ${type}`}
        style={cursorStyle}
      >
        {type === 'text' && text && (
          <span className="cursor-text">{text}</span>
        )}
      </div>
    </>
  );
};

export default CustomCursor;
