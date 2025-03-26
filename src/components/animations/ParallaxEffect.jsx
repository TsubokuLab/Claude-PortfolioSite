import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import useWindowSize from '../../hooks/useWindowSize';
import './ParallaxEffect.css';

const ParallaxEffect = ({
  children,
  speed = 0.5,  // マイナスの値も可能、移動速度と方向を制御
  direction = 'vertical', // 'vertical' または 'horizontal'
  className = '',
  ...props
}) => {
  const ref = useRef(null);
  const { scrollY } = useScroll();
  const { height } = useWindowSize();

  // スクロール位置に基づいて変換値を計算
  const calculateYRange = (elementPosition) => {
    const start = elementPosition - height;
    const end = elementPosition + height;
    
    // スピードに基づいて移動範囲を調整
    // スピードが負の場合、逆方向に移動
    const moveRange = 100 * speed;
    
    return [moveRange, -moveRange];
  };

  // 水平方向の場合の変換
  const calculateXRange = () => {
    return [100 * speed, -100 * speed];
  };

  // 参照要素の位置を取得
  const [elementTop, setElementTop] = React.useState(0);
  
  useEffect(() => {
    if (ref.current) {
      const element = ref.current;
      const updatePosition = () => {
        const { top } = element.getBoundingClientRect();
        setElementTop(top + window.scrollY);
      };
      
      updatePosition();
      window.addEventListener('resize', updatePosition);
      
      return () => {
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [ref]);

  const y = useTransform(
    scrollY,
    [elementTop - height, elementTop + height],
    calculateYRange(elementTop)
  );
  
  const x = useTransform(
    scrollY,
    [elementTop - height, elementTop + height],
    calculateXRange()
  );

  // タッチデバイスではパララックスを無効化
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  
  if (isTouchDevice) {
    return (
      <div ref={ref} className={`parallax ${className}`} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} className={`parallax ${className}`} {...props}>
      <motion.div
        className="parallax-inner"
        style={direction === 'vertical' ? { y } : { x }}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default ParallaxEffect;
