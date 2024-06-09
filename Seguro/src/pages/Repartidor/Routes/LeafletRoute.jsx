import { useContext, useEffect, useState } from "react";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useMap } from "react-leaflet";
import PropTypes from "prop-types";

const LeafletGeocoder = ({ Asegurado, Receta }) => {
  const map = useMap();
  useEffect(() => {
    var waypoints = [
      { lat: localStorage.getItem("lat"), lng: localStorage.getItem("log") },
    ];
    for (let index = 0; index < Asegurado.length; index++) {
      waypoints.push({
        lat: Asegurado[index].Latitud,
        lng: Asegurado[index].Longitud,
      });
    }
    const Marcador = () => {
      let DefaultIcon = L.icon({
        iconUrl: "/motorcycle-riding.gif",
        iconSize: [50, 50],
      });
      L.marker([localStorage.getItem("lat"), localStorage.getItem("log")], {
        icon: DefaultIcon,
      }).addTo(map);
      L.Routing.control({
        waypoints: waypoints,
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
        language: "es",
      }).addTo(map);
    };
    Marcador();
  }, [Asegurado]);
  return null;
};

export default LeafletGeocoder;
LeafletGeocoder.propTypes = {
  Asegurado: PropTypes.array.isRequired,
  Receta: PropTypes.array.isRequired,
};
