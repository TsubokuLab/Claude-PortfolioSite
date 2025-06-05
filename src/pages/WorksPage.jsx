import React, { useState, useEffect } from 'react';
import { fetchWorks, fetchTags } from '../utils/api';
import { useCursor } from '../context/CursorContext';
import { Link } from 'react-router-dom';
import './WorksPage.css';

const WorksPage = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // フィルタリング状態
  const [layout, setLayout] = useState('grid'); // 表示レイアウト (grid or list)
  const [animationKey, setAnimationKey] = useState(0); // アニメーション再実行用
  const [worksTags, setWorksTags] = useState([]); // タグ設定

  const { setCursor, resetCursor } = useCursor();

  // 作品データとタグ設定の取得
  useEffect(() => {
    const loadData = async () => {
      try {
        const [worksData, tagsData] = await Promise.all([
          fetchWorks(),
          fetchTags()
        ]);
        setWorks(worksData);
        setWorksTags(tagsData.worksTags || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // フィルタリングされた作品リスト
  const filteredWorks = filter === 'all' 
    ? works 
    : works.filter(work => work.category === filter);

  // カテゴリーリストの生成 - タグ設定から動的に生成
  const availableCategories = [...new Set(works.map(work => work.category))];
  const sortedCategories = [
    'all',
    ...availableCategories.sort()
  ];

  // タグIDからラベルを取得する関数
  const getCategoryLabel = (category) => {
    if (category === 'all') return 'すべて';
    const tag = worksTags.find(t => t.id === category);
    return tag ? tag.label : category;
  };

  // フィルター変更ハンドラ
  const handleFilterChange = (category) => {
    if (category === filter) return; // 同じカテゴリの場合は何もしない
    setFilter(category);
    // アニメーション再実行のためにkeyを更新
    setAnimationKey(prev => prev + 1);
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
            {sortedCategories.map((category) => {
              const tagConfig = worksTags.find(t => t.id === category);
              return (
                <button
                  key={category}
                  className={`filter-button ${filter === category ? 'active' : ''}`}
                  onClick={() => handleFilterChange(category)}
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={resetCursor}
                  style={category !== 'all' && tagConfig ? {
                    '--tag-color': tagConfig.color,
                    '--tag-bg': `${tagConfig.color}15`
                  } : {}}
                >
                  {getCategoryLabel(category)}
                </button>
              );
            })}
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
          <div key={animationKey} className={`works-container ${layout === 'grid' ? 'grid-layout' : 'list-layout'}`}>
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
                      <span 
                        className="work-category"
                        style={(() => {
                          const tagConfig = worksTags.find(t => t.id === work.category);
                          return tagConfig ? {
                            backgroundColor: `${tagConfig.color}20`,
                            color: tagConfig.color,
                            border: `1px solid ${tagConfig.color}`
                          } : {};
                        })()} 
                      >
                        {getCategoryLabel(work.category)}
                      </span>
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



export default WorksPage;