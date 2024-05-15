
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { navItemsAdmin } from "../../constants";
import { NavLink } from "react-router-dom";
import IconLogo from "../../assets/Icons/IconLogo";

const NavbarAdmin = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeMenuIndex, setActiveMenuIndex] = useState(() => {
    const storedIndex = localStorage.getItem("activeMenuIndex");
    return storedIndex !== null ? parseInt(storedIndex) : 0;
  });
  useEffect(() => {
    localStorage.setItem("activeMenuIndex", activeMenuIndex.toString());
  }, [activeMenuIndex]);

  const deleteStorage = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo");
    window.location.href = "/";
  };

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen);
  };
  // Codigo para animacion del Navbar con el mouse 
  const handleMouseEnter = (e) => {
    const { left, top, width, height } = e.target.getBoundingClientRect();
    const menuBackdrop = document.getElementById("menu-backdrop");
    menuBackdrop.style.setProperty("--left", `${left}px`);
    menuBackdrop.style.setProperty("--top", `${top}px`);
    menuBackdrop.style.setProperty("--width", `${width}px`);
    menuBackdrop.style.setProperty("--height", `${height}px`);
    menuBackdrop.style.opacity = 1;
    menuBackdrop.style.visibility = "visible";
  };

  const handleMouseLeave = () => {
    const menuBackdrop = document.getElementById("menu-backdrop");
    menuBackdrop.style.opacity = 0;
    menuBackdrop.style.visibility = "hidden";
  };
  const handleMenuClick = (index) => {
    setActiveMenuIndex(index);
  };


  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
    <div className="container px-4 mx-auto relative text-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center flex-shrink-0">
          <span className="text-2xl tracking-tight text-celeste flex gap-1">Health <span className="text-verde">Express</span> <IconLogo/></span>
        </div>
        <ul className="hidden lg:flex ml-14 space-x-12">
          {navItemsAdmin.map((item, index) => (
            <li className="px-4 py-2 rounded" key={index} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
              <NavLink 
                to={item.href} 
                onClick={() => handleMenuClick(index)}
                className={activeMenuIndex === index ? "bg-gradient-to-r from-blue-200 to-verdesuave px-4 py-2 rounded" : ""}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="flex space-x-6" onClick={deleteStorage}>
          <button className="py-2 my-2.5 px-3 rounded-md bg-gradient-to-r from-verde to-verde text-white transition-transform transform hover:scale-110">
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
              <li key={index} className="py-3 border-b-2 border-celeste">
                <NavLink 
                  to={item.href} 
                  onClick={() => handleMenuClick(index)}
                  className={activeMenuIndex === index ? "bg-gradient-to-r from-blue-200 to-verdesuave" : ""}
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="flex space-x-6" onClick={deleteStorage}>
            <button className="py-2 my-2.5 px-3 rounded-md bg-gradient-to-r from-celeste to-verde text-white">
              Cerrar Sesion
            </button>
          </div>
        </div>
      )}
    </div>
    {/* Agregar el fondo del menú :)  */}
    <div id="menu-backdrop" className={`absolute bg-gradient-to-r from-blue-200 to-verdesuave backdrop-blur-lg rounded
    left-[var(--left)] top-[var(--top)] w-[var(--width)] h-[var(--height)]
    transition-all duration-500 ease-in-out opacity-0 -z-10 `}>
    </div>
  </nav>
  );
};
export default NavbarAdmin;


