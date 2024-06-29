import React from 'react';
import jsPDF from 'jspdf';

export default function Prueba() {
  const boleta = () => {
    const doc = new jsPDF();

    // Encabezado
    doc.rect(134, 9, 60, 35);
    doc.setFontSize(15);
    doc.text("BOLETA DE VENTA", 165, 25, { align: 'center' });
    doc.text("ELECTRONICA", 165, 30, { align: 'center' });
    doc.setFontSize(10);
    //ANCHO//ALTURA14828
    doc.text("RUC: 20606568128", 148, 15);
    doc.text("T001-00000501", 152, 39);

    // Información del negocio
    doc.rect(15, 7, 180, 40);
    doc.setFontSize(10);
    doc.text("HEALTH EXPRESS", 20, 25);
    doc.text("Ctra. Panamericana S km 16, Villa EL Salvador 15842", 20, 30);
    doc.text("LIMA - LIMA - PERU", 20, 35);
    doc.text("RUC: 20606568128", 20, 40);

    // Información del cliente
    //izq,arr,dere,aba
    doc.rect(15, 48, 180, 25);
    doc.text("Señor(es): Fatima Llauca", 20, 53);
    doc.text("Ctra. Panamericana S km 16, Villa EL Salvador 15842", 20, 58);
    doc.text("Fecha de Emisión: 24/06/2024", 20, 63);
    doc.text("Tipo de Moneda: SOLES", 20, 68);

    // Productos
    let items = [
      { quantity: "4.00", unit: "Unidad", description: "Aspirinas", unitPrice: "0.50", total: "2.00" },
      { quantity: "1.00", unit: "Unidad", description: "Paracetamol", unitPrice: "1.00", total: "1.00" },
      { quantity: "1.00", unit: "Unidad", description: "Cetirizina", unitPrice: "0.50", total: "0.50" },
      { quantity: "4.00", unit: "Unidad", description: "Aspirina", unitPrice: "1.00", total: "4.00" },
      { quantity: "1.00", unit: "Unidad", description: "Panadol", unitPrice: "2.00", total: "2.00" },
      { quantity: "1.00", unit: "Unidad", description: "prueba", unitPrice: "2.00", total: "2.00" },
    ];

    items.push({ quantity: "4.00", unit: "Unidad", description: "Metromitrosol", unitPrice: "0.50", total: "2.00" })

    // Líneas de la tabla
    const startY = 80;
    const endY = startY + items.length * 10 + 5;

    doc.setFontSize(10);
    doc.text("Cantidad", 18, startY);
    doc.text("Unidad", 38, startY);
    doc.text("Descripción", 60, startY);
    doc.text("Valor Unitario", 138, startY);
    doc.text("Importe", 190, startY, { align: 'right' });

    doc.setLineWidth(0.5);
    doc.line(15, startY - 5, 195, startY - 5); // línea superior
    doc.line(15, startY + 5, 195, startY + 5); // línea inferior de encabezados
    doc.line(15, startY - 5, 15, endY); // línea izquierda
    doc.line(35, startY - 5, 35, endY); // línea entre Cantidad y Unidad
    doc.line(55, startY - 5, 55, endY); // línea entre Unidad y Descripción
    doc.line(135, startY - 5, 135, endY); // línea entre Descripción y Valor Unitario
    doc.line(170, startY - 5, 170, endY); // línea entre Valor Unitario y Importe
    doc.line(195, startY - 5, 195, endY); // línea derecha
    doc.line(15, endY, 195, endY); // línea inferior de la tabla

    let yPosition = startY + 10;
    items.forEach(item => {
      doc.text(item.quantity, 20, yPosition);
      doc.text(item.unit, 38, yPosition);
      doc.text(item.description, 60, yPosition);
      doc.text(item.unitPrice, 138, yPosition);
      doc.text(item.total, 180, yPosition, { align: 'right' });
      yPosition += 10;
    });

    // Cuadro de detalles de la compra
    doc.rect(15, startY - 5, 180, endY - (startY - 5));

    // Totales
    yPosition += 10;
    doc.setFontSize(12);
    doc.text("Op. Gravada:", 140, yPosition);
    doc.text("S/ 9.50", 190, yPosition, { align: 'right' });

    yPosition += 5;
    doc.text("IGV (18%):", 140, yPosition);
    doc.text("S/ 0.00", 190, yPosition, { align: 'right' });

    yPosition += 5;
    doc.text("Importe Total:", 140, yPosition);
    doc.text("S/ 9.50", 190, yPosition, { align: 'right' });

    // Cuadro de total
    doc.rect(135, yPosition - 15, 60, 20);

    // Pie de página
    doc.setFontSize(8);
    doc.text("Esta es una representación impresa de la Boleta de Venta Electrónica, generada en el Sistema de la SUNAT.", 20, yPosition + 20);
    doc.text("El Emisor Electrónico puede verificarla utilizando su clave SOL, el Adquirente o Usuario puede consultar su validez", 20, yPosition + 25);
    doc.text("en SUNAT Virtual: www.sunat.gob.pe, en Opciones sin Clave SOL / Consulta de Validez del CPE.", 20, yPosition + 30);



    // Guardar el PDF
    doc.save("Boleta.pdf");
  };

  return (
    <div>
      <button onClick={boleta}>Descargar PDF</button>
    </div>
  );
}
