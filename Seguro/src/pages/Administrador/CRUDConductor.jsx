import { useEffect, useState } from "react";
import {
  DeleteConductor,
  GetConductores,
  PostConductor,
  PutConductor,
} from "../../API/API_Seguro";
import { Slide, ToastContainer, toast } from "react-toastify";
import { motion } from "framer-motion";

const Administrador = () => {
  const [conductores, setConductores] = useState([]);
  const [EstaticoConductores, setEstaticoConductoress] = useState(null);

  useEffect(() => {
    const Datos = async () => {
      const resp = await GetConductores();
      setConductores(resp.data);
      setEstaticoConductoress(resp.data);
    };

    Datos();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalDelete, setmodalDelete] = useState(false);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [estado, setEstado] = useState(true);
  const [sector, setSector] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [dni, setDni] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [actu, setActu] = useState(false);

  const [filCond, setfilCond] = useState("");

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
  const toggleModalEliminar = () => {
    setmodalDelete(!modalDelete);
  };

  const handleAddClick = () => {
    setActu(false);
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
    setActu(true);
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
      toast.warning("Ingrese un DNI válido");
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
      conductores[editIndex].direccion =
        document.getElementById("Sector").value;
      conductores[editIndex].contraseña = contraseña;
      conductores[editIndex].estado = estado;
      conductores[editIndex].dni = dni;
      const res = await PutConductor(dni, conductores[editIndex]);
      if (res !== null) {
        toast.success("Se actualizó correctamente");
      } else {
        toast.error("Ocurrió un problema al actualizar");
      }
      setEditIndex(null);
    } else {
      const nuevoConductor = {
        dni: dni,
        nombre: nombre,
        apellido: apellido,
        contraseña: contraseña,
        direccion: document.getElementById("Sector").value,
        ubicacion: null,
        estado: estado,
      };
      const res = await PostConductor(nuevoConductor);
      if (res !== null) {
        toast.success("Se guardado correctamente");
        setConductores([...conductores, nuevoConductor]);
      } else {
        toast.error("Ocurrió un problema al guardar");
      }
    }
    setNombre("");
    setApellido("");
    setSector("");
    setContraseña("");
    setDni("");
    toggleModal();
  };

  const confirmarEliminar = async (index) => {
    toggleModalEliminar();
    setEditIndex(index);
  };

  const eliminarFila = async () => {
    const res = DeleteConductor(conductores[editIndex].dni);
    if (res !== null) {
      toast.success("Se elimino correctamente");
      const nuevoConductores = [...conductores];
      nuevoConductores.splice(editIndex, 1);
      setConductores(nuevoConductores);
      toggleModalEliminar();
    } else {
      toast.error("Ocurrió un problema al eliminar");
    }
  };

  const Filtros = () => {
    if (!filCond) {
      toast.warning("ingrese por lo menos un filtro");
      return;
    }

    var ConductorFiltro = [];

    var filCondExiste = true;

    if (filCond) {
      if (ConductorFiltro.length !== 0) {
        var FilterAseg = [];
        for (let index = 0; index < ConductorFiltro.length; index++) {
          if (ConductorFiltro[index].dni === filCond) {
            FilterAseg.push(ConductorFiltro[index]);
          }
        }
        ConductorFiltro = FilterAseg;
      } else {
        for (let index = 0; index < EstaticoConductores.length; index++) {
          if (EstaticoConductores[index].dni === filCond) {
            ConductorFiltro.push(EstaticoConductores[index]);
          }
        }
      }
      if (ConductorFiltro.length === 0) {
        filCondExiste = false;
      }
    }

    if (filCondExiste && ConductorFiltro.length > 0) {
      toast.success("Se aplicaron los filtros");
      setConductores(ConductorFiltro);
    } else {
      toast.warning("No hay coincidencias con los filtros aplicados");
      setConductores([]);
    }
  };

  const LimpiarFiltro = () => {
    setfilCond("");
    setConductores(EstaticoConductores);
  };

  const soloTextoRegex = /^[A-Za-z\s]+$/; // Expresión regular para aceptar solo letras y espacios
  const soloNumerosRegex = /^[0-9]*$/; // Expresión regular para aceptar solo números

  return (
    <div>
      {modalDelete && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 max-w-md">
            <h4>
              Desea eliminar al distribuidor: <br />
              Nombres: {conductores[editIndex].nombre}{" "}
              {conductores[editIndex].apellido}
              <br />
              DNI: {conductores[editIndex].dni}
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
          </div>
        </div>
      )}
      {modalOpen && (
        <motion.div
         className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center"
         initial={{ opacity: 0, y: "-100%" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ type: "spring", damping: 20, stiffness: 100 }}
         >
          <motion.div
           className="bg-white p-8 max-w-md rounded-lg"
           initial={{ opacity: 0, y: "-50%" }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: "-50%" }}
             transition={{ type: "spring", damping: 20, stiffness: 100 }}
           
           
           >
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
                  disabled={actu}
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
                  Nombres
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
                  Apellidos
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
                  <option value="LimaSur">Lima Sur</option>
                  <option value="LimaNorte">Lima Norte</option>
                  <option value="LimaCentro">Lima Centro</option>
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
          
            </motion.div>
  </motion.div>
      )}

      <div className="overflow-x-auto mt-5">
        <div className="border border-celeste p-4 mx-40">
          <table className="mx-auto min-w-full divide-y-2 divide-gray-200 bg-white text-sm text-center">
            <thead className="ltr:text-left rtl:text-right">
              <tr>
                <th className="px-4 py-2 font-bold text-2xl text-gray-900">
                  Distribuidor
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
                      value={filCond}
                      className=" p-2 rounded border border-black"
                      placeholder="Ingrese el DNI"
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        if (
                          soloNumerosRegex.test(inputValue) &&
                          inputValue.length <= 8
                        ) {
                          setfilCond(inputValue);
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
