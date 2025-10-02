import React, { createContext } from 'react';
import axios from 'axios';

const AxiosContext = createContext();

const AxiosProvider = ({ children }) => {
  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
  });

  return (
    <AxiosContext.Provider value={axiosInstance}>
      {children}
    </AxiosContext.Provider>
  );
};

export { AxiosContext, AxiosProvider };
