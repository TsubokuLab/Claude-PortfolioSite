import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import ScrollAnimation from '../animations/ScrollAnimation';
import { fetchImageManifest } from '../../utils/api';
import { resolveThumbUrl } from '../../utils/thumbnails';
import './FeaturedWorks.css';

const FeaturedWorks = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [manifest, setManifest] = useState({});
  const { setCursor, resetCursor } = useCursor();

  // 作品データの取得
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const [worksResponse, imageManifest] = await Promise.all([
          fetch(`${import.meta.env.BASE_URL}data/works.json`),
          fetchImageManifest()
        ]);
        const data = await worksResponse.json();

        // 注目の作品を6つ表示
        // 代表的なインスタレーションと、VRChat上の制作物をあわせて選択
        const featuredWorkIds = [
          'tsubokura-virtual-museum', // 坪倉仮想美術館
          'vertex',                   // VERTEX: VRCBattleRoyale
          'exhibition-picture',       // 展覧会の絵
          'fantasy-theater',          // 幻想シアター
          'invisible-sculpture',      // 不可視彫像
          'achromatic-world'          // Achromatic World
        ];

        const featuredWorks = featuredWorkIds
          .map(id => data.find(work => work.id === id))
          .filter(Boolean); // undefined を除外

        setWorks(featuredWorks);
        setManifest(imageManifest);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching works:', error);
        setLoading(false);
      }
    };
    
    fetchWorks();
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <section className="featured-works">
      <div className="container">
        <ScrollAnimation type="fadeUp">
          <h2 className="section-title">Featured Works</h2>
          <p className="section-description">
            美術館の展示、企業案件、VRChat のワールド。実際に人が体験したものを並べています。
          </p>
        </ScrollAnimation>
        
        <div className="works-grid">
          {works.map((work, index) => (
            <ScrollAnimation 
              key={work.id} 
              type="fadeUp" 
              delay={index * 0.1}
              className="work-item-wrapper"
            >
              <motion.div 
                className="work-item"
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <Link 
                  to={`/works/${work.id}`}
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={resetCursor}
                >
                  <div className="work-thumbnail">
                    <div
                      className="work-image"
                      style={{
                        backgroundImage: resolveThumbUrl(work, manifest)
                          ? `url(${resolveThumbUrl(work, manifest)})`
                          : 'linear-gradient(-45deg, var(--accent), var(--accent-secondary))'
                      }}
                    />
                    <div className="work-overlay">
                      <span className="view-details">詳細を見る</span>
                    </div>
                  </div>
                  <div className="work-info">
                    <h3 className="work-title">{work.title}</h3>
                    <div className="work-meta">
                      <span className="work-category">{work.category}</span>
                      <span className="work-year">{work.year}</span>
                    </div>
                    <p className="work-excerpt">{work.description}</p>
                  </div>
                </Link>
              </motion.div>
            </ScrollAnimation>
          ))}
        </div>
        
        <ScrollAnimation type="fadeUp" delay={0.4}>
          <div className="view-all-works">
            <Link 
              to="/works" 
              className="button secondary"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              すべての作品を見る
            </Link>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default FeaturedWorks;
