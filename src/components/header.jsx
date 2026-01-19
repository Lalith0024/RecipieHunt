import React, { useState } from 'react';
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
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser } = useAuth();

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
      <li className="user-menu" onClick={handleProfileClick} style={{cursor:'pointer'}}>
        <span className="profile-desktop"><FaUserCircle size={26} /></span>
      </li>
      {/* Removed exit/logout icon from navbar per request; logout still accessible elsewhere */}
    </ul>
  );

  const navLinksMobile = (
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
      <li className="user-menu" style={{cursor:'pointer'}}>
        <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''} onClick={() => setDrawerOpen(false)}>
          Profile
        </Link>
      </li>
      <li className="logout-menu" style={{cursor:'pointer'}}>
        <span onClick={handleLogout}>Logout</span>
      </li>
    </ul>
  );

  return (
    <header className="navbar">
      <div className="appname">
        <Link to="/home" style={{ fontSize: 32, fontWeight: 'bold', letterSpacing: 2 }}>RecipeHunt</Link>
      </div>
      <div className="navbar-links-desktop">{navLinks}</div>
      <div className="hamburger-mobile" onClick={() => setDrawerOpen(true)}>
        <MenuOutlined style={{ fontSize: 28, color: '#fff' }} />
      </div>
      <Drawer
        title={<Link to="/home" onClick={() => setDrawerOpen(false)} style={{ color: '#ff6600', fontWeight: 'bold', fontSize: 22 }}>RecipeHunt</Link>}
        placement="left"
        closable={true}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
        bodyStyle={{ padding: 0, background: '#fff7f0' }}
        width={260}
        className="mobile-drawer"
      >
        {navLinksMobile}
      </Drawer>
    </header>
  );
};

export default Header;
