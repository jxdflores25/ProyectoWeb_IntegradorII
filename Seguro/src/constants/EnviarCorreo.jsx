import axios from "axios";
import { GetAsegurado } from "../API/API_Seguro";
export default async function EnvioCorreo(Boleta, Guia) {
  const formData = new FormData();
  const asegurado = await GetAsegurado(localStorage.getItem("usuario"));
  formData.append(
    "name",
    asegurado.data.nombre + " " + asegurado.data.apellido
  );
  formData.append(
    "dni",
    ".".repeat(asegurado.data.dni.length - 3) + asegurado.data.dni.slice(-3)
  );
  formData.append("email", "jxdflores25@gmail.com");

  const pdfFile1 = new File([Boleta], "boleta.pdf", {
    type: "application/pdf",
  });
  const pdfFile2 = new File([Guia], "boleta.pdf", {
    type: "application/pdf",
  });
  formData.append("pdf1", pdfFile1);
  formData.append("pdf2", pdfFile2);
  const response = await axios.post(
    "http://localhost:8000/Seguro/send-email/",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  if (response.status === 200) {
    return "200";
  }
}
