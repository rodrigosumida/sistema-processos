import React from "react";
import { Route, Routes } from "react-router-dom";

import Tabela from "../pages/Tabela";

import Page404 from "../pages/Page404";
import Graficos from "../pages/Graficos";
import Responsavel from "../pages/Responsavel";
import Cargo from "../pages/Cargo";
import Area from "../pages/Area";

export default function Routess() {
  return (
    <Routes>
      <Route path="/" element={<Tabela />} />
      <Route path="/graficos" element={<Graficos />} />
      <Route path="/responsavel" element={<Responsavel />} />
      <Route path="/cargo" element={<Cargo />} />
      <Route path="/area" element={<Area />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
