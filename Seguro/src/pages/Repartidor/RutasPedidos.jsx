import { useEffect, useRef, useState } from "react";
import {
  GetAsegurado,
  GetMedicinaIDReceta,
  GetMedicinaNombre,
  GetPedidoConductor,
  GetPedidoPrioridad,
  GetRecetaSeguro,
  PostPedido,
  PutPedido,
} from "../../API/API_Seguro";
import Fecha from "../../constants/FechaTime";
import RoutesMarker from "./Routes/LeafletRoute";
import { MapContainer, TileLayer } from "react-leaflet";
import IconWaze from "../../assets/Icons/IconWaze";
import SignatureCanvas from "react-signature-canvas";
import { Slide, ToastContainer, toast } from "react-toastify";
import axios from "axios";
import IconDetail from "../../assets/Icons/IconDetail";

export default function RutasPedidos() {
  const [Pedidos, setPedidos] = useState([]);
  const [Receta, setReceta] = useState([]);
  const [Asegurado, setAsegurado] = useState([]);
  const [DetalleEntrega, setDetalleEntrega] = useState([]);
  const [PedidosInfo, setPedidosInfo] = useState([]);

  const [ModalInfo, setModalInfo] = useState(false);
  const [ModalEntrega, setModalEntrega] = useState(false);
  const [ModalFirma, setModalFirma] = useState(false);
  const [ModalPedidos, setModalPedidos] = useState(false);
  const [InfoPedido, setInfoPedido] = useState([]);
  const [FirmaDigital, setFirmaDigital] = useState(null);

  const [DNImagen, setDNImagen] = useState(null);
  const [DNIFile, setDNIFile] = useState(null);
  const InputDni = useRef(null);

  const sigCanvas = useRef();

  const { fechaConsulta } = Fecha();

  useEffect(() => {
    if (localStorage.getItem("PedidoEntregado")) {
      toast.success("Se entrego correctamente el pedido");
      localStorage.removeItem("PedidoEntregado");
    }
    
    const pedidos = async () => {
      const pedidos = await GetPedidoPrioridad(
        //"2024-05-30",
        fechaConsulta,
        localStorage.getItem("PrioridadPedidos"),
        localStorage.getItem("usuario"),
        "EnCurso"
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

  const MostrarPedidos = async () => {
    const pedi = await GetPedidoConductor(
      //"2024-05-30",
      fechaConsulta,
      localStorage.getItem("PrioridadPedidos"),
      localStorage.getItem("usuario")
    );

    for (let index = 0; index < pedi.data.length; index++) {
      if (pedi.data[index].estatus === "EnCurso") {
        pedi.data[index].estatus = "En Curso";
      }
    }

    setPedidosInfo(pedi.data);
    setModalPedidos(true);
    console.log(pedi.data);
  };

  const MostrarInfo = (id) => {
    if (id !== 1) {
      toast.warning("Complete la primera entrega primero");
      return;
    }

    setModalInfo(true);
    var Info = [];
    Info.push(Pedidos[id - 1].id);
    Info.push(Asegurado[id - 1].nombre);
    Info.push(Asegurado[id - 1].dni);
    Info.push(Receta[id - 1].id);
    Info.push(Asegurado[id - 1].Latitud);
    Info.push(Asegurado[id - 1].Longitud);
    Info.push(id - 1);
    Info.push(Asegurado[id - 1].TipoSeguro);
    setInfoPedido(Info);
  };

  const MostrarEntrega = async () => {
    const med = await GetMedicinaIDReceta(InfoPedido[3]);
    const medicina = await NombreMedicina(med.data);

    var TotalPago = 0;

    for (let index = 0; index < medicina.length; index++) {
      TotalPago =
        TotalPago +
        Number(medicina[index].precioMedicina) * medicina[index].cantidad;
    }

    var Desc = 0;

    switch (Asegurado[InfoPedido[6]].TipoSeguro) {
      case "Pacifico":
        Desc = 0.7;
        break;
      case "Mapfre":
        Desc = 0.8;
        break;
      case "Rimac":
        Desc = 1;
        break;
    }

    var CoPago = TotalPago * Desc;

    var Info = InfoPedido;
    Info.push(TotalPago.toFixed(2));
    Info.push(CoPago.toFixed(2));

    setInfoPedido(Info);
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
    if (!sigCanvas.current.isEmpty()) {
      const URL = sigCanvas.current.getTrimmedCanvas().toDataURL("image/png");
      setFirmaDigital(URL);
      setModalFirma(false);
      setModalEntrega(true);
    }else{
      toast.warning("Porfavor ingrese una firma");
    }
    
  };

  const MostrarImagen = (e) => {
    if (e.target.files && e.target.files[0]) {
      setDNImagen(URL.createObjectURL(e.target.files[0]));
      setDNIFile(e.target.files[0]);
    }
  };

  const SubirDni = () => {
    InputDni.current.click();
  };

  const FinalizarEntrega = async () => {
    if (!FirmaDigital) {
      toast.warning("ingrese la Firma Digital");
      return;
    }
    if (!DNIFile) {
      toast.warning("ingrese la imagen del DNI");
      return;
    }
    const SubirFirma = await SubirImagenes(FirmaDigital);
    const SubirDNI = await SubirImagenes(DNIFile);

    if (!SubirFirma) {
      toast.warning("Error al subir Firma Digital");
      return;
    }

    if (!SubirDNI) {
      toast.warning("Error al subir  imagen del DNI");
      return;
    }

    console.log(Pedidos[InfoPedido[6]]);

    Pedidos[InfoPedido[6]].dni_img = SubirDNI;
    Pedidos[InfoPedido[6]].firma_digital = SubirFirma;
    Pedidos[InfoPedido[6]].estatus = "Finalizado";

    const resp = await PutPedido(InfoPedido[0], Pedidos[InfoPedido[6]]);

    if (resp !== null) {
      localStorage.setItem("PedidoEntregado", true);
      localStorage.setItem("lat", Asegurado[InfoPedido[6]].Latitud);
      localStorage.setItem("log", Asegurado[InfoPedido[6]].Longitud);
      setModalEntrega(false);
      window.location.reload();
    } else {
      toast.warning("Hubo algun error al completar el pedido");
    }
  };

  const SubirImagenes = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "IntegradorProyector");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dauazz3dm/image/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data.secure_url;
    } catch (error) {
      return null;
    }
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
                <p>DNI: {InfoPedido[2]}</p>
                <p>Nombre: {InfoPedido[1]}</p>
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
                  <td className=" w-1/2">Seguro:</td>
                  <td>{InfoPedido[7]}</td>
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
                    <th>P. Uni.</th>
                    <th>Precio</th>
                  </tr>
                </thead>
                <tbody>
                  {DetalleEntrega &&
                    DetalleEntrega.map((detalle) => (
                      <tr key={detalle.id} className="text-center">
                        <td>{detalle.nombreMedicina}</td>
                        <td>{detalle.cantidad}</td>
                        <td>S/.{detalle.precioMedicina}</td>
                        <td>
                          S/.
                          {(
                            Number(detalle.precioMedicina) * detalle.cantidad
                          ).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  <tr className="text-center font-bold">
                    <td colSpan="3">Total a Pagar</td>
                    <td> S/.{InfoPedido[8]}</td>
                  </tr>
                  <tr className="text-center font-bold">
                    <td colSpan="3">CoPago</td>
                    <td> S/.{InfoPedido[9]}</td>
                  </tr>
                  {FirmaDigital && (
                    <tr>
                      <td colSpan="4" className="text-center py-3">
                        <div className=" w-full flex justify-center">
                          <img
                            src={FirmaDigital}
                            alt="FirmaDigital"
                            className=" h-1/5"
                          />
                        </div>
                      </td>
                    </tr>
                  )}

                  <tr>
                    <td colSpan="4" className="text-center py-3">
                      <button
                        className="bg-celeste  hover:bg-celeste text-white font-bold py-1 px-2 rounded "
                        onClick={() => {
                          setModalFirma(true);
                          setModalEntrega(false);
                        }}>
                        Firma Digital
                      </button>
                    </td>
                  </tr>
                  {DNImagen && (
                    <tr>
                      <td colSpan="4" className="text-center py-3">
                        <div className=" w-full flex justify-center">
                          <img
                            src={DNImagen}
                            alt="Selected"
                            className=" w-1/2"
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="4" className="text-center py-3">
                      <button
                        className="bg-celeste  hover:bg-celeste text-white font-bold py-1 px-2 rounded "
                        onClick={SubirDni}>
                        Foto DNI
                      </button>
                      <input
                        type="file"
                        ref={InputDni}
                        style={{ display: "none" }}
                        onChange={MostrarImagen}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="flex flex-row justify-center gap-2 my-5">
                <button
                  type="button"
                  onClick={FinalizarEntrega}
                  className="bg-verde hover:bg-verde text-white font-bold py-2 px-4 rounded mr-2">
                  Finalizar Entrega
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalEntrega(false);
                    setModalInfo(true);
                    setFirmaDigital(null);
                    setDNImagen(null);
                    setDNIFile(null);
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
                  Borrar
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

      {ModalPedidos && (
        <div className="fixed  inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="flex flex-col bg-white w-11/12 border rounded-md">
            <h3 className="text-center text-2xl my-2">
              Informacion del Estado de los Pedidos
            </h3>
            <table>
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th>Nro Pedido</th>
                  <th>Nro Receta</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {PedidosInfo &&
                  PedidosInfo.map((pedido) => (
                    <tr
                      key={pedido.id}
                      className="text-center border-b border-gray-200">
                      <td>{pedido.id}</td>
                      <td>{pedido.id_receta}</td>
                      <td>{pedido.estatus}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="flex flex-row justify-center gap-2 my-5">
              <button
                type="button"
                onClick={() => {
                  setModalPedidos(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className=" flex gap-3 justify-center">
        <h1 className="text-center text-3xl">Rutas para los Pedidos</h1>
        <div onClick={MostrarPedidos}>
          <IconDetail />
        </div>
      </div>
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
