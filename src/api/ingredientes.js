import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroIngredientes,
    ENDPOINTListarIngredientes,
    ENDPOINTListarPaginandoIngredientesActivos,
    ENDPOINTTotalIngredientesActivos,
    ENDPOINTListarPaginandoIngredientesCancelados,
    ENDPOINTTotalIngredientesCancelados,
    ENDPOINTObtenerIngredientes,
    ENDPOINTEliminarIngredientes,
    ENDPOINTActualizarIngredientes,
    ENDPOINTCancelarIngredientes,
    ENDPOINTRegitsrarMovimiento,
    ENDPOINTListarMovimientosPaginacion,
    ENDPOINTTotalMovimientos,
    ENDPOINTListarMovimientos,
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra categorias
export async function registraIngredientes(data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.post(API_HOST + ENDPOINTRegistroIngredientes, data, config);
}

// Para obtener una categoria
export async function obtenerIngredientes(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerIngredientes + `/${params}`, config);
}

// Para listar todas las categorias
export async function listarIngredientes() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarIngredientes, config);
}

// Para listar todas las categorias
export async function listarMovimientosIngredientes(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMovimientos + `/${id}`, config);
}

// Listar las categorias activas paginandolas
export async function listarMovimientosIngredientesPaginacion(pagina, limite, id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarMovimientosPaginacion + `/?pagina=${pagina}&&limite=${limite}&&id=${id}`, config);
}

export async function totalMovimientosIngredientes(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalMovimientos + `/?id=${id}`, config);
}

// Listar las categorias activas paginandolas
export async function listarPaginacionIngredientesActivos(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoIngredientesActivos + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar las categorias canceladas paginandolas
export async function listarPaginacionIngredientesCancelados(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoIngredientesCancelados + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina categoria
export async function eliminaIngrediente(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.delete(API_HOST + ENDPOINTEliminarIngredientes + `/${id}`, config);
}

// Modifica datos de la categoria
export async function registraMovimientosIngrediente(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.put(API_HOST + ENDPOINTRegitsrarMovimiento + `/${id}`, data, config);
}

// Modifica datos de la categoria
export async function actualizaIngrediente(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.put(API_HOST + ENDPOINTActualizarIngredientes + `/${id}`, data, config);
}

// Cambiar el estado de las categorias
export async function cancelarIngrediente(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.put(API_HOST + ENDPOINTCancelarIngredientes + `/${id}`, data, config);
}

// Obtiene el total de categorias activas registradas
export async function totalIngredientesActivos() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalIngredientesActivos, config);
}

// Obtiene el total de categorias canceladas registradas
export async function totalIngredientesCancelados() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalIngredientesCancelados, config);
}