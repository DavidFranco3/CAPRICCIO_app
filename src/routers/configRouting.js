import { lazy, Suspense } from "react";
import LayoutAdminLTE from "../layout/adminlte/layout";

// Importaciones de paginas principales
const Dashboard = lazy(() => import("../page/Dashboard"));
const Productos = lazy(() => import("../page/Productos"));
const Categorias = lazy(() => import("../page/Categorias"));
const Error404 = lazy(() => import("../page/Error404"));
const TerminalPV = lazy(() => import("../page/TerminalPV"));
// const ModificarTerminalPV = lazy(() => import("../page/ModificarTerminalPV"));
const Usuarios = lazy(() => import("../page/Usuarios"));
const Logs = lazy(() => import("../page/Logs"));
const Ingredientes = lazy(() => import("../page/Ingredientes"));
const HistorialesNoAdmin = lazy(() =>
  import("../page/HistorialesNoAdmin/HistorialesNoAdmin")
);
const Historiales = lazy(() =>
  import("../page/Historiales")
);
const Cajas = lazy(() => import("../page/Cajas"));
const MovimientosCajas = lazy(() =>
  import("../page/Cajas/MovimientosCajas")
);
const PedidosClientes = lazy(() => import("../page/PedidosClientes"));
// const TerminalPedidos = lazy(() => import("../page/TerminalPedidos"));
const Clientes = lazy(() => import("../page/Clientes"));
const MovimientosIngredientes = lazy(() =>
  import("../page/MovimientosIngredientes")
);
const Pedidos = lazy(() => import("../page/Pedidos/Pedidos"));

// Importaciones de productos
const RegistraProductos = lazy(() =>
  import("../page/Productos/components/RegistraProductos/RegistraProductos")
);
const ModificaProductos = lazy(() =>
  import("../page/Productos/components/ModificaProductos/ModificaProductos")
);

// Layouts
// (se mantiene como import normal porque es base de la app)

// Vistas adicionales
const VistaMesas = lazy(() =>
  import("../page/Mesas/VistaMesas/VistaMesas")
);
const Historial = lazy(() =>
  import("../page/Historiales/Historial")
);
const VistaTurnos = lazy(() =>
  import("../page/Turno/Turno")
);
const Insumos = lazy(() =>
  import("../page/Insumos/Insumos")
);

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
