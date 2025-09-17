import React, { useEffect, useMemo, useState } from "react";
import "../style/register.css";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '../contexts/AuthContext.jsx';
import { mapFirebaseError } from '../utils/firebaseErrorMessages';
import EmailVerificationOverlay from '../components/EmailVerificationOverlay.jsx';

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showVerify, setShowVerify] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const navigate = useNavigate();
  const { signup, resendVerification, user } = useAuth();

  const schema = useMemo(() => z.object({
    email: z.string().email('Please enter a valid email address'),
    username: z.string().min(3, 'Username must be at least 3 characters long'),
    password: z.string().min(8, 'Password must be at least 8 characters long'),
    confirmPassword: z.string(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  }), []);

  const { register, handleSubmit, formState: { errors }, setFocus, watch } = useForm({
    resolver: zodResolver(schema),
    mode: 'onSubmit',
  });

  const passwordValue = watch('password') || '';
  const strength = passwordValue.length >= 12 ? 'strong' : passwordValue.length >= 8 ? 'medium' : passwordValue ? 'weak' : '';

  const onSubmit = async (form) => {
    setLoading(true);
    try {
      await signup(form.email, form.password, { displayName: form.username });
      setEmail(form.email);
      setUsername(form.username);
      setShowVerify(true);
    } catch (error) {
      setGlobalError(mapFirebaseError(error, 'Registration failed. Please try again.'));
      if (errors.email) setFocus('email'); else if (errors.username) setFocus('username'); else setFocus('password');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    return (
      <>
        <div className={`input-box ${errors.email ? 'error' : ''}`}>
          <label>Email</label>
          <input
            type="email"
            {...register('email')}
            placeholder="Enter your email"
          />
          {errors.email && <span className="tooltip" role="alert">{errors.email.message}</span>}
        </div>
        
        <div className={`input-box ${errors.username ? 'error' : ''}`}>
          <label>Username</label>
          <input
            type="text"
            {...register('username')}
            placeholder="Choose a username"
          />
          {errors.username && <span className="tooltip" role="alert">{errors.username.message}</span>}
        </div>
        
        <div className={`input-box ${errors.password ? 'error' : ''}`}>
          <label>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register('password')}
            placeholder="Create a password"
          />
          <span
            className="show-hide-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? "Hide" : "Show"}
          </span>
          {errors.password && <span className="tooltip" role="alert">{errors.password.message}</span>}
          {strength && (
            <div className="password-strength" aria-live="polite" style={{ marginTop: 6 }}>
              <div style={{ height: 6, background: strength==='strong'? '#16a34a': strength==='medium'? '#f59e0b': '#ef4444', width: strength==='strong'? '100%': strength==='medium'? '66%':'33%', transition: 'width .3s' }} />
              <small>{strength.charAt(0).toUpperCase() + strength.slice(1)} password</small>
            </div>
          )}
        </div>
        
        <div className={`input-box ${errors.confirmPassword ? 'error' : ''}`}>
          <label>Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register('confirmPassword')}
            placeholder="Confirm your password"
          />
          <span
            className="show-hide-toggle"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "Hide" : "Show"}
          </span>
          {errors.confirmPassword && <span className="tooltip" role="alert">{errors.confirmPassword.message}</span>}
        </div>
      </>
    );
  };

  return (
    <div className="register-container">
      <div className="register-illustration">
        <h1 className="brand-name">RecipeHunt</h1>
        <p className="tagline">Cook, Create & Share your favorite dishes!</p>
      </div>
      <form className="register-form" onSubmit={handleSubmit(onSubmit)} aria-live="polite">
        <h2>Create Account</h2>
        {renderForm()}
        {!!globalError && <span className="tooltip" role="alert">{globalError}</span>}
        <button
          type="submit"
          className="register-btn"
          disabled={loading}
        >
          {loading ? "Creating Account..." : "Register"}
        </button>
        <div className="login-link">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </form>
      {showVerify && (
        <EmailVerificationOverlay email={email} onClose={() => navigate('/')} onResend={resendVerification} />
      )}
    </div>
  );
};

export default Register;
