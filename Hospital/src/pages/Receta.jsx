import { useState } from "react";
import {
  GuardarRecetaMedica,
  GuardarRecetaMedicina,
} from "../API/API_Hospital";
import dayjs from "dayjs";

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
    alert("Receta Guardada");
    document.querySelector("#DNI").value = "";
  }

  // Generar fecha del dia
  const day = dayjs().format("DD-MM-YYYY");

  //Agregar Medicamentos a la lista
  const medicamento = {};
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    medicamento[name] = value;
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
            <select name="medicamento" id="" onChange={handleChange}>
              <option value="" selected disabled hidden>
                Elige Medicamento
              </option>
              <option value="Aspirina">Aspirina</option>
              <option value="Frutenzima">Frutenzima</option>
              <option value="Ceterizina">Ceterizina</option>
              <option value="Cetanicol">Cetanicol</option>
            </select>
            <label htmlFor="">Descripcion:</label>{" "}
            <input type="text" name="descripcion" onChange={handleChange} />
            <label htmlFor="">Cantidad:</label>{" "}
            <input type="number" name="cantidad" onChange={handleChange} />
            <input type="submit" value="Agregar" />
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
                Medicamentos.map((Medicamento) => (
                  <tr key={Medicamento.medicamento}>
                    <td>{Medicamento.medicamento}</td>
                    <td>{Medicamento.descripcion}</td>
                    <td>{Medicamento.cantidad}</td>
                    <td>eliminar-editar</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </section>
      </div>
      <button onClick={loadTasks}>Guardar</button>
    </section>
  );
}
