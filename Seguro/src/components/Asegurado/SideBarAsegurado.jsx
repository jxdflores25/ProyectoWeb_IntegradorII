import IconSalir from "../../assets/Icons/IconSalir";
import IconClose from "../../assets/Icons/IconClose";
import IconSearch from "../../assets/Icons/IconSearch";
import "../../index.css";
import { NavLink } from "react-router-dom";

export default function SidebarAsegurado() {
  function close() {
    document.querySelector(".sidebar").className =
      "sidebar hidden bg-amber-600 font-[Poppins] w-full z-20";
  }
  const deleteStorage = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo");
    window.location.href = "/";
  };
  return (
    <div className="sidebar lg:hidden bg-celeste font-[Poppins] w-full ">
      <div className="fixed top-0 bottom-0 left-0 p-2 w-[300px]  text-center bg-white border-r-2 border-verde">
        <div className="text-gray-100 text-xl">
          <div className="p-2.5 mt-1 flex items-center border-b-2 border-verde">
            <i className="bi bi-hospital px-2 py-1 bg-white-300 rounded-md"></i>
            <h1 className="font-bold text-[px] ml-1 text-start text-celeste">
              Helth<span className="text-verde">Express</span>
            </h1>
            <span className="text-black" onClick={close}>
              <IconClose />
            </span>
          </div>
          <hr className="my-2 text-gray-600" />
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-verde hover:to-celeste text-white">
          <IconSearch />
          <input
            type="text"
            placeholder="Buscar"
            className="text-[15px] ml-4 w-full bg-transparent focus:outline-none"
          />
        </div>
        <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-verde hover:to-celeste text-white">
          <NavLink to="InfoPerfil">
            <i className="bi bi-person-circle"></i>
            <span className="text-[15px] ml-4 text-gray-700">Mi perfil</span>
          </NavLink>
        </div>
        <div className=" fixed bottom-0 left-0 p-2 w-[300px] text-center bg-white">
          <div
            className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-gradient-to-r hover:from-verde hover:to-celeste text-white"
            onClick={deleteStorage}>
            <IconSalir />
            <span className="text-[15px] ml-4 text-gray-700">
              Cerrar Sesión
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
