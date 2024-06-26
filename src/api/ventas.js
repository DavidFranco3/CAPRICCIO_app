import { API_HOST } from "../utils/constants";
import {
  ENDPOINTRegistroVentas,
  ENDPOINTListarVentas,
  ENDPOINTListarVentasDia,
  ENDPOINTListarVentasMes,
  ENDPOINTListarVentasSemana,
  ENDPOINTListarPaginandoVentasActivas,
  ENDPOINTListarPaginandoVentas,
  ENDPOINTListarPaginandoVentasDia,
  ENDPOINTListarPaginandoVentasMes,
  ENDPOINTListarPaginandoVentasSemana,
  ENDPOINTObtenerVentas,
  ENDPOINTEliminarVentas,
  ENDPOINTActualizarVentas,
  ENDPOINTActualizarTicketVentas,
  ENDPOINTCancelarVentas,
  ENDPOINTObtenerNumeroVenta,
  ENDPOINTListarVentasPorDia,
  ENDPOINTListarVentasPorMes,
  ENDPOINTListarVentasPorSemana,
  ENDPOINTListarDetallesVentasDia,
  ENDPOINTListarDetallesVentasMes,
  ENDPOINTListarDetallesVentasSemana,
  ENDPOINTListarDetallesProductosVendidosDia,
  ENDPOINTListarDetallesProductosVendidosMes,
  ENDPOINTListarDetallesProductosVendidosSemana,
  ENDPOINTTotalVentas,
  ENDPOINTTotalVentasActivas,
  ENDPOINTTotalVentasCanceladas,
  ENDPOINTListarPaginandoVentasCanceladas,
  ENDPOINTListarPaginandoVentasCajerosActivas,
  ENDPOINTTotalVentasCajerosActivas,
  ENDPOINTListarPaginandoVentasCajerosCanceladas,
  ENDPOINTTotalVentasCajerosCanceladas,
  ENDPOINTTotalIngredientesConsumidosDiarios,
  ENDPOINTListarPaginandoVentasActivasTicket,
  ENDPOINTTotalVentasActivasTicket,
  ENDPOINTListarPaginandoVentasCanceladasTicket,
  ENDPOINTTotalVentasCanceladasTicket,
  ENDPOINTObtenerVentaAsociada,
  ENDPOINTAtenderVentas,
  ENDPOINTObtenerVentasenMesasConTicket,
  ENDPOINTObtenerVentasTotalesDelDia,
  ENDPOINTActualizarProdsTicket,
  ENDPOINTCobrarTicket,
  ENDPOINTListarPedidosPendientes,
  ENDPOINTListarVentasRangoDeFechas,
} from "./endpoints";
import axios from "axios";
import { getTokenApi } from "./auth";

// Registra ventas
export async function registraVentas(data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.post(API_HOST + ENDPOINTRegistroVentas, data, config);
}

// Para obtener una venta
export async function obtenerVentas(numeroTiquet) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTObtenerVentas + `/${numeroTiquet}`,
    config
  );
}

// Para obtener una venta
export async function obtenerVentaAsociada(params) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTObtenerVentaAsociada + `/${params}`,
    config
  );
}

// Para listar todas las ventas
export async function listarVentas() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(API_HOST + ENDPOINTListarVentas, config);
}

// Para obtener el total de ventas registradas
export async function totalVentasActivas() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(API_HOST + ENDPOINTTotalVentasActivas, config);
}

// Para listar todas las ventas
export async function totalVentas() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(API_HOST + ENDPOINTTotalVentas, config);
}

// Para listar todas las ventas canceladas
export async function totalVentasCanceladas() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(API_HOST + ENDPOINTTotalVentasCanceladas, config);
}

// Listar ventas por dia
export async function listarVentasPorDia(dia) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTListarVentasPorDia + `?dia=${dia}`,
    config
  );
}

// Listar ventas por dia
export async function listarVentasPorMes(mes, año) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTListarVentasPorMes + `?mes=${mes}&&año=${año}`,
    config
  );
}

