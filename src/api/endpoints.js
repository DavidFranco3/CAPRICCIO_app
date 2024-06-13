// Rutas de la API

// Login
export const ENDPOINTLoginAdministrador = "/login";

// Usuarios
export const ENDPOINTRegistroUsuarios = "/usuarios/registro";
export const ENDPOINTRegistroClientes = "/clientes/registroCliente";
export const ENDPOINTListarUsuarios = "/usuarios/listar";
export const ENDPOINTListarUsuariosCajeros = "/usuarios/listarCajeros";
export const ENDPOINTListarPaginandoUsuarios = "/usuarios/listarPaginando";
export const ENDPOINTListarPaginandoUsuariosActivos = "/usuarios/listarPaginandoActivos";
export const ENDPOINTTotalUsuariosActivos = "/usuarios/totalUsuariosActivos";
export const ENDPOINTListarPaginandoUsuariosCancelados = "/usuarios/listarPaginandoCancelados";
export const ENDPOINTTotalUsuariosCancelados = "/usuarios/totalUsuariosCancelados";
export const ENDPOINTObtenerUsuarios = "/usuarios/obtenerUsuario";
export const ENDPOINTEliminarUsuarios = "/usuarios/eliminar";
export const ENDPOINTDeshabilitarUsuarios = "/usuarios/deshabilitar";
export const ENDPOINTActualizarUsuarios = "/usuarios/actualizar";
export const ENDPOINTListarPaginandoClientes = "/usuarios/listarPaginandoClientes";
export const ENDPOINTTotalClientes = "/usuarios/totalClientes";

// Comisiones
export const ENDPOINTRegistroComision = "/comision/registro";
export const ENDPOINTListarComision = "/comision/listar";
export const ENDPOINTActualizarComision = "/comision/actualizar";

// Categorías
export const ENDPOINTRegistroCategorias = "/categorias/registro";
export const ENDPOINTListarCategorias = "/categorias/listar";
export const ENDPOINTListarPaginandoCategoriasActivas = "/categorias/listarPaginandoActivas";
export const ENDPOINTTotalCategoriasActivas = "/categorias/totalCategoriasActivas";
export const ENDPOINTListarPaginandoCategoriasCanceladas = "/categorias/listarPaginandoCanceladas";
export const ENDPOINTTotalCategoriasCanceladas = "/categorias/totalCategoriasCanceladas";
export const ENDPOINTObtenerCategorias = "/categorias/obtener";
export const ENDPOINTEliminarCategorias = "/categorias/eliminar";
export const ENDPOINTActualizarCategorias = "/categorias/actualizar";
export const ENDPOINTCancelarCategorias = "/categorias/cancelar";

// Productos
export const ENDPOINTRegistroProductos = "/productos/registro";
export const ENDPOINTListarProductos = "/productos/listar";
export const ENDPOINTListarPaginandoProductosActivos = "/productos/listarPaginandoActivos";
export const ENDPOINTTotalProductosActivos = "/productos/totalProductosActivos";
export const ENDPOINTListarPaginandoProductosCancelados = "/productos/listarPaginandoCancelados";
export const ENDPOINTTotalProductosCancelados = "/productos/totalProductosCancelados";
export const ENDPOINTListarProductosCategoria = "/productos/listarFiltroCategoria";
export const ENDPOINTObtenerProductos = "/productos/obtener";
export const ENDPOINTEliminarProductos = "/productos/eliminar";
export const ENDPOINTActualizarProductos = "/productos/actualizar";
export const ENDPOINTCancelarProductos = "/productos/cancelar";

