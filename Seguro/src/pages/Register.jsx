import React, { useState } from "react";

 function Register() {
  const [inputVisible, setInputVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [dniValue, setDniValue] = useState('');

  const toggleInputVisibility = () => {
    setInputVisible(!inputVisible);
    setButtonVisible(!buttonVisible);
  };

  const handleVerification = () => {
    if (dniValue.length !== 8) {
      alert('Digite su DNI Porfavor.');
      return;
    }
    setInputVisible(true);
    setButtonVisible(false);
  };

  const handleDniChange = (e) => {
    const value = e.target.value;
    const truncatedValue = value.slice(0, 8); // Limitar a 8 dígitos
    if (/^\d*$/.test(truncatedValue)) { // Verificar si el valor truncado contiene solo dígitos
      setDniValue(truncatedValue);
    }
  };

  const handleRegistration = () => {
    alert('¡Bienvenido! Estás Asegurado.');
  };

  return (
    
    <div className="max-w-md mx-auto mt-36 p-4 bg-gray-100 rounded-lg border border-amber-600 flex flex-col items-center">
    <h1 className="text-2xl font-bold mb-4">Regístrate</h1>
    <label htmlFor="dni" className="block mb-2">Ingrese tu DNI</label>
    <input required
      type="text"
      id="dni"
      value={dniValue}
      onChange={handleDniChange}
      className="w-full p-2 mb-4 rounded border border-gray-300"
    />
    {buttonVisible && (
      <button onClick={handleVerification} className="bg-amber-600 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded mb-4">Verificar</button>
    )}

    <div className={`input-container ${inputVisible ? "block" : "hidden"}`}>
      <input type="text" placeholder="Nombre" className="w-full p-2 mb-4 rounded border border-gray-300" />
      <input type="text" placeholder="Apellido" className="w-full p-2 mb-4 rounded border border-gray-300" />
      <input type="text" placeholder="Dirección" className="w-full p-2 mb-4 rounded border border-gray-300" />
      <input type="password" placeholder="Contraseña" className="w-full p-2 mb-4 rounded border border-gray-300" />
      <div className="authButtons basis-1/4 border-4 flex flex-col items-center justify-center">
        <button onClick={handleRegistration} className="bg-amber-600 hover:bg-amber-400 text-white font-bold py-2 px-4 rounded content-center">Registrar</button>
      </div>
    </div>
  </div>
  );
}
export default Register;