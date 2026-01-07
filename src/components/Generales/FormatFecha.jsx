// utils/formatFecha.js
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import localizedFormat from "dayjs/plugin/localizedFormat"
import "dayjs/locale/es"

dayjs.extend(utc)
dayjs.extend(localizedFormat)
dayjs.locale("es")

export const formatFecha = (fecha) => {
    if (!fecha) return "No disponible"
    return dayjs.utc(fecha).local().format("LL")
}
