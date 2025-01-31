// Importaciones de paginas principales
import Dashboard from "../page/Dashboard";
import Productos from "../page/Productos";
import Categorias from "../page/Categorias";
import Error404 from "../page/Error404";
import TerminalPV from "../page/TerminalPV";
// import ModificarTerminalPV from "../page/ModificarTerminalPV";
import Usuarios from "../page/Usuarios";
import Logs from "../page/Logs";
import Ingredientes from "../page/Ingredientes";
import Historiales from "../page/Historiales";
import HistorialesNoAdmin from "../page/HistorialesNoAdmin/HistorialesNoAdmin";
import Cajas from "../page/Cajas";
import MovimientosCajas from "../page/Cajas/MovimientosCajas";
import PedidosClientes from "../page/PedidosClientes";
// import TerminalPedidos from "../page/TerminalPedidos";
import Clientes from "../page/Clientes";
import MovimientosIngredientes from "../page/MovimientosIngredientes";
import Pedidos from "../page/Pedidos/Pedidos";

// Importaciones de productos
import RegistraProductos from "../page/Productos/components/RegistraProductos/RegistraProductos";
import ModificaProductos from "../page/Productos/components/ModificaProductos/ModificaProductos";
import LayoutAdminLTE from "../layout/adminlte/layout";
import VistaMesas from "../page/Mesas/VistaMesas/VistaMesas";
import Historial from "../page/Historiales/Historial";
import VistaTurnos from "../page/Turno/Turno";
import Insumos from "../page/Insumos/Insumos";

const configRouting = [
  {
    path: "/MovimientosCajas/:caja",
    page: MovimientosCajas,
    roles: ["administrador", "vendedor"],
  },
  {
    path: "/PedidosClientes",
    page: PedidosClientes,
    roles: ["administrador", "vendedor", "cliente"],
  },
  {
    path: "/Clientes",
    page: Clientes,
    roles: ["administrador", "vendedor"],
  },
  {
    path: "/Turnos",
    page: VistaTurnos,
    roles: ["administrador", "cajero"],
  },
  // {
  //     path: "/TerminalPedidos",
  //     page: TerminalPedidos,
  //     roles: ["cliente"]
  // },
  {
    path: "/Insumos",
    page: Insumos,
    roles: ["administrador", "vendedor", "cajero"],
  },
  {
    path: "/Cajas",
    page: Cajas,
    roles: ["administrador", "vendedor"],
  },
  {
    path: "/Productos",
    page: Productos,
    roles: ["administrador"],
  },
  {
    path: "/RegistraProductos",
    page: RegistraProductos,
    roles: ["administrador"],
  },
  {
    path: "/ModificaProductos/:id",
    page: ModificaProductos,
    roles: ["administrador"],
  },
  {
    path: "/Categorias",
    page: Categorias,
    roles: ["administrador"],
  },
  {
    path: "/TerminalPV",
    page: TerminalPV,
    roles: ["administrador", "vendedor", "cajero"],
  },
  // {
  //     path: "/ModificarTerminalPV/:id",
  //     page: ModificarTerminalPV,
  //     roles: ["administrador", "vendedor", "cajero"]
  // },
  {
    path: "/Usuarios",
    page: Usuarios,
    roles: ["administrador"],
  },
  {
    path: "/Logs",
    page: Logs,
    roles: ["administrador"],
  },
  {
    path: "/Ingredientes",
    page: Ingredientes,
    roles: ["administrador"],
  },
  {
    path: "/MovimientosIngredientes/:id",
    page: MovimientosIngredientes,
    roles: ["administrador"],
  },
  {
    path: "/Historiales",
    page: Historial,
    roles: ["administrador"],
  },
  {
    path: "/Ordenes",
    page: Pedidos,
    roles: ["administrador", "vendedor", "cajero"],
  },
  {
    path: "/HistorialesNoAdmin",
    page: HistorialesNoAdmin,
    roles: ["vendedor", "cajero"],
  },
  {
    path: "/Mesas",
    page: VistaMesas,
    roles: ["administrador"],
  },
  {
    path: "*",
    page: Error404,
    roles: ["administrador", "vendedor", "cajero"],
  },
  {
    path: "/",
    page: Dashboard,
    default: true,
    roles: ["administrador", "cajero", "false"],
  },
  {
    path: "/AdminLTE",
    page: LayoutAdminLTE,
    default: false,
    roles: ["administrador", "cajero"],
  },
];

export default configRouting;
