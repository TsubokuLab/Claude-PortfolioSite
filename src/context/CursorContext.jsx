import React, { createContext, useContext, useState } from 'react';

const CursorContext = createContext();

export const useCursor = () => useContext(CursorContext);

export const CursorProvider = ({ children }) => {
  const [cursorType, setCursorType] = useState('default');
  const [cursorText, setCursorText] = useState('');

  // カーソルタイプを変更
  const setCursor = (type) => {
    setCursorType(type);
  };

  // カーソルテキストを設定
  const setCursorTextContent = (text) => {
    setCursorText(text);
  };

  // カーソルをデフォルトに戻す
  const resetCursor = () => {
    setCursorType('default');
    setCursorText('');
  };

  return (
    <CursorContext.Provider 
      value={{ 
        cursorType, 
        cursorText, 
        setCursor, 
        setCursorTextContent, 
        resetCursor 
      }}
    >
      {children}
    </CursorContext.Provider>
  );
};
