import { NavLink, Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetConductor } from "../../API/API_Seguro";
import IconHamburger from "../../assets/Icons/IconHamburger";
import IconLogo from "../../assets/Icons/IconLogo";
import IconSearch from "../../assets/Icons/IconSearch";
import IconSalir from "../../assets/Icons/IconSalir";

import InfoPerfil from "../Repartidor/InfoPerfil";
import PrincipalMenu from "../Repartidor/PrincipalMenu";
import SideBarRepartidor from "../../components/Repartidor/SideBarRepartidor";
import RutasPedidos from "./RutasPedidos";

const useWindowSize = () => {
  const [size, setSize] = useState([window.innerWidth]);

  useEffect(() => {
    const handleResize = () => {
      setSize([window.innerWidth]);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};

const Repartidor = () => {
  const [Repartidor, setRepartidor] = useState({
    nombre: "Usuario",
    apellido: "",
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [MenuSide, setMenuSide] = useState(true);

  

  // Utiliza el hook personalizado para detectar el ancho de la ventana
  const [width] = useWindowSize();

  useEffect(() => {
    // Cierra el menú automáticamente cuando la pantalla es menor a 768px
    if (width < 768) {
      setMenuSide(false);
      setIsMenuOpen(false);
    }else{
      setMenuSide(true);
    }
  }, [width]); // Dependencia en el ancho de la ventana

  useEffect(() => {
    const Datos = async (dni) => {
      const resp = await GetConductor(dni);
      setRepartidor(resp.data);
    };
    Datos(localStorage.getItem("usuario"));
  }, []);

  if (localStorage.getItem("tipo") !== "Conductor") {
    return <Navigate to="/" />;
  }

  const deleteStorage = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo");
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex justify-between lg:justify-center items-center bg-white p-2 border-b-2 border-verde">
        <span
          className="text-verde text-4xl cursor-pointer block lg:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <IconHamburger />
        </span>
        <div className="flex items-center">
          {/* Nuevo contenedor para el título y el logotipo */}
          <h1 className="font-bold text-[px] hidden lg:block text-3xl text-celeste">
            Helth <span className="text-verde">Express</span>
          </h1>
          <IconLogo /> {/* Aquí agregamos el logotipo */}
        </div>
        <div className="w-8"></div>
      </div>
      <div className="flex flex-row h-full relative">
        <div className={`font-[Poppins] h-full ${MenuSide ? 'flex' : "hidden"} border-r-2 border-verde`}>
          <div className="text-center bg-white w-[300px] p-2">
            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-verde hover:to-celeste text-white">
              <IconSearch />
              <input
                type="text"
                placeholder="Buscar"
                className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
              />
            </div>
            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-verde hover:to-celeste text-white" >
              <NavLink to="" >
                <span className="text-[15px] ml-4 text-gray-700">
                  Principal
                </span>
              </NavLink>
            </div>
            <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-verde hover:to-celeste text-white">
              <NavLink to="InfoPerfil">
                <i className="bi bi-person-circle"></i>
                <span className="text-[15px] ml-4 text-gray-700">
                  Mi perfil
                </span>
              </NavLink>
            </div>
            <div className="absolute bottom-0 left-0 p-2 w-[300px] text-center bg-white">
              <div
                className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-verde hover:to-celeste text-white"
                onClick={deleteStorage}>
                <IconSalir />
                <span className="text-[15px] ml-4 text-gray-700 ">
                  Cerrar Sesión
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full">
          <Routes>
            <Route
              path="InfoPerfil"
              element={<InfoPerfil Data={Repartidor} />}
            />
            <Route path="RutasPedidos" element={<RutasPedidos />} />
            <Route path="" element={<PrincipalMenu Data={Repartidor} />} />
          </Routes>
        </div>
      </div>
      {isMenuOpen && <SideBarRepartidor />}
    </div>
  );
};

export default Repartidor;