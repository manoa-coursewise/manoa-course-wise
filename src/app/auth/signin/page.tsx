'use client';

import { signIn } from 'next-auth/react'; // v5 compatible
import { useState, FormEvent, useRef, useEffect } from 'react';
import '../auth.css';
import { getAuthErrorMessage } from '@/lib/authErrorMessages';

/** The sign in page. */
const SignIn = () => {
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Load saved username if "Remember me" was checked before
  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername && usernameRef.current) {
      usernameRef.current.value = savedUsername;
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const email = emailRef.current?.value || '';
    const username = usernameRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    // Basic validation
    if ((!email && !username) || !password) {
      setError('Please enter email or username and password');
      setIsLoading(false);
      return;
    }

    // Save username if remember me is checked
    if (rememberMe) {
      localStorage.setItem('rememberedUsername', username || email);
    } else {
      localStorage.removeItem('rememberedUsername');
    }

    try {
      const result = await signIn('credentials', {
        email,
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(getAuthErrorMessage(result.error));
        setIsLoading(false);
      } else if (result?.ok) {
        // Use a full-page navigation to ensure the auth cookie/session is persisted
        // before protected server routes are requested (improves cross-browser stability).
        window.location.assign('/dashboard');
      } else {
        setError(getAuthErrorMessage('UNKNOWN'));
        setIsLoading(false);
      }
    } catch {
      setError(getAuthErrorMessage('NETWORK_ERROR'));
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-card-title">Sign In</h1>
            <p className="auth-card-subtitle">Welcome back to Mānoa CourseWise</p>
          </div>

          <form onSubmit={handleSubmit} style={{ padding: '30px' }}>
            {error && <div className="auth-error-alert">{error}</div>}

            <div className="auth-form-group">
              <label className="auth-form-label">Email Address</label>
              <input
                ref={emailRef}
                name="email"
                type="email"
                className="auth-form-input"
                placeholder="you@example.com"
                disabled={isLoading}
                autoComplete="email"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Username</label>
              <input
                ref={usernameRef}
                name="username"
                type="text"
                className="auth-form-input"
                placeholder="your_username"
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Password</label>
              <input
                ref={passwordRef}
                name="password"
                type="password"
                className="auth-form-input"
                placeholder="Enter your password"
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <div className="auth-checkbox-group">
              <input
                type="checkbox"
                id="rememberMe"
                className="auth-checkbox-input"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="rememberMe" className="auth-checkbox-label">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="auth-submit-button"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="auth-spinner" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="auth-card-footer">
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" className="auth-link">
              Sign up
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignIn;
