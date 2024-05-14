import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { GetPedidoPrioridad } from "../../API/API_Seguro";
import IconMoto from "../../assets/Icons/IconMoto";
import { Slide, ToastContainer, toast } from "react-toastify";
import Fecha from "../../constants/FechaTime";

export default function PrincipalMenu({ Data }) {
  const [PedidoAlta, setPedidoAlta] = useState([]);
  const [PedidoBaja, setPedidoBaja] = useState([]);
  const { envios, fechaHoy } = Fecha();

  useEffect(() => {
    const { fechaConsulta } = Fecha();
    const pedidos = async () => {
      const pedAlta = await GetPedidoPrioridad(
        fechaConsulta,
        "Alta",
        "65214359"
      );
      const pedBaja = await GetPedidoPrioridad(
        fechaConsulta,
        "Baja",
        "65214359"
      );
      setPedidoAlta(pedAlta.data);
      setPedidoBaja(pedBaja.data);
    };
    pedidos();
  }, []);

  const IniciarDelivery = (prioridad) => {
    if (prioridad === "Alta") {
      if (PedidoAlta.length > 0) {
        toast.success("Iniciando delivery");
      } else {
        toast.warning("Se completaron todas las tareas de prioridad Alta");
      }
    } else {
      if (PedidoAlta.length > 0) {
        toast.warning("Primero complete los pedidos de prioridad Alta");
      } else {
        if (PedidoBaja.length > 0) {
          toast.success("Iniciando delivery");
        } else {
          toast.warning("Se completaron todas las tareas de prioridad Baja");
        }
      }
    }
  };

  return (
    <div className="flex-1 p-4 flex flex-col justify-center items-center">
      <h1 className=" text-3xl text-center tracking-wide">
        Bienvenido Repartidor: &nbsp;
        <span className="bg-gradient-to-r from-verde to-celeste text-transparent bg-clip-text">
          {Data.nombre + " " + Data.apellido}
        </span>
      </h1>
      <div className="flex flex-col items-center w-full">
        <div className=" text-start w-full px-4 mt-8">
          <div className=" flex justify-between my-5 border-b-2 border-verde">
            <h2 className=" text-xl">{fechaHoy}</h2>
            <h2 className=" text-xl">{envios}</h2>
          </div>
          <div className="flex w-full mt-10">
            <h4 className=" w-2/3 pb-5 text-xl text-center font-bold">
              Prioridad Alta
            </h4>
            <h6
              className="flex justify-evenly w-1/3  pb-5 text-xl text-center font-bold cursor-pointer"
              onClick={() => {
                IniciarDelivery("Alta");
              }}>
              Iniciar delivery
              <IconMoto />
            </h6>
          </div>

          <table className="w-full text-center">
            <thead>
              <tr>
                <th>ID</th>
                <th>ID Receta</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {PedidoAlta &&
                PedidoAlta.map((Pedido) => (
                  <tr key={Pedido.id} className=" my-2 border-y-2 border-black">
                    <td>{Pedido.id}</td>
                    <td>{Pedido.id_receta}</td>
                    <td>{Pedido.estatus}</td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="flex w-full mt-5">
            <h4 className=" w-2/3 pb-5 text-xl text-center font-bold">
              Prioridad Baja
            </h4>
            <h6
              className="flex justify-evenly w-1/3  pb-5 text-xl text-center font-bold cursor-pointer"
              onClick={() => {
                IniciarDelivery("Baja");
              }}>
              Iniciar delivery
              <IconMoto />
            </h6>
          </div>
          <table className="w-full text-center">
            <thead>
              <tr>
                <th>ID</th>
                <th>ID Receta</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {PedidoBaja &&
                PedidoBaja.map((Pedido) => (
                  <tr key={Pedido.id} className=" my-2 border-y-2 border-black">
                    <td>{Pedido.id}</td>
                    <td>{Pedido.id_receta}</td>
                    <td>{Pedido.estatus}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
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
