import { useState } from "react";
import {
  GetAdministrador,
  GetAsegurado,
  GetConductor,
} from "../API/API_Seguro";

export default function Login() {
  const [dni, setDni] = useState("");

  const Login = async () => {
    let res = await GetAsegurado(dni);
    if (res === null) {
      res = await GetConductor(dni);
      if (res === null) {
        res = await GetAdministrador(dni);
        if (res === null) {
          alert("Usuario no encontrado");
        }
      }
    }

    if (res !== null) {
      const contra = document.getElementById("password").value;
      if (res.data.contraseña === contra) {
        alert("ingreso correctamente");
      } else {
        alert("Contraseña incorrecta");
      }
    }
  };

  const handleDniChange = (e) => {
    const inputValue = e.target.value;

    // Si el valor ingresado coincide con la expresión regular, actualiza el estado
    if (/^[0-9]{0,8}$/.test(inputValue)) {
      setDni(inputValue);
    }
  };

  return (
    <div className="flex w full h-screen bg-white px-10 py-20 rounded-3xl border-2 border-gray-200">
      <div className="w-full flex items-center justify-center lg:w-1/2">
        <div className="mt-8">
          <h1 className="text-5xl font-semibold">MediSalud</h1>
          <p className="font-medium text-lg tex-gray-500 mt-4">
            {" "}
            Por favor Ingrese sus Datos{" "}
          </p>
          <div className="mt-8">
            <div>
              <label className="text-lg font-medium">DNI</label>
              <input
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Introduce tu DNI"
                type="text"
                pattern="[0-9]{0,8}"
                value={dni}
                onChange={handleDniChange}
              />
            </div>
            <div>
              <label className="text-lg font-medium">Password</label>
              <input
                id="password"
                className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent"
                placeholder="Introduce tu Contraseña"
                type="password"
              />
            </div>
            <div className="mt-8 flex flex-col gap-y-4">
              <button
                className=" active:scale-[.98] active:duration-75 hover:scale-[1.01] ease-out transition-all py-3 rounded-xl bg-orange-500 text-white text-lg fond bold"
                onClick={Login}>
                Ingresar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="hidden relative lg:flex h-full w-1/2 items-center justify-center bg-gray-200">
        <div className="w-60 h-60 bg-gradient-to-tr bg-orange-500 to-pink-500 rounded-full animate-bounce" />
        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg" />
      </div>
    </div>
  );
}
