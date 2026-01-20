import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../style/Header.css';
import { Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import { FaUserCircle } from 'react-icons/fa';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleProfileClick = () => {
    setDrawerOpen(false);
    navigate('/profile');
  };

  const navLinks = (
    <ul className="navbar-links">
      <li>
        <Link to="/home" className={location.pathname === '/home' ? 'active' : ''} onClick={() => setDrawerOpen(false)}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/categories" className={location.pathname === '/categories' ? 'active' : ''} onClick={() => setDrawerOpen(false)}>
          Categories
        </Link>
      </li>
      <li>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={() => setDrawerOpen(false)}>
          About
        </Link>
      </li>
      <li>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={() => setDrawerOpen(false)}>
          Contact
        </Link>
      </li>
      <li className="user-menu-desktop" onClick={handleProfileClick}>
        <div className="profile-icon-wrapper">
          <FaUserCircle size={28} />
        </div>
      </li>
    </ul>
  );

  const navLinksMobile = (
    <ul className="navbar-links-mobile">
      <li>
        <Link to="/home" className={location.pathname === '/home' ? 'active' : ''} onClick={() => setDrawerOpen(false)}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/categories" className={location.pathname === '/categories' ? 'active' : ''} onClick={() => setDrawerOpen(false)}>
          Categories
        </Link>
      </li>
      <li>
        <Link to="/about" className={location.pathname === '/about' ? 'active' : ''} onClick={() => setDrawerOpen(false)}>
          About
        </Link>
      </li>
      <li>
        <Link to="/contact" className={location.pathname === '/contact' ? 'active' : ''} onClick={() => setDrawerOpen(false)}>
          Contact
        </Link>
      </li>
      <li>
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''} onClick={() => setDrawerOpen(false)}>
          Profile
        </Link>
      </li>
      <li className="logout-btn-mobile">
        <button onClick={handleLogout}>Logout</button>
      </li>
    </ul>
  );

  return (
    <header className={`navbar ${scrolled ? 'scrolled' : ''} ${location.pathname === '/home' ? 'home-nav' : ''}`}>
      <div className="navbar-container">
        <div className="appname">
          <Link to="/home">
            <span className="logo-text">Recipe<span className="logo-accent">Hunt</span></span>
          </Link>
        </div>

        <div className="navbar-links-desktop">{navLinks}</div>

        <div className="hamburger-mobile" onClick={() => setDrawerOpen(true)}>
          <div className="hamburger-icon-clean">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>

      <Drawer
        placement="left"
        closable={false}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        width={280}
        className="premium-brand-drawer"
        styles={{ body: { padding: 0 } }}
      >
        <div className="drawer-header-new">
          <span className="drawer-close" onClick={() => setDrawerOpen(false)}>✕</span>
          <span className="drawer-logo-text">Recipe<span className="orange">Hunt</span></span>
        </div>

        <div className="drawer-content-new">
          <ul className="drawer-nav-list">
            <li>
              <Link to="/home" className={location.pathname === '/home' ? 'd-active' : ''} onClick={() => setDrawerOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/categories" className={location.pathname === '/categories' ? 'd-active' : ''} onClick={() => setDrawerOpen(false)}>
                Categories
              </Link>
            </li>
            <li>
              <Link to="/about" className={location.pathname === '/about' ? 'd-active' : ''} onClick={() => setDrawerOpen(false)}>
                About
              </Link>
            </li>
            <li>
              <Link to="/contact" className={location.pathname === '/contact' ? 'd-active' : ''} onClick={() => setDrawerOpen(false)}>
                Contact
              </Link>
            </li>
            <li className="profile-drawer-item">
              <Link to="/profile" className={location.pathname === '/profile' ? 'd-active' : ''} onClick={() => setDrawerOpen(false)}>
                Profile
              </Link>
            </li>
          </ul>

          <div className="drawer-footer-auth">
            <button className="drawer-logout-btn" onClick={() => { handleLogout(); setDrawerOpen(false); }}>
              Logout
            </button>
          </div>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
