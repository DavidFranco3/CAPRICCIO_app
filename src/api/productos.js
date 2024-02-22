import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroProductos,
    ENDPOINTListarProductos,
    ENDPOINTListarPaginandoProductosActivos,
    ENDPOINTListarProductosCategoria,
    ENDPOINTObtenerProductos,
    ENDPOINTEliminarProductos,
    ENDPOINTActualizarProductos,
    ENDPOINTTotalProductosActivos,
    ENDPOINTCancelarProductos,
    ENDPOINTListarPaginandoProductosCancelados,
    ENDPOINTTotalProductosCancelados
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra productos
export async function registraProductos(data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroProductos, data, config);
}

// Para obtener una producto
export async function obtenerProductos(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerProductos + `/${params}`, config);
}

// Para listar todos los productos
export async function listarProductos() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarProductos, config);
}

// Listar los productos activos paginandolos
export async function listarPaginacionProductosActivos(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoProductosActivos + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar los productos cancelados paginandolos
export async function listarPaginacionProductosCancelados(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoProductosCancelados + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar productos por categoria
export async function listarProductosCategoria(categoria) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarProductosCategoria + `?categoria=${categoria}`, config);
}

// Elimina productos
export async function eliminaProductos(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarProductos + `/${id}`, config);
}

// Modifica datos del producto
export async function actualizaProductos(id, data) {

    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarProductos + `/${id}`, data, config);
}

// Cambiar el estado del producto
export async function cancelarProducto(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTCancelarProductos + `/${id}`, data, config);
}

// Para obtener el total de productos registrados
export async function totalProductosActivos() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalProductosActivos, config);
}

// Para obtener el total de productos registrados
export async function totalProductosCancelados() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalProductosCancelados, config);
}
