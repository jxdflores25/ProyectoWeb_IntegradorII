import { createContext, useEffect, useRef, useState } from "react";
import {
  GetAsegurado,
  GetMedicinaIDReceta,
  GetMedicinaNombre,
  GetPedidoPrioridad,
  GetRecetaSeguro,
} from "../../API/API_Seguro";
import Fecha from "../../constants/FechaTime";
import RoutesMarker from "./Routes/LeafletRoute";
import { MapContainer, TileLayer } from "react-leaflet";
import IconWaze from "../../assets/Icons/IconWaze";
import SignatureCanvas from "react-signature-canvas";

export default function RutasPedidos() {
  const [Pedidos, setPedidos] = useState([]);
  const [Receta, setReceta] = useState([]);
  const [Asegurado, setAsegurado] = useState([]);
  const [DetalleEntrega, setDetalleEntrega] = useState([]);

  const [ModalInfo, setModalInfo] = useState(false);
  const [ModalEntrega, setModalEntrega] = useState(false);
  const [ModalFirma, setModalFirma] = useState(false);
  const [InfoPedido, setInfoPedido] = useState([]);
  const [FirmaDigital, setFirmaDigital] = useState(null);

  const sigCanvas = useRef();

  useEffect(() => {
    const { fechaConsulta } = Fecha();
    const pedidos = async () => {
      const pedidos = await GetPedidoPrioridad(
        // "2024-05-16",
        fechaConsulta,
        localStorage.getItem("PrioridadPedidos"),
        localStorage.getItem("usuario")
      );

      const receta = [];
      const asegurado = [];
      for (let index = 0; index < pedidos.data.length; index++) {
        var rec = await GetRecetaSeguro(pedidos.data[index].id_receta);
        var ase = await GetAsegurado(rec.data.dni_asegurado);
        receta.push(rec.data);
        asegurado.push(ase.data);
      }
      setPedidos(pedidos.data);
      setReceta(receta);
      setAsegurado(asegurado);
    };

    pedidos();
  }, []);

  const position = [-12.192539, -76.9534792];

  const MostrarInfo = (id) => {
    setModalInfo(true);
    var Info = [];
    Info.push(Pedidos[id - 1].id);
    Info.push(Asegurado[id - 1].nombre);
    Info.push(Asegurado[id - 1].dni);
    Info.push(Receta[id - 1].id);
    Info.push(Asegurado[id - 1].Latitud);
    Info.push(Asegurado[id - 1].Longitud);
    Info.push(id - 1);
    setInfoPedido(Info);
  };

  const MostrarEntrega = async () => {
    const med = await GetMedicinaIDReceta(InfoPedido[3]);
    const medicina = await NombreMedicina(med.data);
    console.log(medicina);
    setDetalleEntrega(medicina);
    setModalInfo(false);
    setModalEntrega(true);
  };

  const NombreMedicina = async (data) => {
    for (let index = 0; index < data.length; index++) {
      const medicina = await GetMedicinaNombre(data[index].id_medicina);
      data[index].precioMedicina = medicina.data.precio;
      data[index].nombreMedicina = medicina.data.nombre;
    }
    return data;
  };

  const CrearFirma = () => {
    const URL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
    console.log(URL);
    setFirmaDigital(URL);
    setModalFirma(false);
    setModalEntrega(true);
  };

  return (
    <div className="flex flex-col w-full h-full ">
      {ModalInfo && (
        <div className="fixed  inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="flex flex-col bg-white w-11/12 border rounded-md">
            <h3 className="text-center text-2xl my-2">
              Informacion del Pedido
            </h3>
            <div className="flex flex-col">
              <div className="flex flex-row justify-center gap-5">
                <p>ID del Pedido: {InfoPedido[0]}</p>
                <p>ID del Receta: {InfoPedido[3]}</p>
              </div>
              <div className="flex flex-row justify-center gap-5">
                <p>ID del DNI: {InfoPedido[2]}</p>
                <p>ID del Nombre: {InfoPedido[1]}</p>
              </div>
              <div className="flex flex-row justify-center gap-2 my-5">
                <button
                  type="button"
                  onClick={() => {
                    const dlink = document.createElement("a");
                    dlink.setAttribute(
                      "href",
                      "https://www.waze.com/es/live-map/directions?to=ll." +
                        InfoPedido[4] +
                        "%2C" +
                        InfoPedido[5] +
                        "&from=ll." +
                        localStorage.getItem("lat") +
                        "%2C" +
                        localStorage.getItem("log") +
                        "&utm_medium=lm_share_directions&utm_campaign=default&utm_source=waze_website"
                    );
                    dlink.setAttribute("target", "_blank");
                    dlink.click();
                  }}
                  className="bg-celeste  hover:bg-celeste text-white font-bold py-2 px-4 rounded mr-2 flex gap-2">
                  Waze <IconWaze />
                </button>
                <button
                  type="button"
                  onClick={MostrarEntrega}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
                  Entrega
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalInfo(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {ModalEntrega && (
        <div className="fixed  inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="flex flex-col bg-white w-11/12 border rounded-md">
            <h3 className="text-center text-2xl my-2">
              Informacion de la Entrega
            </h3>
            <table>
              <tbody>
                <tr>
                  <td className=" w-1/2">Nro de Pedido:</td>
                  <td>{InfoPedido[0]}</td>
                </tr>
                <tr>
                  <td className=" w-1/2">Nombre Cliente:</td>
                  <td>{InfoPedido[1]}</td>
                </tr>
                <tr>
                  <td className=" w-1/2">DNI Cliente:</td>
                  <td>{InfoPedido[2]}</td>
                </tr>
                <tr>
                  <td className=" w-1/2">Nro Receta:</td>
                  <td>{InfoPedido[3]}</td>
                </tr>
              </tbody>
            </table>
            <div className="flex flex-col">
              <table>
                <thead>
                  <tr>
                    <th>Medicina</th>
                    <th>Cantidad</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {DetalleEntrega &&
                    DetalleEntrega.map((detalle) => (
                      <tr key={detalle.id} className="text-center">
                        <td>{detalle.nombreMedicina}</td>
                        <td>{detalle.cantidad}</td>
                        <td>
                          {(
                            Number(detalle.precioMedicina) * detalle.cantidad
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  {FirmaDigital && (
                    <tr>
                      <td colSpan="3" className="text-center py-3">
                        <div className=" w-full flex justify-center">
                          <img src={FirmaDigital} alt="FirmaDigital" />
                        </div>
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td colSpan="3" className="text-center py-3">
                      <button
                        className="bg-verde hover:bg-verde text-white font-bold py-1 px-2 rounded "
                        onClick={() => {
                          setModalFirma(true);
                          setModalEntrega(false);
                        }}>
                        Firma Digital
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex flex-row justify-center gap-2 my-5">
                <button
                  type="button"
                  onClick={() => {
                    setModalEntrega(false);
                    setModalInfo(true);
                    setFirmaDigital(null);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {ModalFirma && (
        <div className="fixed  inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="flex flex-col bg-white w-11/12 border rounded-md">
            <h3 className="text-center text-2xl my-2">Firma del cliente</h3>
            <div className="flex flex-col">
              <div className="flex flex-row justify-center gap-5">
                <SignatureCanvas
                  penColor="black"
                  canvasProps={{
                    width: 300,
                    height: 200,
                    className: "sigCanvas border-2",
                  }}
                  ref={sigCanvas}
                />
              </div>
              <div className="flex flex-row justify-center gap-2 my-5">
                <button
                  type="button"
                  onClick={CrearFirma}
                  className="bg-verde hover:bg-verde text-white font-bold py-2 px-4 rounded mr-2">
                  Guardar
                </button>
                <button
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                  onClick={() => sigCanvas.current.clear()}>
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalFirma(false);
                    setModalEntrega(true);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-center text-3xl">Rutas para los Pedidos</h1>
      <div className=" h-full z-10">
        <MapContainer center={position} zoom={20} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RoutesMarker
            Asegurado={Asegurado}
            Receta={Receta}
            Pedido={Pedidos}
            mostrarinfo={MostrarInfo}
          />
        </MapContainer>
      </div>
    </div>
  );
}
