import { useEffect, useCallback } from "react";
import { useAuth } from "../contexts/useAuth";

interface UseSessionTimeoutOptions {
  /**
   * Time in milliseconds before the session is considered idle
   * Default is 30 minutes
   */
  idleTimeout?: number;
  
  /**
   * Whether to auto-refresh the session when user activity is detected
   */
  autoRefresh?: boolean;
}

/**
 * Hook to handle session timeout
 * - Logs user out after a period of inactivity
 * - Optionally refreshes the session token on user activity
 */
export const useSessionTimeout = (options: UseSessionTimeoutOptions = {}) => {
  const { idleTimeout = 30 * 60 * 1000, autoRefresh = true } = options;
  const { logout, refreshSession, isAuthenticated, tokenExpiry } = useAuth();

  // Function to check if token is expired
  const checkTokenExpiry = useCallback(() => {
    if (!tokenExpiry) return;
    
    const isExpired = Date.now() > tokenExpiry;
    
    if (isExpired && isAuthenticated) {
      logout();
    }
  }, [tokenExpiry, isAuthenticated, logout]);

  // Set up auto logout after idle timeout
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check token expiry initially
    checkTokenExpiry();
    
    let idleTimer: number;
    
    // Reset the timer on user activity
    const resetIdleTimer = () => {
      window.clearTimeout(idleTimer);
      
      // If auto-refresh is enabled, refresh the session on user activity
      if (autoRefresh && isAuthenticated) {
        refreshSession();
      }
      
      // Set up new timer
      idleTimer = window.setTimeout(() => {
        checkTokenExpiry();
      }, idleTimeout);
    };
    
    // Set initial timer
    resetIdleTimer();
    
    // Events that indicate user activity
    const activityEvents = [
      'mousedown', 'mousemove', 'keypress',
      'scroll', 'touchstart', 'click', 'keydown'
    ];
    
    // Add event listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, resetIdleTimer);
    });
    
    // Clean up
    return () => {
      window.clearTimeout(idleTimer);
      activityEvents.forEach(event => {
        window.removeEventListener(event, resetIdleTimer);
      });
    };
  }, [isAuthenticated, checkTokenExpiry, idleTimeout, autoRefresh, refreshSession]);
};
