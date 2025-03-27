import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useCursor } from '../../context/CursorContext';
import { getAssetPath, getDataUrl } from '../../utils/paths';
import './Hero.css';

const Hero = () => {
  const { setCursor, resetCursor } = useCursor();
  const titleRef = useRef(null);
  const [heroImages, setHeroImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState(null);
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const [overlayImage, setOverlayImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  // 自動再生フラグ
  const [autoplay, setAutoplay] = useState(true);
  const autoplayTimerRef = useRef(null);

  // ヒーロー画像データを読み込む
  useEffect(() => {
    const fetchHeroImages = async () => {
      try {
        const response = await fetch(getDataUrl('heroImages.json'));
        if (!response.ok) {
          throw new Error('Failed to fetch hero images data');
        }
        const data = await response.json();
        setHeroImages(data.images);
        setLoading(false);
      } catch (error) {
        console.error('Error loading hero images:', error);
        setLoading(false);
      }
    };

    fetchHeroImages();
  }, []);

  // 画像を切り替える関数
  const transitionToImage = (index) => {
    if (isTransitioning || index === currentImageIndex) return;
    
    setIsTransitioning(true);
    setNextImageIndex(index);
    setOverlayImage(heroImages[index]);
    
    // オーバーレイを表示（フェードイン開始）
    setTimeout(() => {
      setIsOverlayVisible(true);
      
      // フェードイン完了後の処理
      setTimeout(() => {
        // 現在の画像を更新
        setCurrentImageIndex(index);
        // オーバーレイを非表示
        setIsOverlayVisible(false);
        setIsTransitioning(false);
      }, 1000); // フェードイン完了を待つ
    }, 50);
  };

  // インジケーターのクリックハンドラー
  const handleIndicatorClick = (index) => {
    // 自動再生を一時停止
    setAutoplay(false);
    if (autoplayTimerRef.current) {
      clearTimeout(autoplayTimerRef.current);
    }
    
    // 選択した画像に切り替え
    transitionToImage(index);
    
    // 10秒後に自動再生を再開
    autoplayTimerRef.current = setTimeout(() => {
      setAutoplay(true);
    }, 10000);
  };

  // 画像を一定時間ごとに切り替え
  useEffect(() => {
    if (heroImages.length <= 1 || loading || !autoplay || isTransitioning) return;

    const interval = setInterval(() => {
      // 次の画像インデックスを計算
      const next = (currentImageIndex + 1) % heroImages.length;
      transitionToImage(next);
    }, 5000); // 5秒ごとに切り替え
    
    return () => clearInterval(interval);
  }, [heroImages, currentImageIndex, loading, autoplay, isTransitioning]);

  // クリーンアップ
  useEffect(() => {
    return () => {
      if (autoplayTimerRef.current) {
        clearTimeout(autoplayTimerRef.current);
      }
    };
  }, []);

  // タイトルテキストのスプリットアニメーション
  useEffect(() => {
    if (!titleRef.current) return;
    
    const titleElement = titleRef.current;
    // 名前の間にスペースが確実に入るように分割
    const firstLastName = "TERUAKI TSUBOKURA";
    const titleChars = firstLastName.split('');
    
    titleElement.innerHTML = '';
    
    titleChars.forEach((char, index) => {
      const span = document.createElement('span');
      span.innerText = char;
      span.style.animationDelay = `${index * 0.05}s`;
      span.classList.add('hero-title-char');
      
      if (char === ' ') {
        span.classList.add('space');
        // スペースに適切な幅を与えるためのスタイルを追加
        span.style.display = 'inline-block';
        span.style.width = '0.5em';
      }
      
      titleElement.appendChild(span);
    });

    // 名前の単語が途中で改行されないようにするためのスタイル追加
    const nameSpans = titleElement.querySelectorAll('.hero-title-char');
    
    // 「TERUAKI」と「TSUBOKURA」それぞれをグループ化するための要素を作成
    const firstNameGroup = document.createElement('span');
    firstNameGroup.classList.add('name-group');
    firstNameGroup.style.whiteSpace = 'nowrap';
    const lastNameGroup = document.createElement('span');
    lastNameGroup.classList.add('name-group');
    lastNameGroup.style.whiteSpace = 'nowrap';
    
    // 文字をグループに移動
    let isFirstName = true;
    nameSpans.forEach(span => {
      if (span.classList.contains('space')) {
        titleElement.appendChild(firstNameGroup);
        titleElement.appendChild(span);
        isFirstName = false;
        return;
      }
      
      if (isFirstName) {
        firstNameGroup.appendChild(span);
      } else {
        lastNameGroup.appendChild(span);
      }
    });
    
    // 最後のグループを追加
    if (lastNameGroup.childNodes.length > 0) {
      titleElement.appendChild(lastNameGroup);
    }
  }, []);

  // 現在の画像のパスを取得
  const getCurrentImage = () => {
    if (!heroImages.length) return null;
    return heroImages[currentImageIndex];
  };

  const currentImage = getCurrentImage();

  // 画像の向きに基づいたパララックスクラスを取得
  const getParallaxClass = (image) => {
    if (!image) return '';
    return image.orientation === 'portrait' ? 'parallax-vertical' : 'parallax-horizontal';
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="hero-text">
          <motion.div className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Media Artist / Creative Technologist
          </motion.div>
          
          <h1 className="hero-title" ref={titleRef}>
            TERUAKI TSUBOKURA
          </h1>
          
          <motion.p className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            インタラクティブな映像演出やフィジカルセンシングを駆使し、
            現実とデジタルの境界を曖昧にする体験を創造します。
          </motion.p>
          
          <motion.div className="hero-buttons"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <Link to="/works" className="button primary"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              作品を見る
            </Link>
            <Link to="/contact" className="button secondary"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              お問い合わせ
            </Link>
          </motion.div>
        </div>
        
        <motion.div className="hero-image"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="hero-image-inner">
            {!loading && currentImage && (
              <div className="hero-slider-container">
                {/* 現在の画像（ベースレイヤー - 常に表示） */}
                <div 
                  className={`hero-slider-image base-layer ${getParallaxClass(currentImage)}`}
                  style={{
                    backgroundImage: `url(${getAssetPath(currentImage.path)})`,
                    zIndex: 1
                  }}
                ></div>
                
                {/* オーバーレイレイヤー（常に存在するが、可視性を切り替え） */}
                <div 
                  className={`hero-slider-image overlay-layer ${overlayImage ? getParallaxClass(overlayImage) : ''}`}
                  style={{
                    backgroundImage: overlayImage ? `url(${getAssetPath(overlayImage.path)})` : 'none',
                    opacity: isOverlayVisible ? 1 : 0,
                    zIndex: 10,
                    transition: 'opacity 1s ease'
                  }}
                ></div>
              </div>
            )}
            
            {/* ローディング中または画像がない場合のプレースホルダー */}
            {(loading || !currentImage) && (
              <div className="hero-image-placeholder"></div>
            )}
            
            {/* 画像インジケーター */}
            {!loading && heroImages.length > 0 && (
              <div className="slider-indicators">
                {heroImages.map((image, index) => (
                  <div 
                    key={image.id}
                    className={`slider-indicator ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => handleIndicatorClick(index)}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                  ></div>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </div>
      
      <div className="hero-scroll-indicator">
        <div className="scroll-text">SCROLL</div>
        <i className="fa-solid fa-chevron-down scroll-arrow"></i>
      </div>
    </section>
  );
};

export default Hero;