import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollAnimation from '../components/animations/ScrollAnimation';
import { fetchWorks } from '../utils/api';
import { useCursor } from '../context/CursorContext';
import { Link } from 'react-router-dom';
import './WorksPage.css';

const WorksPage = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // フィルタリング状態
  const [layout, setLayout] = useState('grid'); // 表示レイアウト (grid or list)
  const { setCursor, resetCursor } = useCursor();

  // 作品データの取得
  useEffect(() => {
    const getWorks = async () => {
      const data = await fetchWorks();
      setWorks(data);
      setLoading(false);
    };
    
    getWorks();
  }, []);

  // フィルタリングされた作品リスト
  const filteredWorks = filter === 'all' 
    ? works 
    : works.filter(work => work.category === filter);

  // カテゴリーリストの生成 - 「すべて」を最初に配置し、他は昇順で並べる
  const categories = ['all', ...new Set(works.map(work => work.category))];
  // 「all」以外のカテゴリーをソート
  const sortedCategories = [
    'all',
    ...categories.filter(category => category !== 'all').sort()
  ];

  // フィルター変更ハンドラ
  const handleFilterChange = (category) => {
    setFilter(category);
  };

  // レイアウト変更ハンドラ
  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>作品データを読み込んでいます...</p>
      </div>
    );
  }

  return (
    <div className="works-page">
      <div className="container">
        <ScrollAnimation type="fadeUp">
          <h1 className="page-title">Works</h1>
          <p className="page-description">
            インタラクティブなメディアアート作品や展示の記録です。
            現実世界での「体験」をデジタル技術で拡張し、
            現実とデジタルの境界を曖昧にする作品を中心に制作しています。
          </p>
        </ScrollAnimation>

        <ScrollAnimation type="fadeUp" delay={0.2}>
          <div className="works-controls">
            <div className="works-filter">
              {sortedCategories.map((category) => (
                <button
                  key={category}
                  className={`filter-button ${filter === category ? 'active' : ''}`}
                  onClick={() => handleFilterChange(category)}
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={resetCursor}
                >
                  {category === 'all' ? 'すべて' : getCategoryLabel(category)}
                </button>
              ))}
            </div>
            
            <div className="works-layout-options">
              <button
                className={`layout-button ${layout === 'grid' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('grid')}
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
                aria-label="グリッド表示"
              >
                Grid
              </button>
              <button
                className={`layout-button ${layout === 'list' ? 'active' : ''}`}
                onClick={() => handleLayoutChange('list')}
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
                aria-label="リスト表示"
              >
                List
              </button>
            </div>
          </div>
        </ScrollAnimation>

        {filteredWorks.length > 0 ? (
          <motion.div 
            className={`works-container ${layout === 'grid' ? 'grid-layout' : 'list-layout'}`}
            layout
            transition={{ duration: 0.3, type: "spring", stiffness: 100, damping: 20 }}
          >
            {filteredWorks.map((work, index) => (
              <ScrollAnimation
                key={work.id}
                type={layout === 'grid' ? 'fadeUp' : 'fadeLeft'}
                delay={index * 0.1}
              >
                <motion.div 
                  className="work-item"
                  layout
                  whileHover={{ y: layout === 'grid' ? -8 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link 
                    to={`/works/${work.id}`}
                    onMouseEnter={() => setCursor('hover')}
                    onMouseLeave={resetCursor}
                    className="work-link"
                  >
                    <div className="work-thumbnail">
                      <div 
                        className="work-image" 
                        style={{ 
                          backgroundImage: work.thumbnail 
                            ? `url(${import.meta.env.BASE_URL}${work.thumbnail.replace(/^\.\//, '')})` 
                            : 'linear-gradient(-45deg, var(--accent), var(--accent-secondary))'
                        }}
                      />
                      <div className="work-overlay">
                        <span className="view-details">詳細を見る</span>
                      </div>
                    </div>
                    
                    <div className="work-info">
                      <h2 className="work-title">{work.title}</h2>
                      <div className="work-meta">
                        <span className="work-category">{getCategoryLabel(work.category)}</span>
                        <span className="work-year">{work.year}</span>
                      </div>
                      {layout === 'list' && (
                        <p className="work-description">{work.description}</p>
                      )}
                      {layout === 'list' && work.awards && work.awards.length > 0 && (
                        <div className="work-awards">
                          {work.awards.map((award, idx) => (
                            <span key={idx} className="work-award">{award}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Link>
                </motion.div>
              </ScrollAnimation>
            ))}
          </motion.div>
        ) : (
          <div className="no-works">
            <p>選択したカテゴリーの作品はまだありません。</p>
          </div>
        )}
      </div>
    </div>
  );
};

// カテゴリーのラベルを日本語に変換する関数
const getCategoryLabel = (category) => {
  const categoryMap = {
    'installation': 'インスタレーション',
    'interactive': 'インタラクティブ',
    'performance': 'パフォーマンス',
    'VR': 'VR/AR',
    'device': 'デバイス',
    'software': 'ソフトウェア',
    'conceptual': 'コンセプチュアル'
  };
  return categoryMap[category] || category;
};

export default WorksPage;