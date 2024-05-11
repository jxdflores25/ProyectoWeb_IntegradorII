import { Route, Routes } from "react-router-dom";
import { GetAdministrador } from "../../API/API_Seguro";
import { useEffect, useState } from "react";
import NavbarAdmin from "../../components/Administrador/NavbarAdmin";
import AsignarReceta from "./AsignarReceta";
import Asegurado from "./CRUDAsegurado";
import Conductor from "./CRUDConductor";
import PedidosListar from "./PedidosListar";

const Administrador = () => {
  const [Administrador, setAdministrador] = useState({
    nombre: "Usuario",
    apellido: "",
  });

  useEffect(() => {
    const Administrador = async () => {
      const data = await GetAdministrador(localStorage.getItem("usuario"));
      setAdministrador(data.data);
    };
    Administrador();
  }, []);

  return (
    <div className="h-full">
      <NavbarAdmin />

      <div className="flex flex-col items-center mt-2 lg:mt-5">
        <h1 className="text-4xl sm:text-6xl lg:text-2xl text-center tracking-wide text-verde">
          Bienvenido Administrador: &nbsp;
          <span className="bg-gradient-to-r from-verde to-celeste text-transparent bg-clip-text">
            {Administrador.nombre + " " + Administrador.apellido}
          </span>
        </h1>
      </div>
      <Routes>
        <Route path="" element={<AsignarReceta />} />
        <Route path="Asegurado" element={<Asegurado />} />
        <Route path="Conductor" element={<Conductor />} />
        <Route path="Pedidos" element={<PedidosListar />} />
      </Routes>
    </div>
  );
};
export default Administrador;
