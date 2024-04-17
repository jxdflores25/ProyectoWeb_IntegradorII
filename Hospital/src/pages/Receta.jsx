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
    <div className="flex justify-center items-center h-screen bg-slate-600 ">
    <section className="flex flex-col gap-4 bg-stone-400 justify-center items-center p-4">
      <h2 className="w-full text-center font-bold text-5xl my-5 ">RECETA</h2>
      <div className="flex flex-col gap-4 w-full px-20">
        <header className="flex justify-between">
          <p>
            FECHA<input className="w-9/12 border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent" type="text" value={day} disabled />
          </p>
          <p>
            DNI <input className="w-9/12 border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent" type="text" id="DNI" />
          </p>
          <p>
            MEDICO{" "}
            <input className="w-9/12 border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent" type="text" value="Juan Carlos" disabled id="NombreMedico" />
          </p>
        </header>
        <section className="">
          <div className="flex justify-center items-center">
          <form onSubmit={handleSubmit} className=" flex flex-col w-full ">
            <div className="flex justify-evenly gap-5">
            <label htmlFor="" className="">Medicamento:</label>
            <select name="medicamento" id="medicamento" className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent" >
              <option value="" selected disabled hidden c>
                Elige Medicamento
              </option>
              
              <option className="" value="Aspirina">Aspirina</option>
              <option value="Frutenzima">Frutenzima</option>
              <option value="Ceterizina">Ceterizina</option>
              <option value="Cetanicol">Cetanicol</option>
            </select>
            
            <label htmlFor="">Descripcion:</label>{" "}
            <input type="text" id="descripcion" name="descripcion" className="w-full border-2 border-gray-100 rounded-xl p-2 mt-1 bg-transparent" />
            </div>
            <div className="flex justify-evenly gap-5 mt-5">
            <label htmlFor="">Cantidad:</label>{" "}
            <input type="number" id="cantidad" name="cantidad" />
            <input type="submit" value="Agregar" onClick={handleAdd}  className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-out transition-all py-1 rounded-xl bg-orange-500 text-white text-lg fond bold px-5"/>
            </div>
          </form>
          </div>
          <div className="flex justify-between gap-5 ">
          <table className="mt-7 w-full">
            
            <thead className="bg-amber-500 " >
              <tr className="">
                <th className="py-4">Medicamento</th>
                <th className="py-4">Descripcion</th>
                <th className="py-4">Cantidad</th>
                <th className="py-4">Opciones</th>
              </tr>
            </thead>
            <tbody className="">
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
          </div>
        </section>
      </div>
      <button
 className="active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-out transition-all py-3 rounded-xl bg-orange-500 text-white text-lg fond bold px-5"
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
    </div>
  );
}
