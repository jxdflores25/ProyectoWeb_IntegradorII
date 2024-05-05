import axios from "axios";

const URLAsegurado = "http://127.0.0.1:8000/Seguro/Asegurado/";
const URLAdministrador = "http://127.0.0.1:8000/Seguro/Administrador/";

const URLConductor = "http://127.0.0.1:8000/Seguro/Conductor/";

const URLReceta = "http://127.0.0.1:8080/Hospital/RecetaMedicaFecha/";

const URLMedicina = "http://127.0.0.1:8080/Hospital/RecetaDetalle/";
const URLMedicinaNombre = "http://localhost:8000/Seguro/Medicina/";
const URLKardex = "http://localhost:8000/Seguro/KardexMedicina/";

export const GetAsegurado = async (DNI) => {
  try {
    return await axios.get(URLAsegurado + DNI);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const PutAsegurado = async (DNI, data) => {
  try {
    return await axios.put(URLAsegurado + DNI + "/", data);
  } catch (error) {
    return null;
  }
};

export const GetAdministrador = async (DNI) => {
  try {
    return await axios.get(URLAdministrador + DNI);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const GetConductor = async (DNI) => {
  try {
    return await axios.get(URLConductor + DNI);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const GetRecetas = async (fecha, hora) => {
  try {
    return await axios.get(URLReceta + fecha + "/" + hora);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const GetMedicina = async (receta) => {
  try {
    return await axios.get(URLMedicina + receta);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const GetMedicinaNombre = async (id) => {
  try {
    return await axios.get(URLMedicinaNombre + id);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const GetKardex = async (id) => {
  try {
    return await axios.get(URLKardex + id);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};
