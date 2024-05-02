//import { Navigate } from "react-router-dom";
import { GetAdministrador, GetRecetas } from "../API/API_Seguro";
import { useEffect, useState } from "react";

const Administrador = () => {
  const [Administrador, setAdministrador] = useState({
    nombre: "Usuario",
    apellido: "",
  });

  useEffect(() => {
    const Datos = async (dni) => {
      const resp = await GetAdministrador(dni);
      setAdministrador(resp.data);
    };
    Datos(localStorage.getItem("usuario"));
  }, []);

  /*if (localStorage.getItem("tipo") !== "Administrador") {
    return <Navigate to="/" />;
  }*/

  const getRecetas = async () => {
    const recetas = await GetRecetas("2024-05-01");
    console.log(recetas.data);
  };

  const deleteStorage = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("tipo");
    window.location.href = "/";
  };
  return (
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Bienvenido Administrador: &nbsp;
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
          {Administrador.nombre + " " + Administrador.apellido}
        </span>
      </h1>

      <p className="mt-10 tex-lg text-center tex-neutral-500 max-w-4xl">
        En MediSalud, nuestra pasión es impulsar un estilo de vida saludable y
        feliz a través de productos y servicios que inspiran, nutren y
        revitalizan cuerpo y mente. Descubre cómo nuestra innovación y
        compromiso transforman tu bienestar en una experiencia extraordinaria y
        sostenible.
      </p>
      <button
        onClick={deleteStorage}
        className=" active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-out transition-all py-3 rounded-xl bg-orange-500 text-white text-lg fond bold">
        Cerrar Sesion
      </button>

      <button onClick={getRecetas}>Traer Datos</button>
    </div>
  );
};
export default Administrador;
