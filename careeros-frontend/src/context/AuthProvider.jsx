import { useEffect, useState } from 'react';

import {
  getCurrentUser,
  hasToken,
  removeToken,
} from '../services/api';

import AuthContext from './AuthContext';

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadCurrentUser() {
      if (!hasToken()) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error(
          'CareerOS authentication check failed:',
          error,
        );

        removeToken();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadCurrentUser();
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