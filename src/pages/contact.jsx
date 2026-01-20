import React, { useState, useEffect } from 'react';
import '../style/Contact.css';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import { toast } from 'react-toastify';
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success

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

    // Simulate real mail sending logic (Nodemailer style)
    // In a real app, this would be an axios.post('/api/contact', formData)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setStatus('success');
      toast.success('Your message has been delivered to our culinary team!');
      setFormData({ name: '', email: '', subject: '', message: '' });

      setTimeout(() => setStatus('idle'), 3000);
    } catch (err) {
      toast.error('Failed to send message. Please try again.');
      setStatus('idle');
    }
  };

  return (
    <div className="page-wrapper">
      <Header />

      <section className="contact-hero">
        <div className="main-container">
          <div className="contact-hero-content">
            <h1 className="hero-title">Let's Talk Food.</h1>
            <p className="hero-subtitle">Have a recipe to share or a question to ask? We're all ears.</p>
          </div>
        </div>
      </section>

      <section className="contact-main">
        <div className="main-container">
          <div className="contact-grid">

            {/* Contact Info Side */}
            <div className="contact-info-panel">
              <div className="info-item">
                <div className="info-icon"><FaEnvelope /></div>
                <div className="info-text">
                  <h3>Email Us</h3>
                  <p>hello@recipefinder.com</p>
                  <p>support@recipefinder.com</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><FaPhone /></div>
                <div className="info-text">
                  <h3>Call Us</h3>
                  <p>+1 (555) 123-4567</p>
                  <p>Mon - Fri, 9am - 6pm</p>
                </div>
              </div>
              <div className="info-item">
                <div className="info-icon"><FaMapMarkerAlt /></div>
                <div className="info-text">
                  <h3>Visit Our Studio</h3>
                  <p>123 Culinary Drive</p>
                  <p>San Francisco, CA 94103</p>
                </div>
              </div>

              <div className="info-socials">
                <div className="social-bubble">IG</div>
                <div className="social-bubble">TW</div>
                <div className="social-bubble">FB</div>
              </div>
            </div>

            {/* Form Side */}
            <div className="contact-form-card">
              <form className="luxury-form" onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="Recipe Submission / Query"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Your Message</label>
                  <textarea
                    name="message"
                    rows="5"
                    placeholder="Tell us everything..."
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className={`submit-btn ${status}`}
                  disabled={status !== 'idle'}
                >
                  {status === 'idle' && (
                    <>
                      <span>Send Message</span>
                      <FaPaperPlane />
                    </>
                  )}
                  {status === 'sending' && <span>Routing via SMTP...</span>}
                  {status === 'success' && <span>Message Delivered!</span>}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Contact;