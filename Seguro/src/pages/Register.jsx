import "leaflet/dist/leaflet.css";
import { useState } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { GetAsegurado, PutAsegurado } from "../API/API_Seguro";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";

function Register() {
  const [inputVisible, setInputVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [dniValue, setDniValue] = useState("");

  const [dniActive, setdniActive] = useState(false);

  const [data, setData] = useState([]);

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

  const handleVerification = async () => {
    if (dniValue.length !== 8) {
      toast.warning("Digite un DNI Valido");
      return;
    } else {
      const res = await GetAsegurado(dniValue);
      if (res !== null) {
        if (res.data.contraseña === null) {
          MostrarDatos(res.data);
          setInputVisible(true);
          setButtonVisible(false);
          setdniActive(true);
          setData(res.data);
        } else {
          toast.warning("Usted ya se encuentra registrado");
        }
      } else {
        toast.error("Usted no tiene Seguro");
      }
    }
  };

  const MostrarDatos = (data) => {
    document.getElementById("Nombre").value = data.nombre;
    document.getElementById("Apellido").value = data.apellido;
    document.getElementById("Direccion").value = data.direccion;
    document.getElementById("TipoSeguro").value = data.TipoSeguro + " Seguro";
  };

  const handleDniChange = (e) => {
    const value = e.target.value;
    const truncatedValue = value.slice(0, 8); // Limitar a 8 dígitos
    if (/^\d*$/.test(truncatedValue)) {
      // Verificar si el valor truncado contiene solo dígitos
      setDniValue(truncatedValue);
    }
  };

  const handleRegistration = async () => {
    const dataActu = ActualizarDatos(data);
    if (dataActu !== null) {
      const res = await PutAsegurado(dniValue, dataActu);
      if (res !== null) {
        window.location.href = "/Login";
      }
    }
  };

  const ActualizarDatos = (data) => {
    if (
      document.getElementById("Direccion").value === "" ||
      document.getElementById("Contraseña").value === ""
    ) {
      toast.warning("Porfavor ingrese todos los datos");
      return null;
    } else {
      data.direccion = document.getElementById("Direccion").value;
      data.contraseña = document.getElementById("Contraseña").value;
      data.ubicacion = document.getElementById("Ubicacion").value;
      data.TipoSeguro = document.getElementById("TipoSeguro").value;
      data.Latitud = document.getElementById("Latitud").value;
      data.Longitud = document.getElementById("Longitud").value;
      return data;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-36 p-4 bg-gray-100 rounded-lg border border-amber-600 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Regístrate</h1>
      <label htmlFor="dni" className="block mb-2">
        Ingrese su DNI
      </label>
      <input
        required
        type="text"
        id="dni"
        value={dniValue}
        onChange={handleDniChange}
        className="w-full p-2 mb-4 rounded border border-gray-300"
        disabled={dniActive}
      />
      {buttonVisible && (
        <button
          onClick={handleVerification}
          className="bg-amber-600 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded mb-4">
          Verificar
        </button>
      )}

      <div className={`input-container ${inputVisible ? "block" : "hidden"}`}>
        <input
          type="text"
          placeholder="Nombre"
          id="Nombre"
          className="w-full p-2 mb-4 rounded border border-gray-300"
          disabled
        />
        <input
          type="text"
          placeholder="Apellido"
          id="Apellido"
          className="w-full p-2 mb-4 rounded border border-gray-300"
          disabled
        />
        <input
          type="text"
          placeholder="TipoSeguro"
          id="TipoSeguro"
          className="w-full p-2 mb-4 rounded border border-gray-300"
          disabled
        />
        <input
          type="text"
          placeholder="Dirección"
          id="Direccion"
          className="w-full p-2 mb-4 rounded border border-gray-300"
        />
        <select
          name="Ubicacion"
          id="Ubicacion"
          className="w-full p-2 mb-4 rounded border border-gray-300">
          <option value="Lima Sur">Lima Sur</option>
          <option value="Lima Norte">Lima Norte</option>
          <option value="Lima Centro">Lima Centro</option>
        </select>
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

        <div className="h-52 mb-4">
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
        <input
          type="password"
          placeholder="Contraseña"
          id="Contraseña"
          className="w-full p-2 mb-4 rounded border border-gray-300"
        />
        <div className="authButtons basis-1/4 border-4 flex flex-col items-center justify-center">
          <button
            onClick={() => {
              toast.promise(handleRegistration, {
                pending: "Registrando Asegurado",
                success: "Asegurado Registrado",
                error: "Ocurrió un error",
              });
            }}
            className="bg-amber-600 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded content-center">
            Registrar
          </button>
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
export default Register;
