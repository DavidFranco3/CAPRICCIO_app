import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

function obtenerFechaHoraMexico() {
  return dayjs().tz("America/Mexico_City").format("YYYY-MM-DD HH:mm:ss");
}

export default obtenerFechaHoraMexico;
