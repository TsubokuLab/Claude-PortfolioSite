import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ScrollAnimation from '../components/animations/ScrollAnimation';
import { useCursor } from '../context/CursorContext';
import { fetchTimeline, fetchTags } from '../utils/api';
import { formatDate } from '../utils/helpers';
import './ActivityPage.css';

const ActivityPage = () => {
  const { setCursor, resetCursor } = useCursor();
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // フィルター: all, exhibition, award, media
  const [activityTags, setActivityTags] = useState([]);

  // タグ設定とタイムラインデータを読み込み
  useEffect(() => {
    const loadData = async () => {
      try {
        const [timelineData, tagsData] = await Promise.all([
          fetchTimeline(),
          fetchTags()
        ]);
        setTimeline(timelineData);
        setActivityTags(tagsData.activityTags || []);
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // タグIDからラベルを取得
  const getActivityTagLabel = (tagId) => {
    const tag = activityTags.find(t => t.id === tagId);
    return tag ? tag.label : 'イベント';
  };

  // フィルタリングされたイベントを取得
  const getFilteredEvents = () => {
    if (filter === 'all') {
      return timeline;
    }
    
    return timeline.map(year => ({
      ...year,
      events: year.events.filter(event => {
        // typeは常に配列形式であることを想定
        const eventTypes = Array.isArray(event.type) ? event.type : [event.type];
        
        // 選択されたフィルターがイベントのタイプ配列に含まれているかチェック
        return eventTypes.includes(filter);
      })
    })).filter(year => year.events.length > 0);
  };
  


  const filteredTimeline = getFilteredEvents();

  // フィルター変更ハンドラ
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>データを読み込んでいます...</p>
      </div>
    );
  }

  return (
    <div className="activity-page">
      <div className="container">
        <ScrollAnimation type="fadeUp">
          <h1 className="page-title">Activity</h1>
          <p className="page-description">
            展示、イベント、メディア掲載、受賞歴などの活動記録です。
          </p>
        </ScrollAnimation>

        {/* フィルターコントロール */}
        <ScrollAnimation type="fadeUp" delay={0.2}>
          <div className="activity-filters">
            <button
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              すべて
            </button>
            <button
              className={`filter-button ${filter === 'exhibition' ? 'active' : ''}`}
              onClick={() => handleFilterChange('exhibition')}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              展示
            </button>
            <button
              className={`filter-button ${filter === 'award' ? 'active' : ''}`}
              onClick={() => handleFilterChange('award')}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              受賞
            </button>
            <button
              className={`filter-button ${filter === 'works' ? 'active' : ''}`}
              onClick={() => handleFilterChange('works')}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              制作
            </button>
            <button
              className={`filter-button ${filter === 'media' ? 'active' : ''}`}
              onClick={() => handleFilterChange('media')}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              メディア
            </button>
            <button
              className={`filter-button ${filter === 'workshop' ? 'active' : ''}`}
              onClick={() => handleFilterChange('workshop')}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              講演
            </button>
            <button
              className={`filter-button ${filter === 'performance' ? 'active' : ''}`}
              onClick={() => handleFilterChange('performance')}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              パフォーマンス
            </button>
            <button
              className={`filter-button ${filter === 'collaboration' ? 'active' : ''}`}
              onClick={() => handleFilterChange('collaboration')}
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              コラボレーション
            </button>
          </div>
        </ScrollAnimation>

        {/* タイムライン */}
        <div className="activity-timeline">
          {filteredTimeline.length > 0 ? (
            filteredTimeline.map((yearData, yearIndex) => (
              <ScrollAnimation key={yearData.year} type="fadeUp" delay={yearIndex * 0.1}>
                <div className="timeline-year">
                  <div className="year-marker">{yearData.year}</div>
                  <div className="year-events">
                    {yearData.events.map((event, eventIndex) => (
                      <motion.div
                        key={`${yearData.year}-${eventIndex}`}
                        className={`event-item ${Array.isArray(event.type) ? event.type.join(' ') : event.type}`}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: eventIndex * 0.1 }}
                      >
                        <div className="event-date">{formatDate(event.date)}</div>
                        <div className="event-content">
                        <div className="event-type-badges">
                          {(Array.isArray(event.type) ? event.type : [event.type]).map((type, i) => {
                            const tagConfig = activityTags.find(tag => tag.id === type);
                            return (
                              <span 
                                key={i} 
                                className={`event-type-badge ${type}`}
                                style={{
                                  backgroundColor: tagConfig ? `${tagConfig.color}20` : 'rgba(102, 126, 234, 0.1)',
                                  color: tagConfig ? tagConfig.color : '#667eea'
                                }}
                              >
                                {getActivityTagLabel(type)}
                              </span>
                            );
                          })}
                        </div>
                        {/* Debug: {JSON.stringify({url: event.url})} */}
                        {event.url ? (
                          <h3 className="event-title">
                          <a 
                              href={event.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  onMouseEnter={() => setCursor('hover')}
                                  onMouseLeave={resetCursor}
                                >
                                  {event.title}
                                </a>
                              </h3>
                            ) : (
                              <h3 className="event-title">{event.title}</h3>
                            )}
                            {event.venue && (
                              <div className="event-venue">
                                {/* Debug: {JSON.stringify({venue_url: event.venue_url})} */}
                                {event.venue_url ? (
                                  <a 
                                    href={event.venue_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onMouseEnter={() => setCursor('hover')}
                                    onMouseLeave={resetCursor}
                                  >
                                    {event.venue}
                                  </a>
                                ) : (
                                  event.venue
                                )}
                              </div>
                            )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>
            ))
          ) : (
            <div className="no-events">
              <p>選択したフィルターに該当するイベントはありません。</p>
            </div>
          )}
        </div>

        {/* 主な展示場所マップ */}
        <section className="exhibition-venues">
          <ScrollAnimation type="fadeUp">
            <h2 className="section-title">主な展示場所</h2>
            <div className="venues-grid">
              <div className="venue-item">
                <h3 className="venue-name">国立新美術館</h3>
                <p className="venue-location">東京都港区六本木7-22-2</p>
                <p className="venue-description">
                  文化庁メディア芸術祭での展示。日本最大規模の展示スペースを持つ美術館。
                </p>
              </div>
              
              <div className="venue-item">
                <h3 className="venue-name">大分県立美術館</h3>
                <p className="venue-location">大分県大分市寿町2-1</p>
                <p className="venue-description">
                  「魔法の美術館」展での展示。国東半島アートプロジェクトも開催。
                </p>
              </div>
              
              <div className="venue-item">
                <h3 className="venue-name">六本木アートナイト</h3>
                <p className="venue-location">東京都港区六本木</p>
                <p className="venue-description">
                  アートとデザインとカルチャーが集積する六本木の街を舞台にした一夜限りのアートの饗宴。
                </p>
              </div>
              
              <div className="venue-item">
                <h3 className="venue-name">茨城県北芸術祭</h3>
                <p className="venue-location">茨城県北部の6市町</p>
                <p className="venue-description">
                  「KENPOKU ART」として知られる国際芸術祭。旧美和中学校での展示。
                </p>
              </div>
              
              <div className="venue-item">
                <h3 className="venue-name">JAPAN VR EXPO</h3>
                <p className="venue-location">東京都</p>
                <p className="venue-description">
                  最新のVR/AR技術を集めた展示会。「不可視彫像」の発表の場に。
                </p>
              </div>
              
              <div className="venue-item">
                <h3 className="venue-name">3331 Arts Chiyoda</h3>
                <p className="venue-location">東京都千代田区外神田6-11-14</p>
                <p className="venue-description">
                  アートハックデイなど実験的なアートイベントが多数開催される場所。
                </p>
              </div>
            </div>
          </ScrollAnimation>
        </section>

        {/* 今後の予定 */}
        <section className="upcoming-events">
          <ScrollAnimation type="fadeUp">
            <h2 className="section-title">今後の予定</h2>
            <div className="upcoming-content">
              <p className="upcoming-info">
                最新の展示情報やイベント出演については、SNSでお知らせしています。
                お気軽にフォローしてください。
              </p>
              <div className="social-links">
                <a 
                  href="https://twitter.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={resetCursor}
                >
                  Twitter
                </a>
                <a 
                  href="https://instagram.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="social-link"
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={resetCursor}
                >
                  Instagram
                </a>
              </div>
            </div>
          </ScrollAnimation>
        </section>
      </div>
    </div>
  );
};



export default ActivityPage;