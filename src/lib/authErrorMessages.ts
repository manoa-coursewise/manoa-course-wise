export const getAuthErrorMessage = (code?: string | null) => {
  switch (code) {
    case 'EMAIL_EXISTS':
      return 'That email is already registered. Try signing in or use a different email.';
    case 'INVALID_CREDENTIALS':
    case 'CredentialsSignin':
      return 'Invalid email or password.';
    case 'MISSING_CURRENT_PASSWORD':
      return 'Please enter your current password.';
    case 'CURRENT_PASSWORD_INCORRECT':
      return 'Current password is incorrect.';
    case 'USER_NOT_FOUND':
      return 'No account was found for this user.';
    case 'NEW_PASSWORD_SAME_AS_OLD':
      return 'New password must be different from your current password.';
    case 'Configuration':
    case 'MissingSecret':
    case 'CallbackRouteError':
      return 'Authentication service is not configured correctly. Please contact support.';
    case 'DB_UNREACHABLE':
      return 'Cannot reach the database right now. Please try again shortly.';
    case 'DB_AUTH_FAILED':
    case 'DB_ACCESS_DENIED':
      return 'Server database credentials are invalid. Please contact support.';
    case 'NETWORK_ERROR':
      return 'Network error while contacting the server. Please try again.';
    case 'UNKNOWN':
    default:
      return 'An unexpected authentication error occurred. Please try again.';
  }
};
