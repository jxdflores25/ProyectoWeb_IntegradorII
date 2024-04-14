import axios from "axios";

const URLRecetaMedica =
  "http://127.0.0.1:8000/Hospital/RecetaMedica/RecetaMedica/";
const URLRecetaMedicina =
  "http://127.0.0.1:8000/Hospital/RecetaMedicina/RecetaMedicina/";

export const GuardarRecetaMedica = (DNI, NombreMedico) => {
  return axios.post(URLRecetaMedica, {
    dni_Paciente: DNI,
    nombre_Medico: NombreMedico,
  });
};

export const GuardarRecetaMedicina = (ID_Receta, Medicinas) => {
  for (let i = 0; i < Medicinas.length; i++) {
    axios.post(URLRecetaMedicina, {
      id_receta: ID_Receta,
      id_medicina: Medicinas[i].medicamento,
      cantidad: Medicinas[i].cantidad,
      description: Medicinas[i].descripcion,
    });
  }
};
