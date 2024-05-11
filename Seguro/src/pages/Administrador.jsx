import { Navigate } from "react-router-dom";
import { GetAdministrador } from "../API/API_Seguro";
import { useEffect, useState } from "react";
import NavbarAdmin from "../components/Administrador/NavbarAdmin";

const Administrador = () => {
  const [Administrador, setAdministrador] = useState({
    nombre: "Usuario",
    apellido: "",
  });

  // useEffect(() => {
  //   const Datos = async (dni) => {
  //     const resp = await GetAdministrador(dni);
  //     setAdministrador(resp.data);
  //   };
  //   Datos(localStorage.getItem("usuario"));
  // }, []);

  // if (localStorage.getItem("tipo") !== "Administrador") {
  //   return <Navigate to="/" />;
  // }


  // CARGAR RECETAAAA 
  document.addEventListener("DOMContentLoaded", function() {
  const cargarRecetasBtn = document.getElementById("cargarRecetasBtn");
  const recetasContainer = document.getElementById("recetasContainer");

  cargarRecetasBtn.addEventListener("click", function() {
    recetasContainer.classList.toggle("hidden");
  });
});

  const deleteStorage = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo");
    window.location.href = "/";
  };
  return (
    <div>
    <NavbarAdmin />
    <div className="flex flex-col items-center mt-2 lg:mt-5">
      <h1 className="text-4xl sm:text-6xl lg:text-2xl text-center tracking-wide text-verde">
        Bienvenido Administrador: &nbsp;
        <span className="bg-gradient-to-r from-verde to-celeste text-transparent bg-clip-text">
          {Administrador.nombre + " " + Administrador.apellido}
        </span>
      </h1>
    </div>
  
    <div className="flex">
      <div className="w-1/2 ml-4">
        <div className="border border-amber-500 w-44 rounded-md py-4">
          <button id="cargarRecetasBtn" className="w-full h-full flex justify-center items-center">
            Cargar recetas
          </button>
        </div>
        <div className="hidden mt-5" id="recetasContainer">
          <div className="flex flex-col">
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center w-full">
                <p className="mr-4 w-1/4 border-r border-gray-500 pr-4">Receta 1</p>
                <button className="border border-gray-500 px-4 py-2 rounded-md ml-4 cursor-pointer hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-800 hover:text-white">
                  Alistar medicamento
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center w-full">
                <p className="mr-4 w-1/4 border-r border-gray-500 pr-4">Receta 2</p>
                <button className="border border-gray-500 px-4 py-2 rounded-md ml-4 cursor-pointer hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-800 hover:text-white">
                  Alistar medicamento
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center w-full">
                <p className="mr-4 w-1/4 border-r border-gray-500 pr-4">Receta 2</p>
                <button className="border border-gray-500 px-4 py-2 rounded-md ml-4 cursor-pointer hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-800 hover:text-white">
                  Alistar medicamento
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <div className="flex items-center w-full">
                <p className="mr-4 w-1/4 border-r border-gray-500 pr-4">Receta 2</p>
                <button className="border border-gray-500 px-4 py-2 rounded-md ml-4 cursor-pointer hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-800 hover:text-white">
                  Alistar medicamento
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-1/2 ml-4 flex justify-center items-center">
      <h2 className="text-2xl font-bold text-gray-800">Receta</h2>
    </div>
  
    </div>
  </div>

  );
};
export default Administrador;
