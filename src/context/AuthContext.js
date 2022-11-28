import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext({
  currentUser: null,
  login: () => {},
  logout: () => {},
});

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    localStorage.getItem("user")
      ? JSON.parse(localStorage.getItem("user"))
      : null
  );

  const login = async (inputs) => {
    const res = await axios.post(
      "https://tic-tac-toe-app-mutliplayers.herokuapp.com/api/auth/login",
      inputs
    );
    setCurrentUser(res.data);
  };
  const logout = () => {
    setCurrentUser(null);
  };
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);
  return (
    <AuthContext.Provider value={{ login, logout, currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
