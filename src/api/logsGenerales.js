import { API_HOST, API_IP } from "../utils/constants";
import {
    ENDPOINTRegistroLogs,
    ENDPOINTListarLogs,
    ENDPOINTObtenerNoLogs,
    ENDPOINTListarPaginandoLogs,
    ENDPOINTObtenerLogs,
    ENDPOINTEliminarLogs,
    ENDPOINTActualizarLogs,
    ENDPOINTTotalLogs
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra log
export async function registraLog(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroLogs, data, config);
}

// Obten el total de registros de la colección
export async function totalLogs() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalLogs, config);
}

// Para obtener todos los datos de un log
export async function obtenerLog(id) {
    //console.log(params)
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerLogs + `/${id}`, config);
}

// Para obtener el numero de log actual
export async function obtenerNumeroLog() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNoLogs, config);
}

// Para listar todos los log
export async function listarLogs() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarLogs, config);
}

// Lista los log paginandolos
export async function listarLogsPaginacion(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoLogs + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina logs
export async function eliminaLogs(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarLogs + `/${id}`, config);
}

// Modifica datos de un log
export async function actualizaDatosLog(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarLogs + `/${id}`, data, config);
}

// Para obtener la ip del usuario
export async function obtenIP(){
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        }
    }

    return await axios.get(API_IP, config);
}
