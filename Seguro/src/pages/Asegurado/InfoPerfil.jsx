import PropTypes from "prop-types";
import IconPerfil from "../../assets/Icons/IconPerfil";

const InfoPerfil = ({ Data }) => {
  return (
    <div className="flex-1 p-4">
      {/* Contenedor para el contenido principal */}
      <h1 className="text-center text-2xl font-bold">Informacion</h1>
      <div className="flex items-center justify-center">
        <IconPerfil />
      </div>
      <form action="#" className="mt-8 mx-auto max-w-md">
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
              className="mt-1 w-full rounded-md border border-amber-700 bg-white text-sm text-gray-700 shadow-sm"
              value={Data.nombre}
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
              value={Data.apellido}
              className="mt-1 w-full rounded-md border border-amber-700  bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6">
            <label
              htmlFor="text"
              className="block text-sm font-medium text-gray-700">
              Dirección
            </label>
            <input
              type="email"
              id="Email"
              name="email"
              value={Data.direccion}
              className="mt-1 w-full rounded-md border border-amber-700  bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="Password"
              className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="Password"
              name="password"
              value={Data.contraseña}
              className="mt-1 w-full rounded-md border border-amber-700  bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6 sm:col-span-3">
            <label
              htmlFor="Phone"
              className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="text"
              id="Phone"
              name="phone"
              value={Data.telefono}
              className="mt-1 w-full rounded-md border border-amber-700 bg-white text-sm text-gray-700 shadow-sm"
            />
          </div>

          <div className="col-span-6 flex justify-center">
            <button
              className="inline-block w-full sm:w-auto shrink-0 rounded-md border border-amber-600 bg-amber-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-amber-600 focus:outline-none focus:ring active:text-amber-500 text-center"
              style={{ cursor: "pointer" }}>
              Guardar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default InfoPerfil;

InfoPerfil.propTypes = {
  Data: PropTypes.object.isRequired,
};
