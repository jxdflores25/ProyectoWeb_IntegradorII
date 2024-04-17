import axios from "axios";

const URLAsegurado = "http://127.0.0.1:8000/Seguro/Asegurado/Asegurado/";
const URLAdministrador =
  "http://127.0.0.1:8000/Seguro/Administrador/Administrador/";

const URLConductor = "http://127.0.0.1:8000/Seguro/Conductor/Conductor/";

export const GetAsegurado = async (DNI) => {
  try {
    return await axios.get(URLAsegurado + DNI);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
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
