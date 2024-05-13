import { useState } from "react";
import {
  GetAdministrador,
  GetAsegurado,
  GetConductor,
} from "../API/API_Seguro";
import { ToastContainer, Slide, toast } from "react-toastify";

export default function Login() {
  const [dni, setDni] = useState("");

  if (localStorage.getItem("registrado")) {
    toast.success("Se registro correctamente");
    localStorage.removeItem("registrado");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    let res = await GetAsegurado(dni);
    let tipo = "Asegurado";
    if (res === null) {
      res = await GetConductor(dni);
      tipo = "Conductor";
      if (res === null) {
        res = await GetAdministrador(dni);
        tipo = "Administrador";
        if (res === null) {
          toast.error("Usuario no encontrado");
          tipo = "";
        }
      }
    }

    if (res !== null) {
      const contra = document.getElementById("password").value;
      if (res.data.contraseña === contra) {
        localStorage.setItem("usuario", res.data.dni);
        localStorage.setItem("tipo", tipo);
        localStorage.setItem("PedidoAyer", "true");
        console.log(tipo);
        switch (tipo) {
          case "Asegurado":
            window.location.href = "/Asegurado";
            break;

          case "Conductor":
            window.location.href = "/Repartidor";
            break;

          case "Administrador":
            window.location.href = "/Administrador";
            break;

          default:
            break;
        }
      } else {
        toast.error("Contraseña incorrecta");
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
          <h1 className="text-5xl font-semibold text-center text-celeste">
            Health <span className="text-verde">Express</span>{" "}
          </h1>
          <p className="font-medium text-lg tex-gray-500 mt-4 text-center">
            {" "}
            Por favor Ingrese sus Datos{" "}
          </p>
          <div className="mt-8">
            <form onSubmit={handleSubmit}>
              <div>
                <label className="text-lg font-medium">DNI</label>
                <input
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent focus:outline-none focus:border-celeste"
                  placeholder="Introduce tu DNI"
                  type="text"
                  pattern="[0-9]{0,8}"
                  value={dni}
                  required
                  onChange={handleDniChange}
                />
              </div>
              <div>
                <label className="text-lg font-medium">Password</label>
                <input
                  id="password"
                  className="w-full border-2 border-gray-100 rounded-xl p-4 mt-1 bg-transparent focus:outline-none focus:border-celeste"
                  placeholder="Introduce tu Contraseña"
                  type="password"
                  required
                />
              </div>
              <div className="mt-8 flex flex-col gap-y-4">
                <input
                  type="submit"
                  value="Ingresar"
                  className=" active:scale-[110] active:duration-75  ease-out  py-3 rounded-xl  bg-gradient-to-r from-celeste to-verde text-white text-lg fond bold transition-transform transform hover:scale-110 "
                />
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="hidden relative lg:flex h-full w-1/2 items-center justify-center bg-gray-200">
        <div className="w-60 h-60 bg-gradient-to-tr bg-verde to-celeste rounded-full animate-bounce" />
        <div className="w-full h-1/2 absolute bottom-0 bg-white/10 backdrop-blur-lg" />
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
