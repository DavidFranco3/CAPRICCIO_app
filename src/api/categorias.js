import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroCategorias,
    ENDPOINTListarCategorias,
    ENDPOINTListarPaginandoCategoriasActivas,
    ENDPOINTObtenerCategorias,
    ENDPOINTEliminarCategorias,
    ENDPOINTActualizarCategorias,
    ENDPOINTTotalCategoriasActivas,
    ENDPOINTCancelarCategorias,
    ENDPOINTListarPaginandoCategoriasCanceladas,
    ENDPOINTTotalCategoriasCanceladas
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra categorias
export async function registraCategorias(data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroCategorias, data, config);
}

// Para obtener una categoria
export async function obtenerCategoria(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerCategorias + `/${params}`, config);
}

// Para listar todas las categorias
export async function listarCategorias() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarCategorias, config);
}

// Listar las categorias activas paginandolas
export async function listarPaginacionCategoriasActivas(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoCategoriasActivas + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar las categorias canceladas paginandolas
export async function listarPaginacionCategoriasCanceladas(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoCategoriasCanceladas + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Elimina categoria
export async function eliminaCategoria(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarCategorias + `/${id}`, config);
}

// Modifica datos de la categoria
export async function actualizaCategoria(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarCategorias + `/${id}`, data, config);
}

// Cambiar el estado de las categorias
export async function cancelarCategoria(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTCancelarCategorias + `/${id}`, data, config);
}

// Obtiene el total de categorias activas registradas
export async function totalCategoriasActivas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCategoriasActivas, config);
}

// Obtiene el total de categorias canceladas registradas
export async function totalCategoriasCanceladas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalCategoriasCanceladas, config);
}