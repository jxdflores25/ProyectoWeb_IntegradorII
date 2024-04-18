import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { GetConductor } from "../API/API_Seguro";

const Repartidor = () => {
  const [Repartidor, setRepartidor] = useState({
    nombre: "Usuario",
    apellido: "",
  });

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
    <div className="flex flex-col items-center mt-6 lg:mt-20">
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Bienvenido Repartidor: &nbsp;
        <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
          {Repartidor.nombre + " " + Repartidor.apellido}
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
        Cerrar Sesión
      </button>
    </div>
  );
};
export default Repartidor;
