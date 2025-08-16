import React, { useState } from 'react';
import '../style/Contact.css';
import BackgroundImage from '../../images/ChatGPT Image Jun 16, 2025, 03_32_27 PM.png';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import { toast } from 'react-toastify';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', message: '' });
    }, 1500);
  };
  return (
    <>
    <Header/>
      <div className="fade-in">
        <section
          className="contact-container"
          style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${BackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="contact-wrapper">
            <h2 className="contact-title">Get in Touch</h2>
            <p className="contact-subtitle">We'd love to hear from you! Send us a message.</p>
            <form
              className="contact-form"
              onSubmit={handleSubmit}
            >
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
              <textarea
                name="message"
                rows="6"
                placeholder="Your Message"
                value={formData.message}
                onChange={handleInputChange}
                required
              ></textarea>
              <button type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
          <div className="floating-food">🍝</div>
        </section>
      </div>
      <Footer/>
    </>
    
  );
}

export default Contact;