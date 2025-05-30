// GitHub Pagesでのベースパス
const BASE_PATH = '/tsubokura-portfolio';

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
          category: event.type,
          description: event.title, // titleをdescriptionとして使用
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
