import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useCursor } from '../../context/CursorContext';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { setCursor, resetCursor } = useCursor();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // スクロール検出
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ページ変更時にメニューを閉じる
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  // ナビゲーションアイテム
  const navItems = [
    { path: '/', label: 'HOME' },
    { path: '/profile', label: 'PROFILE' },
    { path: '/works', label: 'WORKS' },
    { path: '/activity', label: 'ACTIVITY' },
    { path: '/contact', label: 'CONTACT' }
  ];

  return (
    <header className={`header ${scrolled ? 'scrolled' : ''} ${menuOpen ? 'menu-open' : ''}`}>
      <div className="container header-container">
        <Link to="/" 
          className="logo" 
          onMouseEnter={() => setCursor('hover')} 
          onMouseLeave={resetCursor}
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            TERUAKI TSUBOKURA
          </motion.span>
        </Link>

        {/* ハンバーガーメニュー（モバイル用） */}
        <div 
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          onMouseEnter={() => setCursor('hover')}
          onMouseLeave={resetCursor}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        {/* ナビゲーション */}
        <nav className={`nav ${menuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            {navItems.map((item, index) => (
              <motion.li
                key={item.path}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="nav-item"
              >
                <NavLink 
                  to={item.path} 
                  className={({ isActive }) => isActive ? 'active' : ''}
                  onMouseEnter={() => setCursor('hover')}
                  onMouseLeave={resetCursor}
                >
                  {item.label}
                </NavLink>
              </motion.li>
            ))}
            
            {/* テーマ切り替えボタン */}
            <li className="nav-item theme-toggle">
              <button 
                onClick={toggleTheme}
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
              >
                {theme === 'dark' ? '☀️' : '🌙'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;