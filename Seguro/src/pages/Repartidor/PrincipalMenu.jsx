import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import {
  GetAsegurado,
  GetPedidoPrioridad,
  GetRecetaSeguro,
} from "../../API/API_Seguro";
import IconMoto from "../../assets/Icons/IconMoto";
import { Slide, ToastContainer, toast } from "react-toastify";
import Fecha from "../../constants/FechaTime";

export default function PrincipalMenu({ Data }) {
  const [PedidoAlta, setPedidoAlta] = useState(null);
  const [PedidoBaja, setPedidoBaja] = useState(null);
  const [Receta, setReceta] = useState(null);
  const [Asegurado, setAsegurado] = useState(null);
  const { envios, fechaHoy } = Fecha();

  useEffect(() => {
    const { fechaConsulta } = Fecha();
    navigator.geolocation.getCurrentPosition((position) => {
      localStorage.setItem("lat", position.coords.latitude);
      localStorage.setItem("log", position.coords.longitude);
    });
    const pedidos = async () => {
      const pedAlta = await GetPedidoPrioridad(
        "2024-05-16",
        //fechaConsulta,
        "Alta",
        localStorage.getItem("usuario")
      );
      const pedBaja = await GetPedidoPrioridad(
        fechaConsulta,
        "Baja",
        localStorage.getItem("usuario")
      );
      if (pedAlta.data.length > 0) {
        const receta = [];
        const asegurado = [];
        for (let index = 0; index < pedAlta.data.length; index++) {
          var rec = await GetRecetaSeguro(pedAlta.data[index].id_receta);
          var ase = await GetAsegurado(rec.data.dni_asegurado);
          receta.push(rec.data);
          asegurado.push(ase.data);
        }
        setReceta(receta);
        setAsegurado(asegurado);
        setPedidoAlta(pedAlta.data);
      }
      if (pedBaja.data.length > 0) {
        setPedidoBaja(pedBaja.data);
      }
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

  const EnviarPedidosAlta = async () => {
    localStorage.setItem("PrioridadPedidos", "Alta");

    window.location.href = "/Repartidor/RutasPedidos";
  };

  return (
    <div className="flex-1 p-4 flex flex-col justify-center items-center bg-gray-50 min-h-screen">
      <h1 className="text-3xl text-center tracking-wide mb-8">
        Bienvenido Repartidor: &nbsp;
        <span className="bg-gradient-to-r from-verde to-celeste text-transparent bg-clip-text">
          {Data.nombre + " " + Data.apellido}
        </span>
      </h1>
      <div className="flex flex-col items-center w-full max-w-4xl">
        <div className="text-start w-full px-4 mt-8">
          <div className="flex justify-between my-5 border-b-2 border-verde">
            <h2 className="text-xl">{fechaHoy}</h2>
            <h2 className="text-xl">{envios}</h2>
          </div>
          <div className="flex w-full mt-10">
            <h4 className="w-2/3 pb-5 text-xl text-center font-bold">
              Prioridad Alta
            </h4>
            <h6
              className="flex justify-evenly w-1/3 pb-5 text-xl text-center font-bold cursor-pointer hover:text-verde"
              onClick={() => {
                EnviarPedidosAlta();
              }}>
              Iniciar delivery
              <IconMoto />
            </h6>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-300 py-2">ID</th>
                  <th className="border-b-2 border-gray-300 py-2">ID Receta</th>
                  <th className="border-b-2 border-gray-300 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {PedidoAlta ? (
                  PedidoAlta.map((Pedido) => (
                    <tr key={Pedido.id} className="border-b border-gray-200">
                      <td className="py-2">{Pedido.id}</td>
                      <td className="py-2">{Pedido.id_receta}</td>
                      <td className="py-2">{Pedido.estatus}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="h-24 border-2 border-[#9ca3af] border-dashed ">
                    <td colSpan="3" className="text-lg text-[#9ca3af]">
                      Aquí se mostrarán sus pedidos de prioridad alta
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex w-full mt-5">
            <h4 className="w-2/3 pb-5 text-xl text-center font-bold">
              Prioridad Baja
            </h4>
            <h6
              className="flex justify-evenly w-1/3 pb-5 text-xl text-center font-bold cursor-pointer hover:text-verde"
              onClick={() => {
                IniciarDelivery("Baja");
              }}>
              Iniciar delivery
              <IconMoto />
            </h6>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                <tr>
                  <th className="border-b-2 border-gray-300 py-2">ID</th>
                  <th className="border-b-2 border-gray-300 py-2">ID Receta</th>
                  <th className="border-b-2 border-gray-300 py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {PedidoBaja ? (
                  PedidoBaja.map((Pedido) => (
                    <tr key={Pedido.id} className="border-b border-gray-200">
                      <td className="py-2">{Pedido.id}</td>
                      <td className="py-2">{Pedido.id_receta}</td>
                      <td className="py-2">{Pedido.estatus}</td>
                    </tr>
                  ))
                ) : (
                  <tr className="h-24 border-2 border-[#9ca3af] border-dashed ">
                    <td colSpan="3" className="text-lg text-[#9ca3af]">
                      Aquí se mostrarán sus pedidos de prioridad baja
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
