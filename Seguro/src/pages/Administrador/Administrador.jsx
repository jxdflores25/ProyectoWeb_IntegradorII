import { Navigate } from "react-router-dom";
import {
  GetAdministrador,
  GetAsegurado,
  GetKardex,
  GetMedicina,
  GetMedicinaNombre,
  GetRecetas,
} from "../../API/API_Seguro";
import { useEffect, useState } from "react";
import NavbarAdmin from "../../components/Administrador/NavbarAdmin";
import IconDelivery from "../../assets/Icons/IconDelivery";

const Administrador = () => {
  const [Administrador, setAdministrador] = useState({
    nombre: "Usuario",
    apellido: "",
  });

  const [RecetasAlta, setRecetasAlta] = useState([]);
  const [RecetasBaja, setRecetasBaja] = useState([]);
  const [Detalle, setDetalle] = useState(null);
  const [Medicinas, setMedicinas] = useState([]);
  const [Paciente, setPaciente] = useState([]);

  useEffect(() => {
    const Datos = async (dni) => {
      const resp = await GetAdministrador(dni);
      setAdministrador(resp.data);
    };
    Datos(localStorage.getItem("usuario"));
  }, []);

  if (localStorage.getItem("tipo") !== "Administrador") {
    return <Navigate to="/" />;
  }

  const getRecetas = async () => {
    const data = await GetRecetas("2024-05-01", "13:00:00");
    const receta = data.data;
    const recetaAlta = [];
    const recetaBaja = [];
    for (let index = 0; index < receta.length; index++) {
      if (receta[index].prioridad === "Alta") {
        recetaAlta.push(receta[index]);
      } else {
        recetaBaja.push(receta[index]);
      }
    }

    setRecetasAlta(recetaAlta);
    setRecetasBaja(recetaBaja);
  };

  const detalleReceta = async (receta) => {
    setDetalle(receta);
    const med = await GetMedicina(receta.id);
    const pac = await GetAsegurado(receta.dni_Paciente);
    const medicina = await NombreMedicina(med.data);
    setMedicinas(medicina);
    setPaciente(pac.data);
  };

  const NombreMedicina = async (data) => {
    for (let index = 0; index < data.length; index++) {
      const medicina = await GetMedicinaNombre(data[index].id_medicina);
      const kardex = await GetKardex(data[index].id_medicina);
      data[index].nombreMedicina = medicina.data.nombre;
      data[index].Kardex = kardex.data[0].saldo;
    }
    return data;
  };

  return (
    <div className="h-full">
      <NavbarAdmin />
      <div className="flex flex-col items-center mt-2 lg:mt-5">
        <h1 className="text-4xl sm:text-6xl lg:text-2xl text-center tracking-wide">
          Bienvenido Administrador: &nbsp;
          <span className="bg-gradient-to-r from-orange-500 to-orange-800 text-transparent bg-clip-text">
            {Administrador.nombre + " " + Administrador.apellido}
          </span>
        </h1>
      </div>

      <div className="flex h-full ">
        <div className="basis-1/4 flex flex-col items-center">
          <div className="border border-amber-500 w-44 rounded-md py-4">
            <button
              className="w-full h-full flex justify-center items-center"
              onClick={getRecetas}>
              cargar recetas
            </button>
          </div>

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
                  RecetasAlta.map((Receta) => (
                    <tr key={Receta.id}>
                      <td>{Receta.id}</td>
                      <td>{Receta.dni_Paciente}</td>
                      <td
                        className="flex justify-center cursor-pointer"
                        onClick={() => {
                          detalleReceta(Receta);
                        }}>
                        <IconDelivery />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <h4 className="py-5 text-xl text-center font-bold">
              Prioridad Baja
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
                {RecetasBaja &&
                  RecetasBaja.map((Receta) => (
                    <tr key={Receta.id}>
                      <td>{Receta.id}</td>
                      <td>{Receta.dni_Paciente}</td>
                      <td
                        className="flex justify-center cursor-pointer"
                        onClick={() => {
                          detalleReceta(Receta);
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
              <h2 className=" text-3xl text-center ">Receta</h2>
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
                        <td>{medicina.Kardex}</td>
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
                <button className=" text-xl bg-blue-700 text-white p-2 rounded-md hover:scale-105 duration-300">
                  Asignar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default Administrador;
