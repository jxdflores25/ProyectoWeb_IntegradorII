import "leaflet/dist/leaflet.css";
import { useCallback, useMemo, useRef, useState } from "react";
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
import { Tooltip } from "react-tooltip";

function Register() {
  const [inputVisible, setInputVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [dniValue, setDniValue] = useState("");

  const [dniActive, setdniActive] = useState(false);

  const [data, setData] = useState([]);

  const LocationMarker = () => {
    const [position, setPosition] = useState(null);
    const [draggable, setDraggable] = useState(false);
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
      () => ({
        dragend() {
          const marker = markerRef.current;
          if (marker != null) {
            setPosition(marker.getLatLng());
            document.getElementById("Latitud").value = marker.getLatLng().lat;
            document.getElementById("Longitud").value = marker.getLatLng().lng;
          }
        },
      }),
      []
    );
    const toggleDraggable = useCallback(() => {
      setDraggable((d) => !d);
    }, []);
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
      <Marker
        position={position}
        draggable={draggable}
        eventHandlers={eventHandlers}
        ref={markerRef}>
        <Popup minWidth={90}>
          <span onClick={toggleDraggable}>
            {draggable
              ? "Haga Click en este texto para confirmar la ubicación"
              : "Haga Click en este texto para mover el marcador"}
          </span>
        </Popup>
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
    document.getElementById("TipoSeguro").value = data.TipoSeguro;
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
        localStorage.setItem("registrado", true);
        window.location.href = "/Login";
      }
    }
  };

  const ActualizarDatos = (data) => {
    if (
      document.getElementById("Contraseña").value === "" ||
      document.getElementById("Latitud").value === "" ||
      document.getElementById("Longitud").value === ""
    ) {
      toast.warning("Porfavor ingrese todos los datos");
      return null;
    } else {
      data.contraseña = document.getElementById("Contraseña").value;
      data.ubicacion = document.getElementById("Ubicacion").value;
      data.TipoSeguro = document.getElementById("TipoSeguro").value;
      data.Latitud = document.getElementById("Latitud").value;
      data.Longitud = document.getElementById("Longitud").value;
      return data;
    }
  };

  return (
    
    <div className="max-w-md mx-auto mt-36 p-4 bg-gradient-to-r from-blue-200 to-verdesuave rounded-lg border-4 border-spin flex flex-col items-center overflow-hidden">
      <div className="top-line border-line"></div>
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
        className="w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:border-celeste"
        disabled={dniActive}
      />
      {buttonVisible && (
        <button
          onClick={handleVerification}
          className="css-button-sliding-to-top--green transition-transform transform hover:scale-105">
          Verificar
        </button>
      )}

      <div className={`input-container ${inputVisible ? "block" : "hidden"}`}>
        <label htmlFor="Ubicacion" className="block mb-2 mx-1">
          Nombre
        </label>
        <input
          type="text"
          placeholder="Nombre"
          id="Nombre"
          className="w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:border-celeste"
          disabled
        />
        <label htmlFor="Ubicacion" className="block mb-2 mx-1">
          Apellido
        </label>
        <input
          type="text"
          placeholder="Apellido"
          id="Apellido"
          className="w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:border-celeste"
          disabled
        />
        <label htmlFor="Ubicacion" className="block mb-2 mx-1">
          Seguro
        </label>
        <input
          type="text"
          placeholder="TipoSeguro"
          id="TipoSeguro"
          className="w-full p-2 mb-4 rounded border border-gray-300 focus:outline-none focus:border-celeste"
          disabled
        />
        <label htmlFor="" className="mb-2 mx-1">
          Seleccione sector de entrega
        </label>
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
            className="mt-1 w-full rounded-md border border-celeste  bg-white text-sm text-gray-700 shadow-sm"
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
            className="mt-1 w-full rounded-md border border-celeste  bg-white text-sm text-gray-700 shadow-sm"
          />
        </div>
        <label htmlFor="Ubicacion" className="block mb-2 text-center">
          Indique ubicación de entrega de medicamentos
        </label>
        <div id="Mapa" className="h-52 mb-4" data-tooltip-id="mapa">
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
        <Tooltip
          id="mapa"
          place="right"
          html='<div class="w-60"><h5>Indicaciones:<h5><br><h6>1. Haga click y espere a que salga su ubicación actual</h6><br><h6>2. Si desea cambiar lugar entrega, haga click en icono de ubicacion para cambiarla manualmente</h6><br><h6>3. Haga click en el texto ubicado en la parte superior del icono para activar la funcion de mover</h6></div>'
          variant="warning"
        />
        <input
          type="password"
          placeholder="Contraseña"
          id="Contraseña"
          className="w-full p-2 mb-4 rounded border border-gray-300"
        />
        <div className="authButtons basis-1/4 flex flex-col items-center justify-center ">
          <button
            onClick={() => {
              handleRegistration();
            }}
            className="rounded-md bg-gradient-to-r from-celeste to-verde text-white font-bold py-2 px-4 mb-4 transition-transform transform hover:scale-110">
            Registrar
          </button>
        </div>
      </div>
      <div className="bottom-line border-line"></div>
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
