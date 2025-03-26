import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchWorks, fetchWorkById } from '../utils/api';
import ScrollAnimation from '../components/animations/ScrollAnimation';
import ParallaxEffect from '../components/animations/ParallaxEffect';
import { useCursor } from '../context/CursorContext';
import { formatDate } from '../utils/helpers';
import { getYouTubeUrl, hasYouTubeVideo } from '../utils/youtubeMapping';
import './WorkDetailPage.css';

const WorkDetailPage = () => {
  const { workId } = useParams();
  const [work, setWork] = useState(null);
  const [relatedWorks, setRelatedWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const navigate = useNavigate();
  const { setCursor, resetCursor } = useCursor();
  const [youtubeUrl, setYoutubeUrl] = useState(null);

  // 作品データの取得
  useEffect(() => {
    const getWorkData = async () => {
      setLoading(true);
      
      // 対象の作品データを取得
      const workData = await fetchWorkById(workId);
      if (!workData) {
        // 作品が見つからない場合は作品一覧ページにリダイレクト
        navigate('/works');
        return;
      }
      
      setWork(workData);
      
      // YouTubeのURLを取得
      const ytUrl = getYouTubeUrl(workId);
      setYoutubeUrl(ytUrl);
      
      // 動画がある場合は初期選択を動画にする
      if (ytUrl) {
        setIsVideoActive(true);
        setActiveIndex(0);
      }
      
      // 関連作品を取得（同じカテゴリーの作品を最大3つ）
      const allWorks = await fetchWorks();
      const related = allWorks
        .filter(w => w.id !== workId && w.category === workData.category)
        .slice(0, 3);
      
      setRelatedWorks(related);
      setLoading(false);
    };
    
    getWorkData();
  }, [workId, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>作品データを読み込んでいます...</p>
      </div>
    );
  }

  if (!work) {
    return null;
  }

  // 画像ギャラリー用の画像配列を作成
  const galleryImages = [
    ...(work.thumbnail ? [work.thumbnail] : []),
    ...(work.images?.filter(img => img !== work.thumbnail) || [])
  ];

  // サムネイル選択時の処理
  const handleThumbnailClick = (index, isVideo = false) => {
    setActiveIndex(index);
    setIsVideoActive(isVideo);
  };

  // 前の画像へ
  const handlePrev = () => {
    if (isVideoActive) {
      // 動画が表示されている場合は最後の画像へ
      setIsVideoActive(false);
      setActiveIndex(galleryImages.length - 1);
    } else if (activeIndex === 0) {
      // 最初の画像の場合は、動画があれば動画へ、なければ最後の画像へ
      if (youtubeUrl) {
        setIsVideoActive(true);
      } else {
        setActiveIndex(galleryImages.length - 1);
      }
    } else {
      // それ以外は前の画像へ
      setActiveIndex(activeIndex - 1);
    }
  };

  // 次の画像へ
  const handleNext = () => {
    if (isVideoActive) {
      // 動画が表示されている場合は最初の画像へ
      setIsVideoActive(false);
      setActiveIndex(0);
    } else if (activeIndex === galleryImages.length - 1) {
      // 最後の画像の場合は、動画があれば動画へ、なければ最初の画像へ
      if (youtubeUrl) {
        setIsVideoActive(true);
      } else {
        setActiveIndex(0);
      }
    } else {
      // それ以外は次の画像へ
      setActiveIndex(activeIndex + 1);
    }
  };

  return (
    <div className="work-detail-page">
      <div className="container">
        <div className="back-to-works">
          <Link 
            to="/works" 
            className="back-link"
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={resetCursor}
          >
            ← 作品一覧に戻る
          </Link>
        </div>
        
        <div className="work-detail-header">
          <ScrollAnimation type="fadeUp">
            <h1 className="work-detail-title">{work.title}</h1>
            <div className="work-detail-meta">
              <span className="work-detail-category">{work.category}</span>
              <span className="work-detail-year">{work.year}</span>
              {work.exhibition && (
                <span className="work-detail-exhibition">{work.exhibition}</span>
              )}
            </div>
          </ScrollAnimation>
        </div>
        
        <div className="work-detail-content">
          <div className="work-detail-gallery">
            <ScrollAnimation type="fadeUp">
              <div className="gallery-main">
                {isVideoActive && youtubeUrl ? (
                  // YouTube動画表示
                  <div className="youtube-embed-container">
                    <iframe
                      src={youtubeUrl}
                      title={work.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  // 画像表示
                  galleryImages.length > 0 && (
                    <img 
                      src={`${import.meta.env.BASE_URL}${galleryImages[activeIndex].replace(/^\.\//, '')}`} 
                      alt={`${work.title} - ${activeIndex + 1}`} 
                      className="gallery-active-image"
                    />
                  )
                )}
                
                {/* ナビゲーションボタン */}
                {(galleryImages.length > 1 || youtubeUrl) && (
                  <>
                    <button 
                      className="gallery-nav prev"
                      onClick={handlePrev}
                      onMouseEnter={() => setCursor('hover')}
                      onMouseLeave={resetCursor}
                      aria-label="前の画像"
                    >
                      ←
                    </button>
                    <button 
                      className="gallery-nav next"
                      onClick={handleNext}
                      onMouseEnter={() => setCursor('hover')}
                      onMouseLeave={resetCursor}
                      aria-label="次の画像"
                    >
                      →
                    </button>
                  </>
                )}
              </div>
              
              {/* サムネイル */}
              {(galleryImages.length > 0 || youtubeUrl) && (
                <div className="gallery-thumbnails">
                  {/* 動画サムネイル */}
                  {youtubeUrl && (
                    <button
                      className={`gallery-thumbnail youtube-thumbnail ${isVideoActive ? 'active' : ''}`}
                      onClick={() => handleThumbnailClick(0, true)}
                      onMouseEnter={() => setCursor('hover')}
                      onMouseLeave={resetCursor}
                    >
                      <div className="thumbnail-video-icon">▶</div>
                      {/* サムネイル画像がない場合は作品の最初の画像を使用 */}
                      {galleryImages.length > 0 ? (
                        <img src={`${import.meta.env.BASE_URL}${galleryImages[0].replace(/^\.\//, '')}`} alt={`${work.title} - 動画`} />
                      ) : (
                        <div className="thumbnail-placeholder">動画</div>
                      )}
                    </button>
                  )}
                  
                  {/* 画像サムネイル */}
                  {galleryImages.map((image, index) => (
                    <button
                      key={`image-${index}`}
                      className={`gallery-thumbnail ${!isVideoActive && activeIndex === index ? 'active' : ''}`}
                      onClick={() => handleThumbnailClick(index, false)}
                      onMouseEnter={() => setCursor('hover')}
                      onMouseLeave={resetCursor}
                    >
                      <img src={`${import.meta.env.BASE_URL}${image.replace(/^\.\//, '')}`} alt={`${work.title} - ${index + 1}`} />
                    </button>
                  ))}
                </div>
              )}
            </ScrollAnimation>
          </div>
          
          <div className="work-detail-info">
            <ScrollAnimation type="fadeUp" delay={0.2}>
              <div className="work-detail-description">
                <h2>概要</h2>
                <p>{work.description}</p>
              </div>
              
              {work.technology && work.technology.length > 0 && (
                <div className="work-detail-technology">
                  <h2>使用技術</h2>
                  <ul className="technology-list">
                    {work.technology.map((tech, index) => (
                      <li key={index} className="technology-item">
                        {tech}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {work.awards && work.awards.length > 0 && (
                <div className="work-detail-awards">
                  <h2>受賞歴</h2>
                  <ul className="awards-list">
                    {work.awards.map((award, index) => (
                      <li key={index} className="award-item">
                        {award}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </ScrollAnimation>
          </div>
        </div>
        
        {/* 関連作品 */}
        {relatedWorks.length > 0 && (
          <div className="related-works">
            <ScrollAnimation type="fadeUp">
              <h2 className="related-title">関連作品</h2>
              <div className="related-grid">
                {relatedWorks.map((relatedWork) => (
                  <motion.div 
                    key={relatedWork.id}
                    className="related-item"
                    whileHover={{ y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Link 
                      to={`/works/${relatedWork.id}`}
                      onMouseEnter={() => setCursor('hover')}
                      onMouseLeave={resetCursor}
                    >
                      <div className="related-thumbnail">
                        <div 
                          className="related-image" 
                          style={{ 
                            backgroundImage: relatedWork.thumbnail 
                              ? `url(${import.meta.env.BASE_URL}${relatedWork.thumbnail.replace(/^\.\//, '')})` 
                              : 'linear-gradient(-45deg, var(--accent), var(--accent-secondary))'
                          }}
                        />
                      </div>
                      <h3 className="related-work-title">{relatedWork.title}</h3>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </ScrollAnimation>
          </div>
        )}
        
        <div className="work-navigation">
          <ScrollAnimation type="fadeUp">
            <Link 
              to="/works" 
              className="button secondary"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              全ての作品を見る
            </Link>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
};

export default WorkDetailPage;