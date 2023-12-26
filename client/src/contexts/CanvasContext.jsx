import { createContext } from "react";

export const CanavasContext = createContext({});

export const CanvasContextProvider = ({ children }) => {
  const value = {};
  return (
    <CanavasContext.Provider value={value}>{children}</CanavasContext.Provider>
  );
};
