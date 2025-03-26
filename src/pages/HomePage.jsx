import React, { useEffect } from 'react';
import Hero from '../components/home/Hero';
import FeaturedWorks from '../components/home/FeaturedWorks';
import Background from '../components/webgl/Background';
import ScrollAnimation from '../components/animations/ScrollAnimation';
import ParallaxEffect from '../components/animations/ParallaxEffect';
import { isWebGLSupported } from '../utils/helpers';
import './HomePage.css';

const HomePage = () => {
  // WebGLサポートチェック
  const [webglSupported, setWebglSupported] = React.useState(true);
  
  useEffect(() => {
    setWebglSupported(isWebGLSupported());
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
            <h2 className="section-title">Skills & Expertise</h2>
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
      
      {/* 実績セクション */}
      <section className="achievements-section">
        <ParallaxEffect speed={0.1}>
          <div className="parallax-background"></div>
        </ParallaxEffect>
        
        <div className="container">
          <ScrollAnimation type="fadeUp">
            <h2 className="section-title light">Awards & Recognition</h2>
          </ScrollAnimation>
          
          <div className="achievements-list">
            <ScrollAnimation type="fadeUp" delay={0.2}>
              <div className="achievement-item">
                <div className="achievement-year">2018</div>
                <div className="achievement-content">
                  <h3>総務省 異能vation ジェネレーションアワード</h3>
                  <p>「空想ジオラマ」 大きく広がる分野 最優秀賞</p>
                </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation type="fadeUp" delay={0.3}>
              <div className="achievement-item">
                <div className="achievement-year">2017</div>
                <div className="achievement-content">
                  <h3>VRクリエイティブアワード</h3>
                  <p>「不可視彫像」 審査員特別賞</p>
                </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation type="fadeUp" delay={0.4}>
              <div className="achievement-item">
                <div className="achievement-year">2017</div>
                <div className="achievement-content">
                  <h3>Mashup Awards</h3>
                  <p>「Achromatic World」 Unity賞・Interactive Design部門優勝</p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
      </section>
      
      {/* コンタクトCTA */}
      <section className="contact-cta">
        <div className="container">
          <ScrollAnimation type="fadeUp">
            <h2 className="cta-title">Let's Work Together</h2>
            <p className="cta-description">
              新しいプロジェクトや依頼についてのご相談をお待ちしています。
              あなたのアイデアを一緒に形にしましょう。
            </p>
            <a href="/contact" className="button primary">お問い合わせ</a>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
