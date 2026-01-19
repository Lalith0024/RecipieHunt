import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/login.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext.jsx';
import { mapFirebaseError } from '../utils/firebaseErrorMessages';

const Login = () => {
  const navigate = useNavigate();
  const { login, googleLogin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorShown, setErrorShown] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef(null);

  const validateEmail = email.includes('@');
  const isFormValid = validateEmail && password.length > 0 && agreed;

  // Remove playful hover movement to keep a professional, static button
  const resetButtonPosition = () => {};

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password || !agreed) {
      setErrorShown(true);
      toast.error('Please fill all fields and accept terms');
      return;
    }
    if (!email.includes('@')) {
      setErrorShown(true);
      toast.error('Please enter a valid email');
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Login successful! Welcome back to RecipeHunt!');
      navigate('/home');
    } catch (error) {
      toast.error(mapFirebaseError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      await googleLogin();
      navigate('/home');
    } catch (error) {
      toast.error(mapFirebaseError(error, 'Google sign-in failed. Please try again.'));
    }
  };

  return (
    <div className="login-container">
      <div className="login-illustration">
        <h1 className="brand-name">🍲 RecipeHunt</h1>
        <p className="tagline">Discover. Cook. Enjoy.</p>
      </div>
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login to Continue</h2>
        <div className={`input-box ${errorShown && !validateEmail ? 'error' : ''}`}>
          <label>Email</label>
          <input
            type="email"
            className="with-icon email-icon"
            placeholder="Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorShown && !validateEmail) setErrorShown(false);
            }}
          />
          {errorShown && !validateEmail && (
            <span className="tooltip">Must include '@'</span>
          )}
        </div>
        <div className={`input-box ${errorShown && password === '' ? 'error' : ''}`}>
          <label>Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            className="with-icon lock-icon"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
          {errorShown && password === '' && (
            <span className="tooltip">Password required</span>
          )}
        </div>
        <div className="checkbox-wrapper">
          <input
            type="checkbox"
            id="agree"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <label htmlFor="agree">I accept the Terms & Conditions</label>
        </div>
        <div className="button-wrapper">
          <button
            ref={btnRef}
            className="login-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
          </button>
          <button type="button" className="login-btn" onClick={handleGoogle} aria-label="Sign in with Google" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', color: '#444', border: '1px solid #dadce0', width: '100%' }}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C33.64,6.053,29.082,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C33.64,6.053,29.082,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/><path fill="#4CAF50" d="M24,44c5.176,0,9.86-1.977,13.409-5.2l-6.192-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.49,5.004C9.486,39.556,16.103,44,24,44z"/><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-3.221,0-6.152-1.229-8.205-3.221l-6.49,5.004 C9.486,39.556,16.103,44,24,44c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/></svg>
            Continue with Google
          </button>
        </div>
        <p className="register-link">
          Don’t have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