// Ventas
export const ENDPOINTRegistroVentas = "/ventas/registro";
export const ENDPOINTListarVentas = "/ventas/listar";
export const ENDPOINTListarVentasDia = "/ventas/listarVentasDia";
export const ENDPOINTListarVentasMes = "/ventas/listarVentasMes";
export const ENDPOINTListarVentasSemana = "/ventas/listarVentasSemana";
export const ENDPOINTListarPaginandoVentas = "/ventas/listarPaginando";
export const ENDPOINTTotalVentas = "/ventas/totalVentas";
export const ENDPOINTListarPaginandoVentasActivas = "/ventas/listarPaginandoActivas";
export const ENDPOINTTotalVentasActivas = "/ventas/totalVentasActivas";
export const ENDPOINTListarPaginandoVentasCanceladas = "/ventas/listarPaginandoCanceladas";
export const ENDPOINTTotalVentasCanceladas = "/ventas/totalVentasCanceladas";
export const ENDPOINTListarPaginandoVentasActivasTicket = "/ventas/listarPaginandoActivasTicket";
export const ENDPOINTTotalVentasActivasTicket = "/ventas/totalVentasActivasTicket";
export const ENDPOINTListarPaginandoVentasCanceladasTicket = "/ventas/listarPaginandoCanceladasTicket";
export const ENDPOINTTotalVentasCanceladasTicket = "/ventas/totalVentasCanceladasTicket";
export const ENDPOINTListarPaginandoVentasDia = "/ventas/listarPaginandoDia";
export const ENDPOINTListarPaginandoVentasMes = "/ventas/listarPaginandoMes";
export const ENDPOINTListarPaginandoVentasSemana = "/ventas/listarPaginandoSemana";
export const ENDPOINTObtenerVentaAsociada = "/ventas/obtenerVentaAsociada";
export const ENDPOINTObtenerVentas = "/ventas/obtener";
export const ENDPOINTEliminarVentas = "/ventas/eliminar";
export const ENDPOINTActualizarVentas = "/ventas/actualizar";
export const ENDPOINTActualizarTicketVentas = "/ventas/actualizarticket";
export const ENDPOINTActualizarProdsTicket = "/ventas/actualizarticketprods";
export const ENDPOINTCobrarTicket = "/ventas/cobrarTicket";
export const ENDPOINTCancelarVentas = "/ventas/cancelar";
export const ENDPOINTAtenderVentas = "/ventas/cambiarIdentificador";
export const ENDPOINTObtenerNumeroVenta = "/ventas/obtenNoTiquet";
export const ENDPOINTListarVentasPorDia = "/ventas/listarTotalVentasDia";
export const ENDPOINTListarVentasPorMes = "/ventas/listarTotalVentasMes";
export const ENDPOINTListarVentasPorSemana = "/ventas/listarTotalVentasSemana";
export const ENDPOINTListarDetallesVentasDia = "/ventas/listarDetallesVentasDia";
export const ENDPOINTListarDetallesVentasMes = "/ventas/listarDetallesVentasMes";
export const ENDPOINTListarDetallesVentasSemana = "/ventas/listarDetallesVentasSemana";
export const ENDPOINTListarDetallesProductosVendidosDia = "/ventas/listarDetallesProductosVendidosDia";
export const ENDPOINTListarDetallesProductosVendidosMes = "/ventas/listarDetallesProductosVendidosMes";
export const ENDPOINTListarDetallesProductosVendidosSemana = "/ventas/listarDetallesProductosVendidosSemana";
export const ENDPOINTListarPaginandoVentasCajerosActivas = "/ventas/listarPaginandoCajerosActivas";
export const ENDPOINTTotalVentasCajerosActivas = "/ventas/totalVentasCajerosActivas";
export const ENDPOINTListarPaginandoVentasCajerosCanceladas = "/ventas/listarPaginandoCajerosCanceladas";
export const ENDPOINTTotalVentasCajerosCanceladas = "/ventas/totalVentasCajerosCanceladas";
export const ENDPOINTTotalIngredientesConsumidosDiarios = "/ventas/listarConsumoIngredientes";
export const ENDPOINTObtenerVentasenMesasConTicket = "/ventas/obtenerVentasenMesasConTicket";
export const ENDPOINTObtenerVentasTotalesDelDia = "/ventas/ventasTotalesDelDia";
//ventasTotalesDelDia


// Pedidos de clientes
export const ENDPOINTRegistroPedidos = "/pedidos/registro";
export const ENDPOINTListarPedidos = "/pedidos/listar";
export const ENDPOINTListarPedidosDia = "/pedidos/listarPedidosDia";
export const ENDPOINTListarPedidosMes = "/pedidos/listarPedidosMes";
export const ENDPOINTListarPaginandoPedidos = "/pedidos/listarPaginando";
export const ENDPOINTTotalPedidos = "/pedidos/totalPedidos";
export const ENDPOINTListarPaginandoPedidosPorClientes = "/pedidos/listarPaginandoClientes";
export const ENDPOINTTotalPedidosPorClientes = "/pedidos/totalPedidosClientes";
export const ENDPOINTListarPaginandoPedidosActivas = "/pedidos/listarPaginandoActivas";
export const ENDPOINTTotalPedidosActivas = "/pedidos/totalPedidosActivas";
export const ENDPOINTListarPaginandoPedidosCanceladas = "/pedidos/listarPaginandoCanceladas";
export const ENDPOINTTotalPedidosCanceladas = "/pedidos/totalPedidosCanceladas";
export const ENDPOINTListarPaginandoPedidosDia = "/pedidos/listarPaginandoDia";
export const ENDPOINTListarPaginandoPedidosMes = "/pedidos/listarPaginandoMes";
export const ENDPOINTObtenerPedidos = "/pedidos/obtener";
export const ENDPOINTEliminarPedidos = "/pedidos/eliminar";
export const ENDPOINTActualizarPedidos = "/pedidos/actualizar";
export const ENDPOINTCancelarPedidos = "/pedidos/cancelar";
export const ENDPOINTObtenerNumeroPedido = "/pedidos/obtenNoTiquet";
export const ENDPOINTListarPedidosPorDia = "/pedidos/listarTotalPedidosDia";
export const ENDPOINTListarPedidosPorMes = "/pedidos/listarTotalPedidosMes";
export const ENDPOINTListarDetallesPedidosDia = "/pedidos/listarDetallesPedidosDia";
export const ENDPOINTListarDetallesPedidosMes = "/pedidos/listarDetallesPedidosMes";
export const ENDPOINTListarDetallesProductosPedidosDia = "/pedidos/listarDetallesProductosPedidosDia";
export const ENDPOINTListarDetallesProductosPedidosMes = "/pedidos/listarDetallesProductosPedidosMes";

