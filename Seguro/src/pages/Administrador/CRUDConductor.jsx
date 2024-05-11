import { useEffect, useState } from "react";
import {
  DeleteConductor,
  GetConductores,
  PostConductor,
  PutConductor,
} from "../../API/API_Seguro";
import { Slide, ToastContainer, toast } from "react-toastify";

const Administrador = () => {
  const [conductores, setConductores] = useState([]);

  useEffect(() => {
    const Datos = async () => {
      const resp = await GetConductores();
      setConductores(resp.data);
    };

    Datos();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [estado, setEstado] = useState(true);
  const [sector, setSector] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [dni, setDni] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const toggleModal = () => {
    // Limpiar los campos solo si no estamos editando
    if (editIndex === null) {
      setNombre("");
      setApellido("");
      setSector("");
      setContraseña("");
      setDni("");
    }
    setModalOpen(!modalOpen);
  };

  const handleAddClick = () => {
    setEditIndex(null);
    // Limpiar los campos
    setNombre("");
    setApellido("");
    setSector("");
    setContraseña("");
    setDni("");
    // Abrir el modal
    toggleModal();
  };

  const handleEditClick = (index) => {
    // Al hacer clic en "Editar", llenamos los campos con los datos correspondientes
    setEditIndex(index);
    // Abrir el modal
    toggleModal();
  };
  useEffect(() => {
    if (editIndex !== null) {
      setNombre(conductores[editIndex].nombre);
      setApellido(conductores[editIndex].apellido || "");
      setSector(conductores[editIndex].direccion || "");
      setEstado(conductores[editIndex].estado);
      setContraseña(conductores[editIndex].contraseña);
      setDni(conductores[editIndex].dni);
    }
  }, [editIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !contraseña || !dni) {
      toast.warning("Por favor completa todos los campos.");
      return; // Evitar enviar el formulario si algún campo está vacío
    }
    if (dni.length !== 8) {
      toast.warning("Ingrese un DNI valido");
      return;
    }

    if (estado === "true") {
      setEstado(true);
    } else {
      setEstado(false);
    }

    //const nuevoAsegurado = { nombre, apellido, direccion, telefono };
    if (editIndex !== null) {
      conductores[editIndex].nombre = nombre;
      conductores[editIndex].apellido = apellido;
      conductores[editIndex].direccion = sector;
      conductores[editIndex].contraseña = contraseña;
      conductores[editIndex].estado = estado;
      conductores[editIndex].dni = dni;
      const res = await PutConductor(dni, conductores[editIndex]);
      if (res !== null) {
        toast.success("Se actulizo correctamente");
      } else {
        toast.error("Ocurrio un problema al actualizar");
      }
      setEditIndex(null);
    } else {
      const nuevoConductor = {
        dni: dni,
        nombre: nombre,
        apellido: apellido,
        contraseña: contraseña,
        direccion: sector,
        ubicacion: null,
        estado: estado,
      };
      const res = await PostConductor(nuevoConductor);
      if (res !== null) {
        toast.success("Se guardado correctamente");
        setConductores([...conductores, nuevoConductor]);
      } else {
        toast.error("Ocurrio un problema al guardar");
      }
    }
    setNombre("");
    setApellido("");
    setSector("");
    setContraseña("");
    setDni("");
    toggleModal();
  };

  const eliminarFila = async (index) => {
    const res = DeleteConductor(conductores[index].dni);
    if (res !== null) {
      toast.success("Se elimino correctamente");
      const nuevoConductores = [...conductores];
      nuevoConductores.splice(index, 1);
      setConductores(nuevoConductores);
    } else {
      toast.error("Ocurrio un problema al eliminar");
    }
  };

  const soloTextoRegex = /^[A-Za-z\s]+$/; // Expresión regular para aceptar solo letras y espacios
  const soloNumerosRegex = /^[0-9]*$/; // Expresión regular para aceptar solo números

  return (
    <div>
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Registro Distribuidor
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="dni"
                  className="block text-sm font-medium text-gray-700">
                  DNI
                </label>
                <input
                  type="text"
                  id="dni"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full 
                  focus:outline-none focus:border-celeste"
                  value={dni}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (
                      soloNumerosRegex.test(inputValue) &&
                      inputValue.length <= 8
                    ) {
                      setDni(inputValue);
                    }
                  }}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700 
                  focus:outline-none focus:border-celeste">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full 
                  focus:outline-none focus:border-celeste"
                  value={nombre}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (soloTextoRegex.test(inputValue) || inputValue === "") {
                      setNombre(inputValue);
                    }
                  }}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700">
                  Apellido
                </label>
                <input
                  type="text"
                  id="apellido"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full 
                  focus:outline-none focus:border-celeste"
                  value={apellido}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (soloTextoRegex.test(inputValue) || inputValue === "") {
                      setApellido(inputValue);
                    }
                  }}
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700">
                  Sector
                </label>
                <select
                  name="Sector"
                  id="Sector"
                  className="t-1 p-2 border border-gray-300 rounded-md w-full"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}>
                  <option value="Lima Sur">Lima Sur</option>
                  <option value="Lima Norte">Lima Norte</option>
                  <option value="Lima Centro">Lima Centro</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700">
                  Estado
                </label>
                <select
                  name="estado"
                  id="estado"
                  className="t-1 p-2 border border-gray-300 rounded-md w-full"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}>
                  <option value="true">Disponible</option>
                  <option value="false">Ocupado</option>
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="Contraseña"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full 
                  focus:outline-none focus:border-celeste"
                  value={contraseña}
                  onChange={(e) => {
                    setContraseña(e.target.value);
                  }}
                />
              </div>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-verde hover:bg-verde text-white font-bold py-2 px-4 rounded mr-2 transition-transform transform hover:scale-110">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-celeste hover:bg-celeste text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-110">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-5">
        <div className="border border-celeste p-4 mx-40">
          <table className="mx-auto min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-center">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="px-4 py-2 font-bold text-2xl text-gray-900">
                  Distribuidor
                </th>
                <th className="px-4 py-2">
                  <button
                    onClick={handleAddClick}
                    className="rounded bg-gradient-to-r from-verde to-celeste px-4 py-2 text-xs font-medium text-white hover:bg-gradient-to-r hover:from-celeste hover:to-verde">
                    Agregar
                  </button>
                </th>
              </tr>
              <tr>
                <th className="px-4 py-2 font-medium text-gray-900">Nombre</th>
                <th className="px-4 py-2 font-medium text-gray-900">DNI</th>
                <th className="px-4 py-2 font-medium text-gray-900">
                  Opciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {conductores &&
                conductores.map((conductor, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-gray-900">
                      {conductor.nombre}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{conductor.dni}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditClick(index)}
                        className="inline-block rounded bg-amber-500 px-4 py-2 text-xs font-medium text-white hover:bg-amber-600">
                        Edit
                      </button>
                      <button
                        className="inline-block rounded bg-red-800 px-4 py-2 text-xs font-medium text-white hover:bg-red-600 ml-2"
                        onClick={() => eliminarFila(index)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
      />
    </div>
  );
};
export default Administrador;
