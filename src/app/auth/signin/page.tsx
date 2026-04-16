'use client';

import { signIn } from 'next-auth/react'; // v5 compatible
import { useRouter } from 'next/navigation';
import { useState, FormEvent, useRef, useEffect } from 'react';
import '../auth.css';

/** The sign in page. */
const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // Load saved email if "Remember me" was checked before
  useEffect(() => {
    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail && emailRef.current) {
      emailRef.current.value = savedEmail;
    }
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const email = emailRef.current?.value || '';
    const password = passwordRef.current?.value || '';

    // Basic validation
    if (!email || !password) {
      setError('Please enter both email and password');
      setIsLoading(false);
      return;
    }

    // Save email if remember me is checked
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
      setIsLoading(false);
    } else if (result?.ok) {
      // Success - redirect to list page
      router.push('/list');
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
