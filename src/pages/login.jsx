import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/login.css';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext.jsx';
import { mapFirebaseError } from '../utils/firebaseErrorMessages';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [globalError, setGlobalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const btnRef = useRef(null);

  const schema = z.object({
    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
  });

  const { register, handleSubmit, formState: { errors }, setFocus, watch } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  const emailValue = watch('email');
  const passwordValue = watch('password');
  const isFormValid = !!emailValue && !!passwordValue && agreed && !errors.email && !errors.password;

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
    } else {
      resetButtonPosition();
    }
  };

  const onSubmit = async (data) => {
    if (!agreed) {
      setGlobalError('You must accept terms to continue');
      setFocus('email');
      return;
    }
    setGlobalError('');
    setLoading(true);
    try {
      await login(data.email, data.password);
      navigate('/home');
    } catch (error) {
      setGlobalError(mapFirebaseError(error, 'Login failed. Please try again.'));
      if (errors.email) setFocus('email'); else setFocus('password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-illustration">
        <h1 className="brand-name">🍲 RecipeHunt</h1>
        <p className="tagline">Discover. Cook. Enjoy.</p>
      </div>
      <form className="login-form" onSubmit={handleSubmit(onSubmit)} aria-live="polite">
        <h2>Login to Continue</h2>
        <div className={`input-box ${errors.email ? 'error' : ''}`}>
          <label>Email</label>
          <input
            type="email"
            placeholder="example@gmail.com"
            {...register('email')}
          />
          {errors.email && (
            <span className="tooltip" role="alert">{errors.email.message}</span>
          )}
        </div>
        <div className={`input-box ${errors.password ? 'error' : ''}`}>
          <label>Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            {...register('password')}
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </span>
          {errors.password && (
            <span className="tooltip" role="alert">{errors.password.message}</span>
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
        {!!globalError && (
          <span className="tooltip" role="alert">{globalError}</span>
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
