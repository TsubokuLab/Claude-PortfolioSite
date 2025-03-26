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
