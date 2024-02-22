import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroMovimientosCajas,
    ENDPOINTListarMovimientosCajas,
    ENDPOINTListarPaginandoMovimientosCajas,
    ENDPOINTTotalMovimientosCajas,
    ENDPOINTListarPaginandoMovimientosCajasActivas,
    ENDPOINTObtenerUltimoMovimientoCajas,
    ENDPOINTObtenerMovimientosCajas,
    ENDPOINTEliminarMovimientosCajas,
    ENDPOINTActualizarMovimientosCajas,
    ENDPOINTTotalMovimientosCajasActivas,
    ENDPOINTCancelarMovimientosCajas,
    ENDPOINTListarPaginandoMovimientosCajasCanceladas,
    ENDPOINTTotalMovimientosCajasCanceladas,
    ENDPOINTObtenerMovimientosCajasPorCaja
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra categorias
export async function registraMovimientos(data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroMovimientosCajas, data, config);
}

// Para obtener una categoria
export async function obtenerMovimiento(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerMovimientosCajas + `/${params}`, config);
}

// Para obtener una categoria
export async function obtenerMovimientosPorCaja(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerMovimientosCajasPorCaja + `/${params}`, config);
}

// Para listar todas las categorias
export async function listarMovimientos(idCaja) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMovimientosCajas + `/?idCaja=${idCaja}`, config);
}

// Para listar todas las categorias
export async function obtenerUltimoMovimiento() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerUltimoMovimientoCajas, config);
}

// Listar las categorias activas paginandolas
export async function listarPaginacionMovimientosActivas(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoMovimientosCajasActivas + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar las categorias canceladas paginandolas
export async function listarPaginacionMovimientosCanceladas(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoMovimientosCajasCanceladas + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar las categorias activas paginandolas
export async function listarPaginacionMovimientos(pagina, limite, caja) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoMovimientosCajas + `/?pagina=${pagina}&&limite=${limite}&&idCaja=${caja}`, config);
}

// Obtiene el total de categorias activas registradas
export async function totalMovimientos(caja) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalMovimientosCajas + `/?idCaja=${caja}`, config);
}

// Elimina categoria
export async function eliminaMovimientos(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarMovimientosCajas + `/${id}`, config);
}

// Modifica datos de la categoria
export async function actualizaMovimientos(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarMovimientosCajas + `/${id}`, data, config);
}

// Cambiar el estado de las categorias
export async function cancelarMovimientos(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTCancelarMovimientosCajas + `/${id}`, data, config);
}

// Obtiene el total de categorias activas registradas
export async function totalMovimientosActivas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalMovimientosCajasActivas, config);
}

// Obtiene el total de categorias canceladas registradas
export async function totalMovimientosCanceladas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalMovimientosCajasCanceladas, config);
}