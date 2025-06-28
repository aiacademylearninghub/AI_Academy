import { useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useLocation } from 'react-router-dom';
import { shouldRefreshSession } from '../utils/apiUtils';

/**
 * Hook that refreshes the token if it's close to expiring
 * Use this in your App component to refresh tokens automatically
 */
export const useTokenRefresh = () => {
  const { tokenExpiry, refreshSession, isAuthenticated } = useAuth();
  const location = useLocation();

  useEffect(() => {
    // If authenticated and token should be refreshed, refresh it
    if (isAuthenticated && shouldRefreshSession(tokenExpiry)) {
      refreshSession();
    }
  }, [location.pathname, isAuthenticated, tokenExpiry, refreshSession]);
};
