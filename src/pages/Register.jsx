import React, { useMemo, useState } from "react";
import "../styles/Register.css";
import { Link, useNavigate } from "react-router-dom";
import useAuth from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { mapFirebaseError } from '../utils/firebaseErrorMessages';
import useSEO from '../hooks/useSEO';

const Register = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const navigate = useNavigate();
  const { user, signup, googleLogin } = useAuth();

  useSEO("Register", "Join RecipeHunt today to start your culinary journey and save amazing recipes.");

  // Prevent logged-in users from seeing the register page
  React.useEffect(() => {
    if (user) navigate('/home');
  }, [user, navigate]);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!email.includes('@')) newErrors.email = 'Please enter a valid email address';
    if (!username) newErrors.username = 'Username is required';
    else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters long';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters long';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await signup(email, password, { displayName: username });
      toast.success('Registration successful! Welcome to RecipeHunt!');
      navigate('/home');
    } catch (error) {
      toast.error(mapFirebaseError(error, 'Registration failed. Please try again.'));
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

  const currentStepValid = useMemo(() => {
    if (step === 0) return email && email.includes('@');
    if (step === 1) return username && username.length >= 3;
    if (step === 2) return password && password.length >= 6;
    if (step === 3) return confirmPassword && confirmPassword === password;
    return false;
  }, [step, email, username, password, confirmPassword]);

  const renderForm = () => {
    return (
      <>
        {step === 0 && (
          <div className={`input-box ${errors.email ? 'error' : ''}`}>
            <label>Email</label>
            <input
              type="email"
              className="with-icon email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors({ ...errors, email: '' });
              }}
              placeholder="Email"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (currentStepValid) setStep(1); } }}
            />
            {errors.email && <span className="tooltip">{errors.email}</span>}
          </div>
        )}
        {step === 1 && (
          <div className={`input-box ${errors.username ? 'error' : ''}`}>
            <label>Username</label>
            <input
              type="text"
              className="with-icon"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                if (errors.username) setErrors({ ...errors, username: '' });
              }}
              placeholder="Username"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (currentStepValid) setStep(2); } }}
            />
            {errors.username && <span className="tooltip">{errors.username}</span>}
          </div>
        )}
        {step === 2 && (
          <div className={`input-box ${errors.password ? 'error' : ''}`}>
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              className="with-icon lock"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              placeholder="Password"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (currentStepValid) setStep(3); } }}
            />
            <span
              className="show-hide-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && <span className="tooltip">{errors.password}</span>}
          </div>
        )}
        {step === 3 && (
          <div className={`input-box ${errors.confirmPassword ? 'error' : ''}`}>
            <label>Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              className="with-icon lock"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
              }}
              placeholder="Confirm password"
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); if (currentStepValid) handleSubmit(e); } }}
            />
            <span
              className="show-hide-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
            {errors.confirmPassword && <span className="tooltip">{errors.confirmPassword}</span>}
          </div>
        )}
      </>
    );
  };

  return (
    <div className="register-container">
      <div className="register-illustration">
        <h1 className="brand-name">RecipeHunt</h1>
        <p className="tagline">Cook, Create & Share your favorite dishes!</p>
      </div>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="register-header">
          {step > 0 && (
            <button
              type="button"
              className="back-arrow-btn"
              onClick={() => setStep(Math.max(0, step - 1))}
              aria-label="Go back"
            >
              ←
            </button>
          )}
          <h2>Create Account</h2>
        </div>

        <div className="step-tracker">
          <div className="step-track"><div className="step-progress" style={{ width: `${((step + 1) / 4) * 100}%` }} /></div>
          <div className="step-meta">Step {step + 1} of 4</div>
        </div>
        {renderForm()}
        <div className="button-wrapper" style={{ marginTop: 8 }}>
          {step < 3 ? (
            <button type="button" className="register-btn" onClick={() => setStep((s) => Math.min(3, s + 1))} disabled={!currentStepValid || loading}>Continue</button>
          ) : (
            <button type="submit" className="register-btn" disabled={loading || !currentStepValid}>{loading ? "Creating Account..." : "Create account"}</button>
          )}
          <button type="button" className="register-btn" onClick={handleGoogle} aria-label="Sign up with Google" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#fff', color: '#444', border: '1px solid #dadce0', width: '100%' }}>
            <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true"><path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C33.64,6.053,29.082,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C33.64,6.053,29.082,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" /><path fill="#4CAF50" d="M24,44c5.176,0,9.86-1.977,13.409-5.2l-6.192-5.238C29.211,35.091,26.715,36,24,36 c-5.202,0-9.619-3.317-11.283-7.946l-6.49,5.004C9.486,39.556,16.103,44,24,44z" /><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-3.221,0-6.152-1.229-8.205-3.221l-6.49,5.004 C9.486,39.556,16.103,44,24,44c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" /></svg>
            Continue with Google
          </button>
        </div>
        <div className="login-link">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
