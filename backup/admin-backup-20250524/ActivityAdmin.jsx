import React, { useState, useEffect } from 'react';
import { fetchActivities } from '../../utils/api';
import AdminLayout from './AdminLayout';
import CustomSelect from './CustomSelect';
import './ActivityAdmin.css';

const ActivityAdmin = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingActivity, setEditingActivity] = useState(null);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [importingFile, setImportingFile] = useState(false);

  useEffect(() => {
    const loadActivities = async () => {
      const data = await fetchActivities();
      // 日付順（新しい順）でソート
      const sortedData = data.sort((a, b) => new Date(b.date) - new Date(a.date));
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
      category: 'exhibition',
      description: '',
      venue: '',
      venue_url: '',
      url: ''
    };
    setEditingActivity(newActivity);
  };

  // アクティビティの保存
  const saveActivity = (updatedActivity) => {
    if (activities.find(a => a.id === updatedActivity.id)) {
      // 既存アクティビティの更新
      const updatedActivities = activities.map(a => 
        a.id === updatedActivity.id ? updatedActivity : a
      );
      // 日付順でソート
      const sortedActivities = updatedActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
      setActivities(sortedActivities);
    } else {
      // 新規アクティビティの追加
      const newActivities = [...activities, updatedActivity];
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
    const jsonString = JSON.stringify(activities, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      alert('JSONデータをクリップボードにコピーしました');
    }).catch(() => {
      alert('コピーに失敗しました');
    });
  };

  // JSONファイルのダウンロード
  const downloadJson = () => {
    const jsonString = JSON.stringify(activities, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activities-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        
        // データ構造の簡単な検証
        if (!Array.isArray(jsonData)) {
          throw new Error('データはActivity配列である必要があります。');
        }
        
        // 必須フィールドのチェック
        const validActivities = jsonData.map((activity, index) => {
          if (!activity.title || !activity.date) {
            throw new Error(`アイテム ${index + 1}: titleとdateは必須です。`);
          }
          return {
            id: activity.id || Date.now().toString() + index,
            title: activity.title,
            date: activity.date,
            category: activity.category || 'exhibition',
            description: activity.description || '',
            venue: activity.venue || '',
            venue_url: activity.venue_url || '',
            url: activity.url || ''
          };
        });
        
        // 日付順でソート
        const sortedActivities = validActivities.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if (window.confirm(`${sortedActivities.length}件のActivityデータをインポートします。\n現在のデータが置き換えられますがよろしいですか？`)) {
          setActivities(sortedActivities);
          alert('正常にインポートされました。');
        }
      } catch (error) {
        console.error('JSON import error:', error);
        alert(`JSONファイルの読み込みに失敗しました：\n${error.message}`);
      } finally {
        setImportingFile(false);
        // inputフィールドをリセット
        event.target.value = '';
      }
    };
    
    reader.onerror = () => {
      alert('ファイルの読み込み中にエラーが発生しました。');
      setImportingFile(false);
    };
    
    reader.readAsText(file);
  };

  // カテゴリーラベルの変換
  const getCategoryLabel = (category) => {
    const categoryMap = {
      'exhibition': '展示',
      'award': '受賞',
      'works': '制作',
      'media': 'メディア',
      'performance': '公演',
      // 既存データの互換性のため
      'exhibition award': '受賞',
      'media award': '受賞',
      'workshop': '公演',
      'lecture': '公演'
    };
    return categoryMap[category] || category;
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
              <h3>JSONプレビュー</h3>
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
              {JSON.stringify(activities, null, 2)}
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
                        <span className="activity-category">
                          {getCategoryLabel(activity.category)}
                        </span>
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
            onSave={saveActivity}
            onCancel={() => setEditingActivity(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

// アクティビティ編集モーダル
const ActivityEditModal = ({ activity, onSave, onCancel }) => {
  const [formData, setFormData] = useState(activity);

  // カテゴリーオプション
  const categoryOptions = [
    { value: 'exhibition', label: '展示' },
    { value: 'award', label: '受賞' },
    { value: 'works', label: '制作' },
    { value: 'media', label: 'メディア' },
    { value: 'performance', label: '公演' }
  ];

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
    onSave(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{activity.title ? 'アクティビティ編集' : '新規アクティビティ追加'}</h2>
          <button onClick={onCancel} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="activity-form">
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
            <label>カテゴリー</label>
            <CustomSelect
              options={categoryOptions}
              value={formData.category}
              onChange={(value) => handleChange('category', value)}
              placeholder="カテゴリーを選択"
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