import React, { useEffect, useMemo, useState, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import UsersPage from "./pages/UsersPage";
import HomePage from "./pages/HomePage";

// Autor: Juan Rodriguez


export default function App() {
  return (

    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/usuarios"
          element={<PrivateRoute>
            <UsersPage />
          </PrivateRoute>} />
        <Route
          path="/HomePage"
          element={<PrivateRoute>
            <HomePage />
          </PrivateRoute>} />
        <Route path="/" element={<Navigate to="/HomePage" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}