// Logs generales
export const ENDPOINTRegistroLogs = "/logs/registro";
export const ENDPOINTListarLogs = "/logs/listar";
export const ENDPOINTObtenerNoLogs = "/logs/obtenerNoLog";
export const ENDPOINTListarPaginandoLogs = "/logs/listarPaginando";
export const ENDPOINTObtenerLogs = "/logs/obtener";
export const ENDPOINTEliminarLogs = "/logs/eliminar";
export const ENDPOINTActualizarLogs = "/logs/actualizar";
export const ENDPOINTTotalLogs = "/logs/total";

// Ingrediente
export const ENDPOINTRegistroIngredientes = "/ingredientes/registro";
export const ENDPOINTListarIngredientes = "/ingredientes/listar";
export const ENDPOINTListarPaginandoIngredientesActivos = "/ingredientes/listarPaginandoActivos";
export const ENDPOINTTotalIngredientesActivos = "/ingredientes/totalIngredientesActivos";
export const ENDPOINTListarPaginandoIngredientesCancelados = "/ingredientes/listarPaginandoCancelados";
export const ENDPOINTTotalIngredientesCancelados = "/ingredientes/totalIngredientesCancelados";
export const ENDPOINTObtenerIngredientes = "/ingredientes/obtener";
export const ENDPOINTEliminarIngredientes = "/ingredientes/eliminar";
export const ENDPOINTActualizarIngredientes = "/ingredientes/actualizar";
export const ENDPOINTCancelarIngredientes = "/ingredientes/cancelar";
export const ENDPOINTRegitsrarMovimiento = "/ingredientes/registraMovimientos";
export const ENDPOINTListarMovimientosPaginacion = "/ingredientes/listarMovimientosIngredientesPaginacion";
export const ENDPOINTTotalMovimientos = "/ingredientes/totalMovimientosIngrediente";
export const ENDPOINTListarMovimientos = "/ingredientes/listarMovimientosIngredientes";

// Cajas
export const ENDPOINTRegistroCajas = "/cajas/registro";
export const ENDPOINTListarCajas = "/cajas/listar";
export const ENDPOINTListarPaginandoCajas = "/cajas/listarPaginando";
export const ENDPOINTTotalCajas = "/cajas/totalCajas";
export const ENDPOINTListarPaginandoCajasActivas = "/cajas/listarPaginandoActivas";
export const ENDPOINTTotalCajasActivas = "/cajas/totalCajasActivas";
export const ENDPOINTListarPaginandoCajasCanceladas = "/cajas/listarPaginandoCanceladas";
export const ENDPOINTTotalCajasCanceladas = "/cajas/totalCajasCanceladas";
export const ENDPOINTObtenerCajas = "/cajas/obtener";
export const ENDPOINTEliminarCajas = "/cajas/eliminar";
export const ENDPOINTActualizarCajas = "/cajas/actualizar";
export const ENDPOINTCancelarCajas = "/cajas/cancelar";
export const ENDPOINTObtenerUltimaCajaCajero = "/cajas/obtenerUltimaCajaCajero";

// Movimientos cajas
export const ENDPOINTRegistroMovimientosCajas = "/movimientosCajas/registro";
export const ENDPOINTListarMovimientosCajas = "/movimientosCajas/listar";
export const ENDPOINTObtenerUltimoMovimientoCajas = "/movimientosCajas/ObtenerUltimo";
export const ENDPOINTListarPaginandoMovimientosCajas = "/movimientosCajas/listarPaginando";
export const ENDPOINTTotalMovimientosCajas = "/movimientosCajas/totalMovimientos";
export const ENDPOINTListarPaginandoMovimientosCajasActivas = "/movimientosCajas/listarPaginandoActivas";
export const ENDPOINTTotalMovimientosCajasActivas = "/movimientosCajas/totalMovimientosActivas";
export const ENDPOINTListarPaginandoMovimientosCajasCanceladas = "/movimientosCajas/listarPaginandoCanceladas";
export const ENDPOINTTotalMovimientosCajasCanceladas = "/movimientosCajas/totalMovimientosCanceladas";
export const ENDPOINTObtenerMovimientosCajas = "/movimientosCajas/obtener";
export const ENDPOINTObtenerMovimientosCajasPorCaja = "/movimientosCajas/obtenerPorCaja";
export const ENDPOINTEliminarMovimientosCajas = "/movimientosCajas/eliminar";
export const ENDPOINTActualizarMovimientosCajas = "/movimientosCajas/actualizar";
export const ENDPOINTCancelarMovimientosCajas = "/movimientosCajas/cancelar";

// Mesas
export const ENDPOINTRegistroMesas = "/mesas/registro";
export const ENDPOINTObtenerMesas = "/mesas/listar";
export const ENDPOINTOcuparDesocuparMesas = "/mesas/ocuparDesocupar";

