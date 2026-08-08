import React, { useState, useEffect } from 'react';
import { fetchActivities, fetchTags } from '../../utils/api';
import AdminLayout from './AdminLayout';
import MultiTagSelect from './MultiTagSelect';
import './ActivityAdmin.css';

const ActivityAdmin = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [importingFile, setImportingFile] = useState(false);
  const [availableTags, setAvailableTags] = useState([]);

  // タグ設定を読み込み
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagsData = await fetchTags();
        setAvailableTags(tagsData.activityTags || []);
      } catch (error) {
        console.error('Failed to load tags:', error);
      }
    };
    loadTags();
  }, []);

  useEffect(() => {
    const loadActivities = async () => {
      const data = await fetchActivities();
      
      // データ構造の正規化（後方互換性のため）
      const normalizedData = data.map(activity => ({
        ...activity,
        // 'category' フィールドを 'type' に統一したうえで、配列形式に正規化する
        type: Array.isArray(activity.type || activity.category)
          ? (activity.type || activity.category)
          : typeof (activity.type || activity.category) === 'string'
            ? (activity.type || activity.category).split(/[,\s]+/).filter(t => t.trim())
            : ['exhibition']
      }));
      
      // 日付順（新しい順）でソート
      const sortedData = normalizedData.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivities(sortedData);
      setLoading(false);
    };
    loadActivities();
  }, []);

  // 新規アクティビティの雛形
  const createNewActivity = () => {
    const newActivity = {
      id: Date.now().toString(),
      title: '',
      date: new Date().toISOString().split('T')[0],
      type: ['exhibition'], // 配列形式でデフォルト値
      description: '',
      venue: '',
      venue_url: '',
      url: ''
    };
    setEditingActivity(newActivity);
  };

  // アクティビティの保存
  const saveActivity = (updatedActivity) => {
    // typeフィールドが配列であることを確認
    const normalizedActivity = {
      ...updatedActivity,
      type: Array.isArray(updatedActivity.type) 
        ? updatedActivity.type 
        : [updatedActivity.type || 'exhibition']
    };

    if (activities.find(a => a.id === normalizedActivity.id)) {
      // 既存アクティビティの更新
      const updatedActivities = activities.map(a => 
        a.id === normalizedActivity.id ? normalizedActivity : a
      );
      // 日付順でソート
      const sortedActivities = updatedActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivities(sortedActivities);
    } else {
      // 新規アクティビティの追加
      const newActivities = [...activities, normalizedActivity];
      // 日付順でソート
      const sortedActivities = newActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivities(sortedActivities);
    }
    setEditingActivity(null);
  };

  // アクティビティの削除
  const deleteActivity = (id) => {
    if (window.confirm('このアクティビティを削除しますか？')) {
      setActivities(activities.filter(a => a.id !== id));
    }
  };

  // JSONのクリップボードコピー
  const copyToClipboard = () => {
    // timeline.json形式に変換
    const timelineData = convertToTimelineFormat(activities);
    const jsonString = JSON.stringify(timelineData, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      alert('timeline.json形式でクリップボードにコピーしました');
    }).catch(() => {
      alert('コピーに失敗しました');
    });
  };

  // JSONファイルのダウンロード
  const downloadJson = () => {
    // timeline.json形式に変換
    const timelineData = convertToTimelineFormat(activities);
    const jsonString = JSON.stringify(timelineData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timeline-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // timeline.json形式への変換
  const convertToTimelineFormat = (activities) => {
    const grouped = activities.reduce((acc, activity) => {
      const year = new Date(activity.date).getFullYear();
      if (!acc[year]) {
        acc[year] = [];
      }
      
      // ActivityPageと同じ形式に変換（typeは配列形式で保持）
      const event = {
        date: activity.date,
        type: Array.isArray(activity.type) ? activity.type : [activity.type],
        title: activity.title,
        ...(activity.description && { description: activity.description }),
        ...(activity.url && { url: activity.url }),
        ...(activity.venue && { venue: activity.venue }),
        ...(activity.venue_url && { venue_url: activity.venue_url })
      };
      
      acc[year].push(event);
      return acc;
    }, {});

    return Object.keys(grouped)
      .sort((a, b) => parseInt(b) - parseInt(a))
      .map(year => ({
        year: parseInt(year),
        events: grouped[year].sort((a, b) => new Date(b.date) - new Date(a.date))
      }));
  };

  // JSONファイルのインポート
  const handleFileImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    if (file.type !== 'application/json') {
      alert('適切なJSONファイルを選択してください。');
      return;
    }
    
    setImportingFile(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const jsonData = JSON.parse(e.target.result);
        let importActivities = [];

        // timeline.json形式かactivity配列形式かを判定
        if (Array.isArray(jsonData) && jsonData[0]?.events) {
          // timeline.json形式の場合
          jsonData.forEach(yearData => {
            yearData.events.forEach((event, index) => {
              const activity = {
                id: event.id || `${yearData.year}-${index}-${Date.now()}`,
                title: event.title,
                date: event.date,
                type: Array.isArray(event.type) ? event.type : [event.type || 'exhibition'],
                description: event.description || '',
                venue: event.venue || '',
                venue_url: event.venue_url || '',
                url: event.url || ''
              };
              importActivities.push(activity);
            });
          });
        } else if (Array.isArray(jsonData)) {
          // activity配列形式の場合
          importActivities = jsonData.map((activity, index) => ({
            id: activity.id || Date.now().toString() + index,
            title: activity.title || '',
            date: activity.date || new Date().toISOString().split('T')[0],
            type: Array.isArray(activity.type || activity.category) 
              ? (activity.type || activity.category)
              : typeof (activity.type || activity.category) === 'string'
                ? (activity.type || activity.category).split(/[,\s]+/).filter(t => t.trim())
                : ['exhibition'],
            description: activity.description || '',
            venue: activity.venue || '',
            venue_url: activity.venue_url || '',
            url: activity.url || ''
          }));
        } else {
          throw new Error('サポートされていないデータ形式です。');
        }
        
        // 必須フィールドのチェック
        const validActivities = importActivities.filter(activity => {
          if (!activity.title || !activity.date) {
            console.warn('titleとdateが必須です:', activity);
            return false;
          }
          return true;
        });
        
        if (validActivities.length === 0) {
          throw new Error('有効なActivityデータが見つかりませんでした。');
        }
        
        // 日付順でソート
        const sortedActivities = validActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (window.confirm(`${sortedActivities.length}件のActivityデータをインポートします。\\n現在のデータが置き換えられますがよろしいですか？`)) {
          setActivities(sortedActivities);
          alert('正常にインポートされました。');
        }
      } catch (error) {
        console.error('JSON import error:', error);
        alert(`JSONファイルの読み込みに失敗しました：\\n${error.message}`);
      } finally {
        setImportingFile(false);
        event.target.value = '';
      }
    };
    
    reader.onerror = () => {
      alert('ファイルの読み込み中にエラーが発生しました。');
      setImportingFile(false);
    };
    
    reader.readAsText(file);
  };

  // タグラベルの取得
  const getTagLabel = (tagId) => {
    const tag = availableTags.find(t => t.id === tagId);
    return tag ? tag.label : tagId;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>アクティビティデータを読み込んでいます...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="activity-admin">
        <div className="admin-header-section">
          <h1>Activity管理</h1>
          <div className="admin-actions">
            <button onClick={createNewActivity} className="btn btn-primary">
              新規アクティビティ追加
            </button>
            <button onClick={() => setShowJsonPreview(!showJsonPreview)} className="btn btn-secondary">
              {showJsonPreview ? 'JSONを隠す' : 'JSONプレビュー'}
            </button>
          </div>
        </div>

        {showJsonPreview && (
          <div className="json-preview-section">
            <div className="json-preview-header">
              <h3>timeline.json プレビュー</h3>
              <div className="json-actions">
                <label className="btn btn-outline file-upload-btn">
                  {importingFile ? '読み込み中...' : '📁 インポート'}
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    style={{ display: 'none' }}
                    disabled={importingFile}
                  />
                </label>
                <button onClick={copyToClipboard} className="btn btn-outline">
                  📋 コピー
                </button>
                <button onClick={downloadJson} className="btn btn-outline">
                  💾 ダウンロード
                </button>
              </div>
            </div>
            <pre className="json-preview">
              {JSON.stringify(convertToTimelineFormat(activities), null, 2)}
            </pre>
          </div>
        )}

        <div className="activities-list">
          <h2>アクティビティ一覧 ({activities.length}件)</h2>
          {activities.length === 0 ? (
            <div className="empty-state">
              <p>アクティビティがまだ登録されていません</p>
              <button onClick={createNewActivity} className="btn btn-primary">
                最初のアクティビティを追加
              </button>
            </div>
          ) : (
            <div className="activities-timeline">
              {activities.map((activity) => (
                <div key={activity.id} className="activity-card">
                  <div className="activity-date">
                    {new Date(activity.date).toLocaleDateString('ja-JP', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                  <div className="activity-content">
                    <div className="activity-header">
                      <div className="activity-info">
                        <h3>{activity.title || '無題'}</h3>
                        <div className="activity-tags">
                          {(Array.isArray(activity.type) ? activity.type : [activity.type]).map((tagId, index) => {
                            const tagConfig = availableTags.find(t => t.id === tagId);
                            return (
                              <span 
                                key={index} 
                                className={`activity-tag ${tagId}`}
                                style={{
                                  backgroundColor: tagConfig ? `${tagConfig.color}20` : 'rgba(102, 126, 234, 0.1)',
                                  color: tagConfig ? tagConfig.color : '#667eea',
                                  border: `1px solid ${tagConfig ? tagConfig.color : '#667eea'}`
                                }}
                              >
                                {getTagLabel(tagId)}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                      <div className="activity-actions">
                        <button
                          onClick={() => setEditingActivity(activity)}
                          className="btn btn-small btn-outline"
                        >
                          編集
                        </button>
                        <button
                          onClick={() => deleteActivity(activity.id)}
                          className="btn btn-small btn-danger"
                        >
                          削除
                        </button>
                      </div>
                    </div>
                    <div className="activity-details">
                      {activity.venue && (
                        <p className="activity-venue">
                          📍 {activity.venue_url ? (
                            <a href={activity.venue_url} target="_blank" rel="noopener noreferrer">
                              {activity.venue}
                            </a>
                          ) : (
                            activity.venue
                          )}
                        </p>
                      )}
                      {activity.description && (
                        <p className="activity-description">{activity.description}</p>
                      )}
                      {activity.url && (
                        <p className="activity-link">
                          <a href={activity.url} target="_blank" rel="noopener noreferrer">
                            🔗 詳細リンク
                          </a>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editingActivity && (
          <ActivityEditModal
            activity={editingActivity}
            availableTags={availableTags}
            onSave={saveActivity}
            onCancel={() => setEditingActivity(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

// アクティビティ編集モーダル
const ActivityEditModal = ({ activity, availableTags, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    ...activity,
    type: Array.isArray(activity.type) ? activity.type : [activity.type || 'exhibition']
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('タイトルは必須です');
      return;
    }
    if (!formData.date) {
      alert('日付は必須です');
      return;
    }
    if (!formData.type || formData.type.length === 0) {
      alert('少なくとも1つのタイプを選択してください');
      return;
    }
    onSave(formData);
  };

  // フォーム全体でのEnterキー送信を防止
  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      e.preventDefault();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{activity.title ? 'アクティビティ編集' : '新規アクティビティ追加'}</h2>
          <button onClick={onCancel} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="activity-form">
          <div className="form-grid">
            <div className="form-group">
              <label>タイトル *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="アクティビティタイトル"
                required
              />
            </div>

            <div className="form-group">
              <label>日付 *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>タイプ *（複数選択可能）</label>
            <MultiTagSelect
              options={availableTags}
              value={formData.type}
              onChange={(value) => handleChange('type', value)}
              placeholder="タイプを選択"
            />
          </div>

          <div className="form-group">
            <label>会場・場所</label>
            <input
              type="text"
              value={formData.venue || ''}
              onChange={(e) => handleChange('venue', e.target.value)}
              placeholder="開催場所・会場名"
            />
          </div>

          <div className="form-group">
            <label>場所URL</label>
            <input
              type="url"
              value={formData.venue_url || ''}
              onChange={(e) => handleChange('venue_url', e.target.value)}
              placeholder="https://example.com/venue"
            />
          </div>

          <div className="form-group">
            <label>説明文</label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="アクティビティの詳細説明"
              rows="4"
            />
          </div>

          <div className="form-group">
            <label>関連URL</label>
            <input
              type="url"
              value={formData.url || ''}
              onChange={(e) => handleChange('url', e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onCancel} className="btn btn-outline">
              キャンセル
            </button>
            <button type="submit" className="btn btn-primary">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ActivityAdmin;