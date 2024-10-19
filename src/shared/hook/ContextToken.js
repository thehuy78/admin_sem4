import { jwtDecode } from 'jwt-decode';
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useCookies } from 'react-cookie';
const AdminContext = createContext();

export const ContextToken = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [cookie,] = useCookies(["authorize_token_admin"]);
  useEffect(() => {
    if (cookie.authorize_token_admin) {
      setToken(cookie.authorize_token_admin)
      setUser(jwtDecode(cookie.authorize_token_admin))
    }
  }, [cookie]);


  return (
    <AdminContext.Provider value={{ token, user }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  return useContext(AdminContext);
};


