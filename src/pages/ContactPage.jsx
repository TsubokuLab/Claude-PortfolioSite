import React from 'react';
import { motion } from 'framer-motion';
import ContactForm from '../components/contact/ContactForm';
import ScrollAnimation from '../components/animations/ScrollAnimation';
import ParallaxEffect from '../components/animations/ParallaxEffect';
import { useCursor } from '../context/CursorContext';
import './ContactPage.css';

const ContactPage = () => {
  const { setCursor, resetCursor } = useCursor();

  const socialLinks = [
    {
      name: 'X',
      url: 'https://x.com/kohack_v',
      icon: 'fa-brands fa-x-twitter',
      color: '#000000'
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/kohack_v/',
      icon: 'fa-brands fa-instagram',
      color: '#E1306C'
    },
    {
      name: 'YouTube',
      url: 'https://www.youtube.com/TeruakiTsubokura',
      icon: 'fa-brands fa-youtube',
      color: '#FF0000'
    },
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/teruaki.tsubokura',
      icon: 'fa-brands fa-facebook',
      color: '#1877F2'
    },
    {
      name: 'GitHub',
      url: 'https://github.com/TsubokuLab',
      icon: 'fa-brands fa-github',
      color: '#333333'
    }
  ];

  return (
    <div className="contact-page">
      <div className="container">
        <ScrollAnimation type="fadeUp">
          <h1 className="page-title">Contact</h1>
          <p className="page-description">
            お仕事のご依頼やご質問など、お気軽にお問い合わせください。
            プロジェクトについてのご相談も歓迎します。
          </p>
        </ScrollAnimation>

        <div className="contact-content">
          <div className="contact-form-section">
            <ScrollAnimation type="fadeUp" delay={0.2}>
              <h2 className="section-title">お問い合わせフォーム</h2>
              <ContactForm />
            </ScrollAnimation>
          </div>

          <div className="contact-info-section">
            <ScrollAnimation type="fadeUp" delay={0.3}>
              <h2 className="section-title">連絡先情報</h2>
              
              <div className="contact-details">

                
                <div className="contact-item">
                  <div className="contact-icon">📍</div>
                  <div className="contact-text">
                    <h3>拠点</h3>
                    <p>Tokyo, Japan</p>
                  </div>
                </div>
              </div>
              
              <div className="social-links">
                <h3>SNS</h3>
                <div className="social-icons">
                  {socialLinks.map(social => (
                    <a 
                      key={social.name}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-card"
                      style={{ '--social-color': social.color }}
                      onMouseEnter={() => setCursor('hover')}
                      onMouseLeave={resetCursor}
                    >
                      <i className={social.icon}></i>
                      <span className="social-icon-name">{social.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </ScrollAnimation>
          </div>
        </div>
        
        <div className="faq-section">
          <ScrollAnimation type="fadeUp" delay={0.4}>
            <h2 className="section-title">よくあるご質問</h2>
            <div className="faq-list">
              <div className="faq-item">
                <h3 className="faq-question">どのようなプロジェクトを手がけていますか？</h3>
                <p className="faq-answer">
                  インタラクティブな映像演出、プロジェクションマッピング、VR/AR/MRなどの体験型コンテンツ、
                  メディアアート作品など、デジタルとフィジカルの境界を曖昧にするような作品を中心に制作しています。
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="faq-question">制作の依頼から完成までどのくらいの期間がかかりますか？</h3>
                <p className="faq-answer">
                  プロジェクトの規模や内容によって異なりますが、一般的には企画から完成まで2〜3ヶ月程度を
                  目安としています。急ぎのプロジェクトについてはご相談ください。
                </p>
              </div>
              
              <div className="faq-item">
                <h3 className="faq-question">予算の目安を教えてください。</h3>
                <p className="faq-answer">
                  プロジェクトの内容や規模によって大きく異なります。
                  お問い合わせの際に予算の目安をお伝えいただければ、それに合わせたご提案をさせていただきます。
                </p>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
