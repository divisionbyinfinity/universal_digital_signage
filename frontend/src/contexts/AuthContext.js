import { createContext, useContext, useState, useEffect } from 'react';
import { heartbeatapi } from '../apis/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  useEffect(() => {
    // Check for a user in localStorage on component mount (page load)
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      // Call heartbeat API initially
      checkTokenValidity(storedUser.token);
    }
  }, []);

  // Function to check token validity
  const checkTokenValidity = (token) => {
    heartbeatapi(token)
      .then((data) => {
        if (!data || !data.success) {
          setUser(null);
          localStorage.removeItem('user');
        }
      })
      .catch((error) => {
        console.error('Error checking token validity:', error);
      });
  };

  // Set up interval to periodically check token validity
  useEffect(() => {
    const interval = setInterval(() => {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        checkTokenValidity(storedUser.token);
      }
    }, 60000); // Check every 1 minute

    // Clear interval on component unmount
    return () => clearInterval(interval);
  }, []);

  const setUserData = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logoutUser = () => {
    setUser(null);
    localStorage.removeItem('user');
      localStorage.removeItem('playlists');
      localStorage.removeItem('departments');
      localStorage.removeItem('groups');
      localStorage.removeItem('users');
      localStorage.removeItem('hosts');
  };

  return (
    <AuthContext.Provider value={{ user, setUserData, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
