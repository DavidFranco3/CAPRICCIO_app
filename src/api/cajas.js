import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroCajas,
    ENDPOINTListarCajas,
    ENDPOINTListarPaginandoCajas,
    ENDPOINTTotalCajas,
    ENDPOINTListarPaginandoCajasActivas,
    ENDPOINTObtenerCajas,
    ENDPOINTEliminarCajas,
    ENDPOINTActualizarCajas,
    ENDPOINTTotalCajasActivas,
    ENDPOINTCancelarCajas,
    ENDPOINTListarPaginandoCajasCanceladas,
    ENDPOINTTotalCajasCanceladas,
    ENDPOINTObtenerUltimaCajaCajero
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra categorias
export async function registraCajas(data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroCajas, data, config);
}

// Para obtener una categoria
export async function obtenerCaja(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerCajas + `/${params}`, config);
}

// Listar las categorias activas paginandolas
export async function obtenerUltimaCajaCajero(idCajero) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerUltimaCajaCajero + `/${idCajero}`, config);
}

// Para listar todas las categorias
export async function listarCajas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCajas, config);
}

// Listar las categorias activas paginandolas
export async function listarPaginacionCajasActivas(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoCajasActivas + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar las categorias canceladas paginandolas
export async function listarPaginacionCajasCanceladas(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoCajasCanceladas + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar las categorias activas paginandolas
export async function listarPaginacionCajas(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoCajas + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Obtiene el total de categorias activas registradas
export async function totalCajas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCajas, config);
}

// Elimina categoria
export async function eliminaCaja(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarCajas + `/${id}`, config);
}

// Modifica datos de la categoria
export async function actualizaCaja(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarCajas + `/${id}`, data, config);
}

// Cambiar el estado de las categorias
export async function cancelarCaja(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTCancelarCajas + `/${id}`, data, config);
}

// Obtiene el total de categorias activas registradas
export async function totalCajasActivas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCajasActivas, config);
}

// Obtiene el total de categorias canceladas registradas
export async function totalCajasCanceladas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCajasCanceladas, config);
}