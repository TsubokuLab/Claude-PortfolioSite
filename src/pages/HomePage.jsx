import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/home/Hero';
import FeaturedWorks from '../components/home/FeaturedWorks';
import Background from '../components/webgl/Background';
import ScrollAnimation from '../components/animations/ScrollAnimation';
import ParallaxEffect from '../components/animations/ParallaxEffect';
import { isWebGLSupported } from '../utils/helpers';
import { fetchActivities } from '../utils/api';
import './HomePage.css';

// 「2026-04-25」→「2026.04」
const formatYearMonth = (dateString) => {
  if (!dateString) return '';
  const [year, month] = dateString.split('-');
  return month ? `${year}.${month}` : year;
};

const HomePage = () => {
  // WebGLサポートチェック
  const [webglSupported, setWebglSupported] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    setWebglSupported(isWebGLSupported());
  }, []);

  // 最近の活動（timeline.json の新しい順に4件）
  useEffect(() => {
    let cancelled = false;
    fetchActivities().then(activities => {
      if (!cancelled) setRecentActivities(activities.slice(0, 4));
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="home-page">
      {/* 背景アニメーション (WebGLをサポートしている場合のみ表示) */}
      {webglSupported && <Background />}

      {/* ヒーローセクション */}
      <Hero />

      {/* 特徴的な作品 */}
      <FeaturedWorks />

      {/* スキルセクション */}
      <section className="skills-section">
        <div className="container">
          <ScrollAnimation type="fadeUp">
            <h2 className="section-title">Skills &amp; Expertise</h2>
          </ScrollAnimation>

          <div className="skills-grid">
            <ScrollAnimation type="fadeLeft" delay={0.2}>
              <div className="skill-card">
                <div className="skill-icon">
                  <i className="skill-icon-unity">Unity</i>
                </div>
                <h3>インタラクティブ開発</h3>
                <p>
                  Unity/C#を用いたVR/MR/AR開発、テーマパークアトラクション、
                  プロジェクションマッピングなど様々なインタラクティブコンテンツの制作。
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation type="fadeUp" delay={0.3}>
              <div className="skill-card">
                <div className="skill-icon">
                  <i className="skill-icon-code">Code</i>
                </div>
                <h3>クリエイティブコーディング</h3>
                <p>
                  C++/openFrameworks、Processing、WebGLなどを用いた
                  表現技法によるビジュアルプログラミングやメディアアート作品の制作。
                </p>
              </div>
            </ScrollAnimation>

            <ScrollAnimation type="fadeRight" delay={0.4}>
              <div className="skill-card">
                <div className="skill-icon">
                  <i className="skill-icon-hardware">Hardware</i>
                </div>
                <h3>フィジカルコンピューティング</h3>
                <p>
                  各種センサーデバイスの連携、Arduino、Kinect、
                  Leap Motionなどを用いたハードウェアインタラクション設計。
                </p>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* 最近の活動（timeline.json から自動取得） */}
      {recentActivities.length > 0 && (
        <section className="achievements-section">
          <ParallaxEffect speed={0.1}>
            <div className="parallax-background"></div>
          </ParallaxEffect>

          <div className="container">
            <ScrollAnimation type="fadeUp">
              <h2 className="section-title light">Recent Activity</h2>
            </ScrollAnimation>

            <div className="achievements-list">
              {recentActivities.map((activity, index) => (
                <ScrollAnimation key={activity.id} type="fadeUp" delay={0.1 + index * 0.1}>
                  <div className="achievement-item">
                    <div className="achievement-year">{formatYearMonth(activity.date)}</div>
                    <div className="achievement-content">
                      <h3>{activity.title}</h3>
                      {activity.venue && <p>{activity.venue}</p>}
                    </div>
                  </div>
                </ScrollAnimation>
              ))}
            </div>

            <ScrollAnimation type="fadeUp" delay={0.5}>
              <div className="view-all-activity">
                <Link to="/activity" className="button secondary light">
                  活動履歴をすべて見る
                </Link>
              </div>
            </ScrollAnimation>
          </div>
        </section>
      )}

      {/* コンタクトCTA */}
      <section className="contact-cta">
        <div className="container">
          <ScrollAnimation type="fadeUp">
            <h2 className="cta-title">Let&apos;s Work Together</h2>
            <p className="cta-description">
              新しいプロジェクトや依頼についてのご相談をお待ちしています。
              あなたのアイデアを一緒に形にしましょう。
            </p>
            <Link to="/contact" className="button primary">お問い合わせ</Link>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
