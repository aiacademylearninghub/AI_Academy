import { useAuth } from "../contexts/useAuth";

/**
 * Hook that returns a fetch wrapper that handles authentication
 * - Adds authentication token to requests
 * - Refreshes token if expired
 * - Handles unauthorized responses
 */
export const useAuthenticatedFetch = () => {
  const { token, refreshSession, logout } = useAuth();

  /**
   * Wrapper around fetch that handles authentication
   */
  const authFetch = async (
    url: string,
    options: RequestInit = {}
  ): Promise<Response> => {
    // Clone the options to avoid mutating the original
    const fetchOptions = { ...options };
    
    // Set headers if not already set
    fetchOptions.headers = {
      ...(fetchOptions.headers || {}),
      "Content-Type": "application/json",
    };

    // Add auth token if available
    if (token) {
      fetchOptions.headers = {
        ...fetchOptions.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, fetchOptions);

      // If unauthorized, try to refresh token and retry
      if (response.status === 401) {
        const refreshed = await refreshSession();
        
        if (refreshed) {
          // Retry with new token
          return authFetch(url, options);
        } else {
          // Refresh failed, logout
          logout();
          throw new Error("Session expired. Please login again.");
        }
      }

      return response;
    } catch (error) {
      // Handle network errors, etc.
      console.error("API request failed:", error);
      throw error;
    }
  };

  return authFetch;
};

/**
 * Safely parse JSON from response with error handling
 */
export const parseJSON = async (response: Response) => {
  try {
    return await response.json();
  } catch (_error) {
    return null;
  }
};

/**
 * Check if a session should be refreshed (token will expire soon)
 * @param tokenExpiry Expiry timestamp
 * @param thresholdMinutes Minutes threshold before expiry to refresh
 */
export const shouldRefreshSession = (
  tokenExpiry: number | null,
  thresholdMinutes = 30
): boolean => {
  if (!tokenExpiry) return false;
  
  // Calculate the threshold time (current time + threshold minutes)
  const thresholdTime = Date.now() + thresholdMinutes * 60 * 1000;
  
  // If token will expire within the threshold, it should be refreshed
  return tokenExpiry < thresholdTime;
};
