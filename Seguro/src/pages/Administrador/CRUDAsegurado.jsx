import { useEffect, useState } from "react";
import {
  DeleteAsegurado,
  GetAsegurados,
  PostAsegurado,
  PutAsegurado,
} from "../../API/API_Seguro";
import { Slide, ToastContainer, toast } from "react-toastify";

const Administrador = () => {
  const [asegurados, setAsegurados] = useState([]);

  useEffect(() => {
    const Datos = async () => {
      const resp = await GetAsegurados();
      setAsegurados(resp.data);
    };

    Datos();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [seguro, setSeguro] = useState("");
  const [sector, setSector] = useState("");
  const [dni, setDni] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const toggleModal = () => {
    // Limpiar los campos solo si no estamos editando
    if (editIndex === null) {
      setNombre("");
      setApellido("");
      setDireccion("");
      setTelefono("");
      setSeguro("");
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
    setDireccion("");
    setTelefono("");
    setSeguro("");
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
      setNombre(asegurados[editIndex].nombre);
      setApellido(asegurados[editIndex].apellido || "");
      setDireccion(asegurados[editIndex].direccion || "");
      setSector(asegurados[editIndex].ubicacion || "");
      setSeguro(asegurados[editIndex].TipoSeguro);
      setTelefono(asegurados[editIndex].telefono);
      setContraseña(asegurados[editIndex].contraseña);
      setDni(asegurados[editIndex].dni);
    }
  }, [editIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !nombre ||
      !apellido ||
      !direccion ||
      !telefono ||
      !dni ||
      !contraseña
    ) {
      toast.warning("Por favor completa todos los campos.");
      return; // Evitar enviar el formulario si algún campo está vacío
    }
    if (dni.length !== 8) {
      toast.warning("Ingrese un DNI valido");
      return;
    }
    if (telefono.length !== 9) {
      toast.warning("Ingrese un telefono valido");
      return;
    }

    //const nuevoAsegurado = { nombre, apellido, direccion, telefono };
    if (editIndex !== null) {
      asegurados[editIndex].nombre = nombre;
      asegurados[editIndex].apellido = apellido;
      asegurados[editIndex].direccion = direccion;
      asegurados[editIndex].telefono = telefono;
      asegurados[editIndex].ubicacion = sector;
      asegurados[editIndex].TipoSeguro = seguro;
      asegurados[editIndex].contraseña = contraseña;
      asegurados[editIndex].dni = dni;
      const res = await PutAsegurado(dni, asegurados[editIndex]);
      if (res !== null) {
        toast.success("Se actulizo correctamente");
      } else {
        toast.error("Ocurrio un problema al actualizar");
      }
      setEditIndex(null);
    } else {
      const nuevoAsegurado = {
        Latitud: null,
        Longitud: null,
        TipoSeguro: document.getElementById("seguro").value,
        apellido: apellido,
        contraseña: null,
        direccion: direccion,
        dni: dni,
        nombre: apellido,
        telefono: telefono,
        ubicacion: document.getElementById("Sector").value,
      };
      const res = await PostAsegurado(nuevoAsegurado);
      if (res !== null) {
        toast.success("Se guardado correctamente");
        setAsegurados([...asegurados, nuevoAsegurado]);
      } else {
        toast.error("Ocurrio un problema al guardar");
      }
    }
    setNombre("");
    setApellido("");
    setDireccion("");
    setTelefono("");
    setSeguro("");
    setSector("");
    toggleModal();
  };

  const eliminarFila = async (index) => {
    const res = DeleteAsegurado(asegurados[index].dni);
    if (res !== null) {
      toast.success("Se elimino correctamente");
      const nuevosAsegurados = [...asegurados];
      nuevosAsegurados.splice(index, 1);
      setAsegurados(nuevosAsegurados);
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
              Registro Asegurado
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
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
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
                  className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
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
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
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
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-700">
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  value={telefono}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (
                      soloNumerosRegex.test(inputValue) &&
                      inputValue.length <= 9
                    ) {
                      setTelefono(inputValue);
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
                  Direccion
                </label>
                <input
                  type="text"
                  id="direccion"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700">
                  Seguro
                </label>
                <select
                  name="seguro"
                  id="seguro"
                  className="t-1 p-2 border border-gray-300 rounded-md w-full"
                  value={seguro}
                  onChange={(e) => setSeguro(e.target.value)}>
                  <option value="Rimac">Rimac</option>
                  <option value="Pacifico">Pacifico</option>
                  <option value="Mapfre">Mapfre</option>
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
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                  value={contraseña}
                  onChange={(e) => {
                    setContraseña(e.target.value);
                  }}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded">
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="overflow-x-auto mt-5">
        <div className="border border-amber-500 mx-40">
          <table className="mx-auto min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-center">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="px-4 py-2 font-bold text-2xl text-gray-900">
                  Asegurados
                </th>
                <th className="px-4 py-2">
                  <button
                    onClick={handleAddClick}
                    className="rounded bg-gradient-to-r from-orange-500 to-orange-800 px-4 py-2 text-xs font-medium text-white hover:bg-gradient-to-r hover:from-orange-800 hover:to-orange-500">
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
              {asegurados &&
                asegurados.map((asegurado, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-gray-900">
                      {asegurado.nombre}
                    </td>
                    <td className="px-4 py-2 text-gray-700">{asegurado.dni}</td>
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
