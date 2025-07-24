import React, { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import Tabela from "../pages/Tabela";

import Page404 from "../pages/Page404";
import Graficos from "../pages/Graficos";
import Responsavel from "../pages/Responsavel";
import Cargo from "../pages/Cargo";
import Area from "../pages/Area";
import Login from "../pages/Login";
import api from "../api/axios";

export default function Routess() {
  function RequireAuth({ children }) {
    const [isValid, setIsValid] = useState(null);

    useEffect(() => {
      async function validate() {
        try {
          await api.get("/user/me");
          setIsValid(true);
        } catch (err) {
          setIsValid(false);
        }
      }
      validate();
    }, []);

    if (isValid === null) return <div>Carregando...</div>;
    if (!isValid) return <Navigate to="/login" />;
    return children;
  }

  function AlreadyLogged({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(null);

    useEffect(() => {
      async function checkAuth() {
        try {
          await api.get("/user/me");
          setIsLoggedIn(true);
        } catch {
          setIsLoggedIn(false);
        }
      }

      checkAuth();
    }, []);

    if (isLoggedIn === null) return <div>Carregando...</div>;
    if (isLoggedIn) return <Navigate to="/" />;

    return children;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <RequireAuth>
            <Tabela />
          </RequireAuth>
        }
      />
      <Route
        path="/graficos"
        element={
          <RequireAuth>
            <Graficos />
          </RequireAuth>
        }
      />
      <Route
        path="/responsavel"
        element={
          <RequireAuth>
            <Responsavel />
          </RequireAuth>
        }
      />
      <Route
        path="/cargo"
        element={
          <RequireAuth>
            <Cargo />
          </RequireAuth>
        }
      />
      <Route
        path="/area"
        element={
          <RequireAuth>
            <Area />
          </RequireAuth>
        }
      />

      <Route
        path="/login"
        element={
          <AlreadyLogged>
            <Login />
          </AlreadyLogged>
        }
      />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
