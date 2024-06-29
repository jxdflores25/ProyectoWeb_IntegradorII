import { useEffect, useRef, useState } from "react";
import { GetConductor, GetOnePedido } from "../../API/API_Seguro";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import IconTime from "../../assets/Icons/IconTime";
import IconDistance from "../../assets/Icons/IconDistance";

export function Seguimiento() {
  const [Waypoint, setWaypoint] = useState();
  const [TiempoEspera, setTiempoEspera] = useState();
  const [Distancia, setDistancia] = useState();

  const [Conductor, setConductor] = useState();
  const [Pedido, setPedido] = useState();
  const [ModalConfirmar, setModalConfirmar] = useState(false);

  const intervalRef = useRef(null);

  useEffect(() => {
    const pedidos = async () => {
      intervalRef.current = setInterval(async () => {
        const Pedido = await GetOnePedido(
          localStorage.getItem("PedidoAsegurado")
        );
        setPedido(Pedido);
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
      }, 10000);
    };

    //
    pedidos();
  }, []);

  const stopInterval = () => {
    clearInterval(intervalRef.current);
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
        createMarker: function (i, waypoint, n) {
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
        setTiempoEspera((summary.totalTime / 60).toFixed(2));
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
          <div className="flex flex-col justify-center gap-3 bg-white size-56 border-dashed border-2 border-gray-700 rounded-md">
            <div className="flex justify-center">
              <h2 className="text-center w-2/3">Su pedido ha sido entregado</h2>
            </div>
            <div className="flex justify-center">
              <button
                type="button"
                className="bg-verde hover:bg-verde text-white font-bold py-2 px-4 rounded">
                Confirmar Entrega
              </button>
            </div>
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
        <div className="flex flex-col py-3 px-5 gap-2">
          <h2 className=" text-3xl font-bold">
            {Distancia < 1 ? <>Esta por llegar</> : <>En Camino</>}
          </h2>
          <h2 className=" flex gap-2">
            <IconTime /> Llegada aproximada en {TiempoEspera} min
          </h2>
          <h2 className=" flex gap-2">
            <IconDistance /> Distancia aproximada de {Distancia} km
          </h2>
          <h2>
            Conductor: {Conductor ? Conductor.nombre : ""}
            {Conductor ? Conductor.apellido : ""}
          </h2>
        </div>
      </div>
    </div>
  );
}
