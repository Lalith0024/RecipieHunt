import React, { useEffect } from 'react';
import '../style/about.css';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import { FaUserFriends, FaGlobeAmericas, FaLightbulb, FaAward } from 'react-icons/fa';

function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { icon: <FaUserFriends />, label: 'Active Users', value: '500K+' },
    { icon: <FaGlobeAmericas />, label: 'Cuisines', value: '40+' },
    { icon: <FaLightbulb />, label: 'New Daily Recipes', value: '100+' },
    { icon: <FaAward />, label: 'Awards Won', value: '12' },
  ];

  return (
    <div className="page-wrapper">
      <Header />

      {/* LUXURY HERO SECTION */}
      <section className="about-hero">
        <div className="main-container">
          <div className="about-hero-grid">
            <div className="about-hero-text">
              <span className="hero-tag">Our Culinary Story</span>
              <h1 className="hero-title">Discover the Taste <br /> of Tomorrow.</h1>
              <p className="hero-subtitle">
                We're more than just a recipe database. We're a community of passionate foodies
                dedicated to bringing the world's most exquisite flavors into your home kitchen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="stats-strip">
        <div className="main-container">
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <div key={i} className="stat-card">
                <div className="stat-icon">{stat.icon}</div>
                <div className="stat-info">
                  <h3 className="stat-value">{stat.value}</h3>
                  <p className="stat-label">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OUR MISSION SECTION */}
      <section className="mission-section">
        <div className="main-container">
          <div className="mission-grid">
            <div className="mission-img-box">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&q=80&w=600"
                alt="Chef cooking"
                className="mission-img"
              />
              <div className="img-float-card">
                <span className="float-number">10+</span>
                <span className="float-text">Years of Excellence</span>
              </div>
            </div>
            <div className="mission-text-box">
              <h2 className="section-title">The RecipeFinder Mission</h2>
              <p>
                Food is the universal language that connects us all. Our journey began in a small kitchen
                with a simple idea: that everyone should have access to professional-grade recipes
                that are easy to follow and guaranteed to impress.
              </p>
              <p>
                Today, we use advanced technology to curate, verify, and deliver the best culinary
                content from around the globe. Whether you're a novice cook or a home chef,
                we're here to elevate your dining experience.
              </p>
              <div className="mission-pills">
                <span className="m-pill">Trusted by Chefs</span>
                <span className="m-pill">AI-Powered Search</span>
                <span className="m-pill">Verified Ingredients</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="faq-section">
        <div className="main-container">
          <h2 className="section-title" style={{ textAlign: 'center' }}>Curious Minds Ask</h2>
          <div className="faq-grid">
            {[
              { q: 'Are your recipes accurate?', a: 'Every recipe on our platform undergoes a rigorous testing phase by our culinary team to ensure ingredient accuracy and cooking precision.' },
              { q: 'Can I submit my own?', a: 'Absolutely! We love the community spirit. You can submit your recipes via your profile dashboard, and they might even get featured.' },
              { q: 'Is it mobile friendly?', a: 'RecipeFinder is built for the modern world. Our platform is butter-smooth on mobile devices, ensuring you have your guide right at the stove.' },
              { q: 'How often are you updated?', a: 'Our database grows daily. We sync with global culinary trends weekly to bring you the freshest ideas for every season.' }
            ].map((faq, i) => (
              <div key={i} className="faq-card">
                <h3>{faq.q}</h3>
                <p>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default About;