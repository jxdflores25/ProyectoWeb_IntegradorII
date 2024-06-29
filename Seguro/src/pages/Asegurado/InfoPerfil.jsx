import { useCallback, useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import IconPerfil from "../../assets/Icons/IconPerfil";
import { PutAsegurado } from "../../API/API_Seguro";
import { Tooltip } from "react-tooltip";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-tooltip/dist/react-tooltip.css";
import { ToastContainer, Slide, toast } from "react-toastify";

const InfoPerfil = ({ Data }) => {
  const [Telefono, setTelefono] = useState(Data.telefono);
  const [position, setPosition] = useState({
    lat: Data.Latitud,
    lng: Data.Longitud,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState(Data.contraseña || ''); // Inicializa con la contraseña existente o cadena vacía si no hay.
const [passwordStrength, setPasswordStrength] = useState('');

const toggleShowPassword = () => {
  setShowPassword(prevShowPassword => !prevShowPassword);
};
const evaluatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 12) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/\d/.test(password)) strength++;
  if (/[@_%$&/!?]/.test(password)) strength++;

  switch (strength) {
    case 1:
      return "débil";
    case 2:
      return "medio";
    case 3:
      return "fuerte";
    case 4:
      return "muy fuerte";
    default:
      return "muy débil";
  }
};
const handlePasswordChange = (event) => {
 const newPassword = event.target.value.replace(/\s/g, ""); // Elimina espacios
  setPassword(newPassword);
  const strength = evaluatePasswordStrength(newPassword);
  setPasswordStrength(strength);
};

  const LocationMarker = () => {
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

  const handleRegistration = async (event) => {
  event.preventDefault();
  if (passwordStrength !== 'muy fuerte') {
    toast.warning("La contraseña debe tener al menos 12 caracteres, una letra mayúscula, un número y un caracter especial.");
    return; // Detiene la función si la contraseña no es suficientemente fuerte
  }

  try {
    Data.nombre = document.getElementById("FirstName").value;
    Data.apellido = document.getElementById("LastName").value;
    Data.ubicacion = document.getElementById("Ubicacion").value;
    Data.TipoSeguro = document.getElementById("TipoSeguro").value;
    Data.Latitud = document.getElementById("Latitud").value;
    Data.Longitud = document.getElementById("Longitud").value;
    Data.contraseña = document.getElementById("Password").value;
    Data.telefono = document.getElementById("Phone").value;

    if (Data.telefono.length === 9) {
      const res = await PutAsegurado(Data.dni, Data);
      if (res !== null) {
        window.location.href = "/Asegurado";
      } else {
        toast.error("Error al actualizar los datos. Por favor, inténtelo de nuevo.");
      }
    } else {
      toast.warning("Ingrese un número válido de teléfono.");
    }
  } catch (error) {
    toast.error("Ocurrió un error al actualizar los datos.");
    console.error("Error en la actualización: ", error);
  }
};
  

  const soloNumerosRegex = /^9[0-9]*$/;

  const [showTooltip, setShowTooltip] = useState(false);
  const handleFocus = () => {
    setShowTooltip(true);
  };
  
  const handleBlur = () => {
    setShowTooltip(false);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
    <h1 className="text-3xl font-bold mb-4">Información</h1>
    <div className="mb-4">
      <IconPerfil className="w-24 h-24" />
    </div>
    <form className="bg-white shadow-md rounded-lg p-8 w-11/12 max-w-xl border border-gray-300">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            id="FirstName"
            name="first_name"
            className="mt-1 w-full rounded-md bg-gray-50 border border-gray-300 p-2 text-base text-gray-700 shadow-sm"
            defaultValue={Data.nombre}
            disabled
          />
        </div>
        <div>
          <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">Apellido</label>
          <input
            type="text"
            id="LastName"
            name="last_name"
            className="mt-1 w-full rounded-md bg-gray-50 border border-gray-300 p-2 text-base text-gray-700 shadow-sm"
            defaultValue={Data.apellido}
            disabled
          />
        </div>
        <div>
          <label htmlFor="Ubicacion" className="block text-sm font-medium text-gray-700">Ubicación</label>
          <select
            name="Ubicacion"
            id="Ubicacion"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-base text-gray-700 shadow-sm"
            defaultValue={Data.ubicacion}>
            <option value="Lima Sur">Lima Sur</option>
            <option value="Lima Norte">Lima Norte</option>
            <option value="Lima Centro">Lima Centro</option>
          </select>
        </div>
        <div>
          <label htmlFor="TipoSeguro" className="block text-sm font-medium text-gray-700">Seguro</label>
          <input
            type="text"
            id="TipoSeguro"
            name="TipoSeguro"
            className="mt-1 w-full rounded-md bg-gray-50 border border-gray-300 p-2 text-base text-gray-700 shadow-sm"
            defaultValue={Data.TipoSeguro}
            disabled
          />
        </div>
        <div className="hidden">
          <label htmlFor="Latitud" className="block text-sm font-medium text-gray-700">Latitud</label>
          <input
            type="text"
            id="Latitud"
            name="Latitud"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 shadow-sm"
            defaultValue={Data.Latitud}
          />
        </div>
        <div className="hidden">
          <label htmlFor="Longitud" className="block text-sm font-medium text-gray-700">Longitud</label>
          <input
            type="text"
            id="Longitud"
            name="Longitud"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 shadow-sm"
            defaultValue={Data.Longitud}
          />
        </div>
      </div>
      <div className="mt-6"
      data-tooltip-id="mapa">
        <label htmlFor="Mapa" className="block text-sm font-medium text-gray-700">Ubicación donde llegarán los medicamentos</label>
        <div className="mt-2 rounded-lg overflow-hidden shadow-sm h-40">
          <MapContainer
            center={{ lat: Data.Latitud, lng: Data.Longitud }}
            zoom={13}
            scrollWheelZoom={true}
            className="h-full w-full"
          >
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
          html='<div class="w-60"><h5 style="text-align: center;"><strong>Indicaciones:</strong></h5><br><h6><strong>1.</strong> Haga click y espere a que salga su ubicación actual</h6><br><h6><strong>2.</strong> Haga click en ícono de ubicación para cambiarla manualmente</h6><br><h6><strong>3.</strong> Haga click en el texto que aparece arriba del ícono para activar la función de mover</h6></div>'
          variant="warning"
          style={{
            backgroundColor: "rgb(165, 243, 252)", // Un azul claro muy suave
            color: "#333", // Texto oscuro para contrastar
            border: "1px solid #ddd", // Borde sutil
            borderRadius: "8px", // Bordes redondeados para un look moderno
            padding: "10px", // Espaciado interno
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra sutil
          }}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mt-6">
        <div>
        <label htmlFor="Password" className="block text-sm font-medium text-gray-700">Contraseña</label>
        <input
    type={showPassword ? "text" : "password"}
    id="Password"
    name="password"
    className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 shadow-sm"
    value={password}
    onChange={handlePasswordChange}
    onFocus={handleFocus}
  onBlur={handleBlur}
    required
    data-tooltip-id="passwordTip"
  />
  {showTooltip && (
  <Tooltip
    id="passwordTip"
    effect="solid"
    place="right"
    className="custom-tooltip z-50"
    closeEvents={{ click: true }}
    isOpen={showTooltip}
    html='<div class="w-60"><h5 style="text-align: center;"><strong>Indicaciones</strong><h5><br><ul><li><strong>1.</strong> Al menos 12 caracteres de longitud </li><li><strong>2.</strong> Mínimo una letra en Mayúscula</li><li><strong>3.</strong> Mínimo un Número </li><li><strong>4.</strong> Mínimo un carácter especial (@_%$&/!?) </li></ul></div>'
    variant="warning"
    style={{
      backgroundColor: "rgb(165, 243, 252)",
      color: "#333",
      border: "1px solid #ddd",
      borderRadius: "8px",
      padding: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)"
    }}
  />
)}
  <button type="button" onClick={toggleShowPassword} className="text-sm font-medium text-celeste">
  {showPassword ? 'Ocultar' : 'Mostrar'}
</button> 
  <div className="h-2 w-full bg-gray-200 rounded mt-2 overflow-hidden">
  <div
      className={`h-full ${passwordStrength === 'muy fuerte' ? 'bg-green-500' :
        passwordStrength === 'fuerte' ? 'bg-orange-500' :
        passwordStrength === 'medio' ? 'bg-yellow-500' : 'bg-red-500'}`}
style={{ width: `${(passwordStrength === 'muy fuerte' ? 100 :
                passwordStrength === 'fuerte' ? 75 :
                passwordStrength === 'medio' ? 50 : 25)}%` }}
    ></div>
    {showTooltip && (
                  <Tooltip
                  id="passwordTip"
                  effect="solid"
                  place="right"
                  className="custom-tooltip z-50"
                  closeEvents={{ click: true }}
                  isOpen={showTooltip}
                  html='<div class="w-60"><h5 style="text-align: center;"><strong>Indicaciones</strong><h5><br><ul><li><strong>1.</strong> Al menos 12 caracteres de longitud </li><li><strong>2.</strong> Mínimo una letra en Mayúscula</li><li><strong>3.</strong> Mínimo un Número </li><li><strong>4.</strong> Mínimo un carácter especial (@_%$&/!?) </li></ul></div>'
                  variant="warning"
                  style={{
                    backgroundColor: "rgb(165, 243, 252)", // Un azul claro muy suave
                    color: "#333", // Texto oscuro para contrastar
                    border: "1px solid #ddd", // Borde sutil
                    borderRadius: "8px", // Bordes redondeados para un look moderno
                    padding: "10px", // Espaciado interno
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Sombra sutil
                  }}
                />
                )}
    </div>
        </div>
        <div>
          <label htmlFor="Phone" className="block text-sm font-medium text-gray-700">Teléfono</label>
          <input
            type="text"
            id="Phone"
            className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm text-gray-700 shadow-sm"
            value={Telefono}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (
                soloNumerosRegex.test(inputValue) &&
                inputValue.length <= 9
              ) {
                setTelefono(inputValue);
              }
            }}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-center">
        <input
          className="inline-block w-full sm:w-auto shrink-0 rounded-md border border-transparent bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 cursor-pointer"
          type="submit"
          value="Actualizar"
          onClick={handleRegistration}
        />
      </div>
    </form>
    <ToastContainer
      position="top-center"
      autoClose={5000} // El mensaje se cierra automáticamente después de 5 segundos
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  </div>
  );
};
export default InfoPerfil;

InfoPerfil.propTypes = {
  Data: PropTypes.object.isRequired,
};
