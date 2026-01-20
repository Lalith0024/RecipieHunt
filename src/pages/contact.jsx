import React, { useState, useEffect } from 'react';
import '../style/Contact.css';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPaperPlane, FaUtensils } from 'react-icons/fa';

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
      // Logic for Mail
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('success');
      toast.success('Thanks for reaching out! We will reply soon.');
      setFormData({ name: '', email: '', message: '' });

      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="page-wrapper" style={{ background: '#fff' }}>
      <Header />

      <main className="contact-unified-wrapper">
        <div className="main-container">
          <div className="contact-main-flex">

            {/* TEXT SIDE */}
            <div className="contact-intro-side">
              <div className="icon-badge">
                <FaUtensils />
              </div>
              <h1 className="display-title">Let’s connect.</h1>
              <p className="intro-text">
                Whether you have a suggestion, found a bug, or just want to
                share your latest meal, we're here to listen.
              </p>

              <div className="simple-info-list">
                <div className="info-row">
                  <FaEnvelope className="row-icon" />
                  <span>hello@recipehunt.com</span>
                </div>
              </div>
            </div>

            {/* FORM SIDE */}
            <div className="contact-card-container">
              <div className="minimal-card">
                <form onSubmit={handleSubmit} className="clean-form">
                  <div className="input-group">
                    <label>Your Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label>Your Message</label>
                    <textarea
                      name="message"
                      rows="6"
                      placeholder="What is on your mind?"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <button
                    type="submit"
                    className={`minimal-submit ${status}`}
                    disabled={status !== 'idle'}
                  >
                    {status === 'idle' && (
                      <>
                        <span>Send Message</span>
                        <FaPaperPlane />
                      </>
                    )}
                    {status === 'sending' && <span>Sending...</span>}
                    {status === 'success' && <span>Sent!</span>}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Contact;