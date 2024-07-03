import jsPDF from "jspdf";

const Guia = (pedido, conductor) => {
  const doc = new jsPDF();

  const icono = "/icono.png";
  // Encabezado
  doc.addImage(icono, "png", 15, 12, 25, 25);
  doc.rect(100, 8, 96, 35);
  doc.setFontSize(15);
  doc.text("Guía de remisión remitente electrónica", 148, 28, {
    align: "center",
  });
  doc.setFontSize(10);
  //ANCHO//ALTURA
  doc.text("RUC: 20606568128", 135, 15);
  doc.text("T001-00000501", 135, 39);

  // Información del remitente
  doc.setFontSize(8);
  doc.text("HEALTH EXPRESS", 16, 42);
  //linea izquierda,arriba,linea derecha, linea abajo
  doc.rect(16, 45, 180, 40);
  // Información del destinatario
  doc.text("Destinatario", 20, 50);
  doc.text(": " + pedido.nombre_asegurado, 60, 50);
  doc.text("DNI", 20, 55);
  doc.text(": " + pedido.dni, 60, 55);
  doc.text("Dirección de Partida", 20, 60);
  doc.text(": Ctra. Panamericana S km 16, Villa EL Salvador 15842", 60, 60);
  doc.text("Dirección de Llegada", 20, 65);
  doc.text(": " + pedido.direccion, 60, 65);
  doc.text("Motivo de Traslado", 20, 70);
  doc.text(": Otros", 60, 70);
  doc.text("Modalidad de Transporte", 20, 75);
  doc.text(": Transporte privado", 60, 75);
  doc.text("Observacion", 20, 80);
  doc.text(": Ninguna", 60, 80);
  doc.text("Fecha de Emisión", 150, 70);
  doc.text(": " + pedido.fecha, 175, 70);
  doc.text("Fecha de Traslado", 150, 75);
  doc.text(": " + pedido.fecha, 175, 75);

  doc.rect(16, 87, 180, 15);
  // Datos del transportista
  doc.text("Datos del Conductor:", 20, 92);
  doc.text(
    "Apellido/Nombre: " + conductor.apellido + " " + conductor.nombre,
    20,
    97
  );
  doc.text("DNI: " + conductor.dni, 100, 97);
  doc.text("Licencia: " + conductor.licencia, 150, 97);

  doc.rect(16, 103, 180, 15);
  // Datos del vehículo
  doc.text("Datos del Vehículo:", 20, 108);
  doc.text("Número de Placa: " + conductor.placa, 20, 113);

  // Tabla de productos
  doc.setFontSize(10);
  doc.text("N°", 17, 125);
  doc.text("Código Producto", 24, 125);
  doc.text("Cant.", 56, 125);
  doc.text("Descripción", 70, 125);

  // Líneas de la tabla
  const startY = 125;

  // doc.setLineWidth(0.5);
  doc.line(16, 120, 196, 120); // línea superior
  doc.line(16, 130, 196, 130); // línea inferior de encabezados
  doc.line(16, 120, 16, startY + pedido.length * 10 + 5); // línea izquierda
  doc.line(22, 120, 22, startY + pedido.length * 10 + 5); // línea entre N° y Código
  doc.line(54, 120, 54, startY + pedido.length * 10 + 5); // línea entre Código y Cantidad
  doc.line(67, 120, 67, startY + pedido.length * 10 + 5); // línea entre Cantidad y DESCRIPCION
  doc.line(196, 120, 196, startY + pedido.length * 10 + 5); // línea derecha
  doc.line(
    16,
    startY + pedido.length * 10 + 5,
    196,
    startY + pedido.length * 10 + 5
  ); // línea inferior de la tabla

  let yPosition = startY + 10;
  pedido.forEach((item, index) => {
    doc.text(String(index + 1), 17, yPosition);
    doc.text("P00" + item.codigo, 24, yPosition);
    doc.text(String(item.cantidad), 56, yPosition);
    doc.text(item.nombre, 70, yPosition);
    yPosition += 10;
  });

  // Pie de página
  doc.setFontSize(8);
  doc.text(
    "Representación impresa sin valor tributario de la Guía de remisión remitente electrónica,",
    20,
    yPosition + 10
  );
  doc.text(
    "Autorizado mediante Resolución de Intendencia N°:",
    20,
    yPosition + 25
  );

  return doc;
};

export default Guia;
