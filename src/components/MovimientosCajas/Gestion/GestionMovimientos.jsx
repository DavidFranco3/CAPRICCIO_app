import { useState, useEffect } from 'react';
import { LogsInformativos } from "../../Logs/LogsSistema/LogsSistema";
import { registraMovimientos } from "../../../api/movimientosCajas";
import { getTokenApi, isExpiredToken, logoutApi, obtenidusuarioLogueado } from "../../../api/auth";
import { obtenerUsuario } from "../../../api/usuarios";
import { obtenerUltimaCajaCajero } from "../../../api/cajas";

// Realiza la modificación de saldos al realizar un movimiento
export function LogCajaActualizacion(movimiento, pago, monto) {
    const [idCajero, setIdCajero] = useState("");
    const [cajero, setCajero] = useState("");

    useEffect(() => {
        try {
            obtenerUsuario(obtenidusuarioLogueado(getTokenApi())).then(response => {
                const { data } = response;
                const { _id, nombre } = data;
                //console.log(data)
                setIdCajero(_id);
                setCajero(nombre);
            }).catch((e) => {
                if (e.message === 'Network Error') {
                    console.log("No hay internet")
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    const [caja, setCaja] = useState("");

    useEffect(() => {
        try {
            obtenerUltimaCajaCajero(idCajero).then(response => {
                const { data } = response;
                const { _id } = data;
                //console.log(data)
                setCaja(_id);
            }).catch((e) => {
                if (e.message === 'Network Error') {
                    console.log("No hay internet")
                }
            })
        } catch (e) {
            console.log(e)
        }
    }, []);

    try {
        const dataTemp = {

            idCaja: caja,
            idCajero: idCajero,
            cajero: cajero,
            movimiento: movimiento,
            pago: pago,
            monto: monto,
            estado: "true",
        }
        // Inicia actualización de saldos de los socios
        registraMovimientos(dataTemp).then(response => {
            const { data } = response;
            LogsInformativos("Se ha registrado el movimiento del cajero " + dataTemp.cajero, data.datos);
            // console.log("Actualización de saldo personal")
        }).catch(e => {
            // console.log(e)
        })
    } catch (e) {
        console.log(e)
    }
}