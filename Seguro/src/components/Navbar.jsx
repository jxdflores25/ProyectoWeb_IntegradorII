import {Link} from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { navItems } from "../constants";
import IconLogo from "../assets/Icons/IconLogo";

const Navbar = () => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const toggleNavbar = () => {
    setMobileDrawerOpen(!mobileDrawerOpen)
  };

  return (
    <nav className="sticky top-0 z-50 py-3 backdrop-blur-lg border-b border-neutral-700/80">
      <div className="container px-4 mx-auto relative text-sm">
        <div className="flex justify-between items-center">
          <div className="flex items-center flex-shrink-0">
          
            <span className="text-xl tracking-tight text-celeste flex">Health <span className="text-verde">Express</span> <IconLogo/>
            </span>
          </div>
          <ul className="hidden lg:flex ml-14 space-x-12">
            {navItems.map((item, index) => (
              <li key={index}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
          <div className="hidden lg:flex justify-center space-x-12 items-center">
            <Link to="/login" className="py-2 px-3  border-verde rounded-md bg-verde text-white transition-transform transform hover:scale-110">
              Iniciar sesión
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-verde to-verde text-white py-2 px-3 rounded-md transition-transform transform hover:scale-110"
            >
              Crear cuenta
            </Link>
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
              {navItems.map((item, index) => (
                <li key={index} className="py-3 border-b-2 border-verde">
                  <a href={item.href}>{item.label}</a>
                </li>
              ))}
            </ul>
            <div className="flex space-x-6">
              <a href="/login" className="py-2 my-2.5 px-3  bg-celeste rounded-md text-white transition-transform transform hover:scale-110"> Iniciar sesión</a>
              <a href="/register" className="py-2 my-2.5 px-3 rounded-md bg-gradient-to-r from-celeste to-celeste text-white transition-transform transform hover:scale-110" >Crear cuenta</a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
