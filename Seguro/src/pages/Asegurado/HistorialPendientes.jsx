import { useEffect, useState } from "react";
import {
  GetConductor,
  GetMedicinaIDReceta,
  GetMedicinaNombre,
  GetPedidoReceta,
  GetRecetaPaciente,
} from "../../API/API_Seguro";
import IconDetail from "../../assets/Icons/IconDetail";

export default function HistorialPendientes() {
  const [Pedidos, setPedidos] = useState();
  const [DetalleEntrega, setDetalleEntrega] = useState();
  const [ModalDetalle, setModalDetalle] = useState(false);

  useEffect(() => {
    const pedidos = [];

    const GetReceta = async () => {
      const Receta = await GetRecetaPaciente(localStorage.getItem("usuario"));
      for (const element of Receta.data) {
        await GetPedidos(element.id);
      }
      setPedidos(pedidos);
    };

    const GetPedidos = async (Receta) => {
      const Pedido = await GetPedidoReceta("Pendiente", Receta);
      if (Pedido.data.length > 0) {
        const Conductor = await GetConductor(Pedido.data[0].id_conductor);
        Pedido.data[0].conductorNombre = Conductor.data.nombre;
        Pedido.data[0].conductorApellido = Conductor.data.apellido;
        pedidos.push(Pedido.data[0]);
      }
    };
    GetReceta();
  }, []);
  const DetallePedido = async (RecetaId) => {
    const med = await GetMedicinaIDReceta(RecetaId);
    const medicina = await NombreMedicina(med.data);
    setDetalleEntrega(medicina);
    setModalDetalle(true);
  };

  const NombreMedicina = async (data) => {
    for (const element of data) {
      const medicina = await GetMedicinaNombre(element.id_medicina);
      element.nombreMedicina = medicina.data.nombre;
    }
    return data;
  };
  return (
    <div className="p-5">
      {ModalDetalle && (
        <div className="fixed  inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="flex flex-col justify-center gap-3 bg-white rounded-md p-5">
            <h2 className="text-xl font-bold mb-4 text-center">
              Detalles de su Pedido
            </h2>
            <div className="overflow-x-auto">
              <table className="bg-white border border-gray-200">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Nombre
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Descripción
                    </th>
                    <th className="py-2 px-4 border-b border-gray-200 text-left">
                      Cantidad
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {DetalleEntrega ? (
                    DetalleEntrega.map((detalle) => (
                      <tr key={detalle.id}>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {detalle.nombreMedicina}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {detalle.descripcion}
                        </td>
                        <td className="py-2 px-4 border-b border-gray-200">
                          {detalle.cantidad}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr></tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex flex-row justify-center ">
              <button
                type="button"
                onClick={() => {
                  setModalDetalle(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <h2 className="text-xl font-bold mb-4 text-center">
        Entregas Pendientes
      </h2>
      <div className="grid sm:grid-cols-3 md:grid-cols-3 grid-cols-2 gap-4">
        {Pedidos ? (
          Pedidos.map((pedido) => (
            <div className=" bg-white p-4 shadow-md rounded-lg" key={pedido.id}>
              <h2 className="text-lg font-semibold ">#{pedido.id}</h2>
              <p className="text-gray-700">
                <span className="font-semibold">Conductor:</span>{" "}
                {pedido.conductorNombre} {pedido.conductorApellido}
              </p>
              <p className="text-gray-700 text-base">
                <span className="font-semibold">Fecha:</span> {pedido.fecha}
              </p>

              <div className="flex justify-center">
                <button
                  className="mt-4 "
                  onClick={() => {
                    DetallePedido(pedido.id_receta);
                  }}>
                  <IconDetail />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className=" col-span-3 my-5">
            <div className="bg-gray-100 shadow-md rounded-lg overflow-hidden">
              <h2 className="text-lg text-center text-[#9ca3af] p-5">
                Aqui se mostraran sus pedidos pendientes
              </h2>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
