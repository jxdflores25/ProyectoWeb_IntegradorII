import { Navigate } from "react-router-dom";
import { GetAdministrador, GetRecetas } from "../../API/API_Seguro";
import { useEffect, useState } from "react";
import NavbarAdmin from "../../components/NavbarAdmin";

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

  if (localStorage.getItem("tipo") !== "Administrador") {
    return <Navigate to="/" />;
  }

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
    <div>
      <NavbarAdmin />
      <div className="flex flex-col items-center mt-2 lg:mt-5">
        <h1 className="text-4xl sm:text-6xl lg:text-2xl text-center tracking-wide">
          Bienvenido Administrador: &nbsp;
          <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
            {Administrador.nombre + " " + Administrador.apellido}
          </span>
        </h1>
      </div>

      <div className="w-1/2 ml-32">
        <div className="border border-amber-500 w-44 rounded-md py-4">
          <button className="w-full h-full flex justify-center items-center">
            cargar recetas
          </button>
        </div>
        <div className="mt-10">
          <p className="py-7">Receta 1</p>
          <p className="py-7">Receta 2</p>
          <p className="py-7">Receta 3</p>
          <p className="py-7">Receta 4</p>
        </div>
      </div>
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
          compromiso transforman tu bienestar en una experiencia extraordinaria
          y sostenible.
        </p>
        <button
          onClick={deleteStorage}
          className=" active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-out transition-all py-3 rounded-xl bg-orange-500 text-white text-lg fond bold">
          Cerrar Sesion
        </button>

        <button onClick={getRecetas}>Traer Datos</button>
      </div>
    </div>
  );
};
export default Administrador;
