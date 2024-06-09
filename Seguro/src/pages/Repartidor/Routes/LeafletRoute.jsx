import { useContext, useEffect, useState } from "react";
import "leaflet-routing-machine";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet/dist/leaflet.css";
import L, { Icon } from "leaflet";
import { useMap } from "react-leaflet";
import PropTypes from "prop-types";

const LeafletGeocoder = ({ Asegurado, Receta, Pedido, mostrarinfo }) => {
  const map = useMap();
  useEffect(() => {
    var icons = [
      L.icon({
        iconUrl: "/motorcycle-riding.gif",
        iconSize: [50, 50],
      }),
    ];
    var waypoints = [
      { lat: localStorage.getItem("lat"), lng: localStorage.getItem("log") },
    ];
    var waypointContents = ["<h3>Repartidor</h3>"];
    for (let index = 0; index < Asegurado.length; index++) {
      waypoints.push({
        lat: Asegurado[index].Latitud,
        lng: Asegurado[index].Longitud,
      });
      icons.push(
        L.icon({
          iconUrl: "/icons/marker-icon-" + (index + 1) + ".png",
          iconSize: [25, 41], // tamaño del icono
          iconAnchor: [12, 41], // punto del icono que corresponde a la posición del marcador
          popupAnchor: [1, -34], // punto desde donde se abrirá el popup relativo al icono
        })
      );
      waypointContents.push(
        "<h3>Entrega N°" +
          (index + 1) +
          "</h3> <p>ID de Entrega:" +
          Pedido[index].id +
          " </p><button id='btn-" +
          (index + 1) +
          "'>Mostar Info</button>"
      );
    }
    const Marcador = () => {
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

        createMarker: function (i, waypoint, n) {
          // Usar el icono personalizado y agregar un popup con el nombre
          const marker = L.marker(waypoint.latLng, {
            icon: icons[i],
          }).bindPopup(waypointContents[i]);

          // Agregar el evento popupopen para añadir manejadores de eventos al contenido HTML del popup
          marker.on("popupopen", function () {
            // Agregar el evento click al botón dentro del popup
            const button = document.getElementById(`btn-${i}`);
            if (button) {
              button.addEventListener("click", function () {
                mostrarinfo(i);
              });
            }
          });

          return marker;
        },
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
  Pedido: PropTypes.array.isRequired,
  mostrarinfo: PropTypes.func.isRequired,
};
