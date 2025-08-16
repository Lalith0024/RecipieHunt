import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/login.css';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorShown, setErrorShown] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef(null);

  const validateEmail = email.includes('@');
  const isFormValid = validateEmail && password.length > 0 && agreed;

  const shiftClasses = ['shift-left', 'shift-right', 'shift-top', 'shift-bottom'];

  const resetButtonPosition = () => {
    shiftClasses.forEach(cls => btnRef.current?.classList.remove(cls));
  };

  const handleHover = () => {
    if (!isFormValid) {
      const currentClass = shiftClasses.find(cls => btnRef.current.classList.contains(cls));
      const nextClass =
        shiftClasses[(shiftClasses.indexOf(currentClass) + 1) % shiftClasses.length];
      shiftClasses.forEach(cls => btnRef.current.classList.remove(cls));
      btnRef.current.classList.add(nextClass);
      setErrorShown(true);
    } else {
      resetButtonPosition();
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (isFormValid) {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
        resetButtonPosition();
        toast.success('Login successful! Welcome back to RecipeHunt!');
        navigate('/home');
      } catch (error) {
        let errorMessage = 'Login failed. Please try again.';
        
        if (error.code === 'auth/user-not-found') {
          errorMessage = 'No account found with this email. Please register first.';
        } else if (error.code === 'auth/wrong-password') {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/invalid-email') {
          errorMessage = 'Please enter a valid email address.';
        } else if (error.code === 'auth/too-many-requests') {
          errorMessage = 'Too many failed attempts. Please try again later.';
        }
        
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      setErrorShown(true);
      toast.error('Please fill all fields correctly');
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
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errorShown && !validateEmail && (
            <span className="tooltip">Must include '@'</span>
          )}
        </div>
        <div className={`input-box ${errorShown && password === '' ? 'error' : ''}`}>
          <label>Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
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
        {errorShown && !agreed && (
          <span className="tooltip">You must accept terms to continue</span>
        )}
        <div className="button-wrapper">
          <button
            ref={btnRef}
            className="login-btn"
            type="submit"
            onMouseEnter={handleHover}
            disabled={loading}
          >
            {loading ? "Logging In..." : "Log In"}
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
