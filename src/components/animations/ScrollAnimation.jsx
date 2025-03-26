import React, { useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import './ScrollAnimation.css';

// アニメーションプリセット
const animationPresets = {
  fadeUp: {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  },
  fadeDown: {
    hidden: { opacity: 0, y: -30 },
    visible: { opacity: 1, y: 0 }
  },
  fadeLeft: {
    hidden: { opacity: 0, x: -30 },
    visible: { opacity: 1, x: 0 }
  },
  fadeRight: {
    hidden: { opacity: 0, x: 30 },
    visible: { opacity: 1, x: 0 }
  },
  zoom: {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1 }
  },
  flip: {
    hidden: { opacity: 0, rotateY: 90 },
    visible: { opacity: 1, rotateY: 0 }
  },
  staggered: {
    hidden: { opacity: 0, y: 20 },
    visible: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
      },
    }),
  }
};

// スクロールアニメーションコンポーネント
const ScrollAnimation = ({
  children,
  type = 'fadeUp',
  duration = 0.5,
  threshold = 0.2,
  delay = 0,
  stagger = false,
  className = '',
  repeatOnInView = false, // 繰り返しアニメーション
  triggerOnce = true,     // 一度だけトリガー
  ...props
}) => {
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { threshold, triggerOnce });

  // ページ遷移アニメーションとの連携
  useEffect(() => {
    let isMounted = true; // マウント状態追跡用
    
    // 全てのアニメーションに少しの遅延を設定
    const delay = 100;

    const timer = setTimeout(() => {
      if (!isMounted) return;
      
      if (inView) {
        controls.start('visible');
      } else if (!triggerOnce && repeatOnInView) {
        controls.start('hidden');
      }
    }, delay);
    
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [controls, inView, repeatOnInView, triggerOnce]);

  const animationPreset = animationPresets[type] || animationPresets.fadeUp;

  // スタガーアニメーション用
  if (stagger && React.Children.count(children) > 1) {
    return (
      <div ref={ref} className={`scroll-animation ${className}`} {...props}>
        {React.Children.map(children, (child, i) => {
          if (!React.isValidElement(child)) return child;
          
          return (
            <motion.div
              custom={i}
              initial="hidden"
              animate={controls}
              variants={animationPresets.staggered}
              transition={{ 
                duration, 
                delay: delay + (i * 0.1), 
                ease: 'easeOut' 
              }}
            >
              {child}
            </motion.div>
          );
        })}
      </div>
    );
  }

  // 通常アニメーション
  return (
    <motion.div
      ref={ref}
      className={`scroll-animation ${className}`}
      initial="hidden"
      animate={controls}
      variants={animationPreset}
      transition={{ duration, delay, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default ScrollAnimation;
