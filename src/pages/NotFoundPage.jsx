import React from 'react';
import { Link } from 'react-router-dom';
import { useCursor } from '../context/CursorContext';
import ScrollAnimation from '../components/animations/ScrollAnimation';
import './NotFoundPage.css';

const NotFoundPage = () => {
  const { setCursor, resetCursor } = useCursor();

  return (
    <div className="notfound-page">
      <div className="container">
        <ScrollAnimation type="fadeUp">
          <p className="notfound-code">404</p>
          <h1 className="notfound-title">ページが見つかりません</h1>
          <p className="notfound-description">
            URLが変わったか、ページが削除された可能性があります。
          </p>

          <div className="notfound-actions">
            <Link
              to="/"
              className="button primary"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              ホームに戻る
            </Link>
            <Link
              to="/works"
              className="button secondary"
              onMouseEnter={() => setCursor('hover')}
              onMouseLeave={resetCursor}
            >
              作品を見る
            </Link>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default NotFoundPage;
