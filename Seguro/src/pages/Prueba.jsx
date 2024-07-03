import axios from "axios";
import boleta from "../constants/boleta";
import {
  GetAsegurado,
  GetMedicinaIDReceta,
  GetMedicinaSeguro,
} from "../API/API_Seguro";
import Fecha from "../constants/FechaTime";
import CrearGuia from "../constants/CrearGuia";

export default function Prueba() {
  const generatePdf = async () => {
    CrearGuia("30", "52032658");
  };
  const obtenerDireccion = async () => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=-12.1223248&lon=-76.9849271`
      );
      if (response.data.display_name) {
        const direc = response.data.display_name
          .split(",")
          .map((item) => item.trim());
        console.log(direc);
      } else {
        console.log("No se pudo encontrar la dirección.");
      }
    } catch (error) {
      console.log("Error en la solicitud.");
    }
  };
  return (
    <div>
      <button onClick={generatePdf} type="submit">
        Generar PDF con contraseña
      </button>
      <button onClick={obtenerDireccion}>Obtener Dirección</button>
    </div>
  );
}
