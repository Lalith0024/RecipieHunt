import React, { useEffect, useState } from 'react';
import '../style/about.css';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import { motion } from 'framer-motion';
import { FaChevronDown, FaSearch, FaArrowRight } from 'react-icons/fa';

function About() {
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    { q: 'Is it free to use?', a: 'Yes, searching and viewing recipes is completely free for everyone. Our aim is to provide a seamless cooking experience for all.' },
    { q: 'Where do recipes come from?', a: 'Our recipes are sourced from a blend of professional chefs and trusted home cooks, all strictly verified for taste and accuracy.' },
    { q: 'Can I save my favorites?', a: 'Absolutely! Create an account to save any recipe to your personal profile for instant access anytime.' },
    { q: 'Do you have vegetarian options?', a: 'Yes, we provide a dedicated filter for vegetarian and vegan meals, ensuring you find exactly what fits your diet.' },
    { q: 'Is the platform mobile friendly?', a: 'RecipeHunt is designed for zero-complexity on any device. You can follow recipes butter-smooth on your phone while cooking.' },
    { q: 'How often are new recipes added?', a: 'We update our collection daily to provide fresh inspiration and seasonal dishes from around the globe.' }
  ];

  return (
    <div className="page-wrapper">
      <Header />

      {/* LUXURY DYNAMIC HERO */}
      <section className="about-luxury-hero">
        <div className="hero-bg-gradient"></div>
        <div className="main-container">
          <div className="hero-content-reveal">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-side"
            >
              <span className="premium-tag">Redefining Home Cooking</span>
              <h1 className="display-title-sexy">Where passion <br />meets <span className="accent-text">Precision.</span></h1>
              <p className="elaborate-subtitle">
                At RecipeHunt, our aim is to provide every home cook with professional-grade tools and
                curated culinary knowledge. We provide a seamless platform that bridges the gap
                between gourmet inspiration and daily kitchen reality.
              </p>
              <div className="btn-group-luxury">
                <button className="gold-action-btn" onClick={() => window.location.href = '/category'}>Explore Cuisines <FaArrowRight /></button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
              className="visual-side"
            >
              <div className="overlapping-plates">
                <img
                  src="https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=600"
                  alt="Plate 1"
                  className="plate-one slant-3d"
                />
                <img
                  src="https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400"
                  alt="Plate 2"
                  className="plate-two slant-3d"
                />
                <div className="floating-stat-box">
                  <span className="box-val">Top Rated</span>
                  <span className="box-lab">Recipe Platform</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* OUR AIM - GLASS CONTENT */}
      <section className="aim-glass-section">
        <div className="main-container">
          <motion.div
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 50 }}
            viewport={{ once: true }}
            className="glass-aim-card"
          >
            <div className="aim-grid">
              <div className="aim-text">
                <h2 className="section-title-white">Our Mission</h2>
                <p className="thick-p">
                  Our primary objective is to cultivate a digital ecosystem where recipe discovery is no longer a chore,
                  but an intuitive journey of taste. We are committed to maintaining the highest standards of culinary
                  accuracy, ensuring that every time you stir your pot, the outcome is nothing short of spectacular.
                </p>
                <div className="feature-dots">
                  <div className="f-dot"><span>✓</span> Absolute Precision</div>
                  <div className="f-dot"><span>✓</span> Global Community</div>
                  <div className="f-dot"><span>✓</span> Zero-Complexity UI</div>
                </div>
              </div>
              <div className="aim-visual">
                <div className="circle-glow"></div>
                <img src="/hero_main.png" alt="Featured" className="aim-img-float" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* SYMMETRIC FAQ - REFINED */}
      <section className="faq-symmetric-section-refined">
        <div className="main-container">
          <div className="faq-minimal-header">
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>

          <div className="faq-columns">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className={`luxury-faq-item ${activeFaq === i ? 'active' : ''}`}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                layout
              >
                <div className="faq-q">
                  <h3>{faq.q}</h3>
                  <div className="plus-icon">{activeFaq === i ? '-' : '+'}</div>
                </div>
                {activeFaq === i && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="faq-a"
                  >
                    <p>{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;