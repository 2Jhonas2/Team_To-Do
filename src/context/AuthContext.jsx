import React, { createContext, useState } from "react";
import { toast } from "react-toastify";

// Autor: Juan Rodriguez
export const AuthContext = createContext();

const USERS = [
  { id: 1, username: "admin", password: "admin" },
  { id: 2, username: "Jhon", password: "Jhon123" },
  { id: 3, username: "Juan", password: "Juan123" }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (username, password) => {
    const found = USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setUser(found);
      toast.success("Login exitoso");
      return true;
    } else {
      toast.error("Credenciales incorrectas");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    toast.info("Sesión cerrada");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
