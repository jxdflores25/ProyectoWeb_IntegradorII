import { Navigate, Route, Routes } from "react-router-dom";
import { GetAdministrador } from "../../API/API_Seguro";
import { useEffect, useState } from "react";
import NavbarAdmin from "../../components/Administrador/NavbarAdmin";
import AsignarReceta from "./AsignarReceta";
import RegistroAsegurado from "../Administrador/RegistroAsegurado";

const Administrador = () => {
  const [Administrador, setAdministrador] = useState({
    nombre: "Usuario",
    apellido: "",
  });

  useEffect(() => {
    const Datos = async (dni) => {
      const resp = await GetAdministrador(dni);
      setAdministrador(resp.data);
    };
    Datos(localStorage.getItem("usuario"));
  }, []);

  if (localStorage.getItem("tipo") !== "Administrador") {
    return <Navigate to="/" />;
  }

  return (
    <div className="h-full">
      <NavbarAdmin />
      <div className="flex flex-col items-center mt-2 lg:mt-5">
        <h1 className="text-4xl sm:text-6xl lg:text-2xl text-center tracking-wide">
          Bienvenido Administrador: &nbsp;
          <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
            {Administrador.nombre + " " + Administrador.apellido}
          </span>
        </h1>
      </div>
      <Routes>
        <Route path="" element={<AsignarReceta />} />
        <Route path="RegistroAsegurado" element={<RegistroAsegurado />} />
      </Routes>
    </div>
  );
};
export default Administrador;
