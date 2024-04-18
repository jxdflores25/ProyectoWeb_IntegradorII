import { useState } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { GetAsegurado, PutAsegurado } from "../API/API_Seguro";

function Register() {
  const [inputVisible, setInputVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(true);
  const [dniValue, setDniValue] = useState("");

  const [data, setData] = useState([]);

  const handleVerification = async () => {
    if (dniValue.length !== 8) {
      toast.warning("Digite un DNI Valido");
      return;
    } else {
      const res = await GetAsegurado(dniValue);
      if (res !== null) {
        MostrarDatos(res.data);
        setInputVisible(true);
        setButtonVisible(false);
        setData(res.data);
      } else {
        toast.error("Usted no tiene Seguro");
      }
    }
  };

  const MostrarDatos = (data) => {
    document.getElementById("Nombre").value = data.nombre;
    document.getElementById("Apellido").value = data.apellido;
    document.getElementById("Direccion").value = data.direccion;
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
      return data;
    }
  };

  return (
    <div className="max-w-md mx-auto mt-36 p-4 bg-gray-100 rounded-lg border border-amber-600 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Regístrate</h1>
      <label htmlFor="dni" className="block mb-2">
        Ingrese tu DNI
      </label>
      <input
        required
        type="text"
        id="dni"
        value={dniValue}
        onChange={handleDniChange}
        className="w-full p-2 mb-4 rounded border border-gray-300"
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
          placeholder="Dirección"
          id="Direccion"
          className="w-full p-2 mb-4 rounded border border-gray-300"
        />
        <input
          type="password"
          placeholder="Contraseña"
          id="Contraseña"
          className="w-full p-2 mb-4 rounded border border-gray-300"
        />
        <div className="authButtons basis-1/4 border-4 flex flex-col items-center justify-center">
          <button
            onClick={handleRegistration}
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
