import axios from "axios";
import boleta from "./boleta";
import {
  GetAsegurado,
  GetMedicinaIDReceta,
  GetMedicinaSeguro,
} from "../API/API_Seguro";

export default async function DescargarBoleta(RecetaID, fecha) {
  const receta = await GetMedicinaIDReceta(RecetaID);
  const asegurado = await GetAsegurado(localStorage.getItem("usuario"));

  let Desc = 0;

  switch (asegurado.data.TipoSeguro) {
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

  let totalpago = 0;

  for (const element of receta.data) {
    const med = await GetMedicinaSeguro(element.id_medicina);
    element.nombre = med.data.nombre;
    element.precio = med.data.precio;
    element.total = String(
      (Number(med.data.precio) * element.cantidad).toFixed(2)
    );
    totalpago += Number(med.data.precio) * element.cantidad;
  }

  let Copago = totalpago * Desc;

  receta.data.total = String(totalpago.toFixed(2));
  receta.data.fecha = fecha;
  receta.data.copago = String(Copago.toFixed(2));
  receta.data.totalpago = String((totalpago - Copago).toFixed(2));
  receta.data.seguro = asegurado.data.TipoSeguro;
  receta.data.nombre_asegurado =
    asegurado.data.nombre + " " + asegurado.data.apellido;
  // Crear un nuevo documento PDF con jsPDF
  const doc = boleta(receta.data);

  // Obtener el PDF como Blob
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
