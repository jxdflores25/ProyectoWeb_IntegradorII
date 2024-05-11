
import { Navigate, Route, Routes } from "react-router-dom";
import { GetAdministrador } from "../../API/API_Seguro";
import { useEffect, useState } from "react";
import NavbarAdmin from "../../components/Administrador/NavbarAdmin";
import AsignarReceta from "./AsignarReceta";
import Asegurado from "./CRUDAsegurado";
import Conductor from "./CRUDConductor";


const Administrador = () => {
  const [asegurados, setAsegurados] = useState([
    { nombre: "John Doe", telefono: "123-456-7890" },
    { nombre: "Jane Doe", telefono: "987-654-3210" },
    { nombre: "Gary Barlow", telefono: "555-555-5555" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const toggleModal = () => {
    // Limpiar los campos solo si no estamos editando
  if (editIndex === null) {
    setNombre("");
    setApellido("");
    setDireccion("");
    setTelefono("");
  }
  setModalOpen(!modalOpen);
};



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
      </Routes>

    </div>
  );
};
export default Administrador;
