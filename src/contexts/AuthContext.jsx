// // src/contexts/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from 'react';
// import axios from 'axios';

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//     const [currentUser, setCurrentUser] = useState(null);
//     const [loading, setLoading] = useState(true);

//     // Check if user is logged in on page load
//     useEffect(() => {
//         const checkLoggedIn = async () => {
//             const accessToken = localStorage.getItem('accessToken');

//             if (accessToken) {
//                 try {
//                     // Just set authenticated to true if token exists
//                     setCurrentUser(true);
//                 } catch (error) {
//                     // Token invalid, clear storage
//                     localStorage.removeItem('accessToken');
//                     localStorage.removeItem('refreshToken');
//                 }
//             }

//             setLoading(false);
//         };

//         checkLoggedIn();
//     }, []);

//     const login = async (username, password) => {
//         try {
//             const response = await axios.post(
//                 "https://backend.app20.in/api/token/",
//                 new URLSearchParams({ username, password }),
//                 {
//                     headers: {
//                         "Content-Type": "application/x-www-form-urlencoded",
//                     },
//                     withCredentials: true,
//                 }
//             );

//             localStorage.setItem('accessToken', response.data.access);
//             localStorage.setItem('refreshToken', response.data.refresh);

//             axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
//             setCurrentUser(true);

//             return true;
//         } catch (error) {
//             return false;
//         }
//     };

//     const logout = () => {
//         localStorage.removeItem('accessToken');
//         localStorage.removeItem('refreshToken');
//         delete axios.defaults.headers.common['Authorization'];
//         setCurrentUser(null);
//     };

//     const value = {
//         currentUser,
//         login,
//         logout,
//         isAuthenticated: !!currentUser
//     };

//     return (
//         <AuthContext.Provider value={value}>
//             {!loading && children}
//         </AuthContext.Provider>
//     );
// };

// export const useAuth = () => {
//     return useContext(AuthContext);
// };

// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on page load
  useEffect(() => {
    const checkLoggedIn = async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (accessToken) {
        setCurrentUser(true);
      }

      setLoading(false);
    };

    checkLoggedIn();
  }, []);

  const login = async (username, password) => {
    try {
      const response = await axios.post(
        "https://backend.app20.in/api/token/",
        { username, password }, // send JSON body
        {
          headers: {
            "Content-Type": "application/json", // match body format
          },
          withCredentials: true,
        }
      );

      localStorage.setItem("accessToken", response.data.access);
      localStorage.setItem("refreshToken", response.data.refresh);

      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access}`;
      setCurrentUser(true);

      return true;
    } catch (error) {
      console.error("Login failed:", error?.response?.data || error.message);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    delete axios.defaults.headers.common["Authorization"];
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
