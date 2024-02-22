import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { obtenerVentas, actualizaVenta } from "../../../api/ventas";
import queryString from "query-string";

// Realiza la modificación de saldos al realizar un movimiento
export function LogVentaActualizacion(id, ticket, tipoPago, efectivo, iva, subtotal, navigate) {
    console.log(navigate)
    try {
        obtenerVentas(id).then(response => {
            const { data } = response;

            const dataTemp = {

                tipoPago: tipoPago,
                efectivo: efectivo,
                cambio: tipoPago == "Efectivo" && iva == "si" ? (parseFloat(efectivo) - (subtotal + subtotal * parseFloat("0.16"))).toFixed(2) : (efectivo - subtotal).toFixed(2),
                total: tipoPago == "Efectivo" && iva == "si" ? subtotal + subtotal * parseFloat("0.16") : tipoPago == "Tarjeta" && iva == "si" ? subtotal + subtotal * parseFloat("0.16") + subtotal * parseFloat("0.03") : tipoPago == "Tarjeta" && iva == "no" ? subtotal + subtotal * parseFloat("0.03") : tipoPago == "Transferencia" && iva == "si" ? subtotal + subtotal * parseFloat("0.16") : subtotal,
                pagado: "true",
                iva: iva == "si" ? subtotal + subtotal * parseFloat("0.16") : "0",
                comision: tipoPago == "Tarjeta"? subtotal + subtotal * parseFloat("0.03") : "0"
            }
            // Inicia actualización de saldos de los socios
            actualizaVenta(id, dataTemp).then(response => {
                const { data } = response;
                navigate({
                    search: queryString.stringify(""),
                });
                LogsInformativos("Se actualizo la venta " + ticket, dataTemp);
                // console.log("Actualización de saldo personal")
            }).catch(e => {
                console.log(e)
            })
            // Termina actualización de saldos de los socios
        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        console.log(e)
    }
}