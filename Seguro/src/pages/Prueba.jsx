import { MapContainer, TileLayer } from "react-leaflet";
import { GetKardex } from "../API/API_Seguro";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap } from "react-leaflet";

export default function Prueba() {
  const position = [-12.20237464, -76.9427];
  const RoutesMarker = () => {
    let DefaultIcon = L.icon({
      iconUrl: "/motorcycle-riding.gif",
      iconSize: [50, 50],
    });
    const map = useMap();
    L.marker([-12.192539, -76.9534792], {
      icon: DefaultIcon,
    }).addTo(map);
    L.Routing.control({
      waypoints: [
        L.latLng(-12.192539, -76.9534792),
        L.latLng(-12.1928851, -76.9482086),
        L.latLng(-12.1728851, -76.9482086),
        L.latLng(-12.1728851, -76.9282086),
      ],
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
      showAlternatives: true,
      addWaypoints: false,
    }).addTo(map);
  };
  return (
    <div className="h-full w-full">
      Pruebas
      <div className="h-full">
        <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RoutesMarker />
        </MapContainer>
      </div>
    </div>
  );
}
