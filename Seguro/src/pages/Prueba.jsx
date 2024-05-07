import { GetKardex } from "../API/API_Seguro";

export default function Prueba() {
  const pruebaAPI = async () => {
    console.log("hola");
    const res = await GetKardex("9");
    console.log(res.data);
  };

  return (
    <div>
      Pruebas
      <div>
        <button onClick={pruebaAPI}>Llamar</button>
      </div>
    </div>
  );
}
