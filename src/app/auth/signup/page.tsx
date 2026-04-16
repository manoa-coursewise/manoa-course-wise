'use client';

import { signIn } from 'next-auth/react'; // v5 compatible
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import * as Yup from 'yup';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/dbActions';
import '../auth.css';
import { getAuthErrorMessage } from '@/lib/authErrorMessages';

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

/** The sign up page. */
const SignUp = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    email: Yup.string().required('Email is required').email('Email is invalid'),
    password: Yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Confirm Password does not match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SignUpForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: SignUpForm) => {
    try {
      setIsLoading(true);
      setError('');

      // Create the user
      await createUser(data);

      // Sign in after successful creation
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        setError(`Account created, but sign in failed: ${getAuthErrorMessage(result.error)}`);
        setIsLoading(false);
      } else if (result?.ok) {
        // Redirect to add page
        router.push('/add');
      } else {
        setError(getAuthErrorMessage('UNKNOWN'));
        setIsLoading(false);
      }
    } catch (err: unknown) {
      const errorCode = err instanceof Error ? err.message : 'UNKNOWN';
      setError(getAuthErrorMessage(errorCode));
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-container">
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-card-title">Create Account</h1>
            <p className="auth-card-subtitle">Join Mānoa CourseWise today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '30px' }}>
            {error && <div className="auth-error-alert">{error}</div>}

            <div className="auth-form-group">
              <label className="auth-form-label">Email Address</label>
              <input
                type="email"
                {...register('email')}
                className={`auth-form-input ${errors.email ? 'is-invalid' : ''}`}
                placeholder="you@example.com"
                disabled={isLoading}
                autoComplete="email"
              />
              {errors.email && (
                <span className="auth-error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Password</label>
              <input
                type="password"
                {...register('password')}
                className={`auth-form-input ${errors.password ? 'is-invalid' : ''}`}
                placeholder="Min. 6 characters"
                disabled={isLoading}
                autoComplete="new-password"
              />
              {errors.password && (
                <span className="auth-error-message">{errors.password.message}</span>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">Confirm Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className={`auth-form-input ${
                  errors.confirmPassword ? 'is-invalid' : ''
                }`}
                placeholder="Re-enter your password"
                disabled={isLoading}
                autoComplete="new-password"
              />
              {errors.confirmPassword && (
                <span className="auth-error-message">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
              <button
                type="submit"
                className="auth-submit-button"
                style={{ flex: 1 }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="auth-spinner" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
                  setError('');
                }}
                className="auth-submit-button"
                style={{
                  flex: 1,
                  backgroundColor: '#999',
                }}
                disabled={isLoading}
              >
                Clear
              </button>
            </div>
          </form>

          <div className="auth-card-footer">
            Already have an account?{' '}
            <a href="/auth/signin" className="auth-link">
              Sign in
            </a>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SignUp;
