import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Header from '../components/header.jsx';
import Footer from '../components/footer.jsx';
import '../style/profile.css';
import { useAuth } from '../contexts/AuthContext';

function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [editOpen, setEditOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: user?.displayName || 'User',
    email: user?.email || 'user@example.com',
    address: 'Hyderabad, India',
  });
  const [editProfile, setEditProfile] = useState(profile);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully! See you soon!');
      navigate('/');
    } catch (error) {
      toast.error('Error logging out. Please try again.');
      console.error('Logout error:', error);
    }
  };
  const handleBack = () => {
    navigate(-1);
  };
  const handleEdit = () => {
    setEditProfile(profile);
    setEditOpen(true);
  };
  const handleEditChange = (e) => {
    setEditProfile({ ...editProfile, [e.target.name]: e.target.value });
  };
  const handleEditSave = (e) => {
    e.preventDefault();
    setProfile(editProfile);
    setEditOpen(false);
    toast.success('Profile updated!');
  };
  const handleEditCancel = () => {
    setEditOpen(false);
  };

  return (
    <>
      <Header />
      <div className="profile-unique-bg">
        <svg className="profile-abstract-bg" width="100%" height="100%" viewBox="0 0 1440 320" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="#ff7043" fillOpacity="0.08" d="M0,160L60,170.7C120,181,240,203,360,197.3C480,192,600,160,720,133.3C840,107,960,85,1080,101.3C1200,117,1320,171,1380,197.3L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z" />
        </svg>
        <svg className="profile-floating-accent" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="60" rx="60" ry="60" fill="url(#paint0_radial)" />
          <defs>
            <radialGradient id="paint0_radial" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5" gradientTransform="translate(60 60) scale(60)">
              <stop stopColor="#ff7043" stopOpacity="0.5" />
              <stop offset="1" stopColor="#ffeede" stopOpacity="0.1" />
            </radialGradient>
          </defs>
        </svg>
        <div className="profile-unique-main-flex">
          <div className="profile-unique-avatar-col">
            <div className="profile-unique-avatar-glow">
              <div className="profile-unique-avatar">
                <svg width="110" height="110" viewBox="0 0 60 60" fill="none"><circle cx="30" cy="30" r="30" fill="#fff" /><circle cx="30" cy="24" r="13" fill="#ff7043" /><ellipse cx="30" cy="46" rx="18" ry="10" fill="#f5f5f5" /></svg>
              </div>
            </div>
            <button className="profile-unique-back" onClick={handleBack} aria-label="Go back">
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" stroke="#ff7043" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
          <div className="profile-unique-info-col">
            <div className="profile-unique-name">{profile.name}</div>
            <div className="profile-unique-info-list">
              <div className="profile-unique-info">
                <span className="profile-unique-icon" aria-label="Email">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M4 4h16v16H4z" fill="#fff" /><path d="M4 4l8 8 8-8" stroke="#ff7043" strokeWidth="2" /></svg>
                </span>
                <span className="profile-unique-label">Email</span>
                <span className="profile-unique-value">{profile.email}</span>
              </div>
              <div className="profile-unique-info">
                <span className="profile-unique-icon" aria-label="Address">
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="10" r="3.5" stroke="#ff7043" strokeWidth="2" /><path d="M12 21c-4.5-4.5-7-7.5-7-10.5A7 7 0 0112 3a7 7 0 017 7.5c0 3-2.5 6-7 10.5z" stroke="#ff7043" strokeWidth="2" /></svg>
                </span>
                <span className="profile-unique-label">Address</span>
                <span className="profile-unique-value">{profile.address}</span>
              </div>
            </div>
            <div className="profile-unique-actions">
              <button className="profile-unique-edit" onClick={handleEdit}>Edit Profile</button>
              <button className="profile-unique-logout" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </div>
        {editOpen && (
          <div className="profile-edit-modal-bg" onClick={handleEditCancel}>
            <form className="profile-edit-modal" onClick={e => e.stopPropagation()} onSubmit={handleEditSave}>
              <div className="profile-edit-modal-title">Edit Profile</div>
              <label>Name
                <input name="name" value={editProfile.name} onChange={handleEditChange} autoFocus />
              </label>
              <label>Email
                <input name="email" value={editProfile.email} onChange={handleEditChange} type="email" />
              </label>
              <label>Address
                <input name="address" value={editProfile.address} onChange={handleEditChange} />
              </label>
              <div className="profile-edit-modal-actions">
                <button type="button" className="profile-edit-cancel" onClick={handleEditCancel}>Cancel</button>
                <button type="submit" className="profile-edit-save">Save</button>
              </div>
            </form>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Profile; 