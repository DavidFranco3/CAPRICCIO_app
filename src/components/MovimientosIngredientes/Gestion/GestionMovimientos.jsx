import {
    listarMovimientosIngredientes,
    obtenerIngredientes, registraMovimientosIngrediente
} from "../../../api/ingredientes";
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import {toast} from "react-toastify";

// Para definir el registro de la información inicial de la planeación -- Metodo desarrollado para funcionalidad interno en registro de ventas
export function LogRegistroSalida(id, cantidadSalida, um) {
    try {
        obtenerIngredientes(id).then(response => {
            const { data } = response;
            const { nombre, cantidad } = data;


            listarMovimientosIngredientes(id).then(response => {
                const { data } = response;

                // Validar tipo y determinar nuevas existencias
                    const nuevaCantidad = parseFloat(cantidad) - parseFloat(cantidadSalida);

                    const dataMovimiento = {
                        nombre: nombre,
                        tipo: "Salida",
                        cantidad: cantidadSalida,
                        um: um,
                        fecha: new Date(),
                    }

                    const finalEntrada = data.concat(dataMovimiento)

                    const dataTempFinal = {
                        movimientos: finalEntrada,
                        cantidad: nuevaCantidad.toString()
                    }

                    //console.log("datos finales ", movimientosFinal)


                    registraMovimientosIngrediente(id, dataTempFinal).then(response => {
                        const { data } = response;
                        //console.log(response)
                        const { datos, mensaje } = data;
                        toast.success(mensaje);
                        LogsInformativos(`Se han actualizado las existencias del ingrediente ${nombre}`, datos)
                    });
            })
        }).catch(e => {
            console.log(e)
        })
    } catch (e) {
        console.log(e)
    }
}