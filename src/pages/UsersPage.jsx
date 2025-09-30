import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const UsersPage = () => {
  const { user } = useContext(AuthContext);
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Usuarios</h1>
      <p>Bienvenido, {user?.username}</p>
    </div>
  );
};

export default UsersPage;
