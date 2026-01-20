import React, { useState, useEffect } from 'react';
import '../style/Contact.css';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPaperPlane, FaUtensils, FaArrowRight } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle');

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
        {/* ANIMATED BACKGROUND BLOB */}
        <div className="blob-bg-container">
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
        </div>

        <div className="main-container">
          <div className="luxury-contact-flex">

            {/* VISUAL SIDE - Left */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="contact-visual-side"
            >
              <div className="image-stack-contact">
                <img
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=800"
                  alt="Cooking together"
                  className="main-contact-img"
                />
                <div className="support-badge-float">
                  <div className="badge-icon"><FaUtensils /></div>
                  <div className="badge-text">
                    <span>Active Support</span>
                    <strong>24/7 Response</strong>
                  </div>
                </div>
              </div>

              <div className="contact-text-brief">
                <h1 className="ultra-display">Have some <br />concerns?</h1>
                <p className="narrative-p">
                  We're here to help you with anything you need.
                  Drop us a message and our team will get back to you.
                </p>
                <div className="direct-mail-row">
                  <FaEnvelope className="m-icon" />
                  <strong>support@recipehunt.com</strong>
                </div>
              </div>
            </motion.div>

            {/* FORM SIDE - Right */}
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="glass-form-container"
            >
              <div className="contact-glass-box">
                <div className="box-header">
                  <h2>Get in Touch</h2>
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
                    className={`glow-submit-btn ${status}`}
                    disabled={status !== 'idle'}
                  >
                    {status === 'idle' && (
                      <>
                        <span>Send Message</span>
                        <FaArrowRight />
                      </>
                    )}
                    {status === 'sending' && <span>Routing...</span>}
                    {status === 'success' && <span>Sent!</span>}
                  </button>
                </form>
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