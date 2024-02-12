import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const login = (role, email) => {
    setLoggedIn(true);
    setUserRole(role);
    setUserEmail(email);
  };

  const logout = () => {
    setLoggedIn(false);
    setUserRole('');
    setUserEmail('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userRole, userEmail, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};