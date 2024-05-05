import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItemsAdmin } from "../../constants";

const NavbarAdmin = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const deleteStorage = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo");
    window.location.href = "/";
  };

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
            <span className="text-xl tracking-tight">MediSalud</span>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItemsAdmin.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
          <div className="flex space-x-6" onClick={deleteStorage}>
            <button className="py-2 my-2.5 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 text-white">
              Cerrar Sesion
            </button>
          </div>
          <div className="lg:hidden md:flex flex-col justify-end">
            <button onClick={toggleNavbar}>
              {mobileDrawerOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
        {mobileDrawerOpen && (
          <div className="fixed right-0  bg-white w-full p-12 flex flex-col justify-center items-center lg:hidden ">
            <ul>
              {navItemsAdmin.map((item, index) => (
                <li key={index} className="py-3 border-b-2 border-orange-500">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6" onClick={deleteStorage}>
              <button className="py-2 my-2.5 px-3 rounded-md bg-gradient-to-r from-orange-500 to-orange-800 text-white">
                Cerrar Sesion
              </button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
export default NavbarAdmin;
