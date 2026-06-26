// Components/Auth/Auth.jsx - Complete with Forgot Password

import React, { useState, useEffect } from 'react';
import { 
  auth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail
} from '../../firebase';
import ForgotPassword from './ForgotPassword';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Load remember me preference
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedRemember = localStorage.getItem('rememberMe');
    if (savedEmail && savedRemember === 'true') {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  // If showing forgot password, render that component
  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={() => setShowForgotPassword(false)} />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Set persistence based on remember me
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }

      // Save remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.setItem('rememberMe', 'false');
      }

      onAuthSuccess();
    } catch (err) {
      console.error('Auth error:', err);
      handleAuthError(err.code);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);

    try {
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Save user info
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', user.email);
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('userName', user.displayName || '');
        localStorage.setItem('userPhoto', user.photoURL || '');
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.setItem('rememberMe', 'false');
      }

      onAuthSuccess();
    } catch (err) {
      console.error('Google Sign-In error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Pop-up was blocked. Please allow pop-ups for this site.');
      } else {
        setError('Google Sign-In failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAuthError = (code) => {
    const errors = {
      'auth/user-not-found': 'No account found with this email',
      'auth/wrong-password': 'Incorrect password',
      'auth/email-already-in-use': 'Email already in use',
      'auth/invalid-email': 'Invalid email address',
      'auth/weak-password': 'Password is too weak',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.'
    };
    setError(errors[code] || 'Authentication failed. Please try again.');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">💰</div>
          <h1 className="auth-title">FinWise</h1>
          <p className="auth-subtitle">
            {isLogin ? 'Welcome back!' : 'Create your account'}
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="auth-form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={loading}
              required
            />
          </div>

          <div className="auth-form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              required
            />
          </div>

          {!isLogin && (
            <div className="auth-form-group">
              <label>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading}
                required
              />
            </div>
          )}

          <div className="auth-remember">
            <label className="remember-me">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={loading}
              />
              <span>Remember me</span>
            </label>
            {isLogin && (
              <button 
                type="button" 
                className="forgot-password"
                onClick={handleForgotPassword}
                disabled={loading}
              >
                Forgot password?
              </button>
            )}
          </div>

          <button 
            type="submit" 
            className={`auth-button ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <button 
          onClick={handleGoogleSignIn}
          className="google-btn"
          disabled={loading}
        >
          <svg className="google-icon" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
          </svg>
          Continue with Google
        </button>

        <div className="auth-footer">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <span className="auth-link" onClick={toggleMode}>
                Sign Up
              </span>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <span className="auth-link" onClick={toggleMode}>
                Sign In
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;