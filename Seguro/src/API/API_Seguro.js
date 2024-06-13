import axios from "axios";

const URLAsegurado = "http://127.0.0.1:8000/Seguro/Asegurado/";

const URLAdministrador = "http://127.0.0.1:8000/Seguro/Administrador/";

const URLConductor = "http://127.0.0.1:8000/Seguro/Conductor/";
const URLConductorDireccion =
  "http://127.0.0.1:8000/Seguro/ConductorDireccion/";

const URLRecetaHospital = "http://127.0.0.1:8080/Hospital/RecetaMedicaFecha/";

const URLMedicina = "http://127.0.0.1:8080/Hospital/RecetaDetalle/";
const URLMedicinaNombre = "http://localhost:8000/Seguro/Medicina/";
const URLMedicinaDetalleSeguro = "http://localhost:8000/Seguro/RecetaMedicina/";
const URLMedicinaIDReceta = "http://localhost:8000/Seguro/RecetaIDMedicina/";

const URLPedidosPrioridad = "http://localhost:8000/Seguro/PedidoPrioridad/";
const URLPedido = "http://localhost:8000/Seguro/Pedido/";
const URLPedidoConductor = "http://localhost:8000/Seguro/PedidoConductor/";

const URLKardexMedicina = "http://localhost:8000/Seguro/KardexMedicina/";
const URLKardex = "http://localhost:8000/Seguro/Kardex/";

const URLRecetaSeguro = "http://localhost:8000/Seguro/Receta/";
const URLRecetaIDHospital = "http://localhost:8000/Seguro/RecetaIDHospital/";

export const GetAsegurado = async (DNI) => {
  try {
    return await axios.get(URLAsegurado + DNI);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const GetAsegurados = async () => {
  try {
    return await axios.get(URLAsegurado);
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

export const PostAsegurado = async (data) => {
  try {
    return await axios.post(URLAsegurado, data);
  } catch (error) {
    return null;
  }
};

export const DeleteAsegurado = async (DNI) => {
  try {
    return await axios.delete(URLAsegurado + DNI + "/");
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

export const GetConductorDireccion = async (Direccion) => {
  try {
    return await axios.get(URLConductorDireccion + Direccion);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const GetConductores = async () => {
  try {
    return await axios.get(URLConductor);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const PutConductor = async (DNI, data) => {
  try {
    return await axios.put(URLConductor + DNI + "/", data);
  } catch (error) {
    return null;
  }
};

export const PostConductor = async (data) => {
  try {
    return await axios.post(URLConductor, data);
  } catch (error) {
    return null;
  }
};

export const DeleteConductor = async (DNI) => {
  try {
    return await axios.delete(URLConductor + DNI + "/");
  } catch (error) {
    return null;
  }
};

export const GetRecetas = async (fecha, horaInicio, horaFin) => {
  try {
    return await axios.get(
      URLRecetaHospital + fecha + "/" + horaInicio + "/" + horaFin
    );
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

export const GetMedicinasSeguro = async () => {
  try {
    return await axios.get(URLMedicinaNombre);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const GetMedicinaSeguro = async (id) => {
  try {
    return await axios.get(URLMedicinaNombre + id);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const PostMedicinaSeguro = async (ID_Receta, Medicina) => {
  for (let i = 0; i < Medicina.length; i++) {
    axios.post(URLMedicinaDetalleSeguro, {
      id_receta: ID_Receta,
      id_medicina: Medicina[i].id_medicina,
      cantidad: Medicina[i].cantidad,
      descripcion: Medicina[i].description,
    });
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

export const GetMedicinaIDReceta = async (id) => {
  try {
    return await axios.get(URLMedicinaIDReceta + id);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const GetKardex = async (id) => {
  try {
    return await axios.get(URLKardexMedicina + id);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const PutKardex = async (id, data) => {
  try {
    return await axios.put(URLKardex + id + "/", data);
  } catch (error) {
    return null;
  }
};

export const PostKardex = async (data) => {
  try {
    return await axios.post(URLKardex, data);
  } catch (error) {
    return null;
  }
};

export const GetPedidoPrioridad = async (
  fecha,
  prioridad,
  conductor,
  status
) => {
  try {
    return await axios.get(
      URLPedidosPrioridad +
        fecha +
        "/" +
        prioridad +
        "/" +
        conductor +
        "/" +
        status
    );
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const GetPedidoConductor = async (fecha, prioridad, conductor) => {
  try {
    return await axios.get(
      URLPedidoConductor + fecha + "/" + prioridad + "/" + conductor
    );
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const GetRecetaSeguroID = async (id) => {
  try {
    return await axios.get(URLRecetaIDHospital + id);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const GetRecetaSeguro = async (id) => {
  try {
    return await axios.get(URLRecetaSeguro + id);
  } catch (error) {
    if (error.response.status === 404) {
      return null;
    }
  }
};

export const PostRecetaSeguro = async (data) => {
  try {
    return await axios.post(URLRecetaSeguro, data);
  } catch (error) {
    return null;
  }
};

export const GetPedido = async () => {
  try {
    return await axios.get(URLPedido);
  } catch (error) {
    return null;
  }
};

export const PostPedido = async (data) => {
  try {
    return await axios.post(URLPedido, data);
  } catch (error) {
    return null;
  }
};

export const PutPedido = async (id, data) => {
  try {
    return await axios.put(URLPedido + id + "/", data);
  } catch (error) {
    return null;
  }
};
