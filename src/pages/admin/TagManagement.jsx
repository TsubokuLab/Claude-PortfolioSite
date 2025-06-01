import React, { useState, useEffect } from 'react';
import AdminLayout from './AdminLayout';
import { fetchTags } from '../../utils/api';
import './TagManagement.css';

const TagManagement = () => {
  // JSONファイルから読み込んだタグ設定
  const [worksTags, setWorksTags] = useState([]);
  const [activityTags, setActivityTags] = useState([]);
  const [editingTag, setEditingTag] = useState(null);
  const [tagType, setTagType] = useState('works'); // 'works' or 'activity'
  const [loading, setLoading] = useState(true);

  // コンポーネントマウント時にJSONファイルから読み込み
  useEffect(() => {
    const loadTags = async () => {
      try {
        const tagsData = await fetchTags();
        setWorksTags(tagsData.worksTags || []);
        setActivityTags(tagsData.activityTags || []);
      } catch (error) {
        console.error('Failed to load tags:', error);
      } finally {
        setLoading(false);
      }
    };
    loadTags();
  }, []);

  // 新規タグ作成
  const createNewTag = () => {
    const newTag = {
      id: `new_${Date.now()}`,
      label: '',
      color: '#667eea'
    };
    setEditingTag({ ...newTag, isNew: true });
  };

  // タグ保存
  const saveTag = (updatedTag) => {
    const targetTags = tagType === 'works' ? worksTags : activityTags;
    const setTargetTags = tagType === 'works' ? setWorksTags : setActivityTags;

    if (updatedTag.isNew) {
      // 新規タグの追加
      const { isNew, ...tagData } = updatedTag;
      setTargetTags([...targetTags, tagData]);
    } else {
      // 既存タグの更新
      setTargetTags(targetTags.map(tag => 
        tag.id === updatedTag.id ? updatedTag : tag
      ));
    }
    setEditingTag(null);
  };

  // タグ削除
  const deleteTag = (tagId) => {
    const targetTags = tagType === 'works' ? worksTags : activityTags;
    const setTargetTags = tagType === 'works' ? setWorksTags : setActivityTags;

    if (window.confirm('このタグを削除しますか？関連するデータからも削除されます。')) {
      setTargetTags(targetTags.filter(tag => tag.id !== tagId));
    }
  };

  // JSONエクスポート機能を強化
  const exportTags = () => {
    const tagsData = {
      worksTags,
      activityTags,
      exportedAt: new Date().toISOString(),
      usage: {
        note: 'このファイルを /data/tags.json として保存してください。',
        worksUsage: '作品のカテゴリ分類とフィルタリングに使用されます。',
        activityUsage: 'アクティビティのタイプ分類とフィルタリングに使用されます（複数選択可能）。',
        instruction: 'エクスポート後、このファイルを /data/tags.json として保存し、サイトを再ビルドしてください。'
      }
    };
    
    const jsonString = JSON.stringify(tagsData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tags-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // ユーザーに指示を表示
    alert('タグ設定をエクスポートしました。\n\n次の手順で反映してください：\n1. ダウンロードしたファイルを /data/tags.json に置き換え\n2. サイトを再ビルドまたはリロード');
  };

  const currentTags = tagType === 'works' ? worksTags : activityTags;

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>タグ設定を読み込んでいます...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="tag-management">
        <div className="tag-management-header">
          <h1>タグ管理</h1>
          <div className="header-actions">
            <button onClick={exportTags} className="btn btn-outline">
              📥 エクスポート
            </button>
            <button onClick={createNewTag} className="btn btn-primary">
              新規タグ追加
            </button>
          </div>
        </div>

        {/* タブ切り替え */}
        <div className="tag-type-tabs">
          <button 
            className={`tab-button ${tagType === 'works' ? 'active' : ''}`}
            onClick={() => setTagType('works')}
          >
            Worksカテゴリ ({worksTags.length})
          </button>
          <button 
            className={`tab-button ${tagType === 'activity' ? 'active' : ''}`}
            onClick={() => setTagType('activity')}
          >
            Activityタイプ ({activityTags.length})
          </button>
        </div>

        {/* タグリスト */}
        <div className="tags-list">
          <div className="tags-grid">
            {currentTags.map(tag => (
              <div key={tag.id} className="tag-card">
                <div className="tag-preview">
                  <span 
                    className="tag-color-indicator" 
                    style={{ backgroundColor: tag.color }}
                  ></span>
                  <span className="tag-label">{tag.label}</span>
                  <span className="tag-id">({tag.id})</span>
                </div>
                <div className="tag-actions">
                  <button 
                    onClick={() => setEditingTag(tag)}
                    className="btn btn-small btn-outline"
                  >
                    編集
                  </button>
                  <button 
                    onClick={() => deleteTag(tag.id)}
                    className="btn btn-small btn-danger"
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 使用状況の説明 */}
        <div className="tag-usage-info">
          <h3>タグの使用方法</h3>
          <div className="usage-grid">
            <div className="usage-item">
              <h4>Worksカテゴリ</h4>
              <ul>
                <li>作品の種類やジャンルを分類</li>
                <li>Works一覧ページでのフィルタリングに使用</li>
                <li>作品詳細ページでのカテゴリ表示</li>
              </ul>
            </div>
            <div className="usage-item">
              <h4>Activityタイプ</h4>
              <ul>
                <li>活動の種類を分類（複数選択可能）</li>
                <li>Activityページでのフィルタリングに使用</li>
                <li>タイムライン表示でのバッジ表示</li>
              </ul>
            </div>
          </div>
        </div>

        {/* タグ編集モーダル */}
        {editingTag && (
          <TagEditModal
            tag={editingTag}
            tagType={tagType}
            onSave={saveTag}
            onCancel={() => setEditingTag(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

// タグ編集モーダル
const TagEditModal = ({ tag, tagType, onSave, onCancel }) => {
  const [formData, setFormData] = useState(tag);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.label.trim()) {
      alert('ラベルは必須です');
      return;
    }
    if (!formData.id.trim()) {
      alert('IDは必須です');
      return;
    }
    onSave(formData);
  };

  const presetColors = [
    '#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b',
    '#fa709a', '#fee140', '#a8edea', '#ff6b6b', '#4ecdc4',
    '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7'
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{tag.isNew ? '新規タグ追加' : 'タグ編集'} - {tagType === 'works' ? 'Works' : 'Activity'}</h2>
          <button onClick={onCancel} className="modal-close">×</button>
        </div>

        <form onSubmit={handleSubmit} className="tag-form">
          <div className="form-group">
            <label>ID *</label>
            <input
              type="text"
              value={formData.id}
              onChange={(e) => handleChange('id', e.target.value)}
              placeholder="英数字・ハイフン・アンダースコアのみ"
              pattern="[a-zA-Z0-9_-]+"
              required
            />
            <small>システム内部で使用される識別子です。変更すると既存データとの関連が切れる可能性があります。</small>
          </div>

          <div className="form-group">
            <label>表示ラベル *</label>
            <input
              type="text"
              value={formData.label}
              onChange={(e) => handleChange('label', e.target.value)}
              placeholder="ユーザーに表示される名前"
              required
            />
          </div>

          <div className="form-group">
            <label>色</label>
            <div className="color-picker-section">
              <input
                type="color"
                value={formData.color}
                onChange={(e) => handleChange('color', e.target.value)}
                className="color-input"
              />
              <span className="color-value">{formData.color}</span>
            </div>
            
            <div className="preset-colors">
              <span className="preset-label">プリセット色:</span>
              <div className="preset-colors-grid">
                {presetColors.map(color => (
                  <button
                    key={color}
                    type="button"
                    className={`preset-color ${formData.color === color ? 'active' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleChange('color', color)}
                    title={color}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>プレビュー</label>
            <div className="tag-preview-display">
              <span 
                className="tag-badge" 
                style={{ 
                  backgroundColor: formData.color,
                  color: '#fff',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}
              >
                {formData.label || 'タグプレビュー'}
              </span>
            </div>
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

export default TagManagement;