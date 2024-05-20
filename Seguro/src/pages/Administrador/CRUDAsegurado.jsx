import { useEffect, useState } from "react";
import {
  DeleteAsegurado,
  GetAsegurados,
  PostAsegurado,
  PutAsegurado,
} from "../../API/API_Seguro";
import { Slide, ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";

const Administrador = () => {
  const [asegurados, setAsegurados] = useState([]);
  const [EstaticoAsegurados, setEstaticoAsegurados] = useState(null);

  useEffect(() => {
    const Datos = async () => {
      const resp = await GetAsegurados();
      setAsegurados(resp.data);
      setEstaticoAsegurados(resp.data);
    };

    Datos();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDelete, setmodalDelete] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [seguro, setSeguro] = useState("");
  const [sector, setSector] = useState("");
  const [dni, setDni] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [actu, setActu] = useState(false);

  const [filAseg, setfilAseg] = useState("");

  const toggleModal = () => {
    // Limpiar los campos solo si no estamos editando

    if (editIndex === null) {
      setNombre("");
      setApellido("");
      setDireccion(" ");
      setTelefono("");
      setSeguro("");
      setSector("");
      setContraseña("");
      setDni("");
    }
    setModalOpen(!modalOpen);
  };

  const toggleModalEliminar = () => {
    setmodalDelete(!modalDelete);
  };

  const handleAddClick = () => {
    setActu(false);
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
    setActu(true);
    setEditIndex(index);
    // Abrir el modal
    toggleModal();
  };
  useEffect(() => {
    if (editIndex !== null) {
      setNombre(asegurados[editIndex].nombre);
      setApellido(asegurados[editIndex].apellido || "");
      setDireccion(asegurados[editIndex].direccion || " ");
      setSector(asegurados[editIndex].ubicacion || "");
      setSeguro(asegurados[editIndex].TipoSeguro);
      setTelefono(asegurados[editIndex].telefono);
      setContraseña(asegurados[editIndex].contraseña || "");
      setDni(asegurados[editIndex].dni);
    }
  }, [editIndex]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !apellido || !telefono || !dni) {
      toast.warning("Por favor completa todos los campos.");
      return; // Evitar enviar el formulario si algún campo está vacío
    }
    if (dni.length !== 8) {
      toast.warning("Ingrese un DNI válido");
      return;
    }
    if (document.getElementById("teléfono").value.length !== 9) {
      toast.warning("Ingrese un teléfono válido");
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
      if (contraseña === "") {
        asegurados[editIndex].contraseña = null;
      } else {
        asegurados[editIndex].contraseña = contraseña;
      }
      asegurados[editIndex].dni = dni;
      const res = await PutAsegurado(dni, asegurados[editIndex]);
      if (res !== null) {
        toast.success("Se actualizó correctamente");
      } else {
        toast.error("Ocurrió un problema al actualizar");
      }
      setEditIndex(null);
    } else {
      const nuevoAsegurado = {
        Latitud: null,
        Longitud: null,
        TipoSeguro: document.getElementById("seguro").value,
        apellido: apellido,
        contraseña: null,
        direccion: null,
        dni: dni,
        nombre: nombre,
        telefono: telefono,
        ubicacion: document.getElementById("Sector").value,
      };
      const res = await PostAsegurado(nuevoAsegurado);
      if (res !== null) {
        toast.success("Se guardado correctamente");
        setAsegurados([...asegurados, nuevoAsegurado]);
      } else {
        toast.error("Ocurrió un problema al guardar");
      }
    }
    setNombre("");
    setApellido("");
    setDireccion(" ");
    setTelefono("");
    setSeguro("");
    setSector("");
    setContraseña("");
    toggleModal();
  };

  const confirmarEliminar = async (index) => {
    toggleModalEliminar();
    setEditIndex(index);
  };

  const eliminarFila = async () => {
    const res = DeleteAsegurado(asegurados[editIndex].dni);

    if (res !== null) {
      toast.success("Se elimino correctamente");
      const nuevosAsegurados = [...asegurados];
      nuevosAsegurados.splice(editIndex, 1);
      setAsegurados(nuevosAsegurados);
      toggleModalEliminar();
    } else {
      toast.error("Ocurrió un problema al eliminar");
    }
  };

  const Filtros = () => {
    if (!filAseg) {
      toast.warning("ingrese por lo menos un filtro");
      return;
    }

    var AseguradoFiltro = [];

    var filAsegExiste = true;

    if (filAseg) {
      if (AseguradoFiltro.length !== 0) {
        var FilterAseg = [];
        for (let index = 0; index < AseguradoFiltro.length; index++) {
          if (AseguradoFiltro[index].dni === filAseg) {
            FilterAseg.push(AseguradoFiltro[index]);
          }
        }
        AseguradoFiltro = FilterAseg;
      } else {
        for (let index = 0; index < EstaticoAsegurados.length; index++) {
          if (EstaticoAsegurados[index].dni === filAseg) {
            AseguradoFiltro.push(EstaticoAsegurados[index]);
          }
        }
      }
      if (AseguradoFiltro.length === 0) {
        filAsegExiste = false;
      }
    }

    if (filAsegExiste && AseguradoFiltro.length > 0) {
      toast.success("Se aplicaron los filtros");
      setAsegurados(AseguradoFiltro);
    } else {
      toast.warning("No hay coincidencias con los filtros aplicados");
      setAsegurados([]);
    }
  };

  const LimpiarFiltro = () => {
    setfilAseg("");
    setAsegurados(EstaticoAsegurados);
  };
  
  
    const soloNumerosRegex = /^9[0-9]*$/; // Expresión regular para aceptar solo números y que empiece con 9 sin espacios
    const soloNumerosDNI = /^[0-9]*$/; // Expresión regular para aceptar solo números 


  const manejarCambioNombre = (e) => {
    const inputValue = e.target.value;
    
    // Expresión regular para letras y espacios
    const soloTextoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    
    // Contar los espacios en el input
    const espacios = (inputValue.match(/ /g) || []).length;
    
    // Validar el input solo si tiene un solo espacio o menos
    if (soloTextoRegex.test(inputValue) && espacios <= 1) {
        setNombre(inputValue);
    }
  };
  
  const manejarCambioapellido = (e) => {
    const inputValue = e.target.value;
    
    // Expresión regular para letras y espacios
    const soloTextoRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
    
    // Contar los espacios en el input
    const espacios = (inputValue.match(/ /g) || []).length;
    
    // Validar el input solo si tiene un solo espacio o menos
    if (soloTextoRegex.test(inputValue) && espacios <= 1) {
        setApellido(inputValue);
    }
  };



  

  return (
    <div>
      {modalDelete && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <motion.div
            className="bg-white p-8 max-w-md"
            initial={{ opacity: 0, y: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-50%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}>
            <h4>
              Desea eliminar al asegurado: <br />
              Nombres: {asegurados[editIndex].nombre}{" "}
              {asegurados[editIndex].apellido}
              <br />
              DNI: {asegurados[editIndex].dni}
            </h4>
            <div className="flex justify-center my-4">
              <button
                onClick={toggleModalEliminar}
                className="bg-verde hover:bg-verde text-white font-bold py-2 px-4 rounded mr-2 transition-transform transform hover:scale-110 duration-700">
                Cancelar
              </button>
              <button
                onClick={eliminarFila}
                className="bg-celeste hover:bg-celeste text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-110">
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center ">
          <motion.div
            className="bg-white p-8 max-w-md rounded-lg border-4 border-animation "
            initial={{ opacity: 0, y: "-50%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-50%" }}
            transition={{ type: "spring", damping: 20, stiffness: 100 }}>
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
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-celeste"
                  value={dni}
                  disabled={actu}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (
                      soloNumerosDNI.test(inputValue) &&
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
                  className="block text-sm font-medium text-gray-700 focus:outline-none focus:border-celeste">
                  Nombres
                </label>
                <input
                  type="text"
                  id="nombre"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-celeste"
                  value={nombre}
                  onChange={manejarCambioNombre}
                  placeholder="Ej: Johann José"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="nombre"
                  className="block text-sm font-medium text-gray-700 focus:outline-none focus:border-celeste">
                  Apellidos
                </label>
                <input
                  type="text"
                  id="apellido"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-celeste"
                  value={apellido}
                  onChange={manejarCambioapellido}
                  placeholder="Ej: Roldan Flores"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="telefono"
                  className="block text-sm font-medium text-gray-700 focus:outline-none focus:border-celeste">
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-celeste"
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
                <input
                  type="text"
                  id="direccion"
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-celeste"
                  value={direccion}
                  hidden
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
                  <option value="Rimac">Rímac</option>
                  <option value="Pacifico">Pacífico</option>
                  <option value="Mapfre">Mapfre</option>
                </select>
              </div>
              {actu && (
                <div className="mb-4">
                  <label
                    htmlFor="nombre"
                    className="block text-sm font-medium text-gray-700">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    id="Contraseña"
                    className="mt-1 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:border-celeste"
                    value={contraseña}
                    onChange={(e) => {
                      setContraseña(e.target.value);
                    }}
                  />
                </div>
              )}

              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={toggleModal}
                  className="bg-verde hover:bg-verde text-white font-bold py-2 px-4 rounded mr-2 transition-transform transform hover:scale-110 duration-700">
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-celeste hover:bg-celeste text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-110">
                  Guardar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      <div className="overflow-x-auto mt-5">
        <div className="border border-celeste p-4 mx-40">
          <table className="mx-auto min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-center">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="px-4 py-2 font-bold text-2xl text-gray-900">
                  Asegurados
                </th>
                <th className="px-4 py-2" colSpan="2">
                  <div className="w-full flex justify-end">
                    <button
                      onClick={handleAddClick}
                      className="rounded-md bg-gradient-to-r from-celeste to-verde px-4 py-2 text-xs font-medium text-white hover:bg-gradient-to-r hover:from-verde hover:to-celeste transition-transform transform hover:scale-110">
                      Agregar
                    </button>
                  </div>
                </th>
              </tr>
              <tr>
                <th className="px-4 py-2" colSpan="3">
                  <div className="flex gap-3 ">
                    <input
                      type="text"
                      id="Asegurado"
                      value={filAseg}
                      className=" p-2 rounded border border-black"
                      placeholder="Ingrese el DNI"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (
                          soloNumerosDNI.test(inputValue) &&
                          inputValue.length <= 8
                        ) {
                          setfilAseg(inputValue);
                        }
                      }}
                    />
                    <button
                      onClick={Filtros}
                      className="bg-verde  hover:bg-verde text-white font-bold py-2 px-4 rounded">
                      Aplicar
                    </button>
                    <button
                      onClick={LimpiarFiltro}
                      className="bg-celeste hover:bg-celeste text-white font-bold py-2 px-4 rounded ">
                      Limpiar
                    </button>
                  </div>
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
                        className="inline-block rounded bg-verde px-4 py-2 text-xs font-medium text-white hover:bg-verde">
                        Edit
                      </button>
                      <button
                        className="inline-block rounded bg-celeste px-4 py-2 text-xs font-medium text-white hover:bg-celeste ml-2"
                        onClick={() => confirmarEliminar(index)}>
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
