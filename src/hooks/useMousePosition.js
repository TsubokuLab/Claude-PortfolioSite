import { useState, useEffect } from 'react';

// マウス位置を追跡するカスタムフック
const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', updateMousePosition, { passive: true });

    return () => {
      window.removeEventListener('mousemove', updateMousePosition, { passive: true });
    };
  }, []);

  return mousePosition;
};

export default useMousePosition;
