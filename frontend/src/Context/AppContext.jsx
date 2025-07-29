import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );
  const [profileName, setProfileName] = useState("");

  const backendUrl = import.meta.env.VITE_BACKEND_URI;

  const value = {
    token,
    setToken,
    backendUrl,
    profileName,
    setProfileName,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;
