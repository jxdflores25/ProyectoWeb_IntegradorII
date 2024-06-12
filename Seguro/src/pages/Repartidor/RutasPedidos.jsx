import { createContext, useEffect, useState } from "react";
import {
  GetAsegurado,
  GetPedidoPrioridad,
  GetRecetaSeguro,
} from "../../API/API_Seguro";
import Fecha from "../../constants/FechaTime";
import RoutesMarker from "./Routes/LeafletRoute";
import { MapContainer, TileLayer } from "react-leaflet";


export default function RutasPedidos() {
  const [Pedidos, setPedidos] = useState([]);
  const [Receta, setReceta] = useState([]);
  const [Asegurado, setAsegurado] = useState([]);
  useEffect(() => {
    const { fechaConsulta } = Fecha();
    const pedidos = async () => {
      const pedidos = await GetPedidoPrioridad(
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

  return (
    <div className="flex flex-col w-full h-full ">
      <h1 className="text-center text-3xl">Rutas para los Pedidos</h1>
      <div className=" h-full z-10">
        <MapContainer center={position} zoom={20} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <RoutesMarker Asegurado={Asegurado} Receta={Receta} />
        </MapContainer>
      </div>
    </div>
  );
}
