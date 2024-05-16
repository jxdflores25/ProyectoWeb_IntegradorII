import { useEffect, useState } from "react";
import {
  GetAsegurado,
  GetConductor,
  GetMedicinaIDReceta,
  GetMedicinaNombre,
  GetPedido,
  GetRecetaSeguro,
} from "../../API/API_Seguro";
import IconDetail from "../../assets/Icons/IconDetail";
import { Slide, ToastContainer, toast } from "react-toastify";

export default function PedidosListar() {
  const [Pedidos, setPedidos] = useState([]);
  const [EstaticoPedidos, setEstaticoPedidos] = useState(null);
  const [Pedido, setPedido] = useState([]);
  const [Medicinas, setMedicinas] = useState([]);
  const [Paciente, setPaciente] = useState([]);
  const [Conductor, setConductor] = useState([]);
  const [filCond, setfilCond] = useState("");
  const [filAseg, setfilAseg] = useState("");
  const [filEsta, setfilEsta] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const pedidos = async () => {
      const ped = await GetPedido();
      for (let index = 0; index < ped.data.length; index++) {
        const rec = await GetRecetaSeguro(ped.data[index].id_receta);
        if (rec !== null) {
          ped.data[index].asegurado = rec.data.dni_asegurado;
          ped.data[index].receta = rec.data.id;
        } else {
          ped.data[index].asegurado = "";
          ped.data[index].receta = "";
        }
      }
      setPedidos(ped.data);
      setEstaticoPedidos(ped.data);
    };
    pedidos();
  }, []);

  const DetallePedido = async (pedido) => {
    setPedido(pedido);
    const con = await GetConductor(pedido.id_conductor);
    const med = await GetMedicinaIDReceta(pedido.receta);
    const pac = await GetAsegurado(pedido.asegurado);
    const medicina = await NombreMedicina(med.data);
    setMedicinas(medicina);
    setPaciente(pac.data);
    setConductor(con.data);
    setModalOpen(true);
  };
  const NombreMedicina = async (data) => {
    for (let index = 0; index < data.length; index++) {
      const medicina = await GetMedicinaNombre(data[index].id_medicina);
      data[index].nombreMedicina = medicina.data.nombre;
    }
    return data;
  };
  const toggleModal = () => {
    setModalOpen(false);
  };

  const Filtros = () => {
    var fecha = document.getElementById("fecha").value;
    if (!fecha && !filCond && !filAseg && !filEsta) {
      toast.warning("ingrese por lo menos un filtro");
      return;
    }

    var PedidosFiltro = [];

    var fechaExiste = true;
    var filCondExiste = true;
    var filAsegExiste = true;
    var filEstaExiste = true;

    if (fecha) {
      for (let index = 0; index < EstaticoPedidos.length; index++) {
        if (EstaticoPedidos[index].fecha === fecha) {
          PedidosFiltro.push(EstaticoPedidos[index]);
        }
      }
      if (PedidosFiltro.length === 0) {
        fechaExiste = false;
      }
    }

    if (filCond) {
      if (PedidosFiltro.length !== 0) {
        var Filtercond = [];
        for (let index = 0; index < PedidosFiltro.length; index++) {
          if (PedidosFiltro[index].id_conductor === filCond) {
            Filtercond.push(PedidosFiltro[index]);
          }
        }
        PedidosFiltro = Filtercond;
      } else {
        for (let index = 0; index < EstaticoPedidos.length; index++) {
          if (EstaticoPedidos[index].id_conductor === filCond) {
            PedidosFiltro.push(EstaticoPedidos[index]);
          }
        }
      }
      if (PedidosFiltro.length === 0) {
        filCondExiste = false;
      }
    }

    if (filAseg) {
      if (PedidosFiltro.length !== 0) {
        var FilterAseg = [];
        for (let index = 0; index < PedidosFiltro.length; index++) {
          if (PedidosFiltro[index].asegurado === filAseg) {
            FilterAseg.push(PedidosFiltro[index]);
          }
        }
        PedidosFiltro = FilterAseg;
      } else {
        for (let index = 0; index < EstaticoPedidos.length; index++) {
          if (EstaticoPedidos[index].asegurado === filAseg) {
            PedidosFiltro.push(EstaticoPedidos[index]);
          }
        }
      }
      if (PedidosFiltro.length === 0) {
        filAsegExiste = false;
      }
    }

    if (filEsta) {
      console.log(PedidosFiltro);
      if (PedidosFiltro.length !== 0) {
        var FilterEsta = [];
        for (let index = 0; index < PedidosFiltro.length; index++) {
          if (PedidosFiltro[index].estatus === filEsta) {
            FilterEsta.push(PedidosFiltro[index]);
          }
        }
        PedidosFiltro = FilterEsta;
      } else {
        for (let index = 0; index < EstaticoPedidos.length; index++) {
          if (EstaticoPedidos[index].estatus === filEsta) {
            PedidosFiltro.push(EstaticoPedidos[index]);
          }
        }
      }
      if (PedidosFiltro.length === 0) {
        filEstaExiste = false;
      }
    }

    if (
      filEstaExiste &&
      fechaExiste &&
      filCondExiste &&
      filAsegExiste &&
      PedidosFiltro.length > 0
    ) {
      toast.success("Se aplicaron los filtros");
      setPedidos(PedidosFiltro);
    } else {
      toast.warning("No hay coincidencias con los filtros aplicados");
      setPedidos([]);
    }
  };

  const LimpiarFiltro = () => {
    document.getElementById("fecha").value = "";
    setfilCond("");
    setfilAseg("");
    setfilEsta("");
    setPedidos(EstaticoPedidos);
  };

  const soloNumerosRegex = /^[0-9]*$/; // Expresión regular para aceptar solo números

  return (
    <div className=" w-full ">
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className=" bg-white w-1/2 border rounded-md p-4">
            <h2 className=" text-3xl text-center ">Pedido: {Pedido.id} </h2>
            <div className="flex flex-row border-b-2 border-black my-3">
              <h3 className=" text-xl text-start w-1/2 ">
                Conductor: {Conductor.dni}
              </h3>
              <h3 className=" text-xl text-start w-1/2 ">
                Nombre: {Conductor.nombre} {Conductor.apellido}
              </h3>
            </div>

            <div className="flex flex-row border-b-2 border-black my-3">
              <h3 className=" text-xl text-start   w-1/2">
                Asegurado: {Paciente.dni}
              </h3>

              <h3 className=" text-xl text-start   w-1/2">
                Nombre: {Paciente.nombre} {Paciente.apellido}
              </h3>
            </div>
            <h3 className=" text-xl text-start   w-1/2">Detalle del Pedido:</h3>
            <table className=" text-lg w-full my-3">
              <thead>
                <tr>
                  <th>Medicina</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody className=" text-center">
                {Medicinas &&
                  Medicinas.map((medicina) => (
                    <tr key={medicina.id}>
                      <td>{medicina.nombreMedicina}</td>
                      <td>{medicina.cantidad}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <div className="flex justify-end my-3">
              <button
                type="button"
                onClick={toggleModal}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
      <h1 className=" text-xl mx-4 my-4">Lista de Pedidos</h1>

      <div className=" w-full flex ">
        <div className=" flex flex-col w-1/5 m-8 gap-4">
          <label htmlFor="">Fecha:</label>
          <input type="date" id="fecha" />
          <label htmlFor="">Conductor:</label>
          <input
            type="text"
            id="Conductor"
            value={filCond}
            className=" p-2 mb-4 rounded border border-black"
            onChange={(e) => {
              const inputValue = e.target.value;
              if (soloNumerosRegex.test(inputValue) && inputValue.length <= 8) {
                setfilCond(inputValue);
              }
            }}
          />
          <label htmlFor="">Asegurado:</label>
          <input
            type="text"
            id="Asegurado"
            value={filAseg}
            className=" p-2 mb-4 rounded border border-black"
            onChange={(e) => {
              const inputValue = e.target.value;
              if (soloNumerosRegex.test(inputValue) && inputValue.length <= 8) {
                setfilAseg(inputValue);
              }
            }}
          />
          <label htmlFor="">Estado</label>
          <select
            name="Sector"
            id="Sector"
            className="t-1 p-2 border border-gray-300 rounded-md w-full"
            value={filEsta}
            onChange={(e) => setfilEsta(e.target.value)}>
            <option value="" disabled>
              Eliger Estado
            </option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Curso">En Curso</option>
            <option value="Completado">Completado</option>
          </select>

          <button
            onClick={Filtros}
            className="bg-verde hover:bg-verde text-white font-bold py-2 px-4 rounded">
            Aplicar
          </button>
          <button
            onClick={LimpiarFiltro}
            className="bg-celeste hover:bg-celeste text-white font-bold py-2 px-4 rounded ">
            Limpiar
          </button>
        </div>
        <table className=" w-4/5  m-10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Conductor</th>
              <th>Asegurado</th>
              <th>Prioridad</th>
              <th>Estado</th>
              <th>Detalle</th>
            </tr>
          </thead>
          <tbody className=" text-lg text-center ">
            {Pedidos &&
              Pedidos.map((pedido) => (
                <tr key={pedido.id} className=" my-2 border-y-2 border-black ">
                  <td>{pedido.id}</td>
                  <td>{pedido.fecha}</td>
                  <td>{pedido.id_conductor}</td>
                  <td>{pedido.asegurado}</td>
                  <td>{pedido.prioridad}</td>
                  <td>{pedido.estatus}</td>
                  <td
                    className=" cursor-pointer mx-auto"
                    onClick={() => {
                      DetallePedido(pedido);
                    }}>
                    {<IconDetail />}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
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
}