// Listar ventas por dia
export async function listarVentasPorSemana(semana, año) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTListarVentasPorSemana + `?semana=${semana}&&año=${año}`,
    config
  );
}

// Listar las ventas activas paginandolas
export async function listarPaginacionVentasActivas(pagina, limite) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoVentasActivas +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  );
}

// Listar las ventas paginandolas
export async function listarPaginacionVentas(pagina, limite) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoVentas +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  );
}

// Listar las ventas canceladas paginandolas
export async function listarPaginacionVentasCanceladas(pagina, limite) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoVentasCanceladas +
      `/?pagina=${pagina}&&limite=${limite}`,
    config
  );
}

// Listar las ventas activas paginandolas
export async function listarPaginacionVentasUsuariosActivas(
  pagina,
  limite,
  usuario
) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoVentasCajerosActivas +
      `/?pagina=${pagina}&&limite=${limite}&&usuario=${usuario}`,
    config
  );
}

// Listar las ventas canceladas paginandolas
export async function listarPaginacionVentasUsuariosCanceladas(
  pagina,
  limite,
  usuario
) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoVentasCajerosCanceladas +
      `/?pagina=${pagina}&&limite=${limite}&&usuario=${usuario}`,
    config
  );
}

// Para obtener el total de ventas registradas
export async function totalVentasUsuariosActivas(usuario) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTTotalVentasCajerosActivas + `/?usuario=${usuario}`,
    config
  );
}

// Para listar todas las ventas canceladas
export async function totalVentasUsuariosCanceladas(usuario) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTTotalVentasCajerosCanceladas + `/?usuario=${usuario}`,
    config
  );
}

// Listar las ventas activas paginandolas
export async function listarPaginacionVentasTicketActivas(
  pagina,
  limite,
  ticket
) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoVentasActivasTicket +
      `/?pagina=${pagina}&&limite=${limite}&&numeroTiquet=${ticket}`,
    config
  );
}

// Listar las ventas canceladas paginandolas
export async function listarPaginacionVentasTicketCanceladas(
  pagina,
  limite,
  ticket
) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoVentasCanceladasTicket +
      `/?pagina=${pagina}&&limite=${limite}&&numeroTiquet=${ticket}`,
    config
  );
}

// Para obtener el total de ventas registradas
export async function totalVentasTicketActivas(ticket) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTTotalVentasActivasTicket + `/?numeroTiquet=${ticket}`,
    config
  );
}

// Para listar todas las ventas canceladas
export async function totalVentasTicketCanceladas(ticket) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTTotalVentasCanceladasTicket + `/?numeroTiquet=${ticket}`,
    config
  );
}

// Listar las ventas de un dia especifico paginandolas
export async function listarPaginacionVentasDia(pagina, limite, dia) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoVentasDia +
      `/?pagina=${pagina}&&limite=${limite}&&dia=${dia}`,
    config
  );
}

// ventas por rango de  ENDPOINTListarVentasRangoDeFechas
export async function listarVentasRangoFechas(fechaInicial, fechaFinal) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarVentasRangoDeFechas +
      `/?fechaInicial=${fechaInicial}&&fechaFinal=${fechaFinal}`,
    config
  );
}

// Listar las ventas de un dia especifico paginandolas
export async function listarVentasDia(dia) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTListarVentasDia + `/?dia=${dia}`,
    config
  );
}

// Listar las ventas de un dia especifico paginandolas
export async function listarVentasMes(mes, año) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTListarVentasMes + `/?mes=${mes}&&año=${año}`,
    config
  );
}

// Listar las ventas de un dia especifico paginandolas
export async function listarVentasSemana(semana, año) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTListarVentasSemana + `/?semana=${semana}&&año=${año}`,
    config
  );
}

// Listar las ventas de un mes especifico paginandolas
export async function listarPaginacionVentasMes(pagina, limite, mes, año) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoVentasMes +
      `/?pagina=${pagina}&&limite=${limite}&&mes=${mes}&&año=${año}`,
    config
  );
}

