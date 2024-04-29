import React from "react";
import ReactDOM from "react-dom/client";
import LandingPage from "./pages/LandingPage.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import Administrador from "./pages/Administrador.jsx";
import Usuario from "./pages/Usuario.jsx";
import Repartidor from "./pages/Repartidor.jsx";

import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <React.StrictMode>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/Administrador" element={<Administrador />} />
        <Route path="/Asegurado" element={<Usuario />} />
        <Route path="/Repartidor" element={<Repartidor />} />
      </Routes>
    </React.StrictMode>
  </BrowserRouter>
);
