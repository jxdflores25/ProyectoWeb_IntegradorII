
import { Route, Routes } from "react-router-dom";
import { GetAdministrador, GetRecetas } from "../../API/API_Seguro";
import { useEffect, useState } from "react";
import AdminAsegurado from "./AdminAsegurado";
import NavbarAdmin from "../../components/Administrador/NavbarAdmin";

const Administrador = () => {
  const [asegurados, setAsegurados] = useState([
    { nombre: "John Doe", telefono: "123-456-7890" },
    { nombre: "Jane Doe", telefono: "987-654-3210" },
    { nombre: "Gary Barlow", telefono: "555-555-5555" },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const toggleModal = () => {
    // Limpiar los campos solo si no estamos editando
  if (editIndex === null) {
    setNombre("");
    setApellido("");
    setDireccion("");
    setTelefono("");
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
    setTelefono(asegurados[editIndex].telefono);
  }
}, [editIndex]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !direccion || !telefono) {
      alert("Por favor completa todos los campos.");
      return; // Evitar enviar el formulario si algún campo está vacío
    }
    const nuevoAsegurado = { nombre, apellido, direccion, telefono };
    if (editIndex !== null) {
      const nuevosAsegurados = [...asegurados];
      nuevosAsegurados[editIndex] = nuevoAsegurado;
      setAsegurados(nuevosAsegurados);
      setEditIndex(null);
    } else {
      setAsegurados([...asegurados, nuevoAsegurado]);
    }
    setNombre("");
    setApellido("");
    setDireccion("");
    setTelefono("");
    toggleModal();
  };

  const eliminarFila = (index) => {
    const nuevosAsegurados = [...asegurados];
    nuevosAsegurados.splice(index, 1);
    setAsegurados(nuevosAsegurados);
  };
  const soloTextoRegex = /^[A-Za-z\s]+$/; // Expresión regular para aceptar solo letras y espacios
  const soloNumerosRegex = /^[0-9]*$/; // Expresión regular para aceptar solo números
  


  
  return (
    <div>
      <NavbarAdmin />
      <Routes>
        <Route
          path="adminAsegurado"
          element={<AdminAsegurado Data={asegurados} />}
        />
      </Routes>

      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Registro Asegurado
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
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
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
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
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div class="overflow-x-auto mt-5">
        <div class="border border-amber-500 mx-40"> 
          <table class="mx-auto min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-center">
            <thead class="ltr:text-left rtl:text-right">
              <tr>
                <th class="px-4 py-2 font-bold text-2xl text-gray-900">Formulario</th>
                <th class="px-4 py-2">
                  <button onClick={handleAddClick} class="rounded bg-gradient-to-r from-orange-500 to-orange-800 px-4 py-2 text-xs font-medium text-white hover:bg-gradient-to-r hover:from-orange-800 hover:to-orange-500">
                    Agregar
                  </button>
                </th>
              </tr>
              <tr>
                <th class="px-4 py-2 font-medium text-gray-900">Name</th>
                <th class="px-4 py-2 font-medium text-gray-900">Phone</th>
                <th class="px-4 py-2 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200">
              {asegurados.map((asegurado, index) => (
                <tr key={index}>
                  <td class="px-4 py-2 text-gray-900">{asegurado.nombre}</td>
                  <td class="px-4 py-2 text-gray-700">{asegurado.telefono}</td>
                  <td class="px-4 py-2">
                    <button onClick={() => handleEditClick(index)} class="inline-block rounded bg-amber-500 px-4 py-2 text-xs font-medium text-white hover:bg-amber-600">
                      Edit
                    </button>
                    <button class="inline-block rounded bg-red-800 px-4 py-2 text-xs font-medium text-white hover:bg-red-600 ml-2" onClick={() => eliminarFila(index)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Administrador;