// Listar las ventas de un mes especifico paginandolas
export async function listarPaginacionVentasSemana(
  pagina,
  limite,
  semana,
  año
) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarPaginandoVentasSemana +
      `/?pagina=${pagina}&&limite=${limite}&&semana=${semana}&&año=${año}`,
    config
  );
}

// Listar los detalles de las ventas del dia
export async function listarDetallesVentasPorMes(dia, año) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTListarDetallesVentasMes + `?dia=${dia}&&año=${año}`,
    config
  );
}

// Listar los detalles de las ventas del dia
export async function listarDetallesVentasPorSemana(semana, año) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarDetallesVentasSemana +
      `?semana=${semana}&&año=${año}`,
    config
  );
}

// Listar los detalles de las ventas del dia
export async function listarDetallesVentasPorDia(dia) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTListarDetallesVentasDia + `?dia=${dia}`,
    config
  );
}

// Listar solo los productos que se vendieron en el día solicitado
export async function listarConsumoIngredientesDiario(dia) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTTotalIngredientesConsumidosDiarios + `?dia=${dia}`,
    config
  );
}

// Listar solo los productos que se vendieron en el día solicitado
export async function listarDetallesProductosVentasPorDia(dia) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTListarDetallesProductosVendidosDia + `?dia=${dia}`,
    config
  );
}

// Listar solo los productos que se vendieron en el día solicitado
export async function listarDetallesProductosVentasPorMes(mes, año) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarDetallesProductosVendidosMes +
      `?mes=${mes}&&año=${año}`,
    config
  );
}

// Listar solo los productos que se vendieron en el día solicitado
export async function listarDetallesProductosVentasPorSemana(semana, año) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST +
      ENDPOINTListarDetallesProductosVendidosSemana +
      `?semana=${semana}&&año=${año}`,
    config
  );
}

// Elimina ventas
export async function eliminaVentas(id) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.delete(
    API_HOST + ENDPOINTEliminarVentas + `/${id}`,
    config
  );
}

// Modifica el tiquet que se ha registrado
export async function actualizaVenta(id, data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.put(
    API_HOST + ENDPOINTActualizarVentas + `/${id}`,
    data,
    config
  );
}
//ENDPOINTActualizarTicketVentas
//actualizar productos del ticket
export async function actualizaTicket(id, data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.put(
    API_HOST + ENDPOINTActualizarTicketVentas + `/${id}`,
    data,
    config
  );
}

// ACTUALIZAR LOS PRODUCTOS DEL TICKET
export async function actualizarProdsTicket(numeroTiquet, data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.put(
    API_HOST + ENDPOINTActualizarProdsTicket + `/${numeroTiquet}`,
    data,
    config
  );
}

export async function cobrarTicket(numeroTiquet, data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.put(
    API_HOST + ENDPOINTCobrarTicket + `/${numeroTiquet}`,
    data,
    config
  );
}

export async function listarPedidosPendientes() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.get(API_HOST + ENDPOINTListarPedidosPendientes, config);
}

// Cambiar estado de las ventas
export async function cancelarVenta(id, data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.put(
    API_HOST + ENDPOINTCancelarVentas + `/${id}`,
    data,
    config
  );
}

// Cambiar estado de las ventas
export async function atenderVenta(id, data) {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };

  return await axios.put(
    API_HOST + ENDPOINTAtenderVentas + `/${id}`,
    data,
    config
  );
}

// Obtener el numero del ultimo tiquet
export async function obtenUltimoNoTiquet() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(API_HOST + ENDPOINTObtenerNumeroVenta, config);
}
//ventas en mesas activas ENDPOINTObtenerVentasenMesasConTicket
export async function obtenerMesaOcupadas() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(
    API_HOST + ENDPOINTObtenerVentasenMesasConTicket,
    config
  );
}

//ventas del dia ENDPOINTObtenerVentasTotalesDelDia
export async function obtenerVentasdelDia() {
  const config = {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getTokenApi()}`,
    },
  };
  return await axios.get(API_HOST + ENDPOINTObtenerVentasTotalesDelDia, config);
}
