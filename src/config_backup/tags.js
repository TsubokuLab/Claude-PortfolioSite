// タグ設定の中央管理
// 全コンポーネントで共通のタグ設定を使用

export const WORKS_TAGS = [
  { id: 'VR', label: 'VR/AR', color: '#667eea' },
  { id: 'mediaart', label: 'メディアアート', color: '#764ba2' },
  { id: 'performance', label: 'パフォーマンス', color: '#f093fb' },
  { id: 'device', label: 'デバイス', color: '#4facfe' },
  { id: 'software', label: 'ソフトウェア', color: '#43e97b' },
  { id: 'interactive', label: 'インタラクティブ', color: '#fa709a' },
  { id: 'installation', label: 'インスタレーション', color: '#fee140' },
  { id: 'conceptual', label: 'コンセプチュアル', color: '#a8edea' }
];

export const ACTIVITY_TAGS = [
  { id: 'exhibition', label: '展示', color: '#33cc66' },
  { id: 'award', label: '受賞', color: '#ff9933' },
  { id: 'works', label: '制作', color: '#3399ff' },
  { id: 'media', label: 'メディア', color: '#9966cc' },
  { id: 'workshop', label: '講演・ワークショップ', color: '#ff6666' },
  { id: 'performance', label: 'パフォーマンス', color: '#ff33cc' },
  { id: 'collaboration', label: 'コラボレーション', color: '#ffcc33' }
];

// タグIDからラベルを取得する関数
export const getActivityTagLabel = (tagId) => {
  const tag = ACTIVITY_TAGS.find(t => t.id === tagId);
  return tag ? tag.label : 'イベント';
};

// タグIDから色を取得する関数
export const getActivityTagColor = (tagId) => {
  const tag = ACTIVITY_TAGS.find(t => t.id === tagId);
  return tag ? tag.color : '#667eea';
};

// Worksタグ用の関数
export const getWorksTagLabel = (tagId) => {
  const tag = WORKS_TAGS.find(t => t.id === tagId);
  return tag ? tag.label : 'その他';
};

export const getWorksTagColor = (tagId) => {
  const tag = WORKS_TAGS.find(t => t.id === tagId);
  return tag ? tag.color : '#667eea';
};

// ActivityPageのCSSクラス生成用
export const generateActivityTagCSS = () => {
  return ACTIVITY_TAGS.map(tag => `
.event-type-badge.${tag.id} {
  background-color: ${tag.color}20;
  color: ${tag.color};
}
  `).join('\n');
};

// タグ設定をlocalStorageに保存
export const saveTagsToStorage = (worksTags, activityTags) => {
  const tagsData = {
    worksTags,
    activityTags,
    lastUpdated: new Date().toISOString()
  };
  localStorage.setItem('portfolio_tags_config', JSON.stringify(tagsData));
};

// タグ設定をlocalStorageから読み込み
export const loadTagsFromStorage = () => {
  try {
    const stored = localStorage.getItem('portfolio_tags_config');
    if (stored) {
      const data = JSON.parse(stored);
      return {
        worksTags: data.worksTags || WORKS_TAGS,
        activityTags: data.activityTags || ACTIVITY_TAGS,
        lastUpdated: data.lastUpdated
      };
    }
  } catch (error) {
    console.warn('Failed to load tags from storage:', error);
  }
  
  return {
    worksTags: WORKS_TAGS,
    activityTags: ACTIVITY_TAGS,
    lastUpdated: null
  };
};