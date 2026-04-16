'use client';

import { useForm } from 'react-hook-form';
import { useSession } from 'next-auth/react'; // v5 compatible
import { yupResolver } from '@hookform/resolvers/yup';
import { useState } from 'react';
import * as Yup from 'yup';
import swal from 'sweetalert';
import { changePassword } from '@/lib/dbActions';
import LoadingSpinner from '@/components/LoadingSpinner';
import '../auth.css';
import { getAuthErrorMessage } from '@/lib/authErrorMessages';

type ChangePasswordForm = {
  oldpassword: string;
  password: string;
  confirmPassword: string;
};

/** The change password page. */
const ChangePassword = () => {
  const { data: session, status } = useSession();
  const email = session?.user?.email || '';
  const [isLoading, setIsLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    oldpassword: Yup.string().required('Current password is required'),
    password: Yup.string()
      .required('New password is required')
      .min(6, 'Password must be at least 6 characters')
      .max(40, 'Password must not exceed 40 characters'),
    confirmPassword: Yup.string()
      .required('Confirm Password is required')
      .oneOf([Yup.ref('password'), ''], 'Passwords do not match'),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: yupResolver(validationSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      setIsLoading(true);
      await changePassword({ email, ...data });
      await swal(
        'Success',
        'Your password has been changed successfully',
        'success',
        { timer: 2000 }
      );
      reset();
    } catch (error: unknown) {
      const errorCode = error instanceof Error ? error.message : 'UNKNOWN';
      await swal('Error', getAuthErrorMessage(errorCode), 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <LoadingSpinner />;
  }

  return (
    <main className="auth-container">
      <div className="auth-content">
        <div className="auth-card">
          <div className="auth-card-header">
            <h1 className="auth-card-title">Change Password</h1>
            <p className="auth-card-subtitle">Update your security settings</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ padding: '30px' }}>
            <div className="auth-form-group">
              <label className="auth-form-label">Current Password</label>
              <input
                type="password"
                {...register('oldpassword')}
                className={`auth-form-input ${errors.oldpassword ? 'is-invalid' : ''}`}
                placeholder="Enter your current password"
                disabled={isLoading}
                autoComplete="current-password"
              />
              {errors.oldpassword && (
                <span className="auth-error-message">{errors.oldpassword.message}</span>
              )}
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">New Password</label>
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
              <label className="auth-form-label">Confirm New Password</label>
              <input
                type="password"
                {...register('confirmPassword')}
                className={`auth-form-input ${
                  errors.confirmPassword ? 'is-invalid' : ''
                }`}
                placeholder="Re-enter your new password"
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
                    Updating...
                  </>
                ) : (
                  'Change Password'
                )}
              </button>
              <button
                type="button"
                onClick={() => {
                  reset();
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
        </div>
      </div>
    </main>
  );
};

export default ChangePassword;
