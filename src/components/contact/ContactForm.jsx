import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useCursor } from '../../context/CursorContext';
import './ContactForm.css';

const ContactForm = () => {
  const { setCursor, resetCursor } = useCursor();
  
  // フォーム状態
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  // 送信状態
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' または 'error'
  
  // フォーム入力ハンドラ
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  // フォーム送信ハンドラ (ダミー実装)
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 送信成功をシミュレート (実際の実装では、APIへのPOSTリクエストなどを行う)
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus('success');
      
      // フォームリセット
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      
      // 成功メッセージを一時的に表示
      setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
    }, 1500);
  };
  
  // 入力フィールドのアニメーション
  const inputVariants = {
    focus: {
      scale: 1.02,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      transition: { type: 'spring', stiffness: 300 }
    },
    blur: {
      scale: 1,
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
      transition: { type: 'spring', stiffness: 300 }
    }
  };
  
  return (
    <div className="form-overlay-container">
      {/* フォームの無効化オーバーレイ */}
      <div className="form-disabled-overlay">
        <div className="form-disabled-icon">
          <i className="material-icons">announcement</i>
        </div>
        <p className="form-disabled-message">
          現在、お問い合わせフォームを一時的に停止しています。
          右側の各SNSのダイレクトメッセージにてご連絡ください。
        </p>
        <p className="social-links-reminder">
          お手数をおかけしますが、よろしくお願いいたします。
        </p>
      </div>
      
      {/* 元のフォームコンテンツ */}
      <div className="contact-form-container">
        {submitStatus === 'success' && (
          <motion.div 
            className="form-success-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <h3>Message Sent!</h3>
            <p>Thank you for your message. We'll get back to you soon.</p>
          </motion.div>
        )}
        
        {submitStatus === 'error' && (
          <motion.div 
            className="form-error-message"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <h3>Something went wrong</h3>
            <p>Please try again later or contact us directly.</p>
          </motion.div>
        )}
        
        <form onSubmit={handleSubmit} className={submitStatus ? 'form-hidden' : ''}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <motion.input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              onFocus={() => setCursor('text')}
              onBlur={resetCursor}
              variants={inputVariants}
              initial="blur"
              whileFocus="focus"
              whileHover="focus"
              disabled
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <motion.input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              onFocus={() => setCursor('text')}
              onBlur={resetCursor}
              variants={inputVariants}
              initial="blur"
              whileFocus="focus"
              whileHover="focus"
              disabled
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <motion.input
              type="text"
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              onFocus={() => setCursor('text')}
              onBlur={resetCursor}
              variants={inputVariants}
              initial="blur"
              whileFocus="focus"
              whileHover="focus"
              disabled
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <motion.textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5"
              required
              onFocus={() => setCursor('text')}
              onBlur={resetCursor}
              variants={inputVariants}
              initial="blur"
              whileFocus="focus"
              whileHover="focus"
              disabled
            ></motion.textarea>
          </div>
          
          <motion.button
            type="submit"
            className={`submit-button ${isSubmitting ? 'submitting' : ''}`}
            disabled={true}
            onMouseEnter={() => setCursor('hover')}
            onMouseLeave={resetCursor}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isSubmitting ? (
              <span className="spinner"></span>
            ) : (
              'Send Message'
            )}
          </motion.button>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;
