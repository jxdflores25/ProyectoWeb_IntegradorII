import { useEffect, useState } from "react";
import {
  GetKardex,
  GetMedicinasSeguro,
  PostKardex,
} from "../../API/API_Seguro";
import IconDetail from "../../assets/Icons/IconDetail";
import { Slide, ToastContainer, toast } from "react-toastify";

export default function MedicamentoListar() {
  const [Medicinas, setMedicinas] = useState([]);
  const [EstaticoMedicinas, setEstaticoMedicinas] = useState(null);
  const [MedicinaForm, setMedicinaForm] = useState(null);
  const [AlertMedicina, setAlertMedicina] = useState([]);
  const [Detalle, setDetalle] = useState(null);
  const [filCod, setfilCod] = useState("");
  const [filNom, setfilNom] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detalleOpen, setdetalleOpen] = useState(false);
  const [alertOpen, setalertOpen] = useState(false);

  const [CodForm, setCodForm] = useState("");
  const [LoteForm, setLoteForm] = useState("");
  const [CantidadForm, setCantidadForm] = useState("");
  const [StockForm, setStockForm] = useState("");

  useEffect(() => {
    const medicinas = async () => {
      var med = await GetMedicinasSeguro();
      const alertMedModal = [];

      for (let a = 0; a < med.data.length; a++) {
        const kardex = await GetKardex(med.data[a].id);
        var Alert = "";
        var MovitoAlert = "";
        const alertMed = [];
        if (kardex.data.length > 1) {
          var Saldo = 0;
          var NroLote = "";
          for (let index = 0; index < kardex.data.length; index++) {
            NroLote = kardex.data[index].nro_lote;
            Saldo += kardex.data[index].saldo;
            const diffTime = Math.abs(
              new Date(kardex.data[index].fec_venci) - new Date()
            );
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 30 || Saldo <= 100) {
              if (diffDays <= 15 || Saldo <= 50) {
                Alert = "bg-red-300";
                MovitoAlert = "Medicamento por agotarse";
                if (diffDays <= 15) {
                  MovitoAlert = "Medicamento por Caducar";
                }
              } else {
                Alert = "bg-yellow-300";
                MovitoAlert = "Medicamento por agotarse";
                if (diffDays <= 30) {
                  MovitoAlert = "Medicamento por Caducar";
                }
              }
              var alert = {
                Alert: Alert,
                MovitoAlert: MovitoAlert,
                NroLote: NroLote,
                id: med.data[a].id,
                nombre: med.data[a].nombre,
              };
              alertMedModal.push(alert);
              alertMed.push(alert);
            }
          }
          med.data[a].Kardex = Saldo;
          med.data[a].Alertas = alertMed;
        } else {
          if (kardex.data.length === 1) {
            med.data[a].Kardex = kardex.data[0].saldo;
            NroLote = kardex.data[0].nro_lote;
            const diffTime = Math.abs(
              new Date(kardex.data[0].fec_venci) - new Date()
            );
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays <= 30 || kardex.data[0].saldo <= 100) {
              if (diffDays <= 15 || kardex.data[0].saldo <= 50) {
                Alert = "bg-red-300";
                MovitoAlert = "Medicamento por agotarse";
                if (diffDays <= 15) {
                  MovitoAlert = "Medicamento por Caducar";
                }
              } else {
                Alert = "bg-yellow-300";
                MovitoAlert = "Medicamento por agotarse";
                if (diffDays <= 30) {
                  MovitoAlert = "Medicamento por Caducar";
                }
              }
              alert = {
                Alert: Alert,
                MovitoAlert: MovitoAlert,
                NroLote: NroLote,
                id: med.data[a].id,
                nombre: med.data[a].nombre,
              };
              alertMedModal.push(alert);
              alertMed.push(alert);
              med.data[a].Alertas = alertMed;
            }
          } else {
            med.data[a].Kardex = 0;
            med.data[a].Alertas = [];
          }
        }
      }
      setMedicinas(med.data);
      setEstaticoMedicinas(med.data);
      setAlertMedicina(alertMedModal);
      setalertOpen(true);
    };

    medicinas();
  }, []);

  const Filtros = () => {
    if (!filCod && !filNom) {
      toast.warning("ingrese por lo menos un filtro");
      return;
    }

    var MedicamentosFiltro = [];

    var filCodExiste = true;
    var filNomExiste = true;

    if (filCod) {
      if (MedicamentosFiltro.length !== 0) {
        var Filtercond = [];
        for (let index = 0; index < MedicamentosFiltro.length; index++) {
          if (MedicamentosFiltro[index].id === Number(filCod)) {
            Filtercond.push(MedicamentosFiltro[index]);
          }
        }
        MedicamentosFiltro = Filtercond;
      } else {
        for (let index = 0; index < EstaticoMedicinas.length; index++) {
          if (EstaticoMedicinas[index].id === Number(filCod)) {
            MedicamentosFiltro.push(EstaticoMedicinas[index]);
          }
        }
      }
      if (MedicamentosFiltro.length === 0) {
        filCodExiste = false;
      }
    }

    if (filNom) {
      if (MedicamentosFiltro.length !== 0) {
        var FilterAseg = [];
        for (let index = 0; index < MedicamentosFiltro.length; index++) {
          if (
            MedicamentosFiltro[index].nombre.toUpperCase() ===
            filNom.toUpperCase()
          ) {
            FilterAseg.push(MedicamentosFiltro[index]);
          }
        }
        MedicamentosFiltro = FilterAseg;
      } else {
        for (let index = 0; index < EstaticoMedicinas.length; index++) {
          if (
            EstaticoMedicinas[index].nombre.toUpperCase() ===
            filNom.toUpperCase()
          ) {
            MedicamentosFiltro.push(EstaticoMedicinas[index]);
          }
        }
      }
      if (MedicamentosFiltro.length === 0) {
        filNomExiste = false;
      }
    }

    if (filNomExiste && filCodExiste && MedicamentosFiltro.length > 0) {
      toast.success("Se aplicaron los filtros");
      setMedicinas(MedicamentosFiltro);
    } else {
      toast.warning("No hay coincidencias con los filtros aplicados");
      setMedicinas([]);
    }
  };

  const LimpiarFiltro = () => {
    setfilCod("");
    setfilNom("");
    setMedicinas(EstaticoMedicinas);
  };

  const BuscarMedicamento = async () => {
    if (!CodForm) {
      toast.warning("ingrese el codigo del Medicamento");
      return;
    }

    const MedicamentoForm = [];

    if (CodForm) {
      for (let index = 0; index < Medicinas.length; index++) {
        if (EstaticoMedicinas[index].id === Number(CodForm)) {
          MedicamentoForm.push(EstaticoMedicinas[index]);
        }
      }
    }

    if (MedicamentoForm.length > 0) {
      setMedicinaForm(MedicamentoForm[0]);
      setStockForm(MedicamentoForm[0].Kardex);
    } else {
      toast.warning("No se encuentra el medicamento");
      setMedicinaForm(null);
    }
  };

  const toggleModal = () => {
    setModalOpen(false);
    setCodForm("");
    setCantidadForm("");
    setLoteForm("");
    setMedicinaForm(null);
  };

  const GuardarLote = async () => {
    var fecha = document.getElementById("FechaVencimiento").value;

    if (!CodForm || !LoteForm || !CantidadForm || !fecha) {
      toast.warning("ingrese todos los datos para registrar nuevo lote");
      return;
    } else {
      var nuevoLote = {
        id_medicina: CodForm,
        nro_lote: LoteForm,
        fec_venci: fecha,
        cantidad: Number(CantidadForm),
        saldo: Number(CantidadForm),
      };

      const kardex = await PostKardex(nuevoLote);
      if (kardex !== null) {
        for (let index = 0; index < Medicinas.length; index++) {
          if (EstaticoMedicinas[index].id === Number(CodForm)) {
            EstaticoMedicinas[index].Kardex = StockForm;
          }
        }
        setMedicinas(EstaticoMedicinas);
        toggleModal();
        toast.success("Se guardo correctamente el nuevo lote");
      } else {
        toast.error("Hubo un al guardar el nuevo lote");
      }
    }
  };

  const detalleMedicameto = async (medicina) => {
    const kardex = await GetKardex(medicina.id);
    medicina.kardex = kardex.data;
    for (let index = 0; index < medicina.kardex.length; index++) {
      if (medicina.Alertas) {
        for (let a = 0; a < medicina.Alertas.length; a++) {
          if (medicina.kardex[index].nro_lote === medicina.Alertas[a].NroLote) {
            medicina.kardex[index].Alert = medicina.Alertas[a].Alert;
          }
        }
      }
    }
    setDetalle(medicina);
    setdetalleOpen(true);
  };

  const MostrarModal = () => {
    setModalOpen(true);
  };

  const toggleAlert = () => {
    setalertOpen(false);
  };
  const soloNumerosRegex = /^[0-9]{0,3}$/; // Expresión regular para aceptar solo números
  const soloTextoRegex = /^[A-Za-zñÑáéíóúÁÉÍÓÚ]{0,15}$/;
  const soloNumerosLote = /^[0-9]{0,5}$/; // Expresión regular para aceptar solo letras

  

  return (
    <div className=" w-full ">
      {modalOpen && (
        <div className="fixed  inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="flex flex-col bg-white w-3/4 border rounded-md">
            <div className="flex flex-row p-5 justify-around">
              <div>
                <label className="text-center" htmlFor="">
                  ID Medicina:
                </label>
                <input
                  type="text"
                  id="idMedicina"
                  value={CodForm}
                  className=" p-1 mx-2 rounded border border-black"
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    if (soloNumerosRegex.test(inputValue)) {
                      setCodForm(inputValue);
                    }
                  }}
                />
              </div>
              <button
                className="bg-verde hover:bg-verde text-white font-bold py-1 px-4 rounded"
                onClick={BuscarMedicamento}>
                Buscar
              </button>
            </div>
            {MedicinaForm && (
              <div className=" p-5">
                <div className=" flex flex-row gap-1">
                  <h3 className=" text-lg">Nombre: </h3>{" "}
                  <h3 className=" text-lg">{MedicinaForm.nombre}</h3>
                </div>
                <div className=" flex flex-row gap-1">
                  <h3 className=" text-lg">Stock: </h3>{" "}
                  <h3 className=" text-lg">{MedicinaForm.Kardex}</h3>
                </div>
                <div className=" flex justify-center my-5">
                  <label htmlFor="">Nro Lote:</label>
                  <input
                    type="text"
                    id="NroLote"
                    value={LoteForm}
                    className=" mx-2 p-1 rounded border border-black"
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (soloNumerosRegex.test(inputValue)) {
                        setLoteForm(inputValue);
                      }
                    }}
                  />
                  <label htmlFor="">Fecha Vencimiento:</label>
                  <input
                    type="date"
                    id="FechaVencimiento"
                    className=" mx-2 p-1 rounded border border-black"
                  />
                  <label htmlFor="">Cantidad:</label>
                  <input
                    type="text"
                    id="Cantidad"
                    value={CantidadForm}
                    className=" mx-2 p-1 rounded border border-black"
                    onChange={(e) => {
                      const inputValue = e.target.value;
                      if (soloNumerosLote.test(inputValue)) {
                        setCantidadForm(inputValue);
                        var NuevaCantidad =
                          Number(inputValue) + MedicinaForm.Kardex;
                        setStockForm(NuevaCantidad);
                      }
                    }}
                  />
                </div>
                <div className=" flex flex-row gap-1">
                  <h3 className=" text-lg">Nuevo Stock: </h3>{" "}
                  <h3 className=" text-lg">{StockForm}</h3>
                </div>
              </div>
            )}
            <div className="flex justify-end my-3 gap-3 px-5">
              <button
                type="button"
                onClick={toggleModal}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
                Cancelar
              </button>
              <button
                type="button"
                onClick={GuardarLote}
                className="bg-celeste  hover:bg-celeste text-white font-bold py-2 px-4 rounded transition-transform transform hover:scale-110">
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
      {detalleOpen && (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="flex flex-col bg-white w-3/4 border rounded-md">
            <div className="flex flex-row gap-1 justify-around my-5">
              <div className=" flex flex-row gap-1">
                <h3 className=" text-lg">ID: </h3>{" "}
                <h3 className=" text-lg">{Detalle.id}</h3>
              </div>
              <div className=" flex flex-row gap-1">
                <h3 className=" text-lg">Nombre: </h3>{" "}
                <h3 className=" text-lg">{Detalle.nombre}</h3>
              </div>
              <div className=" flex flex-row gap-1">
                <h3 className=" text-lg">Stock: </h3>{" "}
                <h3 className=" text-lg">{Detalle.Kardex}</h3>
              </div>
            </div>
            <div>
              <table className="w-full text-center">
                <thead>
                  <tr>
                    <th>Nro Lote</th>
                    <th>Fecha Vencimiento</th>
                    <th>Saldo</th>
                  </tr>
                </thead>
                <tbody>
                  {Detalle.kardex.map((kardex) => (
                    <tr key={kardex.id} className={kardex.Alert}>
                      <td>{kardex.nro_lote}</td>
                      <td>{kardex.fec_venci}</td>
                      <td>{kardex.saldo}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex justify-end my-3 gap-3 px-5">
              <button
                type="button"
                onClick={() => {
                  setdetalleOpen(false);
                }}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {alertOpen && (
        <div className="fixed  inset-0 z-50 overflow-auto bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="flex flex-col bg-white w-3/4 border rounded-md p-5">
            <h1 className="text-center text-3xl">
              Medicamentos que presentan poca cantidad o estan por vencer
            </h1>
            <table className="w-full text-center">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nombre</th>
                  <th>Nro Lote</th>
                  <th>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {AlertMedicina.map((alert) => (
                  <tr key={alert.NroLote}>
                    <td>{alert.id}</td>
                    <td>{alert.nombre}</td>
                    <td>{alert.NroLote}</td>
                    <td className={alert.Alert}>{alert.MovitoAlert}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-end my-3 gap-3 px-5">
              <button
                type="button"
                onClick={toggleAlert}
                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded mr-2">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      <h1 className=" text-xl mx-4 my-4">Lista de Medicinas</h1>
      <div className=" w-full flex ">
        <div className=" flex flex-col w-1/5 m-8 gap-4">
          <label htmlFor="">ID Medicina:</label>
          <input
            type="text"
            id="idMedicina"
            value={filCod}
            className=" p-2 mb-4 rounded border border-black"
            onChange={(e) => {
              const inputValue = e.target.value;
              if (soloNumerosRegex.test(inputValue)) {
                setfilCod(inputValue);
              }
            }}
          />
          <label htmlFor="">Nombre:</label>
          <input
            type="text"
            id="Nombre"
            value={filNom}
            className=" p-2 mb-4 rounded border border-black"
            onChange={(e) => {
              const inputValue = e.target.value;
              if (soloTextoRegex.test(inputValue)) {
                setfilNom(inputValue);
              }
            }}
          />
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
          <button
            onClick={() => {
              setalertOpen(true);
            }}
            className="bg-verde hover:bg-verde text-white font-bold py-2 px-4 rounded ">
            Ver Alerta de Medicamentos
          </button>
        </div>
        <div className=" w-4/5 ">
          <div className="flex justify-end my-5">
            <button
              className="bg-gradient-to-r from-blue-200 to-verdesuave  font-semibold py-2 px-4 rounded "
              onClick={MostrarModal}>
              Nuevo Lote
            </button>
          </div>
          <table className=" w-full">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Stock Total</th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody className=" text-lg text-center ">
              {Medicinas &&
                Medicinas.map((medicina) => (
                  <tr
                    key={medicina.id}
                    className=" my-2 border-y-2 border-black ">
                    <td>{medicina.id}</td>
                    <td>{medicina.nombre}</td>
                    <td>{medicina.Kardex}</td>
                    <td
                      className=" cursor-pointer mx-auto"
                      onClick={() => {
                        detalleMedicameto(medicina);
                      }}>
                      {<IconDetail />}
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
}
