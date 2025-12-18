import { API_HOST } from "../utils/constants";
import {
    ENDPOINTRegistroPedidos,
    ENDPOINTListarPedidos,
    ENDPOINTListarPedidosDia,
    ENDPOINTListarPedidosMes,
    ENDPOINTListarPaginandoPedidos,
    ENDPOINTTotalPedidos,
    ENDPOINTListarPaginandoPedidosActivas,
    ENDPOINTTotalPedidosActivas,
    ENDPOINTListarPaginandoPedidosCanceladas,
    ENDPOINTTotalPedidosCanceladas,
    ENDPOINTListarPaginandoPedidosDia,
    ENDPOINTListarPaginandoPedidosMes,
    ENDPOINTObtenerPedidos,
    ENDPOINTEliminarPedidos,
    ENDPOINTActualizarPedidos,
    ENDPOINTCancelarPedidos,
    ENDPOINTObtenerNumeroPedido,
    ENDPOINTListarPedidosPorDia,
    ENDPOINTListarPedidosPorMes,
    ENDPOINTListarDetallesPedidosDia,
    ENDPOINTListarDetallesPedidosMes,
    ENDPOINTListarDetallesProductosPedidosDia,
    ENDPOINTListarDetallesProductosPedidosMes,
    ENDPOINTListarPaginandoPedidosPorClientes,
    ENDPOINTTotalPedidosPorClientes
} from "./endpoints";
import axios from 'axios';
import { getTokenApi } from "./auth";

// Registra ventas
export async function registraPedidos(data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.post(API_HOST + ENDPOINTRegistroPedidos, data, config);
}

// Para obtener una venta
export async function obtenerPedidos(params) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerPedidos + `/${params}`, config);
}

// Para listar todas las ventas
export async function listarPedidos() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPedidos, config);
}

// Para obtener el total de ventas registradas
export async function totalPedidosActivas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalPedidosActivas, config);
}

// Para listar todas las ventas
export async function totalPedidos() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalPedidos, config);
}

// Para listar todas las ventas canceladas
export async function totalPedidosCanceladas() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalPedidosCanceladas, config);
}

// Listar ventas por dia
export async function listarPedidosPorDia(dia) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPedidosPorDia + `?dia=${dia}`, config);
}

// Listar ventas por dia
export async function listarPedidosPorMes(mes) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPedidosPorMes + `?mes=${mes}`, config);
}

// Listar las ventas activas paginandolas
export async function listarPaginacionPedidosActivas(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoPedidosActivas + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar las ventas paginandolas
export async function listarPaginacionPedidos(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoPedidos + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar las ventas canceladas paginandolas
export async function listarPaginacionPedidosCanceladas(pagina, limite) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoPedidosCanceladas + `/?pagina=${pagina}&&limite=${limite}`, config);
}

// Listar las ventas de un dia especifico paginandolas
export async function listarPaginacionPedidosDia(pagina, limite, dia) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoPedidosDia + `/?pagina=${pagina}&&limite=${limite}&&dia=${dia}`, config);
}

// Listar las ventas de un dia especifico paginandolas
export async function listarPedidosDia(dia) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPedidosDia + `/?dia=${dia}`, config);
}

// Listar las ventas de un dia especifico paginandolas
export async function listarPedidosMes(mes) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPedidosMes + `/?mes=${mes}`, config);
}

// Listar las ventas de un mes especifico paginandolas
export async function listarPaginacionPedidosMes(pagina, limite, mes) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoPedidosMes + `/?pagina=${pagina}&&limite=${limite}&&mes=${mes}`, config);
}

// Listar los detalles de las ventas del dia
export async function listarDetallesPedidosPorMes(dia) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarDetallesPedidosMes + `?dia=${dia}`, config);
}

// Listar los detalles de las ventas del dia
export async function listarDetallesPedidosPorDia(dia) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarDetallesPedidosDia + `?dia=${dia}`, config);
}

// Listar solo los productos que se vendieron en el día solicitado
export async function listarDetallesProductosPedidosPorDia(dia) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarDetallesProductosPedidosDia + `?dia=${dia}`, config);
}

// Listar solo los productos que se vendieron en el día solicitado
export async function listarDetallesProductosPedidosPorMes(mes) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarDetallesProductosPedidosMes + `?mes=${mes}`, config);
}

// Elimina ventas
export async function eliminaPedidos(id) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.delete(API_HOST + ENDPOINTEliminarPedidos + `/${id}`, config);
}

// Modifica el tiquet que se ha registrado
export async function actualizaPedidos(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTActualizarPedidos + `/${id}`, data, config);
}

// Cambiar estado de las ventas
export async function cancelarPedidos(id, data) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };

    return await axios.put(API_HOST + ENDPOINTCancelarPedidos + `/${id}`, data, config);
}

// Obtener el numero del ultimo tiquet
export async function obtenUltimoNoTiquet() {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTObtenerNumeroPedido, config);
}

// Listar las ventas paginandolas
export async function listarPaginacionPedidosPorClientes(pagina, limite, usuario) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTListarPaginandoPedidosPorClientes + `/?pagina=${pagina}&&limite=${limite}&&usuario=${usuario}`, config);
}

// Para obtener el total de ventas registradas
export async function totalPedidosPorClientes(usuario) {
    const config = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenApi()}`
        }
    };
    return await axios.get(API_HOST + ENDPOINTTotalPedidosPorClientes + `/?usuario=${usuario}`, config);
}
