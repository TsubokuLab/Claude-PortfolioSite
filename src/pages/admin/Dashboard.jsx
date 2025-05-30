import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchWorks } from '../../utils/api';
import { fetchActivities } from '../../utils/api';
import AdminLayout from './AdminLayout';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    worksCount: 0,
    activitiesCount: 0,
    recentWorks: [],
    recentActivities: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        // Promise.allSettledで一方が失敗しても続行
        const results = await Promise.allSettled([
          fetchWorks(),
          fetchActivities()
        ]);

        const worksData = results[0].status === 'fulfilled' ? results[0].value : [];
        const activitiesData = results[1].status === 'fulfilled' ? results[1].value : [];

        // 最新のデータを取得（最大3件）
        const sortedWorks = Array.isArray(worksData) 
          ? worksData.sort((a, b) => (b.year || 0) - (a.year || 0)).slice(0, 3)
          : [];
        const sortedActivities = Array.isArray(activitiesData)
          ? activitiesData
              .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
              .slice(0, 3)
          : [];

        setStats({
          worksCount: worksData.length || 0,
          activitiesCount: activitiesData.length || 0,
          recentWorks: sortedWorks,
          recentActivities: sortedActivities
        });

        // エラーがあった場合のログ出力
        if (results[0].status === 'rejected') {
          console.warn('Worksデータの読み込みに失敗:', results[0].reason);
        }
        if (results[1].status === 'rejected') {
          console.warn('Activitiesデータの読み込みに失敗:', results[1].reason);
        }
      } catch (error) {
        console.error('ダッシュボードデータの読み込みに失敗しました:', error);
        // エラー時はデフォルト値を設定
        setStats({
          worksCount: 0,
          activitiesCount: 0,
          recentWorks: [],
          recentActivities: []
        });
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const managementCards = [
    {
      title: 'Works管理',
      description: '作品の追加、編集、削除',
      icon: '🎨',
      path: '/admin/works',
      count: stats.worksCount,
      color: 'var(--accent)'
    },
    {
      title: 'Activity管理', 
      description: 'アクティビティの管理',
      icon: '📅',
      path: '/admin/activities',
      count: stats.activitiesCount,
      color: 'var(--accent-secondary)'
    }
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>ダッシュボードを読み込んでいます...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>管理者ダッシュボード</h1>
          <p className="dashboard-subtitle">ポートフォリオサイトの管理</p>
        </div>

        {/* 統計情報サマリー */}
        <div className="stats-summary">
          <div className="stat-card">
            <div className="stat-icon">🎨</div>
            <div className="stat-content">
              <h3>{stats.worksCount}</h3>
              <p>作品</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>{stats.activitiesCount}</h3>
              <p>アクティビティ</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-content">
              <h3>{stats.worksCount + stats.activitiesCount}</h3>
              <p>総コンテンツ</p>
            </div>
          </div>
        </div>

        {/* 管理メニュー */}
        <div className="management-section">
          <h2>管理メニュー</h2>
          <div className="management-grid">
            {managementCards.map((card, index) => (
              <Link key={index} to={card.path} className="management-card">
                <div className="card-header">
                  <div className="card-icon" style={{ color: card.color }}>
                    {card.icon}
                  </div>
                  <div className="card-count">
                    {card.count}
                  </div>
                </div>
                <div className="card-content">
                  <h3>{card.title}</h3>
                  <p>{card.description}</p>
                </div>
                <div className="card-arrow">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 最近の更新 */}
        <div className="recent-section">
          <div className="recent-grid">
            {/* 最近の作品 */}
            <div className="recent-card">
              <div className="recent-header">
                <h3>最近の作品</h3>
                <Link to="/admin/works" className="view-all-link">
                  すべて表示 →
                </Link>
              </div>
              <div className="recent-list">
                {stats.recentWorks.length > 0 ? (
                  stats.recentWorks.map((work) => (
                    <div key={work.id} className="recent-item">
                      <div className="item-info">
                        <h4>{work.title || '無題'}</h4>
                        <p className="item-meta">{work.year || '年不明'} • {work.category || 'カテゴリなし'}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">まだ作品がありません</p>
                )}
              </div>
            </div>

            {/* 最近のアクティビティ */}
            <div className="recent-card">
              <div className="recent-header">
                <h3>最近のアクティビティ</h3>
                <Link to="/admin/activities" className="view-all-link">
                  すべて表示 →
                </Link>
              </div>
              <div className="recent-list">
                {stats.recentActivities.length > 0 ? (
                  stats.recentActivities.map((activity) => (
                    <div key={activity.id} className="recent-item">
                      <div className="item-info">
                        <h4>{activity.title || '無題'}</h4>
                        <p className="item-meta">
                          {activity.date ? new Date(activity.date).toLocaleDateString('ja-JP') : '日付不明'} • {activity.category || 'カテゴリなし'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="no-data">まだアクティビティがありません</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* クイックアクション */}
        <div className="quick-actions">
          <h2>クイックアクション</h2>
          <div className="action-buttons">
            <Link to="/admin/works" className="action-btn primary">
              🎨 新しい作品を追加
            </Link>
            <Link to="/admin/activities" className="action-btn secondary">
              📅 新しいアクティビティを追加
            </Link>
            <Link to="/" className="action-btn outline">
              👁️ サイトを表示
            </Link>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;