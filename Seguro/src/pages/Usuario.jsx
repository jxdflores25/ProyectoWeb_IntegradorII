import { useEffect, useState } from "react";
import { GetAsegurado } from "../API/API_Seguro";
import { Link } from "react-router-dom";




const Usuario = () => {
  const [Asegurado, setAsegurado] = useState({
    nombre: "Usuario",
    apellido: "",
  });


  const deleteStorage = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo");
    window.location.href = "/";
  };
  function open() {
    document.querySelector(".sidebar").style.left = "0";
  }
  function close() {
    document.querySelector(".sidebar").style.left = "-300px";
  }

  return (

    <div className="flex flex-col lg:flex-row">
  {/* Navbar para dispositivos móviles */}
  <div className="lg:hidden bg-amber-600 font-[Poppins] w-full">
    <div className="flex justify-between items-center p-2">
      <span className="text-white text-4xl cursor-pointer" onClick={open}>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" class="bi bi-list" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
</svg>
      </span>
      <h1 className="font-bold text-white text-[px]">MediSalud</h1>
      <div className="w-8"></div>
    </div>
    <div className="sidebar fixed top-0 bottom-0 left-0 p-2 w-[300px] overflow-y-auto text-center bg-amber-500">
      <div className="text-gray-100 text-xl">
        <div className="p-2.5 mt-1 flex items-center">
          <i className="bi bi-hospital px-2 py-1 bg-white-300 rounded-md"></i>
          <h1 className="font-bold text-gray-700 text-[px] ml-3 text-center">MediSalud</h1>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x ml-20 cursor-pointer w-8 h-8" onClick={close} viewBox="0 0 16 16">
  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>  
</svg>
        </div>
        <hr className="my-2 text-gray-600" />
      </div>
      <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-amber-400 text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
        <input type="text" placeholder="Buscar" className="text-[15px] ml-4 w-full bg-transparent focus:outline-none" />
      </div>
      <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-amber-400 text-white">
        <Link to="/infoperfil">
          <i className="bi bi-person-circle"></i>
          <span className="text-[15px] ml-4 text-gray-700">Mi perfil</span>
        </Link>
        <div className="sidebar fixed bottom-0 left-0 p-2 w-[300px] text-center bg-amber-500">
        <div className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-amber-400 text-white" onClick={deleteStorage}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
  <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
</svg>
      <span className="text-[15px] ml-4 text-gray-700">Cerrar Sesión</span>
    </div>
        </div>
      </div>
    </div>
  </div>

  {/* Sidebar para pantallas de escritorio */}
  <div className="hidden lg:block bg-amber-600 font-[Poppins] relative">
    <span className="absolute text-white text-4xl top-5 left-4 cursor-pointer" onClick={open}>
      <i className="bi bi-list px-2 bg-gray-700 rounded-md"></i>
    </span>
    <div className="sidebar fixed top-0 bottom-0 lg:left-0 left-0 p-2 w-[300px] overflow-y-auto text-center bg-amber-500">
      <div className="text-gray-100 text-xl">
        <div className="p-2.5 mt-1 flex items-center">
          <i className="bi bi-hospital px-2 py-1 bg-white-300 rounded-md"></i>
          <h1 className="font-bold text-gray-700 text-[px] ml-3 text-center">MediSalud</h1>
          <i className="bi bi-x ml-20 cursor-pointer" onClick={close}></i>
        </div>
        <hr className="my-2 text-gray-600" />
      </div>
      <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-amber-400 text-white">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
</svg>
        <input type="text" placeholder="Buscar" className="text-[15px] ml-4 w-full bg-transparent focus:outline-none" />
      </div>
      <div className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-amber-400 text-white">
       <Link to="/infoperfil">
          <i className="bi bi-person-circle"></i>
          <span className="text-[15px] ml-4 text-gray-700">Mi perfil</span>
        </Link>
        <div className="sidebar fixed bottom-0 left-0 p-2 w-[300px] text-center bg-amber-500">
        <div className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-amber-400 text-white" onClick={deleteStorage}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-box-arrow-left" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
  <path fill-rule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
</svg>
      <span className="text-[15px] ml-4 text-gray-700">Cerrar Sesión</span>
    </div>
        </div>
      </div>
    </div>
  </div>

  {/* Contenido principal */}
  <div className="flex-1 overflow-y-auto">
    <div className="flex flex-col items-center justify-center mt-6 lg:mt-20 mx-auto max-w-[calc(100vw - 300px)] lg:max-w-full">
      {/* Contenido principal aquí */}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
          Bienvenido Asegurado:
        </span>
        <br />
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text text-4xl sm:text-6xl lg:text-7xl">
          {Asegurado.nombre + " " + Asegurado.apellido}
        </span>
      </h1>

      <p className="mt-10 text-lg text-center text-neutral-500 max-w-4xl">
        En MediSalud, nuestra pasión es impulsar un estilo de vida saludable y
        feliz a través de productos y servicios que inspiran, nutren y
        revitalizan cuerpo y mente. Descubre cómo nuestra innovación y
        compromiso transforman tu bienestar en una experiencia extraordinaria y
        sostenible.
      </p>
     
    </div>
  </div>
</div>
  );
};

export default Usuario;
