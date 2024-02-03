import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  const login = (role) => {
    setLoggedIn(true);
    setUserRole(role);
  };

  const logout = () => {
    setLoggedIn(false);
    setUserRole('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};