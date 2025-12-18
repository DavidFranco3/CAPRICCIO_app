import { API_HOST } from "../utils/constants";
import axios from "axios";
import { getTokenApi } from "./auth";
import { 
    ENDPOINTActualizarComision,
    ENDPOINTListarComision,
    ENDPOINTRegistroComision,
} from "./endpoints";

// Registrar comisión
export async function registrarComision(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.post(API_HOST + ENDPOINTRegistroComision, data, config);
}

// Obtener lista de comision
export async function obtenerComisiones() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarComision, config);
}

export async function actualizarComision(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.put(API_HOST + ENDPOINTActualizarComision + `/${id}`, data, config);
}
