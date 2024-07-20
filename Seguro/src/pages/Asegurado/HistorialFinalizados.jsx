import { useEffect, useState } from "react";
import {
  GetConductor,
  GetMedicinaIDReceta,
  GetMedicinaNombre,
  GetPedidoReceta,
  GetRecetaPaciente,
} from "../../API/API_Seguro";
import IconDetail from "../../assets/Icons/IconDetail";
import DescargarBoleta from "../../constants/DescargarBoleta";
import DescargarGuia from "../../constants/DescargarGuia";

export default function HistorialFinalizados() {
  const [Pedidos, setPedidos] = useState();
  const [DetalleEntrega, setDetalleEntrega] = useState();
  const [IndexDetalle, setIndexDetalle] = useState(null);
  const [ModalDetalle, setModalDetalle] = useState(false);
  const [Boleta, setBoleta] = useState();
  const [GuiaR, setGuiaR] = useState();

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
      const Pedido = await GetPedidoReceta("Finalizado", Receta);
      if (Pedido.data.length > 0) {
        const Conductor = await GetConductor(Pedido.data[0].id_conductor);
        Pedido.data[0].conductorNombre = Conductor.data.nombre;
        Pedido.data[0].conductorApellido = Conductor.data.apellido;
        pedidos.push(Pedido.data[0]);
      }
    };
    GetReceta();
  }, []);

  const DetallePedido = async (RecetaId, index) => {
    const med = await GetMedicinaIDReceta(RecetaId);
    const medicina = await NombreMedicina(med.data);
    const boleta = await DescargarBoleta(
      Pedidos[index].id_receta,
      Pedidos[index].fecha
    );
    const guia = await DescargarGuia(
      Pedidos[index].id_receta,
      Pedidos[index].id_conductor,
      Pedidos[index].id,
      Pedidos[index].fecha
    );
    setDetalleEntrega(medicina);
    setBoleta(boleta);
    setGuiaR(guia);
    setIndexDetalle(index);
    setModalDetalle(true);
  };

  const DesBoleta = async () => {
    const url = window.URL.createObjectURL(new Blob([Boleta]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "boleta.pdf");
    document.body.appendChild(link);
    link.click();
  };

  const DesGuia = async () => {
    const url = window.URL.createObjectURL(new Blob([GuiaR]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "GuiaRemision.pdf");
    document.body.appendChild(link);
    link.click();
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
            <p className="block text-gray-700 font-medium mb-2">
              Nombre del Conductor:{" "}
              {Pedidos[IndexDetalle].conductorNombre +
                " " +
                Pedidos[IndexDetalle].conductorApellido}
            </p>
            <p className="block text-gray-700 font-medium mb-2">
              Fecha de Envío: {Pedidos[IndexDetalle].fecha}
            </p>
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
            <div className="flex justify-between mb-4 gap-2">
              <button
                className="bg-verde text-base text-white py-1 px-2 rounded hover:bg-blue-600"
                onClick={DesBoleta}>
                Descargar Boleta
              </button>
              <button
                className="bg-verde text-base text-white py-1 px-2 rounded hover:bg-blue-600"
                onClick={DesGuia}>
                Descargar Guía de Remisión
              </button>
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
        Pedidos Finalizados
      </h2>
      <div className="overflow-x-auto flex justify-center">
        <table className="bg-white border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                #Pedido
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                #Receta
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Fecha
              </th>
              <th className="py-2 px-4 border-b border-gray-200 text-left">
                Detalle
              </th>
            </tr>
          </thead>
          <tbody>
            {Pedidos ? (
              Pedidos.map((pedido, index) => (
                <tr key={pedido.id}>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {pedido.id}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {pedido.id_receta}
                  </td>
                  <td className="py-2 px-4 border-b border-gray-200">
                    {pedido.fecha}
                  </td>
                  <td className="flex justify-center ">
                    <button
                      className="h-full"
                      onClick={() => {
                        DetallePedido(pedido.id_receta, index);
                      }}>
                      <IconDetail />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="text-lg text-center text-[#9ca3af] p-5">
                  Aqui se mostraran los pedidos Finalizados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
