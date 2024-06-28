import React, { useState, useEffect } from 'react';
import PropTypes from "prop-types";
import IconPerfil from "../../assets/Icons/IconPerfil";
import { PutConductor } from "../../API/API_Seguro";
import 'leaflet/dist/leaflet.css';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';
import { ToastContainer, Slide, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const InfoPerfil = ({ Data }) => {
  const [password, setPassword] = useState(Data.contraseña || '');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    const strength = evaluatePasswordStrength(password);
    setPasswordStrength(strength);
  }, [password]);
  const toggleShowPassword = (event) => {
    event.preventDefault();  // Previene el comportamiento predeterminado del botón
    setShowPassword(!showPassword);
  };
  const handlePasswordChange = (event) => {
    const newPassword = event.target.value.replace(/\s/g, ''); // Elimina espacios
    setPassword(newPassword);
  };
  const evaluatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 12) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@_%$&/!?]/.test(password)) strength++;
  
    console.log("Strength count:", strength); // Para debuguear
  
    switch (strength) {
      case 1:
        return 'débil';
      case 2:
        return 'medio';
      case 3:
        return 'fuerte';
      case 4:
        return 'muy fuerte';
      default:
        return 'muy débil';
    }
  };
  const handleRegistration = async (event) => {
  event.preventDefault();

  // Primero, asegúrate de que la contraseña es 'muy fuerte'.
  console.log("Password Strength:", passwordStrength); // Para verificar la fortaleza en la consola
  if (passwordStrength !== 'muy fuerte') {
    toast.error('La contraseña debe ser muy fuerte para proceder con la actualización.');
    return;
  }

  try {
    // Llamada a la API para actualizar los datos.
    const result = await PutConductor(Data.dni, {...Data, contraseña: password});
console.log("Resultado completo de PutConductor:", result);

if (result && result.success) {
    toast.success('Contraseña actualizada con éxito.');
} else {
  toast.success('Se ah actualizado el Conductor');
}
} catch (error) {
  toast.success('Se ah actualizado el Conductor');}
};    function getColorForStrength(strength) {
      switch (strength) {
        case 'muy fuerte':
          return 'green';
        case 'fuerte':
          return 'orange';
        case 'medio':
          return 'yellow';
        case 'débil':
          return 'red';
        default:
          return 'gray';
      }
    }

  return (
    <div className="flex-row p-4 h-full">
      <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
  {/* Contenedor para el contenido principal */}
  <h1 className="text-center text-2xl font-bold">Información</h1>
  <div className="flex items-center justify-center">
    <IconPerfil />
  </div>
  <div>
    <form className="mt-8 max-w-md mx-auto">
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
            className="mt-1 w-full bg-slate-300 rounded-md border border-celeste text-base text-gray-700 shadow-sm p-2"
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
            className="mt-1 w-full rounded-md bg-slate-300 border border-celeste text-base text-gray-700 shadow-sm p-2"
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
            className="mt-1 w-full rounded-md border border-celeste text-base text-gray-700 shadow-sm p-2"
            defaultValue={Data.direccion}>
            <option value="LimaSur">Lima Sur</option>
            <option value="LimaNorte">Lima Norte</option>
            <option value="LimaCentro">Lima Centro</option>
          </select>
        </div>
        <div className="col-span-6 sm:col-span-3">
          <label
            htmlFor="Password"
            className="block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type={showPassword ? 'text' : 'password'}
            id="Password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
          onFocus={() => setShowTooltip(true)}
          onBlur={() => setShowTooltip(false)}
            defaultValue={Data.contraseña}
            className="mt-1 w-full rounded-md border border-celeste text-base text-gray-700 shadow-sm p-2"
            required
             data-tooltip-id="passwordTip"
          />
         <button onClick={toggleShowPassword} type="button">  {/* Asegúrate de incluir type="button" */}
  {showPassword ? 'Ocultar' : 'Mostrar'}
</button>

<div className="mt-2 w-full bg-gray-300 h-2 rounded">
<div
      className={`h-full ${passwordStrength === 'muy fuerte' ? 'bg-green-500' :
        passwordStrength === 'fuerte' ? 'bg-orange-500' :
        passwordStrength === 'medio' ? 'bg-yellow-500' : 'bg-red-500'}`}
style={{ width: `${(passwordStrength === 'muy fuerte' ? 100 :
                passwordStrength === 'fuerte' ? 75 :
                passwordStrength === 'medio' ? 50 : 25)}%` }}
    ></div>
  </div>
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
        </div>

        <div className="col-span-6 flex justify-center">
          <input
            className="inline-block w-full sm:w-auto shrink-0 rounded-md border border-celeste bg-celeste px-12 py-3 text-sm font-medium text-white transition hover:bg-gradient-to-r hover:from-verde hover:to-celeste focus:ring focus:outline-none focus:border-celeste text-center"
            style={{ cursor: "pointer" }}
            type="submit"
            value="Actualizar"
            onClick={handleRegistration}
          />
        </div>
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
</div>
  );
};
export default InfoPerfil;

InfoPerfil.propTypes = {
  Data: PropTypes.object.isRequired,
};
