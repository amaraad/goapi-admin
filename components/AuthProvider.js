import PropTypes from 'prop-types';
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const initialAuthState = {
    token: undefined,
  };

  const [authState, setAuthState] = useState(initialAuthState);

  useEffect(() => {
    if (localStorage.getItem('token') !== authState.token) {
      setAuthState({
        ...authState,
        token: localStorage.getItem('token'),
      });
    }
  }, [authState]);

  const signIn = (token) => {
    setAuthState({
      ...authState,
      token,
    });
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  };

  const setAuthToken = (token) => {
    setAuthState({
      ...authState,
      token
    });
  };

  const signOut = () => {
    setAuthState(initialAuthState);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };

  return (
    <AuthContext.Provider value={{ authState, setAuthToken, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.object,
};

const useAuth = () => useContext(AuthContext);

export { AuthProvider as default, useAuth };
