import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  GetConductor,
  GetPedidoReceta,
  GetRecetaPaciente,
} from "../../API/API_Seguro";
import IconMoto from "../../assets/Icons/IconMoto";
import Fecha from "../../constants/FechaTime";
import { useNavigate } from "react-router-dom";

export default function PrincipalMenu({ Data }) {
  const [Pedidos, setPedidos] = useState();

  const { fechaHoy } = Fecha();

  const navigate = useNavigate();

  useEffect(() => {
    const pedidos = [];

    const GetReceta = async () => {
      const Receta = await GetRecetaPaciente(localStorage.getItem("usuario"));
      for (const element of Receta.data) {
        await GetPedidos(element.id);
      }
      setPedidos(pedidos);
      console.log(pedidos);
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

    GetReceta();
  }, []);

  const Seguimiento = (id) => {
    localStorage.setItem("PedidoAsegurado", id);
    window.location.href = "/Asegurado/Seguimiento";
  };

  return (
    <div className="flex-1 p-4 flex flex-col justify-center items-center">
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
                <div className="flex justify-center"> <button
                  className="mt-4 "
                  onClick={() => {
                    Seguimiento(pedido.id);
                  }}>
                  <IconMoto />
                </button></div>
               
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
    </div>
  );
}

PrincipalMenu.propTypes = {
  Data: PropTypes.object.isRequired,
};
