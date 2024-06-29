import jsPDF from "jspdf";

const factura = () => {
  const factura = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("FACTURA ELECTRONICA", 105, 20, { align: "center" });

    // Información del negocio
    doc.setFontSize(10);
    doc.text("HEALTH EXPRESS", 20, 35);
    doc.text("Ctra. Panamericana S km 16, Villa EL Salvador 15842", 20, 40);
    doc.text("MIRAFLORES - LIMA - LIMA", 20, 45);
    doc.text("RUC: 10572846985", 20, 50);
    doc.text("E001-000000002", 150, 35);
    // Cuadro de información del cliente
    doc.rect(15, 30, 180, 25);

    // Información del cliente y otros datos
    doc.setFontSize(10);
    doc.text("Fecha de Emisión     : 25/06/2024", 20, 60);
    doc.text("Señor(es)                  : Fatima Llauca", 20, 65);
    doc.text("RUC                          :14572846985", 20, 70);
    doc.text(
      "Dirección del Cliente : Ctra. Panamericana S km 16, Villa EL Salvador 15842",
      20,
      75
    );
    doc.text("Tipo de Moneda        : Soles", 20, 80);
    doc.text("Observación              :", 20, 85);
    doc.text("Forma de pago: Contado", 150, 60);

    // Cuadro de información del cliente
    doc.rect(15, 55, 180, 35);

    // Tabla de productos
    doc.setFontSize(10);
    doc.text("Cantidad", 16, 100);
    doc.text("Unidad Medida", 38, 100);
    doc.text("Código", 70, 100);
    doc.text("Descripción", 90, 100);
    doc.text("Valor Unitario", 150, 100);
    doc.text("Importe", 190, 100, { align: "right" });

    // Líneas de la tabla
    const startY = 100;
    const items = [
      {
        quantity: "1.00",
        unit: "UNIDAD",
        code: "01",
        description: "Producto A",
        unitPrice: "40.00",
        total: "40.00",
      },
      {
        quantity: "1.00",
        unit: "UNIDAD",
        code: "02",
        description: "Producto B",
        unitPrice: "40.00",
        total: "40.00",
      },
      {
        quantity: "1.00",
        unit: "UNIDAD",
        code: "03",
        description: "Producto C",
        unitPrice: "40.00",
        total: "40.00",
      },
    ];

    doc.setLineWidth(0.5);
    doc.line(15, 95, 195, 95); // línea superior
    doc.line(15, 105, 195, 105); // línea inferior de encabezados
    doc.line(15, 95, 15, startY + items.length * 10 + 5); // línea izquierda
    doc.line(35, 95, 35, startY + items.length * 10 + 5); // línea entre Cantidad y Unidad
    doc.line(65, 95, 65, startY + items.length * 10 + 5); // línea entre Unidad y Código
    doc.line(85, 95, 85, startY + items.length * 10 + 5); // línea entre Código y Descripción
    doc.line(145, 95, 145, startY + items.length * 10 + 5); // línea entre Descripción y Valor Unitario
    doc.line(175, 95, 175, startY + items.length * 10 + 5); // línea entre Valor Unitario e Importe
    doc.line(195, 95, 195, startY + items.length * 10 + 5); // línea derecha
    doc.line(
      15,
      startY + items.length * 10 + 5,
      195,
      startY + items.length * 10 + 5
    ); // línea inferior de la tabla

    let yPosition = startY + 10;
    items.forEach((item) => {
      doc.text(item.quantity, 20, yPosition);
      doc.text(item.unit, 40, yPosition);
      doc.text(item.code, 70, yPosition);
      doc.text(item.description, 90, yPosition);
      doc.text(item.unitPrice, 150, yPosition);
      doc.text(item.total, 187, yPosition, { align: "right" });
      yPosition += 10;
    });

    // Cuadro de detalles de la compra
    //doc.rect(15, 95, 180, yPosition - 95);

    // Totales
    yPosition += 10;
    doc.setFontSize(10);
    doc.text("Sub Total Ventas :", 140, yPosition);
    doc.text("S/ 80.00", 190, yPosition, { align: "right" });

    yPosition += 5;
    doc.text("Anticipos :", 140, yPosition);
    doc.text("S/ 0.00", 190, yPosition, { align: "right" });

    yPosition += 5;
    doc.text("Descuentos :", 140, yPosition);
    doc.text("S/ 0.00", 190, yPosition, { align: "right" });

    yPosition += 5;
    doc.text("Valor Venta :", 140, yPosition);
    doc.text("S/ 40.00", 190, yPosition, { align: "right" });

    yPosition += 5;
    doc.text("ISC :", 140, yPosition);
    doc.text("S/ 0.00", 190, yPosition, { align: "right" });

    yPosition += 5;
    doc.text("IGV :", 140, yPosition);
    doc.text("S/ 0.00", 190, yPosition, { align: "right" });

    yPosition += 5;
    doc.text("Otros Cargos :", 140, yPosition);
    doc.text("S/ 0.00", 190, yPosition, { align: "right" });

    yPosition += 5;
    doc.text("Otros Tributos :", 140, yPosition);
    doc.text("S/ 0.00", 190, yPosition, { align: "right" });

    yPosition += 5;
    doc.text("Monto de redondeo :", 140, yPosition);
    doc.text("S/ 0.00", 190, yPosition, { align: "right" });

    yPosition += 5;
    doc.text("Importe Total :", 140, yPosition);
    doc.text("S/ 80.00", 190, yPosition, { align: "right" });

    // Cuadro de total
    doc.rect(135, yPosition - 50, 60, 55);

    // Pie de página
    doc.setFontSize(8);
    doc.text(
      "Esta es una representación impresa de la factura electrónica, generada en el Sistema de SUNAT.",
      20,
      yPosition + 20
    );
    doc.text(
      "El Emisor Electrónico puede verificarla utilizando su clave SOL.",
      20,
      yPosition + 25
    );

    // Guardar el PDF
    doc.save("Factura.pdf");
  };

  return (
    <div>
      <button onClick={factura}>Descargar PDF</button>
    </div>
  );
};

export default factura;
