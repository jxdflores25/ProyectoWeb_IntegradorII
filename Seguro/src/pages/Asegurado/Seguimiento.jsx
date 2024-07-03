import { useEffect, useRef, useState } from "react";
import { GetConductor, GetOnePedido, PutPedido } from "../../API/API_Seguro";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import IconTime from "../../assets/Icons/IconTime";
import IconDistance from "../../assets/Icons/IconDistance";
import { Slide, ToastContainer, toast } from "react-toastify";
import CrearBoleta from "../../constants/CrearBoleta.jsx";
import EnvioCorreo from "../../constants/EnviarCorreo.jsx";
import CrearGuia from "../../constants/CrearGuia.jsx";

export function Seguimiento() {
  const [Waypoint, setWaypoint] = useState();
  const [TiempoEspera, setTiempoEspera] = useState();
  const [Distancia, setDistancia] = useState();

  const [Conductor, setConductor] = useState();
  const [Pedido, setPedido] = useState();
  const [ModalConfirmar, setModalConfirmar] = useState(false);
  const [ModalFinalizar, setModalFinalizar] = useState(false);

  const [LoadingConfirmar, setLoadingConfirmar] = useState(false);

  const [Boleta, setBoleta] = useState();
  const [GuiaR, setGuiaR] = useState();

  const intervalRef = useRef(null);

  const stopInterval = () => {
    clearInterval(intervalRef.current);
  };

  useEffect(() => {
    const pedidos = async () => {
      intervalRef.current = setInterval(async () => {
        const Pedido = await GetOnePedido(
          localStorage.getItem("PedidoAsegurado")
        );
        setPedido(Pedido.data);
        if (Pedido.data.estatus === "Entregado") {
          setModalConfirmar(true);
          stopInterval();
        }
        const Conductor = await GetConductor(Pedido.data.id_conductor);
        setConductor(Conductor.data);

        const waypoints = [
          { lat: Conductor.data.Latitud, lng: Conductor.data.Longitud },
          {
            lat: localStorage.getItem("lat"),
            lng: localStorage.getItem("log"),
          },
        ];
        setWaypoint(waypoints);
      }, 5000);
    };

    //
    pedidos();
  }, []);

  const ConfirmarEntrega = async () => {
    if (Pedido != null) {
      Pedido.estatus = "Finalizado";
      setLoadingConfirmar(true);
      const ped = await PutPedido(Pedido.id, Pedido);
      const boleta = await CrearBoleta(Pedido.id_receta);
      const guia = await CrearGuia(Pedido.id_receta, Pedido.id_conductor);
      const envio = await EnvioCorreo(boleta, guia);
      if (ped.status == 200) {
        setModalConfirmar(false);
        setModalFinalizar(true);
        setBoleta(boleta);
        setGuiaR(guia);
        if (envio == "200") {
          toast.success("Se enviaron los documentos al correo");
        }
      } else {
        toast.warning("Ocurrio un problema al confirmar la entrega");
      }
    }
  };

  const DescargarBoleta = async () => {
    const url = window.URL.createObjectURL(new Blob([Boleta]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "boleta.pdf");
    document.body.appendChild(link);
    link.click();
  };

  const DescargarGuia = async () => {
    const url = window.URL.createObjectURL(new Blob([GuiaR]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "GuiaRemision.pdf");
    document.body.appendChild(link);
    link.click();
  };

  const onClose = () => {
    localStorage.removeItem("PedidoAsegurado");
    window.location.href = "/Asegurado";
  };

  const LocationMarker = () => {
    const map = useMap();
    const [routingControl, setRoutingControl] = useState(null);

    useEffect(() => {
      let icons = [
        L.icon({
          iconUrl: "/motorcycle-riding.gif",
          iconSize: [50, 50],
        }),
      ];
      icons.push(
        L.icon({
          iconUrl: "/icons/marker-icon-1.png",
          iconSize: [25, 41], // tamaño del icono
          iconAnchor: [12, 41], // punto del icono que corresponde a la posición del marcador
          popupAnchor: [1, -34], // punto desde donde se abrirá el popup relativo al icono
        })
      );

      if (routingControl) {
        map.removeControl(routingControl);
      }

      const newRoutingControl = L.Routing.control({
        waypoints: Waypoint,
        lineOptions: {
          styles: [
            {
              color: "blue",
              weight: 4,
              opacity: 0.7,
            },
          ],
        },
        routeWhileDragging: true,
        draggableWaypoints: false,
        fitSelectedRoutes: true,
        showAlternatives: false,
        show: false,
        addWaypoints: false,
        language: "es",
        createMarker: function (i, waypoint) {
          const marker = L.marker(waypoint.latLng, {
            icon: icons[i],
          });
          return marker;
        },
      }).addTo(map);

      newRoutingControl.on("routesfound", function (e) {
        let routes = e.routes;
        let summary = routes[0].summary;

        setDistancia((summary.totalDistance / 1000).toFixed(2));
        setTiempoEspera((summary.totalTime / 60).toFixed(0));
      });

      setRoutingControl(newRoutingControl);

      return () => {
        if (map && newRoutingControl) {
          map.removeControl(newRoutingControl);
        }
      };
    }, []);
  };
  return (
    <div className="flex flex-col h-full z-10">
      {ModalConfirmar && (
        <div className="fixed  inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          {LoadingConfirmar ? (
            <div className="flex flex-col justify-center gap-3 bg-white size-56 border-dashed border-2 border-gray-700 rounded-md">
              <div className="flex items-center justify-center h-full">
                <div className="w-16 h-16 border-4 border-verde border-dashed rounded-full animate-spin"></div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col justify-center gap-3 bg-white size-56 border-dashed border-2 border-gray-700 rounded-md">
              <div className="flex justify-center">
                <h2 className="text-center w-2/3">
                  Su pedido ha sido entregado
                </h2>
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={ConfirmarEntrega}
                  className="bg-verde hover:bg-verde text-white font-bold py-2 px-4 rounded">
                  Confirmar Entrega
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      {ModalFinalizar && (
        <div className="fixed  inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-xl font-bold mb-4 text-center">
              ¡Gracias por confiar en HEALTH EXPRESS!
            </h2>
            <p className="mb-6">
              Para la entrega de su pedido, puede descargar la boleta y la guía
              de remisión a continuación.
            </p>
            <div className="flex justify-between mb-4 gap-2">
              <button
                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                onClick={DescargarBoleta}>
                Descargar Boleta
              </button>
              <button
                className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-600"
                onClick={DescargarGuia}>
                Descargar Guía de Remisión
              </button>
            </div>
            <p className="text-xs mb-2">Tambien se le enviará por correo.</p>
            <p className="text-xs mb-4 font-bold">
              Recuerda: tu numero de DNI es la contraseña.
            </p>
            <button
              onClick={onClose}
              className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600 w-full">
              Regresar
            </button>
          </div>
        </div>
      )}
      <div className="h-4/5 z-10">
        <MapContainer
          center={{
            lat: localStorage.getItem("lat"),
            lng: localStorage.getItem("log"),
          }}
          zoom={16}
          scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker />
        </MapContainer>
      </div>
      <div className="h-1/5 flex flex-col">
        <div className="relative ">
          <div className="overflow-hidden h-2 text-xs flex  bg-gray-200">
            <div className="bg-verde animate-pulse w-full"></div>
          </div>
        </div>
        {TiempoEspera ? (
          <div className="flex flex-col py-3 px-5 gap-2">
            <h2 className=" text-3xl font-bold">
              {Distancia < 1 ? <>Esta por llegar</> : <>En Camino</>}
            </h2>
            <h2 className=" flex gap-2">
              <IconTime />{" "}
              {TiempoEspera == 0
                ? "Porfavor recoja su pedido"
                : "Llegada aproximada en " + TiempoEspera + " min"}
            </h2>
            <h2 className=" flex gap-2">
              <IconDistance /> Distancia aproximada de {Distancia} km
            </h2>
            <h2>
              Conductor: {Conductor ? Conductor.nombre : ""}
              {Conductor ? Conductor.apellido : ""}
            </h2>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-16 h-16 border-4 border-verde border-dashed rounded-full animate-spin"></div>
          </div>
        )}
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
