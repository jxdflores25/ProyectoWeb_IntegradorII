import axios from "axios";
import {
  GetAsegurado,
  GetConductor,
  GetMedicinaIDReceta,
  GetMedicinaSeguro,
  PostGuia,
} from "../API/API_Seguro";
import Fecha from "./FechaTime";
import Guia from "./guia";

export default async function CrearGuia(RecetaID, ConductorDNI, PedidoID) {
  const { fechaHoy } = Fecha();
  const receta = await GetMedicinaIDReceta(RecetaID);
  const asegurado = await GetAsegurado(localStorage.getItem("usuario"));
  const conductor = await GetConductor(ConductorDNI);

  const nuevaGuia = {
    id_pedido: PedidoID,
  };
  const GuiaPedido = await PostGuia(nuevaGuia);

  for (const element of receta.data) {
    const med = await GetMedicinaSeguro(element.id_medicina);
    element.nombre = med.data.nombre;
    element.codigo = med.data.id;
  }

  const responseDirecc = await axios.get(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${asegurado.data.Latitud}&lon=${asegurado.data.Longitud}`
  );
  const direc = responseDirecc.data.display_name
    .split(",")
    .map((item) => item.trim());

  receta.data.fecha = fechaHoy;
  receta.data.seguro = asegurado.data.TipoSeguro;
  receta.data.nombre_asegurado =
    asegurado.data.nombre + " " + asegurado.data.apellido;
  receta.data.dni = asegurado.data.dni;
  receta.data.direccion =
    direc[0] +
    ", " +
    direc[1] +
    ", " +
    direc[2] +
    ", " +
    direc[3] +
    ", " +
    direc[4];
  receta.data.guiaid = GuiaPedido.data.id;

  const doc = Guia(receta.data, conductor.data);
  const pdfBlob = doc.output("blob");

  // Crear un FormData y añadir el archivo y las contraseñas
  const formData = new FormData();
  formData.append("file", pdfBlob, "document.pdf");
  formData.append("user_password", asegurado.data.dni);
  formData.append("owner_password", asegurado.data.dni);

  const response = await axios.post(
    "http://localhost:8000/Seguro/add-password/",
    formData,
    {
      responseType: "blob",
    }
  );

  return response.data;
}
