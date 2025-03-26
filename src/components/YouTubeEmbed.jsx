import React from 'react';
import { youtubeEmbedStyles } from '../utils/youtubeUtils';

/**
 * YouTube動画を埋め込むレスポンシブなコンポーネント
 * @param {string} videoId - YouTubeの動画ID
 * @param {string} title - 動画タイトル（アクセシビリティ用）
 */
const YouTubeEmbed = ({ videoId, title = '埋め込み動画' }) => {
  if (!videoId) return null;
  
  return (
    <div style={youtubeEmbedStyles.container}>
      <iframe
        style={youtubeEmbedStyles.iframe}
        src={`https://www.youtube.com/embed/${videoId}`}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeEmbed;