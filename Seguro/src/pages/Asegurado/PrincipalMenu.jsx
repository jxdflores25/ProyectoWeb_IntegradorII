import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  GetConductor,
  GetPedidoReceta,
  GetRecetaPaciente,
  PostPuntuacion,
} from "../../API/API_Seguro";
import IconMoto from "../../assets/Icons/IconMoto";
import Fecha from "../../constants/FechaTime";
import { Slide, toast, ToastContainer } from "react-toastify";

export default function PrincipalMenu({ Data }) {
  const [Pedidos, setPedidos] = useState();
  const [ModalEvaluacion, setModalEvaluacion] = useState(false);
  const [Conductor, setConductor] = useState();

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const { fechaHoy } = Fecha();

  useEffect(() => {
    const pedidos = [];

    const Califica = async () => {
      const con = await GetConductor(
        localStorage.getItem("ConductorEstrellas")
      );
      setConductor(con.data);
      setModalEvaluacion(true);
    };

    const GetReceta = async () => {
      const Receta = await GetRecetaPaciente(localStorage.getItem("usuario"));
      for (const element of Receta.data) {
        await GetPedidos(element.id);
      }
      setPedidos(pedidos);
    };

    const GetPedidos = async (Receta) => {
      const Pedido = await GetPedidoReceta("EnCurso", Receta);
      if (Pedido.data.length > 0) {
        const Conductor = await GetConductor(Pedido.data[0].id_conductor);
        Pedido.data[0].conductorNombre = Conductor.data.nombre;
        Pedido.data[0].conductorApellido = Conductor.data.apellido;
        pedidos.push(Pedido.data[0]);
      }
    };

    if (localStorage.getItem("ConductorEstrellas")) {
      Califica();
    }

    GetReceta();
  }, []);

  const PuntuarConductor = async () => {
    let data = {
      id_pedido: localStorage.getItem("PedidoAsegurado"),
      puntuacion: rating,
      id_conductor: localStorage.getItem("ConductorEstrellas"),
    };
    let puntuar = await PostPuntuacion(data);
    if (puntuar != null) {
      toast.success("Se envio la calificacion");
      localStorage.removeItem("PedidoAsegurado");
      localStorage.removeItem("ConductorEstrellas");
      setModalEvaluacion(false);
    }
  };

  const Seguimiento = (id) => {
    localStorage.setItem("PedidoAsegurado", id);
    window.location.href = "/Asegurado/Seguimiento";
  };

  return (
    <div className="flex-1 p-4 flex flex-col justify-center items-center">
      {ModalEvaluacion && (
        <div className="fixed  inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Califica a tu Conductor</h2>
            <h2 className="text-xl font-bold mb-4 text-center">
              {Conductor.nombre + " " + Conductor.apellido}
            </h2>
            <div className="flex items-center justify-center">
              {[...Array(5)].map((star, index) => {
                index += 1;
                return (
                  <button
                    type="button"
                    key={index}
                    className={
                      index <= (hover || rating)
                        ? "text-yellow-400 text-4xl"
                        : "text-gray-300 text-4xl"
                    }
                    onClick={() => setRating(index)}
                    onMouseEnter={() => setHover(index)}
                    onMouseLeave={() => setHover(rating)}>
                    <span className="star">&#9733;</span>
                  </button>
                );
              })}
            </div>
            <div className="mt-4">
              <button
                className="w-full bg-indigo-500 text-white font-bold py-2 rounded-lg hover:bg-indigo-600"
                onClick={() => PuntuarConductor()}>
                Enviar Calificación
              </button>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-4xl sm:text-6xl lg:text-7xl text-center tracking-wide">
        Bienvenido Asegurado: &nbsp;
        <span className="bg-gradient-to-r from-verde to-celeste text-transparent bg-clip-text">
          {Data.nombre + " " + Data.apellido}
        </span>
      </h1>

      <h2 className="w-2/3 pb-5 mt-5 text-xl text-center font-bold">
        Pedidos en curso
      </h2>

      {Pedidos ? (
        Pedidos.map((pedido) => (
          <div className=" w-3/4 my-5" key={pedido.id}>
            <div className="bg-gray-100 shadow-md rounded-lg overflow-hidden">
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  Pedido #{pedido.id}
                </h2>
                <p className="text-gray-700">
                  <span className="font-semibold">Conductor:</span>{" "}
                  {pedido.conductorNombre} {pedido.conductorApellido}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Fecha: </span> {fechaHoy}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Status:</span> En Curso
                </p>
                <div className="flex justify-center">
                  {" "}
                  <button
                    className="mt-4 "
                    onClick={() => {
                      Seguimiento(pedido.id);
                    }}>
                    <IconMoto />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className=" w-3/4 my-5">
          <div className="bg-gray-100 shadow-md rounded-lg overflow-hidden">
            <h2 className="text-lg text-center text-[#9ca3af] p-5">
              Aquí se mostrarán sus pedidos que estan en curso
            </h2>
          </div>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </div>
  );
}

PrincipalMenu.propTypes = {
  Data: PropTypes.object.isRequired,
};
