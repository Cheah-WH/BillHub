import React, { createContext, useState, useEffect } from 'react';
import { storeUserData, getUserData, removeUserData } from './storage';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const { token, user } = await getUserData();
      if (token && user) {
        setUser(user);
      }
    };
    loadUser();
  }, []);

  const login = async (userData) => {
    const defaultToken = "BillPayer";
    setUser(userData.user);
    await storeUserData(defaultToken, userData.user);
  };

  const logout = async () => {
    setUser(null);
    await removeUserData();
    console.log("Removing user data from AsyncStorage...");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
