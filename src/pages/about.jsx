import React, { useEffect, useState } from 'react';
import '../style/about.css';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import { FaChevronDown, FaSearch } from 'react-icons/fa';

function About() {
  const [activeFaq, setActiveFaq] = useState(null);
  const [faqSearch, setFaqSearch] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const faqs = [
    { q: 'Is it free to use?', a: 'Yes, searching and viewing recipes is completely free. We want to help everyone cook better at home.' },
    { q: 'Where do recipes come from?', a: 'Our recipes are gathered from trusted home cooks and verified sources to ensure they actually work.' },
    { q: 'Can I save my favorites?', a: 'Yes! Once you create an account, you can save any recipe to your personal profile for quick access.' },
    { q: 'Do you have vegan options?', a: 'Definitely. We have a dedicated filter for veg and vegan meals to make your search easier.' },
    { q: 'Is there a mobile app?', a: 'Our website is built to work perfectly on your phone, so you can follow recipes right in the kitchen.' },
    { q: 'How do I submit a recipe?', a: 'You can send us your favorite dishes through the contact page, and we might add them to our collection!' }
  ];

  const filteredFaqs = faqs.filter(f =>
    f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="page-wrapper">
      <Header />

      {/* CLEAN MINIMAL HERO */}
      <section className="about-hero-clean">
        <div className="main-container">
          <div className="about-hero-flex">
            <div className="about-hero-text-new">
              <span className="sub-branding">Nice to meet you</span>
              <h1 className="main-display-title">Simple recipes. <br />Real food.</h1>
              <p className="simple-lead">
                We started this project because we wanted a cleaner way to discover food.
                No long stories, no annoying popups—just the recipes you need to make
                something great today.
              </p>
              <div className="cta-group">
                <button className="simple-primary-btn" onClick={() => window.location.href = '/category'}>Browse Food</button>
                <button className="simple-text-btn" onClick={() => document.getElementById('faq-sec').scrollIntoView({ behavior: 'smooth' })}>Common Questions</button>
              </div>
            </div>
            <div className="about-hero-visual">
              <div className="slant-image-wrapper">
                <img
                  src="https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&q=80&w=800"
                  alt="Cooking"
                  className="slant-img"
                />
                <div className="slant-card-overlay">
                  <span>Home Cooked</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SYMMETRIC DROPDOWN FAQ SECTION */}
      <section className="faq-symmetric-section" id="faq-sec">
        <div className="main-container">
          <div className="faq-header-centered">
            <h2 className="section-title">Common Questions</h2>
            <div className="faq-search-wrapper">
              <FaSearch className="f-icon" />
              <input
                type="text"
                placeholder="Search for answers..."
                value={faqSearch}
                onChange={(e) => setFaqSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="faq-grid-symmetric">
            {filteredFaqs.map((faq, i) => (
              <div
                key={i}
                className={`faq-item-new ${activeFaq === i ? 'open' : ''}`}
                onClick={() => setActiveFaq(activeFaq === i ? null : i)}
              >
                <div className="faq-q-box">
                  <h3>{faq.q}</h3>
                  <FaChevronDown className="arrow-icon" />
                </div>
                <div className="faq-a-box">
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>

          {filteredFaqs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
              No results found for "{faqSearch}"
            </div>
          )}
        </div>
      </section>

      {/* SIMPLE MISSION */}
      <section className="simple-mission">
        <div className="main-container">
          <div className="mission-content-centered">
            <h2 className="section-title">Our Goal</h2>
            <p>
              RecipeHunt is built for one purpose: to take the stress out of meal planning.
              We want to be the place you visit when you're hungry but don't know what to make.
              No metrics, no complexity—just a tool to help you eat better.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;