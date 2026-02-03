import React, { useState, useEffect } from 'react';
import '../styles/Contact.css';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPaperPlane, FaUtensils, FaArrowRight } from 'react-icons/fa';
import useSEO from '../hooks/useSEO';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');

  useSEO(
    "Contact Us",
    "Have questions or a recipe to share? Get in touch with the RecipeHunt team today."
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('success');
      toast.success('Your recipe/message is being routed to the team!');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="page-wrapper" style={{ background: '#fff', overflow: 'hidden' }}>
      <Header />

      <main className="contact-luxury-canvas">
        <div className="blob-bg-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        <div className="main-container">
          <div className="contact-symmetry-wrapper">

            {/* LEFT SIDE - IMAGE CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="contact-card image-card"
            >
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=1000"
                alt="Contact Support"
                className="full-card-img"
              />
              <div className="image-card-overlay">
                <div className="support-badge-premium">
                  <FaUtensils className="b-icon" />
                  <div className="b-text">
                    <span>Support Online</span>
                    <strong>We are here to help.</strong>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* RIGHT SIDE - FORM CARD */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="contact-card form-card"
            >
              <div className="box-header-premium">
                <h1 className="display-title-accent">Get in <span className="highlight">Touch</span></h1>
                <p>Send your queries through the form below.</p>
              </div>

              <form onSubmit={handleSubmit} className="premium-compact-form">
                <div className="form-field">
                  <input
                    type="text"
                    name="name"
                    placeholder=" "
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    id="name"
                  />
                  <label htmlFor="name">Your Name</label>
                </div>

                <div className="form-field">
                  <input
                    type="email"
                    name="email"
                    placeholder=" "
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    id="email"
                  />
                  <label htmlFor="email">Your Email</label>
                </div>

                <div className="form-field">
                  <textarea
                    name="message"
                    rows="4"
                    placeholder=" "
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    id="msg"
                  ></textarea>
                  <label htmlFor="msg">Your Message</label>
                </div>

                <button
                  type="submit"
                  className={`glow-submit-btn-new ${status}`}
                  disabled={status !== 'idle'}
                >
                  {status === 'idle' && (
                    <>
                      <span>Send Message</span>
                      <FaArrowRight />
                    </>
                  )}
                  {status === 'sending' && <span>Processing...</span>}
                  {status === 'success' && <span>Message Sent!</span>}
                </button>
              </form>

              <div className="footer-contact-info">
                <FaEnvelope className="f-icon-small" />
                <span>support@recipehunt.com</span>
              </div>
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;