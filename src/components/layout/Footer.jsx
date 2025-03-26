import React from 'react';
import { Link } from 'react-router-dom';
import { useCursor } from '../../context/CursorContext';
import './Footer.css';

const Footer = () => {
  const { setCursor, resetCursor } = useCursor();
  
  const socialLinks = [
    { name: 'X', url: 'https://x.com/kohack_v', icon: 'fa-x-twitter' },
    { name: 'Instagram', url: 'https://www.instagram.com/kohack_v/', icon: 'fa-instagram' },
    { name: 'YouTube', url: 'https://www.youtube.com/TeruakiTsubokura', icon: 'fa-youtube' },
    { name: 'Facebook', url: 'https://www.facebook.com/teruaki.tsubokura', icon: 'fa-facebook' },
    { name: 'GitHub', url: 'https://github.com/TsubokuLab', icon: 'fa-github' },
    { 
      name: 'BOOTH', 
      url: 'https://tsubokulab.booth.pm/', 
      icon: 'fa-store',
      customIcon: true,
      customClass: 'booth-icon'
    },
    { 
      name: 'FANBOX', 
      url: 'https://tsubokulab.fanbox.cc/', 
      icon: 'fa-gift',
      customIcon: true,
      customClass: 'fanbox-icon'
    },
  ];

  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-content">
          <div className="footer-brand">
            <h2 className="footer-logo">TERUAKI TSUBOKURA</h2>
            <p className="footer-description">
              Media Artist / Creative Technologist
            </p>
          </div>
          
          <div className="footer-nav">
            <div className="footer-nav-column">
              <h3>Navigate</h3>
              <ul>
                <li>
                  <Link 
                    to="/" 
                    onMouseEnter={() => setCursor('hover')} 
                    onMouseLeave={resetCursor}
                  >
                    HOME
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about"
                    onMouseEnter={() => setCursor('hover')} 
                    onMouseLeave={resetCursor}
                  >
                    ABOUT
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/profile"
                    onMouseEnter={() => setCursor('hover')} 
                    onMouseLeave={resetCursor}
                  >
                    PROFILE
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/works"
                    onMouseEnter={() => setCursor('hover')} 
                    onMouseLeave={resetCursor}
                  >
                    WORKS
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/activity"
                    onMouseEnter={() => setCursor('hover')} 
                    onMouseLeave={resetCursor}
                  >
                    ACTIVITY
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact"
                    onMouseEnter={() => setCursor('hover')} 
                    onMouseLeave={resetCursor}
                  >
                    CONTACT
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="footer-nav-column">
              <h3>Connect</h3>
              <ul>
                {socialLinks.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onMouseEnter={() => setCursor('hover')} 
                      onMouseLeave={resetCursor}
                    >
                      {link.customIcon ? (
                        <i className={`fa-solid ${link.icon}`}></i>
                      ) : (
                        <i className={`fa-brands ${link.icon} fa-fw`}></i>
                      )} {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p className="copyright">
            &copy; {new Date().getFullYear()} TERUAKI TSUBOKURA. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
