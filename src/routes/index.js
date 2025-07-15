import React from "react";
import { Route, Routes } from "react-router-dom";

import Tabela from "../pages/Tabela";

import Page404 from "../pages/Page404";

export default function Routess() {
  return (
    <Routes>
      <Route path="/" element={<Tabela />} />
      <Route path="*" element={<Page404 />} />
    </Routes>
  );
}
