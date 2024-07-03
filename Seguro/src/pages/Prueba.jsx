import CrearGuia from "../constants/CrearGuia.jsx";

export default function Prueba() {
  const handleSubmit = async (e) => {
    e.preventDefault();
    const guia = await CrearGuia("30", "52032658", "86");
    const url = window.URL.createObjectURL(new Blob([guia]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "GuiaRemision.pdf");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}
