import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchWorks, fetchWorkById, fetchImageManifest } from '../utils/api';
import ScrollAnimation from '../components/animations/ScrollAnimation';
import ParallaxEffect from '../components/animations/ParallaxEffect';
import { useCursor } from '../context/CursorContext';
import { formatDate } from '../utils/helpers';
import { resolveThumbUrl, getYouTubeIds, youTubeThumbUrl } from '../utils/thumbnails';
import './WorkDetailPage.css';

// YouTube video ID → embed URL（youtube-nocookie.com でFirefox 153エラー回避）
const toEmbedUrl = (id) => id ? `https://www.youtube-nocookie.com/embed/${id}` : null;

// public/ 配下の相対パス → 実際に配信されるURL
const toAssetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\.\//, '')}`;

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
      // スライドは「動画 → 画像」の順に並ぶので、常に先頭から表示する
      setActiveIndex(0);

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

  const effectiveThumbnail = resolveThumb(work, manifest);
  const effectiveImages = resolveImages(work, manifest);

  // 画像ギャラリー用の画像配列を作成
  const galleryImages = [
    ...(effectiveThumbnail ? [effectiveThumbnail] : []),
    ...effectiveImages.filter(img => img !== effectiveThumbnail)
  ];

  // 動画と画像を1本のスライド配列にまとめる。動画を先頭に置く。
  // youtube は動画IDの文字列でも配列でも受け付ける（複数本の作品があるため）
  const slides = [
    ...getYouTubeIds(work).map(id => ({ type: 'video', id })),
    ...galleryImages.map(path => ({ type: 'image', path }))
  ];

  // データ変更などで範囲外を指してしまった場合に備える
  const currentIndex = slides.length > 0 ? Math.min(activeIndex, slides.length - 1) : 0;
  const currentSlide = slides[currentIndex];

  const handleThumbnailClick = (index) => setActiveIndex(index);

  // 前後移動（端では反対側へ回り込む）
  const step = (delta) => {
    if (slides.length === 0) return;
    setActiveIndex((currentIndex + delta + slides.length) % slides.length);
  };
  const handlePrev = () => step(-1);
  const handleNext = () => step(1);

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
                {currentSlide && currentSlide.type === 'video' ? (
                  // YouTube動画表示
                  <div className="youtube-embed-container">
                    <iframe
                      key={currentSlide.id}
                      src={toEmbedUrl(currentSlide.id)}
                      title={work.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    ></iframe>
                  </div>
                ) : (
                  // 画像表示
                  currentSlide && (
                    <img
                      src={toAssetUrl(currentSlide.path)}
                      alt={`${work.title} - ${currentIndex + 1}`}
                      className="gallery-active-image"
                    />
                  )
                )}

                {/* ナビゲーションボタン */}
                {slides.length > 1 && (
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
              
              {/* サムネイル（動画・画像を通し番号で並べる） */}
              {slides.length > 1 && (
                <div className="gallery-thumbnails">
                  {slides.map((slide, index) => (
                    <button
                      key={slide.type === 'video' ? `video-${slide.id}` : `image-${slide.path}`}
                      className={`gallery-thumbnail ${slide.type === 'video' ? 'youtube-thumbnail' : ''} ${currentIndex === index ? 'active' : ''}`}
                      onClick={() => handleThumbnailClick(index)}
                      onMouseEnter={() => setCursor('hover')}
                      onMouseLeave={resetCursor}
                    >
                      {slide.type === 'video' ? (
                        <>
                          <div className="thumbnail-video-icon">▶</div>
                          {/* YouTubeのサムネイルが取得できない場合は▶アイコンだけ残す */}
                          <img
                            src={youTubeThumbUrl(slide.id)}
                            alt={`${work.title} - 動画 ${index + 1}`}
                            onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }}
                          />
                        </>
                      ) : (
                        <img src={toAssetUrl(slide.path)} alt={`${work.title} - ${index + 1}`} />
                      )}
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
                            backgroundImage: (() => {
                              // 共通の解決処理を使う。ローカル画像を持たない作品でも
                              // YouTubeのサムネイルにフォールバックする
                              const thumb = resolveThumbUrl(relatedWork, manifest);
                              return thumb
                                ? `url(${thumb})`
                                : 'linear-gradient(-45deg, var(--accent), var(--accent-secondary))';
                            })()
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