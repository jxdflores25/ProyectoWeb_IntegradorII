export default function Fecha() {
  const date = new Date();
  const [dia, mes, año, hora] = [
    date.getDate(),
    date.getMonth(),
    date.getFullYear(),
    date.getHours(),
    date.getMinutes(),
  ];

  var Dia = "";
  var Mes = "";
  var Corte = "";
  var horainicio = "";
  var horafin = "";

  if (dia < 10) {
    Dia = "0" + dia;
  } else {
    Dia = dia;
  }

  if (mes + 1 < 10) {
    Mes = "0" + (mes + 1);
  } else {
    Mes = mes + 1;
  }

  if (hora < 12) {
    Corte = "Envios en La tarde";
    horainicio = "00:00";
    horafin = "11:59";
  } else {
    Corte = "Envios al dia siguiente";
    horainicio = "12:00";
    horafin = "20:00";
  }

  const fecha = año + "-" + Mes + "-" + Dia;

  const corte = Corte;

  return {
    fecha: fecha,
    horaInicio: horainicio,
    horaFin: horafin,
    corte: corte,
  };
}
