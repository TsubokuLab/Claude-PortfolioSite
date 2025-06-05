// タグ設定データを取得する関数
export const fetchTags = async () => {
  try {
    const url = `${import.meta.env.BASE_URL}data/tags.json`;
    console.log('Fetching tags from:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch tags: ${response.status}`);
    }
    const data = await response.json();
    console.log('Tags data fetched successfully');
    return data;
  } catch (error) {
    console.error('Error fetching tags:', error);
    // フォールバック用のデフォルトタグ設定（/public/data/tags.json と一致）
    return {
      worksTags: [
        { id: 'VR', label: 'VR/AR', color: '#667eea' },
        { id: 'mediaart', label: 'メディアアート', color: '#764ba2' },
        { id: 'performance', label: 'パフォーマンス', color: '#f093fb' },
        { id: 'device', label: 'デバイス', color: '#4facfe' },
        { id: 'software', label: 'ソフトウェア', color: '#43e97b' },
        { id: 'interactive', label: 'インタラクティブ', color: '#fa709a' },
        { id: 'installation', label: 'インスタレーション', color: '#fee140' },
        { id: 'conceptual', label: 'コンセプチュアル', color: '#a8edea' }
      ],
      activityTags: [
        { id: 'exhibition', label: '展示', color: '#33cc66' },
        { id: 'award', label: '受賞', color: '#ff9933' },
        { id: 'works', label: '制作', color: '#3399ff' },
        { id: 'media', label: 'メディア', color: '#9966cc' },
        { id: 'workshop', label: '講演・ワークショップ', color: '#ff6666' }
      ]
    };
  }
};

// Activityタグのラベルを取得する関数
export const getActivityTagLabel = async (tagId) => {
  try {
    const tagsData = await fetchTags();
    const tag = tagsData.activityTags.find(t => t.id === tagId);
    return tag ? tag.label : 'イベント';
  } catch (error) {
    console.error('Error getting activity tag label:', error);
    return 'イベント';
  }
};

// Activityタグの色を取得する関数
export const getActivityTagColor = async (tagId) => {
  try {
    const tagsData = await fetchTags();
    const tag = tagsData.activityTags.find(t => t.id === tagId);
    return tag ? tag.color : '#667eea';
  } catch (error) {
    console.error('Error getting activity tag color:', error);
    return '#667eea';
  }
};

// 作品データを取得する関数
export const fetchWorks = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/works.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch works: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching works:', error);
    return [];
  }
};

// 単一の作品データを取得する関数
export const fetchWorkById = async (id) => {
  try {
    const works = await fetchWorks();
    return works.find(work => work.id === id) || null;
  } catch (error) {
    console.error(`Error fetching work with id ${id}:`, error);
    return null;
  }
};

// アクティビティデータを取得する関数
export const fetchActivities = async () => {
  try {
    const url = `${import.meta.env.BASE_URL}data/timeline.json`;
    console.log('Fetching activities from:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch activities: ${response.status}`);
    }
    const timelineData = await response.json();
    
    // timelineデータをフラットなアクティビティ配列に変換
    const activities = [];
    timelineData.forEach(yearData => {
      yearData.events.forEach((event, index) => {
        activities.push({
          id: `${yearData.year}-${index}`,
          title: event.title,
          date: event.date,
          type: event.type || 'exhibition', // categoryからtypeに統一
          description: event.description || event.title, // descriptionがあればそれを使用、なければtitleを使用
          venue: event.venue || '',
          venue_url: event.venue_url || '',
          url: event.url || ''
        });
      });
    });
    
    // 日付順（新しい順）でソート
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    console.log('Activities data processed successfully, count:', activities.length);
    return activities;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
};

// タイムラインデータを取得する関数
export const fetchTimeline = async () => {
  try {
    const url = `${import.meta.env.BASE_URL}data/timeline.json`;
    console.log('Fetching timeline from:', url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch timeline: ${response.status}`);
    }
    const data = await response.json();
    console.log('Timeline data fetched successfully, first year:', data[0]?.year);
    return data;
  } catch (error) {
    console.error('Error fetching timeline:', error);
    return [];
  }
};

// スキルデータを取得する関数
export const fetchSkills = async () => {
  try {
    const response = await fetch(`${import.meta.env.BASE_URL}data/skills.json`);
    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
};
