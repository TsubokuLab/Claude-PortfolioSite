import React from 'react';
import { motion } from 'framer-motion';
import ScrollAnimation from '../components/animations/ScrollAnimation';
import ParallaxEffect from '../components/animations/ParallaxEffect';
import { useCursor } from '../context/CursorContext';
import './AboutPage.css';

const AboutPage = () => {
  const { setCursor, resetCursor } = useCursor();

  return (
    <div className="about-page">
      {/* ヘッダーセクション */}
      <section className="about-header">
        <div className="container">
          <ScrollAnimation type="fadeUp">
            <h1 className="page-title">About</h1>
            <div className="header-content">
              <div className="header-text">
                <p className="header-intro">
                  The world such as the magic in the colorful with<br />
                  Art, Architecture, Technology & Design
                </p>
                <p className="header-description">
                  自作ソフトウェアによるインタラクティブな映像演出やハードウェアデバイスによるフィジカルセンシング等、
                  様々な技術を自在に組み合わせ、ソフトウェア／ハードウェアの垣根を超えた作品の制作を行う。
                  デジタルに依存つつもアナログの持つ力を特に重要視しており、現実世界での「体験」をデジタル技術を駆使して拡張し、
                  現実とデジタルの境を曖昧にさせるような中間的な体験を創っている。
                </p>
              </div>
              <div className="header-image">
                <div className="image-container">
                  <img 
                    src="/images/profile/artist.jpg" 
                    alt="TERUAKI TSUBOKURA - Media Artist"
                    className="about-img"
                  />
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* CALAR.inkについて */}
      <section className="about-calar">
        <ParallaxEffect speed={0.1}>
          <div className="parallax-background"></div>
        </ParallaxEffect>
        <div className="container">
          <ScrollAnimation type="fadeUp">
            <h2 className="section-title light">CALAR.ink</h2>
            <div className="calar-content">
              <p className="calar-description">
                「CALAR.ink（カラードットインク）」は、アート、デザイン、テクノロジー、空間などを複合的なスキルを持つメンバーによって結成されたクリエイティブユニット。リアルとバーチャルをシームレスに融合し、アートとテクノロジーを融合した作品で、観る人の心に、まるでカラフルなインクのように、一人一人の記憶に、深く潜り込んでいくような作品作りを目指している。
              </p>
              <div className="calar-members">
                <h3>メンバー</h3>
                <div className="members-grid">
                  <div className="member-item">
                    <div className="member-color member-blue"></div>
                    <h4>Satoshi Eto</h4>
                    <p>Programmer / CG Artist</p>
                  </div>
                  <div className="member-item">
                    <div className="member-color member-purple"></div>
                    <h4>Chiaki Kohara</h4>
                    <p>Artist</p>
                  </div>
                  <div className="member-item">
                    <div className="member-color member-orange"></div>
                    <h4>Tadashi</h4>
                    <p>Architect</p>
                  </div>
                  <div className="member-item">
                    <div className="member-color member-green"></div>
                    <h4>Teruaki Tsubokura</h4>
                    <p>Media Artist</p>
                  </div>
                  <div className="member-item">
                    <div className="member-color member-red"></div>
                    <h4>Shiro Hasegawa</h4>
                    <p>Graphic Director</p>
                  </div>
                  <div className="member-item">
                    <div className="member-color member-brown"></div>
                    <h4>Yuri</h4>
                    <p>Poetry / History</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* 歴史/沿革 */}
      <section className="about-history">
        <div className="container">
          <ScrollAnimation type="fadeUp">
            <h2 className="section-title">History</h2>
            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-date">2019年8月2日</div>
                <div className="timeline-content">
                  <h3>ハッカソン「Art Hack Day 2019」にて、現在のメンバーで「アーティスト名鑑」作品を制作</h3>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">2018年9月6日</div>
                <div className="timeline-content">
                  <h3>同人カタログにて、初作品「異能vation」を発表。発起人が「空想ジオラマ」で受賞したことから、その作品をモチーフとしたものも。</h3>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">2018年8月27日</div>
                <div className="timeline-content">
                  <h3>茨城県北芸術祭にて展示される「いろのないせかい」/ Achromatic World」を公開</h3>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-date">2017年9月25日</div>
                <div className="timeline-content">
                  <h3>長野市の三二堂が発起人として「Touring the Night」というタイトルで上京</h3>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      {/* ビジョン/フィロソフィー */}
      <section className="about-vision">
        <div className="container">
          <ScrollAnimation type="fadeUp">
            <h2 className="section-title">Vision</h2>
            <div className="vision-content">
              <div className="vision-text">
                <p>
                  デジタルとフィジカルの境界を曖昧にし、新しい「体験」の創出を目指しています。
                  テクノロジーは手段であり、目的ではありません。人々の感性に訴えかけ、
                  新しい気づきや感動を提供するためのツールとして最新技術を活用しています。
                </p>
                <p>
                  また、チームでの共同制作やコラボレーションも積極的に行い、
                  異なる専門性を持つクリエイターとの協働によって、より多様で豊かな表現を追求しています。
                  アートとテクノロジーの融合により、これまでにない体験を創造し、
                  人々の想像力を刺激する作品を生み出していきたいと考えています。
                </p>
              </div>
              <div className="vision-image">
                <div className="image-container">
                  <img 
                    src="/images/works/InvisibleSculpture/InvisibleSculpture_thumb.png" 
                    alt="Vision - メディアアートの未来"
                    className="vision-img"
                  />
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
