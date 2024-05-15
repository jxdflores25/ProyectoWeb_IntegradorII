import {
  GetAsegurado,
  GetConductorDireccion,
  GetKardex,
  GetMedicina,
  GetMedicinaNombre,
  GetPedidoPrioridad,
  GetRecetaSeguroID,
  GetRecetas,
  PostMedicinaSeguro,
  PostPedido,
  PostRecetaSeguro,
} from "../../API/API_Seguro";
import { useState } from "react";

import IconDelivery from "../../assets/Icons/IconDelivery";
import IconMoto from "../../assets/Icons/IconMoto";
import Fecha from "../../constants/FechaTime";
import { Slide, ToastContainer, toast } from "react-toastify";

export default function AsignarReceta() {
  const [RecetasAlta, setRecetasAlta] = useState([]);
  const [RecetasBaja, setRecetasBaja] = useState([]);
  const [RectaIndex, setRectaIndex] = useState();
  const [Detalle, setDetalle] = useState(null);
  const [Medicinas, setMedicinas] = useState([]);
  const [Paciente, setPaciente] = useState([]);
  const [Conductores, setConductores] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  //Para obtener la fecha
  const {
    fechaHoy,
    fechaConsulta,
    fechaAsignacion,
    fechaConsultaAyer,
    horaInicio,
    horaFin,
    corte,
  } = Fecha();

  const getRecetas = async () => {
    const data = await GetRecetas(fechaConsulta, "8:00", horaFin);
    if (fechaConsultaAyer) {
      if (localStorage.getItem("PedidoAyer") === "true") {
        const data2 = await GetRecetas(fechaConsultaAyer, "19:50", "23:59");
        for (let index = 0; index < data2.data.length; index++) {
          data.data.splice(-1, 0, data2.data[index]);
        }
      }
    }

    const receta = data.data;
    const recetaAlta = [];
    const recetaBaja = [];
    for (let index = 0; index < receta.length; index++) {
      const resp = await GetRecetaSeguroID(receta[index].id);
      if (receta[index].prioridad === "Alta") {
        if (resp.data.length === 0) {
          recetaAlta.push(receta[index]);
        }
      } else {
        if (resp.data.length === 0) {
          recetaBaja.push(receta[index]);
        }
      }
    }
    if (recetaBaja.length === 0 && recetaAlta.length === 0) {
      toast.success("No hay mas recetas por asignar");
      localStorage.setItem("PedidoAyer", "false");
    } else {
      toast.success("Se cargaron las recetas por asignar");
    }
    setRecetasAlta(recetaAlta);
    setRecetasBaja(recetaBaja);
  };

  const detalleReceta = async (receta, index) => {
    setDetalle(receta);
    const med = await GetMedicina(receta.id);
    const pac = await GetAsegurado(receta.dni_Paciente);
    const medicina = await NombreMedicina(med.data);
    setMedicinas(medicina);
    setPaciente(pac.data);
    setRectaIndex(index);
  };

  const NombreMedicina = async (data) => {
    for (let index = 0; index < data.length; index++) {
      const medicina = await GetMedicinaNombre(data[index].id_medicina);
      const kardex = await GetKardex(data[index].id_medicina);
      data[index].nombreMedicina = medicina.data.nombre;
      if (kardex.data.length > 1) {
        var Saldo = 0;
        for (let index = 0; index < kardex.data.length; index++) {
          Saldo += kardex.data[index].saldo;
        }
        data[index].Kardex = Saldo;
      } else {
        data[index].Kardex = kardex.data[0].saldo;
      }
    }
    return data;
  };

  const AsignarConductor = async () => {
    var ubi = "";
    if (Paciente.ubicacion === "Lima Sur") {
      ubi = "LimaSur";
    }
    if (Paciente.ubicacion === "Lima Norte") {
      ubi = "LimaNorte";
    }
    if (Paciente.ubicacion === "Lima Centro") {
      ubi = "LimaCentro";
    }

    const con = await GetConductorDireccion(ubi);
    const eliminar = [];
    for (let index = 0; index < con.data.length; index++) {
      const PedAlta = await GetPedidoPrioridad(
        fechaAsignacion,
        "Alta",
        con.data[index].dni
      );
      const PedBaja = await GetPedidoPrioridad(
        fechaAsignacion,
        "Baja",
        con.data[index].dni
      );
      if (PedAlta.data.length + PedBaja.data.length < 10) {
        con.data[index].Alta = PedAlta.data.length;
        con.data[index].Baja = PedBaja.data.length;
        con.data[index].Total = PedAlta.data.length + PedBaja.data.length;
      } else {
        eliminar.push(index);
      }
    }

    for (let index = 0; index < eliminar.length; index++) {
      con.data.splice(eliminar[index], 1);
    }

    setConductores(con.data);

    for (let index = 0; index < Medicinas.length; index++) {
      if (Medicinas[index].Kardex < Medicinas[index].cantidad) {
        toast.error(
          "No hay stock de la medicina: " + Medicinas[index].nombreMedicina
        );
        return;
      }
    }
    setModalOpen(true);
  };

  const RegistrarPedido = async (conductor) => {
    if (Detalle.prioridad === "Alta") {
      if (conductor.Alta === 4) {
        toast.error("No se pueden asignar mas recetas con prioridad Alta");
      } else {
        /*var dataReceta = {
          dni_asegurado: Detalle.dni_Paciente,
          id_receta: Detalle.id,
          fecha: Detalle.fecha,
          prioridad: Detalle.prioridad,
          nom_doctor: Detalle.nombre_Medico,
        };

        //const RecetaSeguro = await PostRecetaSeguro(dataReceta);

        var dataPedido = {
          id_receta: RecetaSeguro.data.id,
          id_conductor: conductor.dni,
          id_administrador: localStorage.getItem("usuario"),
          estatus: "Pendiente",
          prioridad: "Alta",
          fecha: fechaAsignacion,
        };
        const PedidoSeguro = await PostPedido(dataPedido);

        //await PostMedicinaSeguro(RecetaSeguro.data.id, Medicinas);

        var dataKardex = {
          id: 3,
          id_medicina: "9",
          nro_lote: "653489",
          fec_entrada: "2024-05-13",
          fec_venci: "2024-05-30",
          cantidad: 300,
          saldo: 300,
        };

        if (PedidoSeguro !== null) {
          toast.success("Se asigno correctamente el Pedido");
          const nuevoReceta = [...RecetasAlta];
          nuevoReceta.splice(RectaIndex, 1);
          setRecetasAlta(nuevoReceta);
          setDetalle(null);
          setModalOpen(false);
        } else {
          toast.error("Hubo un problema en la asignacion del Pedido");
        }*/
        for (let index = 0; index < Medicinas.length; index++) {
          const kardex = await GetKardex(Medicinas[index].id_medicina);
          console.log(kardex.data);
        }
      }
    } else {
      if (conductor.Baja === 6) {
        toast.error("No se pueden asignar mas recetas con prioridad Baja");
      } else {
        const dataReceta = {
          dni_asegurado: Detalle.dni_Paciente,
          id_receta: Detalle.id,
          fecha: Detalle.fecha,
          prioridad: Detalle.prioridad,
          nom_doctor: Detalle.nombre_Medico,
        };
        const RecetaSeguro = await PostRecetaSeguro(dataReceta);

        const dataPedido = {
          id_receta: RecetaSeguro.data.id,
          id_conductor: conductor.dni,
          id_administrador: localStorage.getItem("usuario"),
          estatus: "Pendiente",
          prioridad: "Baja",
          fecha: fechaAsignacion,
        };
        await PostMedicinaSeguro(RecetaSeguro.data.id, Medicinas);
        const PedidoSeguro = await PostPedido(dataPedido);
        if (PedidoSeguro !== null) {
          toast.success("Se asigno correctamente el Pedido");
          const nuevoReceta = [...RecetasBaja];
          nuevoReceta.splice(RectaIndex, 1);
          setRecetasBaja(nuevoReceta);
          setDetalle(null);
          setModalOpen(false);
        } else {
          toast.error("Hubo un problema en la asignacion del Pedido");
        }
      }
    }
  };

  const toggleModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="flex h-full ">
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="flex flex-col bg-white w-1/2 border rounded-md">
            <h1 className="text-xl text-center font-bold my-5">
              Asignar Conductor
            </h1>
            <table className="my-5 mx-5">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>#Pedidos (Alta)</th>
                  <th>#Pedidos (Baja)</th>
                  <th>#Total</th>
                  <th>Asignar</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {Conductores &&
                  Conductores.map((conductor) => (
                    <tr key={conductor.dni}>
                      <td>{conductor.nombre}</td>
                      <td>{conductor.Alta}</td>
                      <td>{conductor.Baja}</td>
                      <td>{conductor.Total}</td>
                      <td
                        className="flex justify-center cursor-pointer"
                        onClick={() => {
                          RegistrarPedido(conductor);
                        }}>
                        <IconMoto />
                      </td>
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
      <div className="basis-1/4 flex flex-col items-center">
        <div className="flex w-full justify-around items-center ">
          <button
            className="h-full flex justify-center items-center border border-verde  rounded-md py-4 px-3 transition-transform transform hover:scale-110"
            onClick={getRecetas}>
            cargar recetas
          </button>
          <h3>{fechaHoy}</h3>
        </div>
        <h2 className="mt-8">{corte}</h2>
        <div className=" text-start w-full px-4 mt-8">
          <h4 className=" pb-5 text-xl text-center font-bold">
            Prioridad Alta
          </h4>
          <table className="w-full text-center">
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>ALISTAR PEDIDO</th>
              </tr>
            </thead>
            <tbody>
              {RecetasAlta &&
                RecetasAlta.map((Receta, index) => (
                  <tr key={Receta.id}>
                    <td>{Receta.id}</td>
                    <td>{Receta.dni_Paciente}</td>
                    <td
                      className="flex justify-center cursor-pointer"
                      onClick={() => {
                        detalleReceta(Receta, index);
                      }}>
                      <IconDelivery />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <h4 className="py-5 text-xl text-center font-bold">Prioridad Baja</h4>
          <table className="w-full text-center">
            <thead>
              <tr>
                <th>ID</th>
                <th>DNI</th>
                <th>ALISTAR PEDIDO</th>
              </tr>
            </thead>
            <tbody>
              {RecetasBaja &&
                RecetasBaja.map((Receta, index) => (
                  <tr key={Receta.id}>
                    <td>{Receta.id}</td>
                    <td>{Receta.dni_Paciente}</td>
                    <td
                      className="flex justify-center cursor-pointer"
                      onClick={() => {
                        detalleReceta(Receta, index);
                      }}>
                      <IconDelivery />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
      {Detalle && (
        <div className="basis-3/4 p-5">
          <div className=" w-full border-2 min-h-96 border-gray-700 rounded-md flex flex-col gap-4 p-5">
            <h2 className=" text-3xl text-center ">Receta {Detalle.id} </h2>
            <h3 className=" text-xl text-start ">Medicina:</h3>
            <table className=" text-lg">
              <thead>
                <tr>
                  <th>Medicina</th>
                  <th>Cantidad</th>
                  <th>Stock</th>
                </tr>
              </thead>
              <tbody className=" text-center">
                {Medicinas &&
                  Medicinas.map((medicina) => (
                    <tr key={medicina.id}>
                      <td>{medicina.nombreMedicina}</td>
                      <td>{medicina.cantidad}</td>
                      <td
                        className={
                          medicina.cantidad > medicina.Kardex
                            ? " bg-red-300"
                            : ""
                        }>
                        {medicina.Kardex}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            {Paciente && (
              <div>
                <h3 className=" text-xl text-center ">Datos Asegurado</h3>
                <h3 className=" text-xl text-start ">
                  Nombre: {Paciente.nombre} {Paciente.apellido}
                </h3>
                <h3 className=" text-xl text-start ">DNI: {Paciente.dni}</h3>
                <h3 className=" text-xl text-start ">
                  Seguro: {Paciente.TipoSeguro}
                </h3>
                <h3 className=" text-xl text-start ">
                  Ubicacion: {Paciente.ubicacion}
                </h3>
              </div>
            )}

            <div className="flex justify-around items-center">
              <h3 className=" text-xl text-start ">Asignar Conductor</h3>
              <button
                className=" text-xl rounded-md bg-gradient-to-r from-celeste to-verde text-white p-2 duration-300 transition-transform transform hover:scale-110"
                onClick={AsignarConductor}>
                Asignar
              </button>
            </div>
          </div>
        </div>
      )}
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
