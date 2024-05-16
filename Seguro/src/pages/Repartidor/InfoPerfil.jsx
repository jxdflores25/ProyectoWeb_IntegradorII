import PropTypes from "prop-types";
import IconPerfil from "../../assets/Icons/IconPerfil";
import { PutConductor } from "../../API/API_Seguro";
import "leaflet/dist/leaflet.css";
import "react-tooltip/dist/react-tooltip.css";

const InfoPerfil = ({ Data }) => {
  const handleRegistration = async (event) => {
    event.preventDefault();

    Data.nombre = document.getElementById("FirstName").value;
    Data.apellido = document.getElementById("LastName").value;
    Data.direccion = document.getElementById("Ubicacion").value;
    Data.contraseña = document.getElementById("Password").value;

    const res = await PutConductor(Data.dni, Data);
    if (res !== null) {
      window.location.href = "/Repartidor";
    }
  };

  return (
    <div className="flex-row p-4 h-full">
      {/* Contenedor para el contenido principal */}
      <h1 className="text-center text-2xl font-bold">Información</h1>
      <div className="flex items-center justify-center">
        <IconPerfil />
      </div>
      <div>
        <form className="mt-8 max-w-md mx-auto ">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="FirstName"
                className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                id="FirstName"
                name="first_name"
                className="mt-1 w-full bg-slate-300 rounded-md border border-celeste  text-sm text-gray-700 shadow-sm"
                defaultValue={Data.nombre}
                disabled
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="LastName"
                className="block text-sm font-medium text-gray-700">
                Apellido
              </label>
              <input
                type="text"
                id="LastName"
                name="last_name"
                defaultValue={Data.apellido}
                className="mt-1 w-full rounded-md bg-slate-300  border border-celeste  text-sm text-gray-700 shadow-sm"
                disabled
              />
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="Ubicacion"
                className="block text-sm font-medium text-gray-700">
                Ubicación
              </label>
              <select
                name="Ubicacion"
                id="Ubicacion"
                className="mt-1 w-full rounded-md border border-celeste   text-sm text-gray-700 shadow-sm"
                defaultValue={Data.direccion}>
                <option value="LimaSur">Lima Sur</option>
                <option value="LimaNorte">Lima Norte</option>
                <option value="LimaCentro">Lima Centro</option>
              </select>
            </div>
            <div className="col-span-6 sm:col-span-3 ">
              <label
                htmlFor="Password"
                className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                type="password"
                id="Password"
                name="password"
                defaultValue={Data.contraseña}
                className="mt-1 w-full rounded-md border border-celeste   text-sm text-gray-700 shadow-sm"
                required
              />
            </div>

            <div className="col-span-6 flex justify-center">
              <input
                className="inline-block w-full sm:w-auto shrink-0 rounded-md border border-celeste bg-celeste  px-12 py-3 text-sm font-medium text-white transition hover:bg-gradient-to-r hover:from-verde hover:to-celeste focus:ring focus:outline-none focus:border-celeste text-center"
                style={{ cursor: "pointer" }}
                type="submit"
                value="Actualizar"
                onClick={handleRegistration}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default InfoPerfil;

InfoPerfil.propTypes = {
  Data: PropTypes.object.isRequired,
};
