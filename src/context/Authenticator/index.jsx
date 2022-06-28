import React, { useState, createContext } from "react";

import Spinner from "../../components/Spinner";

export const Context = createContext();

export const Authenticator = ({ children }) => {
  const [currentVersion, setCurrentVersion] = useState('v0.1.0');
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [loading,] = useState(false);

  return loading ? (
    <Spinner />
  ) : (
      <Context.Provider
        value={{
          currentVersion,
          setCurrentVersion,
          isLoggedIn,
          setIsLoggedIn
        }}
      >
        {children}
      </Context.Provider>
    );
};
