import React, { createContext, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setUser as setReduxUser, clearUser } from '../features/UserSlice.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { user, token, isAuthenticated } = useSelector((state) => state.user);

  const login = (userData, userToken) => {
    localStorage.setItem('token', userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('xtreme_admin_token', userToken);
    localStorage.setItem('xtreme_admin_user', JSON.stringify(userData));
    dispatch(setReduxUser({ user: userData, token: userToken }));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('xtreme_admin_token');
    localStorage.removeItem('xtreme_admin_user');
    dispatch(clearUser());
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
