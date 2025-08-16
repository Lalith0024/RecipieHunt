import React, { useState, useEffect } from "react";
import "../style/register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

const Register = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Clear errors when step changes
  useEffect(() => {
    setErrors({});
  }, [step]);

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    if (currentStep === 1) {
      if (!email) {
        newErrors.email = 'Email is required';
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else if (currentStep === 2) {
      if (!username) {
        newErrors.username = 'Username is required';
      } else if (username.length < 3) {
        newErrors.username = 'Username must be at least 3 characters long';
      } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        newErrors.username = 'Username can only contain letters, numbers, and underscores';
      }
    } else if (currentStep === 3) {
      if (!password) {
        newErrors.password = 'Password is required';
      } else if (password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters long';
      } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
        newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      }
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (password !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    if (step === 1) {
      if (validateStep(1)) {
        setStep(2);
      }
    } else if (step === 2) {
      if (validateStep(2)) {
        setStep(3);
      }
    } else if (step === 3) {
      if (validateStep(3)) {
        await handleRegister();
      }
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Store additional user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: email,
        username: username,
        createdAt: new Date().toISOString(),
        profileComplete: false
      });
      
      toast.success('Registration successful! Welcome to RecipeHunt!');
      navigate('/home');
    } catch (error) {
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'An account with this email already exists. Please login instead.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please choose a stronger password.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return (
        <div className={`input-box ${errors.email ? 'error' : ''}`}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {errors.email && <span className="tooltip">{errors.email}</span>}
        </div>
      );
    } else if (step === 2) {
      return (
        <div className={`input-box ${errors.username ? 'error' : ''}`}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Choose a username"
          />
          {errors.username && <span className="tooltip">{errors.username}</span>}
        </div>
      );
    } else if (step === 3) {
      return (
        <>
          <div className={`input-box ${errors.password ? 'error' : ''}`}>
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
            />
            <span
              className="show-hide-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </span>
            {errors.password && <span className="tooltip">{errors.password}</span>}
          </div>
          <div className={`input-box ${errors.confirmPassword ? 'error' : ''}`}>
            <label>Confirm Password</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
            />
            <span
              className="show-hide-toggle"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </span>
            {errors.confirmPassword && <span className="tooltip">{errors.confirmPassword}</span>}
          </div>
        </>
      );
    }
  };

  return (
    <div className="register-container">
      <div className="register-illustration">
        <h1 className="brand-name">RecipeHunt</h1>
        <p className="tagline">Cook, Create & Share your favorite dishes!</p>
      </div>
      <form className="register-form" onSubmit={(e) => e.preventDefault()} data-step={step}>
        <h2>Create Account</h2>
        {renderStep()}
        <button
          type="button"
          className="register-btn"
          onClick={handleNext}
          disabled={loading}
        >
          {loading ? "Creating Account..." : (step < 3 ? "Next →" : "Register")}
        </button>
        <div className="login-link">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register;
