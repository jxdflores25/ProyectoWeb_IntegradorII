import { useState } from "react";
import {
  GuardarRecetaMedica,
  GuardarRecetaMedicina,
} from "../API/API_Hospital";
import Eliminar from "../Icons/Eliminar.jsx";
import Editar from "../Icons/Editar.jsx";
import dayjs from "dayjs";
import { Slide, ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

export default function Receta() {
  //Guardar Medicamentos
  const [Medicamentos, setMedicamentos] = useState([]);

  //Guardar RecetaConMedicamentos
  async function loadTasks() {
    const DNI = document.querySelector("#DNI").value;
    const NombreMedico = document.querySelector("#NombreMedico").value;
    const res = await GuardarRecetaMedica(DNI, NombreMedico);
    GuardarRecetaMedicina(res.data.id, Medicamentos);
    setMedicamentos([]);
    document.querySelector("#DNI").value = "";
  }

  // Generar fecha del dia
  const day = dayjs().format("DD-MM-YYYY");

  //Eliminar Medicamento de la lista
  const handleDelete = (index) => {
    const newList = [...Medicamentos];
    newList.splice(index, 1);
    setMedicamentos(newList);
  };

  //Editar Medicamento de la lista
  const handleEdit = (index) => {
    document.querySelector("#medicamento").value =
      Medicamentos[index].medicamento;
    document.querySelector("#descripcion").value =
      Medicamentos[index].descripcion;
    document.querySelector("#cantidad").value = Medicamentos[index].cantidad;
    handleDelete(index);
  };

  //Agregar Medicamentos a la lista
  const medicamento = {};
  const handleAdd = () => {
    const value = document.querySelector("#medicamento").value;
    medicamento["medicamento"] = value;
    const value2 = document.querySelector("#descripcion").value;
    medicamento["descripcion"] = value2;
    const value3 = document.querySelector("#cantidad").value;
    medicamento["cantidad"] = value3;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMedicamentos([...Medicamentos, medicamento]);
    document.querySelector("form").reset();
  };

  return (
    <section className=" h-full flex flex-col gap-4 justify-center bg-gray-400 items-center">
      <h2 className="w-full text-center">RECETA</h2>
      <div className="flex flex-col gap-4 w-full px-20">
        <header className="flex justify-between">
          <p>
            FECHA <input type="text" value={day} disabled />
          </p>
          <p>
            DNI <input type="text" id="DNI" />
          </p>
          <p>
            MEDICO{" "}
            <input type="text" value="Juan Carlos" disabled id="NombreMedico" />
          </p>
        </header>
        <section className=" flex flex-col gap-4">
          <form onSubmit={handleSubmit} className=" flex justify-between">
            <label htmlFor="">Medicamento:</label>
            <select name="medicamento" id="medicamento">
              <option value="" selected disabled hidden>
                Elige Medicamento
              </option>
              <option value="Aspirina">Aspirina</option>
              <option value="Frutenzima">Frutenzima</option>
              <option value="Ceterizina">Ceterizina</option>
              <option value="Cetanicol">Cetanicol</option>
            </select>
            <label htmlFor="">Descripcion:</label>{" "}
            <input type="text" id="descripcion" name="descripcion" />
            <label htmlFor="">Cantidad:</label>{" "}
            <input type="number" id="cantidad" name="cantidad" />
            <input type="submit" value="Agregar" onClick={handleAdd} />
          </form>
          <table>
            <thead>
              <tr>
                <th>Medicamento</th>
                <th>Descripcion</th>
                <th>Cantidad</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {Medicamentos &&
                Medicamentos.map((Medicamento, index) => (
                  <tr key={Medicamento.medicamento}>
                    <td>{Medicamento.medicamento}</td>
                    <td>{Medicamento.descripcion}</td>
                    <td>{Medicamento.cantidad}</td>
                    <td className="flex justify-between">
                      <button
                        className=" bg-orange-400 "
                        onClick={() => handleDelete(index)}>
                        <Eliminar />
                      </button>
                      <button
                        className=" bg-orange-400 "
                        onClick={() => handleEdit(index)}>
                        <Editar />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </div>
      <button
        onClick={() => {
          toast.promise(loadTasks, {
            pending: "Guardando la receta",
            success: "Receta Guardada",
            error: "Ocurrio un error",
          });
        }}>
        Guardar
      </button>
      <ToastContainer
        position="top-right"
        autoClose={3000}
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
    </section>
  );
}
