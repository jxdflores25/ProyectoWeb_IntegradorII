import { useEffect, useState } from "react";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap } from "react-leaflet";
import PropTypes from "prop-types";
import { GetAsegurado, GetRecetaSeguro } from "../../../API/API_Seguro";

const LeafletGeocoder = ({ Data }) => {
  const [Pedidos, setPedidos] = useState();

  const map = useMap();
  useEffect(() => {
    const DataAsegurado = async () => {
      for (let index = 0; index < Data.length; index++) {
        const Receta = await GetRecetaSeguro(Data[index].id_receta);
        console.log(Receta);
        const Asegurado = await GetAsegurado(Receta.data.dni_asegurado);
        console.log(Asegurado);
        Data[index].Asegurado = Asegurado.dni;
        Data[index].RecetaAsegurado = Receta.id;
        Data[index].AseguradoNombre = Asegurado.nombre;
        Data[index].AseguradoTelefono = Asegurado.telefono;
        Data[index].AseguradoDireccion = Asegurado.direccion;
        Data[index].AseguradoUbicacion = {
          lat: Asegurado.Latitud,
          lng: Asegurado.Longitud,
        };
      }
      setPedidos(Data);
    };
    if (!Data) {
      console.log(Data);
      DataAsegurado();
    }

    const Marcador = () => {
      let DefaultIcon = L.icon({
        iconUrl: "/motorcycle-riding.gif",
        iconSize: [50, 50],
      });
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
    Marcador();
  }, []);
  return null;
};

export default LeafletGeocoder;
LeafletGeocoder.propTypes = {
  Data: PropTypes.array.isRequired,
};
