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

// トップに並べるスキルカード。ProfilePage の skills.json とは粒度が違うため個別に持つ
const SKILL_CARDS = [
  {
    icon: 'fa-solid fa-cube',
    title: 'インタラクティブ・インスタレーション',
    description:
      'Unity / C# を中心に、美術館の展示作品やテーマパークのアトラクションを制作。' +
      'センサーで人の動きを拾い、映像や音で返す仕組みを組み立てています。',
  },
  {
    icon: 'fa-solid fa-vr-cardboard',
    title: 'VRChat / メタバース',
    description:
      'VRChat のワールド制作と企業出展。Udon でのギミック実装から、' +
      'シェーダを書いての見た目づくり、Quest / PICO 向けの軽量化まで手がけます。',
  },
  {
    icon: 'fa-solid fa-microchip',
    title: 'フィジカルコンピューティング',
    description:
      'M5Stack / ESP32 / Arduino を使った電子工作。センサーと通信を組み合わせて、' +
      '作品に必要な装置はだいたい自分で作ってしまいます。',
  },
  {
    icon: 'fa-solid fa-wand-magic-sparkles',
    title: 'AI を使ったものづくり',
    description:
      'LLM を使って、思いついた道具やWebアプリをその日のうちに形にする。' +
      '企画出しから実装まで、制作のスピードそのものを変えにいっています。',
  },
];

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
            {SKILL_CARDS.map((skill, index) => (
              <ScrollAnimation key={skill.title} type="fadeUp" delay={0.1 + index * 0.1}>
                <div className="skill-card">
                  <div className="skill-icon">
                    <i className={skill.icon}></i>
                  </div>
                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>
                </div>
              </ScrollAnimation>
            ))}
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
            <h2 className="cta-title">Contact</h2>
            <p className="cta-description">
              展示やイベントの演出、テーマパークのアトラクション、VRChat のワールド制作や企業出展、
              技術的に成立するかどうかの検証まで。まだざっくりした構想の段階でも構いません。
            </p>
            <Link to="/contact" className="button primary">お問い合わせ</Link>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
