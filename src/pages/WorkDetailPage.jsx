import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchWorks, fetchWorkById, fetchImageManifest } from '../utils/api';
import ScrollAnimation from '../components/animations/ScrollAnimation';
import ParallaxEffect from '../components/animations/ParallaxEffect';
import { useCursor } from '../context/CursorContext';
import { formatDate } from '../utils/helpers';
import './WorkDetailPage.css';

// YouTube video ID → embed URL（youtube-nocookie.com でFirefox 153エラー回避）
const toEmbedUrl = (id) => id ? `https://www.youtube-nocookie.com/embed/${id}` : null;

// マニフェストから有効なサムネイルを取得
const resolveThumb = (work, manifest) => {
  if (work.thumbnail) return work.thumbnail;
  const files = manifest[work.id] || [];
  return files.find(f => /thumbnail\.(jpe?g|png|webp|gif)$/i.test(f)) || files[0] || null;
};

// マニフェストから有効なギャラリー画像を取得（thumbnail以外を名前順）
const resolveImages = (work, manifest) => {
  if (work.images && work.images.length > 0) return work.images;
  const files = manifest[work.id] || [];
  return files.filter(f => !/thumbnail\.(jpe?g|png|webp|gif)$/i.test(f));
};

const WorkDetailPage = () => {
  const { workId } = useParams();
  const [work, setWork] = useState(null);
  const [relatedWorks, setRelatedWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [manifest, setManifest] = useState({});
  const navigate = useNavigate();
  const { setCursor, resetCursor } = useCursor();

  // 作品データの取得
  useEffect(() => {
    const getWorkData = async () => {
      setLoading(true);

      const [workData, allWorks, imageManifest] = await Promise.all([
        fetchWorkById(workId),
        fetchWorks(),
        fetchImageManifest(),
      ]);

      if (!workData) {
        navigate('/works');
        return;
      }

      setWork(workData);
      setManifest(imageManifest);

      // YouTubeがある場合は動画を初期表示
      if (workData.youtube) {
        setIsVideoActive(true);
        setActiveIndex(0);
      }

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

  const youtubeUrl = toEmbedUrl(work.youtube);
  const effectiveThumbnail = resolveThumb(work, manifest);
  const effectiveImages = resolveImages(work, manifest);

  // 画像ギャラリー用の画像配列を作成
  const galleryImages = [
    ...(effectiveThumbnail ? [effectiveThumbnail] : []),
    ...effectiveImages.filter(img => img !== effectiveThumbnail)
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
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
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
              {work.duration && (
                <div className="work-detail-duration-block">
                  <span className="work-detail-duration-value">{work.duration}</span>
                </div>
              )}

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

              {work.materials && (
                <div className="work-detail-materials">
                  <h2>素材・ツール</h2>
                  <p>{work.materials}</p>
                </div>
              )}

              {work.collaborators && work.collaborators.length > 0 && (
                <div className="work-detail-collaborators">
                  <h2>コラボレーター</h2>
                  <ul className="collaborators-list">
                    {work.collaborators.map((person, index) => (
                      <li key={index} className="collaborator-item">
                        {person}
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

              {work.links && work.links.length > 0 && (
                <div className="work-detail-links">
                  <h2>リンク</h2>
                  <ul className="links-list">
                    {work.links.map((link, index) => (
                      <li key={index} className="link-item">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onMouseEnter={() => setCursor('hover')}
                          onMouseLeave={resetCursor}
                        >
                          {link.label || link.url}
                        </a>
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