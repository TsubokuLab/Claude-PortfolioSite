import React, { useState, useEffect } from 'react';
import ScrollAnimation from '../components/animations/ScrollAnimation';
import { useCursor } from '../context/CursorContext';
import { getAssetPath } from '../utils/paths';
import { fetchSkills } from '../utils/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { setCursor, resetCursor } = useCursor();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);

  // スキルデータは public/data/skills.json が正。管理画面からの更新にも追従する
  useEffect(() => {
    let cancelled = false;
    fetchSkills().then(data => {
      if (cancelled) return;
      setSkills(Array.isArray(data) ? data : []);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const profileImagePath = getAssetPath('/images/profile/teruaki_tsubokura_2025.jpg');

  return (
    <div className="profile-page">
      <div className="container">
        {/* プロフィールヘッダー */}
        <section className="profile-header">
          <ScrollAnimation type="fadeUp">
            <h1 className="page-title">Profile</h1>
          </ScrollAnimation>
          
          <div className="profile-content">
            <ScrollAnimation type="fadeLeft" delay={0.2}>
              <div className="profile-image">
                <div className="image-container">
                  <img 
                    src={profileImagePath}
                    alt="坪倉 輝明 - TERUAKI TSUBOKURA"
                    className="profile-img"
                  />
                </div>
              </div>
            </ScrollAnimation>
            
            <ScrollAnimation type="fadeRight" delay={0.3}>
              <div className="profile-info">
                <h2 className="profile-name">
                  <span className="name-jp">坪倉 輝明</span>
                  <span className="name-en">TERUAKI TSUBOKURA</span>
                </h2>
                <p className="profile-title">Media Artist / Creative Technologist</p>
                <div className="profile-details">
                  <p>
                    1987年 京都生まれ。金沢工業大学メディア情報学科卒業。
                    卒業制作として「Shadow Touch」を制作し「第16回学生CGコンテスト」にてインタラクティブ部門の優秀賞を受賞。
                    その後、「第14回文化庁メディア芸術祭」でも同作品が展示され、日本テレビの人気番組「世界一受けたい授業」などのメディアにも取り上げられる。
                  </p>
                  <p>
                    大学卒業後はシステム会社に就職しWebプログラマの経験を積むが、本業の傍らプライベートワークとして「石畳燈籠」等のインスタレーション作品の制作・展示を行う。
                    その後、より自分のフィールドに近い仕事が出来る株式会社ワントゥーテンへ入社。遊園地の体感型アトラクションゲーム「ミライセンシ」や京都二条城へのプロジェクションマッピング等のインスタレーションを中心に手がけ、デジタルサイネージアワード2014 ゴールド、カンヌライオンズ2013 モバイル部門ゴールド、第66回広告電通賞モバイル・コミュニケーション部門 最優秀賞などを受賞。
                  </p>
                  <p>
                    2015年にフリーランスのメディアアーティスト／クリエイティブテクノロジストとして独立し、10年以上にわたって活動を続けている。総務省 異能vation ジェネレーションアワードでも部門最優秀賞を受賞。国内外で500万人以上を動員した人気の企画展「魔法の美術館」へも作品を多数出展している。
                    広告クリエイティブ分野の企画・制作やテーマパークのアトラクション制作に加え、近年はVRChatを中心としたメタバースの企業ワールド制作、BOOTH／pixivFANBOXでのアセット公開にも比重を置いている。
                  </p>
                  <p>
                    最近は生成AIを制作プロセスに取り込むことに関心があり、思いついた道具やWebアプリをその日のうちに形にする試みを続けている。
                    作品に必要なハードウェアはM5Stack等を使って自分で組み、ソフトとハードの境目を行き来しながらつくることを基本の姿勢としている。
                  </p>
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </section>
        
        {/* SNSリンクセクション */}
        <section className="social-links-section">
          <ScrollAnimation type="fadeUp">
            <h2 className="section-title">Social Media</h2>
            <div className="social-grid">
              <a 
                href="https://x.com/kohack_v" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-card"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
              >
                <div className="social-icon" style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                  <i className="fa-brands fa-x-twitter"></i>
                </div>
                <div className="social-info">
                  <h3>X</h3>
                  <p>@kohack_v</p>
                </div>
              </a>
              
              <a 
                href="https://www.instagram.com/kohack_v/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-card"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
              >
                <div className="social-icon" style={{ backgroundColor: 'rgba(225, 48, 108, 0.1)' }}>
                  <i className="fa-brands fa-instagram"></i>
                </div>
                <div className="social-info">
                  <h3>Instagram</h3>
                  <p>@kohack_v</p>
                </div>
              </a>
              
              <a 
                href="https://www.youtube.com/TeruakiTsubokura" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-card"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
              >
                <div className="social-icon" style={{ backgroundColor: 'rgba(255, 0, 0, 0.1)' }}>
                  <i className="fa-brands fa-youtube"></i>
                </div>
                <div className="social-info">
                  <h3>YouTube</h3>
                  <p>TeruakiTsubokura</p>
                </div>
              </a>
              
              <a 
                href="https://www.facebook.com/teruaki.tsubokura" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-card"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
              >
                <div className="social-icon" style={{ backgroundColor: 'rgba(24, 119, 242, 0.1)' }}>
                  <i className="fa-brands fa-facebook"></i>
                </div>
                <div className="social-info">
                  <h3>Facebook</h3>
                  <p>teruaki.tsubokura</p>
                </div>
              </a>
              
              <a 
                href="https://github.com/TsubokuLab" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-card"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
              >
                <div className="social-icon" style={{ backgroundColor: 'rgba(51, 51, 51, 0.1)' }}>
                  <i className="fa-brands fa-github"></i>
                </div>
                <div className="social-info">
                  <h3>GitHub</h3>
                  <p>TsubokuLab</p>
                </div>
              </a>
              
              <a 
                href="https://tsubokulab.booth.pm/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-card"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
              >
                <div className="social-icon" style={{ backgroundColor: 'rgba(252, 77, 80, 0.1)' }}>
                  <i className="fa-solid fa-store"></i>
                </div>
                <div className="social-info">
                  <h3>BOOTH</h3>
                  <p>tsubokulab.booth.pm</p>
                </div>
              </a>
              
              <a 
                href="https://tsubokulab.fanbox.cc/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-card"
                onMouseEnter={() => setCursor('hover')}
                onMouseLeave={resetCursor}
              >
                <div className="social-icon" style={{ backgroundColor: 'rgba(249, 101, 128, 0.1)' }}>
                  <i className="fa-solid fa-gift"></i>
                </div>
                <div className="social-info">
                  <h3>FANBOX</h3>
                  <p>tsubokulab.fanbox.cc</p>
                </div>
              </a>
            </div>
          </ScrollAnimation>
        </section>
        
        {/* スキルセクション - カード形式 */}
        <section className="skills-section">
          <ScrollAnimation type="fadeUp">
            <h2 className="section-title">Expertise & Skills</h2>
          </ScrollAnimation>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>読み込み中...</p>
            </div>
          ) : (
            <div className="skills-container">
              {skills.map((category, categoryIndex) => (
                <div key={category.category} className="skill-category-section">
                  <ScrollAnimation type="fadeUp" delay={categoryIndex * 0.1}>
                    <div className="skill-category-header">
                      <div className="category-icon">
                        <i className="material-icons">{category.icon}</i>
                      </div>
                      <h3 className="category-title">{category.category}</h3>
                    </div>
                  </ScrollAnimation>
                  
                  <div className="skill-cards-grid">
                    {category.skills.map((skill, skillIndex) => (
                      <ScrollAnimation key={skill.name} type="fadeUp" delay={(categoryIndex * 0.1) + (skillIndex * 0.05)}>
                        <div 
                          className="skill-card"
                          onMouseEnter={() => setCursor('hover')}
                          onMouseLeave={resetCursor}
                        >
                          <h4 className="skill-card-title">{skill.name}</h4>
                          <p className="skill-card-description">{skill.description}</p>
                        </div>
                      </ScrollAnimation>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 受賞歴セクション */}
        <section className="awards-section">
          <ScrollAnimation type="fadeUp">
            <h2 className="section-title">Awards</h2>
            <div className="awards-grid">
              <div className="award-item">
                <div className="award-year">
                  <i className="fa-solid fa-trophy"></i>
                  2025
                </div>
                <div className="award-details">
                  <h3 className="award-title">最先端表現技術推進協会 第9回羽倉賞</h3>
                  <p className="award-subtitle">「体感！ 昭和100年商店街」（NHK放送技術研究所 技研公開2025）</p>
                </div>
              </div>

              <div className="award-item">
                <div className="award-year">
                  <i className="fa-solid fa-trophy"></i>
                  2018
                </div>
                <div className="award-details">
                  <h3 className="award-title">総務省 異能vation ジェネレーションアワード2018</h3>
                  <p className="award-subtitle">大きく広がる分野 最優秀賞</p>
                </div>
              </div>

              <div className="award-item">
                <div className="award-year">
                  <i className="fa-solid fa-trophy"></i>
                  2017
                </div>
                <div className="award-details">
                  <h3 className="award-title">VRクリエイティブアワード2017</h3>
                  <p className="award-subtitle">審査員特別賞</p>
                </div>
              </div>

              <div className="award-item">
                <div className="award-year">
                  <i className="fa-solid fa-trophy"></i>
                  2017
                </div>
                <div className="award-details">
                  <h3 className="award-title">アジアデジタルアートアワード2017</h3>
                  <p className="award-subtitle">入賞</p>
                </div>
              </div>

              <div className="award-item">
                <div className="award-year">
                  <i className="fa-solid fa-trophy"></i>
                  2017
                </div>
                <div className="award-details">
                  <h3 className="award-title">Mashup Awards 2017</h3>
                  <p className="award-subtitle">Unity賞・Interactive Design部門優勝</p>
                </div>
              </div>

              <div className="award-item">
                <div className="award-year">
                  <i className="fa-solid fa-trophy"></i>
                  2015
                </div>
                <div className="award-details">
                  <h3 className="award-title">ArtHackDay2015</h3>
                  <p className="award-subtitle">アート部門 最優秀賞</p>
                </div>
              </div>

              <div className="award-item">
                <div className="award-year">
                  <i className="fa-solid fa-trophy"></i>
                  2014
                </div>
                <div className="award-details">
                  <h3 className="award-title">Yahoo! JAPAN インターネットクリエイティブアワード2014</h3>
                  <p className="award-subtitle">＜一般の部＞スマートデバイスイノベーション部門 ゴールド賞</p>
                </div>
              </div>

              <div className="award-item">
                <div className="award-year">
                  <i className="fa-solid fa-trophy"></i>
                  2014
                </div>
                <div className="award-details">
                  <h3 className="award-title">デジタルサイネージアワード2014</h3>
                  <p className="award-subtitle">ゴールド賞</p>
                </div>
              </div>

              <div className="award-item">
                <div className="award-year">
                  <i className="fa-solid fa-trophy"></i>
                  2013
                </div>
                <div className="award-details">
                  <h3 className="award-title">カンヌライオンズ 国際クリエイティビティ・フェスティバル2013</h3>
                  <p className="award-subtitle">モバイル部門ゴールド</p>
                </div>
              </div>

              <div className="award-item">
                <div className="award-year">
                  <i className="fa-solid fa-trophy"></i>
                  2013
                </div>
                <div className="award-details">
                  <h3 className="award-title">第66回広告電通賞</h3>
                  <p className="award-subtitle">モバイル・コミュニケーション部門 最優秀賞</p>
                </div>
              </div>

              <div className="award-item">
                <div className="award-year">
                  <i className="fa-solid fa-trophy"></i>
                  2010
                </div>
                <div className="award-details">
                  <h3 className="award-title">第16回学生CGコンテスト</h3>
                  <p className="award-subtitle">「Shadow Touch」 インタラクティブ部門 優秀賞</p>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        </section>
      </div>
    </div>
  );
};

export default ProfilePage;