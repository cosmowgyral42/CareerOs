import { useEffect, useState } from 'react';

import {
  getCurrentUser,
  hasToken,
  removeToken,
} from '../services/api';

import AuthContext from './authContextValue';

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!hasToken()) {
        if (!cancelled) {
          setIsLoading(false);
        }

        return;
      }

      try {
        const currentUser = await getCurrentUser();

        if (!cancelled) {
          setUser(currentUser);
        }
      } catch {
        removeToken();

        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    restoreSession();

    return () => {
      cancelled = true;
    };
  }, []);

  function logout() {
    removeToken();
    setUser(null);
  }

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated: Boolean(user),
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
