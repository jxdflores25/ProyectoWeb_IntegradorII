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
  var FechaAsignacion = "";

  if (mes + 1 < 10) {
    Mes = "0" + (mes + 1);
  } else {
    Mes = mes + 1;
  }

  if (hora < 12) {
    if (dia < 10) {
      Dia = "0" + dia;
    } else {
      Dia = dia;
    }
    Corte = "Envios en La tarde";
    horainicio = "00:00";
    horafin = "11:59";
    FechaAsignacion = año + "-" + Mes + "-" + Dia;
  } else {
    if (dia + 1 < 10) {
      Dia = "0" + (dia + 1);
    } else {
      Dia = dia + 1;
    }
    Corte = "Envios al dia siguiente";
    horainicio = "12:00";
    horafin = "23:59";
    FechaAsignacion = año + "-" + Mes + "-" + Dia;
  }

  var Day = "";

  if (dia < 10) {
    Day = "0" + dia;
  } else {
    Day = dia;
  }

  const fechaHoy = Day + "/" + Mes + "/" + año;
  const fechaConsulta = año + "-" + Mes + "-" + Day;
  const corte = Corte;

  return {
    fechaHoy: fechaHoy,
    fechaConsulta: fechaConsulta,
    fechaAsignacion: FechaAsignacion,
    horaInicio: horainicio,
    horaFin: horafin,
    corte: corte,
  };
}
