import React, { useEffect } from 'react';
import useMousePosition from '../../hooks/useMousePosition';
import './CustomCursor.css';

const CustomCursor = ({ type = 'default', text = '' }) => {
  // デフォルトカーソルを使用するために常にnullを返す
  return null;
};

export default CustomCursor;
