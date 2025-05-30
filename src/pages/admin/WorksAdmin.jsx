import React, { useState, useEffect } from 'react';
import { fetchWorks } from '../../utils/api';
import AdminLayout from './AdminLayout';
import CustomSelect from './CustomSelect';
import './WorksAdmin.css';

const WorksAdmin = () => {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingWork, setEditingWork] = useState(null);
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [importingFile, setImportingFile] = useState(false);

  useEffect(() => {
    const loadWorks = async () => {
      const data = await fetchWorks();
      setWorks(data);
      setLoading(false);
    };
    loadWorks();
  }, []);

  // 新規作品の雛形
  const createNewWork = () => {
    const newWork = {
      id: Date.now().toString(),
      title: '',
      description: '',
      category: 'interactive',
      year: new Date().getFullYear(),
      thumbnail: '',
      images: [],
      awards: [],
      collaborators: [],
      technologies: [],
      venue: '',
      duration: '',
      materials: ''
    };
    setEditingWork(newWork);
  };

  // 作品の保存
  const saveWork = (updatedWork) => {
    if (works.find(w => w.id === updatedWork.id)) {
      // 既存作品の更新
      setWorks(works.map(w => w.id === updatedWork.id ? updatedWork : w));
    } else {
      // 新規作品の追加
      setWorks([...works, updatedWork]);
    }
    setEditingWork(null);
  };

  // 作品の削除
  const deleteWork = (id) => {
    if (window.confirm('この作品を削除しますか？')) {
      setWorks(works.filter(w => w.id !== id));
    }
  };

  // ドラッグ&ドロップでの並び替え
  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (index) => {
    if (draggedIndex === null) return;
    
    const newWorks = [...works];
    const draggedItem = newWorks[draggedIndex];
    newWorks.splice(draggedIndex, 1);
    newWorks.splice(index, 0, draggedItem);
    
    setWorks(newWorks);
    setDraggedIndex(null);
  };

  // JSONのクリップボードコピー
  const copyToClipboard = () => {
    const jsonString = JSON.stringify(works, null, 2);
    navigator.clipboard.writeText(jsonString).then(() => {
      alert('JSONデータをクリップボードにコピーしました');
    }).catch(() => {
      alert('コピーに失敗しました');
    });
  };

  // JSONファイルのダウンロード
  const downloadJson = () => {
    const jsonString = JSON.stringify(works, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `works-${new Date().toISOString().split('T')[0]}.json`;
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
          throw new Error('データはWorks配列である必要があります。');
        }
        
        // 必須フィールドのチェック
        const validWorks = jsonData.map((work, index) => {
          if (!work.id || !work.title) {
            throw new Error(`アイテム ${index + 1}: idとtitleは必須です。`);
          }
          return {
            id: work.id || Date.now().toString(),
            title: work.title || '',
            description: work.description || '',
            category: work.category || 'interactive',
            year: work.year || new Date().getFullYear(),
            thumbnail: work.thumbnail || '',
            images: work.images || [],
            awards: work.awards || [],
            collaborators: work.collaborators || [],
            technologies: work.technologies || [],
            venue: work.venue || '',
            duration: work.duration || '',
            materials: work.materials || ''
          };
        });
        
        if (window.confirm(`${validWorks.length}件のWorksデータをインポートします。\n現在のデータが置き換えられますがよろしいですか？`)) {
          setWorks(validWorks);
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>作品データを読み込んでいます...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="works-admin">
        <div className="admin-header-section">
          <h1>Works管理</h1>
          <div className="admin-actions">
            <button onClick={createNewWork} className="btn btn-primary">
              新規作品追加
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
              {JSON.stringify(works, null, 2)}
            </pre>
          </div>
        )}

        <div className="works-list">
          <h2>作品一覧 ({works.length}件)</h2>
          {works.length === 0 ? (
            <div className="empty-state">
              <p>作品がまだ登録されていません</p>
              <button onClick={createNewWork} className="btn btn-primary">
                最初の作品を追加
              </button>
            </div>
          ) : (
            <div className="works-grid">
              {works.map((work, index) => (
                <div
                  key={work.id}
                  className="work-card"
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                >
                  <div className="work-card-header">
                    <div className="work-info">
                      <h3>{work.title || '無題'}</h3>
                      <p className="work-meta">
                        {work.category} • {work.year}
                      </p>
                    </div>
                    <div className="work-actions">
                      <button
                        onClick={() => setEditingWork(work)}
                        className="btn btn-small btn-outline"
                      >
                        編集
                      </button>
                      <button
                        onClick={() => deleteWork(work.id)}
                        className="btn btn-small btn-danger"
                      >
                        削除
                      </button>
                    </div>
                  </div>
                  <div className="work-card-content">
                    <p className="work-description">
                      {work.description || '説明なし'}
                    </p>
                    {work.awards && work.awards.length > 0 && (
                      <div className="work-awards">
                        🏆 {work.awards.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {editingWork && (
          <WorkEditModal
            work={editingWork}
            onSave={saveWork}
            onCancel={() => setEditingWork(null)}
          />
        )}
      </div>
    </AdminLayout>
  );
};

// 作品編集モーダル
const WorkEditModal = ({ work, onSave, onCancel }) => {
  const [formData, setFormData] = useState(work);

  // カテゴリーオプション
  const categoryOptions = [
    { value: 'installation', label: 'インスタレーション' },
    { value: 'interactive', label: 'インタラクティブ' },
    { value: 'mediaart', label: 'メディアアート' },
    { value: 'performance', label: 'パフォーマンス' },
    { value: 'VR', label: 'VR/AR' },
    { value: 'device', label: 'デバイス' },
    { value: 'software', label: 'ソフトウェア' },
    { value: 'conceptual', label: 'コンセプチュアル' }
  ];

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field, value) => {
    const array = value.split('\n');
    setFormData(prev => ({ ...prev, [field]: array }));
  };

  const handleSubmit = (e) => {

    // 送信前に空行などの削除を行う
    formData.images = (formData.images || []).filter(item => item.trim() !== '');
    formData.awards = (formData.awards || []).filter(item => item.trim() !== '');
    formData.collaborators = (formData.collaborators || []).filter(item => item.trim() !== '');
    formData.technologies = (formData.technologies || []).filter(item => item.trim() !== '');
    
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('タイトルは必須です');
      return;
    }
    onSave(formData);
  };

  // textareaでのEnterキーイベントを処理（フォーム送信を防止）
  const handleTextareaKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Enterキーのイベント伝播を停止してフォーム送信を防止
      e.stopPropagation();
      // デフォルト動作（改行）は許可する
    }
  };

  // フォーム全体でのEnterキー送信を防止
  const handleFormKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
      // textarea以外でのEnterキーはフォーム送信を防止
      e.preventDefault();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{work.title ? '作品編集' : '新規作品追加'}</h2>
          <button onClick={onCancel} className="modal-close">×</button>
        </div>
        
        <form onSubmit={handleSubmit} onKeyDown={handleFormKeyDown} className="work-form">
          <div className="form-grid">
            <div className="form-group">
              <label>タイトル *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="作品タイトル"
                required
              />
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
              <label>制作年</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => handleChange('year', parseInt(e.target.value))}
                min="2000"
                max={new Date().getFullYear() + 1}
              />
            </div>

            <div className="form-group">
              <label>サムネイル画像パス</label>
              <input
                type="text"
                value={formData.thumbnail}
                onChange={(e) => handleChange('thumbnail', e.target.value)}
                placeholder="./images/works/example.jpg"
              />
            </div>
          </div>

          <div className="form-group">
            <label>説明文</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="作品の説明文"
              rows="4"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>会場・場所</label>
              <input
                type="text"
                value={formData.venue || ''}
                onChange={(e) => handleChange('venue', e.target.value)}
                placeholder="展示会場・イベント名"
              />
            </div>

            <div className="form-group">
              <label>期間・日程</label>
              <input
                type="text"
                value={formData.duration || ''}
                onChange={(e) => handleChange('duration', e.target.value)}
                placeholder="2023年4月1日-30日"
              />
            </div>
          </div>

          <div className="form-group">
            <label>使用技術・材料</label>
            <input
              type="text"
              value={formData.materials || ''}
              onChange={(e) => handleChange('materials', e.target.value)}
              placeholder="Arduino, Processing, センサー等"
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>受賞歴（1行1項目）</label>
              <textarea
                className="multi-line-input"
                value={formData.awards?.join('\n') || ''}
                onChange={(e) => handleArrayChange('awards', e.target.value)}
                placeholder="グランプリ受賞&#10;優秀賞受賞&#10;特別賞受賞"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label>協力者（1行1名）</label>
              <textarea
                className="multi-line-input"
                value={formData.collaborators?.join('\n') || ''}
                onChange={(e) => handleArrayChange('collaborators', e.target.value)}
                placeholder="田中太郎&#10;佐藤花子&#10;鈴木一郎"
                rows="4"
              />
            </div>
          </div>

          <div className="form-group">
            <label>技術スタック（1行1項目）</label>
            <textarea
              className="multi-line-input"
              value={formData.technologies?.join('\n') || ''}
              onChange={(e) => handleArrayChange('technologies', e.target.value)}
              placeholder="Unity&#10;C#&#10;OpenCV&#10;Arduino&#10;Processing"
              rows="5"
            />
          </div>

          <div className="form-group">
            <label>画像パス（1行1パス）</label>
            <textarea
              className="multi-line-input"
              value={formData.images?.join('\n') || ''}
              onChange={(e) => handleArrayChange('images', e.target.value)}
              placeholder="./images/works/example1.jpg&#10;./images/works/example2.jpg&#10;./images/works/example3.jpg&#10;./images/works/example4.jpg"
              rows="5"
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

export default WorksAdmin;