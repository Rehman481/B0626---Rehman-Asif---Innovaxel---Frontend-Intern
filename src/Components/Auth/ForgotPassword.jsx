// Components/Auth/ForgotPassword.jsx

import React, { useState } from 'react';
import { auth, sendPasswordResetEmail } from '../../Firebase';
import './ForgotPassword.css';

const ForgotPassword = ({ onBackToLogin }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validate email
    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/login',
        handleCodeInApp: true
      });
      
      setSuccess('✅ Password reset email sent! Please check your inbox.');
      setEmailSent(true);
      setEmail('');
    } catch (err) {
      console.error('Password reset error:', err);
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email address');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/too-many-requests':
          setError('Too many requests. Please try again later.');
          break;
        default:
          setError('Failed to send reset email. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <button 
            className="back-button" 
            onClick={onBackToLogin}
            type="button"
          >
            ← Back to Login
          </button>
          <div className="forgot-icon">🔑</div>
          <h2>Reset Password</h2>
          <p className="forgot-subtitle">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div className="forgot-error">
            <span>⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div className="forgot-success">
            <span>✅</span>
            {success}
          </div>
        )}

        {!emailSent ? (
          <form onSubmit={handleSubmit} className="forgot-form">
            <div className="forgot-form-group">
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                disabled={loading}
                required
                autoFocus
              />
            </div>

            <button 
              type="submit" 
              className="forgot-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>
        ) : (
          <div className="forgot-resend-section">
            <p className="resend-text">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <button 
              className="resend-button"
              onClick={() => {
                setEmailSent(false);
                setSuccess('');
                setError('');
              }}
              type="button"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="forgot-footer">
          <p>
            Remember your password?{' '}
            <button 
              className="forgot-link" 
              onClick={onBackToLogin}
              type="button"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;