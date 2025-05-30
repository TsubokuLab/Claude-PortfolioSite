import React, { useState, useRef, useEffect } from 'react';
import './CustomSelect.css';

const CustomSelect = ({ options, value, onChange, placeholder = "選択してください", disabled = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(
    options.find(option => option.value === value) || null
  );
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const selectRef = useRef(null);

  // 外側クリックで閉じる
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // ESCキーで閉じる
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(selectedOption ? options.findIndex(opt => opt.value === selectedOption.value) : 0);
        } else {
          // 次のオプションをハイライト
          const nextIndex = highlightedIndex < options.length - 1 ? highlightedIndex + 1 : 0;
          setHighlightedIndex(nextIndex);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
          setHighlightedIndex(selectedOption ? options.findIndex(opt => opt.value === selectedOption.value) : 0);
        } else {
          // 前のオプションをハイライト
          const prevIndex = highlightedIndex > 0 ? highlightedIndex - 1 : options.length - 1;
          setHighlightedIndex(prevIndex);
        }
        break;
      case 'Enter':
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0) {
          // ハイライトされたオプションを選択
          const highlightedOption = options[highlightedIndex];
          handleOptionClick(highlightedOption);
        } else {
          handleToggle();
        }
        break;
      case ' ':
        e.preventDefault();
        if (!isOpen) {
          handleToggle();
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
    onChange(option.value);
  };

  return (
    <div className={`custom-select ${disabled ? 'disabled' : ''}`} ref={selectRef}>
      <div 
        className={`custom-select-header ${isOpen ? 'open' : ''}`}
        onClick={handleToggle}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
      >
        <span className="custom-select-value">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <span className={`custom-select-arrow ${isOpen ? 'open' : ''}`}>
          ▼
        </span>
      </div>
      
      {isOpen && (
        <div className="custom-select-dropdown">
          {options.map((option) => (
            <div
              key={option.value}
              className={`custom-select-option ${
                selectedOption?.value === option.value ? 'selected' : ''
              } ${
                options.indexOf(option) === highlightedIndex ? 'highlighted' : ''
              }`}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => setHighlightedIndex(options.indexOf(option))}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;