import PropTypes from "prop-types";
import IconPerfil from "../../assets/Icons/IconPerfil";
import { PutAsegurado } from "../../API/API_Seguro";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useState } from "react";

const InfoPerfil = ({ Data }) => {
  const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const map = useMapEvent({
      click() {
        map.locate();
      },
      locationfound(e) {
        setPosition(e.latlng);
        map.flyTo(e.latlng, map.getZoom());
        document.getElementById("Latitud").value = e.latitude;
        document.getElementById("Longitud").value = e.longitude;
      },
    });

    return position === null ? null : (
      <Marker position={position}>
        <Popup>Tu estas Aqui</Popup>
      </Marker>
    );
  };

  const handleRegistration = async (event) => {
    event.preventDefault();

    Data.nombre = document.getElementById("FirstName").value;
    Data.apellido = document.getElementById("LastName").value;
    Data.direccion = document.getElementById("Direccion").value;
    Data.ubicacion = document.getElementById("Ubicacion").value;
    Data.TipoSeguro = document.getElementById("TipoSeguro").value;
    Data.Latitud = document.getElementById("Latitud").value;
    Data.Longitud = document.getElementById("Longitud").value;
    Data.contraseña = document.getElementById("Password").value;
    Data.telefono = document.getElementById("Phone").value;

    const res = await PutAsegurado(Data.dni, Data);
    if (res !== null) {
      window.location.href = "/Asegurado";
    }
  };

  return (
    <div className="flex-row p-4 h-full">
      {/* Contenedor para el contenido principal */}
      <h1 className="text-center text-2xl font-bold">Informacion</h1>
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
                className="mt-1 w-full rounded-md border border-amber-700 bg-white text-sm text-gray-700 shadow-sm"
                defaultValue={Data.nombre}
                required
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
                className="mt-1 w-full rounded-md border border-amber-700  bg-white text-sm text-gray-700 shadow-sm"
                required
              />
            </div>

            <div className="col-span-6">
              <label
                htmlFor="text"
                className="block text-sm font-medium text-gray-700">
                Dirección
              </label>
              <input
                type="text"
                id="Direccion"
                name="Direccion"
                defaultValue={Data.direccion}
                className="mt-1 w-full rounded-md border border-amber-700  bg-white text-sm text-gray-700 shadow-sm"
                required
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="Ubicacion"
                className="block text-sm font-medium text-gray-700">
                Ubicacion
              </label>
              <select
                name="Ubicacion"
                id="Ubicacion"
                className="mt-1 w-full rounded-md border border-amber-700  bg-white text-sm text-gray-700 shadow-sm"
                defaultValue={Data.ubicacion}>
                <option value="Lima Sur">Lima Sur</option>
                <option value="Lima Norte">Lima Norte</option>
                <option value="Lima Centro">Lima Centro</option>
              </select>
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="TipoSeguro"
                className="block text-sm font-medium text-gray-700">
                Tipo Seguro
              </label>
              <select
                name="TipoSeguro"
                id="TipoSeguro"
                className="mt-1 w-full rounded-md border border-amber-700  bg-white text-sm text-gray-700 shadow-sm"
                defaultValue={Data.TipoSeguro}>
                <option value="Rimac">Rimac</option>
                <option value="Pacifico">Pacifico</option>
                <option value="Mapfre">Mapfre</option>
              </select>
            </div>

            <div className="col-span-5 sm:col-span-3 hidden">
              <label
                htmlFor="Latitud"
                className="block text-sm font-medium text-gray-700">
                Latitud
              </label>
              <input
                type="text"
                id="Latitud"
                name="Latitud"
                className="mt-1 w-full rounded-md border border-amber-700  bg-white text-sm text-gray-700 shadow-sm"
              />
            </div>

            <div className="col-span-5 sm:col-span-3 hidden">
              <label
                htmlFor="Longitud"
                className="block text-sm font-medium text-gray-700">
                Longitud
              </label>
              <input
                type="text"
                id="Longitud"
                name="Longitud"
                className="mt-1 w-full rounded-md border border-amber-700  bg-white text-sm text-gray-700 shadow-sm"
              />
            </div>

            <div className=" col-span-6 lg:h-36 h-52  relative">
              <MapContainer
                center={{ lat: -12.0475761, lng: -77.0310159 }}
                zoom={13}
                scrollWheelZoom={true}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker />
              </MapContainer>
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
                defaultValue={Data.contraseña}
                className="mt-1 w-full rounded-md border border-amber-700  bg-white text-sm text-gray-700 shadow-sm"
                required
              />
            </div>

            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="Phone"
                className="block text-sm font-medium text-gray-700">
                Teléfono
              </label>
              <input
                type="number"
                id="Phone"
                name="phone"
                defaultValue={Data.telefono}
                className="mt-1 w-full rounded-md border border-amber-700 bg-white text-sm text-gray-700 shadow-sm"
                required
              />
            </div>

            <div className="col-span-6 flex justify-center">
              <input
                className="inline-block w-full sm:w-auto shrink-0 rounded-md border border-amber-600 bg-amber-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-amber-600 focus:outline-none focus:ring active:text-amber-500 text-center"
                style={{ cursor: "pointer" }}
                type="submit"
                value="Guardar"
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
