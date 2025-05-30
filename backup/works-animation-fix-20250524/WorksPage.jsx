import React, { useState, useEffect } from 'react';
import { fetchWorks } from '../utils/api';
import { useCursor } from '../context/CursorContext';
import { Link } from 'react-router-dom';
import './WorksPage.css';

const WorksPage = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // フィルタリング状態
  const [layout, setLayout] = useState('grid'); // 表示レイアウト (grid or list)
  const [isFiltering, setIsFiltering] = useState(false); // フィルタリング中の状態
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
    if (category === filter) return; // 同じカテゴリの場合は何もしない
    
    setIsFiltering(true);
    
    // アニメーション用の遅延
    setTimeout(() => {
      setFilter(category);
      setIsFiltering(false);
    }, 200);
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
        <div className="page-header">
          <h1 className="page-title">Works</h1>
          <p className="page-description">
            インタラクティブなメディアアート作品や展示の記録です。
            現実世界での「体験」をデジタル技術で拡張し、
            現実とデジタルの境界を曖昧にする作品を中心に制作しています。
          </p>
        </div>

        <div className="works-controls">
          <div className="works-filter">
            {sortedCategories.map((category) => (
              <button
                key={category}
                className={`filter-button ${filter === category ? 'active' : ''}`}
                onClick={() => handleFilterChange(category)}
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
                disabled={isFiltering}
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

        {filteredWorks.length > 0 ? (
          <div className={`works-container ${layout === 'grid' ? 'grid-layout' : 'list-layout'} ${isFiltering ? 'filtering' : ''}`}>
            {filteredWorks.map((work, index) => (
              <div 
                key={work.id}
                className="work-item"
                style={{ animationDelay: `${index * 0.1}s` }}
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
              </div>
            ))}
          </div>
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
    'mediaart': 'メディアアート',
    'performance': 'パフォーマンス',
    'VR': 'VR/AR',
    'device': 'デバイス',
    'software': 'ソフトウェア',
    'conceptual': 'コンセプチュアル'
  };
  return categoryMap[category] || category;
};

export default WorksPage;