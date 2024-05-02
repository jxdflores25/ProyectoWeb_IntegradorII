import ReactDOM from "react-dom/client";
import LandingPage from "./pages/LandingPage.jsx";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Register from "./pages/Register.jsx";
import Administrador from "./pages/Administrador/Administrador.jsx";
import Usuario from "./pages/Asegurado/Usuario.jsx";
import Repartidor from "./pages/Repartidor/Repartidor.jsx";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/Administrador" element={<Administrador />} />
      <Route path="/Asegurado/*" element={<Usuario />} />
      <Route path="/Repartidor" element={<Repartidor />} />
    </Routes>
  </BrowserRouter>
);
