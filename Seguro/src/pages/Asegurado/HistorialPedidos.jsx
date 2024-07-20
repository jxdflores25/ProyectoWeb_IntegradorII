import { NavLink, Route, Routes } from "react-router-dom";
import HistorialPendientes from "./HistorialPendientes";
import HistorialFinalizados from "./HistorialFinalizados";

export default function HistorialPedidos() {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Historial de Pedidos
      </h2>
      <div className="flex justify-evenly space-x-4 ">
        <button className="bg-celeste text-white py-2 px-4 rounded transform transition-transform duration-200 hover:scale-110">
          <NavLink to="Pendientes">Pendientes</NavLink>
        </button>
        <button className="bg-verde text-white py-2 px-4 rounded transform transition-transform duration-200 hover:scale-110">
          <NavLink to="Finalizados">Finalizados</NavLink>
        </button>
      </div>
      <div>
        <Routes>
          <Route path="Pendientes" element={<HistorialPendientes />} />
          <Route path="Finalizados" element={<HistorialFinalizados />} />
        </Routes>
      </div>
    </div>
  );
}
