import React from 'react';
import './MultiTagSelect.css';

const MultiTagSelect = ({ options, value = [], onChange, placeholder = "タグを選択" }) => {
  // タグの選択/選択解除
  const handleTagToggle = (tagId) => {
    const newValue = value.includes(tagId)
      ? value.filter(id => id !== tagId)
      : [...value, tagId];
    onChange(newValue);
  };

  // 選択されたタグのオブジェクトを取得
  const selectedTags = value.map(tagId => 
    options.find(option => option.id === tagId)
  ).filter(Boolean);

  return (
    <div className="multi-tag-select-checkbox">
      <div className="tag-options-grid">
        {options.map((option) => {
          const isSelected = value.includes(option.id);
          return (
            <label key={option.id} className={`tag-option ${isSelected ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleTagToggle(option.id)}
                className="tag-checkbox"
              />
              <span 
                className="tag-label"
                style={{
                  backgroundColor: isSelected ? option.color : 'transparent',
                  borderColor: option.color,
                  color: isSelected ? '#fff' : option.color
                }}
              >
                {option.label}
              </span>
            </label>
          );
        })}
      </div>
      
      {value.length > 0 && (
        <div className="selected-tags-display">
          <span className="selected-label">選択中:</span>
          <div className="selected-tags">
            {selectedTags.map((tag) => (
              <span 
                key={tag.id} 
                className="selected-tag"
                style={{
                  backgroundColor: tag.color,
                  color: '#fff'
                }}
              >
                {tag.label}
                <button
                  type="button"
                  onClick={() => handleTagToggle(tag.id)}
                  className="remove-tag"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiTagSelect;