import React from 'react';
import './App.css';
import Header from './components/header.jsx';
import Footer from './components/footer.jsx';
import Home from './pages/home.jsx';
import About from './pages/about.jsx';
import Contact from './pages/contact.jsx';
import Categories from './pages/category.jsx';
import Login from './pages/login.jsx';
import Register from './pages/register.jsx';
import Profile from './pages/profile.jsx';
import { AuthProvider } from './contexts/AuthContext.jsx';

import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <AuthProvider>
      <div className="page-container">
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<Navigate to="/home" replace />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}

export default App;
